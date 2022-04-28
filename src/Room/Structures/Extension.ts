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

import { ContractExtensionRefill } from "Room/Contract/ContractTypes/Working/ContractExtensionRefill";

export class mExtension {
  _extension: StructureExtension;
  constructor(sExtension: StructureExtension) {
    this._extension = sExtension;
  }


  static GC_Memory(): void {

  }
}
