var constants = require('constants');
var roleBase = require('role.base');

var roleHarvester = {
	isSanePath: function(path) {
		return path.length < 16;
	},
	
    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var source = constants.sourceFinders[creep.memory.sourceFinderId](creep);
			
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
            var target = constants.targetFinders[creep.memory.targetFinderId](creep);
			
            if(target) {
				var result = creep.transfer(target, RESOURCE_ENERGY);
                if(result == ERR_NOT_IN_RANGE) {
					var path = creep.pos.findPathTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                    if (this.isSanePath(path)) {
						creep.moveByPath(path);
					}
                }
				else if (result == OK){
					roleBase.resetTempRole(creep);
				}
            }
			else {
				return -1;
			}
        }
	}
};

module.exports = roleHarvester;