app.controller('chartControl', function ($scope, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.datasources = [];
	$scope.chosenDatasource = null;
	$scope.chosenDatabase = null;
	$scope.databases = [];
	$scope.systems = [];
	$scope.chosenSystem = "";
	
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
	
	$scope.loadDatabases = function(chosenDatasource){
		var databasePromise = dataSourceService.getDatabases(chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})
	}
	
	$scope.loadSystems = function(chosenDatasource){
		var databasePromise = dataSourceService.getDatabases(chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})
	}
//	var systemPromise = systemService.getSystems();
//	systemPromise.then(function(result){
//		$scope.systems = result.data;
//	})
});