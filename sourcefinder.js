var constants = require('./constants');
var memoryWrapper = require('./memorywrapper');
var targetFinder = require('./targetfinder');

var functions = {
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
        //TODO: ensure miners are spread evenly on sources
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
        //TODO: save the external source instead of recalculating every time
        var sources = [];
        var distances = [];
		var savedSources = memoryWrapper.externalSources.getList();

		for (var i=0; i<savedSources.length; i++){
            sources.push(Game.getObjectById(savedSources[i].id));
            distances.push(savedSources[i].distance);
		}

        if (sources.length == 1){
            return sources[0];
        }
		else if (sources.length > 1) {
            //TODO: there's a chance that the targetfinder function expects the creep to be in a certain room when it executes. not true for upgraders right now.
            var minPath = 300;
            var target = targetFinder[creep.memory.targetFinderId](creep);
            var chosenSource;
            for(var i=0; i<sources.length; i++){
                var source = sources[i];
                var path = target.pos.findPathTo(source);

                if (path.length + distances[i] < minPath){
                    minPath = path.length + distances[i];
                    chosenSource = source;
                }
            }
            return chosenSource;
		}
		return null;
    },
    
};

var sourceFinder = [
        functions.sourceS0_M,
        functions.sourceS0,
        functions.sourceS1,
        functions.sourceExternal
    ];

module.exports = sourceFinder;