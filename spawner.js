var constants = require('constants');

var goals = {
	list: function() {
	},
	energizeCore: {
	},
	upgrade2: {
	},
	buildCoreExtensions: {
	},
	
};

var spawner = {
	minHarvesters: function(room) {
		return room && room.energyCapacityAvailable > 750 ? 3 : 2;
	},
    run: function(creepCount, roleCounts, room) {
        //console.log(roleCounts);
		
		if (room && room.energyAvailable <= 200) return;
        
		//var creeps = _.filter(Game.creeps, (creep) => creep.memory.role >= constants.ROLE_HARVESTER);
		if(roleCounts[constants.ROLE_HARVESTER] < this.minHarvesters(room)) {
			var newName = 'MoveHarvester' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if(OK == Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.ROLE_HARVESTER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_SPAWN_EXT}})){
				    console.log("created harvester at " + Game.time);
				}        
		}
		else if (creepCount < 5 && room.energyCapacityAvailable == 300) {
		    var newRole = Memory.currentStage == constants.BUILDING ? constants.ROLE_BUILDER : constants.ROLE_UPGRADER;
			var newTargetFinderId = Memory.currentStage == constants.BUILDING ? constants.TARGET_CORE_EXT : constants.TARGET_CONTROLLER;
			var newName = 'WorkUpgrader' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: newRole, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: newTargetFinderId}})){
				    console.log("created upgrader/builder  " + Game.time);
				}       
		}
		else if (roleCounts[constants.ROLE_MINER] < 3 && (roleCounts[constants.ROLE_UPGRADER] + roleCounts[constants.ROLE_BUILDER]) > roleCounts[constants.ROLE_MINER]){
		    console.log("converting upgrader to miner");
		    for(var name in Game.creeps) {
                var creep = Game.creeps[name];
				//creep.name = creep.name + "Miner";
                if (creep.memory.role == constants.ROLE_UPGRADER || creep.memory.role == constants.ROLE_BUILDER)  {
                    creep.memory.role = constants.ROLE_MINER;
					creep.memory.sourceFinderId = constants.SOURCE_S0;
					creep.memory.targetFinderId = constants.TARGET_CREEP;
                    break;
                }
		    }
		}
		else if (room.energyAvailable == 300 && room.energyCapacityAvailable == 300 && roleCounts[constants.ROLE_MINER] < 2) {
			var newName = 'WorkMiner' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.ROLE_MINER, origRole: -1, sourceFinderId: constants.SOURCE_S0, targetFinderId: constants.TARGET_CREEP}})){
				    console.log("created miner  " + Game.time);
				}
		}
		else if (room.energyAvailable == 300 && room.energyCapacityAvailable == 300 && roleCounts[constants.ROLE_BUILDER] < roleCounts[constants.ROLE_MINER] + 1) {
			var newName = 'WorkUpgrader' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.ROLE_BUILDER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_CORE_EXT}})){
				    console.log("created builder  " + Game.time);
				}
		}
		else if (room.energyAvailable == 300 && room.energyCapacityAvailable == 300 && roleCounts[constants.ROLE_MINER] < 3) {
			var newName = 'WorkMiner' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.ROLE_MINER, origRole: -1, sourceFinderId: constants.SOURCE_S0, targetFinderId: constants.TARGET_CREEP}})){
				    console.log("created miner  " + Game.time);
				}
		}
		/*else if (room.energyAvailable >= 300 && room.energyAvailable <= 400 ) {
			var newName = 'WorkUpgrader' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.ROLE_BUILDER, origRole: -1}})){
				    console.log("created upgrader/builder  " + Game.time);
				}
		}*/
		else if (room.energyAvailable == 350 && room.energyCapacityAvailable == 350 && roleCounts[constants.ROLE_REMOTE_BUILDER] < 3) {
			var newName = 'WorkRemote' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.ROLE_BUILDER, origRole: -1, sourceFinderId: constants.SOURCE_S1, targetFinderId: constants.TARGET_REMOTE_EXT}})){
				    console.log("created remote upgrader/builder " + Game.time);
				}
		}
		else if (room.energyAvailable == 400 && (roleCounts[constants.ROLE_MINER] < 3 && roleCounts[constants.ROLE_BUILDER] > roleCounts[constants.ROLE_MINER] + 2)) {
			var newName = 'WorkMiner' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.ROLE_MINER, origRole: -1, sourceFinderId: constants.SOURCE_S0, targetFinderId: constants.TARGET_CREEP}})){
				    console.log("created miner  " + Game.time);
				}
		}
		else if (room.energyAvailable == 450 && (roleCounts[constants.ROLE_MINER] + roleCounts[constants.ROLE_BUILDER] < 7)) {
			var newName = 'WorkUpgrader' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.ROLE_BUILDER, origRole: -1}})){
				    console.log("created big upgrader/builder  " + Game.time);
				}
		}
		else if (room.energyAvailable == 450 ) {
			var newName = 'WorkRoadRemote' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.ROLE_REMOTE_ROAD_BUILDER, origRole: -1}})){
				    console.log("created remote road builder  " + Game.time);
				}
		}
		else {
		    //console.log("miner " + roleCounts[constants.ROLE_MINER] + " upgrader " + roleCounts[constants.ROLE_UPGRADER]);
		}
	}
};

module.exports = spawner;