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
    				name: "Hero's name",
    				move: 4,
    				courage: 6,
    				currentHP: 10,
    				maxHP: 10,
    				items: {
    					potions: {
    						health4: 0,
    						health6: 0,
    						antidote: 0,
    						curse: 0,
    						focus: 0,
    						threat: 0
    					},
    					primary : null,
    					secondary: null,
    					armor: null,
    					helm: null,
    					accessory: null
    				},
    				statusEffects: {
    					poison: false,
    					cursed: 0,
    					frozen: 0,
    					capture: 0,
    					prone: false
    				}
    			},
    			monsterCounters: []
    	};
    	
    	aGame.dice = [];
    	aGame.dice.push({
    			countD10: 0,
    			countFate: 0,
    			resultsD10: [],
    			resultsFate: [],
    			edit: false
    	});
    	aGame.dice.push({
  			countD10: 0,
  			countFate: 0,
  			resultsD10: [],
  			resultsFate: [],
  			edit: false
  	});
    	
    	aGame.$save().then(refreshVideoList,
    			           function(error) {alert("Save failed : "); console.dir(error)});
    	return aGame;
    };

    this.remove = function (game) {
    	game.$remove().then(refreshVideoList);
    };

  }]);
