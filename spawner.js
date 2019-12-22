var constants = require('constants');

var spawner = {
    run: function() {
		//var creeps = _.filter(Game.creeps, (creep) => creep.memory.role >= constants.HARVESTER);
		if(Game.creeps.length == 0) {
			var newName = 'FastHarvester';
			//console.log('Spawning new harvester: ' + newName);
			Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.HARVESTER}});        
		}
		else if(Game.creeps.length == 1) {
			var newName = 'FastUpgrader';
			//console.log('Spawning new harvester: ' + newName);
			Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.UPGRADER}});        
		}
		else if(Game.creeps.length == 2) {
			var newName = 'FastHarvester1';
			//console.log('Spawning new harvester: ' + newName);
			Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
				{memory: {role: constants.HARVESTER}});        
		}
	}
};

module.exports = spawner;