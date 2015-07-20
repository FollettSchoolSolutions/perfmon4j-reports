app.controller('chartControl', function ($scope, chartService, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.datasources = [];
	$scope.databases = [];
	$scope.systems = [];
	$scope.fields = [];
	$scope.categories = [];
	$scope.aggregationMethods = [];
	$scope.isLoadingchart = false;

	
	$scope.chart = {
			chosenDatasource : null,
			chosenDatabase : null,
			chartName : "",
			timeStart : "now-8H",
			timeEnd : "now",
			series : []
	};
	
	$scope.isDisabled = true;
	$scope.showName = false;
	$scope.chartId = 0;
	$scope.addToggled = false;
	$scope.seriesUrl = "";
	$scope.seriesAliases = "";
	$scope.activeSeries = 0;
	var active = chartService.active;
	
	var datasourcePromise = dataSourceService.getDataSources();
	datasourcePromise.then(function(result){
		$scope.datasources = result.data;
		
		if ($scope.datasources.length > 0) {
			$scope.chart.chosenDatasource = chartService.chosenDatasource = $scope.datasources[0];
			$scope.loadDatabases();
		}
	})		

	$scope.loadDatabases = function(){
		clearDatabase();
		clearAggregationMethod();		
		chartService.chosenDatasource = $scope.chart.chosenDatasource;
		chartService.timeStart = $scope.chart.timeStart;
		chartService.timeEnd = $scope.chart.timeEnd;
		var databasePromise = dataSourceService.getDatabases(chartService.chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})
	};

	
	$scope.loadSystems = function(){
		chartService.chosenDatabase = $scope.chart.chosenDatabase;
		chartService.timeStart = $scope.chart.timeStart;
		chartService.timeEnd = $scope.chart.timeEnd;
		if ((!angular.isDefined($scope.chart.series) || $scope.chart.series.length == 0) && $scope.chart.chosenDatabase != null) {
			$scope.setActiveSeries(0);
		}
	};
	
	$scope.renderDisabled = function(){
		var activeSeries = null;
		for (var i = 0; i < $scope.chart.series.length; i++){
			if ($scope.chart.series[i].active){
				activeSeries = $scope.chart.series[i];

				break;
			}
		}
		
		if ($scope.invalidSeriesNames()) {
			return true;
		}
		
		if ($scope.incompleteSeriesExists()){
			return true;
		}
		
		if (!$scope.validateSeriesName()) {
			return true;
		}
		
		return (isEmptyOrNull($scope.chart.chosenDatasource) || isEmptyOrNull($scope.chart.chosenDatabase) 
				|| isEmptyOrNull(activeSeries.system) || isEmptyOrNull(activeSeries.category) 
				|| isEmptyOrNull(activeSeries.field) || isEmptyOrNull(activeSeries.name) 
				|| isEmptyOrNull($scope.chart.chartName) || isEmptyOrNull($scope.chart.timeStart)
				|| isEmptyOrNull($scope.chart.timeEnd))
	}
	
	$scope.isLoading = function(chosenOne, options){
		return !isEmptyOrNull(chosenOne) && isEmptyOrNull(options);
	}
	
	$scope.saveChartName = function() {

		chartService.chartName = $scope.chart.chartName;
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
		
		for (var i=0; i<$scope.chart.series.length; i++)
			{
				$scope.chart.series[i];
				if (i!= 0){
					cleanUrl += "_";
				}
				agg = $scope.chart.series[i].aggregationMethod + "~";
				cleanUrl += agg; 
				//for (j=0; j< $scope.chart.series.system.length; j++){
					systems += $scope.chart.series[i].system.id + "~";
				//}
				category = $scope.chart.series[i].category.name;
				field = $scope.chart.series[i].field.name;
				cleanUrl += systems + category + "~" + field;
				systems = "";
			}
		
		console.log(cleanUrl);
		return cleanUrl;
		
		
	}
	
	$scope.showChart = function() {
		chartService.successfullySaved = null;
		chartService.isShowable = false;
		chartService.isChartLoading = true;
		$scope.seriesUrl = $scope.cleanSeriesUrl();
		listSeriesAliases();
		var urlPromise = dataSourceService.getURL(chartService.chosenDatasource, chartService.chosenDatabase, 
				chartService.timeStart, chartService.timeEnd, $scope.seriesUrl, $scope.seriesAliases);
		var timeRange = findTimeRange();
		var relative = isRelativeTimeRange();
		var formatString = "";
		if (timeRange > 24 || !relative) {
			formatString = "%Y-%m-%dT%H:%M";
		} else {
			formatString = "%H:%M";
		}
		urlPromise.then(function(result){
			var reportMetadata = {
				data: result.data,
				axis: {
			       x: {
			           type: 'timeseries',
			           tick: {
			               format: formatString
			           }
			       }
			   }		
			};
			
			$scope.showName = true;
			c3.generate(reportMetadata);
			chartService.isChartLoading = false;
			chartService.isShowable = true;
		})
	};
	
	$scope.saveChart = function(){
		chartService.successfullySaved = null;
		chartService.isChartLoading = true;
		var saveChartPromise = chartService.saveChart($scope.chart);
		saveChartPromise.then(function(result){
			var savedChart = result.data;
			if (savedChart == null || savedChart.id < 1) {
				console.error("Chart not saved successfully!");
				chartService.successfullySaved = false;
			} else {
				console.log("Chart saved successfullly.");
				chartService.successfullySaved = true;
			}
			chartService.isChartLoading = false;
		})
		
	};
	

	$scope.clearAllFields = function() {
		chartService.isShowable = false;
		chartService.successfullySaved = null;
		$scope.chart.chosenDatasource = $scope.datasources[0];
		$scope.loadDatabases();
		clearChartName();
		clearTimeStart();
		clearTimeEnd();
		clearSeries();
	}
	
	$scope.showSeries = function(index) {
		return $scope.activeSeries == index;	
	}scope.series
	
	$scope.setActiveSeries = function(index) {

		if( (!angular.isDefined($scope.chart.series)) || $scope.chart.series.length == 0){
			$scope.chart.series = [{}];	
		}
		
		for(var i = 0; i < $scope.chart.series.length; i++){
			$scope.chart.series[i].active = false;
		}
		
		$scope.chart.series[index].active = true;
	}
	
	$scope.addSeries = function() {
		chartService.successfullySaved = null;
		for (var i = 0; i < $scope.chart.series.length; i++){
			$scope.chart.series[i].active = false;
		}
		var newSeries = {active: true, secondaryAxis: false};
		$scope.chart.series.push(newSeries);
	}
	
	$scope.initSeries = function() {
		clearSeries();

		if ($scope.chart.chosenDatabase != null) {
			$scope.chart.series = [{active: true, secondaryAxis: false}];
		} 
	}
	
	$scope.disableTopOptions = function() {

		if ($scope.chart.series.length > 1) {
			return true;
		}
		return false;
	}
	
	$scope.invalidSeriesNames = function() {
		for (var i = 0; i < $scope.chart.series.length; i++) {
			for (var j = i + 1; j < $scope.chart.series.length; j++) {
				if ($scope.chart.series[i].name === $scope.chart.series[j].name) {
					return true;
				}
			}
		}
		return false;
	}
	
	$scope.incompleteSeriesExists = function(){
		for(var i=0; i<$scope.chart.series.length; i++){
			var currSeries = $scope.chart.series[i];
			var incomplete = (isEmptyOrNull(currSeries.system) || isEmptyOrNull(currSeries.category) 
					|| isEmptyOrNull(currSeries.field) || isEmptyOrNull(currSeries.name));
			if(incomplete == true){
				return true;
			}
		}
		return false;
	}
	
	$scope.validateSeriesName = function() {
		for (var i = 0; i < $scope.chart.series.length; i++) {
			if (!isEmptyOrNull($scope.chart.series[i].name) ) {
				var result = /^[^_#&]+$/.test($scope.chart.series[i].name);
				if (!result) {
					return false;
				}
			}
		}
		return true;
	}
	
	function findTimeRange() {
		if ($scope.timeStart.includes("now") && $scope.timeEnd.includes("now")) {
			if (timeEnd == "now") {
				return timeStart.match(/\d/g);
			}
		} else {
			return 25;
		}
	}
	
	function isRelativeTimeRange() {
		if ($scope.timeStart.includes("now") || $scope.timeEnd.includes("now")) {
			return true;
		} else {
			return false;
		}
	}
	
	function inArray(item) {

		for (var i = 0; i < $scope.chart.series.length; i++) {
			if (item.name == $scope.chart.series[i].name &&
				item.system == $scope.chart.series[i].system &&
				item.category == $scope.chart.series[i].category &&
				item.field == $scope.chart.series[i].field &&
				item.aggregationMethod == $scope.chart.series[i].aggregationMethod) {
				return true;
			}
		}
		return false;
	}
	
	function listSeriesAliases() {
		$scope.seriesAliases = "";
		for (var i = 0; i < $scope.chart.series.length; i++) {
			if (i != 0) {
				$scope.seriesAliases += "_";
			}
			$scope.seriesAliases += $scope.chart.series[i].name;
		}
	}
	
	function isEmptyOrNull(value) {
		return (!value || 0 === value.length);
	}
	
	function clearDatabase(){
		$scope.chart.chosenDatabase = null;
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

		$scope.chart.chartName = "";
	}
	
	function clearTimeStart(){
		$scope.chart.timeStart = "now-8H";
		chartService.timeStart = "";
	}
	
	function clearTimeEnd(){
		$scope.chart.timeEnd = "now";
		chartService.timeEnd = "";
	}
	
	function clearSeries(){
		$scope.chart.series = [];
	}

});

