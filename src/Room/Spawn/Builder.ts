import { CreepType } from "Room/Creeps/mCreep";
import { CreepBodyUtils, CreepSpawn, IcreepSpawn } from "./spawnInterface";



@CreepSpawn()
export class spawnBuilder implements IcreepSpawn
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
    return CreepType.BUILDER;
  }
  getAttackMemory(room:Room): AttackMemory | undefined {
    return undefined;
  }
  SpawnNeeded(room: Room): boolean {
    var SpawnTime = this.BodyParts(room).length * 3;
    var countCreeps = room.getCreepsAlive(CreepType.BUILDER,SpawnTime).length;

    var spawnCount = 2;
    if(room.storage != undefined)
    {
      if(room.storage.store.getUsedCapacity(RESOURCE_ENERGY) <= 100000)
      {
        spawnCount = 1;
      }
      if(room.storage.store.getUsedCapacity(RESOURCE_ENERGY) <= 15000)
      {
        spawnCount = 0;
      }
    }
    if(room.find(FIND_MY_CONSTRUCTION_SITES).length <= 0)
    {
      return false;
    }
    if(countCreeps < spawnCount)
    {
      return true;
    }
    return false;
  }
  Priority(room: Room): number {
    return 60;
  }
  BodyParts(room: Room): BodyPartConstant[] {
    var returnVal:BodyPartConstant[] = []
    if(room.energyCapacityAvailable >= 300)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:2,
        WORK:1,
        CARRY:1
      });
    }
    if(room.energyCapacityAvailable >= 400)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:3,
        WORK:2,
        CARRY:1
      });
    }
    if(room.energyCapacityAvailable >= 600)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:5,
        WORK:2,
        CARRY:3
      });
    }
    if(room.energyCapacityAvailable >= 800)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:7,
        WORK:2,
        CARRY:5
      });
    }
    if(room.energyCapacityAvailable >= 1050)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:9,
        WORK:3,
        CARRY:6
      });
    }
    if(room.energyCapacityAvailable >= 1350)
    {
      returnVal =  CreepBodyUtils.Part({
        MOVE:11,
        WORK:5,
        CARRY:6
      });
    }
    return returnVal;
  }
}
