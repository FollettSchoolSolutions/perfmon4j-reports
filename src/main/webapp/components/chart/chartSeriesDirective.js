app.directive('chartSeries', function() {
	return {
		restrict: 'E',
		scope: {allSeries:'=', series:'=', active:'='},
		templateUrl: 'components/chart/chartSeries.html'
	}
})
