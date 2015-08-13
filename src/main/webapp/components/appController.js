app.controller('appControl', function ($scope, $location, $rootScope, $window, dataSourceService, chartService){
	$scope.loginLabel="Login to Github";
	$scope.name="test";
	$rootScope.clearChartName = function() {
		chartService.chartName = "";
		chartService.isShowable = false; //we need to do this so that subsequent chart renders following the first do not show the chart name before rendering.
		chartService.successfullySaved = null; //we need to do this to reset save message between chart creation.
	}
	
	$scope.goHome = function() {
		$location.path("/home");
	}
	
	$scope.showHomeButton = function() {
		var url = $location.url();
		if(url.indexOf("home") < 0){
			return false;
		} else {
			return true;
		}
	}
	$scope.LoginWithGitHub = function()
	{
		//GitHubSSOServlet.GitHubSSOServlet();
		$window.location='callback/sso?launch=true';
		
		//$location.path('authentication?launch=true')
		$scope.islogin = true;
		
		
	}
	
});