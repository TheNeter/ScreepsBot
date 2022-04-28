import { contains } from "lodash";
import { ContractExtensionRefill } from "Room/Contract/ContractTypes/Working/ContractExtensionRefill";
import { ContractLinkStorageRefill } from "Room/Contract/ContractTypes/Working/ContractLinkStorage";
import { ContractRefillTower } from "Room/Contract/ContractTypes/Working/ContractRefillTower";
import { ContractSpawnRefill } from "Room/Contract/ContractTypes/Working/ContractSpawnRefill";
import { ContractTerminalEnergyRefill } from "Room/Contract/ContractTypes/Working/ContractTerminalEnergyRefill";
import { ContractLabRefill } from "Room/Contract/ContractTypes/Lab/ContractLabRefill";
import { ContractLabRefillEnergy } from "Room/Contract/ContractTypes/Lab/ContractLabRefillEnergy";
import {baseCreeps, CreepType} from "Room/Creeps/mCreep";
import { Traveler } from "traveler";
import { ContractHarvestContainer } from "Room/Contract/ContractTypes/Harvesting/ContractHarvestContainer";
import { ContractHarvestDroppedEnergy } from "Room/Contract/ContractTypes/Harvesting/ContractHarvestDroppedEnergy";
export {}

export class mWorker extends baseCreeps{
  onTick(): void {
  }
  onCreate():void{

  }

  onHarvesting(): void {
    var Contracts = this.sCreep.Contracts;
    if(Contracts.length == 0)
    {
      Contracts = this.sCreep.room.ContractManager.AcceptContracts(this.sCreep.id,[
        ContractHarvestContainer,
        ContractHarvestDroppedEnergy
      ]);
    }

    if(Contracts.length > 0)
    {
      console.log(Contracts[0].Typ);
      Contracts[0].Action(this);
      return;
    }
  }

  acceptContracts():void{
    this.sCreep.room.ContractManager.AcceptContracts(this.sCreep.id,[
      ContractLinkStorageRefill,
    ]);
  }
  onWorking(): void {
    var Contracts = this.sCreep.Contracts;
    if(Contracts.length == 0)
    {
      this.acceptContracts();
    }
    if(Contracts.length > 0)
    {
      Contracts[0].Action(this)
    }
    else
    {
      if(this.sCreep.room.storage != undefined)
      {
        if(this.sCreep.transfer(this.sCreep.room.storage,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
          this.travelTo(this.sCreep.room.storage);
        }
      }
    }
  }

  onRoomAttacked(): void {
  }
}
