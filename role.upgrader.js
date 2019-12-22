var siteCreator = require('sitecreator');
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
            var originalLevel = creep.room.controller.level;
			var result = creep.upgradeController(creep.room.controller);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
			else if (result == OK) {
				if (creep.room.controller.level > originalLevel) {
					siteCreator.run();
				}	
			}
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
		
	    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
			creep.memory.role = constants.HARVESTER;
		}
	}
};

module.exports = roleUpgrader;