angular.module("directives")
	.directive("monster", ["SOCKET", function(SOCKET) {

	return {
		restrict: "E",
		templateUrl: "/src/directive/monster.tpl.html",
		scope: {
			model: "=model",
			id: "=id",
			ctrl: "=ctrl"
		},
		link: function ($scope) {
			
			
			$scope.startEdit = function() {
				console.dir(this.ctrl.monsterList);
				$scope.edit = true;
		  };
	    $scope.stopEdit = function() {
	    	$scope.edit = false;
	    };
	    
	    $scope.updateDisplayedMonster = function() {
	    	$scope.ctrl.currentGame.displayedMonster = $scope.model.type;
	    	console.log("Display " + $scope.ctrl.currentGame.displayedMonster);
	    };
			
		}
	}
}]);
