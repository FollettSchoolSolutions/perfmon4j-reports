/*
 *	Copyright 2015 Follett School Solutions, Inc 
 *
 *	This file is part of PerfMon4j-reports
 *
 * 	Perfmon4j is free software: you can redistribute it and/or modify
 * 	it under the terms of the GNU Lesser General Public License, version 3,
 * 	as published by the Free Software Foundation.  This program is distributed
 * 	WITHOUT ANY WARRANTY OF ANY KIND, WITHOUT AN IMPLIED WARRANTY OF MERCHANTIBILITY,
 * 	OR FITNESS FOR A PARTICULAR PURPOSE.  You should have received a copy of the GNU Lesser General Public 
 * 	License, Version 3, along with this program.  If not, you can obtain the LGPL v.s at 
 * 	http://www.gnu.org/licenses/
 * 	
 * 	perfmon4j@fsc.follett.com
 * 	Follett School Solutions
 * 	1391 Corporate Drive
 * 	McHenry, IL 60050
 * 
*/

package org.perfmon4jreports.app.sso.github;

import java.net.URL;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.client.Client;
import javax.ws.rs.core.Response;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.ArgumentMatcher;
import org.mockito.Mockito;
import org.perfmon4jreports.app.sso.Group;
import org.perfmon4jreports.app.sso.Principal;
import org.perfmon4jreports.app.sso.SSOConfig;
import org.perfmon4jreports.app.sso.SSODomain;
import org.perfmon4jreports.app.sso.github.GitHubSSOServlet.InvocationParameters;

public class GitHubSSOServletTest extends Assert {
	private SSOConfig restoreConfig;
	private GitHubSSOServlet servlet;
	private HttpServletRequest request;
	private HttpServletResponse response;
	private HttpSession session;
	
	private static final String ACCESS_TOKEN_RESPONSE_BODY = "{\"access_token\":\"35f2840e2ad150017d1a3cbc188ae4a6b474917e\","
			+ "\"token_type\":\"bearer\",\"scope\":\"read:org,user:email\"}";
	private static final InvocationArgumentMatcher ACCESS_TOKEN_MATCHER = new InvocationArgumentMatcher("/access_token"); 

	private static final String USER_RESPONSE_BODY = 
			"{\"login\":\"ddave\",\"id\":609999,\"avatar_url\":\"https://avatars.githubusercontent.com/u/609999?v=3\",\"gravatar_id\":\"\","
			+ "\"url\":\"https://api.github.com/users/ddave\",\"html_url\":\"https://github.com/ddave\","
			+ "\"followers_url\":\"https://api.github.com/users/ddave/followers\",\"following_url\":\"https://api.github.com/users/ddave/following{/other_user}\","
			+ "\"gists_url\":\"https://api.github.com/users/ddave/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/ddave/starred{/owner}{/repo}\","
			+ "\"subscriptions_url\":\"https://api.github.com/users/ddave/subscriptions\",\"organizations_url\":\"https://api.github.com/users/ddave/orgs\","
			+ "\"repos_url\":\"https://api.github.com/users/ddave/repos\",\"events_url\":\"https://api.github.com/users/ddave/events{/privacy}\","
			+ "\"received_events_url\":\"https://api.github.com/users/ddave/received_events\",\"type\":\"User\",\"site_admin\":false,\"name\":\"dave\","
			+ "\"company\":\"FSS\",\"blog\":\"\",\"location\":\"McHenry, IL USA\",\"email\":\"\",\"hireable\":false,\"bio\":null,\"public_repos\":0,"
			+ "\"public_gists\":0,\"followers\":0,\"following\":0,\"created_at\":\"2013-11-26T03:01:21Z\",\"updated_at\":\"2015-07-27T18:31:28Z\"}";
	private static final InvocationArgumentMatcher USER_MATCHER = new InvocationArgumentMatcher("/user"); 

	private static final String EMAILS_RESPONSE_BODY = "[{\"email\":\"user@email.com\",\"primary\":true,\"verified\":true}]";
	private static final InvocationArgumentMatcher EMAILS_MATCHER = new InvocationArgumentMatcher("/emails"); 

	private static final String ORGS_RESPONSE_BODY = "[{\"login\":\"FSS\",\"id\":619999,\"url\":\"https://api.github.com/orgs/FSS\","
			+ "\"repos_url\":\"https://api.github.com/orgs/FSS/repos\",\"events_url\":\"https://api.github.com/orgs/FSS/events\","
			+ "\"members_url\":\"https://api.github.com/orgs/FSS/members{/member}\",\"public_members_url\":\"https://api.github.com/orgs/FSS/public_members{/member}\","
			+ "\"avatar_url\":\"https://avatars.githubusercontent.com/u/619999?v=3\",\"description\":null}]";
	private static final InvocationArgumentMatcher ORGS_MATCHER = new InvocationArgumentMatcher("/orgs"); 

	public GitHubSSOServletTest() {
	}
	
	@Before
	public void setUp() throws Exception {
		SSOConfig testConfig = new SSOConfig();
		testConfig.setGitHubClientID("myClientID");
		testConfig.setGitHubClientSecret("myClientSecret");
		
		restoreConfig = GitHubSSOServlet.setSSOConfig(testConfig);
		
		servlet = Mockito.spy(new GitHubSSOServlet());
		request = Mockito.mock(HttpServletRequest.class);
		response = Mockito.mock(HttpServletResponse.class);
		session = Mockito.mock(HttpSession.class);
		Mockito.when(request.getSession(true)).thenReturn(session);
		Mockito.when(request.getSession()).thenReturn(session);
		
		Mockito.doReturn(buildMockResponse(200, ACCESS_TOKEN_RESPONSE_BODY)).when(servlet).doGet(Mockito.any(Client.class), 
				Mockito.argThat(ACCESS_TOKEN_MATCHER));
		Mockito.doReturn(buildMockResponse(200, USER_RESPONSE_BODY)).when(servlet).doGet(Mockito.any(Client.class), 
				Mockito.argThat(USER_MATCHER));
		Mockito.doReturn(buildMockResponse(200, EMAILS_RESPONSE_BODY)).when(servlet).doGet(Mockito.any(Client.class), 
				Mockito.argThat(EMAILS_MATCHER));
		Mockito.doReturn(buildMockResponse(200, ORGS_RESPONSE_BODY)).when(servlet).doGet(Mockito.any(Client.class), 
				Mockito.argThat(ORGS_MATCHER));
	}

	@After
	public void tearDown() throws Exception {
		GitHubSSOServlet.setSSOConfig(restoreConfig);
	}

	@Test
	public void testLaunchRedirectsToGitHub() throws Exception {
		Mockito.when(request.getParameter("launch")).thenReturn("true");
		
		servlet.doGet(request, response);

		ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.verify(response).sendRedirect(urlCaptor.capture());

		URL url = new URL(urlCaptor.getValue());
		
		assertEquals("Protocol", "https", url.getProtocol());
		assertEquals("Host", "github.com", url.getHost());
		assertEquals("Authorize path", "/login/oauth/authorize", url.getPath());
	}

	@Test
	public void testLaunchGeneratesRandomState() throws Exception {
		ArgumentCaptor<String> stateCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.when(request.getParameter("launch")).thenReturn("true");
		
		servlet.doGet(request, response);

		Mockito.verify(session).setAttribute(Mockito.matches(GitHubSSOServlet.SESSION_STATE_KEY), stateCaptor.capture());
		String stateFirstCall = stateCaptor.getValue();
	
		Mockito.reset(session);
		servlet.doGet(request, response);

		Mockito.verify(session).setAttribute(Mockito.matches(GitHubSSOServlet.SESSION_STATE_KEY), stateCaptor.capture());
		String stateSecondCall = stateCaptor.getValue();

		assertNotEquals("Should generate different state on each call", stateFirstCall, stateSecondCall);
	}
	
	@Test
	public void testLaunchQueryParams() throws Exception {
		ArgumentCaptor<String> stateCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.when(request.getParameter("launch")).thenReturn("true");
		
		servlet.doGet(request, response);

		Mockito.verify(session).setAttribute(Mockito.matches(GitHubSSOServlet.SESSION_STATE_KEY), stateCaptor.capture());
		String stateOnSession = stateCaptor.getValue();

		ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.verify(response).sendRedirect(urlCaptor.capture());

		URL url = new URL(urlCaptor.getValue());
		
		Map<String, String> params = getParameters(url);
		
		assertEquals("client_id", "myClientID", params.get("client_id"));
		assertEquals("state", stateOnSession, params.get("state"));
		assertEquals("redirect_uri", "http://test.perfmon4j.org:8080/reports/callback/sso/github", params.get("redirect_uri"));
		assertEquals("scope", "user:email,read:org", params.get("scope"));
	}

	@Test
	public void testServletExceptionWithNoParams() throws Exception {
		try {
			servlet.doGet(request, response);
			fail("Expected a servlet exception if invoked with no parameters");
		} catch (ServletException ex) {
			// expected...
		}
	}

	@Test
	public void testNonMatchingState() throws Exception {
		Mockito.when(request.getParameter("code")).thenReturn("MyCode");
		Mockito.when(request.getParameter("state")).thenReturn("MyState");
		Mockito.when(session.getAttribute(Mockito.matches(GitHubSSOServlet.SESSION_STATE_KEY))).thenReturn("ADifferentState");
		
		servlet.doGet(request, response);
		ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.verify(response).sendRedirect(urlCaptor.capture());

		URL url = new URL("http://fakehost/" + urlCaptor.getValue());
		Map<String, String> parameters = getParameters(url);
		
		assertNotNull("URL should contain an error message", parameters.get(SSOConfig.LOGIN_ERROR_QUERY_PARAM));
	}
	
	@Test
	public void testSuccess() throws Exception {
		Mockito.when(request.getParameter("code")).thenReturn("MyCode");
		Mockito.when(request.getParameter("state")).thenReturn("MyState");
		Mockito.when(session.getAttribute(Mockito.matches(GitHubSSOServlet.SESSION_STATE_KEY))).thenReturn("MyState");
		
		servlet.doGet(request, response);
		
		ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.verify(response).sendRedirect(urlCaptor.capture());

		URL url = new URL("http://fakehost/" + urlCaptor.getValue());
		Map<String, String> parameters = getParameters(url);
		
		assertNull("URL should NOT contain an error message", parameters.get(SSOConfig.LOGIN_ERROR_QUERY_PARAM));
		
		ArgumentCaptor<Principal> principalCaptor = ArgumentCaptor.forClass(Principal.class);
		Mockito.verify(session).setAttribute(Mockito.eq(Principal.PRINCIPAL_SESSION_KEY), principalCaptor.capture());

		Principal p = principalCaptor.getValue();
		
		assertEquals("userName", "ddave", p.getUserName());
		assertEquals("name", "dave", p.getName());
		assertEquals("email", "user@email.com", p.getEmailAddress());
		assertEquals("globalID", "GITHUB:609999", p.getGlobalID());
		assertEquals("domain", SSODomain.GITHUB.getName(), p.getDomain().getName());
	
		Group[] groups = p.getGroups();
		assertEquals("Number of groups", 1, groups.length);
		assertEquals("group name", "FSS", groups[0].getName());
		assertEquals("group global ID", "GITHUB:619999", groups[0].getGlobalID());
		assertEquals("group domain", SSODomain.GITHUB.getName(), groups[0].getDomain().getName());
	}
	
	@Test
	public void testFailureGettingAccessToken() throws Exception {
		Mockito.when(request.getParameter("code")).thenReturn("MyCode");
		Mockito.when(request.getParameter("state")).thenReturn("MyState");
		Mockito.when(session.getAttribute(Mockito.matches(GitHubSSOServlet.SESSION_STATE_KEY))).thenReturn("MyState");
		Mockito.doReturn(buildMockResponse(401, ACCESS_TOKEN_RESPONSE_BODY)).when(servlet).doGet(Mockito.any(Client.class), 
				Mockito.argThat(ACCESS_TOKEN_MATCHER));
		
		servlet.doGet(request, response);
		ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.verify(response).sendRedirect(urlCaptor.capture());

		URL url = new URL("http://fakehost/" + urlCaptor.getValue());
		Map<String, String> parameters = getParameters(url);
		
		assertNotNull("URL should contain an error message", parameters.get(SSOConfig.LOGIN_ERROR_QUERY_PARAM));
	}	

	@Test
	public void testFailureGettingUser() throws Exception {
		Mockito.when(request.getParameter("code")).thenReturn("MyCode");
		Mockito.when(request.getParameter("state")).thenReturn("MyState");
		Mockito.when(session.getAttribute(Mockito.matches(GitHubSSOServlet.SESSION_STATE_KEY))).thenReturn("MyState");
		Mockito.doReturn(buildMockResponse(401, USER_RESPONSE_BODY)).when(servlet).doGet(Mockito.any(Client.class), 
				Mockito.argThat(USER_MATCHER));
		
		servlet.doGet(request, response);
		ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.verify(response).sendRedirect(urlCaptor.capture());

		URL url = new URL("http://fakehost/" + urlCaptor.getValue());
		Map<String, String> parameters = getParameters(url);
		
		assertNotNull("URL should contain an error message", parameters.get(SSOConfig.LOGIN_ERROR_QUERY_PARAM));
	}	
	
	@Test
	public void testFailureGettingEmailAddress() throws Exception {
		Mockito.when(request.getParameter("code")).thenReturn("MyCode");
		Mockito.when(request.getParameter("state")).thenReturn("MyState");
		Mockito.when(session.getAttribute(Mockito.matches(GitHubSSOServlet.SESSION_STATE_KEY))).thenReturn("MyState");
		Mockito.doReturn(buildMockResponse(401, EMAILS_RESPONSE_BODY)).when(servlet).doGet(Mockito.any(Client.class), 
				Mockito.argThat(EMAILS_MATCHER));
		
		servlet.doGet(request, response);
		ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.verify(response).sendRedirect(urlCaptor.capture());

		URL url = new URL("http://fakehost/" + urlCaptor.getValue());
		Map<String, String> parameters = getParameters(url);
		
		assertNotNull("URL should contain an error message", parameters.get(SSOConfig.LOGIN_ERROR_QUERY_PARAM));
	}	

	@Test
	public void testFailureGettingOrganizations() throws Exception {
		Mockito.when(request.getParameter("code")).thenReturn("MyCode");
		Mockito.when(request.getParameter("state")).thenReturn("MyState");
		Mockito.when(session.getAttribute(Mockito.matches(GitHubSSOServlet.SESSION_STATE_KEY))).thenReturn("MyState");
		Mockito.doReturn(buildMockResponse(401, ORGS_RESPONSE_BODY)).when(servlet).doGet(Mockito.any(Client.class), 
				Mockito.argThat(ORGS_MATCHER));
		
		servlet.doGet(request, response);
		ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
		Mockito.verify(response).sendRedirect(urlCaptor.capture());

		URL url = new URL("http://fakehost/" + urlCaptor.getValue());
		Map<String, String> parameters = getParameters(url);
		
		assertNotNull("URL should contain an error message", parameters.get(SSOConfig.LOGIN_ERROR_QUERY_PARAM));
	}	
	
	/** 
	 * This is not a full featured method, but it is enough for this test.
	 * @param url
	 * @return
	 * @throws Exception
	 */
	private Map<String, String> getParameters(URL url) throws Exception {
		Map<String, String> result = new HashMap<String, String>();
		
		String query = url.getQuery();
		if (query != null && !query.isEmpty()) {
			String params[] = query.split("&");
			for (String p : params) {
				String parts[] = p.split("=");
				
				result.put(parts[0], URLDecoder.decode(parts[1], "UTF-8"));
			}
		}
		return result;
	}

	private Response buildMockResponse(int responseCode, String entityBody) {
		Response result = Mockito.mock(Response.class);
		
		Mockito.when(result.getStatus()).thenReturn(Integer.valueOf(responseCode));
		Mockito.when(result.readEntity(String.class)).thenReturn(entityBody);
		
		return result;
	}
	
	private static class InvocationArgumentMatcher extends ArgumentMatcher<InvocationParameters> {
		private final String urlContains;
		
		public InvocationArgumentMatcher(String urlContains) {
			super();
			this.urlContains = urlContains;
		}

		@Override
		public boolean matches(Object argument) {
			InvocationParameters parameters = (InvocationParameters)argument;
			return parameters.getUrl().contains(urlContains);
		}
	}
}
