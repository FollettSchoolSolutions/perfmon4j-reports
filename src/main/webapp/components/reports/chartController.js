app.controller('chartControl', function ($scope, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.databases = {};
	
	var databasePromise = dataSourceService.getDatabases();
	databasePromise.then(function(result){
		$scope.databases = result.data;
	})
});