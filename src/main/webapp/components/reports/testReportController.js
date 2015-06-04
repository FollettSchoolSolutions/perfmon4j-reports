app.controller('testReportControl', function ($scope, dataSourceService){
	$scope.message = "title goes here";
	$scope.databases = {};
	
	var databasePromise = dataSourceService.getDatabases();
	databasePromise.then(function(result){
		$scope.databases = result.data;
	})
});