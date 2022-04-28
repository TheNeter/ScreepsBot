import { throws } from "assert";
import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";


export class ContractHarvestDroppedEnergy extends mContract{
  Loop(): void {
    this.Priority = this.Priority + 1;
  }

  constructor(Sender?:string, Priority?:number, roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var object = Game.getObjectById(this.Sender) as Resource;
    if(Executer instanceof baseCreeps)
    {
      var result = Executer.sCreep.pickup(object);
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
    return 1;
  }
}
