import { baseCreeps, CreepType } from "Room/Creeps/mCreep";
import { Traveler } from "traveler";
export{}
export class mUpgrader extends baseCreeps{
  onTick(): void {

    if((this.sCreep.memory.boosted == undefined || this.sCreep.memory.boosted == false) && this.sCreep.room.name == "E18S38")
    {
      if(this.sCreep.room.memory.ActionStructures && this.sCreep.room.memory.ActionStructures.HiveLab)
      {
        var HiveLab = Game.getObjectById(this.sCreep.room.memory.ActionStructures.HiveLab) as StructureLab;
        if(HiveLab.store.getUsedCapacity(RESOURCE_CATALYZED_GHODIUM_ACID) >= this.sCreep.getActiveBodyparts(WORK)*30)
        {
          this.sCreep.memory.stopControl = true;
          var boostErr = HiveLab.boostCreep(this.sCreep,this.sCreep.getActiveBodyparts(WORK));
          if(boostErr == ERR_NOT_IN_RANGE)
          {
            this.sCreep.travelTo(HiveLab);
          }
          else if(boostErr == OK)
          {
            this.sCreep.memory.stopControl = false;
            this.sCreep.memory.boosted = true;
          }
        }
      }
    }
  }
  onHarvesting(): void {
    if(this.sCreep.memory.stopControl && this.sCreep.memory.stopControl == true) return;
    var upgradeLink = Game.getObjectById(this.sCreep.room.memory.ControllerLink!);
    if(upgradeLink != undefined)
    {
      if(this.sCreep.withdraw(upgradeLink as StructureLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      {
        this.sCreep.travelTo(upgradeLink as StructureLink);
      }
    }
    else if(this.sCreep.room.storage != undefined && this.sCreep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > this.sCreep.store.getCapacity())
    {
      if(this.sCreep.withdraw(this.sCreep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      {
        this.sCreep.travelTo(this.sCreep.room.storage);
      }
    }
  }
  onWorking(): void {
    if(this.sCreep.memory.stopControl && this.sCreep.memory.stopControl == true) return;
    if(this.sCreep.room.controller && this.sCreep.room.controller.level == 8)
    {
      if(Game.time % 10 == 0)
      {
        if(this.sCreep.upgradeController(this.sCreep.room.controller!) == ERR_NOT_IN_RANGE)
        {
          this.sCreep.travelTo(this.sCreep.room.controller!)
        }
      }
    }
    else
    {
      var modVal = 1;
      if(this.sCreep.room.storage && this.sCreep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) < 20000)
      {
        modVal = 2;
      }
      if(this.sCreep.room.controller && this.sCreep.room.controller.level == 8)
      {
        modVal = 3;
      }
      if(Game.time % modVal == 0)
      {
        if(this.sCreep.upgradeController(this.sCreep.room.controller!) == ERR_NOT_IN_RANGE)
        {
          this.sCreep.travelTo(this.sCreep.room.controller!)
        }
      }
    }
  }
  onRoomAttacked(): void {
  }
  onCreate(): void {
  }
}
