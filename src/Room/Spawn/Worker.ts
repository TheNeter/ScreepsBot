import { count } from "console";
import { CreepType } from "Room/Creeps/mCreep";
import { CreepBodyUtils, CreepSpawn, IcreepSpawn } from "./spawnInterface";



@CreepSpawn()
export class spawnWorker implements IcreepSpawn
{
  Memory(room: Room): CreepMemory | undefined {
    return undefined;
  }
  Direction(room: Room): DirectionConstant[] | undefined {
    return undefined;
  }
  Spawn(room: Room): string | undefined {
    return undefined;
  }
  Typ(room: Room): CreepType {
    return CreepType.WORKER;
  }
  getAttackMemory(room:Room): AttackMemory | undefined {
    return undefined;
  }
  SpawnNeeded(room: Room): boolean {
    var SpawnTime = this.BodyParts(room).length * 4;
    var countCreeps = room.getCreepsAlive(CreepType.WORKER,SpawnTime).length;
    var countCreepsDropMiner = room.getCreepsAlive(CreepType.DROPMINER,SpawnTime).length;
    var SpawnCount = 1;
    var countDR = 0;
    var CountLinks = 0;
    if(room.memory.structureMemory.SourceLink)
    {
      for(var e in room.memory.structureMemory.SourceLink)
      {
        CountLinks++;
      }
    }
    if(countCreeps < SpawnCount && CountLinks <= 1)
    {
      return true;
    }
    return false;
  }
  Priority(room: Room): number {
    return 80;
  }



  BodyParts(room: Room): BodyPartConstant[] {
    let returnVal = new Array();
    if(room.energyCapacityAvailable >= 300)
    {
      returnVal= CreepBodyUtils.Part({
        MOVE:2,
        WORK:1,
        CARRY:1
      });
    }
    if(room.energyCapacityAvailable >= 350)
    {
      returnVal= CreepBodyUtils.Part({
        MOVE:3,
        WORK:1,
        CARRY:2
      });
    }
    if(room.energyCapacityAvailable >= 550)
    {
      returnVal= CreepBodyUtils.Part({
        MOVE:5,
        WORK:1,
        CARRY:4
      });
    }
    if(room.energyCapacityAvailable >= 750)
    {
      returnVal= CreepBodyUtils.Part({
        MOVE:5,
        WORK:1,
        CARRY:8
      });
    }
    if(room.energyCapacityAvailable >= 1150)
    {
      returnVal= CreepBodyUtils.Part({
        MOVE:8,
        CARRY:15
      });
    }
    if(room.energyCapacityAvailable >= 1500)
    {
      returnVal = CreepBodyUtils.Part({
        MOVE:10,
        CARRY:20
      });
    }
    if(room.controller!.level >= 7)
    {
      if(room.energyCapacityAvailable >= 1500)
      {
        returnVal = CreepBodyUtils.Part({
          MOVE:15,
          CARRY:30
        });
      }
    }
    return returnVal;
  }
}
