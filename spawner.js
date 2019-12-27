var constants = require('constants');

var goals = {
	list: function() {
	},	
	energizeCore: {
		isComplete: function(creep, room){return false;},
		spawnRule: function(creep, room, roleCounts, creepCount){
			if(roleCounts[constants.ROLE_HARVESTER] < this.minHarvesters(room)) {
				var newName = 'MoveHarvester' + Game.time;
				
				if(OK == Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
					{memory: {role: constants.ROLE_HARVESTER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_SPAWN_EXT}})){
						console.log("created harvester at " + Game.time);
					}
				return true;
			}
			else {
				return false;
			}
		},
	},
	upgrade2: {
		isComplete: function(creep, room){return room.controller.level >= 2;},
		spawnRule: function(creep, room, roleCounts, creepCount){
			if (creepCount < 5 ) {
				var newName = 'WorkUpgrader' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
					{memory: {role: constants.ROLE_UPGRADER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_CONTROLLER}})){
						console.log("created upgrader/builder  " + Game.time);
					}
			
				return true;
			}
			else {
				return false;
			}
		},
	},
	buildCoreExtensions: {
		isComplete: function(creep, room){
			//TODO: there might be a way to do this to trade off CPU for memory/code
			var extensions = room.find(FIND_MY_STRUCTURES, {	filter: (thisStructure) => {
					return thisStructure.structureType == STRUCTURE_EXTENSION && thisStructure.pos.getRangeTo(Game.spawns['Spawn1']) < 10;
			});
			return extensions.length >= 3;
		},
		spawnRule: function(creep, room, roleCounts, creepCount){
			//TODO: some dynamic measure of congestion
			if (creepCount < 5 ) {
				var newName = 'WorkBuilder' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
					{memory: {role: constants.ROLE_BUILDER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_CORE_EXT}})){
						console.log("created upgrader/builder  " + Game.time);
					}
			
				return true;
			}
			//TODO: try changing this. if there is 1 more upgrader/builder than miners, this will convert to have more miners than builders. not sure that's good.
			else if (roleCounts[constants.ROLE_MINER] < 3 && (roleCounts[constants.ROLE_UPGRADER] + roleCounts[constants.ROLE_BUILDER]) > roleCounts[constants.ROLE_MINER]){
				console.log("converting upgrader to miner");
				for(var name in Game.creeps) {
					var creep = Game.creeps[name];
					
					if (creep.memory.role == constants.ROLE_UPGRADER || creep.memory.role == constants.ROLE_BUILDER)  {
						creep.memory.role = constants.ROLE_MINER;
						creep.memory.sourceFinderId = constants.SOURCE_S0;
						creep.memory.targetFinderId = constants.TARGET_CREEP;
						break;
					}
				}
				
				return true;

			}
			else if (room.energyAvailable == 300 && room.energyCapacityAvailable == 300 && roleCounts[constants.ROLE_MINER] < 2) {
				var newName = 'WorkMiner' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
					{memory: {role: constants.ROLE_MINER, origRole: -1, sourceFinderId: constants.SOURCE_S0, targetFinderId: constants.TARGET_CREEP}})){
						console.log("created miner  " + Game.time);
					}
				
				return true;
			}
			else if (room.energyAvailable == 300 && room.energyCapacityAvailable == 300 && roleCounts[constants.ROLE_BUILDER] < roleCounts[constants.ROLE_MINER] + 1) {
				var newName = 'WorkUpgrader' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
					{memory: {role: constants.ROLE_BUILDER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_CORE_EXT}})){
						console.log("created builder  " + Game.time);
					}
				return true;
			}
			else if (room.energyAvailable == 300 && room.energyCapacityAvailable == 300 && roleCounts[constants.ROLE_MINER] < 3) {
				var newName = 'WorkMiner' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
					{memory: {role: constants.ROLE_MINER, origRole: -1, sourceFinderId: constants.SOURCE_S0, targetFinderId: constants.TARGET_CREEP}})){
						console.log("created miner  " + Game.time);
					}
				return true;
			}
			else if (room.energyAvailable == 400 && (roleCounts[constants.ROLE_MINER] < 3 && roleCounts[constants.ROLE_BUILDER] > roleCounts[constants.ROLE_MINER] + 2)) {
				var newName = 'WorkMiner' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName, 
					{memory: {role: constants.ROLE_MINER, origRole: -1, sourceFinderId: constants.SOURCE_S0, targetFinderId: constants.TARGET_CREEP}})){
						console.log("created miner  " + Game.time);
					}
			}
			else if (room.energyAvailable == 450 && (roleCounts[constants.ROLE_MINER] + roleCounts[constants.ROLE_BUILDER] < 7)) {
				var newName = 'WorkUpgrader' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, 
					{memory: {role: constants.ROLE_BUILDER, origRole: -1}})){
						console.log("created big upgrader/builder  " + Game.time);
					}
			}
			else {
				return false;
			}
		},
	},
	buildRemoteExtensions: {
		isComplete: function(creep, room){
			//TODO: there might be a way to do this to trade off CPU for memory/code
			var extensions = room.find(FIND_MY_STRUCTURES, {	filter: (thisStructure) => {
					return thisStructure.structureType == STRUCTURE_EXTENSION && thisStructure.pos.getRangeTo(Game.spawns['Spawn1']) > 10;
			});
			return extensions.length >= 2;
		},
		spawnRule: function(creep, room, roleCounts, creepCount){
			//TODO: how to limit this now that all builders use the same role?
			if (room.energyAvailable == 350 && room.energyCapacityAvailable == 350 && roleCounts[constants.ROLE_REMOTE_BUILDER] < 3) {
				var newName = 'WorkRemote' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName, 
					{memory: {role: constants.ROLE_BUILDER, origRole: -1, sourceFinderId: constants.SOURCE_S1, targetFinderId: constants.TARGET_REMOTE_EXT}})){
						console.log("created remote upgrader/builder " + Game.time);
					}
			}
	},
	
};

var spawner = {
	minHarvesters: function(room) {
		return room && room.energyCapacityAvailable > 750 ? 3 : 2;
	},
    run: function(creepCount, roleCounts, room) {
        //console.log(roleCounts);
		
		//TODO: this could save CPU cycles but will delay the conversion from upgraders to builders.
		//if (room && room.energyAvailable <= 250) return;
        
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