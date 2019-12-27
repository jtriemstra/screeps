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
	},
	
	sourceS1: function(creep) {
	},
	
	sourceFinders: [sourceS0_M, sourceS0, sourceS1];
};

module.exports = constants;