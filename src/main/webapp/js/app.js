var app = angular.module("perfmonReportsApp", ['ngMaterial','ngMdIcons']);
app.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
	  .primaryPalette('grey', {
		  'default': '700'
	  })
	  .accentPalette('blue-grey');
});