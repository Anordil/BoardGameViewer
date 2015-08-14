angular.module("http_rest_myth")

  .controller("MythCtrl", ["MythGameData", function(MythGameData) {

    var self = this;

    this.allGames = [];

    function refreshVideoList() {
      MythGameData.all().then(function(games) {
        self.allGames = games;
      });
    }
    
    this.createNewGame = function() {
    	var aGame = new MythGameData();
    	aGame.name = "New Myth game";
    	aGame.creationTime = new Date();
    	aGame.lastUpdateTime = new Date();
    	aGame.data = {};
    	
    	aGame.$save().then(refreshVideoList,
    			           function(error) {alert("Save failed : "); console.dir(error)});
    	return aGame;
    };

    this.save = function () {
    	MythGameData.save(this.video).then(refreshVideoList).then(this.clear.bind(this));
    };

    this.remove = function (game) {
    	game.$remove().then(refreshVideoList);
    };

    refreshVideoList();
  }]);
