package org.perfmon4jreports.app.sso;

import javax.servlet.http.HttpSession;

public class Principal {
	public static final String PRINCIPAL_SESSION_KEY = Principal.class.getName() + ".SESSION_KEY";
	private final SSODomain domain;
	private final String userName;
	private final String name;
	private final String globalID;
	private final String emailAddress;
	private final Group[] groups;
	
	public Principal(SSODomain domain, String userName, String name, String localID, String emailAddress, Group[] groups) {
		this.domain = domain;
		this.userName = userName;
		this.name = name;
		this.globalID = domain.buildGlobalID(localID);
		this.emailAddress = emailAddress;
		this.groups = groups == null ? new Group[]{} : groups;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public SSODomain getDomain() {
		return domain;
	}

	public String getUserName() {
		return userName;
	}

	public String getGlobalID() {
		return globalID;
	}
	
	public Group[] getGroups() {
		return groups;
	}
	
	public String getName() {
		return name;
	}

	public static void addPrincipal(HttpSession session, Principal principal) {
		if (session == null) {
			throw new RuntimeException("Session cannot be null");
		}
		session.setAttribute(PRINCIPAL_SESSION_KEY, principal);
	}

	public static Principal getPrincipal(HttpSession session) {
		if (session != null) {
			return (Principal)session.getAttribute(PRINCIPAL_SESSION_KEY);
		} else {
			return null;
		}
	}

	public static void removePrincipal(HttpSession session) {
		if (session != null) {
			session.removeAttribute(PRINCIPAL_SESSION_KEY);
		}
	}
}
