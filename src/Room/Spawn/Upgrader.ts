import { CreepController } from "Controller/ctrlCreep";
import { CreepType } from "Room/Creeps/mCreep";
import { CreepSpawn, IcreepSpawn } from "./spawnInterface";
import { CreepBodyUtils } from "./spawnInterface";


@CreepSpawn()
export class spawnUpgrader implements IcreepSpawn {
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
    return CreepType.UPGRADER;
  }
  getAttackMemory(room: Room): AttackMemory | undefined {
    return undefined;
  }
  SpawnNeeded(room: Room): boolean {
    var SpawnTime = this.BodyParts(room).length * 3;
    var countCreeps = room.getCreepsAlive(CreepType.UPGRADER, SpawnTime).length;
    var spawnCount = 0;
    if (room.storage != undefined) {
      if (room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        spawnCount = 1;
      }
      if (room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 100000) {
        spawnCount = 2;
      }
    }
    if (room.controller!.level >= 7)
      spawnCount = 1;
    if (countCreeps < spawnCount) {
      return true;
    }
    return false;
  }
  Priority(room: Room): number {
    return 50;
  }
  BodyParts(room: Room): BodyPartConstant[] {
    var returnVal: BodyPartConstant[] = []
    if (room.energyCapacityAvailable >= 300) {
      returnVal = CreepBodyUtils.Part({
        MOVE: 2,
        WORK: 1,
        CARRY: 1
      });
    }
    if (room.energyCapacityAvailable >= 500) {
      returnVal = CreepBodyUtils.Part({
        MOVE: 4,
        WORK: 2,
        CARRY: 2
      });
    }
    if (room.energyCapacityAvailable >= 1000) {
      returnVal = CreepBodyUtils.Part({
        MOVE: 8,
        WORK: 4,
        CARRY: 4
      });
    }
    if (room.energyCapacityAvailable >= 1300) {
      returnVal = CreepBodyUtils.Part({
        MOVE: 8,
        WORK: 6,
        CARRY: 6
      });
    }
    if (room.energyCapacityAvailable >= 1900) {
      returnVal = CreepBodyUtils.Part({
        MOVE: 4,
        WORK: 8,
        CARRY: 6
      });
    }
    if (room.controller && room.controller.level >= 7) {
      if (room.storage && room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 300000) {
        returnVal = CreepBodyUtils.Part({
          MOVE: 6,
          WORK: 12,
          CARRY: 6
        });
      }
      if (room.storage && room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 600000) {
        returnVal = CreepBodyUtils.Part({
          MOVE: 10,
          WORK: 20,
          CARRY: 6
        });
      }
      if (room.storage && room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 650000) {
        returnVal = CreepBodyUtils.Part({
          MOVE: 10,
          WORK: 28,
          CARRY: 12
        });
      }
      if(room.controller && room.controller.level == 8)
      {
        returnVal = CreepBodyUtils.Part({
          MOVE: 4,
          WORK: 4,
          CARRY: 4
        });
      }
    }
    return returnVal;
  }
}
