import { CreepType } from "Room/Creeps/mCreep";
import { CreepBodyUtils, CreepSpawn, IcreepSpawn } from "./spawnInterface";



@CreepSpawn()
export class spawnHiveWorker implements IcreepSpawn
{
  Memory(room: Room): CreepMemory | undefined {
    return undefined;
  }
  Direction(room: Room): DirectionConstant[] | undefined {
    return [RIGHT] as DirectionConstant[];
  }
  Spawn(room: Room): string | undefined {

    if(room.memory.ActionStructures != undefined)
    {
      if(room.memory.ActionStructures.HiveSpawn != undefined)
      {
        return room.memory.ActionStructures.HiveSpawn;
      }
    }
    return undefined;
  }
  getAttackMemory(room:Room): AttackMemory | undefined {
    return undefined;
  }
  Typ(room: Room): CreepType {
    return CreepType.HIVE;
  }
  SpawnNeeded(room: Room): boolean {

    var SpawnTime = (this.BodyParts(room).length) * 3; // TICKS Minus 1 aufgrund der Source suche. Wenn er genau dann kommt wenn der andere Stirbt, kann es passieren, dass er die Source nimmt. wo scho ein Creeps dransteht

    var countCreeps = room.getCreepsAlive(CreepType.HIVE,SpawnTime).length;
    if(room.memory.ActionStructures != undefined &&
      room.memory.ActionStructures.HiveSpawn != undefined)
      {
        if(countCreeps < 1)
        {
          return true;
        }
      }
    return false;
  }
  Priority(room: Room): number {
    return 45;
  }
  BodyParts(room: Room): BodyPartConstant[] {
    var returnVal:BodyPartConstant[] = []
    if(room.energyCapacityAvailable >= 300)
    {
      returnVal =  CreepBodyUtils.Part({
        CARRY:10,
      });
    }
    return returnVal;
  }
}
