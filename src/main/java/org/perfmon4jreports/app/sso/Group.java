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
