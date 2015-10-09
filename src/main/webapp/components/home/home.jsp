<%@page import="org.perfmon4jreports.app.sso.Principal"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%if (!Principal.isLoggedIn(request.getSession())) { %>
	<div class="publicChartMenu"> 
	 		<md-toolbar id="publicChartMenu">
	    		<div class="md-toolbar-tools">
	      			<h2>
	        			<span>Public Charts</span>
	      			</h2>
	    		</div>
	  		</md-toolbar>
	  		<div class="innerPublicChartMenu">
				<table style="width: 100%">
					<tr ng-repeat="publicChart in publicCharts"> 
						<td> 
							<a title="Datasource not available" ng-if="publicChart.isAvailable == false" class="chartrowLinkAnchorDisabled">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a>
							<a ng-if="publicChart.isAvailable == true" class="chartrowLinkAnchor" href="#/chart/{{publicChart.id}}">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a>
						</td>
					</tr>
					<tr ng-show="publicCharts.length == 0">
						<td class="emptyListPlaceholder">
							<span class="emptyListPlaceholderText">None</span>
						</td>
					</tr>
				</table>
				
			</div>
		</div>
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
								<!-- disabled icon buttons for greyed out -->
								<a ng-if="chart.isAvailable == false" class="chartrowIconAnchorDisabled">
									<i class="material-icons">mode edit</i>
								</a>
								<a ng-if="chart.isAvailable == false" class="chartrowIconAnchorDisabled">
									<i class="material-icons">content_copy</i>
								</a>
								
								<!-- regular icon buttons -->
								<a title="Edit Chart" ng-if="chart.isAvailable == true" class="chartrowIconAnchor" ng-click="editChart(chart.id);openSideNav()">
									<i class="material-icons">mode edit</i>
								</a>
								<a title="Duplicate Chart" ng-if="chart.isAvailable == true" class="chartrowIconAnchor" ng-click="copyChart(chart.id)">
									<i class="material-icons">content_copy</i>
								</a>
								<a title="Delete Chart" class="chartrowIconAnchor" ng-click="deleteChart(chart.id)">
									<i class="material-icons">delete</i>
								</a>
							</div>
							<a title="Datasource not available" ng-if="chart.isAvailable == false" class="chartrowLinkAnchorDisabled">{{ chart.chartName }}</a>
							<a ng-if="chart.isAvailable == true" class="chartrowLinkAnchor" href="#/chart/{{chart.id}}">{{ chart.chartName }}</a>
						</td>
					</tr>
					<tr ng-show="charts.length == 0">
						<td class="emptyListPlaceholder"><span class="emptyListPlaceholderText">None</span></td>
					</tr>
				</table>
			</div>
	  		<md-content>
	  			<a title="Create New Chart">
					<md-button title="Create New Chart" id="createButton" class="md-raised md-primary" ng-click="showChart();openSideNav()"> Create </md-button>
				</a>
	  		</md-content>
		</div>
		
		<!--  THIS CAN BE UNCOMMENTED WHEN WE ACTUALLY ADD DASHBOARDS
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
		-->
		
		<div class ="datasourceMenu">
		<md-toolbar id="datasourceMenu">
    		<div class="md-toolbar-tools">
      			<h2>
        			<span>My Datasources</span>
      			</h2>
    		</div>

  		</md-toolbar>
  		<div class="innerDataSourceMenu">
			<table style="width: 100%">
				<tr ng-repeat="ds in datasources"> 
					<td> 
					
						<div class="right">
							<a title="Edit DataSource" class="md-icon-button chartrowIconAnchor" ng-click="editDataSource($mnv, ds.id, ds.name, ds.url)">
								<i class="material-icons">mode edit</i>
							</a>
							<a title="Delete DataSource" class="chartrowIconAnchor" ng-click="deleteDataSource(ds.id)">
								<i class="material-icons">delete</i>
							</a>
						</div>
						<a class="datasourceRowText">{{ ds.name }}</a>
					</td>
				</tr>
				<tr ng-show="datasources.length == 0">
					<td class="emptyListPlaceholder"><span class="emptyListPlaceholderText">None</span></td>
				</tr>
			</table>
		</div>
		  	<a title="Create New Datasource">
				<md-button title="Create New Datasource" id="createButton" class="md-raised md-primary" ng-controller="dataSourceControl" ng-click="showDataSources($env)" ng-disabled="false"> Create </md-button>
			</a>
	 </div>
	 <div class="publicChartMenu"> 
	 		<md-toolbar id="publicChartMenu">
	    		<div class="md-toolbar-tools">
	      			<h2>
	        			<span>Public Charts</span>
	      			</h2>
	    		</div>
	  		</md-toolbar>
	  		<div class="innerPublicChartMenu">
				<table style="width: 100%">
					<tr ng-repeat="publicChart in publicCharts"> 
						<td> 
							<a title="Datasource not available" ng-if="publicChart.isAvailable == false" class="chartrowLinkAnchorDisabled">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a>
							<a ng-if="publicChart.isAvailable == true" class="chartrowLinkAnchor" href="#/chart/{{publicChart.id}}">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a>
						</td>
					</tr>
					<tr ng-show="publicCharts.length == 0">
						<td class="emptyListPlaceholder">
							<span class="emptyListPlaceholderText">None</span>
						</td>
					</tr>
				</table>
				
			</div>
		</div>
	</div>
<% } %>	
