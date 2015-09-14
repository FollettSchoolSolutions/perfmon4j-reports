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

import java.io.IOException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

import javax.ejb.EJB;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;

import org.codehaus.jackson.map.ObjectMapper;
import org.perfmon4jreports.app.service.UsersService;
import org.perfmon4jreports.app.sso.Group;
import org.perfmon4jreports.app.sso.Principal;
import org.perfmon4jreports.app.sso.SSOConfig;
import org.perfmon4jreports.app.sso.SSODomain;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
					//authentication
@WebServlet(value="/callback/sso")
class GitHubSSOServlet extends HttpServlet {
	private static final Logger logger = LoggerFactory.getLogger(GitHubSSOServlet.class);
	static final String SESSION_STATE_KEY = GitHubSSOServlet.class.getName() + "SESSION_STATE_KEY";
	private static final long serialVersionUID = 1L;
	private static SSOConfig config = new SSOConfig();
	
	@EJB
	private UsersService usersService;
	
	private final SecureRandom random = new SecureRandom();
	private AtomicLong requestID = new AtomicLong(System.currentTimeMillis());  // Create a trackingID that is unique, and easy to grep in the log.
	private static TrustManager[] easySSLModeTrust = new TrustManager[] {new X509TrustManager() {
		
		@Override
		public X509Certificate[] getAcceptedIssuers() {
			return null;
		}
		
		@Override
		public void checkServerTrusted(X509Certificate[] chain, String authType)
				throws CertificateException {
		}
		
		@Override
		public void checkClientTrusted(X509Certificate[] chain, String authType)
				throws CertificateException {
		}
	}};
	
    public GitHubSSOServlet() {
        super();
    }

    /**
     * Package level for unit testing only
     */
    GitHubSSOServlet(UsersService usersService) {
        super();
        this.usersService = usersService;
    }
    
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		if (request.getParameter("launch") != null) {
			UriBuilder uriBuilder = UriBuilder.fromUri(config.getGitHubOauthAPIPath() + "/authorize")
				.queryParam("client_id", config.getGitHubClientID())
				.queryParam("state", generateAndSetSessionState(request))
				.queryParam("redirect_uri", config.getRootClientPath() + "/callback/sso")
				.queryParam("scope", "user:email,read:org");
				///reports/authentication
			String url =  uriBuilder.build().toString();
			logger.info("Sending Redirect to GitHub: " + url);
			response.sendRedirect(url);
		} else if (request.getParameter("code") != null && request.getParameter("state") != null){
			// Looks like a gitHubResponse...
			handleSingleSignonResponse(request, response);
		} else if(request.getParameter("logout") != null){ 
			usersService.logout(request.getSession());
			response.sendRedirect("/reports");
		}else {
			throw new ServletException("Unknown request - expected parameters do not exist");
		}
	}
	
//	protected void doDelete(HttpServletRequest request, HttpServletResponse response) {
//		users.Logout();
//	}

	 private <T> T invokeGitHubAPI(Client client, String trackingID, String url, Map<String, String> parameters, 
			 Class<T> valueType) throws ServletException {
		 return invokeGitHubAPI(client, trackingID, url, parameters, valueType, null);
	 }

	 private <T> T invokeGitHubAPI(Client client, String trackingID, String url, Map<String, String> parameters, Class<T> valueType, 
			 GitHubAccessToken accessToken) throws ServletException {
	 	T result = null;
	 	UriBuilder uriBuilder = UriBuilder.fromUri(url); 
	 	
		if (parameters != null) {
			for (Map.Entry<String, String> e : parameters.entrySet()) {
				uriBuilder.queryParam(e.getKey(), e.getValue());
			}
		}
		url = uriBuilder.build().toString();

		InvocationParameters params = new InvocationParameters(url, MediaType.APPLICATION_JSON);
		params.getHeaders().put("User-Agent", "reports.perfmon4j.org");
		
		if (accessToken != null) {
			params.getHeaders().put("Authorization", "token " + accessToken.getAccess_token());
		}
		Response response = doGet(client, params);
		String entityString = response.readEntity(String.class);
		String debugString = buildDebugString(trackingID, url, response, entityString);
		
		if (response.getStatus() != 200) {
			throw new ServletException("Error from GitHub API request:\r\n" + debugString);
		}
		
		try {
			ObjectMapper mapper = new ObjectMapper();
			result = mapper.readValue(entityString, valueType);
		} catch (IOException e) {
			throw new ServletException("Error Mapping object from GitHub request:\r\n" + debugString, e);
		}

		logger.debug(debugString);
		
		return result;
	 }
	 
	 Response doGet(Client client, InvocationParameters params) {
		 Invocation.Builder invocationBuilder = client.target(params.getUrl())
				 .request(params.getMediaType());
		 
		 for (Map.Entry<String, String> entry : params.getHeaders().entrySet()) {
			 invocationBuilder.header(entry.getKey(), entry.getValue());
		 }
		 
		 return invocationBuilder.get();
	 }
	
	private void handleSingleSignonResponse(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String code = request.getParameter("code");
		String state = request.getParameter("state");

		String trackingID = Long.toHexString(requestID.getAndAdd(1)).toUpperCase();
		try {
			// First validate that the "state" we received from GitHub matches the state value we sent.
			// If this is not the case it might mean someone was trying to hack us.
			String expectedState = getSessionState(request);
			if (!state.equals(expectedState)) {
				throw new ServletException("State parameter does not match what we sent - Expected(" + expectedState + ") State(" + state + ")");
			}
			
			ClientBuilder builder = ClientBuilder.newBuilder();
			if (config.isGitHubEasySSLMode()) {
				logger.debug("Connecting to GitHub in SSL Easy mode");
				SSLContext sslContext = SSLContext.getInstance("TLS");
				sslContext.init(null, easySSLModeTrust, new SecureRandom());
				builder.sslContext(sslContext);
			}

			Client client = builder.build();
			
			//  Now use our code to retrieve an API access token.
			Map<String, String> parameters = new HashMap<String, String>();
			parameters.put("client_id", config.getGitHubClientID());
			parameters.put("client_secret", config.getGitHubClientSecret());
			parameters.put("code", code);
			parameters.put("state",state);
			parameters.put("redirect_uri", config.getRootClientPath() + "/callback/sso"); 
			GitHubAccessToken token = invokeGitHubAPI(client, trackingID, config.getGitHubOauthAPIPath() + "/access_token", parameters, GitHubAccessToken.class);
			
			// Now use our access token to retrieve the logged in GitHub user.
			GitHubUser currentUser = invokeGitHubAPI(client, trackingID, config.getGitHubAPIPath() + "/user", null, GitHubUser.class, token);
			
			// Now attempt to retrieve the primary email address for the GitHub user.
			String emailAddress = null;
			GitHubUserEmail emails[] = invokeGitHubAPI(client, trackingID, config.getGitHubAPIPath() + "/user/emails", null, GitHubUserEmail[].class, token);
			GitHubUserEmail primaryEmail = GitHubUserEmail.getPrimary(emails);
			if (primaryEmail != null) {
				emailAddress = primaryEmail.getEmail();
			}
			
			// Now attempt to retrieve the Organization (Groups) this user belongs to.
			List<Group> groups = new ArrayList<>();
			GitHubOrganization orgs[] = invokeGitHubAPI(client, trackingID, config.getGitHubAPIPath() + "/user/orgs", null, GitHubOrganization[].class, token);
			for (GitHubOrganization org : orgs) {
				groups.add(new Group(SSODomain.GITHUB, org.getLogin(), org.getId()));
			}

			// Since we have succeeded we can now attach our Principal to the HttpSession and forward back to the RETURN PATH 
			Principal principal = new Principal(SSODomain.GITHUB, currentUser.getLogin(), currentUser.getName(), currentUser.getId(), emailAddress, groups.toArray(new Group[]{}));
			usersService.login(request.getSession(true), principal);

			// Finally return the user to the login page.
			response.sendRedirect(config.getRootClientPath());
		} catch (Exception ex) {
			// If something failed, return a generic error message to the user
			// Since this message contains the tracking ID the detailed exception will be visible in the log.
			usersService.logout(request.getSession());;
			String message = "Error procesing login request: " + trackingID;
			logger.error(message, ex);

			// Finally return the user to the login page.
			String returnURL = UriBuilder.fromUri(config.getRootClientPath())
				.queryParam(SSOConfig.LOGIN_ERROR_QUERY_PARAM, message)
				.build().toString();
			
			response.sendRedirect(returnURL);
		}
	}
	
	static public SSOConfig setSSOConfig(SSOConfig newConfig) {
		SSOConfig old = config;
		
		config = newConfig;
		
		return old;
	}
	
	private String generateAndSetSessionState(HttpServletRequest request) {
		String value = Long.toHexString(random.nextLong());

		request.getSession(true).setAttribute(SESSION_STATE_KEY, value);
		
		return value;
	}
	
	private String getSessionState(HttpServletRequest request) throws InterruptedException {
		String result = null;
		HttpSession session = request.getSession();
		if (session != null) {
			result = (String)session.getAttribute(SESSION_STATE_KEY);
		}
		return result;
	}
	
	/**
	 * Just to limit exposure of the applications GitHubClient secret, don't write it to the log file.
	 * @param url
	 * @return
	 */
	private String maskGitHubClientSecretForLog(String url) {
		return url.replaceFirst(config.getGitHubClientSecret(), "*******");
	}
	
	private String buildDebugString(String trackingID, String url, Response response, String entityString) {
		String message = "TrackingID(" + trackingID + ") GitHub API Request\r\n"
			+ "URL: " + maskGitHubClientSecretForLog(url) + "\r\n"
			+ "Status: " + response.getStatus() + "\r\n"
			+ "Headers: " + response.getHeaders() + "\r\n"
			+ "Entity: " + entityString;
		return message;
	}
	
	
	static class InvocationParameters {
		private final String url;
		private final String mediaType;
		private final Map<String, String> headers = new HashMap<String, String>();
		
		InvocationParameters(String url, String mediaType) {
			this.url = url;
			this.mediaType = mediaType;
		}

		public String getUrl() {
			return url;
		}

		public String getMediaType() {
			return mediaType;
		}

		public Map<String, String> getHeaders() {
			return headers;
		}
	}
	
	
	
}
