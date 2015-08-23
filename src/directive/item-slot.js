angular.module("directives")
  .filter('itemName', function() {
    return function(input) {
      var s = input[0].toUpperCase() + input.substring(1, input.length -4);
      return s.replace(/-/g, " ");
    };
  })
	.directive("itemSlot", ["SOCKET", function(SOCKET) {

	return {
		restrict: "E",
		templateUrl: "/src/directive/item-slot.tpl.html",
		scope: {
			type: "@type",
			value: "=value",
			list: "=list"
		},
		link: function ($scope) {
			
			$scope.getImage = function() {
				if (!$scope.value) {
					$scope.value = "empty.png";
				}
				return "../../img/inventory/" + $scope.type + "/" + $scope.value;
			};
			
			$scope.getArray = function() {
				return $scope.list[$scope.type];
			};
			
	     $scope.toFileName = function(imgName) {
	        imgName = imgName.replace(/ /g, "-");
	        return imgName[0].toLowerCase() + imgName.substring(1, imgName.length) + ".png";
	      };

			$scope.setCurrentValue = function (value) {
			  
			  value = $scope.toFileName(value);
			  console.log(value);
			  $scope.value = value;
				SOCKET.emit('event', 
						{
							type: "item_update",
							value: value,
							itemType: $scope.type
						});
			};
			
			SOCKET.on('item_update', function (message) {
				if ($scope.type == message.itemType) {
					$scope.value = message.value;
					$scope.$apply();
				}
			});
			
		}
	}
}]);
