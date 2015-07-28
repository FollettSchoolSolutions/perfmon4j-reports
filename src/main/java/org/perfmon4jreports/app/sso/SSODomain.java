package org.perfmon4jreports.app.sso;

public enum SSODomain {
	GITHUB("GitHub", "GITHUB", "https://github.com");
	
	private final String name;
	private final String prefix;
	private final String url;

	private SSODomain(String name, String prefix, String url) {
		this.name = name;
		this.prefix = prefix;
		this.url = url;
	}
	
	static public SSODomain getDomain(String userID) {
		if (userID != null && userID.startsWith(GITHUB.prefix + ":")) {
			return GITHUB;
		}  else {
			throw new RuntimeException("Unable to get domain for ID: " + userID);
		}
	}
	
	
	String buildGlobalID(String localID) {
		return prefix + ":" + localID;
	}

	public String getName() {
		return name;
	}

	public String getPrefix() {
		return prefix;
	}

	public String getUrl() {
		return url;
	}

	public String toString() {
		return name + "(" + url + ")";
	}
}
