var constants = require('constants');
var roleBase = require('role.base');

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
		if(creep.store.getFreeCapacity() > 0) {
            var source = constants.sourceFinders[creep.memory.sourceFinderId](creep);
			
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
		else {
		    var target = constants.targetFinders[creep.memory.targetFinderId](creep);
            if(target) {
                var result = creep.transfer(target, RESOURCE_ENERGY);
                //console.log("miner transfer result " + result + " for " + roleBase.log(creep));
            }
            else {
                //console.log("no target for miner " + roleBase.log(creep));
            }
		}	    
	}
};

module.exports = roleMiner;