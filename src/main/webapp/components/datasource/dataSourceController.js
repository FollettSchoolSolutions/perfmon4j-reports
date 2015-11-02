app.controller('dataSourceControl', function($scope, dataSourceService){
	
	$scope.successfulConnection = null;
	
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
	
	$scope.validateConnection = function(currChart) {
		var connectionCheck = dataSourceService.getDatabases(currChart.chosenDatasource);
		
		connectionCheck.then(function(resultCheck){
			currChart.isAvailable = (resultCheck.status == 200);
		});		
	}
	
	$scope.testConnection = function(){
		var ds = {
				name : $scope.name,
				url : $scope.URL
		}
		
		$scope.successfulConnection = false;
		var connectionCheck = dataSourceService.getDatabases(ds);
		connectionCheck.then(function(resultCheck){
			$scope.successfulConnection = (resultCheck.status == 200);
		});	
	}
	
	$scope.fieldsArePoplated = function(){
		if($scope.name == null || typeof $scope.name == 'undefined' || $scope.name == "" ||	
				$scope.URL == null || typeof $scope.URL == 'undefined' || $scope.URL == ""){
			return false;
		} else {
			return true;
		}
	}
	
	$scope.saveDataSource = function(){
		// TODO fix http adding thing
		$scope.dataSource.name= $scope.name;
		$scope.dataSource.URL= $scope.URL;
		$scope.dataSource.publiclyVisible= $scope.publiclyVisible;
		
		var saveDataSourcePromise = dataSourceService.saveDataSource($scope.dataSource);
		saveDataSourcePromise.then(function(result){
			location.reload();
		});
	}
	
	$scope.editDataSource = function()
	{
		$scope.editDataSource.editName = $scope.name;
		$scope.editDataSource.URL = $scope.URL;
		$scope.editDataSource.id = $scope.id;
		$scope.editDataSource.publiclyVisible= $scope.publiclyVisible;
		
		var editDataSourcePromise = dataSourceService.editDataSource($scope.editDataSource);
		editDataSourcePromise.then(function(result){
			location.reload();
		});
		
	}
	
});