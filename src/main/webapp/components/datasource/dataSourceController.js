app.controller('dataSourceControl', function($scope, dataSourceService){
	
	$scope.dataSource=
	{
		name : "Test",
		URL : "127.0.0.1"
	};
	
	$scope.saveDataSource = function($http){
		
		var savaDataSourcePromise = dataSourceService.saveDataSource($scope.dataSource);
		
	}
});