var constants = require('constants');

var sitecreator = {
    run: function(room) {
		var spawnX = Game.spawns['Spawn1'].pos.x;
		var spawnY = Game.spawns['Spawn1'].pos.y;
		var result = room.createConstructionSite(spawnX - 1, spawnY, STRUCTURE_EXTENSION);
		
		if (result == OK) {
			room.createConstructionSite(spawnX - 1, spawnY - 1, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX - 1, spawnY + 1, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX + 1, spawnY, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX + 1, spawnY + 1, STRUCTURE_EXTENSION);
			console.log("setting stage to building at " + Game.time);
			Memory.currentStage = constants.BUILDING;
		}
	}
};

module.exports = sitecreator;