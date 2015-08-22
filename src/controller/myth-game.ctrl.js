angular.module("http_rest_myth")

  .controller("MythGameCtrl", ["MythGameData", "$location", "currentGame", "SOCKET", function(MythGameData, $location, currentGame, SOCKET) {

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
    
    
    this.startEdit = function() {
    	this.currentGame.edit = true;
    };
    this.stopEdit = function() {
    	this.currentGame.edit = false;
    };
    
  }]);
