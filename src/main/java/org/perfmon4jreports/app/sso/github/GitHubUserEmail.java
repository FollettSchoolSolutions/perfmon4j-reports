package org.perfmon4jreports.app.sso.github;

class GitHubUserEmail {
	private String email;
	private boolean verified;
	private boolean primary;

	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public boolean isVerified() {
		return verified;
	}
	public void setVerified(boolean verified) {
		this.verified = verified;
	}
	public boolean isPrimary() {
		return primary;
	}
	public void setPrimary(boolean primary) {
		this.primary = primary;
	}
	
	public static GitHubUserEmail getPrimary(GitHubUserEmail emails[]) {
		GitHubUserEmail result = null;
		
		if (emails != null) {
			for (GitHubUserEmail e : emails) {
				if (e.isPrimary()) {
					result = e;
					break;
				}
			}
		}
		return result;
	}
}
