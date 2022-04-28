import { CreepType } from "Room/Creeps/mCreep";
import { CreepBodyUtils, CreepSpawn, IcreepSpawn } from "./spawnInterface";



@CreepSpawn()
export class spawnMiner implements IcreepSpawn
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
  getAttackMemory(room:Room): AttackMemory | undefined {
    return undefined;
  }
  Typ(room: Room): CreepType {
    return CreepType.DROPMINER;
  }
  SpawnNeeded(room: Room): boolean {

    var SpawnTime = (this.BodyParts(room).length-3) * 3; // TICKS -2 aufgrund der Source suche. Wenn er genau dann kommt wenn der andere Stirbt, kann es passieren, dass er die Source nimmt. wo scho ein Creeps dransteht
    var countCreeps = room.getCreepsAlive(CreepType.DROPMINER,SpawnTime).length;

    if(countCreeps < 2)
    {
      return true;
    }
    return false;
  }
  Priority(room: Room): number {
    return 79;
  }
  BodyParts(room: Room): BodyPartConstant[] {
    var returnVal:BodyPartConstant[] = []
    if(room.energyCapacityAvailable >= 300)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:1,
        WORK:2,
      });
    }
    if(room.energyCapacityAvailable >= 400)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:2,
        WORK:3,
      });
    }
    if(room.energyCapacityAvailable >= 500)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:2,
        WORK:4,
      });
    }
    if(room.energyCapacityAvailable >= 550)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:1,
        WORK:5,
      });
    }
    if(room.energyCapacityAvailable >= 650)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:3,
        WORK:5,
      });
    }
    if(room.controller && room.controller.level >= 7)
    {
      if(room.energyCapacityAvailable >= 650)
      {
        returnVal =  CreepBodyUtils.Part({
          MOVE:4,
          WORK:8,
          CARRY: 8
        });
      }
    }
    return returnVal;
  }
}
