app.controller('chartControl', function ($scope, $routeParams, $mdDialog, $timeout, chartService, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.saveOrUpdateChartLabel = "Save";
	$scope.saveConfirmationLabel = "saved";
	$scope.datasources = [];
	$scope.databases = [];
	$scope.systems = [];
	$scope.fields = [];
	$scope.categories = [];
	$scope.aggregationMethods = [];
	$scope.isLoadingchart = false;
	var seriesCounter = 0;

	var date = new Date();
	
	$scope.chart = {
			chosenDatasource : null,
			chosenDatabase : null,
			chartName : "",
			timeStart : "now-4H",
			timeEnd : "now",
			publiclyVisible : false,
			id : "0",
			primaryAxisName : "",
			secondaryAxisName : "",
			series : null
	};
	
	chartService.chartName = $scope.chart.chartName;
	
	$scope.showName = false;
	$scope.chartId = "0";
	$scope.addToggled = false;
	$scope.seriesUrl = "";
	$scope.seriesAliases = "";
	$scope.activeSeries = 0;
	var active = chartService.active;
	
	
	var datasourcePromise = dataSourceService.getDataSources();
	datasourcePromise.then(function(result){
		$scope.datasources = result.data;
		
		if (typeof $routeParams.id != 'undefined' && typeof $routeParams.mode == 'undefined'){
			chartService.isToggled = false;
			chartService.viewOnly = true;
			var chartPromise = chartService.getChart($routeParams.id);
			chartPromise.then(function(result){
				$scope.chart = result.data;
				$scope.saveChartName();
				$scope.showChart();
			})	
		} else {
			chartService.viewOnly = false;
			if($routeParams.mode == 'edit'){
				var chartPromise = chartService.getChart($routeParams.id);
				chartPromise.then(function(result){
					$scope.chartToEdit = result.data;
					$scope.chart.chosenDatasource = $scope.lookupDataSource(result.data.chosenDatasource);
					$scope.loadDatabases();
					
					$scope.chart.chartName = result.data.chartName;
					$scope.chart.timeStart = result.data.timeStart;
					$scope.chart.timeEnd = result.data.timeEnd;
					$scope.chart.publiclyVisible = result.data.publiclyVisible;
					$scope.chart.id = chartService.id = result.data.id;
					$scope.chart.primaryAxisName = chartService.primaryAxisName = result.data.primaryAxisName;
					$scope.chart.secondaryAxisName = chartService.secondaryAxisName = result.data.secondaryAxisName;
					$scope.saveChartName();
				})
			} else {
				if ($scope.datasources.length > 0) {
					$scope.chart.chosenDatasource = $scope.datasources[0];
					$scope.loadDatabases();
				}
			}
		}
	})		
	
	$scope.lookupDataSource = function(ds) {
		var matchingDs = null;
		
		for (var i = 0; i < $scope.datasources.length; i++) {
			var datasource = $scope.datasources[i];
			if (datasource.id == ds.id) {
				matchingDs = datasource;
			}
		}
		
		return matchingDs;
	}
	
	$scope.lookupDatabase = function(db) {
		var matchingDb = null;
		
		for (var i = 0; i < $scope.databases.length; i++) {
			var database = $scope.databases[i];
			if (database.id == db.id) {
				matchingDb = database;
			}
		}
		
		return matchingDb;
	}
	
	
	
	function isNullOrUndefined(obj){
		return (obj == null || typeof obj == 'undefined');
	}
	
	$scope.loadDatabases = function(){
		if(!isNullOrUndefined($scope.chart.series)){
			if($scope.chart.series.length == 1 && $scope.chart.series[0].editInit == false){
				$scope.chartToEdit = null;
				clearSeries();
			}
		}
		var date = new Date();
		clearDatabase();
		clearAggregationMethod();
		chartService.chosenDatasource = $scope.chart.chosenDatasource;
		chartService.timeStart = $scope.chart.timeStart;
		chartService.timeEnd = $scope.chart.timeEnd;
		var databasePromise = dataSourceService.getDatabases(chartService.chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
			
			if (isNullOrUndefined($scope.chart.chosenDatabase)) {
				if (!isNullOrUndefined($scope.chartToEdit)) {
					$scope.chart.chosenDatabase = chartService.chosenDatabase = $scope.lookupDatabase($scope.chartToEdit.chosenDatabase);
					$scope.initSeries();
				}
			}
			
			
		})
	};
	
	$scope.renderDisabled = function(){
		var activeSeries = null;
		if (!isNullOrUndefined($scope.chart.series)) {
			for (var i = 0; i < $scope.chart.series.length; i++){
				if ($scope.chart.series[i].active){
					activeSeries = $scope.chart.series[i];
	
					break;
				}
			}
		}
		
		if ($scope.invalidSeriesNames()) {
			return true;
		}
		
		if ($scope.incompleteSeriesExists()){
			return true;
		}
		
		if (!$scope.validateSeriesName()) {
			return true;
		}
		
		return (isEmptyOrNull($scope.chart.chosenDatasource) || isEmptyOrNull($scope.chart.chosenDatabase) 
				|| isEmptyOrNull(activeSeries.systems) || isEmptyOrNull(activeSeries.category) 
				|| isEmptyOrNull(activeSeries.field) || isEmptyOrNull(activeSeries.name) 
				|| isEmptyOrNull($scope.chart.chartName) || isEmptyOrNull($scope.chart.timeStart)
				|| isEmptyOrNull($scope.chart.timeEnd));
	}
	
	$scope.isLoading = function(chosenOne, options){
		return !isEmptyOrNull(chosenOne) && isEmptyOrNull(options);
	}
	
	$scope.saveChartName = function() {

		chartService.chartName = $scope.chart.chartName;
	}
	
	$scope.toggleClose = function() {
		chartService.isToggled = false;
		c3.resize();
	}
	
	$scope.cleanSeriesUrl = function() {
		var cleanUrl="";
		var systems= "";
		var category="";
		var field="";
		var agg="";
		
		for (var i=0; i<$scope.chart.series.length; i++)
			{
				if (i!= 0){
					cleanUrl += "_";
				}
				agg = $scope.chart.series[i].aggregationMethod + "~";
				cleanUrl += agg; 
				
				for (j=0; j< $scope.chart.series[i].systems.length; j++){
					systems += $scope.chart.series[i].systems[j].id + "~";
				}
				category = $scope.chart.series[i].category.name;
				field = $scope.chart.series[i].field.name;
				
				cleanUrl += systems + category + "~" + field;
				systems = "";
			}
		
		console.log(cleanUrl);
		return cleanUrl;
		
		
	}
	
	$scope.showChart = function() {
		setTimeout(function(){
			if (chartService.isChartLoading===true){
				$mdDialog.show(
			      $mdDialog.alert()
			        .parent(angular.element(document.querySelector('#popupContainer')))
			        .clickOutsideToClose(true)
			        .title('Chart Render Failure')
			        .content('The chart failed to render. Connection to database may have been lost.')
			        .ariaLabel('Chart Render Failure')
			        .ok('OK')
			    );
			}
		
		}, 60000);
		chartService.successfullySaved = null;
		chartService.isShowable = false;
		chartService.isChartLoading = true;
		$scope.seriesUrl = $scope.cleanSeriesUrl();
		listSeriesAliases();

		var urlPromise = dataSourceService.getURL($scope.chart.chosenDatasource.url, $scope.chart.chosenDatabase.id, 
				$scope.chart.timeStart, $scope.chart.timeEnd, $scope.seriesUrl, $scope.seriesAliases);
		
		var relative = isRelativeTimeRange();
		urlPromise.then(function(result){
			var reportMetadata = {
				data: result.data,
				axis: {
			       x: {
			           type: 'timeseries',
			           tick: {
			               format: '%Y-%m-%dT%H:%M'
			           }
			       },
			       y: {
			    	   min: 0,
			    	   padding: {
			    		   bottom: 0
			    	   }
			       },
				   y2: {
					   show: false,
					   min: 0,
					   padding: {
						   bottom: 0
					   }
				   }
			   },
			   subchart: {
			    	show: false
			    },
			    zoom: {
			    	rescale: true
			    }
			};
			result.data.axes = {};
			for (var i = 0; i < $scope.chart.series.length; i++) {
				if ($scope.chart.series[i].secondaryAxis) {
					result.data.axes[$scope.chart.series[i].name] = 'y2';
					reportMetadata.axis.y2.show = true;
					if (!isEmptyOrNull($scope.chart.secondaryAxisName)) {
						reportMetadata.axis.y2.label = $scope.chart.secondaryAxisName;
					}
				} else {
					result.data.axes[$scope.chart.series[i].name] = 'y';
				}
			}  
			
			if (!isEmptyOrNull($scope.chart.primaryAxisName)) {
				reportMetadata.axis.y.label = $scope.chart.primaryAxisName;
			}
			   
			if (result.data.columns[0].length > 120) {
				reportMetadata.subchart.show = true;
			} else {
				reportMetadata.subchart.show = false;
			}
			
			if (result.data.columns[0].length > 1440 || !relative) {
				reportMetadata.axis.x.tick.format = '%Y-%m-%dT%H:%M';
			} else {
				reportMetadata.axis.x.tick.format = '%H:%M';

			}
			$scope.showName = true;
			chartService.isChartLoading = false;
			chartService.isShowable = true;
			var chartObj = c3.generate(reportMetadata);
			$timeout(chartObj.flush, 100);
		})
	};
	
	$scope.saveOrUpdateChart = function($http){
		chartService.successfullySaved = null;
		chartService.isChartLoading = true;
		
		var saveChartPromise = chartService.saveOrUpdateChart($scope.chart);
		
		saveChartPromise.then(function(result){
			if (result.status != 204) {
				throw new Error("Failed to save chart");
			} else {
				console.log("Chart saved successfullly.");
				chartService.successfullySaved = true;
				
				// Initial save
				if($scope.chartId == "0"){
					$scope.saveOrUpdateChartLabel = "Update";
					$scope.saveConfirmationLabel = "saved";
					$scope.chartId = angular.copy($scope.chart.id);
				} else {
					$scope.saveConfirmationLabel = "updated";
				}
			}
			chartService.isChartLoading = false;
		}).catch(function onError(err) {
			$mdDialog.show(
		      $mdDialog.alert()
		        .parent(angular.element(document.querySelector('#popupContainer')))
		        .clickOutsideToClose(true)
		        .title('Chart Save Failure')
		        .content('The chart failed to save.')
		        .ariaLabel('Chart Save Failure')
		        .ok('OK')
		    );
			chartService.isChartLoading = false;
		})
	
		
	};
	
	$scope.saveDisabled = function () {
		if(chartService.isShowable == true){
			if($scope.renderDisabled() == true){
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	
	$scope.getSaveConfirmationLabel = function() {
		return  "Successfully " + $scope.saveConfirmationLabel + " the chart.";
	}

	$scope.clearAllFields = function() {
		chartService.isShowable = false;
		chartService.successfullySaved = null;
		$scope.chart.chosenDatasource = $scope.datasources[0];
		$scope.loadDatabases();
		clearChartName();
		clearTimeStart();
		clearTimeEnd();
		clearSeries();
	}
	
	$scope.showSeries = function(index) {
		return $scope.activeSeries == index;	
	}
	
	$scope.setActiveSeries = function(index) {

		if( (!angular.isDefined($scope.chart.series)) || $scope.chart.series.length == 0){
			$scope.chart.series = [{}];	
		}
		
		for(var i = 0; i < $scope.chart.series.length; i++){
			$scope.chart.series[i].active = false;
		}
		
		$scope.chart.series[index].active = true;
	}
	
	$scope.addSeries = function() {
		seriesCounter = seriesCounter + 1;
		chartService.successfullySaved = null;
		for (var i = 0; i < $scope.chart.series.length; i++){
			$scope.chart.series[i].active = false;
		}

		var newSeriesName = "";
		var newSeries = {active: true, name: newSeriesName, secondaryAxis: false};
		$scope.chart.series.push(newSeries);
	}
	
	$scope.initSeries = function() {
		if (isNullOrUndefined($scope.chart.series)) {
			if (!isNullOrUndefined($scope.chartToEdit)) {
				$scope.chart.series = $scope.chartToEdit.series;				
			} else {
				if($scope.chart.chosenDatabase != null){
					$scope.chart.series = [{active: true, name: '', secondaryAxis: false}];
					seriesCounter++;
				}
			}
		} else {		
			clearSeries();
			if($scope.chart.chosenDatabase != null && $scope.chartToEdit == null){
				$scope.chart.series = [{active: true, name: '', secondaryAxis: false}];
				seriesCounter = 1;
			}
		}
		
		chartService.chosenDatabase = $scope.chart.chosenDatabase;
		chartService.timeStart = $scope.chart.timeStart;
		chartService.timeEnd = $scope.chart.timeEnd;
		chartService.chartName = $scope.chart.chartName;
		if ((!angular.isDefined($scope.chart.series) || $scope.chart.series.length == 0) && $scope.chart.chosenDatabase != null) {
			$scope.setActiveSeries(0);
		}				
	}
	
	$scope.disableTopOptions = function() {

		if (!isNullOrUndefined($scope.chart.series)) {
			if ($scope.chart.series.length > 1) {
				return true;
			}
		}
		return false;
	}
	
	$scope.invalidSeriesNames = function() {
		if (!isNullOrUndefined($scope.chart.series)) {		
			for (var i = 0; i < $scope.chart.series.length; i++) {
				for (var j = i + 1; j < $scope.chart.series.length; j++) {
					if ($scope.chart.series[i].name === $scope.chart.series[j].name) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	$scope.incompleteSeriesExists = function(){
		if (!isNullOrUndefined($scope.chart.series)) {
			for(var i=0; i<$scope.chart.series.length; i++){
				var currSeries = $scope.chart.series[i];
				var incomplete = (isEmptyOrNull(currSeries.systems) || isEmptyOrNull(currSeries.category) 
						|| isEmptyOrNull(currSeries.field) || isEmptyOrNull(currSeries.name));
				if(incomplete == true){
					return true;
				}
			}
		}
		return false;
	}
	
	$scope.validateSeriesName = function() {
		if (!isNullOrUndefined($scope.chart.series)) {
			for (var i = 0; i < $scope.chart.series.length; i++) {
				if (!isEmptyOrNull($scope.chart.series[i].name) ) {
					var result = /^[^_#&]+$/.test($scope.chart.series[i].name);
					if (!result) {
						return false;
					}
				}
			}
		}
		return true;
	}
	
	$scope.showAdvanced = function(ev) {
	    $mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'components/chart/advancedOptionsDialog.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	    })
	    .then(function(answer) {
	    	$scope.chart.primaryAxisName = chartService.primaryAxisName;
	    	$scope.chart.secondaryAxisName = chartService.secondaryAxisName;
	    });
	  }
	
	$scope.timeParamsPopulated = function(){
		if(($scope.chart.timeStart == null || $scope.chart.timeStart == "") || ($scope.chart.timeEnd == null || $scope.chart.timeEnd == "")){
			return false;
		} else {
			return true;
		}
	}
	
	$scope.enableTimeAdjustmentControls = function(){
		return (chartService.viewOnly);
	}
	
	
	function isRelativeTimeRange() {
		if ($scope.chart.timeStart.indexOf("now") > -1 || $scope.chart.timeEnd.indexOf("now") > -1) {
			return true;
		} else {
			return false;
		}
	}
	
	function inArray(item) {

		for (var i = 0; i < $scope.chart.series.length; i++) {
			if (item.name == $scope.chart.series[i].name &&
				item.systems == $scope.chart.series[i].systems &&
				item.category == $scope.chart.series[i].category &&
				item.field == $scope.chart.series[i].field &&
				item.aggregationMethod == $scope.chart.series[i].aggregationMethod) {
				return true;
			}
		}
		return false;
	}
	
	function listSeriesAliases() {
		$scope.seriesAliases = "";
		for (var i = 0; i < $scope.chart.series.length; i++) {
			if (i != 0) {
				$scope.seriesAliases += "_";
			}
			$scope.seriesAliases += $scope.chart.series[i].name;
		}
	}
	
	function isEmptyOrNull(value) {
		return (!value || 0 === value.length);
	}
	
	function clearDatabase(){
		$scope.chart.chosenDatabase = null;
		$scope.databases = [];
		chartService.chosenDatabase = null;
	}

	function clearSystems(){
		$scope.chosenSystems = null; 
		$scope.systems = [];
		chartService.chosenSystems = null;
	}
	
	function clearCategory(){
		$scope.chosenCategory = null;
		$scope.categories = [];
		chartService.chosenCategory = null;
	}
	
	function clearField(){
		$scope.chosenField = null;
		$scope.fields = [];
		chartService.chosenField = null;
	}
	
	function clearAggregationMethod(){
		$scope.chosenAggregationMethod = null; 
		$scope.aggregationMethods = [];
		chartService.chosenAggregationMethod = null;
	}
	
	function clearChartName(){

		$scope.chart.chartName = "";
	}
	
	function clearTimeStart(){
		$scope.chart.timeStart = "now-4H";
		chartService.timeStart = "";
	}
	
	function clearTimeEnd(){
		$scope.chart.timeEnd = "now";
		chartService.timeEnd = "";
	}
	
	function clearSeries(){
		$scope.chart.series = [];
	}
	
	$scope.isViewOnly = function (){
		return chartService.viewOnly;
	}
	
	$scope.viewParameterInfo = function($event) {
       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         templateUrl:'components/chart/chartViewParameterInfo.html',
         locals: {
           chart: $scope.chart
         },
         controller: viewParameterInfoController
      });
    }

});

function viewParameterInfoController(scope, $mdDialog, $sce, chart) {
	var chartObj = {
			title : chart.chartName,
			ispublic : chart.publiclyVisible,
			datasource : {},
			database : chart.chosenDatabase.name,
			starttime : chart.timeStart,
			endtime : chart.timeEnd,
			series : []
	}
	chartObj.datasource.name =  chart.chosenDatasource.name;
	chartObj.datasource.url =  chart.chosenDatasource.url;
	
	for(var i = 0; i < chart.series.length; i++){
		var currSeries = chart.series[i];
		var seriesObj = {
				systems : []
		}
		
		seriesObj.title = currSeries.name;
		for(var j = 0; j < currSeries.systems.length; j++){
			seriesObj.systems.push(currSeries.systems[j].name);
		}
		seriesObj.category = currSeries.category.name;
		seriesObj.field = currSeries.field.name;
		seriesObj.aggregation = currSeries.aggregationMethod;
		chartObj.series.push(seriesObj);
	}
	var tmp = angular.toJson(chartObj);
    scope.tableDiv = JsonHuman.format(chartObj).innerHTML;
    
    scope.closeDialog = function() {
      $mdDialog.hide();
    };
}

function DialogController($scope, $mdDialog, chartService) {
	  $scope.secondaryAxisName = chartService.secondaryAxisName;
	  $scope.primaryAxisName = chartService.primaryAxisName;

	  
	  $scope.savePrimaryName = function() {
		  chartService.primaryAxisName = $scope.primaryAxisName;
	  }
	  
	  $scope.saveSecondaryName = function() {
		  chartService.secondaryAxisName = $scope.secondaryAxisName;
	  }
	  
	  $scope.answer = function(answer) {
	    $mdDialog.hide(answer);
	  };
	}

