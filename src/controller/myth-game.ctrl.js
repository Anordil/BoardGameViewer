angular.module("http_rest_myth")

  .controller("MythGameCtrl", ["MythGameData", "$location", "currentGame", "SOCKET", "$http", "$scope", function(MythGameData, $location, currentGame, SOCKET, $http, $scope) {

    var self = this;
    this.itemList = {};

    this.currentGame = currentGame;
    
    console.dir(currentGame);
    
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
    
    this.fetchItemList = function() {
      SOCKET.emit('getItems', {});
    };
    
    SOCKET.on('itemList', function (message) {
      self.itemList = message;
      $scope.$apply();
    });
    
    
    this.fetchItemList();
    
  }]);
