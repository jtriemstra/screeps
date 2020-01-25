var constants = require('./constants');

var sitecreator = {
    run: function(room) {
		var spawnX = Game.spawns['Spawn1'].pos.x;
		var spawnY = Game.spawns['Spawn1'].pos.y;
		//TODO: make this more flexible for different rooms
		//TODO: this needs to be useful for increasing room levels
		var result = room.createConstructionSite(spawnX - 2, spawnY, STRUCTURE_EXTENSION);
		//var result = room.createConstructionSite(30, 26, STRUCTURE_EXTENSION);
		
		if (result == OK) {
			room.createConstructionSite(spawnX - 2, spawnY - 2, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX - 2, spawnY + 2, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX + 2, spawnY, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX + 2, spawnY + 2, STRUCTURE_EXTENSION);
			
			//room.createConstructionSite(29,26, STRUCTURE_EXTENSION);
			//room.createConstructionSite(29,27, STRUCTURE_EXTENSION);
			//room.createConstructionSite(40,44, STRUCTURE_EXTENSION);
			//room.createConstructionSite(45,42, STRUCTURE_EXTENSION);
			
			
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