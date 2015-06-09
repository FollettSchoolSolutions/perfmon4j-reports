app.controller('appControl', function ($scope, $rootScope, dataSourceService){
	$scope.showView = "home";
	
	$rootScope.toggleView = function(viewName) {
		$scope.showView = viewName;
	}
});