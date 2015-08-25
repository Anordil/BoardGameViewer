angular.module("directives")
	.directive("diceRoller", ["SOCKET", function(SOCKET) {

	return {
		restrict: "E",
		templateUrl: "/src/directive/dice-roller.tpl.html",
		scope: {
			dice: "=dice",
			id: "=id"
		},
		link: function ($scope) {
			
			$scope.getFateName = function(nb) {
				var fate = "Darkness";
				if (nb == 1) {
					fate = "Arcane";
				}
				else if (nb == 2) {
					fate = "Guile";
				}
				else if (nb == 3) {
					fate = "Nature";
				}
				else if (nb == 4) {
					fate = "Rage";
				}
				else if (nb == 5) {
					fate = "Faith";
				}
				return fate;
			};
			$scope.getFateImage = function(nb) {
				return "../../img/dice/" + $scope.getFateName(nb) + ".jpg";
			};
			$scope.rollDie = function(max) {
				return (1 + Math.floor(max * Math.random()));
			};

	      
			$scope.rollDice = function () {

				$scope.dice.resultsD10 = [];
				$scope.dice.resultsFate = [];
				
				for (var i = 1; i <= $scope.dice.countD10; i++) {
					$scope.dice.resultsD10.push($scope.rollDie(10));
				}
				for (var i = 1; i <= $scope.dice.countFate; i++) {
					$scope.dice.resultsFate.push($scope.rollDie(6));
				}
				$scope.dice.resultsD10.sort();
				$scope.dice.resultsFate.sort();
				
				SOCKET.emit('event', 
					{
						type: "dice_results",
						id: $scope.id,
						resultsD10: $scope.dice.resultsD10,
						resultsFate: $scope.dice.resultsFate
					});
			};
			
			
      $scope.startEdit = function() {
      	$scope.dice.edit = true;
      };
      $scope.stopEdit = function() {
      	$scope.dice.edit = false;
      	// Propagate the new max value
      	SOCKET.emit('event', 
    			{
	      		type: "dice_count",
	      		id: $scope.id,
	      		d10: $scope.dice.countD10,
	      		fd: $scope.dice.countFate
    			});
      };
			
			
			SOCKET.on('dice_count', function (message) {
				if (message.id == $scope.id) {
					$scope.dice.countD10 = message.d10;
					$scope.dice.countFate = message.fd;
					$scope.$apply();					
				}
			});
			SOCKET.on('dice_results', function (message) {
				if (message.id == $scope.id) {
					$scope.dice.resultsD10 = message.resultsD10;
					$scope.dice.resultsFate = message.resultsFate;
					$scope.$apply();
				}
			});
			
		}
	}
}]);
