app.controller('homeControl', function ($scope, dataSourceService){
	$scope.pageTitle = "this is the home page";
	$scope.databases = {};
	
	var databasePromise = dataSourceService.getDatabases();
	databasePromise.then(function(result){
		$scope.databases = result.data;
	})
});