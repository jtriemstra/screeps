var memoryWrapper = {
    externalSources : {
        add: function(id){
            if (Memory.externalSources == undefined || Memory.externalSources == null) {
                Memory.externalSources = [];
            }
            if (!Memory.externalSources.includes(id)){
                Memory.externalSources.push(id);
            }
        },
        getList: function(){
            return Memory.externalSources;
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
    }
};

module.exports = memoryWrapper;