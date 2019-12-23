var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawner = require('spawner');
var constants = require('constants');
var sitecreator = require('sitecreator');
var roleMiner = require('role.miner');
var roleCourier = require('role.courier');

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
	var upgraderCount=0;
	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        room = creep.room;
		if(creep.memory.role == constants.HARVESTER) {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == constants.UPGRADER) {
			upgraderCount++;
			if (upgraderCount > 1 && Memory.currentStage == constants.BUILDING) {
			    console.log("in building stage and converting upgrader " + upgraderCount);
				creep.memory.role = constants.BUILDER;
			}
			else {
			    if (Memory.currentStage == constants.BUILDING) {
			        //console.log("in building stage but keeping upgrader " + upgraderCount);
			    }
			    else {
			        //console.log("upgrader " + upgraderCount + " with stage " + Memory.currentStage);
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
        creepCount++;
		
		
    }
    spawner.run(creepCount);
	
	if (room) sitecreator.run(room);
}