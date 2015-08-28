app.controller('homeControl', function ($scope, $location, dataSourceService, chartService, $mdDialog){
	$scope.pageTitle = "This is the home page";
	$scope.charts = [];
	$scope.name = "";
	$scope.URL = "";
	$scope.DataSource= "";
	
	
	var dataSourceFetchPromise = dataSourceService.getDataSources();
	dataSourceFetchPromise.then(function(result){
		if (result.status != 200) {
			throw new Error("Failed to load DataSource : " + result.status);
		}
		$scope.DataSource = result.data;
	}).catch(function onError(err) {
		window.alert("Failed to load DataSource " + err.message );
	})
		
		
	var chartFetchPromise = chartService.getCharts();
	chartFetchPromise.then(function(result){
		if (result.status != 200) {
			throw new Error("Failed to load charts : " + result.status);
		}
		
		$scope.charts = result.data;
	}).catch(function onError(err) {
		window.alert("Failed to load charts " + err.message );
	})
	
	$scope.showChart = function() {
		
		$location.path("/chart");
	}
	
	$scope.openSideNav = function() {
		chartService.isToggled = true;
	}
	
	$scope.deleteChart = function(id) {
		var deletePromise = chartService.deleteChart(id);
		deletePromise.then(function(result){
			var successful = result.data;
			if (!successful){
				alert("Deleting chart with id: " + id + " was NOT successful.");
			}
			$location.path("/");
		});
	}
	
	$scope.copyChart = function(id){
		var copyPromise = chartService.copyChart(id);
		copyPromise.then(function(result){
			if(result.status != 204){
				alert("Copying chart with id: " + id + " was NOT successful.");
			}
			$location.path("/");
		});
	}
	
	//Ideally, we would want to show the names of the charts refrencing the datasource, but I'm not sure how to do that
	$scope.deleteDataSource = function(id) {
		var deletePromise = dataSourceService.deleteDataSource(id);
		deletePromise.then(function(result){
			var successful = result.data;
			if (!successful){
				alert("This DataSource is being referenced by a chart. DataSource Id: " + id);
			}
			$location.path("/");
		});
	}
	//Building the popup for datasource
	$scope.showDataSources = function(ev) {
	    $mdDialog.show({
	      controller: DataSourceController,
	      templateUrl: 'components/datasource/datasource.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	    });
	}
	
	//Building the popup for edit datasource. We pass it id, name, url and store them into local variables
	$scope.editDataSource = function(mn, id, name, url) {
	    $mdDialog.show({
	      controller: editDataSource,
	      templateUrl: 'components/datasource/editDataSource.html',
	      parent: angular.element(document.body),
	      targetEvent: mn,
	      locals: {
	    	  editID: id,
	    	  editname: name,
	    	  editurl: url
	      }
	    });
	}
});
	//Pop up box where you input data source  info.
	function DataSourceController($scope, $mdDialog, dataSourceService) {
		$scope.name = name
		$scope.url = URL;
	  
	  
	
	  $scope.answer = function(answer) {
	   
	   $mdDialog.hide(answer);
	   
	 };
	};
	
	//Pop up box where DataSource info is already populated for editing.
	function editDataSource($scope, $mdDialog, dataSourceService, editID, editname, editurl){
		$scope.name = editname;
		$scope.URL = editurl;
		$scope.id = editID;
		  $scope.answer = function(answer) {
			  
			  $mdDialog.hide(answer);
			   location.reload();
			 };
	};