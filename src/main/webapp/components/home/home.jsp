<%@page import="org.perfmon4jreports.app.sso.Principal"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<div ng-show=loggedIn(<%=Principal.logged%>)>
    <div>
    	<div>
    		<span style="float: right"> Logged in as: <%=Principal.names%></span>
    	</div>
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
		<div class ="datasourceMenu">
		<md-toolbar id="datasourceMenu">
    		<div class="md-toolbar-tools">
      			<h2>
        			<span>My Datasources</span>
      			</h2>
    		</div>
    		<div>
  			<a title="Create New Datasource">
				<md-button title="Create New Datasource" id="createButton" class="md-raised md-primary" ng-disabled="true"> Create </md-button>
			</a>
  		</div>
  		</md-toolbar>
  		<div class="innerDataSourceMenu">
			<table style="width: 100%">
				<tr ng-repeat="ds in DataSource"> 
					<td> 
						<div class="right">
							<a title="Duplicate DataSource" class="chartrowIconAnchor">
								<ng-md-icon title="Duplicate DataSource" class="duplicate-icon-dark" icon="content_copy" size="25" ng-click="copyDataSource(dataSource.id)"></ng-md-icon>
							</a>
							<a title="Delete DataSource" class="chartrowIconAnchor">
								<ng-md-icon title="Delete DataSource" class="delete-icon-dark" icon="delete" size="25" ng-click="deleteDataSource(dataSource.id)"></ng-md-icon>
							</a>
						</div>
					</td>
				</tr>
			</table>
		</div>
	 </div>
	</div>
</div>