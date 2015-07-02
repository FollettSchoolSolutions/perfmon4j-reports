app.directive('chartSeries', function() {
	return {
		restrict: 'E',
		controller: 'chartSeriesControl',
		scope: {allSeries:'=', series:'=', active:'='},
		templateUrl: '/reports/components/chart/chartSeries.html'
	}
})