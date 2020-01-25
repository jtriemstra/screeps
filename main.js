var roleHarvester = require('./role.harvester');
var roleUpgrader = require('./role.upgrader');
var roleBuilder = require('./role.builder');
var spawner = require('spawner');
var constants = require('constants');
var sitecreator = require('sitecreator');
var roleMiner = require('role.miner');
var roleBase = require('role.base');


module.exports.loop = function () {

	var room;
	var creepCount=0;
	var roleCounts = [0,0,0,0,0,0,0];
	
	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        room = creep.room;
		if(creep.memory.role == constants.ROLE_HARVESTER) {
            var result = roleHarvester.run(creep);
			
            if (result == -1) {
				//TODO: this is narrowly applicable
				var newTarget = creep.memory.goal == 3 ? constants.TARGET_REMOTE_EXT : constants.TARGET_CORE_EXT;
				
                roleBase.setTempRole(creep, constants.ROLE_BUILDER, newTarget);
            }
        }
        if(creep.memory.role == constants.ROLE_UPGRADER) {
			roleUpgrader.run(creep);			
        }
        if(creep.memory.role == constants.ROLE_BUILDER) {
            var result = roleBuilder.run(creep);
			if (result == -1 && creep.memory.goal == 3) {
				//TODO: this is narrowly applicable
				roleBase.resetTempRole(creep);
			}
        }
        if(creep.memory.role == constants.ROLE_MINER) {
            roleMiner.run(creep);
        }
        creepCount++;
		roleCounts[roleBase.getOrigRole(creep)]++;
		
    }
    
    spawner.run(creepCount, roleCounts, room);
	if (room && room.energyCapacityAvailable > (Memory.initialCapacity == undefined ? 0 : Memory.initialCapacity)) {
	    console.log("capacity upgraded at " + Game.time);
	    Memory.initialCapacity = room.energyCapacityAvailable;
	}
	if (room) sitecreator.run(room);
}

debug = function(){
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        console.log(roleBase.log(creep));
    }
}

watch = function(creepName) {
    var creep = Game.creeps[creepName];
    creep.memory.watching = !(creep.memory.watching);
    return creep.memory.watching;
}