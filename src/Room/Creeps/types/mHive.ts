import { contains } from "lodash";
import {baseCreeps, CreepType} from "Room/Creeps/mCreep";
export {}

export class mHive extends baseCreeps{
  onTick(): void {
    if(this.sCreep.room.memory.ActionStructures && this.sCreep.room.memory.ActionStructures.HiveLink)
    {
      var storageLink = Game.getObjectById(this.sCreep.room.memory.ActionStructures.HiveLink) as StructureLink;
      if(this.sCreep.room.memory.RefillStructure &&
        this.sCreep.room.memory.RefillStructure[storageLink.id] != undefined&&
        this.sCreep.room.memory.RefillStructure[storageLink.id].Direction == 1)
      {
        if(this.sCreep.room.memory.RefillStructure[storageLink.id].GoalAmmount > storageLink.store.getUsedCapacity(RESOURCE_ENERGY) )
        {
          if(this.sCreep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
          {
            if(this.sCreep.transfer(storageLink,RESOURCE_ENERGY) == OK)
            {
              return;
            }
          }
          else{
            if(this.sCreep.room.storage)
            {
              if(this.sCreep.withdraw(this.sCreep.room.storage,RESOURCE_ENERGY) == OK)
              {
                return;
              }
            }
          }
        }
      }
      else if(this.sCreep.room.storage && storageLink.store.getUsedCapacity(RESOURCE_ENERGY) > 300)
      {
        if(this.sCreep.withdraw(storageLink,RESOURCE_ENERGY) == OK)
        {
          return;
        }
      }
    }
    if(this.sCreep.room.memory.ActionStructures &&
      this.sCreep.room.memory.ActionStructures.HiveTower)
      {
        var HiveTower = Game.getObjectById(this.sCreep.room.memory.ActionStructures.HiveTower) as StructureTower;
        if(HiveTower.store.getUsedCapacity(RESOURCE_ENERGY) < 2000)
        {
          var err = this.sCreep.transfer(HiveTower,RESOURCE_ENERGY);
          if(err == ERR_NOT_ENOUGH_RESOURCES)
          {
            if(this.sCreep.withdraw(this.sCreep.room.storage!,RESOURCE_ENERGY) == OK)
            {
              return;
            }
          }
          else if(err == OK)
          {
            return;
          }
        }
      }
    if(this.sCreep.room.memory.ActionStructures &&
      this.sCreep.room.memory.ActionStructures.HiveLab)
      {
        var HiveLab = Game.getObjectById(this.sCreep.room.memory.ActionStructures.HiveLab) as StructureLab;
        if(HiveLab.store.getUsedCapacity(RESOURCE_ENERGY) < 2000)
        {
          var err = this.sCreep.transfer(HiveLab,RESOURCE_ENERGY);
          if(err == ERR_NOT_ENOUGH_RESOURCES)
          {
            if(this.sCreep.withdraw(this.sCreep.room.storage!,RESOURCE_ENERGY) == OK)
            {
              return;
            }
          }
          else if(err == OK)
          {
            return;
          }
        }
        else if(HiveLab.store.getUsedCapacity(RESOURCE_CATALYZED_GHODIUM_ACID) < 3000)
        {
          var err=this.sCreep.transfer(HiveLab,RESOURCE_CATALYZED_GHODIUM_ACID);
          if(err == ERR_NOT_ENOUGH_RESOURCES)
          {
            if(this.sCreep.withdraw(this.sCreep.room.terminal!,RESOURCE_CATALYZED_GHODIUM_ACID) == OK)
            {
              return;
            }
          }
          else if(err == OK)
          {
            return;
          }
        }
      }
      if(this.sCreep.room.storage != undefined)
      {
        if(this.sCreep.room.terminal && this.sCreep.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY)> 15000)
        {
          this.sCreep.withdraw(this.sCreep.room.terminal,RESOURCE_ENERGY);
        }
      }

    this.putInFactory();
    RESOURCES_ALL.forEach((resource)=>{
      if(resource == RESOURCE_ENERGY)
      {
        this.sCreep.transfer(this.sCreep.room.storage!,resource);
      }
      else
      {
        this.sCreep.transfer(this.sCreep.room.terminal!,resource);
      }
    });
  }



  putInFactory():void{
    var room = this.sCreep.room;
    if(room.controller && room.controller.level == 8 && room.memory.ActionStructures && room.memory.ActionStructures.Factory && room.storage)
    {
      if(room.storage.store.getUsedCapacity(RESOURCE_ENERGY) >= 700000)
      {
        var Factory = Game.getObjectById(room.memory.ActionStructures.Factory)as StructureFactory;
        if(this.sCreep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
          this.sCreep.withdraw(room.storage,RESOURCE_ENERGY);
        else if(Factory.store.getUsedCapacity(RESOURCE_ENERGY) <= 15000)
          this.sCreep.transfer(Factory,RESOURCE_ENERGY);
      }
    }
  }

  EmptyTerminal():void{
    if(this.sCreep.room.terminal && this.sCreep.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 20000)
    {
      if(this.sCreep.store.getUsedCapacity() == 0)
      {
        this.sCreep.withdraw(this.sCreep.room.terminal,RESOURCE_ENERGY);
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
