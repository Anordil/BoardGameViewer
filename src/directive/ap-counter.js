angular.module("directives")
	.directive("apCounter", ["SOCKET", function(SOCKET) {

	return {
		restrict: "E",
		templateUrl: "/src/directive/ap-counter.tpl.html",
		scope: {
			current: "=current"
		},
		link: function ($scope) {

			$scope.getArray = function() {
				var array = [];
				for (var i = 1; i <= 6; i++) {
					array.push(i);
				}
				return array;
			};

			$scope.setCurrentValue = function (value) {
				$scope.current = value;
				
				SOCKET.emit('event', 
				  {
					  type: "ap_update",
						value: value
				});
			};
			
			SOCKET.on('ap_update', function (message) {
				$scope.current = message.value;
				$scope.$apply();
			});
		}
	}
}]);
