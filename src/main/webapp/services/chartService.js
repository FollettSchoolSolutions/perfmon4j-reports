app.factory('chartService', function($http){
	var sideNavButtonName = "Test";
	
	var pageTitle = "build a chart";
	
	var viewOnly = false;
	
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
	var isChartLoading = false;
	var isToggled = true;
	var active = true;	
	var systems = [];
	var categories = [];
	var fields = [];
	var aggregationMethods = [];
	var factory = {};
	var successfullySaved = null;
	
	factory.saveChart = function(chart) {
		var chartObj = angular.copy(chart);
		for (var i=0; i< chartObj.series.length; i++){
			chartObj.series[i].category = chartObj.series[i].category.name; 
			chartObj.series[i].field = chartObj.series[i].field.name; 
			var systemsString = "";
			for (var j=0; j< chartObj.series[i].systems.length; j++) {
				if (j != 0) {
					systemsString += ",";
				}
				systemsString += chartObj.series[i].systems[j].id;
			}
			chartObj.series[i].systems = systemsString;
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

	
	factory.getChart = function(id){
        return $http.get("rest/charts/" + id).then(function(result) {
                return result;
        });
	}

	
	factory.deleteChart = function(id){
        return $http['delete']("rest/charts/" + id).then(function(result) {
                return result;
        });
	}
	
	factory.copyChart = function(id){
		var date = new Date();
		//(date.getYear() + 1900 )+"-"+ (date.getMonth()+1) +"-"+ date.getDay() +"T"+ date.getHours() +":"+ date.getMinutes();
		return $http.get("rest/charts/" + id).then(function(result) {
            var copy = angular.copy(result);
            copy.data.chartName = copy.data.chartName + " COPY at " + (date.getYear() + 1900 )+"-"+ (date.getMonth()+1) +"-"+ date.getDay() +"T"+ date.getHours() +":"+ date.getMinutes();
            copy.data.id = null;
            return $http.post('rest/charts', copy.data).then(function(result) {
    			return result;
    		});
		});
	}
	


	return factory;
});