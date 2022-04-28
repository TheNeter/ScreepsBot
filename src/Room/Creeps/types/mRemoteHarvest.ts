/*import { baseCreeps, CreepType } from "Room/Creeps/mCreep";
import { Traveler } from "traveler";
export{}

declare global{
  interface RoomMemory{
    RemoteHarvest?:RemoteHarvestMemory;
  }
  interface AttackMemory{
    destRoom?:string;
    PreRoom?:string;
  }
  interface RemoteHarvestMemory{
    destRoom?:string;
    countSources?:number;
  }
}
export class mRemoteHarvester extends baseCreeps{
  onHavesting(): void {
    let homeRooom = (Game.rooms[this.sCreep.memory.FromRoom!]);
    if(this.room.name == homeRooom.memory.RemoteHarvest!.destRoom!)
    {
      if(homeRooom == undefined)
      {
        console.log("undefined");
        return;
      }
      let harvestRoom = Game.rooms[homeRooom.memory.RemoteHarvest!.destRoom!];
      if(harvestRoom != undefined)
      {
        var closetSource = harvestRoom.find(FIND_SOURCES_ACTIVE);
        if(closetSource.length > 0)
        {
          if(this.sCreep.harvest(closetSource[0]) == ERR_NOT_IN_RANGE)
          {
            this.sCreep.travelTo(closetSource[0],
              {
                allowSK: false
              });
          }
        }
      }
      return;
    }
    if(this.room.memory.RemoteHarvest != undefined && this.room.memory.RemoteHarvest.destRoom != undefined)
    {
        this.sCreep.travelTo(new RoomPosition(25,25,this.room.memory.RemoteHarvest.destRoom),{
          allowSK: false
        });
    }
  }
  onWorking(): void {
    if(this.sCreep.memory.FromRoom != undefined)
    {
      let homeRoom = Game.rooms[this.sCreep.memory.FromRoom];
      if(homeRoom.storage != undefined)
      {
        if(this.sCreep.transfer(homeRoom.storage,RESOURCE_ENERGY))
        {
          this.sCreep.travelTo(homeRoom.storage,{
            ignoreRoads: true,
            allowSK: false
          });
        }
      }
    }
  }
  onRoomAttacked(): void {
  }
  onCreate(): void {
  }
}
*/
