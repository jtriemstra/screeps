var constants = {
    ROLE_HARVESTER: 0,
	ROLE_UPGRADER: 1,
	ROLE_BUILDER: 2,
	ROLE_MINER: 3,
	ROLE_COURIER: 4,
	ROLE_REMOTE_ROAD_BUILDER: 5,
	ROLE_REMOTE_BUILDER: 6,
	UPGRADING: 0,
	BUILDING: 1,
	
	SOURCE_S0_M: 0,
	SOURCE_S0: 1,
	SOURCE_S1: 2,
	
	TARGET_SPAWN_EXT: 0,
	TARGET_CONTROLLER: 1,
	TARGET_CORE_EXT: 2,
	TARGET_CREEP: 3,
	TARGET_REMOTE_EXT: 4,
	TARGET_CONTAINER: 5,
	
	sourceS0_M: function(creep){
		var sources = creep.room.find(FIND_MY_CREEPS, {
				filter: (minerCreep) => {
					return minerCreep.memory.role == constants.ROLE_MINER && minerCreep.store.getFreeCapacity() == 0;
				}
		});
		
		if (sources.length == 0) {
			//TODO: use a filter instead of assuming 0 is the one I want?
			sources = creep.room.find(FIND_SOURCES);
		}
		
		if (sources.length > 0) {
			return sources[0];			
		}
		else {
			return null;
		}
	},
	
	sourceS0: function(creep) {
		var sources = creep.room.find(FIND_SOURCES);
		
		if (sources.length > 0) {
			return sources[0];			
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
	
	sourceFinders: [],
	
	targetSpawnExt: function(creep) {
		 var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_TOWER) && 
							structure.pos.getRangeTo(creep.pos) < 20 && 
							structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				}
		});
		
		if (targets.length > 0) return targets[0];
		
		return null;
	},
	
	targetController: function(creep){
		return null;
	},
	
	targetCoreExt: function(creep){
		var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (thisSite) => {
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
		
		if (targets.length > 0) return targets[0];
		
		return null;
	},
	
	targetRemoteExt: function(creep) {
		var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter: (thisSite) => {
			return thisSite.structureType == STRUCTURE_EXTENSION && thisSite.pos.getRangeTo(creep.pos) < 5;
		}});
		
		if (targets.length > 0) return targets[0];
		
		return null;
	},
	
	targetFinders: [],
};

constants.sourceFinders.push(constants.sourceS0_M);
constants.sourceFinders.push(constants.sourceS0);
constants.sourceFinders.push(constants.sourceS1);

constants.targetFinders.push(constants.targetSpawnExt);
constants.targetFinders.push(constants.targetController);
constants.targetFinders.push(constants.targetCoreExt);
constants.targetFinders.push(constants.targetCreep);
constants.targetFinders.push(constants.targetRemoteExt);

module.exports = constants;