import { baseCreeps } from "Room/Creeps/mCreep";
import { Traveler } from "traveler";
import { mContract } from "../../ContractManager";

export class ContractLinkStorageRefill extends mContract{
  Loop(): void {

  }

  constructor(Sender?:string, Priority?:number,roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var link:StructureLink = Game.getObjectById(this.Sender) as StructureLink;
    if(Executer instanceof baseCreeps)
    {
      if(Executer.sCreep.transfer(link,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      {
        Traveler.travelTo(Executer.sCreep,link);
      }
    }
    if(link.store.getFreeCapacity(RESOURCE_ENERGY) <= 20)
    {
      this.room.ContractManager.ContractDone(this.ID);
      return OK;
    }
    return 1;
  }
}
