var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawner = require('spawner');
var constants = require('constants');

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
	
	spawner.run();
	
	for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
		if(creep.memory.role == constants.HARVESTER) {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == constants.UPGRADER) {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == constants.BUILDER) {
            roleBuilder.run(creep);
        }
    }
}