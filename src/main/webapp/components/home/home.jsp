<%@page import="org.perfmon4jreports.app.sso.Principal"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%if (!Principal.isLoggedIn(request.getSession())) { %>
	<div/> <!-- Empty div for body -->
<% } else {  %>
	<div>
	    <div>
			<div class="chartMenu">
		
	 		<md-toolbar id="chartMenu">
	    		<div class="md-toolbar-tools" style="min-height: 12px">
	      			<h2>
	        			<span>My Charts</span>
	      			</h2>
	    		</div>
	  		</md-toolbar>
	  		<div class="innerChartMenu">
				<table style="width: 100%">
					<tr ng-repeat="chart in charts"> 
						<td> 
							<div class="right">
								<a title="Edit Chart" class="chartrowIconAnchor">
									<ng-md-icon title="Edit Chart" class="edit-icon-dark" icon="mode_edit" size="25" ng-click="editChart(chart.id);openSideNav()"></ng-md-icon>
								</a>
								<a title="Duplicate Chart" class="chartrowIconAnchor">
									<ng-md-icon title="Duplicate Chart" class="duplicate-icon-dark" icon="content_copy" size="25" ng-click="copyChart(chart.id)"></ng-md-icon>
								</a>
								<a title="Delete Chart" class="chartrowIconAnchor">
									<ng-md-icon title="Delete Chart" class="delete-icon-dark" icon="delete" size="25" ng-click="deleteChart(chart.id)"></ng-md-icon>
								</a>
							</div>
							<a class="chartrowLinkAnchor" href="#/chart/{{chart.id}}">{{ chart.chartName }}</a>
						</td>
					</tr>
				</table>
			</div>
	  		<md-content>
	  			<a title="Create New Chart">
					<md-button title="Create New Chart" id="createButton" class="md-raised md-primary" ng-click="showChart();openSideNav()"> Create </md-button>
				</a>
	  		</md-content>
		</div>
		
		<div class="dashboardMenu">
	 		<md-toolbar id="dashboardMenu">
	    		<div class="md-toolbar-tools">
	      			<h2>
	        			<span>My Dashboards</span>
	      			</h2>
	    		</div>
	  		</md-toolbar>
	  		<div>
	  			<a title="Create New Dashboard">
					<md-button title="Create New Dashboard" id="createButton" class="md-raised md-primary" ng-disabled="true"> Create </md-button>
				</a>
	  			</div>
			</div>
		</div>
		<div class ="datasourceMenu">
		<md-toolbar id="datasourceMenu">
    		<div class="md-toolbar-tools">
      			<h2>
        			<span>My Datasources</span>
      			</h2>
    		</div>

  		</md-toolbar>
  		<!--Stuff to do with Data Sources:
  		1.  We need to use the new edit icon.  For now, the duplicate icon is being used as edit for DataSources.  There is no functionality in place for duplicating a data source
  		2.  We are terrible at css and positioning buttons on the homepage.  The "Create" button needs to be below the container that holds the datasources.
  		3.  I think we should add an alert to confirm deletion before we delete a chart/datasource/dashboard, just because losing a resource by accidentally clicking delete is annoying-->
  		<div class="innerDataSourceMenu">
			<table style="width: 100%">
				<tr ng-repeat="ds in DataSource"> 
					<td> 
					
						<div class="right">
							<a title="Edit DataSource" class="chartrowIconAnchor">
								<ng-md-icon title="Edit DataSource" class="edit-icon-dark" icon="mode_edit" size="25"  ng-click="editDataSource($mnv, ds.id, ds.name, ds.url)"></ng-md-icon>
							</a>
							<a title="Delete DataSource" class="chartrowIconAnchor">
								<ng-md-icon title="Delete DataSource" class="delete-icon-dark" icon="delete" size="25" ng-click="deleteDataSource(ds.id)"></ng-md-icon>
							</a>
						</div>
						<a class="chartrowLinkAnchor">{{ ds.name }}</a>
					</td>
				</tr>
			</table>
		</div>
		  	<a title="Create New Datasource">
				<md-button title="Create New Datasource" id="createButton" class="md-raised md-primary" ng-controller="dataSourceControl" ng-click="showDataSources($env)" ng-disabled="false"> Create </md-button>
			</a>
	 </div>
	</div>
<% } %>	