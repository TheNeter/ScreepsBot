import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";

export class ContractSpawnRefill extends mContract{
  Loop(): void {

  }

  constructor(Sender?:string, Priority?:number,roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var _Spawn:StructureSpawn = Game.getObjectById(this.Sender) as StructureSpawn;
    if(Executer instanceof baseCreeps)
    {
      if(Executer.sCreep.transfer(_Spawn,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
      {
        Executer.sCreep.travelTo(_Spawn);
      }
    }
    if(_Spawn.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
    {
      this.room.ContractManager.ContractDone(this.ID);
      return OK;
    }
    return 1;
  }
}
