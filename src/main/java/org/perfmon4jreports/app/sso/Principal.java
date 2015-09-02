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
//git is weird
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
	private User localUser;
	
	public Principal(SSODomain domain, String userName, String name, String localID, String emailAddress, Group[] groups) {
		this.domain = domain;
		this.userName = userName;
		this.name = name != null ? name : userName;
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
	
	public static void addPrincipal(HttpSession session, Principal principal, User user) {
		principal.setLocalUser(user);
		session.setAttribute(PRINCIPAL_SESSION_KEY, principal);
	}

	public static Principal getPrincipal(HttpSession session) {
		return session == null ? null : (Principal)session.getAttribute(PRINCIPAL_SESSION_KEY);
	}

	public static void removePrincipal(HttpSession session) {
		if (session != null) {
			session.removeAttribute(PRINCIPAL_SESSION_KEY);
		}
	}
	
	public static boolean isLoggedIn(HttpSession session) {
		return getPrincipal(session) != null;
	}
	
	private void setLocalUser(User user) {
		this.localUser = user;
	}
	
	public User getLocalUser() {
		return localUser;
	}
}
