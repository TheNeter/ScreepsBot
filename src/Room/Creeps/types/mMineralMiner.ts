import { baseCreeps, CreepType } from "Room/Creeps/mCreep";
import { Traveler } from "traveler";
export{}

declare global{
  interface CreepMemory{
    AttackMem?:AttackMemory;
  }
  interface AttackMemory{
    destRoom?:string;
    PreRoom?:string;
  }
}
export class mNineralMiner extends baseCreeps{
  onTick(): void {
  }
  onHarvesting(): void {
    var minerals = this.sCreep.room.find(FIND_MINERALS);
    if(minerals.length > 0)
    {
      var Mineral = minerals[0];
      if(Mineral.mineralAmount > 0)
      {
        if(this.sCreep.harvest(Mineral) == ERR_NOT_IN_RANGE)
        {
          this.sCreep.travelTo(Mineral);
        }
      }
    }
  }
  onWorking(): void {
    if(this.sCreep.room.storage != undefined)
    {
      this.sCreep.store
      RESOURCES_ALL.forEach((x)=>{
        if(this.sCreep.store.getUsedCapacity(x) > 0)
        {
          if(this.sCreep.transfer(this.sCreep.room.terminal!,x) == ERR_NOT_IN_RANGE)
          {
            this.sCreep.travelTo(this.sCreep.room.terminal!);
          }
        }
      });
    }
  }
  onRoomAttacked(): void {
  }
  onCreate(): void {
  }
}
