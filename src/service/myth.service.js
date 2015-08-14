angular.module("http_rest_myth", ["common.mongolab"])

	.factory("MythGameData", ["MongolabService", function(service) {
		return service("mythgamedata");
	}]);
