var constants = require('./constants');
var roleBase = require('./role.base');
var sourceFinder = require('./sourcefinder');
var memoryWrapper = require('./memorywrapper');
var roleExplorer = require('./role.explorer');

var getWorkerParts = function(room){
	//TODO: make parts flexible based on the room  map
	//TODO: this might be too aggressive in creating bigger creeps
	//TODO: miners have less need for move parts
	
	var tempEnergy = room.energyCapacityAvailable - 300;
	var parts = [WORK,WORK,CARRY,MOVE];
	if (tempEnergy >= 100) {
		tempEnergy -= 100;
		parts.push(WORK);
	}
	if (tempEnergy >= 50) {
		tempEnergy -= 50;
		parts.push(MOVE);
	}
	var flipFlopBool = true;
	while (tempEnergy >= 100){
		if (flipFlopBool){
			parts.push(CARRY);
			parts.push(MOVE);
		}
		else {
			parts.push(WORK);
		}
		tempEnergy -= 100;
		flipFlopBool = !flipFlopBool;
	}
	return parts;
};

var goals = {
	list: function() {
	},	
	energizeCore: {
		id:0,
		isComplete: function(room){return false;},
		spawnRule: function(room, roleCounts, creepCount){
			var harvesterCount = 0;
			var tempCapacityAvailable = 300;
			
			if (room) {
				harvesterCount = room.find(FIND_MY_CREEPS, {filter: (thisCreep) => {return (thisCreep.memory.origRole == constants.ROLE_HARVESTER || thisCreep.memory.role == constants.ROLE_HARVESTER) && thisCreep.memory.goal == 0;}}).length;
				tempCapacityAvailable = room.energyCapacityAvailable;
			}
			
			//TODO: make this dynamic somehow
			//TODO: possibly allow for bigger creations here, but probably need to solve energy source issues first
			var maxHarvesterCount = (tempCapacityAvailable > 650 ? 4 : (tempCapacityAvailable > 400 ? 3 : 2));
			if(harvesterCount < maxHarvesterCount) {
				var newName = 'Harvester' + Game.time;
				
				if(OK == Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
					{memory: {goal: this.id, role: constants.ROLE_HARVESTER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_SPAWN_EXT}})){
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
		id:1,
		isComplete: function(room){
			if (room.controller.level >= 2){
				return true;
			}
		},
		spawnRule: function(room, roleCounts, creepCount){
			//TODO: make dynamic check of congestion?
			if (creepCount < 9 ) {
				var newName = 'Upgrader' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
					{memory: {goal: this.id, role: constants.ROLE_UPGRADER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_CONTROLLER}})){
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
		id:2,
		isComplete: function(room){
			//TODO: there might be a way to do this to trade off CPU for memory/code. memoize?
			//TODO: account for the idea of splitting extensions to be closer to sources
			//TODO (subpoint): this is pretty narrowly defined with the range of 10
			//TODO: possibly use this for constructing towers and ramparts also

			var extensionSites = room.find(FIND_MY_CONSTRUCTION_SITES, {	filter: (thisSite) => {
					return thisSite.structureType == STRUCTURE_EXTENSION && thisSite.pos.getRangeTo(Game.spawns['Spawn1']) < 10;
			}});
			
			return (extensionSites == 0);
		},
		spawnRule: function(room, roleCounts, creepCount){
			if (goals.upgrade2.isComplete(room)) {
				for(var name in Game.creeps) {
					var creep = Game.creeps[name];
					if (creep.memory.goal == goals.upgrade2.id) {
						console.log("converting to build extensions: " + roleBase.log(creep));
						creep.memory.goal = this.id;
						creep.memory.sourceFinderId = constants.SOURCE_S0_M;
						creep.memory.targetFinderId = constants.TARGET_CORE_EXT;
						creep.memory.role = constants.ROLE_BUILDER;
					}
				}
			}

			
			var bodyParts = getWorkerParts(room);
			
			//TODO: some dynamic measure of congestion - this ends up being a ceiling for the entire if/else
			var maxNumberOfBuilders = 9;
			var numberOfBuilders = roleBase.countByRole(constants.ROLE_BUILDER);
			if (numberOfBuilders < maxNumberOfBuilders ) {
				var newName = 'Builder' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
					{memory: {goal: this.id, role: constants.ROLE_BUILDER, origRole: -1, sourceFinderId: constants.SOURCE_S0_M, targetFinderId: constants.TARGET_CORE_EXT}})){
						console.log("created upgrader/builder  " + Game.time);
					}
				else if (roleBase.countByRole(constants.ROLE_UPGRADER) > 0){
					var numberConverted = 0;
					for(var name in Game.creeps) {
						var creep = Game.creeps[name];
						if (creep.memory.role == constants.ROLE_UPGRADER){
							creep.memory.role = constants.ROLE_BUILDER;
							creep.memory.goal = 2;
							creep.memory.sourceFinderId = constants.SOURCE_S0_M;
							creep.memory.targetFinderId = constants.TARGET_CORE_EXT;
							numberConverted++;
							if (numberConverted >= maxNumberOfBuilders - numberOfBuilders){
								break;
							}
						}
					}
				}
				return true;
			}
			//TODO: try changing this. if there is 1 more upgrader/builder than miners, this will convert to have more miners than builders. not sure that's good.
			else if (roleCounts[constants.ROLE_MINER] < 3 && (roleCounts[constants.ROLE_UPGRADER] + roleCounts[constants.ROLE_BUILDER]) > roleCounts[constants.ROLE_MINER]){
				
				for(var name in Game.creeps) {
					var creep = Game.creeps[name];
					
					if ((creep.memory.role == constants.ROLE_UPGRADER || creep.memory.role == constants.ROLE_BUILDER) && creep.memory.origRole != constants.ROLE_HARVESTER)  {
						console.log("converting one upgrader to miner " + roleBase.log(creep));
						creep.memory.role = constants.ROLE_MINER;
						creep.memory.sourceFinderId = constants.SOURCE_S0;
						creep.memory.targetFinderId = constants.TARGET_CREEP;
						creep.memory.goal = 2;
						break;
					}
				}
				
				return true;

			}
			else if (roleCounts[constants.ROLE_MINER] < 4) {
				var newName = 'Miner' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
					{memory: {goal: this.id, role: constants.ROLE_MINER, origRole: -1, sourceFinderId: constants.SOURCE_S0, targetFinderId: constants.TARGET_CREEP}})){
						console.log("created miner  " + Game.time);
					}
				
				return true;
			}
			else {
				return false;
			}
		},
	},
	buildRemoteExtensions: {
		id:3,
		isComplete: function(room){
			//if (!sourceFinder.shouldPrioritizeOneSource(room)){
				return true;
			//}
			//TODO: there might be a way to do this to trade off CPU for memory/code
			//TODO: make this range of 10 more dynamic
			var extensions = room.find(FIND_MY_STRUCTURES, {	filter: (thisStructure) => {
					return thisStructure.structureType == STRUCTURE_EXTENSION && thisStructure.pos.getRangeTo(Game.spawns['Spawn1']) > 10;
			}});
			
			//TODO: number of extensions is narrowly defined
			if (extensions.length >= 2) {
				var countRemote = 0;
				for (var name in Game.creeps) {
					var creep = Game.creeps[name];
					if (creep.memory.goal == this.id || creep.memory.goal == goals.energizeRemoteExtensions.id) {
						countRemote++;
						if (countRemote > 2) {
							console.log("sending remote back to core " + roleBase.log(creep));
							//TODO: setting this to zero invokes the sanePath check, so the creep just sits. but setting to 4 means i need a different if() clause.
							creep.memory.goal = goals.energizeCore.id;
							creep.memory.sourceFinderId = constants.SOURCE_S0_M;
							creep.memory.targetFinderId = constants.TARGET_CORE_EXT;
						}
					}
				}
				return true;
			}
		},
		spawnRule: function(room, roleCounts, creepCount){
			//TODO: how to limit this now that all builders use the same role? this should be moved elsewhere. maybe build an array of lists out in main, when i populate roleCounts[]
			var remoteCount = 0;
			for (var name in Game.creeps) {
				if (Game.creeps[name].memory.goal == 3) remoteCount++;
			}
			//TODO: 4 is narrowly applicable
			if (room.energyAvailable == 350 && room.energyCapacityAvailable == 350 && remoteCount < 4) {
				var newName = 'HarvestRemote' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName, 
					{memory: {goal: this.id, role: constants.ROLE_HARVESTER, origRole: -1, sourceFinderId: constants.SOURCE_S1, targetFinderId: constants.TARGET_REMOTE_EXT}})){
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
		id:4,
		isComplete: function(room){	
			
			//if (!sourceFinder.shouldPrioritizeOneSource(room)){
				return true;
			//}

			return false; 
		},
		spawnRule: function(room, roleCounts, creepCount){
			//TODO: how to limit this now that all builders use the same role? this should be moved elsewhere
			var remoteCount = 0;
			for (var name in Game.creeps) {
				var creep = Game.creeps[name];
				if (creep.memory.goal == goals.buildRemoteExtensions.id || creep.memory.goal == this.id) remoteCount++;
			}
			if (room.energyAvailable >= 350 && room.energyCapacityAvailable >= 350 && remoteCount < 2) {
				var newName = 'WorkRemote' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE,MOVE], newName, 
					{memory: {goal:this.id, role: constants.ROLE_HARVESTER, origRole: -1, sourceFinderId: constants.SOURCE_S1, targetFinderId: constants.TARGET_REMOTE_EXT}})){
						console.log("created remote harvester " + Game.time);
					}		
				return true;
			}
			else {
				return false;
			}
		}
	},
	upgrade3:{
		id:5,
		isComplete: function(room){return false;},
		spawnRule: function(room, roleCounts, creepCount){
			//TODO: very duplicative of code in previous build spawnRule
			
			if (goals.buildCoreExtensions.isComplete(room)){
				for (var name in Game.creeps) {
					var creep = Game.creeps[name];
					if (creep.memory.goal == goals.buildCoreExtensions.id && creep.memory.role != constants.ROLE_MINER) {
						console.log("moving " + roleBase.log(creep) + " from goal 2 to goal 5");
						
						creep.memory.goal = this.id;
						creep.memory.role = constants.ROLE_UPGRADER;
						creep.memory.targetFinderId = constants.TARGET_CONTROLLER;
					}
				}
			}						
			
			var bodyParts = getWorkerParts(room);
			
			if (roleCounts[constants.ROLE_MINER] < 4) {
				var newName = 'Miner' + Game.time;
				
				if (OK == Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
					{memory: {goal: this.id, role: constants.ROLE_MINER, origRole: -1, sourceFinderId: constants.SOURCE_S0, targetFinderId: constants.TARGET_CREEP}})){
						console.log("created miner  " + Game.time);
					}
				
				return true;
			}
			else { //} if (roleCounts[constants.ROLE_UPGRADER] + roleCounts[constants.ROLE_BUILDER] < roleCounts[constants.ROLE_MINER] + 2) {
				var newName = 'Builder' + Game.time;
				var newSourceFinderId = constants.SOURCE_S0_M;

				//TODO: add a condition to check how fast we're draining the original sources, instead of the arbitrary 33% external assumption
				//TODO: this locks usage of the remote source to upgrading, but in other rooms it might be useful for other things
				if (memoryWrapper.externalSources.getList() && memoryWrapper.externalSources.getList().length > 0) {
					if (Game.time % 3 == 0) {
						newSourceFinderId = constants.SOURCE_EXTERNAL;
					}
				}

					
				if (OK == Game.spawns['Spawn1'].spawnCreep(bodyParts, newName, 
					{memory: {goal: this.id, role: constants.ROLE_UPGRADER, origRole: -1, sourceFinderId: newSourceFinderId, targetFinderId: constants.TARGET_CONTROLLER}})){
						console.log("created bigger builder  " + Game.time + " with external?" + (newSourceFinderId == constants.SOURCE_EXTERNAL));
					}
				return true;
			}
			/*else {
				return false;
			}*/
		},
		
	},
	findMoreEnergy: {
		id: 6,
		isComplete: function(room){ 
			//TODO: if explorers die, but we're still using the source in their room, creating a new one is not necessary
			return roleBase.countByRole(constants.ROLE_EXPLORER) >= roleExplorer.getExits(room).length;
		},
		spawnRule: function(room, roleCounts, creepCount){
			if (room.controller.level < 2) {
				return false;
			}

			//TODO: make this less binary and more of a range from underutilized to overutilized
			if (!memoryWrapper.sourceDrained.get()){
				return false;
			}

			var newName = 'Explorer' + Game.time;
			
			if(OK == Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {goal: this.id, role: constants.ROLE_EXPLORER, origRole: -1, sourceFinderId: null, targetFinderId: null, originalRoomName: room.name}})){
					console.log("created explorer at " + Game.time);
				}
			return true;
		
		}
	},
};

var goalList = [];
goalList.push(goals.energizeCore);
goalList.push(goals.upgrade2);
goalList.push(goals.buildCoreExtensions);
goalList.push(goals.buildRemoteExtensions);
goalList.push(goals.energizeRemoteExtensions);
goalList.push(goals.findMoreEnergy);
goalList.push(goals.upgrade3);


var spawner = {
	
    run: function(creepCount, roleCounts, room) {
        //console.log(roleCounts);
		
		//TODO: this could save CPU cycles but will delay the conversion from upgraders to builders.
		//if (room && room.energyAvailable <= 250) return;
		
        for (var i=0; i<goalList.length; i++){
			if (!goalList[i].isComplete(room)){
				if(goalList[i].spawnRule(room, roleCounts, creepCount)){
					break;
				}
			}
		}
	}
};

module.exports = spawner;