import { Console } from "console";
import { createPrivateKey, scrypt } from "crypto";
import { mContract } from "Room/Contract/ContractManager";
import { Traveler } from "traveler";

export {}

export class CreepType{
  public static WORKER = "Worker";
  public static DROPMINER = "DropMiner";
  public static UPGRADER = "Upgrader";
  public static BUILDER = "Builder";
  public static DEFENDER = "Defender";
  public static RANGEDEFENDER = "RangeDefender";
  public static SCOUT = "SCOUT";
  public static DISMANTLER = "DISMANTLER";
  public static REMOTEWORKER = "REMOTEWORKER";
  public static CLAIMER = "CLAIMER";
  public static RANGE_HEAL_ATTACKER = "RANGEHEALATTACKER";
  public static ATTACK_DISMANTLER = "ATTACKDISMANTLER";
  public static KILLCLAIMER = "KILLCLAIMER";
  public static KOBOLT = "KOBOLT";
  public static REMOTE_HARVESTER = "REMOTEHARVESTER";
  public static MINERAL_MINER = "MINERAL_MINER";
  public static HIVE = "HIVE";
  public static RESERVATOR = "RESERVATOR";
  public static BASEREFILL = "BASEREFILL";
  public static QuadMember = "QUADMEMBER";
}

declare global{
  interface CreepMemory {
    SourceContainer?:string;
    stopControl?:boolean;
    boosted?:boolean;
  }
  interface Creep{
    Contracts:mContract[];
  }
}

Object.defineProperty(Creep.prototype,"Contracts",{
  get(){
    var crp:Creep = this;
    return crp.room.ContractManager.GetAssignedTo(crp.id);
  }
})


export abstract class baseCreeps{

  public sCreep:Creep;
  public isTraveled: boolean = false;

  public travelTo(destination:HasPos|RoomPosition):number{
    var travelErr = this.sCreep.travelTo(destination);
    if(travelErr == OK)
    {
      this.isTraveled = true;
    }
    return travelErr;
  }
  constructor(creep:string){
    this.sCreep = Game.creeps[creep];
    var _Memory = this.sCreep.memory;
    var _Store = this.sCreep.store;
    var carryParts = this.sCreep.body.filter((x)=> x.type == CARRY).length;
    if(_Memory.creepGlobal == undefined)
    {
      _Memory.creepGlobal = {
        Typ: "",
        Room: this.sCreep.room.name
      }
    }
    if(_Memory.creepGlobal.Room == undefined)
    {
      _Memory.creepGlobal.Room = this.sCreep.room.name;
    }

    this.onTick();
    if(carryParts == 0)
    {
      this.onWorking();
    }
    else
    {
      if(_Memory.harvestingMemory)
      {
        if(_Store.getUsedCapacity() == 0 && _Memory.harvestingMemory.RefillResource == false)
        {
          this.sCreep.room.ContractManager.FreeContract(this.ID);
          _Memory.harvestingMemory.RefillResource = true;
        }
        if(_Store.getFreeCapacity() == 0 && _Memory.harvestingMemory.RefillResource == true)
        {
          this.sCreep.room.ContractManager.FreeContract(this.ID);
          _Memory.harvestingMemory.RefillResource = false;
        }
      }
      else{
        this.sCreep.memory.harvestingMemory = {
          RefillResource: false,
          Resource: RESOURCE_ENERGY
        }
      }
      if(_Memory.harvestingMemory == undefined || _Memory.harvestingMemory.RefillResource == false)
      {
        this.onWorking();
      }
      if(_Memory.harvestingMemory?.RefillResource== true)
      {
        this.onHarvesting();
      }
    }
  }


  public get ID() : string {
    return this.sCreep.id;
  }
  abstract onHarvesting():void;
  abstract onWorking():void;
  abstract onTick():void;
}
