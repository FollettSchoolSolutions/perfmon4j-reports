<%@page import="org.perfmon4jreports.app.sso.Principal"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!doctype html>
<html lang="en" ng-app="perfmonReportsApp">
	<head>
	  <meta charset="utf-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
	  <link rel="stylesheet" href="https://cdn.rawgit.com/angular/bower-material/v0.9.7/angular-material.css">
	  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css"> 
	  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	  <link rel="stylesheet" href="lib/json.human.css">
	  <link rel="stylesheet" href="css/home.css">
	  <link rel="stylesheet" href="css/chart.css">
	  <link rel="stylesheet" href="css/chartSeries.css">
	  <link rel="stylesheet" href="css/advancedOptionsDialog.css">
	  
	  <title>Perfmon4J Reports</title>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.js"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-sanitize.js"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-route.min.js"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-messages.min.js"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-aria.min.js"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-animate.min.js"></script>
	  <script src="https://cdn.rawgit.com/angular/bower-material/v0.9.7/angular-material.js"></script>
	  <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-114/assets-cache.js"></script>
	  
	  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
	  <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"></script>
	  <script src="lib/json.human.js"></script>
	    
	  <!-- Application components -->
	  <script src="app.js"></script>
	  <script src="components/appController.js"></script>
	  
	  <script src="components/home/homeDirective.js"></script>
	  <script src="components/home/homeController.js"></script>
	  <script src="components/chart/chartRenderController.js"></script>
	  <script src="components/chart/chartDirective.js"></script>
	  <script src="components/chart/chartController.js"></script>
	  <script src="components/chart/sideNavController.js"></script>
	  <script src="components/chart/chartSeriesDirective.js"></script>
	  <script src="components/chart/chartSeriesController.js"></script>
	  <script src="components/chart/seriesModel.js"></script>
	  <script src="components/home/SSOLogin.js"></script>
	  <script src="services/userService.js"></script>
	  <script src="components/home/home.jsp"></script>
	  <!-- Data Sources -->
	  <script src="services/dataSourceService.js"></script>
	  <script src="services/chartService.js"></script>
	  <script src="components/datasource/dataSourceController.js"></script>
	  
	</head>

	<body layout="row">
		<div ng-controller="appControl" layout-fill layout="column">
			<md-toolbar class="md-primary">
					
					<%if (!Principal.isLoggedIn(session))  { %> 
					<div class="loginContainer">
						<a title="Login" href="callback/sso?launch=true" class="login">
							<span>Login with GitHub</span>
							<i></i>
						</a>
					</div>
					<% } else { 
						String userName = Principal.getPrincipal(session).getName();
					%>
					<div class="loginContainer">
						<a title="Logout" href="callback/sso?logout=true" class="logout">
							<span>Logout (<%=userName%>)</span>
							<i></i>
						</a>
					</div>
					<% } %>
					
						<a title="Homepage" href="#home" class="logo" flex><img src="images/perfmon4jFULL.png" alt="perfmon4j reports logo"></a>
					
				
			</md-toolbar>
	
	
	
	
		<!-- <div ng-controller="appControl" layout-fill layout="column"> -->
			<%-- <md-toolbar class="md-primary">
		      <div layout="row" layout-align="space-between center" class="md-toolbar-tools">
			      <a title="Homepage" href="#home"><img src="images/perfmon4jFULL.png" alt="perfmon4j reports logo"></a>
			         
			 	<%if (!Principal.isLoggedIn(session))  { %>        
				    <a title="Login" href="callback/sso?launch=true" >Login with GitHub</a>
			 	<% } else { 
			 		String userName = Principal.getPrincipal(session).getName();
			 	%>
			    	<a title="Logout" href="callback/sso?logout=true">Logout (<%=userName%>)</a>
			 	<% } %>
		         
		      </div>
		    </md-toolbar> --%>
		    
		    <md-content ng-view layout="row"></md-content>
		</div>
	</body>
</html>
