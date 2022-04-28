import { contains } from "lodash";
import {baseCreeps, CreepType} from "Room/Creeps/mCreep";
import { Traveler } from "traveler";
export {}

export class mReservator extends baseCreeps{
  onTick(): void {
    if(this.sCreep.memory.remoteMemory != undefined)
    {
      if(this.sCreep.room.name != this.sCreep.memory.remoteMemory.remoteRoom)
      {
        this.sCreep.travelTo(new RoomPosition(25,25,this.sCreep.memory.remoteMemory.remoteRoom));
      }
      else
      {
        if(this.sCreep.claimController(this.sCreep.room.controller!) == ERR_NOT_IN_RANGE)
        {
          this.sCreep.travelTo(this.sCreep.room.controller!);
        }
      }
    }
  }
  onCreate():void{

  }

  onHarvesting(): void {
  }

  onWorking(): void {
  }

  onRoomAttacked(): void {
  }
}
