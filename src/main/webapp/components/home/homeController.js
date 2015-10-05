app.controller('homeControl', function ($scope, $location, dataSourceService, chartService, $mdDialog){
	$scope.pageTitle = "This is the home page";
	$scope.publicCharts = [];
	$scope.charts = [];
	$scope.name = "";
	$scope.URL = "";
	$scope.datasources= "";
	
	
	var dataSourceFetchPromise = dataSourceService.getDataSources();
	dataSourceFetchPromise.then(function(result){
		if (result.status != 200) {
			throw new Error("Failed to load datasources : " + result.status);
		}
		$scope.datasources = result.data;
	}).catch(function onError(err) {
		window.alert("Failed to load datasources " + err.message );
	})
	
	var publicChartFetchPromise = chartService.getPublicCharts();
	publicChartFetchPromise.then(function(result){
		if (result.status != 200) {
			throw new Error("Failed to load public charts : " + result.status);
		}
		var publicCharts = result.data;
		publicCharts.sort(function(a, b) { 
		    return a.chartName.localeCompare(b.chartName);
		});
		
		$scope.publicCharts = publicCharts;
	}).catch(function onError(err) {
		window.alert("Failed to load public charts " + err.message );
	})
		
	var chartFetchPromise = chartService.getCharts();
	chartFetchPromise.then(function(result){
		if (result.status != 200) {
			throw new Error("Failed to load charts : " + result.status);
		}
		var charts = result.data;
		charts.sort(function(a, b) { 
		    return a.chartName.localeCompare(b.chartName);
		});
		
		$scope.charts = charts;
	}).catch(function onError(err) {
		window.alert("Failed to load charts " + err.message );
	})
	
	$scope.showChart = function() {
		
		$location.path("/chart");
	}
	
	$scope.openSideNav = function() {
		chartService.isToggled = true;
	}
	 
	$scope.editChart = function(id) {
		$location.path("/chart/edit/" + id);
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
	
	$scope.showConfirmDelete = function(ev) {
	    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	      .title('Would you like to delete your debt?')
	      .content('All of the banks have agreed to forgive you your debts.')
	      .ariaLabel('Lucky day')
	      .ok('Please do it!')
	      .cancel('Sounds like a scam')
	      .targetEvent(ev);

	    $mdDialog.show(confirm).then(function() {
	      alert("OK!");
	      $scope.alert = 'You decided to get rid of your debt.';
	    }, function() {
	      alert("Cancel!");
	      $scope.alert = 'You decided to keep your debt.';
	    });
	  };
	
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
