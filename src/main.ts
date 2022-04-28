import { ErrorMapper } from "utils/ErrorMapper";
import { Traveler } from "traveler";
import { CreepController } from "Controller/ctrlCreep";
import "Commands";
import "Room/Creeps/mCreep";
import "utils/roomVisual";
import "Room/RoomCache";
import { RoomPlan } from "Room/RoomBuildingSystem";
import "Room/Structures/Tower";
import { mTower } from "Room/Structures/Tower";
import "Room/Contract/ContractStore";
import { mExtension } from "Room/Structures/Extension";
import { ContractRefillTower } from "Room/Contract/ContractTypes/Working/ContractRefillTower";
import { ContractExtensionRefill } from "Room/Contract/ContractTypes/Working/ContractExtensionRefill";
import { mSpawn } from "Room/Structures/Spawn";
import { memoize, object } from "lodash";
import { roomHandler } from "Room/Room";
import { IcreepSpawn, registeredClasses } from "Room/Spawn/spawnInterface";
import "Room/Spawn/Worker";
import "Room/Spawn/Upgrader";
import "Room/Spawn/Miner";
import "Room/Spawn/Builder";
import "Room/Spawn/FallBack";
import "Room/Spawn/HiveWorker";
import "Room/Spawn/Reservator";
import "Room/Spawn/BaseRefill";
import { mLink } from "Room/Structures/Link";
import { Console } from "console";
import { classContractManager } from "Room/Contract/ContractManager";
import { mTerminal } from "Room/Structures/Terminal";
import { globalAgent } from "http";
import { mLab } from "Room/Structures/Lab";
import { mContainer } from "Room/Structures/Container";
import { ContractHarvestDroppedEnergy } from "Room/Contract/ContractTypes/Harvesting/ContractHarvestDroppedEnergy";
import { Market } from "Market/market";
import "Room/Structures/structureMemory"
declare global {

  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  /*interface Memory {
    uuid: number;
    log: any;
  }
*/
  interface CreepMemory {
    Typ?: string;
    Harvesting?: boolean;
    FillObj?:string;
    FromRoom?:string;
  }
  interface Memory{
    empire:any;
  }
interface SpawnMemory{
}
  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}


function uuid():string{
  var date = new Date();
  return `${Math.random()}.${date.getHours()}${date.getDay()}${date.getFullYear()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  for (const name in Memory.spawns) {
    if (!(name in Game.spawns)) {
      delete Memory.spawns[name];
    }
  }
  classContractManager.CPUCost = 0;
  //CHECK CM Mem Usage
  Market.run();
  //-----------------
  if(Game.cpu.bucket >= 10000)
  {
    Game.cpu.generatePixel();

  }

  for(var strRoom in Game.rooms)
  {
    var CPU : number = Game.cpu.getUsed();
    var room = Game.rooms[strRoom];
    //rv.structure(2,2,STRUCTURE_STORAGE);
    if(room.controller!= undefined && room.controller!.my)
    {
      room.ContractManager.Init(room);
      roomHandler.numSpawn = 0;
      new roomHandler(room);
      for(var crpEnemy of room.find(FIND_HOSTILE_CREEPS))
      {
        if(crpEnemy.owner.username != "Invader" && crpEnemy.isFriend() == false)
        {
          if(crpEnemy.pos.getRangeTo(crpEnemy.pos.findClosestByRange(FIND_SOURCES)!) <= 5)
          {
            room.controller!.activateSafeMode();
          }
          if(crpEnemy.pos.getRangeTo(crpEnemy.pos.findClosestByRange(FIND_MY_SPAWNS)!) <= 5)
          {
            room.controller!.activateSafeMode();
          }
        }
      }
      var cpuStructure = Game.cpu.getUsed();
      var CPUCount = -1;
      CPUCount = Game.cpu.getUsed();
      for(var structs of room.find(FIND_STRUCTURES))
      {
        switch(structs.structureType)
        {
          case STRUCTURE_TOWER:
            new mTower(structs);
            break;
          case STRUCTURE_EXTENSION:
            new mExtension(structs);
            break;
          case STRUCTURE_SPAWN:
            new mSpawn(structs);
            break;
          case STRUCTURE_TERMINAL:
            new mTerminal(structs);
            break;
          case STRUCTURE_LAB:
            new mLab(structs);
            break;
          case STRUCTURE_CONTAINER:
            new mContainer(structs);
            break;
        }

      }
      if(room.storage != undefined)
      {
        if(Game.time%1000 || room.memory.StorageEnergy02 == undefined)
        {
          if(room.memory.StorageEnergy02 == undefined)
          {
            room.memory.StorageEnergy02 = room.storage.store.getUsedCapacity(RESOURCE_ENERGY);
          }
          else
          {
            room.memory.StorageEnergy02 = room.memory.StorageEnergy01;
          }
          room.memory.StorageEnergy01 = room.storage.store.getUsedCapacity(RESOURCE_ENERGY);
        }
      }
    }
    var CPUCreeps = Game.cpu.getUsed();
    var crpCtrl = new CreepController(room.name);
    room.visual.text("CPU: "+(Game.cpu.getUsed() - CPU),new RoomPosition(1,4,room.name),{
      align: "left"
    });
    room.visual.text("CPU Creeps: "+(Game.cpu.getUsed() - CPUCreeps),new RoomPosition(1,5,room.name),{
      align: "left"
    });
    console.log("CM - CPU: "+classContractManager.CPUCost);
  }
});

