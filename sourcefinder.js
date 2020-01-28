var constants = require('./constants');
var memoryWrapper = require('./memorywrapper');

var sourceFinder = {
    find: function(creep){

    },
    shouldPrioritizeOneSource: function(room){
        //TODO: make this dynamic
        if (room.name === 'W8N3'){
            return false;
        }
        else {
            return true;
        }
    },
    sourceS0_M: function(creep){
        //TODO: when miners are spread apart, always preferring the miners causes creeps to bounce from one miner to another when they could harvest themselves temporarily
		var sources = creep.room.find(FIND_MY_CREEPS, {
				filter: (minerCreep) => {
					return minerCreep.memory.role == constants.ROLE_MINER && minerCreep.store.getFreeCapacity() == 0;
				}
		});
		
		if (sources.length == 0) {
			sources = creep.room.find(FIND_SOURCES);
		}
		
		//TODO: consider how this algorithm changes if miners come back into play
		if (sources.length == 1) {
			return sources[0];			
		}
		else if (sources.length > 1){
			return creep.pos.findClosestByPath(sources);
		}
		else {
			return null;
		}
	},
	
	sourceS0: function(creep) {
		var sources = creep.room.find(FIND_SOURCES);
		
		if (sources.length == 1) {
			return sources[0];			
		}
		else if (sources.length > 1){
			return creep.pos.findClosestByPath(sources);
		}
		else {
			return null;
		}
	},
	
	sourceS1: function(creep) {
		var sources = creep.room.find(FIND_SOURCES);
		
		if (sources.length > 1) {
			return sources[1];
		}
		else {
			return null;
		}
	},

	sourceExternal: function(creep) {
		var sources = [];
		var sourceIds = memoryWrapper.externalSources.getList();

		for (var i=0; i<sourceIds.length; i++){
			sources.push(Game.getObjectById(sourceIds[i]));
		}

		//TODO: explorer currently only pushes a single source, but eventually need multiple, and need to sort by closest
		if (sources.length > 0) {
			return sources[0];
		}
		return null;
    },
    
	sourceFinders: [],
};

sourceFinder.sourceFinders.push(sourceFinder.sourceS0_M);
sourceFinder.sourceFinders.push(sourceFinder.sourceS0);
sourceFinder.sourceFinders.push(sourceFinder.sourceS1);
sourceFinder.sourceFinders.push(sourceFinder.sourceExternal);

module.exports = sourceFinder;