app.controller('dataSourceControl', function($scope, dataSourceService){
	
	var name = "";
	var url = "";
	var id = "";
	$scope.dataSource=
	{
		name : "",
		URL : ""
	};
	
	$scope.editDataSource=
		{
			editName : "What",
			URL: "",
			id: ""
		};
	
	//$scope.ChosenDataSource=
	//{
	//	name : dataSourceService.name,
	//	URL : "172.16.16.64"
	//};
	
	$scope.urlInfoPopup = function(){
		
	}
	
	$scope.saveDataSource = function(){
		// TODO fix http adding thing
		$scope.dataSource.name= $scope.name;
		$scope.dataSource.URL= $scope.URL;
		
		var savaDataSourcePromise = dataSourceService.saveDataSource($scope.dataSource);
		location.reload();
	}
	
	$scope.editDataSource = function()
	{
		$scope.editDataSource.editName = $scope.name;
		$scope.editDataSource.URL = $scope.URL;
		$scope.editDataSource.id = $scope.id;
		
		var editDataSourcePromise = dataSourceService.editDataSource($scope.editDataSource);
		location.reload();
		
	}
	
});