import { ContractHarvestContainer } from './../Contract/ContractTypes/Harvesting/ContractHarvestContainer';



export class mContainer{
  _container:StructureContainer;
  constructor(sExtension: StructureContainer){
    this._container = sExtension;
    if(this._container.store.getUsedCapacity(RESOURCE_ENERGY) >= 250)
    {
      if(!this._container.room!.ContractManager.IsCreated(this._container.id,ContractHarvestContainer))
      {
        var Contract = new ContractHarvestContainer(this._container.id,60,this._container.room!.name);
        this._container.room!.ContractManager.CreateContract(Contract);
      }
    }
  }


  static GC_Memory():void{

  }
}
