app.controller('chartControl', function ($scope, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.datasources = [];
	$scope.chosenDatasource = null;
	$scope.chosenDatabase = null;
	$scope.databases = [];
	$scope.systems = [];
	$scope.fields = [];
	$scope.categories = [];
	$scope.chartName = "";
	$scope.aggregationMethods = [];
	$scope.chosenSystem = "";
	$scope.chosenCategory = "";
	$scope.chosenField = "";
	$scope.chosenAggregationMethod = "";
	$scope.seriesName = "";
	$scope.timeStart = "now-8H";
	$scope.timeEnd = "now";
	$scope.isDisabled = true;
	$scope.showName = false;
	
	var datasourcePromise = dataSourceService.getDataSources();
	datasourcePromise.then(function(result){
		$scope.datasources = result.data;
		
		if ($scope.datasources.length > 0) {
			$scope.chosenDatasource = $scope.datasources[0];
			$scope.loadDatabases();
		}
	})

	$scope.showChart = function() {
		var urlPromise = dataSourceService.getURL($scope.chosenDatasource, $scope.chosenDatabase, 
				$scope.timeStart, $scope.timeEnd, $scope.chosenSystem, $scope.chosenField, $scope.chosenCategory, 
				$scope.chosenAggregationMethod, $scope.seriesName);
		urlPromise.then(function(result){
			var reportMetadata = {
				data: result.data,
				axis: {
			       x: {
			           type: 'timeseries',
			           tick: {
			               format: '%Y-%m-%dT%H:%M'
			           }
			       }
			   }		
			};
			$scope.chart = c3.generate(reportMetadata);
			$scope.showName = true;
		})
	};

		

	$scope.loadDatabases = function(){
		var databasePromise = dataSourceService.getDatabases($scope.chosenDatasource);
		databasePromise.then(function(result){
			$scope.databases = result.data;
		})



		
		clearSystem();
		clearCategory();
		clearField();
		clearAggregationMethod();
		
		
	}

	
	$scope.loadSystems = function(){
		var databasePromise = dataSourceService.getSystems($scope.chosenDatasource, $scope.chosenDatabase, $scope.timeStart, $scope.timeEnd);
		databasePromise.then(function(result){
			$scope.systems = result.data.sort(function(a,b){
				return (parseInt(a.id.substring(a.id.lastIndexOf(".") + 1)) - parseInt(b.id.substring(b.id.lastIndexOf(".") + 1)));
			});
		})

	
		
		clearCategory();
		clearField();
		clearAggregationMethod();
	}

	
	$scope.loadCategories = function(){
		var databasePromise = dataSourceService.getCategories($scope.chosenDatasource, $scope.chosenDatabase, $scope.chosenSystem, $scope.timeStart, $scope.timeEnd);
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
		
		clearField();
		clearAggregationMethods();
		
	}
	
	$scope.loadFields = function(){
		var databasePromise = dataSourceService.getFields($scope.chosenDatasource, $scope.chosenDatabase, $scope.chosenCategory);
		databasePromise.then(function(result){
			console.log(result.data[0].fields);
			$scope.fields = result.data[0].fields;
		})
		clearAggregationMethod();
	};
	
	$scope.loadAggregations = function(){
		$scope.chosenAggregationMethod = $scope.chosenField.defaultAggregationMethod;
		$scope.aggregationMethods = $scope.chosenField.aggregationMethods;


	}
	
	$scope.renderDisabled = function(){
		return (isEmptyOrNull($scope.chosenDatasource) || isEmptyOrNull($scope.chosenDatabase) 
				|| isEmptyOrNull($scope.chosenSystem) || isEmptyOrNull($scope.chosenCategory) 
				|| isEmptyOrNull($scope.chosenField) || isEmptyOrNull($scope.seriesName) 
				|| isEmptyOrNull($scope.chartName) || isEmptyOrNull($scope.timeStart)
				|| isEmptyOrNull($scope.timeEnd))
	}
	
	function isEmptyOrNull(value) {
		return (!value || 0 === value.length);
	}
	
	function clearSystem(){
		$scope.chosenSystem = null; 
		$scope.systems = null;
	}
	
	function clearCategory(){
		$scope.chosenCategory = null;
		$scope.categories = null;
	}
	
	function clearField(){
		$scope.chosenField = null;
		$scope.fields = null;
	}
	
	function clearAggregationMethod(){
		$scope.chosenAggregationMethod = null; 
		$scope.aggregationMethods = null;
	}
	

});

