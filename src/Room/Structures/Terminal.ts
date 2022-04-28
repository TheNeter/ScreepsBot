

import { ContractHarvestDroppedEnergy } from "Room/Contract/ContractTypes/Harvesting/ContractHarvestDroppedEnergy";
import { ContractLinkControllerRefill } from "Room/Contract/ContractTypes/Working/ContractLinkController";
import { ContractLinkStorageRefill } from "Room/Contract/ContractTypes/Working/ContractLinkStorage";
import { ContractTerminalEnergyRefill } from "Room/Contract/ContractTypes/Working/ContractTerminalEnergyRefill";
import { ContractHiveTerminalEnergyRefill } from "Room/Contract/ContractTypes/Working/ContractTerminalEnergyRefill Hive";

export class mTerminal{
  _Terminal:StructureTerminal;

  constructor(sTerminal: StructureTerminal){
    this._Terminal = sTerminal;
    if(this._Terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 10000)
    {
      if(this._Terminal.room.memory.structureMemory.HiveSpawn != undefined)
      {
        if(!this._Terminal.room!.ContractManager.IsCreated(this._Terminal.id,ContractHiveTerminalEnergyRefill))
        {
          var Contract = new ContractHiveTerminalEnergyRefill(this._Terminal.id,20,this._Terminal.room!.name);
          this._Terminal.room!.ContractManager.CreateContract(Contract);
        }
      }
      else
      {
        if(!this._Terminal.room!.ContractManager.IsCreated(this._Terminal.id,ContractTerminalEnergyRefill))
        {
          var Contract = new ContractTerminalEnergyRefill(this._Terminal.id,20,this._Terminal.room!.name);
          this._Terminal.room!.ContractManager.CreateContract(Contract);
        }
      }
    }
  }


  static GC_Memory():void{

  }
}
