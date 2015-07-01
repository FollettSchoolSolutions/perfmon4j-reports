app.controller('chartControl', function ($scope, chartService, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.datasources = [];
	$scope.chosenDatasource = null;
	$scope.chosenDatabase = null;
	$scope.databases = [];
	$scope.systems = [];
	$scope.fields = [];
	$scope.categories = [];
	$scope.chartName = "";
	$scope.aggregationMethods = [];
	$scope.chosenSystem = "";
	$scope.chosenCategory = "";
	$scope.chosenField = "";
	$scope.chosenAggregationMethod = "";
	$scope.seriesName = "";
	$scope.timeStart = "now-8H";
	$scope.timeEnd = "now";
	$scope.isDisabled = true;
	$scope.showName = false;
	$scope.chartId = 0;
	$scope.addToggled = false;
	$scope.series = [];
	$scope.seriesUrl = "";
	$scope.seriesAliases = "";
	$scope.activeSeries = 0;
	var active = chartService.active;
	
	var datasourcePromise = dataSourceService.getDataSources();
	datasourcePromise.then(function(result){
		$scope.datasources = result.data;
		
		if ($scope.datasources.length > 0) {
			$scope.chosenDatasource = chartService.chosenDatasource = $scope.datasources[0];
			$scope.loadDatabases();
		}
	})		

	$scope.loadDatabases = function(){
		clearDatabase();
		clearSystem();
		clearCategory();
		clearField();
		clearAggregationMethod();		
		chartService.chosenDatasource = $scope.chosenDatasource;
		chartService.timeStart = $scope.timeStart;
		chartService.timeEnd = $scope.timeEnd;
		var databasePromise = dataSourceService.getDatabases(chartService.chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})
	};

	
	$scope.loadSystems = function(){
		chartService.chosenDatabase = $scope.chosenDatabase;
		chartService.timeStart = $scope.timeStart;
		chartService.timeEnd = $scope.timeEnd;
		if (!angular.isDefined($scope.series) || $scope.series.length == 0) {
			$scope.setActiveSeries(0);
		}
	};
	
	$scope.renderDisabled = function(){
		var activeSeries = null;
		for (var i = 0; i < $scope.series.length; i++){
			if ($scope.series[i].active){
				activeSeries = $scope.series[i];
				break;
			}
		}
		
		if ($scope.invalidSeriesNames()) {
			return true;
		}
		
		return (isEmptyOrNull($scope.chosenDatasource) || isEmptyOrNull($scope.chosenDatabase) 
				|| isEmptyOrNull(activeSeries.system) || isEmptyOrNull(activeSeries.category) 
				|| isEmptyOrNull(activeSeries.field) || isEmptyOrNull(activeSeries.name) 
				|| isEmptyOrNull($scope.chartName) || isEmptyOrNull($scope.timeStart)
				|| isEmptyOrNull($scope.timeEnd))
	};
	
	$scope.isLoading = function(chosenOne, options){
		return !isEmptyOrNull(chosenOne) && isEmptyOrNull(options);
	}
	
	
	$scope.saveChartName = function() {
		chartService.chartName = $scope.chartName;
	}
	
	$scope.saveStartTime = function() {
		chartService.startTime = $scope.startTime;
	}
	
	$scope.saveEndTime = function() {
		chartService.endTime = $scope.endTime;
	}
	
	$scope.toggleClose = function() {
		chartService.isToggled = false;
	}
	
	$scope.cleanSeriesUrl = function() {
		var cleanUrl="";
		var systems= "";
		var category="";
		var field="";
		var agg="";
		
		for (var i=0; i<$scope.series.length; i++)
			{
				$scope.series[i];
				if (i!= 0){
					cleanUrl += "_";
				}
				agg = $scope.series[i].aggregationMethod + "~";
				cleanUrl += agg; 
				//for (j=0; j< $scope.series.system.length; j++){
					systems += $scope.series[i].system.id + "~";
				//}
				category = $scope.series[i].category.name;
				field = $scope.series[i].field.name;
				cleanUrl += systems + category + "~" + field;
				systems = "";
			}
		
		console.log(cleanUrl);
		return cleanUrl;
		
		
	}
	
	$scope.showChart = function() {
		$scope.chartName = chartService.chartName;
		$scope.seriesUrl = $scope.cleanSeriesUrl();
		listSeriesAliases();
		var urlPromise = dataSourceService.getURL(chartService.chosenDatasource, chartService.chosenDatabase, 
				chartService.timeStart, chartService.timeEnd, $scope.seriesUrl, $scope.seriesAliases);
		urlPromise.then(function(result){
			var reportMetadata = {
//				size: {
//					height: 240,
//					width: 480
//				},
				data: result.data,
				axis: {
			       x: {
			           type: 'timeseries',
			           tick: {
			               format: '%Y-%m-%dT%H:%M'
			           }
			       }
			   }		
			};
			
			$scope.showName = true;
			chartService.isShowable = true;
			$scope.chart = c3.generate(reportMetadata);
		})
	};
	
	$scope.clearAllFields = function() {
		$scope.chosenDatasource = $scope.datasources[0];
		$scope.loadDatabases();
		clearChartName();
		clearTimeStart();
		clearTimeEnd();
		clearSeries();
	}
	
	$scope.showSeries = function(index) {
		return $scope.activeSeries == index;	
	}
	
	$scope.setActiveSeries = function(index) {
		if( (!angular.isDefined($scope.series)) || $scope.series.length == 0){
			$scope.series = [{}];	
		}
		
		for(var i = 0; i < $scope.series.length; i++){
			$scope.series[i].active = false;
		}
		
		$scope.series[index].active = true;
	}
	
	$scope.addSeries = function() {
		for (var i = 0; i < $scope.series.length; i++){
			$scope.series[i].active = false;
		}
		var newSeries = {active: true};
		$scope.series.push(newSeries);
	}
	
	$scope.initSeries = function() {
		clearSeries();
		$scope.series = [{active: true}];
	}
	
	$scope.disableTopOptions = function() {
		if ($scope.series.length > 1) {
			return true;
		}
		return false;
	}
	
	$scope.invalidSeriesNames = function() {
		for (var i = 0; i < $scope.series.length; i++) {
			for (var j = i + 1; j < $scope.series.length; j++) {
				if ($scope.series[i].name === $scope.series[j].name) {
					return true;
				}
			}
		}
		return false;
	}
	
	function inArray(item) {
		for (var i = 0; i < $scope.series.length; i++) {
			if (item.name == $scope.series[i].name &&
				item.system == $scope.series[i].system &&
				item.category == $scope.series[i].category &&
				item.field == $scope.series[i].field &&
				item.aggregationMethod == $scope.series[i].aggregationMethod) {
				return true;
			}
		}
		return false;
	}
	
	function listSeriesAliases() {
		$scope.seriesAliases = "";
		for (var i = 0; i < $scope.series.length; i++) {
			if (i != 0) {
				$scope.seriesAliases += "_";
			}
			$scope.seriesAliases += $scope.series[i].name;
		}
	}
	
	function isEmptyOrNull(value) {
		return (!value || 0 === value.length);
	}
	
	function clearDatabase(){
		$scope.chosenDatabase = null;
		$scope.databases = [];
		chartService.chosenDatabase = null;
	}

	function clearSystem(){
		$scope.chosenSystem = null; 
		$scope.systems = [];
		chartService.chosenSystem = null;
	}
	
	function clearCategory(){
		$scope.chosenCategory = null;
		$scope.categories = [];
		chartService.chosenCategory = null;
	}
	
	function clearField(){
		$scope.chosenField = null;
		$scope.fields = [];
		chartService.chosenField = null;
	}
	
	function clearAggregationMethod(){
		$scope.chosenAggregationMethod = null; 
		$scope.aggregationMethods = [];
		chartService.chosenAggregationMethod = null;
	}
	
	function clearChartName(){
		$scope.chartName = "";
	}
	
	function clearTimeStart(){
		$scope.timeStart = "now-8H";
		chartService.timeStart = "";
	}
	
	function clearTimeEnd(){
		$scope.timeEnd = "now";
		chartService.timeEnd = "";
	}
	
	function clearSeries(){
		$scope.series = [];
	}

});

