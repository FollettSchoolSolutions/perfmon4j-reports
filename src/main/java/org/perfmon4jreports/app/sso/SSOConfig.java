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

package org.perfmon4jreports.app.sso;


public class SSOConfig {
	/** You can set these variable in the System environment, or as a system property in the JVM **/
	private static final String ROOT_CLIENT_PATH_KEY = "SSOConfig_RootClientPath"; 
	private static final String GITHUB_CLIENT_ID_KEY = "SSOConfig_GitHubClientID"; 
	private static final String GITHUB_CLIENT_SECRET_KEY = "SSOConfig_GitHubClientSecret"; 
	private static final String GITHUB_OAUTH_API_PATH_KEY = "SSOConfig_GitHubOauthAPIPathKey"; 
	private static final String GITHUB_API_PATH_KEY = "SSOConfig_GitHubAPIPathKey"; 
	
	private String rootClientPath;
	private String gitHubClientID;
	private String gitHubClientSecret;
	private String gitHubOauthAPIPath;
	private String gitHubAPIPath;
	
	public static final String LOGIN_RETURN_PATH = "../../login.jsp"; 
	public static final String LOGIN_ERROR_QUERY_PARAM = "loginError";

	public SSOConfig() {
		rootClientPath = getProperty(ROOT_CLIENT_PATH_KEY, "http://test.perfmon4j.org:8080/reports");
		gitHubClientID = getProperty(GITHUB_CLIENT_ID_KEY);
		gitHubClientSecret = getProperty(GITHUB_CLIENT_SECRET_KEY);
		gitHubOauthAPIPath = getProperty(GITHUB_OAUTH_API_PATH_KEY, "https://github.com/login/oauth");
		gitHubAPIPath = getProperty(GITHUB_API_PATH_KEY, "https://api.github.com");
	}
	
	static private String getProperty(String key) {
		return getProperty(key, null);
	}
	
	static private String getProperty(String key,  String defaultValue) {
		String result = null;
		
		result = System.getProperty(key);
		if (result == null) {
			result = System.getenv(key);
		}
		
		return result == null ? defaultValue : result;
	}

	public String getRootClientPath() {
		return rootClientPath;
	}

	public void setRootClientPath(String rootClientPath) {
		this.rootClientPath = rootClientPath;
	}

	public String getGitHubClientID() {
		return gitHubClientID;
	}

	public void setGitHubClientID(String gitHubClientID) {
		this.gitHubClientID = gitHubClientID;
	}

	public String getGitHubClientSecret() {
		return gitHubClientSecret;
	}

	public void setGitHubClientSecret(String gitHubClientSecret) {
		this.gitHubClientSecret = gitHubClientSecret;
	}

	public String getGitHubOauthAPIPath() {
		return gitHubOauthAPIPath;
	}

	public void setGitHubOauthAPIPath(String gitHubOauthAPIPath) {
		this.gitHubOauthAPIPath = gitHubOauthAPIPath;
	}

	public String getGitHubAPIPath() {
		return gitHubAPIPath;
	}

	public void setGitHubAPIPath(String gitHubAPIPath) {
		this.gitHubAPIPath = gitHubAPIPath;
	}
}
