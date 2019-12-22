var constants = require('constants');

var sitecreator = {
    run: function(room) {
		var spawnX = Game.spawns['Spawn1'].pos.x;
		var spawnY = Game.spawns['Spawn1'].pos.y;
		room.createConstructionSite(spawnX - 1, spawnY, STRUCTURE_EXTENSION);
		room.createConstructionSite(spawnX - 1, spawnY - 1, STRUCTURE_EXTENSION);
		room.createConstructionSite(spawnX - 1, spawnY + 1, STRUCTURE_EXTENSION);
		room.createConstructionSite(spawnX + 1, spawnY, STRUCTURE_EXTENSION);
		room.createConstructionSite(spawnX + 1, spawnY + 1, STRUCTURE_EXTENSION);
	}
};

module.exports = sitecreator;