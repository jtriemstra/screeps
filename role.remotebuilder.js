var roleBase = require('role.base');
var constants = require('constants');

var roleRemoteBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			roleBase.resetTempRole(creep);
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (thisSite) => {
                        return thisSite.structureType == STRUCTURE_EXTENSION && thisSite.pos.getRangeTo(creep.pos) < 5;
                    }});
	        
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
			else {
				var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ) &&
								structure.pos.getRangeTo(creep.pos) < 5 && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
				});
				if(targets.length > 0) {
					if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
					}
				}
				else {
					roleBase.setTempRole(creep, constants.REMOTE_ROAD_BUILDER);					
				}
			}
	    }
	    else {
	        
			var sources = creep.room.find(FIND_SOURCES);
			//TODO: calculate/find the source we want
			if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
			}
            
	    }
	}
};

module.exports = roleRemoteBuilder;