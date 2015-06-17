app.factory('chartService', function(){
	
	var pageTitle = "build a chart";
	var datasources = [];
	var chosenDatasource = null;
	var chosenDatabase = null;
	var databases = [];
	var systems = [];
	var fields = [];
	var categories = [];
	var chartName = "";
	var aggregationMethods = [];
	var chosenSystem = "";
	var chosenCategory = "";
	var chosenField = "";
	var chosenAggregationMethod = "";
	var seriesName = "";
	var timeStart = "now-8H";
	var timeEnd = "now";
	var isDisabled = true;
	var showName = false;
	var isShowable = false;

	var factory = {};

	return factory;
});