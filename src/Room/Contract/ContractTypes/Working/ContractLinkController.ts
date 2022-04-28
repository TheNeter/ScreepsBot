import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";

export class ContractLinkControllerRefill extends mContract{
  Loop(): void {

  }

  constructor(Sender?:string, Priority?:number,roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var link:StructureLink = Game.getObjectById(this.Sender) as StructureLink;
    if(Executer instanceof StructureLink)
    {
      Executer.transferEnergy(link);
    }
    if(link.store.getFreeCapacity(RESOURCE_ENERGY) <= 20)
    {
      this.room.ContractManager.ContractDone(this.ID);
      return OK;
    }
    return 1;
  }
}
