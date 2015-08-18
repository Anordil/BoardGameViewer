angular.module("directives")
	.directive("threatCounter", ["SOCKET", function(SOCKET) {

	return {
		restrict: "E",
		templateUrl: "/src/directive/threat-counter.tpl.html",
		scope: {
			current: "=current"
		},
		link: function ($scope) {

			$scope.getArray = function() {
				var array = [];
				for (var i = 1; i <= 10; i++) {
					array.push(i);
				}
				return array;
			};

			$scope.setCurrentValue = function (value) {
				$scope.current = value;
				
				SOCKET.emit('event', 
				  {
					  type: "player_threat_update",
						value: value
				});
			};
			
			SOCKET.on('player_threat_update', function (message) {
				$scope.current = message.value;
				$scope.$apply();
			});
		}
	}
}]);
