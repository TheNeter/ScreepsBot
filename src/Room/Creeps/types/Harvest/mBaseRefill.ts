import {baseCreeps, CreepType} from "Room/Creeps/mCreep";
export {}

export class mBaseRefill extends baseCreeps{
  onTick(): void {
  }
  onCreate():void{

  }

  onHarvesting(): void {
    if(this.sCreep.room.storage)
    {
      if(this.sCreep.withdraw(this.sCreep.room.storage,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      {
        this.travelTo(this.sCreep.room.storage);
      }
    }
  }
  onWorking(): void {
    var emptyExtensions = this.sCreep.room.find(FIND_MY_STRUCTURES,{
      filter:(structure)=>{
        if(structure.structureType == STRUCTURE_EXTENSION)
        {
          if(structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
          {
            return true;
          }
        }
        return false;
      }
    });
    if(emptyExtensions.length > 0)
    {
      var closet = this.sCreep.pos.findClosestByRange(emptyExtensions);
      if(closet && this.sCreep.transfer(closet,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      {
        this.sCreep.travelTo(closet);
      }
      return;
    }


    var emptySpawns = this.sCreep.room.find(FIND_MY_STRUCTURES,{
      filter:(structure)=>{
        if(structure.structureType == STRUCTURE_SPAWN)
        {
          if(structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
          {
            return true;
          }
        }
        return false;
      }
    });
    if(emptySpawns.length > 0)
    {
      var closet = this.sCreep.pos.findClosestByRange(emptySpawns);
      if(closet && this.sCreep.transfer(closet,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      {
        this.sCreep.travelTo(closet);
      }
      return;
    }

    var emptyTower = this.sCreep.room.find(FIND_MY_STRUCTURES,{
      filter:(structure)=>{
        if(structure.structureType == STRUCTURE_TOWER)
        {
          if((this.sCreep.room.memory.ActionStructures && this.sCreep.room.memory.ActionStructures.HiveTower != structure.id) || this.sCreep.room.memory.ActionStructures == undefined)
          {
            if(structure.store.getFreeCapacity(RESOURCE_ENERGY) > 300)
            {
              return true;
            }
          }
        }
        return false;
      }
    });
    if(emptyTower.length > 0)
    {
      var closet = this.sCreep.pos.findClosestByRange(emptyTower);
      if(closet && this.sCreep.transfer(closet,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      {
        this.sCreep.travelTo(closet);
      }
      return;
    }

    if(this.sCreep.room.memory.ActionStructures != undefined && this.sCreep.room.memory.ActionStructures.HiveSpawn == undefined && this.sCreep.room.memory.ActionStructures.HiveLink != undefined)
    {
      var hiveLink = Game.getObjectById(this.sCreep.room.memory.ActionStructures.HiveLink) as StructureLink;
      if(hiveLink.store.getFreeCapacity(RESOURCE_ENERGY) > 400)
      {
        if(this.sCreep.transfer(hiveLink,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
          this.travelTo(hiveLink);
        }
      }
    }


  }

  onRoomAttacked(): void {
  }
}
