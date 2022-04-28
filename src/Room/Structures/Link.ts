
import { ContractEmptyHiveLink } from "Room/Contract/ContractTypes/Working/ContractEmptyHiveLink";
import { ContractLinkControllerRefill } from "Room/Contract/ContractTypes/Working/ContractLinkController";
import { ContractLinkStorageRefill } from "Room/Contract/ContractTypes/Working/ContractLinkStorage";
import { ContractRefillHiveLink } from "Room/Contract/ContractTypes/Working/ContractRefillHiveLink";

export class mLink{
  _link:StructureLink;


  LookForContract(){
    if(this._link.store.getUsedCapacity(RESOURCE_ENERGY) < 400)
      return;
    var contracts2 = this._link.room.ContractManager.GetAssignedTo(this._link.id);
    if(contracts2.length == 0)
    {
      var Contracts = this._link.room.ContractManager.ContractsWithType([
        ContractLinkControllerRefill
      ]);
      for(var Contract of Contracts)
      {
        if(Contract.AssignedTo == undefined)
        {
          this._link.room.ContractManager.AssignContractTo(Contract,this._link.id);
        }
      }
    }
  }

  constructor(sLink: StructureLink){
    this._link = sLink;


    //SOURCE LINK
    if(this._link.room.memory.structureMemory && this._link.room.memory.structureMemory.SourceLink)
    {
      for(var sourceID in this._link.room.memory.structureMemory.SourceLink)
      {
        if(this._link.id == this._link.room.memory.structureMemory.SourceLink[sourceID])
        {
          this.LookForContract();
          var contracts = this._link.room.ContractManager.GetAssignedTo(this._link.id);
          if(contracts.length > 0)
          {
            contracts[0].Action(this._link);
          }
          else
          {
            if(this._link.room.memory.structureMemory.HiveLink)
            {
              if(this._link.store.getUsedCapacity(RESOURCE_ENERGY) >= 400)
              {
                var hiveLink = Game.getObjectById(this._link.room.memory.structureMemory.HiveLink) as StructureLink;
                this._link.transferEnergy(hiveLink);
              }
            }
          }
        }
      }
    }
    //STORAGE HIVE LINK
    if(this._link.id == this._link.room.memory.structureMemory.HiveLink)
    {
      var sourceLinkCount = 0;
      if(this._link.room.memory.structureMemory)
      {
        for(var e in this._link.room.memory.structureMemory.SourceLink)
        {
          sourceLinkCount++;
        }
      }
      if(sourceLinkCount > 0)
      {
        if(this._link.store.getFreeCapacity(RESOURCE_ENERGY) < 400)
        {

        }
      }
      else
      {
        this.LookForContract();
        var contracts = this._link.room.ContractManager.GetAssignedTo(this._link.id);
        if(contracts.length > 0)
        {
          contracts[0].Action(this._link);
        }
      }
    }
    //Controller Link
    if(this._link.id == this._link.room.memory.ControllerLink)
    {
      if(this._link.store.getFreeCapacity(RESOURCE_ENERGY) > 400)
      {
        if(!this._link.room!.ContractManager.IsCreated(this._link.id,ContractLinkControllerRefill))
        {
          var Contract = new ContractLinkControllerRefill(this._link.id,80,this._link.room!.name);
          this._link.room!.ContractManager.CreateContract(Contract);
        }
      }
    }
    //HIVE - Link
    if(this._link.id == this._link.room.memory.structureMemory.HiveLink)
    {
      if(this._link.room.memory.structureMemory.HiveSpawn != undefined)
      {
        if(this._link.room.memory.structureMemory.SourceLink == undefined)
        {
          if(this._link.store.getFreeCapacity(RESOURCE_ENERGY) > 200)
          {
            if(!this._link.room!.ContractManager.IsCreated(this._link.id,ContractRefillHiveLink))
            {
              var Contract = new ContractRefillHiveLink(this._link.id,80,this._link.room!.name);
              this._link.room!.ContractManager.CreateContract(Contract);
            }
          }
        }
        else
        {
          if(this._link.store.getUsedCapacity(RESOURCE_ENERGY) >= 400)
          {
            if(!this._link.room!.ContractManager.IsCreated(this._link.id,ContractEmptyHiveLink))
            {
              var Contract = new ContractEmptyHiveLink(this._link.id,40,this._link.room!.name);
              this._link.room!.ContractManager.CreateContract(Contract);
            }
          }
        }
      }
      else
      {
        if(this._link.store.getFreeCapacity(RESOURCE_ENERGY) > 200)
        {
          if(!this._link.room!.ContractManager.IsCreated(this._link.id,ContractLinkStorageRefill))
          {
            var Contract = new ContractLinkStorageRefill(this._link.id,80,this._link.room!.name);
            this._link.room!.ContractManager.CreateContract(Contract);
          }
        }
      }
    }
  }


  static GC_Memory():void{

  }
}
