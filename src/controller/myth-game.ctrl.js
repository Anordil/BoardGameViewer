angular.module("http_rest_myth")

	.filter("toMonsterImage", function() {
    return function(input) {
    	console.log(input);
    	input = input.replace(/ /g, "-");
      return "../../img/monster/" + input[0].toLowerCase() + input.substring(1, input.length) + ".jpg";
    };
	})

  .controller("MythGameCtrl", ["MythGameData", "$location", "currentGame", "SOCKET", "$http", "$scope", function(MythGameData, $location, currentGame, SOCKET, $http, $scope) {

    var self = this;
    this.itemList = {};
    this.monsterList = [];

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
    		  name: "New",
    		  type: "Unknown"
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
    this.fetchMonsterList = function() {
    	SOCKET.emit('getMonsters', {});
    };
    
    SOCKET.on('itemList', function (message) {
      self.itemList = message;
      $scope.$apply();
    });
    SOCKET.on('monsterList', function (message) {
      self.monsterList = message;
      self.monsterList.push("Unknown.jpg");
      $scope.$apply();
    });
    
    
    this.fetchItemList();
    this.fetchMonsterList();
    
  }]);
