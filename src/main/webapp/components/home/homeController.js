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
		$mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('#popupContainer')))
	        .clickOutsideToClose(true)
	        .title('Error')
	        .content('Failed to load datasources ' + err.message)
	        .ariaLabel('Database load failure')
	        .ok('OK')
	    );
	})
	
	$scope.validateConnection = function(currChart) {
		var connectionCheck = dataSourceService.getDatabases(currChart.chosenDatasource);
		
		connectionCheck.then(function(resultCheck){
			currChart.isAvailable = (resultCheck.status == 200);			
		});		
	}
	
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
		for (var i = 0; i < publicCharts.length; i++) {
			var currChart = publicCharts[i];
			currChart.isAvailable = false;			

			$scope.validateConnection(currChart);
		}
		
	}).catch(function onError(err) {
		$mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('#popupContainer')))
	        .clickOutsideToClose(true)
	        .title('Error')
	        .content('Failed to load public charts ' + err.message)
	        .ariaLabel('Public charts load failure')
	        .ok('OK')
	    );
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
		for (var i = 0; i < charts.length; i++) {
			var currChart = charts[i];
			currChart.isAvailable = false;			

			$scope.validateConnection(currChart);
		}
		
	}).catch(function onError(err) {
		$mdDialog.show(
	      $mdDialog.alert()
	        .parent(angular.element(document.querySelector('#popupContainer')))
	        .clickOutsideToClose(true)
	        .title('Error')
	        .content('Failed to load charts ' + err.message)
	        .ariaLabel('Charts load failure')
	        .ok('OK')
	    );
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
		var confirm = $mdDialog.confirm({
			locals: {
				title: "Delete?",
		    	content: "Are you sure you want to delete this chart?"
		    },
			controller: confirmationDialogController,
			templateUrl: 'components/home/confirmationDiagTemplate.html',
			parent: angular.element(document.body),
		    ariaLabel: 'Chart deletion confirmation'
		});
		
	    $mdDialog.show(confirm).then(function(answer) { // user clicks OK
		    	if(answer == "OK"){
		    		var deletePromise = chartService.deleteChart(id);
		    		deletePromise.then(function(result){
		    			var successful = result.data;
		    			if (!successful){
		    				$mdDialog.show(
		    						$mdDialog.alert()
		    						.parent(angular.element(document.querySelector('#popupContainer')))
		    						.clickOutsideToClose(true)
		    						.title('Delete Chart Error')
		    						.content('Deleting chart with id: ' + id + ' was NOT successful.')
		    						.ariaLabel('Delete chart failure')
		    						.ok('OK')
		    				);
		    			} else {
		    				$location.path("/");
		    			}
		    		});
		    	}
		    }, function() { // user clicks Cancel
		      // do nothing
		    });
		
	}
	function confirmationDialogController($scope, $mdDialog, chartService, title, content) {
		$scope.title = title;
		$scope.content = content;
		
		$scope.answer = function(answer) {
		  $mdDialog.hide(answer);
		};
	}
	
	$scope.copyChart = function(id){
		var copyPromise = chartService.copyChart(id);
		copyPromise.then(function(result){
			if(result.status != 204){
				$mdDialog.show(
			      $mdDialog.alert()
			        .parent(angular.element(document.querySelector('#popupContainer')))
			        .clickOutsideToClose(true)
			        .title('Duplicate Chart Error')
			        .content('Duplicating chart with id: ' + id + ' was NOT successful.')
			        .ariaLabel('Duplicate chart failure')
			        .ok('OK')
			    );
			} else {
				$location.path("/");
			}
		});
	}
	
	$scope.getDataSourceName = function(ds){
		if(ds.publiclyVisible == true){
			return (ds.name + " (public)");
		} else {
			return ds.name;
		}
	}
	
	$scope.deleteDataSource = function(id) {
		var confirm = $mdDialog.confirm({
			locals: {
				title: "Delete?",
		    	content: "Are you sure you want to delete this datasource?"
		    },
			controller: confirmationDialogController,
			templateUrl: 'components/home/confirmationDiagTemplate.html',
			parent: angular.element(document.body),
		    ariaLabel: 'Datasource deletion confirmation'
		});
		
	    $mdDialog.show(confirm).then(function(answer) { // user clicks OK
	    	if(answer == "OK"){
	    		var deletePromise = dataSourceService.deleteDataSource(id);
			    deletePromise.then(function(result){
			    	var successful = result.data;
			    	if (!successful){
			    		$mdDialog.show(
					      $mdDialog.alert()
					        .parent(angular.element(document.querySelector('#popupContainer')))
					        .clickOutsideToClose(true)
					        .title('Cannot Delete')
					        .content('This DataSource is being referenced by a chart. DataSource id: ' + id)
					        .ariaLabel('Cannot delete datasource')
					        .ok('OK')
					    );
			    	} else {
			    		$location.path("/");
			    	}
			    });
	    	}
	    }, function() { // user clicks Cancel
	      // do nothing
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
	$scope.editDataSource = function(mn, id, name, url, publiclyVisible) {
	    $mdDialog.show({
	      controller: editDataSource,
	      templateUrl: 'components/datasource/editDataSource.html',
	      parent: angular.element(document.body),
	      targetEvent: mn,
	      locals: {
	    	  editID: id,
	    	  editname: name,
	    	  editurl: url,
	    	  editpubflag: publiclyVisible
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
	function editDataSource($scope, $mdDialog, dataSourceService, editID, editname, editurl, editpubflag){
		$scope.name = editname;
		$scope.URL = editurl;
		$scope.publiclyVisible = editpubflag;
		$scope.id = editID;
		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
	};
