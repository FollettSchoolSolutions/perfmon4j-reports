app.controller('appControl', function ($scope, $rootScope, dataSourceService, chartService){
	$scope.showView = "home";
	
	$rootScope.toggleView = function(viewName) {
		$scope.showView = viewName;
		
	}
	
	$rootScope.clearChartName = function() {
		chartService.chartName = "";
		chartService.isShowable = false; //we need to do this so that subsequent chart renders following the first do not show the chart name before rendering.
		chartService.successfullySaved = null; //we need to do this to reset save message between chart creation.
	}
});