app.directive('chartSeries', function() {
	return {
		restrict: 'E',
		controller: 'chartSeriesControl',
		scope: {allSeries:'=', series:'=', active:'='},
		templateUrl: 'components/chart/chartSeries.html'
	}
})