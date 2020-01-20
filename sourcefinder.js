var sourceFinder = {
    find: function(creep){

    },
    shouldPrioritizeOneSource: function(room){
        //TODO: flesh this out
        if (room.name === 'W8N3'){
            return false;
        }
        else {
            return true;
        }
    }
};

module.exports = sourceFinder;