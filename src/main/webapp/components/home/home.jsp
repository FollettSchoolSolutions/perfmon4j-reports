<%@page import="org.perfmon4jreports.app.sso.Principal"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
<%if (!Principal.isLoggedIn(request.getSession())) { %>
<div class="container">
	<div layout="row" layout-sm="column" class="responsiveRow">
		<div class="responsiveCol" flex>
			<div class="listContainer"> 
		 		<md-subheader>
		        	Public Charts
		  		</md-subheader>
	  			<ul class="publicList">
	  				<li ng-repeat="publicChart in publicCharts"> 
	  					<a title="Datasource not available" ng-if="publicChart.isAvailable == false" class="chartrowLinkAnchorDisabled">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a>
						<a ng-if="publicChart.isAvailable == true" class="chartrowLinkAnchor" href="#/chart/{{publicChart.id}}">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a>
	  				</li>
	  				<li ng-show="publicCharts.length == 0">
	  					<div class="emptyListPlaceholder">
							None
						</div>
	  				</li>
	  			</ul>
			</div>
		</div>
		<div class="responsiveCol" flex></div>
	</div>
</div>
<% } else {  %>
<div class="container">
	<div layout="row" layout-sm="column" class="responsiveRow">
	    <div class="responsiveCol" flex>
			<div class="listContainer">
		 		<md-subheader id="chartMenu" class="md-no-sticky">
		        	My Charts
		  		</md-subheader>
	  			<ul class="chartList">
	  				<li ng-repeat="chart in charts" class="clearfix">
	  					<div class="chartControls">
							<!-- disabled icon buttons for greyed out -->
							<a ng-if="chart.isAvailable == false" class="chartrowIconAnchorDisabled">
								<i class="material-icons">mode_edit</i>
							</a>
							<a ng-if="chart.isAvailable == false" class="chartrowIconAnchorDisabled">
								<i class="material-icons">content_copy</i>
							</a>
							
							<!-- regular icon buttons -->
							<a title="Edit Chart" ng-if="chart.isAvailable == true" class="chartrowIconAnchor" ng-click="editChart(chart.id);openSideNav()">
								<i class="material-icons">mode_edit</i>
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
	  				</li>
	  				<li ng-show="charts.length == 0">
	  					<div class="emptyListPlaceholder">None</div>
	  				</li>
	  			</ul>
	  			<div class="chartFooter">
					<md-button title="Create New Chart" id="createButton" class="md-primary md-raised" ng-click="showChart();openSideNav()"> Create </md-button>
				</div>
			</div>
		
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
		
		<div class="responsiveCol" flex>
			<div class="listContainer">
				<md-subheader id="datasourceMenu" class="md-no-sticky">
		        	My Datasources
		  		</md-subheader>
				<ul class="datasourceList">
					<li ng-repeat="ds in datasources">
						<div ng-if="ds.editable == true" class="chartControls">
							<a title="Edit DataSource" class="datasourceRowIconAnchor" ng-click="editDataSource($mnv, ds.id, ds.name, ds.url, ds.publiclyVisible)"> <i class="material-icons">mode_edit</i>
							</a>
							<!-- delete is enabled -->
							<a ng-if="ds.used == false" title="Delete DataSource" class="datasourceRowIconAnchor" ng-click="deleteDataSource(ds.id)"> <i class="material-icons">delete</i>
							</a>
							<!-- delete is disabled -->
							<a ng-if="ds.used == true" title="Datasource in use" class="datasourceRowIconAnchorDisabled"> <i class="material-icons">delete</i>
							</a>
						</div> 
						<div class="datasourceRowText">{{ getDataSourceName(ds) }}</div>
					</li>
					<li ng-show="datasources.length == 0">
						<div class="emptyListPlaceholder">None</div>
					</li>
				</ul>
				<div class="chartFooter">
					<md-button title="Create New Datasource" id="createButton" class="md-button md-raised md-primary" ng-controller="dataSourceControl" ng-click="showDataSources($env)" ng-disabled="false"> Create </md-button>
				</div>
					<!-- <table style="width: 100%">
						<tr ng-repeat="ds in datasources">
							<td>
								<div ng-if="ds.editable == true" class="right">
									<a title="Edit DataSource" class="datasourceRowIconAnchor" ng-click="editDataSource($mnv, ds.id, ds.name, ds.url, ds.publiclyVisible)"> <i class="material-icons">mode edit</i>
									</a>
									delete is enabled
									<a ng-if="ds.used == false" title="Delete DataSource" class="datasourceRowIconAnchor" ng-click="deleteDataSource(ds.id)"> <i class="material-icons">delete</i>
									</a>
									delete is disabled
									<a ng-if="ds.used == true" title="Datasource in use" class="datasourceRowIconAnchorDisabled"> <i class="material-icons">delete</i>
									</a>
								</div> <a class="datasourceRowText">{{ getDataSourceName(ds) }}</a>
							</td>
						</tr>
						<tr ng-show="datasources.length == 0">
							<td class="emptyListPlaceholder"><span class="emptyListPlaceholderText">None</span></td>
						</tr>
					</table>
					<div class="textRight">
						<md-button title="Create New Datasource" id="createButton" class="md-raised md-primary" ng-controller="dataSourceControl" ng-click="showDataSources($env)" ng-disabled="false"> Create </md-button>
					</div> -->
			</div>

			<div class="listContainer">
				<md-subheader id="publicChartMenu" class="md-no-sticky">
		        	Public Charts
		  		</md-subheader>
					<ul class="publicList">
						<li ng-repeat="publicChart in publicCharts">
							<a title="Datasource not available" ng-if="publicChart.isAvailable == false" class="chartrowLinkAnchorDisabled">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a> 
							<a ng-if="publicChart.isAvailable == true" class="chartrowLinkAnchor" href="#/chart/{{publicChart.id}}">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a>
						</li>
						<li ng-show="publicCharts.length == 0">
							<div class="emptyListPlaceholder">None</div>
						</li>
					</ul>
					<!-- <table style="width: 100%">
						<tr ng-repeat="publicChart in publicCharts">
							<td><a title="Datasource not available" ng-if="publicChart.isAvailable == false" class="chartrowLinkAnchorDisabled">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a> <a
								ng-if="publicChart.isAvailable == true" class="chartrowLinkAnchor" href="#/chart/{{publicChart.id}}">{{ publicChart.chartName + " [" + publicChart.userFullName + "]" }}</a></td>
						</tr>
						<tr ng-show="publicCharts.length == 0">
							<td class="emptyListPlaceholder"><span class="emptyListPlaceholderText">None</span></td>
						</tr>
					</table> -->
	

			</div>
		</div>
	</div>
</div>	
<% } %>	
