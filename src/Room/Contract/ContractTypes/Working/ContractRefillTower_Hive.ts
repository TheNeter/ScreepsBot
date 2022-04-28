import { exec } from "child_process";
import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";


export class ContractRefillTowerHive extends mContract{
  Loop(): void {

    var sender = Game.getObjectById(this.Sender) as StructureTower;
    if(this.Sender != undefined)
    {
      if(sender.store.getUsedCapacity(RESOURCE_ENERGY) <= 100 && this.room.find(FIND_HOSTILE_CREEPS).length > 0)
      {
        this.room.ContractManager.SetPriotity(this.ID,105);
      }
      else
      {
        this.room.ContractManager.SetPriotity(this.ID,50);
      }
    }
  }

  constructor(Sender?:string, Priority?:number, roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var object = Game.getObjectById(this.Sender) as StructureTower;
    if(Executer instanceof baseCreeps)
    {
      if(Executer.sCreep.store.getUsedCapacity(RESOURCE_ENERGY) < Executer.sCreep.store.getCapacity())
      {
        Executer.sCreep.withdraw(Executer.sCreep.room.storage!,RESOURCE_ENERGY);
      }
      Executer.sCreep.transfer(object,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
    }
    if(object.store.getFreeCapacity(RESOURCE_ENERGY) <= 20)
    {
      this.room.ContractManager.ContractDone(this.ID);
      return OK;
    }
    return 1;
  }
}
