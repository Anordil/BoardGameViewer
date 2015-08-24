angular.module("directives")
	.directive("diceRoller", ["SOCKET", function(SOCKET) {

	return {
		restrict: "E",
		templateUrl: "/src/directive/dice-roller.tpl.html",
		scope: {
			dice: "=dice"
		},
		link: function ($scope) {
			
			$scope.getFateImage = function(nb) {
				var fate = "darkness";
				if (nb == 1) {
					fate = "arcane";
				}
				else if (nb == 2) {
					fate = "guile";
				}
				else if (nb == 3) {
					fate = "nature";
				}
				else if (nb == 4) {
					fate = "rage";
				}
				else if (nb == 5) {
					fate = "faith";
				}
				return "../../img/dice/" + fate + ".jpg";
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
				
				SOCKET.emit('event', 
					{
						type: "dice_results",
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
	      		d10: $scope.dice.countD10,
	      		fd: $scope.dice.countFate
    			});
      };
			
			
			SOCKET.on('dice_count', function (message) {
				$scope.dice.countD10 = message.d10;
				$scope.dice.countFate = message.fd;
				$scope.$apply();
			});
			SOCKET.on('dice_results', function (message) {
				$scope.dice.resultsD10 = message.resultsD10;
				$scope.dice.resultsFate = message.resultsFate;
				$scope.$apply();
			});
			
		}
	}
}]);
