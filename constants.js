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
	
	//TODO: get rid of these constants so I don't have to remember to create new ones when I add new methods. Need to retain the ability to save a simple piece of info like an index in memory however
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
	
};



module.exports = constants;