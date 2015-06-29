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
		if (!angular.isDefined($scope.chosenDatabase.series) || $scope.chosenDatabase.series.length == 0) {
			$scope.chosenDatabase.series = [{}];
		}
	};

	
	$scope.loadCategories = function(){
		clearCategory();
		clearField();
		clearAggregationMethod();
		chartService.chosenSystem = $scope.chosenSystem;
		var databasePromise = dataSourceService.getCategories($scope.chosenDatasource, $scope.chosenDatabase, 
				$scope.chosenSystem, $scope.timeStart, $scope.timeEnd);
		databasePromise.then(function(result){
			$scope.categories = result.data.sort(function(a,b){
				if( a.name < b.name){
					return -1;
				}else if (a.name == b.name){
					return 0;
				}else if (a.name > b.name){
					return 1;
				}item
			})
		})
	};
	
	$scope.loadFields = function(){
		clearField();
		clearAggregationMethod();
		chartService.chosenCategory = $scope.chosenCategory;
		var databasePromise = dataSourceService.getFields($scope.chosenDatasource, $scope.chosenDatabase, 
				$scope.chosenCategory);
		databasePromise.then(function(result){
			$scope.fields = result.data[0].fields;
		})
	};
	
	$scope.loadAggregations = function(){
		clearAggregationMethod();
		chartService.chosenField = $scope.chosenField;
		$scope.chosenAggregationMethod = $scope.chosenAggregationMethod = $scope.chosenField.defaultAggregationMethod;
		$scope.aggregationMethods = $scope.chosenField.aggregationMethods;
	}
	
	$scope.renderDisabled = function(){
		return (isEmptyOrNull(chartService.chosenDatasource) || isEmptyOrNull(chartService.chosenDatabase) 
				|| isEmptyOrNull(chartService.chosenSystem) || isEmptyOrNull(chartService.chosenCategory) 
				|| isEmptyOrNull(chartService.chosenField) || isEmptyOrNull(chartService.seriesName) 
				|| isEmptyOrNull(chartService.chartName) || isEmptyOrNull(chartService.timeStart)
				|| isEmptyOrNull(chartService.timeEnd))
	};
	
	$scope.isLoading = function(chosenOne, options){
		return !isEmptyOrNull(chosenOne) && isEmptyOrNull(options);
	}
	
	
	$scope.saveChartName = function() {
		chartService.chartName = $scope.chartName;
	}
	
	$scope.saveSeriesName = function() {
		chartService.seriesName = $scope.seriesName;
	}
	
	$scope.saveStartTime = function() {
		chartService.startTime = $scope.startTime;
	}
	
	$scope.saveEndTime = function() {
		chartService.endTime = $scope.endTime;
	}
	
	$scope.cleanSeriesUrl = function() {
		var cleanUrl="";
		var systems= "";
		var category="";
		var field="";
		var agg="";
		
		for (i=0; i<$scope.series.length; i++)
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
	
	$scope.toggleClose = function() {
		chartService.isToggled = false;
	}
	
	$scope.clearAllFields = function() {
		$scope.chosenDatasource = $scope.datasources[0];
		$scope.loadDatabases();
		clearChartName();
		clearSeriesName();
		clearTimeStart();
		clearTimeEnd();
	}
	
	
	$scope.showSeries = function() {
		return !isEmptyOrNull($scope.chosenDatabase)
		
	}
	
	$scope.addSeries = function() {
		$scope.series.push(new Series(chartService.seriesName, chartService.chosenSystem, chartService.chosenCategory, chartService.chosenField, chartService.chosenAggregationMethod));
		$scope.chosenDatabase.series.push({});
	}
	
	function listSeriesAliases() {
		$scope.seriesAliases = "";
		for (i = 0; i < $scope.series.length; i++) {
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
	
	function clearSeriesName(){
		$scope.seriesName = "";
		chartService.seriesName = "";
	}
	
	function clearTimeStart(){
		$scope.timeStart = "now-8H";
		chartService.timeStart = "";
	}
	
	function clearTimeEnd(){
		$scope.timeEnd = "now";
		chartService.timeEnd = "";
	}
	

});

