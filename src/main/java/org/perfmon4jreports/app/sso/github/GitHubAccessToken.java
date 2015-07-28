package org.perfmon4jreports.app.sso.github;

class GitHubAccessToken {
	private String token_type;
	private String scope;
	private String access_token;
	
	public String getToken_type() {
		return token_type;
	}
	public void setToken_type(String token_type) {
		this.token_type = token_type;
	}
	public String getScope() {
		return scope;
	}
	public void setScope(String scope) {
		this.scope = scope;
	}
	public String getAccess_token() {
		return access_token;
	}
	public void setAccess_token(String access_token) {
		this.access_token = access_token;
	}

	@Override
	public String toString() {
		return "GitHubAccessToken [token_type=" + token_type + ", scope="
				+ scope + ", access_token=" + access_token + "]";
	}
}
