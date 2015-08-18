angular.module("directives")
	.directive("threatCounter", [function() {

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
			};
		}
	}
}]);
