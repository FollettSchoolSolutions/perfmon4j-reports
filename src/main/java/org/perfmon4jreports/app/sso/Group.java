package org.perfmon4jreports.app.sso;

public class Group {
	private final SSODomain domain;
	private final String name;
	private final String globalID;
	private final String description;
	
	public Group(SSODomain domain, String name, String localID) {
		this(domain, name, localID, "");
	}	

	public Group(SSODomain domain, String name, String localID, String description) {
		this.domain = domain;
		this.name = name;
		this.globalID = domain.buildGlobalID(localID);
		this.description = description == null ? "" : description;
	}

	public SSODomain getDomain() {
		return domain;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public String getGlobalID() {
		return globalID;
	}
}
