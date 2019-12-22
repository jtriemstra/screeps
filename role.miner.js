var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
		else {
			var targets = creep.room.find(FIND_MY_CREEPS, {
                    filter: (targetCreep) => {
                        return creep.pos.inRangeTo(targetCreep.pos, 1) && 
                                targetCreep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                creep.transfer(targets[0], RESOURCE_ENERGY);
            }
		}	    
	}
};

module.exports = roleMiner;