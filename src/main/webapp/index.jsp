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
	  <link rel="stylesheet" href="css/home.css">
	  <link rel="stylesheet" href="css/chart.css">
	  <link rel="stylesheet" href="css/chartSeries.css">
	  <link rel="stylesheet" href="css/advancedOptionsDialog.css">
	  
	  <title>Perfmon4J Reports</title>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.js"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-route.min.js"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-aria.min.js"></script>
	  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-animate.min.js"></script>
	  <script src="https://cdn.rawgit.com/angular/bower-material/v0.9.7/angular-material.js"></script>
	  <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-material-icons/0.4.0/angular-material-icons.min.js"></script>
	  
	  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js"></script>
	  <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js"></script>
	    
	  <!-- Application components -->
	  <script src="app.js"></script>
	  <script src="components/appController.js"></script>
	  
	  <script src="components/home/homeDirective.js"></script>
	  <script src="components/home/homeController.js"></script>
	  <script src="components/chart/chartRenderController.js"></script>
	  <script src="components/chart/chartDirective.js"></script>
	  <script src="components/chart/chartController.js"></script>
	  <script src="components/chart/chartRenderDirective.js"></script>
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
		      <div layout="row" layout-align="space-between center" class="md-toolbar-tools">
		        <h1>
			        <a title="Homepage" href="#home"><img src="images/perfmon4jFULL.png" alt="perfmon4j reports logo" style="height: 56px"></a>
		        </h1>
		         
		 	<%if (!Principal.isLoggedIn(session))  { %>        
			    <md-button href="callback/sso?launch=true" >Login with GitHub</md-button>
		 	<% } else { 
		 		String userName = Principal.getPrincipal(session).getName();
		 	%>
		    	<md-button href="callback/sso?logout=true">Logout (<%=userName%>)</md-button>
		 	<% } %>
		         
		      </div>
		    </md-toolbar>
		    
		    <md-content ng-view layout="row"></md-content>
		</div>
	</body>
</html>
