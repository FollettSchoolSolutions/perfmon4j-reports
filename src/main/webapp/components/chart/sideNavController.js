app.controller('sideNavControl', function ($scope, $timeout, $mdSidenav, $mdUtil, chartService) {
    $scope.toggleLeft = buildToggler('left');
    $scope.isToggled = function() {
    	return chartService.isToggled;
    }
    
    $scope.showToggleButton = function() {
    	if(chartService.viewOnly == true){
    		return false;
    	} else {
    		return true;
    	}
    }
    $scope.sideNavToggle= function(){
    	if(chartService.isToggled == true){
    	chartService.sideNavButtonName="CLOSE";
    	return chartService.sideNavButtonName;
    }
    	else 
    	{
        	chartService.sideNavButtonName="OPEN";
        	return chartService.sideNavButtonName;
    	}
    	}
    
    $scope.toggleOpen = function() {
    	chartService.isToggled = true;
    }
    
    $scope.toggleClose = function() {
    	chartService.isToggled = false;
    }
    
    $scope.toggleSideNav = function() {
    	chartService.isToggled = !chartService.isToggled;
    	if (!chartService.isToggled) {
    		$mdSidenav('left').close();
    	} else {
    		$mdSidenav('left').open();
    	}
    }
    
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle();
          },300);
      return debounceFn;
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('left').close();
    };
  })