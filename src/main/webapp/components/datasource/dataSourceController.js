app.controller('dataSourceControl', function($scope, dataSourceService){
	
	var name = "";
	var url = "";
	
	$scope.dataSource=
	{
		name : "",
		URL : ""
	};
	
	
	//$scope.ChosenDataSource=
	//{
	//	name : dataSourceService.name,
	//	URL : "172.16.16.64"
	//};
	
	$scope.saveDataSource = function(){
		
		$scope.dataSource.name= $scope.name;
		$scope.dataSource.URL= $scope.URL;
		
		var savaDataSourcePromise = dataSourceService.saveDataSource($scope.dataSource);
		
	}
	
});