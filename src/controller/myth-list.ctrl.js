angular.module("http_rest_myth")

  .controller("MythListCtrl", ["MythGameData", "$location", "allGames", function(MythGameData, $location, allGames) {

    var self = this;

    this.allGames = allGames;
    this.currentGame = null;

    function refreshVideoList() {
      MythGameData.all().then(function(games) {
        self.allGames = games;
      });
    }
    
    this.edit = function (game) {
    	$location.path("/myth-games/edit/" + game.$id());
    };
    
    this.createNewGame = function() {
    	var aGame = new MythGameData();
    	aGame.name = "New Myth game";
    	aGame.creationTime = new Date();
    	aGame.lastUpdateTime = new Date();
    	aGame.data = {
    			player: {
    				currentHP: 12,
    				maxHP: 16
    			},
    			monsterCounters: [{currentHP: 4, maxHP: 4}, {currentHP: 4, maxHP: 4}, {currentHP: 4, maxHP: 4}]
    	};
    	
    	aGame.$save().then(refreshVideoList,
    			           function(error) {alert("Save failed : "); console.dir(error)});
    	return aGame;
    };

    this.remove = function (game) {
    	game.$remove().then(refreshVideoList);
    };

  }]);