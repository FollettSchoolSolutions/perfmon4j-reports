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
