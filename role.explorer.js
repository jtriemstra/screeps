var constants = require('./constants');
var roleBase = require('./role.base');
var memoryWrapper = require('./memorywrapper');

var roleExplorer = {
	/** @param {Creep} creep **/
    run: function(creep) {
		if (creep.spawning) { 
			return;
		}
		//TODO: make this more generic
        if (creep.room.name === creep.memory.originalRoomName || creep.room.name === "W8N3"){
			if (creep.memory.watching) {console.log(creep.room.name);}
			var exits = creep.room.find(FIND_EXIT_BOTTOM);
			if (creep.pos.isEqualTo(exits[0])){
				
			}
			else {
				
				creep.moveTo(exits[0]);
			}			
		}
		else {
			if (creep.memory.watching) {console.log("out of original room");}
			var sources = creep.room.find(FIND_SOURCES);
			
			var closestSource = creep.pos.findClosestByPath(sources);
			memoryWrapper.externalSources.add(closestSource.id);
			creep.moveTo(closestSource);
		}
	}
};

module.exports = roleExplorer;