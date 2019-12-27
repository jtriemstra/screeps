var constants = require('constants');

var goals = {
	list: function() {
	},	
	energizeCore: {
		isComplete: function(room){return false;},
		spawnRule: function(room, roleCounts, creepCount){
			//TODO: restore this
			//if(roleCounts[constants.ROLE_HARVESTER] < this.minHarvesters(room)) {
			if(roleCounts[constants.ROLE_HARVESTER] < 2) {
				var newName = 'MoveHarvester' + Game.time;
				
				if(OK == Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
					{memory: {goal: 0, role: constants.ROLE_HARVESTER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_SPAWN_EXT}})){
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
		isComplete: function(room){return room.controller.level >= 2;},
		spawnRule: function(room, roleCounts, creepCount){
			if (creepCount < 5 ) {
				var newName = 'WorkUpgrader' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
					{memory: {goal: 1, role: constants.ROLE_UPGRADER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_CONTROLLER}})){
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
		isComplete: function(room){
			//TODO: there might be a way to do this to trade off CPU for memory/code
			var extensions = room.find(FIND_MY_STRUCTURES, {	filter: (thisStructure) => {
					return thisStructure.structureType == STRUCTURE_EXTENSION && thisStructure.pos.getRangeTo(Game.spawns['Spawn1']) < 10;
			}});
			return extensions.length >= 3;
		},
		spawnRule: function(room, roleCounts, creepCount){
			//TODO: some dynamic measure of congestion
			if (creepCount < 5 ) {
				var newName = 'WorkBuilder' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
					{memory: {goal: 2, role: constants.ROLE_BUILDER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_CORE_EXT}})){
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
						creep.memory.goal = 2;
						break;
					}
				}
				
				return true;

			}
			else if (roleCounts[constants.ROLE_MINER] < 3) {
				var newName = 'WorkMiner' + Game.time;
				var bodyParts;
				if ( room.energyCapacityAvailable < 400) {
					bodyParts = [WORK,WORK,CARRY,MOVE];
				}
				else {
					bodyParts = [WORK,WORK,WORK,CARRY,MOVE];
				}
				if (OK == Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
					{memory: {goal: 2, role: constants.ROLE_MINER, origRole: -1, sourceFinderId: constants.SOURCE_S0, targetFinderId: constants.TARGET_CREEP}})){
						console.log("created miner  " + Game.time);
					}
				
				return true;
			}
			else if (roleCounts[constants.ROLE_BUILDER] < roleCounts[constants.ROLE_MINER] + 2) {
				var newName = 'WorkBuilder' + Game.time;
				var bodyParts, isBig;
				if ( room.energyCapacityAvailable < 450) {
					bodyParts = [WORK,WORK,CARRY,MOVE];
					isBig = "";
				}
				else {
					bodyParts = [WORK,WORK,WORK,CARRY,MOVE,MOVE];
					isBig = "big";
				}
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
					{memory: {goal: 2, role: constants.ROLE_BUILDER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_CORE_EXT}})){
						console.log("created " + isBig + " builder  " + Game.time);
					}
				return true;
			}
			else {
				return false;
			}
		},
	},
	buildRemoteExtensions: {
		isComplete: function(room){
			//TODO: there might be a way to do this to trade off CPU for memory/code
			var extensions = room.find(FIND_MY_STRUCTURES, {	filter: (thisStructure) => {
					return thisStructure.structureType == STRUCTURE_EXTENSION && thisStructure.pos.getRangeTo(Game.spawns['Spawn1']) > 10;
			}});
			return extensions.length >= 2;
		},
		spawnRule: function(room, roleCounts, creepCount){
			//TODO: how to limit this now that all builders use the same role? this should be moved elsewhere
			var remoteCount = 0;
			for (var name in Game.creeps) {
				if (Game.creeps[name].memory.goal == 3) remoteCount++;
			}
			if (room.energyAvailable == 350 && room.energyCapacityAvailable == 350 && remoteCount < 4) {
				var newName = 'WorkRemote' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName, 
					{memory: {goal: 3, role: constants.ROLE_BUILDER, origRole: -1, sourceFinderId: constants.SOURCE_S1, targetFinderId: constants.TARGET_REMOTE_EXT}})){
						console.log("created remote upgrader/builder " + Game.time);
					}		
				return true;
			}
			else {
				return false;
			}
		}
	},
	energizeRemoteExtensions: {
		isComplete: function(room){	return false; },
		spawnRule: function(room, roleCounts, creepCount){
			//TODO: how to limit this now that all builders use the same role?
			if (room.energyAvailable == 350 && room.energyCapacityAvailable == 350 && roleCounts[constants.ROLE_REMOTE_BUILDER] < 3) {
				var newName = 'WorkRemote' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName, 
					{memory: {goal:4, role: constants.ROLE_HARVESTER, origRole: -1, sourceFinderId: constants.SOURCE_S1, targetFinderId: constants.TARGET_REMOTE_EXT}})){
						console.log("created remote harvester " + Game.time);
					}		
				return true;
			}
			else {
				return false;
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
        
		if (goals.energizeCore.spawnRule(room, roleCounts, creepCount)){}
		else if (goals.upgrade2.spawnRule(room, roleCounts, creepCount)){}
		else if (goals.buildCoreExtensions.spawnRule(room, roleCounts, creepCount)){}
		else if (goals.buildRemoteExtensions.spawnRule(room, roleCounts, creepCount)){}
		else if (goals.energizeRemoteExtensions.spawnRule(room, roleCounts, creepCount)){}
		else {}
	}
};

module.exports = spawner;