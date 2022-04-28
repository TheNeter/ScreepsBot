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

import { ContractHarvestDroppedEnergy } from "Room/Contract/ContractTypes/Harvesting/ContractHarvestDroppedEnergy";

export class mExtension{
  _extension:Resource;
  constructor(sExtension: Resource){
    this._extension = sExtension;
    if(this._extension.amount > 0)
    {
      if(this._extension.room!.ContractManager.IsCreated(this._extension.id,ContractHarvestDroppedEnergy))
      {
        var Contract = new ContractHarvestDroppedEnergy(this._extension.id,90,this._extension.room!.name);
        this._extension.room!.ContractManager.CreateContract(Contract);
      }
    }
  }


  static GC_Memory():void{

  }
}
