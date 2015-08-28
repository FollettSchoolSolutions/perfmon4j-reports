app.controller('homeControl', function ($scope, $location, dataSourceService, chartService, $mdDialog){
	$scope.pageTitle = "This is the home page";
	$scope.charts = [];
	$scope.name = "";
	$scope.URL = "";
	$scope.DataSource= "";
	
	
	var dataSourceFetchPromise = dataSourceService.getDataSources();
	dataSourceFetchPromise.then(function(result){
		if (result.status != 200) {
			throw new Error("Failed to load Stuff : " + result.status);
		}
		$scope.DataSource = result.data;
	}).catch(function onError(err) {
		window.alert("Failed to load Stuff " + err.message );
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
	
	$scope.deleteDataSource = function(id) {
		var deletePromise = dataSourceService.deleteDataSource(id);
		deletePromise.then(function(result){
			var successful = result.data;
			if (!successful){
				alert("Deleting chart with id: " + id + " was NOT successful.");
			}
			$location.path("/");
		});
	}
	
	$scope.showDataSources = function(ev) {
	    $mdDialog.show({
	      controller: DataSourceController,
	      templateUrl: 'components/datasource/datasource.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	    });
	}
	
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

	function DataSourceController($scope, $mdDialog, dataSourceService) {
		$scope.name = name
		$scope.url = URL;
	  
	  
	
	  $scope.answer = function(answer) {
	   $mdDialog.hide(answer);
	 };
	};
	
	function editDataSource($scope, $mdDialog, dataSourceService, editID, editname, editurl){
		$scope.name = editname;
		$scope.URL = editurl;
		$scope.id = editID;
		  $scope.answer = function(answer) {
			   $mdDialog.hide(answer);
			 };
	};