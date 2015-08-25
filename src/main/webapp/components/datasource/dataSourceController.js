app.controller('dataSourceControl', function($scope, dataSourceService){
	
	$scope.dataSource=
	{
		name : "DANIEL",
		URL : "172.16.16.64"
	};
	
	$scope.saveDataSource = function($http){
		
		var savaDataSourcePromise = dataSourceService.saveDataSource($scope.dataSource);
		
	}
});