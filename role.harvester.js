var constants = require('./constants');
var roleBase = require('./role.base');

var roleHarvester = {
	isSanePath: function(path, creep) {
		//TODO: this is a little clunky
		return creep.memory.goal == 3 || creep.memory.goal == 4 ? true : path.length < 16;
	},
	
    /** @param {Creep} creep **/
    run: function(creep) {
        
		//TODO: this results in harvesters that have partial capacity always going back to the source, even if it might be nice to find another target
	    if(creep.store.getFreeCapacity() > 0) {
	        
            var source = constants.sourceFinders[creep.memory.sourceFinderId](creep);
			
			if (source) {
			    
				var result = creep.harvest(source);
				if(source.name || result == ERR_NOT_IN_RANGE) {
				    
                    var path = creep.pos.findPathTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					if (this.isSanePath(path, creep)) {
						creep.moveByPath(path);
					}
                }
				
				else if (result == OK){
					
				}
				else {
				    
					//console.log("harvester harvest error " + result + " at " + Game.time + " for " + roleBase.log(creep));
				}
			}  
			else {
				//console.log("harvester no source at " + Game.time + " for " + roleBase.log(creep));
			}			
        }
        else {
            var target = constants.targetFinders[creep.memory.targetFinderId](creep);
			
            if(target) {
				var result = creep.transfer(target, RESOURCE_ENERGY);
                if(result == ERR_NOT_IN_RANGE) {
					var path = creep.pos.findPathTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    if (this.isSanePath(path, creep)) {
						creep.moveByPath(path);
					}
                }
				else if (result == OK){
					roleBase.resetTempRole(creep);
				}
				else {
					//console.log("harvester transfer error " + result + " at " + Game.time + " for " + roleBase.log(creep));
					return -1;
				}
            }
			else {
				//console.log("harvester no target at " + Game.time + " for " + roleBase.log(creep));
				return -1;
			}
        }
	}
};

module.exports = roleHarvester;