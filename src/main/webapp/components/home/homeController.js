app.controller('homeControl', function ($scope, $rootScope, dataSourceService){
	$scope.pageTitle = "this is the home page";
	
	$scope.showChart = function() {
		$rootScope.toggleView("chart");
	}
});