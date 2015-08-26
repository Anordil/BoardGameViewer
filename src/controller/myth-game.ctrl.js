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
    
    this.addElement = {
    		potions: false,
    		status: false
    }

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
    	
    	SOCKET.emit('event', {
    	  type: "update_player",
    	  player: this.currentGame.data.player
    	});
    };
    
    this.addPotion = function(iType) {
    	var nb = 0;
    	if (this.currentGame.data.player.items.potions[iType]) {
    		nb = this.currentGame.data.player.items.potions[iType];
    	}
    	this.currentGame.data.player.items.potions[iType] = (+nb +1);
    	
    	SOCKET.emit('event', {
    	  type: "update_player",
    	  player: this.currentGame.data.player
    	});
    };
    
    this.drinkPotion = function(iType) {
    	var nb = 0;
    	if (this.currentGame.data.player.items.potions[iType]) {
    		nb = this.currentGame.data.player.items.potions[iType];
    	}
    	
    	if (nb > 0) {
    		this.currentGame.data.player.items.potions[iType] = nb -1;

    		if (iType == 'health4') {
    			this.healPlayer(4);
    		}
    		else if (iType == 'health6') {
    			this.healPlayer(6);
    		}
    		else if (iType == 'antidote') {
    			this.currentGame.data.player.statusEffects.poison = 0;
    		}
    		else if (iType == 'curse') {
    			this.currentGame.data.player.statusEffects.curse = 0;
    		}
    		else if (iType == 'threat') {
    			this.lowerPlayerThreat(3);
    		}
    	};
    	
    	SOCKET.emit('event', {
    	  type: "update_player",
    	  player: this.currentGame.data.player
    	});
    };
    
    this.addStatusEffect = function(iType) {
    	var nb = 0;
    	if (this.currentGame.data.player.statusEffects[iType]) {
    		nb = this.currentGame.data.player.statusEffects[iType];
    	}
    	this.currentGame.data.player.statusEffects[iType] = (+nb +1);
    	
    	SOCKET.emit('event', {
    	  type: "update_player",
    	  player: this.currentGame.data.player
    	});   	
    };
    
    
    this.healPlayer = function(amount) {
    	this.currentGame.data.player.currentHP = Math.min(this.currentGame.data.player.maxHP, this.currentGame.data.player.currentHP + amount);
    };
    this.lowerPlayerThreat = function(amount) {
    	this.currentGame.data.player.threat = Math.max(0, this.currentGame.data.player.threat -3);
    };
    
    this.togglePotions = function() {
    	this.addElement.potions = !this.addElement.potions;
    	if (this.addElement.potions) {
    		this.addElement.status = false;
    	}
    };
    this.toggleStatus = function() {
    	this.addElement.status = !this.addElement.status;
    	if (this.addElement.status) {
    		this.addElement.potions = false;
    	}
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
    SOCKET.on('update_player', function (message) {
      self.currentGame.data.player = message.player;
      $scope.$apply();
    });
    
    
    this.fetchItemList();
    this.fetchMonsterList();
    
  }]);
