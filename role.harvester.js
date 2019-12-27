var constants = require('constants');

var roleHarvester = {
	isSanePath: function(path) {
		return path.length < 16;
	},
	
    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var source = constants.sourceFinders[0](creep);
			
			if (source) {
				if(source.name || creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    var path = creep.pos.findPathTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					if (this.isSanePath(path)) {
						creep.moveByPath(path);
					}
                }
			}            
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && 
								structure.pos.getRangeTo(creep.pos) < 20 && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
			else {
				return -1;
			}
        }
	}
};

module.exports = roleHarvester;