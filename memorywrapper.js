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
    }
};

module.exports = memoryWrapper;