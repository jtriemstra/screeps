var spawner = {
    run: function() {
		var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
		if(harvesters.length == 0) {
			var newName = 'FastHarvester';
			//console.log('Spawning new harvester: ' + newName);
			Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,MOVE,MOVE], newName, 
				{memory: {role: 'harvester'}});        
		}
	}
};

module.exports = spawner;