var roleBase = require('./role.base');
var constants = require('./constants');
var sourceFinder = require('./sourcefinder');
var targetFinder = require('./targetfinder');

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
	        var target = targetFinder[creep.memory.targetFinderId](creep);
	        
            if(target) {
				var result = creep.build(target);
                if(result == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					if (creep.memory.watching) {console.log("moving to build");}
					return OK;
                }
				else if (result == OK) {
					if (creep.memory.watching) {console.log("doing build");}
					return OK;
				}
				else {
					if (creep.memory.watching) {console.log("builder build error " + result + " at " + Game.time + " for " + roleBase.log(creep));}
				}
            }
			else {
				if (creep.memory.watching) {console.log("builder no target at " + Game.time + " for " + roleBase.log(creep));}
			}
	    }
	    else {
	        var source = sourceFinder[creep.memory.sourceFinderId](creep);
			
			if (source) {
				var result = creep.harvest(source);
				if(source.name || result == ERR_NOT_IN_RANGE) {
                    var path = creep.pos.findPathTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					creep.moveByPath(path);
					//TODO: sanity check on path
					if (creep.memory.watching) {console.log("moving to reload");}
					return OK;
                }
				else if (result == OK) {
					if (creep.memory.watching) {console.log("reloading");}
					return OK;
				}
				else {
					if (creep.memory.watching) {console.log("builder harvest error " + result + " at " + Game.time + " for " + roleBase.log(creep));}
				}
			} 
			else {
				if (creep.memory.watching) {console.log("builder no source at " + Game.time + " for " + roleBase.log(creep));}
			}
	    }
				
		roleBase.resetTempRole(creep);
	}
};

module.exports = roleBuilder;