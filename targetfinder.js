var constants = require('./constants');
var memoryWrapper = require('./memorywrapper');

var functions = {
    targetSpawnExt: function(creep) {
		//TODO: make this range more dynamic
		 var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_TOWER) && 
							structure.pos.getRangeTo(creep.pos) < 16 
				}
		});
		
		if (targets.length > 0){
			for (var i=0; i<targets.length; i++){
				if (targets[i].store.getFreeCapacity(RESOURCE_ENERGY) > 0){
					return targets[i];
				}
			}
			return targets[0];
		}
		
		return null;
	},
	
	targetController: function(creep){
		//TODO: support multiple room controllers
		return Game.spawns["Spawn1"].room.controller;
	},
	
	targetCoreExt: function(creep){
		var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (thisSite) => {
			//TODO: what scenarios do I want a range limit, and how can it be flexible?
			//return creep.pos.inRangeTo(thisSite.pos, 13) && thisSite.structureType == STRUCTURE_EXTENSION;
			return thisSite.structureType == STRUCTURE_EXTENSION;
		}});
        
        if (targets.length > 0){
            return creep.pos.findClosestByPath(targets);
        }
		return null;
	},
	
	targetCreep: function(creep){
		var targets = creep.room.find(FIND_MY_CREEPS, {
				filter: (targetCreep) => {
					return creep.pos.inRangeTo(targetCreep.pos, 1) && 
							targetCreep.memory.role != constants.ROLE_MINER &&
							targetCreep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
		});
		
		//TODO: try multiple targets
		//NOTE: rotate through potential targets
		if (targets.length > 0) return targets[(Game.time % targets.length)];
		
		return null;
	},
	
	targetRemoteExt: function(creep) {
		var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (thisSite) => {
			return thisSite.structureType == STRUCTURE_EXTENSION && thisSite.pos.getRangeTo(creep.pos) < 5;
		}});
		
		if (targets.length > 0) return targets[0];
		
		targets = creep.room.find(FIND_STRUCTURES, {filter: (thisStruct) => {
			return thisStruct.structureType == STRUCTURE_EXTENSION && thisStruct.pos.getRangeTo(creep.pos) < 5 && thisStruct.store.getFreeCapacity(RESOURCE_ENERGY);
		}});
		
		if (targets.length > 0) return targets[0];
		
		return null;
	},
	
}

var targetFinder = [
    functions.targetSpawnExt,
    functions.targetController,
    functions.targetCoreExt,
    functions.targetCreep,
    functions.targetRemoteExt
];

module.exports = targetFinder;