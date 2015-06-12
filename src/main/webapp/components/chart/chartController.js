app.controller('chartControl', function ($scope, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.datasources = [];
	$scope.chosenDatasource = null;
	$scope.chosenDatabase = null;
	$scope.databases = [];
	$scope.systems = [];
	$scope.chosenSystem = "";
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
	
	$scope.loadDatabases = function(chosenDatasource){
		var databasePromise = dataSourceService.getDatabases(chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})
	}
	
	$scope.loadSystems = function(chosenDatasource, chosenDatasource, timeStart, timeEnd){
		var databasePromise = dataSourceService.getSystems($scope.chosenDatasource, $scope.chosenDatabase, $scope.timeStart, $scope.timeEnd);
		databasePromise.then(function(result){
			$scope.systems = result.data.sort(function(a,b){
				return (parseInt(a.id.substring(a.id.lastIndexOf(".") + 1)) - parseInt(b.id.substring(b.id.lastIndexOf(".") + 1)));
			});
		})
	}
//	var systemPromise = systemService.getSystems();
//	systemPromise.then(function(result){
//		$scope.systems = result.data;
//	})
});