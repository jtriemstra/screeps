var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawner = require('spawner');
var constants = require('constants');
var sitecreator = require('sitecreator');
var roleMiner = require('role.miner');
var roleBase = require('role.base');
var roleRemoteBuilder = require('role.remotebuilder');

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
	var roleCounts = [0,0,0,0,0,0];
	
	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        room = creep.room;
		if(creep.memory.role == constants.HARVESTER) {
            var result = roleHarvester.run(creep);
            if (result == -1) {
                roleBase.setTempRole(creep, constants.BUILDER);
            }
        }
        if(creep.memory.role == constants.UPGRADER) {
			if (Memory.currentStage == constants.BUILDING) {
			    console.log("in building stage and converting upgrader " + roleCounts[constants.UPGRADER]);
				creep.memory.role = constants.BUILDER;
			}
			else {
			    if (Memory.currentStage == constants.BUILDING) {
			        //console.log("in building stage but keeping upgrader " + roleCounts[constants.UPGRADER]t);
			    }
			    else {
			        //console.log("upgrader " + roleCounts[constants.UPGRADER] + " with stage " + Memory.currentStage);
			    }
				roleUpgrader.run(creep);
			}
        }
        if(creep.memory.role == constants.BUILDER) {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == constants.MINER) {
            roleMiner.run(creep);
        }
        if(creep.memory.role == constants.COURIER) {
            roleCourier.run(creep);
        }
		if(creep.memory.role == constants.REMOTE_BUILDER) {
            roleRemoteBuilder.run(creep);
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