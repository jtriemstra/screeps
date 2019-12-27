var roleBase = require('role.base');
var constants = require('constants');

var roleBuilder = {

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
	        var target = constants.targetFinders[creep.memory.targetFinderId](creep);
	        
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
			else {
				return -1;
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
	}
};

module.exports = roleBuilder;