var constants = require('constants');


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
			//TODO: possibly pull this from somewhere else - for now, upgrader always has the same target
            var result = creep.upgradeController(creep.room.controller);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
			else if (result == OK) {
				
			}
        }
        else {
			var source = constants.sourceFinders[creep.memory.sourceFinderId](creep);
			
			if (source) {
				if(source.name || creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    var path = creep.pos.findPathTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					creep.moveByPath(path);
					//TODO: sanity check on path
                }
			}  
        }
		
	    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
			//creep.memory.role = constants.ROLE_HARVESTER;
		}
	}
};

module.exports = roleUpgrader;