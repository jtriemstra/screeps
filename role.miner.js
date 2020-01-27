var constants = require('constants');
var roleBase = require('role.base');
var memoryWrapper = require('memorywrapper');

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
		if(creep.store.getFreeCapacity() > 0) {
            var source = constants.sourceFinders[creep.memory.sourceFinderId](creep);
			var result = creep.harvest(source);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                if (creep.memory.watching) {console.log("moving to source");}
            }
            else if (result == ERR_NOT_ENOUGH_RESOURCES){
                memoryWrapper.sourceDrained.set();
                if (creep.memory.watching) {console.log("source has no energy");}
            }
            else {
                if (creep.memory.watching) {console.log("harvesting from source");}
            }
        }
		else {
		    var target = constants.targetFinders[creep.memory.targetFinderId](creep);
            if(target) {
                var result = creep.transfer(target, RESOURCE_ENERGY);
                if (creep.memory.watching) {console.log("miner transfer result " + result + " for " + roleBase.log(creep));}
            }
            else {
                if (creep.memory.watching) {console.log("no target for miner " + roleBase.log(creep));}
            }
		}	    
	}
};

module.exports = roleMiner;