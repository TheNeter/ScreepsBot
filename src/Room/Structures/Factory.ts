

export class ctrlFactory{
  Factory:StructureFactory;
  constructor(pFactory: StructureFactory){
    this.Factory = pFactory;

    if(this.Factory.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
    {
      this.Factory.produce(RESOURCE_BATTERY);
    }
  }
}
