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
    var countWorker = room.getCreepsAlive(CreepType.WORKER,0).length;
    countWorker += room.getCreepsAlive(CreepType.BASEREFILL,0).length;
    countWorker += room.getCreepsAlive(CreepType.DROPMINER,0).length;
    if(countWorker <= 0)
    {
      return true;
    }
    return false;
  }
  Priority(room: Room): number {
    return 150;
  }



  BodyParts(room: Room): BodyPartConstant[] {
    let returnVal = new Array();
    if(room.energyAvailable >= 300)
    {
      returnVal= CreepBodyUtils.Part({
        MOVE:2,
        WORK:1,
        CARRY:1
      });
    }
    if(room.energyAvailable >= 350)
    {
      returnVal= CreepBodyUtils.Part({
        MOVE:3,
        WORK:1,
        CARRY:2
      });
    }
    if(room.energyAvailable >= 550)
    {
      returnVal= CreepBodyUtils.Part({
        MOVE:5,
        WORK:1,
        CARRY:4
      });
    }
    if(room.energyAvailable >= 750)
    {
      returnVal= CreepBodyUtils.Part({
        MOVE:5,
        WORK:1,
        CARRY:8
      });
    }
    return returnVal;
  }
}
