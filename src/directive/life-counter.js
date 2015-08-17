angular.module("directives")
  .directive("lifeCounter", [function() {

	  return {
		  restrict: "E",
		  templateUrl: "/src/directive/life-counter.tpl.html",
		  scope: {
			  min: "=min",
			  max: "=max",
			  current: "=current"
		  },
		  link: function ($scope) {
			  
			  $scope.getArray = function() {
			    	var array = [];
			    	for (var i = $scope.min; i <= $scope.max; i++) {
			    		array.push(i);
			    	}
			    	return array;
			  };
			  
			  $scope.setCurrentValue = function (value) {
				  $scope.current = value;
			  };
			  
//			  scope.$watch("current", updatePagesModel);
		  }
	  }
  }]);
