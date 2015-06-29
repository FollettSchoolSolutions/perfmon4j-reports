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
		chartService.chosenSystem = $scope.chosenSystem;
		var databasePromise = dataSourceService.getCategories($scope.chosenDatasource, $scope.chosenDatabase, 
				$scope.chosenSystem, $scope.timeStart, $scope.timeEnd);
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
		chartService.chosenCategory = $scope.chosenCategory;
		var databasePromise = dataSourceService.getFields($scope.chosenDatasource, $scope.chosenDatabase, 
				$scope.chosenCategory);
		databasePromise.then(function(result){
			$scope.fields = result.data[0].fields;
		})
	};
	
	$scope.loadAggregations = function(){
		clearAggregationMethod();
		chartService.chosenField = $scope.chosenField;
		$scope.chosenAggregationMethod = $scope.chosenAggregationMethod = $scope.chosenField.defaultAggregationMethod;
		$scope.aggregationMethods = $scope.chosenField.aggregationMethods;
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
		console.log("series name is: " + chartService.seriesName);
		console.log("series name in text box: " + $scope.seriesName);
	}
	
	$scope.saveAggregation = function() {
		chartService.chosenAggregationMethod = $scope.chosenAggregationMethod;
		console.log("aggregation method is " + chartService.chosenAggregationMethod);
	}
	
	$scope.toggleActive = function() {
		$scope.active = !$scope.active;
	}
	
	$scope.seriesHeader = function() {
		if (isEmptyOrNull($scope.seriesName)) {
			return "Series";
		} else {
			return $scope.seriesName;
		}
	}
	
	function isEmptyOrNull(value) {
		return (!value || 0 === value.length);
	}
	
	function clearSystem(){
		$scope.chosenSystem = null; 
		$scope.systems = [];
		chartService.chosenSystem = null;
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
		$scope.chartName = "";
	}
	
	function clearSeriesName(){
		$scope.seriesName = "";
		chartService.seriesName = "";
	}
	
});