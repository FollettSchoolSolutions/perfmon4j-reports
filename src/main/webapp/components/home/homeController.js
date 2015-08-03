app.controller('homeControl', function ($scope, $location, dataSourceService, chartService){
	$scope.pageTitle = "This is the home page";
	$scope.charts = [];
	
	var chartFetchPromise = chartService.getCharts();
	chartFetchPromise.then(function(result){
		if (result.status != 200) {
			throw new Error("Failed to load charts");
		}
		$scope.charts = result.data;
	}).catch(function onError(err) {
		window.alert("Failed to load charts");
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
			var successful = result.data;
			if(!successful){
				alert("Copying chart with id: " + id + " was NOT successful.");
			}
			$location.path("/");
		});
	}
});