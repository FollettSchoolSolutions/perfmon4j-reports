app.factory('chartService', function($http){
	
	var pageTitle = "build a chart";
	
	var chosenDatasource = "";
	var chosenDatabase = "";
	var chartName = "";
	var chosenSystem = "";
	var chosenCategory = "";
	var chosenField = "";
	var chosenAggregationMethod = "";
	var chosenSeries = new Series();
	var seriesName = "";
	var timeStart = "";
	var timeEnd = "";
	var systems = [];
	var isDisabled = true;
	var showName = false;
	var isShowable = false;
	var isToggled = true;
	var active = true;	
	var systems = [];
	var categories = [];
	var fields = [];
	var aggregationMethods = [];
	var factory = {};
	
	factory.saveChart = function(chart) {
		var chartObj = angular.copy(chart);
		for (var i=0; i< chartObj.series.length; i++){
			chartObj.series[i].category = chartObj.series[i].category.name; 
			chartObj.series[i].field = chartObj.series[i].field.name; 
			chartObj.series[i].system = chartObj.series[i].system.id;
		}
		chartObj.chosenDatasource = chartObj.chosenDatasource.host;
		chartObj.chosenDatabase = chartObj.chosenDatabase.id;
		
		
		
		return $http.post('rest/charts', chartObj).then(function(result) {
			return result;
		});
	}
	
	factory.getCharts = function(){
		return $http.get("rest/charts").then(function(result) {
			return result;
		});
	}

	return factory;
});