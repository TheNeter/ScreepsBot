import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";

export class ContractLabRefillEnergy extends mContract{
  Loop(): void {

  }

  constructor(Sender?:string, Priority?:number,roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var _lab:StructureLab = Game.getObjectById(this.Sender) as StructureLab;
    if(Executer instanceof baseCreeps)
    {
      if(Executer.sCreep.transfer(_lab,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      {
        Executer.sCreep.travelTo(_lab);
      }
    }
    if(_lab.store.getFreeCapacity(RESOURCE_ENERGY) <= 2000)
    {
      this.room.ContractManager.ContractDone(this.ID);
      return OK;
    }
    return 1;
  }
}
