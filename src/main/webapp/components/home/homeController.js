app.controller('homeControl', function ($scope, $location, dataSourceService, chartService, $mdDialog){
	$scope.pageTitle = "This is the home page";
	$scope.charts = [];
	$scope.name = "";
	$scope.URL = "";
	$scope.DataSource= "";
	
	
	var dataSourceFetchPromise = dataSourceService.getDataSources();
	dataSourceFetchPromise.then(function(result){
		if (result.status != 200) {
			throw new Error("Failed to load Stuff : " + result.status);
		}
		$scope.DataSource = result.data;
	}).catch(function onError(err) {
		window.alert("Failed to load Stuff " + err.message );
	})
		
		
	var chartFetchPromise = chartService.getCharts();
	chartFetchPromise.then(function(result){
		if (result.status != 200) {
			throw new Error("Failed to load charts : " + result.status);
		}
		
		$scope.charts = result.data;
	}).catch(function onError(err) {
		window.alert("Failed to load charts " + err.message );
	})
	
	$scope.showChart = function() {
		
		$location.path("/chart");
	}
	
	$scope.openSideNav = function() {
		chartService.isToggled = true;
	}
	
	$scope.deleteChart = function(id) {
		var deletePromise = chartService.deleteChart(id);
		deletePromise.then(function(result){
			var successful = result.data;
			if (!successful){
				alert("Deleting chart with id: " + id + " was NOT successful.");
			}
			$location.path("/");
		});
	}
	
	$scope.copyChart = function(id){
		var copyPromise = chartService.copyChart(id);
		copyPromise.then(function(result){
			if(result.status != 204){
				alert("Copying chart with id: " + id + " was NOT successful.");
			}
			$location.path("/");
		});
	}
	
	$scope.showDataSources = function(ev) {
	    $mdDialog.show({
	      controller: DataSourceController,
	      templateUrl: 'components/datasource/datasource.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	    });
	}
});

	function DataSourceController($scope, $mdDialog, dataSourceService) {
	 //$scope.name = dataSourceService.name;
	 //$scope.URL = dataSourceService.URL;

	  
	  $scope.saveDatasource = function() {
	  dataSourceService.name = $scope.name;
	  dataSourceService.URL = $scope.URL;
	  dataSourceControl.saveDataSource();
  }
	  
	
	  $scope.answer = function(answer) {
	   $mdDialog.hide(answer);
	 };
	 
	};