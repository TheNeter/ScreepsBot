import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";

export class ContractLabRefill extends mContract{
  Loop(): void {

  }

  constructor(Sender?:string, Priority?:number,roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var _lab:StructureLab = Game.getObjectById(this.Sender) as StructureLab;
    var _creep:baseCreeps = Executer as baseCreeps;
    _creep.sCreep.memory.stopControl = true;
    console.log("EXECUTER "+_creep.sCreep.name)
    if(Executer instanceof baseCreeps && this.ResourceTyp && this.ResourceNeed && this.room.terminal)
    {
      if(Executer.sCreep.store.getUsedCapacity(this.ResourceTyp) < this.ResourceNeed)
      {
        var err =  Executer.sCreep.withdraw(this.room.terminal,this.ResourceTyp);
        console.log("ERR: "+err);
        if(err == ERR_NOT_IN_RANGE)
        {
          Executer.sCreep.travelTo(this.room.terminal);
        }
        else if(err == ERR_FULL)
        {
          Executer.sCreep.transfer(this.room.terminal,RESOURCE_ENERGY);
        }
      }
      else
      {
        var err = _creep.sCreep.transfer(_lab,this.ResourceTyp);
        console.log("ERR: "+err);
        if(err == ERR_NOT_IN_RANGE)
        {
          _creep.sCreep.travelTo(_lab)
        }
      }
    }
    var capacity = _lab.store.getUsedCapacity(this.ResourceTyp);
    if(capacity && this.ResourceTyp && this.ResourceNeed &&
      capacity > this.ResourceNeed)
    {
      _creep.sCreep.memory.stopControl = false;
      this.room.ContractManager.ContractDone(this.ID);
      return OK;
    }
    return 1;
  }
}
