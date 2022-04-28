import { CreepType } from "Room/Creeps/mCreep";
import { roomHandler } from "Room/Room";
import { CreepBodyUtils, CreepSpawn, IcreepSpawn } from "./spawnInterface";



@CreepSpawn()
export class spawnReservator implements IcreepSpawn
{
  Memory(room: Room): CreepMemory | undefined {
    var crpMem:CreepMemory = {
      creepGlobal: {
        Room: room.name,
        Typ: CreepType.RESERVATOR
      },
      remoteMemory: {
        remoteRoom: "E18S37"
      },
      attackControllerMemory:{
        attackController: false,
        claimController: false,
        reservateController: true
      }
    }
    return crpMem;
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
    return CreepType.RESERVATOR;
  }
  SpawnNeeded(room: Room): boolean {
    if(room.name != "E18S38")
      return false;
    for(var crpName in Game.creeps)
    {
      var crp = Game.creeps[crpName];
      if(crp.memory.creepGlobal.Typ == CreepType.RESERVATOR &&
         crp.memory.creepGlobal.Room == room.name)
      {
        return false;
      }
    }
    return true;
  }
  Priority(room: Room): number {
    return 45;
  }
  BodyParts(room: Room): BodyPartConstant[] {
    var returnVal:BodyPartConstant[] = []
    if(room.energyCapacityAvailable >= 650)
    {
      returnVal =  CreepBodyUtils.Part({
        CLAIM:1,
        MOVE:1
      });
    }
    return returnVal;
  }
}
