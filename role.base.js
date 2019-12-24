var constants = require('constants');

var roleBase = {

    /** @param {Creep} creep **/
    setTempRole: function(creep, newRole) {
		//TODO: make roles a stack? don't allow temp roles on temp roles?
		creep.memory.origRole = creep.memory.role;
		creep.memory.role = newRole;
	},
	resetTempRole: function(creep) {
		if (creep.memory.origRole > -1) {			
			creep.memory.role = creep.memory.origRole;
			creep.memory.origRole = -1;
		}
	},
	getOrigRole: function(creep) {
	    return creep.memory.origRole == -1 ? creep.memory.role : creep.memory.origRole;
	}
};

module.exports = roleBase;