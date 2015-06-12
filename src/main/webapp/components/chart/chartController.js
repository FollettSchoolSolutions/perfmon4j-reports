app.controller('chartControl', function ($scope, dataSourceService){
	$scope.pageTitle = "build a chart";
	$scope.databases = {};
	$scope.chosenDatabase = "";
	$scope.systems = {};
	$scope.chosenSystem = "";
	
	var databasePromise = dataSourceService.getDatabases();
	databasePromise.then(function(result){
		$scope.databases = result.data;
	})

	$scope.showChart = function() {
		var stuffPromise = dataSourceService.getStuff();
		stuffPromise.then(function(result){
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
		})
	};
});