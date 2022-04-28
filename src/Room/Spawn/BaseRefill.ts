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
    return CreepType.BASEREFILL;
  }
  getAttackMemory(room:Room): AttackMemory | undefined {
    return undefined;
  }
  SpawnNeeded(room: Room): boolean {
    var SpawnTime = this.BodyParts(room).length * 4;
    var countCreeps = room.getCreepsAlive(CreepType.BASEREFILL,SpawnTime).length;
    if(room.storage)
    {
      if(countCreeps < 1)
      {
        return true;
      }
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
    return returnVal;
  }
}
