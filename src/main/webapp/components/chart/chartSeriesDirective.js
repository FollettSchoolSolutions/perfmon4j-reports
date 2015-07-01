app.directive('chartSeries', function() {
	return {
		restrict: 'E',
		controller: 'chartSeriesControl',
		scope: {series:'=', active:'='},
		templateUrl: '/reports/components/chart/chartSeries.html'
	}
})