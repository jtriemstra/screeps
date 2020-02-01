var memoryWrapper = {
    externalSources : {
        add: function(id, distance, roomName){
            if (Memory.externalSources == undefined || Memory.externalSources == null) {
                Memory.externalSources = [];
            }
            if (!Memory.externalSources.includes(id)){
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

            return Memory.externalSources.filter(s => s.roomName == roomName).length > 0;
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
        add: function(pos){
            if (Memory.exitsExploring == undefined || Memory.exitsExploring == null){
                Memory.exitsExploring = [];
            }
            Memory.exitsExploring.push(pos);
        },
        getList: function(){
            if (Memory.exitsExploring == undefined || Memory.exitsExploring == null){
                return [];
            }
            return Memory.exitsExploring.map(e => new RoomPosition(e.x, e.y, e.roomName));
        }
    }
};

module.exports = memoryWrapper;