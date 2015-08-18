app.controller('appControl', function ($scope, $location, $rootScope, $window, dataSourceService, chartService, $http){
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
		$window.location='callback/sso?launch=true';
		
	}
	
	$scope.logout = function() {
		
		document.cookie = '.github.com_logged_in =; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		$window.location ='callback/sso?logout=true';
		
	};
	
	$scope.loggedIn = function(boolean)
	{
		if(boolean==true){
			return true;
		}
		else 
			return false;
		
		
	}
	
});