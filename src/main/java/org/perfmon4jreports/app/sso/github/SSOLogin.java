package org.perfmon4jreports.app.sso.github;

import javax.servlet.http.HttpSession;

import org.perfmon4jreports.app.sso.SSOConfig;
import org.perfmon4jreports.app.sso.Group;
import org.perfmon4jreports.app.sso.Principal;

public class SSOLogin {
HttpSession session;
Principal currentPrincipal = null;

public Login(){
if (session != null) {
	currentPrincipal = Principal.getPrincipal(session);
}

}

}