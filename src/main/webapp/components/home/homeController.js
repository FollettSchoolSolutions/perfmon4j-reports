app.controller('homeControl', function ($scope, $rootScope, dataSourceService, chartService){
	$scope.pageTitle = "This is the home page";
	
	$scope.showChart = function() {
		$rootScope.toggleView("chart");
	}
	
	$scope.openSideNav = function() {
		chartService.isToggled = true;
	}
});