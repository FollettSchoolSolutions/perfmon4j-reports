package org.perfmon4jreports.app.sso.github;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

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
import org.perfmon4jreports.app.sso.Group;
import org.perfmon4jreports.app.sso.Principal;
import org.perfmon4jreports.app.sso.SSOConfig;
import org.perfmon4jreports.app.sso.SSODomain;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@WebServlet("/callback/sso/github")
class GitHubSSOCallback extends HttpServlet {
	private static final Logger logger = LoggerFactory.getLogger(GitHubSSOCallback.class);
	private static final String SESSION_STATE_KEY = GitHubSSOCallback.class.getName() + "SESSION_STATE_KEY";
	private static final long serialVersionUID = 1L;
	private static SSOConfig config = new SSOConfig();
	private final SecureRandom random = new SecureRandom();
	private AtomicLong requestID = new AtomicLong(System.currentTimeMillis());  // Create a trackingID that is unique, and easy to grep in the log. 
	
    public GitHubSSOCallback() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		if (request.getParameter("launch") != null) {
			UriBuilder uriBuilder = UriBuilder.fromUri(config.getGitHubOauthAPIPath() + "/authorize")
				.queryParam("client_id", config.getGitHubClientID())
				.queryParam("state", generateAndSetSessionState(request))
				.queryParam("redirect_uri", config.getRootClientPath() + "/callback/sso/github")
				.queryParam("scope", "user:email,read:org");

			String url =  uriBuilder.build().toString();
			logger.info("Sending Redirect to GitHub: " + url);
			response.sendRedirect(url);
		} else if (request.getParameter("code") != null && request.getParameter("state") != null){
			// Looks like a gitHubResponse...
			handleSingleSignonResponse(request, response);
		} else {
			throw new ServletException("Unknown request - expected parameters do not exist");
		}
	}

	 private <T> T invokeGitHubAPI(String trackingID, String url, Map<String, String> parameters, Class<T> valueType) throws ServletException {
		 return invokeGitHubAPI(trackingID, url, parameters, valueType, null);
	 }

	 private <T> T invokeGitHubAPI(String trackingID, String url, Map<String, String> parameters, Class<T> valueType, GitHubAccessToken accessToken) throws ServletException {
		 	T result = null;
		 	UriBuilder uriBuilder = UriBuilder.fromUri(url); 
		 	
			if (parameters != null) {
				for (Map.Entry<String, String> e : parameters.entrySet()) {
					uriBuilder.queryParam(e.getKey(), e.getValue());
				}
			}
			url = uriBuilder.build().toString();
			
			Client client = ClientBuilder.newClient();
			Invocation.Builder invocationBuilder = client.target(url)
				.request(MediaType.APPLICATION_JSON)
				.header("User-Agent", "reports.perfmon4j.org");
			
			if (accessToken != null) {
				invocationBuilder.header("Authorization", "token " + accessToken.getAccess_token());
			}
			Response response = invocationBuilder.get();
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

			//  Now use our code to retrieve an API access token.
			Map<String, String> parameters = new HashMap<String, String>();
			parameters.put("client_id", config.getGitHubClientID());
			parameters.put("client_secret", config.getGitHubClientSecret());
			parameters.put("code", code);
			parameters.put("state",state);
			parameters.put("redirect_uri", config.getRootClientPath() + "/callback/sso/github");
			GitHubAccessToken token = invokeGitHubAPI(trackingID, config.getGitHubOauthAPIPath() + "/access_token", parameters, GitHubAccessToken.class);
			
			// Now use our access token to retrieve the logged in GitHub user.
			GitHubUser currentUser = invokeGitHubAPI(trackingID, config.getGitHubAPIPath() + "/user", null, GitHubUser.class, token);
			
			// Now attempt to retrieve the primary email address for the GitHub user.
			String emailAddress = null;
			GitHubUserEmail emails[] = invokeGitHubAPI(trackingID, config.getGitHubAPIPath() + "/user/emails", null, GitHubUserEmail[].class, token);
			GitHubUserEmail primaryEmail = GitHubUserEmail.getPrimary(emails);
			if (primaryEmail != null) {
				emailAddress = primaryEmail.getEmail();
			}
			
			// Now attempt to retrieve the Organization (Groups) this user belongs to.
			List<Group> groups = new ArrayList<>();
			GitHubOrganization orgs[] = invokeGitHubAPI(trackingID, config.getGitHubAPIPath() + "/user/orgs", null, GitHubOrganization[].class, token);
			for (GitHubOrganization org : orgs) {
				groups.add(new Group(SSODomain.GITHUB, org.getLogin(), org.getId()));
			}

			// Since we have succeeded we can now attach our Principal to the HttpSession and forward back to the RETURN PATH 
			Principal principal = new Principal(SSODomain.GITHUB, currentUser.getLogin(), currentUser.getName(), currentUser.getId(), emailAddress, groups.toArray(new Group[]{}));
			Principal.addPrincipal(request.getSession(true), principal);
			// Finally return the user to the login page.
			response.sendRedirect(SSOConfig.LOGIN_RETURN_PATH);
		} catch (Exception ex) {
			// If something failed, return a generic error message to the user
			// Since this message contains the tracking ID the detailed exception will be visible in the log.
			Principal.removePrincipal(request.getSession());
			String message = "Error procesing login request: " + trackingID;
			logger.error(message, ex);

			// Finally return the user to the login page.
			String returnURL = UriBuilder.fromUri(SSOConfig.LOGIN_RETURN_PATH)
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
	
	private String getSessionState(HttpServletRequest request) {
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
}
