<%@page import="org.perfmon4jreports.app.sso.SSOConfig"%>
<%@page import="org.perfmon4jreports.app.sso.Group"%>
<%@page import="org.perfmon4jreports.app.sso.Principal"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Login Prototype</title>
</head>
<%
	if (session != null && "true".equals(request.getParameter("logout"))) {
		Principal.removePrincipal(session);
	}

	Principal currentPrincipal = null;
	if (session != null) {
		currentPrincipal = Principal.getPrincipal(session);
	}
	boolean isLoggedIn = currentPrincipal != null;
	String errorMessage = request.getParameter(SSOConfig.LOGIN_ERROR_QUERY_PARAM);
	
%>
<body>
	<% if (errorMessage != null) { %>
		<h1>Error</h1>
		<p><strong><%=errorMessage%></strong></p>
	<% } %>

	<% if (isLoggedIn) { %>
		<!-- Logged In -->
		<h1>User is Logged In</h1>
		<ul>
			<li>Name:&nbsp;<%=currentPrincipal.getName()%> </li>
			<li>UserName:&nbsp;<%=currentPrincipal.getUserName()%> </li>
			<li>Domain:&nbsp;<%=currentPrincipal.getDomain()%> </li>
			<li>GlobalID:&nbsp;<%=currentPrincipal.getGlobalID()%> </li>
			<li>Email:&nbsp;<%=currentPrincipal.getEmailAddress()%> </li>
			<%
			Group[] groups = currentPrincipal.getGroups();
			for (int i = 0; i < groups.length; i++) {
			%>	
				<li>Group id:(<%=groups[i].getGlobalID()%>):&nbsp;<%=groups[i].getName()%> </li>
			<%	
			}
			%>
		</ul>		
		<p><a href="login.jsp?logout=true">Logout</a>
	<% } else { %>
		<!-- Not logged In -->
		<h1>User is Not Logged In</h1>
		<p><a href="callback/sso/github?launch=true">Login with GitHub</a>
	<% } %>
</body>
</html>