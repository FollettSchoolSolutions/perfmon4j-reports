app.factory('chartService', function($http){
	var VERSION_1 = 1;
	
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
	var primaryAxisName = "";
	var secondaryAxisName = "";
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
	
	factory.saveOrUpdateChart = function(chart) {
		if(chart.id == "0"){
			chart.id = factory.makeid();
		//The chart object being passed in has a chart.chosenDataSource.id field. We want to put this id into it's own column in the database
		}
		return $http.put("rest/charts/" + chart.id+"/"+ chart.chosenDatasource.id, chart).then(function(result) {
			return result;
		});
	}
	
	// stolen from http://stackoverflow.com/a/1349426
	factory.makeid = function(){
	    var id = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 6; i++ )
	        id += possible.charAt(Math.floor(Math.random() * possible.length));

	    return id;
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
            var copy = angular.copy(result.data);
            var regex = /\sCOPY\[\d+\]/;
            
            copy.chartName = copy.chartName.replace(regex, "");
            
            copy.chartName = copy.chartName + " COPY[" + date.getTime() + "]";
//            copy.chartName = copy.chartName + " COPY at " + (date.getYear() + 1900 )+"-"+ (date.getMonth()+1) +"-"+ date.getDay() +"T"+ date.getHours() +":"+ date.getMinutes();
            copy.id = factory.makeid();
            return $http.put("rest/charts/" + copy.id, copy).then(function(result) {
    			return result;
    		});
		});
	}
	


	return factory;
});