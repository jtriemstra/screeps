var constants = require('constants');

var spawner = {
	minHarvesters: function(room) {
		return room.energyCapacityAvailable > 350 ? 3 : 2;
	},
    run: function(creepCount, roleCounts, room) {
        //console.log(roleCounts);
        
		//var creeps = _.filter(Game.creeps, (creep) => creep.memory.role >= constants.HARVESTER);
		if(roleCounts[constants.HARVESTER] < this.minHarvesters(room)) {
			var newName = 'MoveHarvester' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if(OK == Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.HARVESTER, origRole: -1}})){
				    console.log("created harvester at " + Game.time);
				}        
		}
		else if (creepCount < 6 && room.energyCapacityAvailable == 300) {
		    var newRole = Memory.currentStage == constants.BUILDING ? constants.BUILDER : constants.UPGRADER;
			var newName = 'WorkUpgrader' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: newRole, origRole: -1}})){
				    console.log("created upgrader/builder  " + Game.time);
				}       
		}
		else if (roleCounts[constants.MINER] == 0 && (roleCounts[constants.UPGRADER] + roleCounts[constants.BUILDER]) > 0){
		    console.log("converting upgrader to miner");
		    for(var name in Game.creeps) {
                var creep = Game.creeps[name];
                if (creep.memory.role == constants.UPGRADER || creep.memory.role == constants.BUILDER)  {
                    creep.memory.role = constants.MINER;
                    break;
                }
		    }
		}
		else if (room.energyAvailable == 300 && room.energyCapacityAvailable == 300 && roleCounts[constants.MINER] < 2) {
			var newName = 'WorkMiner' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.MINER, origRole: -1}})){
				    console.log("created miner  " + Game.time);
				}
		}
		else if (room.energyAvailable == 300 && room.energyCapacityAvailable == 300 && roleCounts[constants.BUILDER] < roleCounts[constants.MINER] + 2) {
			var newName = 'WorkUpgrader' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.BUILDER, origRole: -1}})){
				    console.log("created builder  " + Game.time);
				}
		}
		else if (room.energyAvailable == 300 && room.energyCapacityAvailable == 300 && roleCounts[constants.MINER] < 3) {
			var newName = 'WorkMiner' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.MINER, origRole: -1}})){
				    console.log("created miner  " + Game.time);
				}
		}
		/*else if (room.energyAvailable >= 300 && room.energyAvailable <= 400 ) {
			var newName = 'WorkUpgrader' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.BUILDER, origRole: -1}})){
				    console.log("created upgrader/builder  " + Game.time);
				}
		}*/
		else if (room.energyAvailable == 400 && (roleCounts[constants.MINER] < 3 && roleCounts[constants.BUILDER] > roleCounts[constants.MINER] + 2)) {
			var newName = 'WorkMiner' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.MINER, origRole: -1}})){
				    console.log("created miner  " + Game.time);
				}
		}
		else if (room.energyAvailable == 450 && (roleCounts[constants.MINER] + roleCounts[constants.BUILDER] < 7)) {
			var newName = 'WorkUpgrader' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.BUILDER, origRole: -1}})){
				    console.log("created big upgrader/builder  " + Game.time);
				}
		}
		else if (room.energyAvailable == 450 ) {
			var newName = 'WorkRemote' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.REMOTE_BUILDER, origRole: -1}})){
				    console.log("created remote upgrader/builder  " + Game.time);
				}
		}
		else {
		    //console.log("miner " + roleCounts[constants.MINER] + " upgrader " + roleCounts[constants.UPGRADER]);
		}
	}
};

module.exports = spawner;