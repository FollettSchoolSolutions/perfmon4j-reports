app.controller('homeControl', function ($scope, $rootScope, dataSourceService, chartService){
	$scope.pageTitle = "This is the home page";
	$scope.charts = [];
	
	var chartFetchPromise = chartService.getCharts();
	chartFetchPromise.then(function(result){
		$scope.charts = result.data;
	})
	
	$scope.showChart = function() {
		$rootScope.toggleView("chart");
	}
	
	$scope.openSideNav = function() {
		chartService.isToggled = true;
	}
	
	$scope.deleteChart = function(id) {
		var deletePromise = chartService.deleteChart(id);
		deletePromise.then(function(result){
			var successful = result.data;
			if (!successful){
				alert("The deletion was not successful! :( " + "The id of this shameful chart is = " + id);
				
				}
			
		})
	}
});