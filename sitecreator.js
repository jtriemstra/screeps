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
	whereToBuildExtensions: function(room){
        //TODO: assumes 2 sources in a room
        //TODO: this is a pretty quick and dirty approach to distance

        var spawnPos = Game.spawns["Spawn1"].pos;
        var controllerPos = room.controller.pos;
        var sources = room.find(FIND_SOURCES);
        var source0Pos = sources[0].pos;
        var source1Pos = sources[1].pos;
        var controllerOffset = 0;
        var spawnOffset = 2;
        
        var positionsAreClose = [
            controllerPos.findPathTo(source0Pos).length <= 12,
            controllerPos.findPathTo(source1Pos).length <= 12,
            spawnPos.findPathTo(source0Pos).length <= 12,
            spawnPos.findPathTo(source1Pos).length <= 12
        ];

        if (positionsAreClose[spawnOffset + 0] && positionsAreClose[spawnOffset + 1]){
            return "spawn";
        }
        else if (positionsAreClose[spawnOffset + 0] && positionsAreClose[controllerOffset + 0]){
            return "source1";
        }
        else if (positionsAreClose[spawnOffset + 1] && positionsAreClose[controllerOffset + 1]){
            return "source0";
        }
        else {
            return "split";
        }
    }
};

module.exports = sitecreator;