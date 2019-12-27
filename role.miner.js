var constants = require('constants');

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
                creep.transfer(target, RESOURCE_ENERGY);
            }
		}	    
	}
};

module.exports = roleMiner;