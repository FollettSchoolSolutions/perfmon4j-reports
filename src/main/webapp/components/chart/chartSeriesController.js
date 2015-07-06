app.controller('chartSeriesControl', function ($scope, chartService, dataSourceService){
	$scope.chosenDatabase = chartService.chosenDatabase;
	$scope.chosenDatasource = chartService.chosenDatasource;
	$scope.timeStart = chartService.timeStart;
	$scope.timeEnd = chartService.timeEnd;
	$scope.seriesName = "";
	$scope.chosenSystem = "";
	$scope.chosenCategory = "";
	$scope.chosenField = "";
	$scope.chosenAggregationMethod = "";
	$scope.chosenSeries = new Series();
	$scope.systems = [];
	$scope.active = true;
	
	clearSystem();
	clearCategory();
	clearField();
	clearAggregationMethod();
	
	var databasePromise = dataSourceService.getSystems($scope.chosenDatasource, $scope.chosenDatabase, chartService.timeStart, 
			chartService.timeEnd);
	databasePromise.then(function(result){
		$scope.systems = result.data.sort(function(a,b){
			return (parseInt(a.id.substring(a.id.lastIndexOf(".") + 1)) - parseInt(b.id.substring(b.id.lastIndexOf(".") + 1)));
		});
	})
		
	$scope.loadCategories = function(){
		clearCategory();
		clearField();
		clearAggregationMethod();
		chartService.chosenSystem = $scope.series.system;
		var databasePromise = dataSourceService.getCategories($scope.chosenDatasource, $scope.chosenDatabase, 
				$scope.series.system, $scope.timeStart, $scope.timeEnd);
		databasePromise.then(function(result){
			$scope.categories = result.data.sort(function(a,b){
				if( a.name < b.name){
					return -1;
				}else if (a.name == b.name){
					return 0;
				}else if (a.name > b.name){
					return 1;
				}
			})
		})
	};
	
	$scope.loadFields = function(){
		clearField();
		clearAggregationMethod();
		chartService.chosenCategory = $scope.series.category;
		var databasePromise = dataSourceService.getFields($scope.chosenDatasource, $scope.chosenDatabase, 
				$scope.series.category);
		databasePromise.then(function(result){
			$scope.fields = result.data[0].fields;
		})
	};
	
	$scope.loadAggregations = function(){
		clearAggregationMethod();
		chartService.chosenField = $scope.series.field;
		$scope.chosenAggregationMethod = $scope.series.aggregationMethod = $scope.series.field.defaultAggregationMethod;
		$scope.aggregationMethods = $scope.series.field.aggregationMethods;
		chartService.chosenAggregationMethod = $scope.chosenAggregationMethod;
	}
	
	$scope.renderDisabled = function(){
		return (isEmptyOrNull($scope.chosenDatasource) || isEmptyOrNull($scope.chosenDatabase) 
				|| isEmptyOrNull($scope.chosenSystem) || isEmptyOrNull($scope.chosenCategory) 
				|| isEmptyOrNull($scope.chosenField) || isEmptyOrNull($scope.seriesName) 
				|| isEmptyOrNull($scope.chartName) || isEmptyOrNull($scope.timeStart)
				|| isEmptyOrNull($scope.timeEnd))
	};
	
	$scope.isLoading = function(chosenOne, options){
		return !isEmptyOrNull(chosenOne) && isEmptyOrNull(options);
	}
	
	$scope.saveSeriesName = function() {
		chartService.seriesName = $scope.seriesName;
	}
	
	$scope.saveAggregation = function() {
		chartService.chosenAggregationMethod = $scope.chosenAggregationMethod;
	}
	
	$scope.seriesHeader = function() {
		if (isEmptyOrNull($scope.series.name)) {
			return "Series";
		} else {
			return $scope.series.name;
		}
	}
	
	$scope.clear = function() {
		clearSeriesName();
		$scope.series.system = "";
		clearCategory();
		clearField();
		clearAggregationMethod();
	}
	
	$scope.canDelete = function() {
		if ((!angular.isDefined($scope.allSeries)) || $scope.allSeries.length == 1) {
			return false;
		} else {
			return true;
		}
	}
	
	$scope.validateSeriesName = function() {
		if (!isEmptyOrNull($scope.series.name)) {
			return /^[^_#&]+$/.test($scope.series.name);
		}
		return true;
	}
	
	$scope.deleteSeries = function () {
		var index = $scope.allSeries.indexOf($scope.series);
		if ($scope.allSeries[index].active) {
			var lastOne = false;
			if (index == $scope.allSeries.length -1){
				lastOne = true;
			}
			$scope.allSeries.splice(index, 1);
			if (lastOne){
				$scope.allSeries[$scope.allSeries.length-1].active = true;
			}
			else{
				$scope.allSeries[index].active = true;
			}
		} else {
			$scope.allSeries.splice(index, 1);
		}
	}
	
	function isEmptyOrNull(value) {
		return (!value || 0 === value.length);
	}
	
	function clearSystem(){
		$scope.series.system = null; 
		$scope.systems = [];
	}
	
	function clearCategory(){
		$scope.series.category = null;
		$scope.categories = [];
	}
	
	function clearField(){
		$scope.series.field = null;
		$scope.fields = [];
	}
	
	function clearAggregationMethod(){
		$scope.series.aggregationMethod = null; 
		$scope.aggregationMethods = [];
	}
	
	function clearChartName(){
		$scope.chartName = "";
	}
	
	function clearSeriesName(){
		$scope.series.name = "";
	}
});