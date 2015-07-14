app.controller('chartRenderControl', function ($scope, chartService, dataSourceService){
	$scope.showName = false;
	
	$scope.isShowable = function() {
		return chartService.isShowable;
	}
	
	$scope.name = function() {
		return chartService.chartName;
	}
	
	$scope.isChartLoading = function() {
		return chartService.isChartLoading;
	};
	
	$scope.isSuccessfullySaved = function(){
		return chartService.successfullySaved;
	};
})