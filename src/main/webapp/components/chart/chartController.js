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
	
	var datasourcePromise = dataSourceService.getDataSources();
	datasourcePromise.then(function(result){
		$scope.datasources = result.data;
		
		if ($scope.datasources.length > 0) {
			$scope.chosenDatasource = chartService.chosenDatasource = $scope.datasources[0];
			$scope.loadDatabases();
		}
	})		

	$scope.loadDatabases = function(){
		console.log("Chosen datasource is: " + $scope.chosenDatasource.host);
		chartService.chosenDatasource = $scope.chosenDatasource;
		chartService.timeStart = $scope.timeStart;
		chartService.timeEnd = $scope.timeEnd;
		var databasePromise = dataSourceService.getDatabases(chartService.chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})
		clearSystem();
		clearCategory();
		clearField();
		clearAggregationMethod();		
	}

	
	$scope.loadSystems = function(){
		console.log("Chosen Database is: " + $scope.chosenDatabase.id);
		chartService.chosenDatabase = $scope.chosenDatabase;
		var databasePromise = dataSourceService.getSystems(chartService.chosenDatasource, chartService.chosenDatabase, chartService.timeStart, 
				chartService.timeEnd);
		databasePromise.then(function(result){
			$scope.systems = result.data.sort(function(a,b){
				return (parseInt(a.id.substring(a.id.lastIndexOf(".") + 1)) - parseInt(b.id.substring(b.id.lastIndexOf(".") + 1)));
			});
		})
		clearCategory();
		clearField();
		clearAggregationMethod();
	}

	
	$scope.loadCategories = function(){
		console.log("Chosen Database is: " + $scope.chosenSystem.id);
		chartService.chosenSystem = $scope.chosenSystem;
		var databasePromise = dataSourceService.getCategories(chartService.chosenDatasource, chartService.chosenDatabase, 
				chartService.chosenSystem, chartService.timeStart, chartService.timeEnd);
		databasePromise.then(function(result){
			$scope.categories = result.data.sort(function(a,b){
				if( a.name < b.name){
					return -1;
				}else if (a.name == b.name){
					return 0;
				}else if (a.name > b.name){
					return 1;
				}
			})
		})
		clearField();
		clearAggregationMethod();
	}
	
	$scope.loadFields = function(){
		console.log("Chosen Database is: " + $scope.chosenCategory);
		chartService.chosenCategory = $scope.chosenCategory;
		var databasePromise = dataSourceService.getFields(chartService.chosenDatasource, chartService.chosenDatabase, 
				chartService.chosenCategory);
		databasePromise.then(function(result){
			console.log(result.data[0].fields);
			$scope.fields = result.data[0].fields;
		})
		clearAggregationMethod();
	};
	
	$scope.loadAggregations = function(){
		console.log("Chosen Database is: " + $scope.chosenField);
		chartService.chosenField = $scope.chosenField;
		$scope.chosenAggregationMethod = chartService.chosenAggregationMethod = chartService.chosenField.defaultAggregationMethod;
		$scope.aggregationMethods = $scope.chosenField.aggregationMethods;
	}
	
	$scope.renderDisabled = function(){
		return (isEmptyOrNull($scope.chosenDatasource) || isEmptyOrNull($scope.chosenDatabase) 
				|| isEmptyOrNull($scope.chosenSystem) || isEmptyOrNull($scope.chosenCategory) 
				|| isEmptyOrNull($scope.chosenField) || isEmptyOrNull($scope.seriesName) 
				|| isEmptyOrNull($scope.chartName) || isEmptyOrNull($scope.timeStart)
				|| isEmptyOrNull($scope.timeEnd))
	}
	
	$scope.saveChartName = function() {
		chartService.chartName = $scope.chartName;
	}
	
	$scope.saveSeriesName = function() {
		chartService.seriesName = $scope.seriesName;
	}
	
	$scope.showChart = function() {
		$scope.chartName = chartService.chartName;
		var urlPromise = dataSourceService.getURL(chartService.chosenDatasource, chartService.chosenDatabase, 
				chartService.timeStart, chartService.timeEnd, chartService.chosenSystem, chartService.chosenField, chartService.chosenCategory, 
				chartService.chosenAggregationMethod, chartService.seriesName);
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
			$scope.chart = c3.generate(reportMetadata);
			$scope.showName = true;
			chartService.isShowable = true;
		})
	};
	
	function isEmptyOrNull(value) {
		return (!value || 0 === value.length);
	}
	
	function clearSystem(){
		$scope.chosenSystem = null; 
		$scope.systems = null;
		chartService.chosenSystem = null;
		chartService.systems = null;
	}
	
	function clearCategory(){
		$scope.chosenCategory = null;
		$scope.categories = null;
		chartService.chosenCategory = null;
		chartService.categories = null;
	}
	
	function clearField(){
		$scope.chosenField = null;
		$scope.fields = null;
		chartService.chosenField = null;
		chartService.fields = null;
	}
	
	function clearAggregationMethod(){
		$scope.chosenAggregationMethod = null; 
		$scope.aggregationMethods = null;
		chartService.chosenAggregationMethod = null;
		chartService.aggregationMethods = null;
	}
	

});

