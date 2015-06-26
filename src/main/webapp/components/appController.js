app.controller('appControl', function ($scope, $rootScope, dataSourceService, chartService){
	$scope.showView = "home";
	
	$rootScope.toggleView = function(viewName) {
		$scope.showView = viewName;
	}
	
	$rootScope.clearChartName = function() {
		chartService.chartName = "";
	}
});