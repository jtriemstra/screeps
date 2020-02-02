var memoryWrapper = {
    externalSources : {
        add: function(id, distance, roomName){
            if (Memory.externalSources == undefined || Memory.externalSources == null) {
                Memory.externalSources = [];
            }

            var thisRoom = Memory.externalSources.filter(s => s.id == id);
            if (thisRoom.length == 0){
                Memory.externalSources.push({"id":id, "distance":distance, "roomName": roomName});
            }
        },
        getList: function(){
            if (Memory.externalSources == undefined || Memory.externalSources == null){
                return [];
            }
            return Memory.externalSources;
        },
        roomIsSaved: function(roomName){
            if (Memory.externalSources == undefined || Memory.externalSources == null){
                return false;
            }

            return (Memory.externalSources.filter(s => s.roomName == roomName).length > 0) && Game.rooms[roomName];
        }
    },
    sourceDrained: {
        //TODO: make this less binary and more of a range from underutilized to overutilized
        set: function(){
            Memory.sourceDrained = true;
        },
        get: function(){
            if (Memory.sourceDrained == undefined || Memory.sourceDrained == null) {
                return false;
            }
            return Memory.sourceDrained;
        }
    },
    exitsExploring: {
        add: function(pos, creepName){
            if (Memory.exitsExploring == undefined || Memory.exitsExploring == null){
                Memory.exitsExploring = {};
            }
            Memory.exitsExploring[creepName] = pos;
        },
        getList: function(){
            if (Memory.exitsExploring == undefined || Memory.exitsExploring == null){
                return [];
            }

            var exits = [];
            for (var creepName in Memory.exitsExploring){
                var e = Memory.exitsExploring[creepName];
                exits.push(new RoomPosition(e.x, e.y, e.roomName));
            }
            return exits;
        },
        remove: function(creepName){
            if (Memory.exitsExploring == undefined || Memory.exitsExploring == null){
                return;
            }

            delete Memory.exitsExploring[creepName];
        }
    }
};

module.exports = memoryWrapper;