var constants = require('constants');

var spawner = {
    run: function(creepCount) {
        
		//var creeps = _.filter(Game.creeps, (creep) => creep.memory.role >= constants.HARVESTER);
		if(creepCount < 2) {
			var newName = 'MoveHarvester' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if(OK == Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.HARVESTER}})){
				    console.log("created harvester at " + Game.time);
				}        
		}
		/*else if(creepCount == 1) {
			var newName = 'FastUpgrader';
			//console.log('Spawning new harvester: ' + newName);
			Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.UPGRADER}});        
		}*/
		else if (creepCount < 6) {
		    
			var newName = 'WorkUpgrader' + Game.time;
			//console.log('Spawning new harvester: ' + newName);
			if (OK == Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName, 
				{memory: {role: constants.UPGRADER}})){
				    console.log("created upgrader/builder  " + Game.time);
				}       
		}
	}
};

module.exports = spawner;