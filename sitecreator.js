var constants = require('constants');

var sitecreator = {
    run: function(room) {
		var spawnX = Game.spawns['Spawn1'].pos.x;
		var spawnY = Game.spawns['Spawn1'].pos.y;
		var result = room.createConstructionSite(spawnX - 1, spawnY, STRUCTURE_EXTENSION);
		
		if (result == OK) {
			room.createConstructionSite(spawnX - 1, spawnY - 1, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX - 1, spawnY + 1, STRUCTURE_EXTENSION);
			//room.createConstructionSite(spawnX + 1, spawnY, STRUCTURE_EXTENSION);
			//room.createConstructionSite(spawnX + 1, spawnY + 1, STRUCTURE_EXTENSION);
			
			room.createConstructionSite(40,44, STRUCTURE_EXTENSION);
			room.createConstructionSite(45,42, STRUCTURE_EXTENSION);
			
			
			console.log("setting stage to building at " + Game.time);
			Memory.currentStage = constants.BUILDING;
		}
		
		if (!Memory.roadCreated && room.energyCapacityAvailable >= 400) {
			//TODO: calculate/find this source
			console.log("creating road sites");
			var source1 = room.find(FIND_SOURCES)[1];
			var path = source1.pos.findPathTo(Game.spawns['Spawn1']);
			for(var step in path) {
				room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
			}
			Memory.roadCreated = true;
		}
	}
};

module.exports = sitecreator;