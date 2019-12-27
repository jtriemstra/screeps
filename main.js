var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawner = require('spawner');
var constants = require('constants');
var sitecreator = require('sitecreator');
var roleMiner = require('role.miner');
var roleBase = require('role.base');

//Memory.currentStage = constants.UPGRADING;
//console.log("reloading app");

module.exports.loop = function () {

    /*var tower = Game.getObjectById('5bd3543109dcc8e3a0a8e9e0');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }*/
		
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
                roleBase.setTempRole(creep, constants.ROLE_BUILDER, constants.TARGET_CORE_EXT);
            }
        }
        if(creep.memory.role == constants.ROLE_UPGRADER) {
			if (Memory.currentStage == constants.BUILDING) {
			    console.log("in building stage and converting upgrader " + roleCounts[constants.ROLE_UPGRADER]);
				creep.memory.role = constants.ROLE_BUILDER;
				creep.memory.targetFinderId = constants.TARGET_CORE_EXT;
			}
			else {
			    if (Memory.currentStage == constants.BUILDING) {
			        //console.log("in building stage but keeping upgrader " + roleCounts[constants.ROLE_UPGRADER]t);
			    }
			    else {
			        //console.log("upgrader " + roleCounts[constants.ROLE_UPGRADER] + " with stage " + Memory.currentStage);
			    }
				roleUpgrader.run(creep);
			}
        }
        if(creep.memory.role == constants.ROLE_BUILDER) {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == constants.ROLE_MINER) {
            roleMiner.run(creep);
        }
        creepCount++;
		roleCounts[roleBase.getOrigRole(creep)]++;
		
    }
    //console.log(roleCounts);
    spawner.run(creepCount, roleCounts, room);
	if (room && room.energyCapacityAvailable > (Memory.initialCapacity == undefined ? 0 : Memory.initialCapacity)) {
	    console.log("capacity upgraded at " + Game.time);
	    Memory.initialCapacity = room.energyCapacityAvailable;
	}
	if (room) sitecreator.run(room);
}