var constants = require('./constants');

var roleBase = {

    /** @param {Creep} creep **/
    setTempRole: function(creep, newRole, newTarget) {
		//TODO: make roles a stack? don't allow temp roles on temp roles?
		creep.memory.origRole = creep.memory.role;
		creep.memory.role = newRole;
		creep.memory.origTarget = creep.memory.targetFinderId;
		creep.memory.targetFinderId = newTarget;
	},
	resetTempRole: function(creep) {
		if (creep.memory.origRole > -1) {			
			creep.memory.role = creep.memory.origRole;
			creep.memory.origRole = -1;
			creep.memory.targetFinderId = creep.memory.origTarget;
		}
	},
	getOrigRole: function(creep) {
	    return creep.memory.origRole == -1 ? creep.memory.role : creep.memory.origRole;
	},
	log: function(creep) { 
		return "creep " + creep.name + 
		" role: " + creep.memory.role + 
		" goal " + creep.memory.goal + 
		" source " + creep.memory.sourceFinderId + 
		" target " + creep.memory.targetFinderId +
		" upgrading? " + creep.memory.upgrading + 
		" building? " + creep.memory.building;
	},
	countByRole: function(role){
		//TODO: store this in memory to save CPU
		var numberOfCreeps = 0;
		for(var name in Game.creeps) {
			var creep = Game.creeps[name];
			if (creep.memory.role === role){
				numberOfCreeps++;
			}
		}
		return numberOfCreeps;
	}
};

module.exports = roleBase;