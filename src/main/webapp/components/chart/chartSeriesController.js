app.controller('chartSeriesControl', function ($scope, $routeParams, chartService, dataSourceService){
	$scope.chosenDatabase = chartService.chosenDatabase;
	$scope.chosenDatasource = chartService.chosenDatasource;
	$scope.timeStart = chartService.timeStart;
	$scope.timeEnd = chartService.timeEnd;
	$scope.active = true;
	$scope.systems = [];
	$scope.categories = [];
	$scope.fields = [];
	$scope.aggregationMethods = [];
	
	
	
	if(chartService.viewOnly == false){
		setTimeout(function(){
			if (isEmptyOrNull($scope.systems)){
				window.alert("Cannot connect to database / systems are null");
			}
		
		}, 5000);	
		var systemsPromise = dataSourceService.getSystems($scope.chosenDatasource, $scope.chosenDatabase, chartService.timeStart, 
				chartService.timeEnd);
		systemsPromise.then(function(result){
			$scope.systems = result.data;
			
			if($routeParams.mode == 'edit'){
				$scope.editInit = true;
				$scope.series.systems = $scope.lookupSystems($scope.series.systems);
			} else {
				$scope.editInit = false;
				clearSystems();
				clearCategory();
				clearField();
				clearAggregationMethod();
			}
			
		})
		
	}
	
	$scope.lookupSystems = function(systems){
		var fixedSystems = [];
		
		for(var i=0; i < systems.length; i++){
			for(var j=0; j < $scope.systems.length; j++){
				if($scope.systems[j].id == systems[i].id){
					fixedSystems.push($scope.systems[j]);
				}
			}
		}
		return fixedSystems;
	}
	
	$scope.lookupCategory = function(category){
		for(var i=0; i < $scope.categories.length; i++){
			if($scope.categories[i].name == category.name){
				return $scope.categories[i];
			}
		}
	}
	
	$scope.lookupField = function(field){
		for(var i=0; i < $scope.fields.length; i++){
			if($scope.fields[i].name == field.name){
				return $scope.fields[i];
			}
		}
	}
	
	$scope.$watchCollection('series.systems', function(newArr, oldArr) {
		if(!isNullOrUndefined(newArr)){
			$scope.loadCategories();
		}
	});
	
	$scope.$watch('series.category', function(newValue, oldValue) {
		if(!isNullOrUndefined(oldValue) && !isNullOrUndefined(newValue)){
			if(!$routeParams.mode == 'edit'){
				if(newValue.name != oldValue.name){
					$scope.loadFields();
				}
			} else {
				$scope.loadFields();
			}
		} else if(isNullOrUndefined(oldValue) && !isNullOrUndefined(newValue)){
			$scope.loadFields();
		}
	});
	
	$scope.$watch('series.field', function(newValue, oldValue) {
		if(!isNullOrUndefined(oldValue) && !isNullOrUndefined(newValue)){
			if(!$routeParams.mode == 'edit'){
				if((newValue.name != oldValue.name)){
					$scope.loadAggregations();
				}
			} else {
				$scope.loadAggregations();
			}
		} else if(isNullOrUndefined(oldValue) && !isNullOrUndefined(newValue)){
			$scope.loadAggregations();
		}
	});
	
	$scope.$watch('series.aggregationMethod', function(newValue, oldValue) {
		if(!isNullOrUndefined(oldValue) && !isNullOrUndefined(newValue)){
			if((newValue != oldValue)){
				$scope.saveAggregation();
			}
		} else if(isNullOrUndefined(oldValue) && !isNullOrUndefined(newValue)){
			$scope.saveAggregation();
		}
	});
	
	function isNullOrUndefined(obj){
		return (obj == null || typeof obj == 'undefined');
	}
		
	$scope.loadCategories = function(){
		if($scope.editInit == false){
			clearCategory();
			clearField();
			clearAggregationMethod();
		}
		chartService.chosenSystems = $scope.series.systems;
		var systemString = createSystemString();
		var categoryPromise = dataSourceService.getCategories($scope.chosenDatasource, $scope.chosenDatabase, 
				systemString, $scope.timeStart, $scope.timeEnd);
		categoryPromise.then(function(result){
			$scope.categories = result.data.sort(function(a,b){
				if( a.name < b.name){
					return -1;
				}else if (a.name == b.name){
					return 0;
				}else if (a.name > b.name){
					return 1;
				}
			})
			if($routeParams.mode == 'edit'){
				$scope.series.category = $scope.lookupCategory($scope.series.category);
			}
			chartService.categories = $scope.categories;
		})
	};
	
	$scope.loadFields = function(){
		if($scope.editInit == false){
			clearField();
			clearAggregationMethod();
		}
		chartService.chosenCategory = $scope.series.category;
		var fieldPromise = dataSourceService.getFields($scope.chosenDatasource, $scope.chosenDatabase, $scope.series.category);
		fieldPromise.then(function(result){
			$scope.fields = result.data[0].fields;
			chartService.fields = $scope.fields;
			if($routeParams.mode == 'edit'){
				$scope.series.field = $scope.lookupField($scope.series.field);
			}
		})
	};
	
	$scope.loadAggregations = function(){
		if($scope.editInit == false){
			clearAggregationMethod();
		}
		chartService.chosenField = $scope.series.field;
		$scope.aggregationMethods = $scope.series.field.aggregationMethods;
		
		if(!$routeParams.mode == 'edit'){
			chartService.chosenAggregationMethod = $scope.series.aggregationMethod = $scope.series.field.defaultAggregationMethod;
		} else {
			chartService.chosenAggregationMethod = $scope.series.aggregationMethod;
			
		}

		chartService.aggregationMethods = $scope.aggregationMethods;
	}
	
	$scope.isLoading = function(chosenOne, options){
		return !isEmptyOrNull(chosenOne) && isEmptyOrNull(options);
	}
	
	$scope.saveAggregation = function() {
		chartService.chosenAggregationMethod = $scope.series.aggregationMethod;
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
	
	$scope.checkIndex = function() {
		var index = $scope.allSeries.indexOf($scope.series);
		if (index == 0) {
			return false;
		} else {
			return true;
		}
	}
	
	$scope.toggleSecondaryAxis = function() {
		$scope.series.secondaryAxis = !$scope.series.secondaryAxis;
	}
	
	function createSystemString() {
		var systemString = "";
		for (var i = 0; i < $scope.series.systems.length; i++) {
			if (i != 0) {
				systemString += "~";
			}
			systemString += $scope.series.systems[i].id;
		}
		return systemString;
	}
	
	function isEmptyOrNull(value) {
		return (!value || 0 === value.length);
	}
	
	function clearSystems(){
		$scope.series.systems = []; 
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