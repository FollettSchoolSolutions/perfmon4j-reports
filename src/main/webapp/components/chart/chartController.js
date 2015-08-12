app.controller('chartControl', function ($scope, $routeParams, $mdDialog, chartService, dataSourceService){
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
	
	$scope.chartPersistObj = {
			chosenDatasource : null,
			chosenDatabase : null,
			chartName : "Chart "+ (date.getYear() + 1900 )+"-"+ (date.getMonth()+1) +"-"+ date.getDate() +"T"+ date.getHours() +":"+ date.getMinutes(),
			timeStart : "now-4H",
			timeEnd : "now",
			id : 0,
			primaryAxisName : "",
			secondaryAxisName : "",
			series : []

	};

	$scope.chart = {
			chosenDatasource : null,
			chosenDatabase : null,
			chartName : "Chart "+ (date.getYear() + 1900 )+"-"+ (date.getMonth()+1) +"-"+ date.getDate() +"T"+ date.getHours() +":"+ date.getMinutes(),
			timeStart : "now-4H",
			timeEnd : "now",
			id : 0,
			primaryAxisName : "",
			secondaryAxisName : "",
			series : []

	};
	
	chartService.chartName = $scope.chart.chartName;
	
	$scope.showName = false;
	$scope.chartId = 0;
	$scope.addToggled = false;
	$scope.seriesUrl = "";
	$scope.seriesAliases = "";
	$scope.activeSeries = 0;
	var active = chartService.active;
	
	if (typeof $routeParams.id != 'undefined'){
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
	}
	
	var datasourcePromise = dataSourceService.getDataSources();
	datasourcePromise.then(function(result){
		$scope.datasources = result.data;
		
		if ($scope.datasources.length > 0) {
			$scope.chart.chosenDatasource = chartService.chosenDatasource = $scope.datasources[0];
			$scope.loadDatabases();
		}
	})		
	
	// watchers
	$scope.$watch('chart.chosenDatasource', function(newValue, oldValue) {
		if(!isNullOrUndefined(oldValue) && !isNullOrUndefined(newValue)){
			if((newValue.host != oldValue.host)){
				if($scope.chart.series.length == 1){
					$scope.chart.series.pop();
				}
				$scope.loadDatabases();
			}
		} else {
			if($scope.chart.series.length == 1){
				$scope.chart.series.pop();
			}
		}
	});
	
	$scope.$watch('chart.chosenDatabase', function(newValue, oldValue) {
		if(!isNullOrUndefined(oldValue) && !isNullOrUndefined(newValue)){
			if((newValue.id != oldValue.id)){
				$scope.loadSystems();
				$scope.initSeries();
			}
		} else {
			$scope.loadSystems();
			$scope.initSeries();
		}
	});
	
	function isNullOrUndefined(obj){
		return (obj == null || typeof obj == 'undefined');
	}

	$scope.loadDatabases = function(){
		var date = new Date();
		console.log('Date = ' + date );
		clearDatabase();
		clearAggregationMethod();
		chartService.chosenDatasource = $scope.chart.chosenDatasource;
		chartService.timeStart = $scope.chart.timeStart;
		chartService.timeEnd = $scope.chart.timeEnd;
		var databasePromise = dataSourceService.getDatabases(chartService.chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})
	};
	
	$scope.loadSystems = function(){
		chartService.chosenDatabase = $scope.chart.chosenDatabase;
		chartService.timeStart = $scope.chart.timeStart;
		chartService.timeEnd = $scope.chart.timeEnd;
		if ((!angular.isDefined($scope.chart.series) || $scope.chart.series.length == 0) && $scope.chart.chosenDatabase != null) {
			$scope.setActiveSeries(0);
		}
	};
	
	$scope.renderDisabled = function(){
		var activeSeries = null;
		for (var i = 0; i < $scope.chart.series.length; i++){
			if ($scope.chart.series[i].active){
				activeSeries = $scope.chart.series[i];

				break;
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
	
	$scope.saveStartTime = function() {
		chartService.startTime = $scope.startTime;
	}
	
	$scope.saveEndTime = function() {
		chartService.endTime = $scope.endTime;
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
				$scope.chart.series[i];
				if (i!= 0){
					cleanUrl += "_";
				}
				agg = $scope.chart.series[i].aggregationMethod + "~";
				cleanUrl += agg; 
				
				if(chartService.viewOnly == false){
					for (j=0; j< $scope.chart.series[i].systems.length; j++){
						systems += $scope.chart.series[i].systems[j].id + "~";
					}
					category = $scope.chart.series[i].category.name;
					field = $scope.chart.series[i].field.name;
				} else {
					var systemsArr = $scope.chart.series[i].systems.split(",");
					for (j=0; j< systemsArr.length; j++){
						systems += systemsArr[j] + "~";
					}
					category = $scope.chart.series[i].category;
					field = $scope.chart.series[i].field;
				}
				
				cleanUrl += systems + category + "~" + field;
				systems = "";
			}
		
		console.log(cleanUrl);
		return cleanUrl;
		
		
	}
	
	$scope.showChart = function() {
		setTimeout(function(){
			if (chartService.isChartLoading===true){
				window.alert("The chart failed to render.  Connection to database may have been lost.");
			}
		
		}, 60000);
		chartService.successfullySaved = null;
		chartService.isShowable = false;
		chartService.isChartLoading = true;
		$scope.seriesUrl = $scope.cleanSeriesUrl();
		listSeriesAliases();

		var urlPromise = dataSourceService.getURL(chartService.viewOnly, $scope.chart.chosenDatasource, $scope.chart.chosenDatabase, 
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
			c3.generate(reportMetadata);
			chartService.isChartLoading = false;
			chartService.isShowable = true;
		})
	};
	
	$scope.saveOrUpdateChart = function(){
		chartService.successfullySaved = null;
		chartService.isChartLoading = true;
		
		// init persist obj to all string fields instead of objs
		$scope.chartPersistObj.chosenDatasource = $scope.chart.chosenDatasource.host;
		$scope.chartPersistObj.chosenDatabase = $scope.chart.chosenDatabase.id;
		$scope.chartPersistObj.chartName = $scope.chart.chartName;
		$scope.chartPersistObj.timeStart = $scope.chart.timeStart;
		$scope.chartPersistObj.timeEnd = $scope.chart.timeEnd;
		$scope.chartPersistObj.id = $scope.chart.id;
		$scope.chartPersistObj.primaryAxisName = $scope.chart.primaryAxisName;
		$scope.chartPersistObj.secondaryAxisName = $scope.chart.secondaryAxisName;
		for(var i=0; i < $scope.chart.series.length; i++){
			var seriesObj = {
				name : "",
				systems : [],
				category : "",
				field : "",
				aggregationMethod : ""
			};
			seriesObj.name = $scope.chart.series[i].name;
			var systemsString = "";
			for(var j=0; j < $scope.chart.series[i].systems.length; j++) {
				if (j != 0) {
					systemsString += ",";
				}
				systemsString += $scope.chart.series[i].systems[j].id;
			}
			seriesObj.systems = systemsString;
			seriesObj.category = $scope.chart.series[i].category.name;
			seriesObj.field = $scope.chart.series[i].field.name;
			seriesObj.aggregationMethod = $scope.chart.series[i].aggregationMethod;
			$scope.chartPersistObj.series.push(seriesObj);
		}
		
		
		var saveChartPromise = chartService.saveOrUpdateChart($scope.chartPersistObj);
		
		saveChartPromise.then(function(result){
			if (result.status != 200) {
				throw new Error("Failed to save chart");
			}
			var savedChart = result.data;
			if (savedChart == null || savedChart.id < 1) {
				console.error("Chart not saved successfully!");
				chartService.successfullySaved = false;
			} else {
				console.log("Chart saved successfullly.");
				chartService.successfullySaved = true;
				
				// Initial save
				if($scope.chart.id == 0){
					$scope.chart.id = savedChart.id;
					$scope.saveOrUpdateChartLabel = "Update";
					$scope.saveConfirmationLabel = "saved";
				} else {
					$scope.saveConfirmationLabel = "updated";
				}
			}
			chartService.isChartLoading = false;
		}).catch(function onError(err) {
			window.alert("Failed to save chart");
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

		var newSeriesName = 'Series ' + (seriesCounter);
		var newSeries = {active: true, name: newSeriesName, secondaryAxis: false};
		$scope.chart.series.push(newSeries);
	}
	
	$scope.initSeries = function() {
		clearSeries();

		if ($scope.chart.chosenDatabase != null) {
			$scope.chart.series = [{active: true, name: 'Series 1', secondaryAxis: false}];
			seriesCounter++;
		} 
	}
	
	$scope.disableTopOptions = function() {

		if ($scope.chart.series.length > 1) {
			return true;
		}
		return false;
	}
	
	$scope.invalidSeriesNames = function() {
		for (var i = 0; i < $scope.chart.series.length; i++) {
			for (var j = i + 1; j < $scope.chart.series.length; j++) {
				if ($scope.chart.series[i].name === $scope.chart.series[j].name) {
					return true;
				}
			}
		}
		return false;
	}
	
	$scope.incompleteSeriesExists = function(){
		for(var i=0; i<$scope.chart.series.length; i++){
			var currSeries = $scope.chart.series[i];
			var incomplete = (isEmptyOrNull(currSeries.systems) || isEmptyOrNull(currSeries.category) 
					|| isEmptyOrNull(currSeries.field) || isEmptyOrNull(currSeries.name));
			if(incomplete == true){
				return true;
			}
		}
		return false;
	}
	
	$scope.validateSeriesName = function() {
		for (var i = 0; i < $scope.chart.series.length; i++) {
			if (!isEmptyOrNull($scope.chart.series[i].name) ) {
				var result = /^[^_#&]+$/.test($scope.chart.series[i].name);
				if (!result) {
					return false;
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

});

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

