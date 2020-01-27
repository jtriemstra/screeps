var memoryWrapper = require('./memorywrapper');

var constants = {
    ROLE_HARVESTER: 0,
	ROLE_UPGRADER: 1,
	ROLE_BUILDER: 2,
	ROLE_MINER: 3,
	ROLE_COURIER: 4,
	ROLE_REMOTE_ROAD_BUILDER: 5,
	ROLE_REMOTE_BUILDER: 6,
	ROLE_EXPLORER: 7,
	UPGRADING: 0,
	BUILDING: 1,
	
	SOURCE_S0_M: 0,
	SOURCE_S0: 1,
	SOURCE_S1: 2,
	SOURCE_EXTERNAL: 3,
	
	TARGET_SPAWN_EXT: 0,
	TARGET_CONTROLLER: 1,
	TARGET_CORE_EXT: 2,
	TARGET_CREEP: 3,
	TARGET_REMOTE_EXT: 4,
	TARGET_CONTAINER: 5,
	
	GOAL_NONE: -1,
	
	sourceS0_M: function(creep){
		var sources = creep.room.find(FIND_MY_CREEPS, {
				filter: (minerCreep) => {
					return minerCreep.memory.role == constants.ROLE_MINER && minerCreep.store.getFreeCapacity() == 0;
				}
		});
		
		if (sources.length == 0) {
			sources = creep.room.find(FIND_SOURCES);
		}
		
		//TODO: consider how this algorithm changes if miners come back into play
		if (sources.length == 1) {
			return sources[0];			
		}
		else if (sources.length > 1){
			return creep.pos.findClosestByPath(sources);
		}
		else {
			return null;
		}
	},
	
	sourceS0: function(creep) {
		var sources = creep.room.find(FIND_SOURCES);
		
		if (sources.length == 1) {
			return sources[0];			
		}
		else if (sources.length > 1){
			return creep.pos.findClosestByPath(sources);
		}
		else {
			return null;
		}
	},
	
	sourceS1: function(creep) {
		var sources = creep.room.find(FIND_SOURCES);
		
		if (sources.length > 1) {
			return sources[1];
		}
		else {
			return null;
		}
	},

	sourceExternal: function(creep) {
		var sources = [];
		var sourceIds = memoryWrapper.externalSources.getList();

		for (var i=0; i<sourceIds.length; i++){
			sources.push(Game.getObjectById(sourceIds[i]));
		}

		//TODO: explorer currently only pushes a single source, but eventually need multiple, and need to sort by closest
		if (sources.length > 0) {
			return sources[0];
		}
		return null;
	},
	
	sourceFinders: [],
	
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
		
		if (targets.length > 0) return targets[0];
		
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
	
	targetFinders: [],
};

constants.sourceFinders.push(constants.sourceS0_M);
constants.sourceFinders.push(constants.sourceS0);
constants.sourceFinders.push(constants.sourceS1);
constants.sourceFinders.push(constants.sourceExternal);

constants.targetFinders.push(constants.targetSpawnExt);
constants.targetFinders.push(constants.targetController);
constants.targetFinders.push(constants.targetCoreExt);
constants.targetFinders.push(constants.targetCreep);
constants.targetFinders.push(constants.targetRemoteExt);

module.exports = constants;