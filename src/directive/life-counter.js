angular.module("directives")
	.directive("lifeCounter", ["SOCKET", function(SOCKET) {

	return {
		restrict: "E",
		templateUrl: "/src/directive/life-counter.tpl.html",
		scope: {
			max: "=max",
			current: "=current"
		},
		link: function ($scope) {

			$scope.getArray = function() {
				var array = [];
				for (var i = 1; i <= $scope.max; i++) {
					array.push(i);
				}
				return array;
			};

			$scope.setCurrentValue = function (value) {
				$scope.current = value;
				
				SOCKET.emit('event', 
						{
							type: "player_life_update",
							value: value
						});
			};
			
			
			SOCKET.on('player_life_update', function (message) {
				$scope.current = message.value;
				$scope.$apply();
			});
		}
	}
}]);
