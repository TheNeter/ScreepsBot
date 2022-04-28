
import { ContractLinkControllerRefill } from "Room/Contract/ContractTypes/Working/ContractLinkController";
import { ContractLinkStorageRefill } from "Room/Contract/ContractTypes/Working/ContractLinkStorage";
import { ContractBoost } from "Room/Contract/ContractTypes/Lab/ContractBoost";
import { ContractLabRefill } from "Room/Contract/ContractTypes/Lab/ContractLabRefill";
import { ContractLabRefillEnergy } from "Room/Contract/ContractTypes/Lab/ContractLabRefillEnergy";

export class mLab{
  _lab:StructureLab;


  LookForContract(){
    var contracts2 = this._lab.room.ContractManager.GetAssignedTo(this._lab.id);
    if(contracts2.length == 0)
    {
      var Contracts = this._lab.room.ContractManager.ContractsWithType([
        ContractBoost
      ]);
      for(var Contract of Contracts)
      {
        if(Contract.AssignedTo == undefined)
        {
          this._lab.room.ContractManager.AssignContractTo(Contract,this._lab.id);
        }
      }
    }
  }

  constructor(sLink: StructureLab){
    this._lab = sLink;
    this.LookForContract();
    var contracts = this._lab.room.ContractManager.GetAssignedTo(this._lab.id);
    if(contracts.length > 0)
    {
      contracts[0].Action(this._lab);
    }
    if(this._lab.room.ContractManager.IsCreated(this._lab.id,ContractLabRefillEnergy) == false)
    {
      if(this._lab.store.getUsedCapacity(RESOURCE_ENERGY) <= 1000)
      {
        var contractRefill = new ContractLabRefillEnergy(this._lab.id,30,this._lab.room.name);
        contractRefill.ResourceTyp == RESOURCE_ENERGY;
        this._lab.room.ContractManager.CreateContract(contractRefill);
      }
    }
  }


  static GC_Memory():void{

  }
}
