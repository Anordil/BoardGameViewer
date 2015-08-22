angular.module("directives", ['ui.bootstrap'])
  .directive("gameListElement", [function() {

	  return {
		  restrict: "E",
		  templateUrl: "/src/directive/game-list-element.tpl.html",
		  scope: {
			  data: "=data"
		  }
	  }
  }]);
