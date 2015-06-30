app.factory('chartService', function(){
	
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

	var factory = {};
	
	

	return factory;
});