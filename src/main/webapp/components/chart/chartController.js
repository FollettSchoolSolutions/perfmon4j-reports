app.controller('chartControl', function ($scope, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.datasources = [];
	$scope.chosenDatasource = null;
	$scope.chosenDatabase = null;
	$scope.databases = [];
	$scope.systems = [];
	$scope.fields = [];
	$scope.categories = [];
	$scope.aggregationMethods = [];
	$scope.chosenSystem = "";
	$scope.chosenCategory = "";
	$scope.chosenField = "";
	$scope.chosenAggregationMethod = "";
	$scope.timeStart = "now-8H";
	$scope.timeEnd = "now";
	
	
	var datasourcePromise = dataSourceService.getDataSources();
	datasourcePromise.then(function(result){
		$scope.datasources = result.data;
		
		if ($scope.datasources.length > 0) {
			$scope.selectDatasource($scope.datasources[0]);
		}
	})
	
	$scope.selectDatasource = function(datasource) {
		$scope.chosenDatasource = datasource;
		
		var databasePromise = dataSourceService.getDatabases(datasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})
		
	}
	
	$scope.loadDatabases = function(){
		var databasePromise = dataSourceService.getDatabases($scope.chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})
	}
	
	$scope.loadSystems = function(){
		var databasePromise = dataSourceService.getSystems($scope.chosenDatasource, $scope.chosenDatabase, $scope.timeStart, $scope.timeEnd);
		databasePromise.then(function(result){
			$scope.systems = result.data.sort(function(a,b){
				return (parseInt(a.id.substring(a.id.lastIndexOf(".") + 1)) - parseInt(b.id.substring(b.id.lastIndexOf(".") + 1)));
			});
		})
	}
	
	$scope.loadCategories = function(){
		var databasePromise = dataSourceService.getCategories($scope.chosenDatasource, $scope.chosenDatabase, $scope.chosenSystem, $scope.timeStart, $scope.timeEnd);
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
	}
	
	$scope.loadFields = function(){
		var databasePromise = dataSourceService.getFields($scope.chosenDatasource, $scope.chosenDatabase, $scope.chosenCategory);
		databasePromise.then(function(result){
			console.log(result.data[0].fields);
			$scope.fields = result.data[0].fields;
		})
	}
	
	$scope.loadAggregations = function(){
		$scope.chosenAggregationMethod = $scope.chosenField.defaultAggregationMethod;
		$scope.aggregationMethods = $scope.chosenField.aggregationMethods;
	}
//	var systemPromise = systemService.getSystems();
//	systemPromise.then(function(result){
//		$scope.systems = result.data;
//	})
});
















