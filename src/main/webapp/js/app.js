var app = angular.module("perfmonReportsApp", ['ngRoute','ngMaterial','ngMdIcons']);
app.config(function($routeProvider, $mdThemingProvider) {
	$mdThemingProvider.theme('default')
	  .primaryPalette('grey', {
		  'default': '700'
	  })
	  .accentPalette('blue-grey');
	
	$routeProvider.when('/home', {
		templateUrl : 'components/home/home.html',
		controller : 'homeControl'
	}).when('/chart', {
		templateUrl : 'components/chart/chart.html',
		controller : 'chartControl'
	}).when('/chart/:id', {
		templateUrl : 'components/chart/chart.html',
		controller : 'chartControl'
	}).otherwise({
		redirectTo : '/home'
	});
});