/*

declare global{
  interface RoomMemory{
    Tower: {[key:string]:TowerMemory}
  }
  interface StructureTower{
    memory:TowerMemory;
  }
  interface TowerMemory{
    Target?:string;
  }
}

Object.defineProperty(StructureTower.prototype, "memory", {
  get: function () {
    if(Memory.rooms[this.room.name].Tower == undefined)
    {
      Memory.rooms[this.room.name].Tower = {}
    }
    if(Memory.rooms[this.room.name].Tower[this.id] == undefined)
    {
      Memory.rooms[this.room.name].Tower[this.id] = {}
    }
    return Memory.rooms[this.room.name].Tower[this.id];
  }
});
*/

import { ContractSpawnRefill } from "Room/Contract/ContractTypes/Working/ContractSpawnRefill";
import { CreepType } from "Room/Creeps/mCreep";

declare global{
  interface StructureSpawn
  {
    ut_Spawn(Typ:CreepType,Work:number,Move:number,Carry:number, Attack:number,RangedAttack:number,Heal:Number,Tough:number,Claim:number):number;
  }
}

Spawn.prototype.ut_Spawn = function(Typ:CreepType,Work:number,Move:number,Carry:number, Attack:number,RangedAttack:number,Heal:Number,Tough:number,Claim:number):number
{
  var parts:BodyPartConstant[] = [];
  //#region BuildBody
  for(let tmpParts = 0; tmpParts < Tough;tmpParts++)
  {
    parts.push(TOUGH);
  }
  for(let tmpParts = 0; tmpParts < Work;tmpParts++)
  {
    parts.push(WORK);
  }
  for(let tmpParts = 0; tmpParts < Carry;tmpParts++)
  {
    parts.push(CARRY);
  }
  for(let tmpParts = 0; tmpParts < Move;tmpParts++)
  {
    parts.push(MOVE);
  }
  for(let tmpParts = 0; tmpParts < Attack;tmpParts++)
  {
    parts.push(ATTACK);
  }
  for(let tmpParts = 0; tmpParts < RangedAttack;tmpParts++)
  {
    parts.push(RANGED_ATTACK);
  }
  for(let tmpParts = 0; tmpParts < Claim;tmpParts++)
  {
    parts.push(CLAIM);
  }
  //#endregion


  return 0;
}

export class mSpawn{
  _spawn:StructureSpawn;
  constructor(spawn: StructureSpawn){
    this._spawn = spawn;
  }


  static GC_Memory():void{

  }
}
