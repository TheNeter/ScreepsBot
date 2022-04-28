import { exec } from "child_process";
import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";


export class ContractEmptyHiveLink extends mContract{
  Loop(): void {

    var sender = Game.getObjectById(this.Sender) as StructureLink;
    this.room.ContractManager.SetPriotity(this.ID,50);
  }

  constructor(Sender?:string, Priority?:number, roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var object = Game.getObjectById(this.Sender) as StructureLink;
    if(Executer instanceof baseCreeps)
    {
      if(Executer.sCreep.store.getUsedCapacity() > 0)
      {
        Executer.sCreep.transfer(Executer.sCreep.room.storage!,RESOURCE_ENERGY);
      }
      else
      {
        Executer.sCreep.withdraw(object,RESOURCE_ENERGY);
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
