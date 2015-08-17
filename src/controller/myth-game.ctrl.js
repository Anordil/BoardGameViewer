angular.module("http_rest_myth")

  .controller("MythGameCtrl", ["MythGameData", "$location", "currentGame", function(MythGameData, $location, currentGame) {

    var self = this;

    this.currentGame = currentGame;

    
    this.save = function () {
    	this.currentGame.lastUpdateTime = new Date();
    	MythGameData.save(this.currentGame);
    };
    
    this.getPlayerLife = function() {
    	return this.currentGame.data.player.currentHP;
    };
    this.getPlayerMaxLife = function() {
    	return this.currentGame.data.player.maxHP;
    };
    
  }]);
