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
	private static boolean logged =false;
	
	public Principal(SSODomain domain, String userName, String name, String localID, String emailAddress, Group[] groups) {
		this.domain = domain;
		this.userName = userName;
		this.name = name;
		this.globalID = domain.buildGlobalID(localID);
		this.emailAddress = emailAddress;
		this.groups = groups == null ? new Group[]{} : groups;
		this.logged = true;
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
	
	public boolean getLogged(){
		return logged;
	}
	

	public static void addPrincipal(PrincipalContext principalContext, Principal principal) {
		principalContext.setPrincipal(principal);
	}

	public static Principal getPrincipal(PrincipalContext principalContext) {
		return principalContext.getPrincipal();
	}

	public static void removePrincipal() {
		 logged = false;
	}
}
