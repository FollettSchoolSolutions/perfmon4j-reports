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
	$scope.series = [new Series()];
	
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
		clearSystem();
		clearCategory();
		clearField();
		clearAggregationMethod();
		chartService.chosenDatabase = $scope.chosenDatabase;
		var databasePromise = dataSourceService.getSystems($scope.chosenDatasource, $scope.chosenDatabase, $scope.timeStart, 
				$scope.timeEnd);
		databasePromise.then(function(result){
			$scope.systems = result.data.sort(function(a,b){
				return (parseInt(a.id.substring(a.id.lastIndexOf(".") + 1)) - parseInt(b.id.substring(b.id.lastIndexOf(".") + 1)));
			});
			chartService.systems = result.data.sort(function(a,b){
				return (parseInt(a.id.substring(a.id.lastIndexOf(".") + 1)) - parseInt(b.id.substring(b.id.lastIndexOf(".") + 1)));
			});
		})
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
				}
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
		return (isEmptyOrNull($scope.chosenDatasource) || isEmptyOrNull($scope.chosenDatabase) 
				|| isEmptyOrNull($scope.chosenSystem) || isEmptyOrNull($scope.chosenCategory) 
				|| isEmptyOrNull($scope.chosenField) || isEmptyOrNull($scope.seriesName) 
				|| isEmptyOrNull($scope.chartName) || isEmptyOrNull($scope.timeStart)
				|| isEmptyOrNull($scope.timeEnd))
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
	
	$scope.showChart = function() {
		$scope.chartName = chartService.chartName;
		var urlPromise = dataSourceService.getURL($scope.chosenDatasource, $scope.chosenDatabase, 
				$scope.timeStart, $scope.timeEnd, $scope.chosenSystem, $scope.chosenField, $scope.chosenCategory, 
				$scope.chosenAggregationMethod, $scope.seriesName);
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
	
	$scope.addSeries = function() {
		$scope.series.push(new Series($scope.seriesName, $scope.chosenSystem, $scope.chosenCategory, $scope.chosenField, $scope.chosenAggregationMethod));
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

