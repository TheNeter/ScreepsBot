import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";

export class ContractExtensionRefill extends mContract{
  Loop(): void {

  }

  constructor(Sender?:string, Priority?:number,roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var extension:StructureExtension = Game.getObjectById(this.Sender) as StructureExtension;
    if(Executer instanceof baseCreeps)
    {
      var errTransfer = Executer.sCreep.transfer(extension,RESOURCE_ENERGY);
      console.log("EXT Refill = "+errTransfer);
      if(errTransfer == ERR_NOT_IN_RANGE ||
        errTransfer == ERR_FULL)
      {
        Executer.sCreep.travelTo(extension);
      }
    }
    if(extension.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
    {
      this.room.ContractManager.ContractDone(this.ID);
      return OK;
    }
    return 1;
  }
}
