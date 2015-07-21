app.controller('homeControl', function ($scope, $location, dataSourceService, chartService){
	$scope.pageTitle = "This is the home page";
	$scope.charts = [];
	
	var chartFetchPromise = chartService.getCharts();
	chartFetchPromise.then(function(result){
		$scope.charts = result.data;
	})
	
	$scope.showChart = function() {
		$location.path("/chart");
	}
	
	$scope.openSideNav = function() {
		chartService.isToggled = true;
	}
});