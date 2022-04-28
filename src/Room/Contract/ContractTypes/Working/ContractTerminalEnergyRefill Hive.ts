import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";

export class ContractHiveTerminalEnergyRefill extends mContract{
  Loop(): void {

  }

  constructor(Sender?:string, Priority?:number,roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var _Spawn:StructureTerminal = Game.getObjectById(this.Sender) as StructureTerminal;
    if(Executer instanceof baseCreeps)
    {
      if(_Spawn.store.getUsedCapacity(RESOURCE_ENERGY) > 10000)
      {
        if(Executer.sCreep.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
        {
          RESOURCES_ALL.forEach((X)=>{
            if(Executer.sCreep.room.storage)
            {
              Executer.sCreep.transfer(Executer.sCreep.room.storage!,X);
            }
          });
          return 1;
        }
        else
        {
          this.room.ContractManager.ContractDone(this.ID);
          return OK;
        }
      }
      if(Executer.sCreep.store.getUsedCapacity(RESOURCE_ENERGY) < Executer.sCreep.store.getCapacity())
      {
        Executer.sCreep.withdraw(Executer.sCreep.room.storage!,RESOURCE_ENERGY);
      }
      else
      {
        Executer.sCreep.transfer(_Spawn,RESOURCE_ENERGY)
      }
    }
    return 1;
  }
}
