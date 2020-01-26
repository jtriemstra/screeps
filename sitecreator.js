var constants = require('./constants');

var sitecreator = {
    run: function(room) {
		var spawnX = Game.spawns['Spawn1'].pos.x;
		var spawnY = Game.spawns['Spawn1'].pos.y;
		var offset = room.controller.level;
		//TODO: make this more flexible for different rooms
		

		var result = room.createConstructionSite(spawnX - offset, spawnY, STRUCTURE_EXTENSION);
		//var result = room.createConstructionSite(30, 26, STRUCTURE_EXTENSION);
		
		if (result == OK) {
			room.createConstructionSite(spawnX - offset, spawnY - offset, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX, spawnY - offset, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX + offset, spawnY, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX + offset, spawnY - offset, STRUCTURE_EXTENSION);
			
			//room.createConstructionSite(29,26, STRUCTURE_EXTENSION);
			//room.createConstructionSite(29,27, STRUCTURE_EXTENSION);
			//room.createConstructionSite(40,44, STRUCTURE_EXTENSION);
			//room.createConstructionSite(45,42, STRUCTURE_EXTENSION);
			
			
			console.log("setting stage to building at " + Game.time);
			Memory.currentStage = constants.BUILDING;
		}
		
		
	}
};

module.exports = sitecreator;