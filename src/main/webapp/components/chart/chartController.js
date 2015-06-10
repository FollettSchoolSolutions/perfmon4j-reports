app.controller('chartControl', function ($scope, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.databases = {};
	$scope.chosenDatabase = "";
	$scope.systems = {};
	$scope.chosenSystem = "";
	
	var databasePromise = dataSourceService.getDatabases();
	databasePromise.then(function(result){
		$scope.databases = result.data;
	})
//test commit	
//	var systemPromise = systemService.getSystems();
//	systemPromise.then(function(result){
//		$scope.systems = result.data;
//	})
});