app.controller('sideNavControl', function ($scope, $timeout, $mdSidenav, $mdUtil, chartService) {
    $scope.toggleLeft = buildToggler('left');
    $scope.isToggled = function() {
    	return chartService.isToggled;
    }
    
    $scope.showToggleButton = function() {
    	if(chartService.viewOnly == true){
    		return true;
    	} else {
    		return $scope.isToggled();
    	}
    }
    
    $scope.toggleOpen = function() {
    	chartService.isToggled = true;
    	chart.resize();
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