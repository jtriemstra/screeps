var constants = require('./constants');

var sitecreator = {
    run: function(room) {
		this.createExtensions(room);
	},
	createExtensions: function(room){
		var spawnX = Game.spawns['Spawn1'].pos.x;
		var spawnY = Game.spawns['Spawn1'].pos.y;
		var offset = room.controller.level;
		//TODO: make this more flexible for different rooms
		
		var result = room.createConstructionSite(spawnX - offset, spawnY, STRUCTURE_EXTENSION);
		
		if (result == OK) {
			room.createConstructionSite(spawnX - offset, spawnY - offset, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX, spawnY - offset, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX + offset, spawnY, STRUCTURE_EXTENSION);
			room.createConstructionSite(spawnX + offset, spawnY - offset, STRUCTURE_EXTENSION);
			
			console.log("start building extensions at " + Game.time);
		}
	},
	
};

module.exports = sitecreator;