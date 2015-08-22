angular.module("http_rest_myth")

  .controller("MythGameCtrl", ["MythGameData", "$location", "currentGame", "SOCKET", function(MythGameData, $location, currentGame, SOCKET) {

    var self = this;

    this.currentGame = currentGame;
    console.dir(this.currentGame);

    
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
    
    this.removeMonsterCounter = function(index) {
    	this.currentGame.data.monsterCounters.splice(index, 1);
    };
    this.addMonsterCounter = function() {
    	this.currentGame.data.monsterCounters.push(
    	  {
    		  currentHP: 4, 
    		  maxHP: 4,
    		  name: "New"
		});
    }
    
    
    this.startEdit = function() {
    	this.currentGame.edit = true;
    };
    this.stopEdit = function() {
    	this.currentGame.edit = false;
    };
    
  }]);
