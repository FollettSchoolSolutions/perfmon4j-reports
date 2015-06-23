app.controller('chartRenderControl', function ($scope, chartService, dataSourceService){
	$scope.showName = false;
	
	$scope.isShowable = function() {
		return chartService.isShowable;
	}
	
	$scope.name = function() {
		return chartService.chartName;
	}
	
})