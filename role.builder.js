var roleBase = require('./role.base');
var constants = require('./constants');

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
				var result = creep.build(target);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					return OK;
                }
				else if (result == OK) {
					return OK;
				}
				else {
					//console.log("builder build error " + result + " at " + Game.time + " for " + roleBase.log(creep));
				}
            }
			else {
				//console.log("builder no target at " + Game.time + " for " + roleBase.log(creep));
			}
	    }
	    else {
	        var source = constants.sourceFinders[creep.memory.sourceFinderId](creep);
			
			if (source) {
				var result = creep.harvest(source);
				if(source.name || result == ERR_NOT_IN_RANGE) {
                    var path = creep.pos.findPathTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					creep.moveByPath(path);
					//TODO: sanity check on path
					return OK;
                }
				else if (result == OK) {
					return OK;
				}
				else {
					//console.log("builder harvest error " + result + " at " + Game.time + " for " + roleBase.log(creep));
				}
			} 
			else {
				//console.log("builder no source at " + Game.time + " for " + roleBase.log(creep));
			}
	    }
				
		roleBase.resetTempRole(creep);
	}
};

module.exports = roleBuilder;