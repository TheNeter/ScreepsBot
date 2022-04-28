import { throws } from "assert";
import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";


export class ContractHarvestContainer extends mContract{
  Loop(): void {
    var object = Game.getObjectById(this.Sender) as StructureContainer;
    if(object.store.getUsedCapacity() > 1500)
    {
      this.Priority = 120;
    }
    else
    {
      this.Priority = this.Priority + 1;
    }
  }

  constructor(Sender?:string, Priority?:number, roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var object = Game.getObjectById(this.Sender) as StructureContainer;
    if(Executer instanceof baseCreeps)
    {
      var result = Executer.sCreep.withdraw(object,RESOURCE_ENERGY);
      if(result == ERR_NOT_IN_RANGE)
      {
        Executer.sCreep.travelTo(object);
      }
      else if(result == OK)
      {
        this.room.ContractManager.ContractDone(this.ID);
        return OK;
      }
    }
    if(object.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
    {
      this.room.ContractManager.ContractDone(this.ID);
      return OK;
    }
    return 1;
  }
}
