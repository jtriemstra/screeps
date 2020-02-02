var constants = require('./constants');
var roleBase = require('./role.base');
var memoryWrapper = require('./memorywrapper');

var roleExplorer = {
	/** @param {Creep} creep **/
    run: function(creep) {
		if (creep.spawning) { 
			return;
		}

		if (!this.hasTargetExit(creep)){
			if (creep.memory.watching) {console.log("need target for explorer " + roleBase.log(creep));}
			if (!this.assignTargetExit(creep)){
				if (creep.memory.watching) {console.log("failed to assign target for explorer " + roleBase.log(creep));}
				return;
			}
		}

        if (creep.room.name === creep.memory.originalRoomName){
			if (creep.memory.watching) {console.log(creep.room.name);}
			
			var exitPos = new RoomPosition(creep.memory.targetExit.x, creep.memory.targetExit.y, creep.memory.targetExit.roomName);
			if (creep.pos.isEqualTo(exitPos)){				
				if (creep.memory.watching) {console.log("on exit position");}
			}
			else {				
				if (creep.memory.watching) {console.log("moving to exit position");}
				creep.moveTo(exitPos);
			}			
		}
		else {
			if (creep.memory.watching) {console.log("out of original room");}
			if (!memoryWrapper.externalSources.roomIsSaved(creep.room.name)){
				var sources = creep.room.find(FIND_SOURCES);
			
				for(const source of sources){
					var path = creep.pos.findPathTo(source);
					memoryWrapper.externalSources.add(source.id, path.length, creep.room.name);
				}
				
				memoryWrapper.exitsExploring.remove(creep.name);
			}
			if (creep.pos.x == 0){
				creep.move(RIGHT);
			}			
			if (creep.pos.x == 49){
				creep.move(LEFT);
			}
			if (creep.pos.y == 0){
				creep.move(BOTTOM);
			}
			if (creep.pos.y == 49){
				creep.move(TOP);
			}
		}
	},
	hasTargetExit: function(creep){
		return (creep.memory.targetExit != null && creep.memory.targetExit != undefined);
	},
	assignTargetExit: function(creep){
		//TODO: this runs the find routine every time I need it; storing in memory would be more CPU-efficient
		var potentialExits = this.getExits(creep.room);
		var assignedExits = memoryWrapper.exitsExploring.getList();		

		if (creep.memory.watching) {console.log("potential and assigned exits:")};
		if (creep.memory.watching) {console.log(potentialExits)};
		if (creep.memory.watching) {console.log(assignedExits)};

		for (var i=0; i<potentialExits.length; i++){
			if (assignedExits.filter(e => (e.x == potentialExits[i].x && e.y == potentialExits[i].y && e.roomName == potentialExits[i].roomName)).length == 0){
				console.log("assigning");		
				memoryWrapper.exitsExploring.add(potentialExits[i]);
				creep.memory.targetExit = potentialExits[i];
				return true;
			}
		}

		return false;
	},
	getExits: function(room){
		var sides = [FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT];
		var selectedExits = [];
		for (const side of sides){
			var exits = room.find(side);
			if (exits && exits.length > 0){
				var singleExit = this.pickExitTilesForASide(exits);
				if (singleExit){
					selectedExits.push(singleExit);
				}
			}
		}
		return selectedExits;
	},
	pickExitTilesForASide: function(exitPositions, useYCoord){
		//TODO: if a side has a wall on part of it, there's two distinct sets of exit tiles that could have very different consequences
		if (exitPositions && exitPositions.length > 0){
			return exitPositions[0];
		}
		return null;
	}
};

module.exports = roleExplorer;