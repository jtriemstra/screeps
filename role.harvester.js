var constants = require('./constants');
var roleBase = require('./role.base');
var sourceFinder = require('./sourcefinder');
var targetFinder = require('./targetfinder');

var roleHarvester = {
	isSanePath: function(path, creep) {
		//TODO: this is not going to make sense in all rooms
		return creep.memory.goal == 3 || creep.memory.goal == 4 ? true : path.length < 16;
	},
	
    /** @param {Creep} creep **/
    run: function(creep) {
        
		//TODO: this results in harvesters that have partial capacity always going back to the source, even if it might be nice to find another target
	    if(creep.store.getFreeCapacity() > 0) {
	        
            var source = sourceFinder.sourceFinders[creep.memory.sourceFinderId](creep);
			
			if (source) {
			    
				var result = creep.harvest(source);
				if(source.name || result == ERR_NOT_IN_RANGE) {
				    
                    var path = creep.pos.findPathTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
					if (this.isSanePath(path, creep)) {
						if (creep.memory.watching) {console.log("moving to source");}
						creep.moveByPath(path);
					}
					else {
						if (creep.memory.watching) {console.log("can't find source in range");}
					}
                }
				
				else if (result == OK){
					if (creep.memory.watching) {console.log("reloaded");}
				}
				else {
				    
					if (creep.memory.watching) {console.log("harvester harvest error " + result + " at " + Game.time + " for " + roleBase.log(creep));}
				}
			}  
			else {
				if (creep.memory.watching) {console.log("harvester no source at " + Game.time + " for " + roleBase.log(creep));}
			}			
        }
        else {
            var target = targetFinder.targetFinders[creep.memory.targetFinderId](creep);
			
            if(target) {
				var result = creep.transfer(target, RESOURCE_ENERGY);
                if(result == ERR_NOT_IN_RANGE) {
					var path = creep.pos.findPathTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    if (this.isSanePath(path, creep)) {
						if (creep.memory.watching) {console.log("moving to deliver");}
						creep.moveByPath(path);
					}
					else {
						if (creep.memory.watching) {console.log("can't find a target to deliver");}
					}
                }
				else if (result == OK){
					if (creep.memory.watching) {console.log("successsfully delivered");}
					roleBase.resetTempRole(creep);
				}
				else {
					if (creep.memory.watching) {console.log("harvester transfer error " + result + " at " + Game.time + " for " + roleBase.log(creep));}
					return -1;
				}
            }
			else {
				if (creep.memory.watching) {console.log("harvester no target at " + Game.time + " for " + roleBase.log(creep));}
				return -1;
			}
        }
	}
};

module.exports = roleHarvester;