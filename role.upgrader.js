var constants = require('constants');
var sourceFinder = require('./sourcefinder');
var targetFinder = require('./targetfinder');
var roleBase = require('./role.base');

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
				if (creep.memory.watching) {console.log("moving to controller");}
                creep.moveTo(targetFinder.targetFinders[creep.memory.targetFinderId](creep));
            }
			else if (result == OK) {
				if (creep.memory.watching) {console.log("upgrading controller");}
			}
        }
        else {
			var source = sourceFinder.sourceFinders[creep.memory.sourceFinderId](creep);
			
			if (source) {
				var result = creep.harvest(source);
				if(source.name || result == ERR_NOT_IN_RANGE) {
					if (creep.memory.watching) {console.log("moving to source");}
                    var path = creep.pos.findPathTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					creep.moveByPath(path);
					//TODO: sanity check on path
				}
				else if (result == OK){
					if (creep.memory.watching) {console.log("harvesting");}
				}
				else {
					if (creep.memory.watching) {console.log("uprader harvest error " + result + " at " + Game.time + " for " + roleBase.log(creep));}
				}
			}  
			else {
				if (creep.memory.watching) {console.log("no source exists");}
			}
        }
		
	    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
			//creep.memory.role = constants.ROLE_HARVESTER;
		}
	}
};

module.exports = roleUpgrader;
