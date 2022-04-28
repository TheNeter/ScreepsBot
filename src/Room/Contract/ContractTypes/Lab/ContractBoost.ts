import { baseCreeps } from "Room/Creeps/mCreep";
import { mContract } from "../../ContractManager";
import { ContractLabRefill } from "./ContractLabRefill";

export class ContractBoost extends mContract{
  Loop(): void {

  }

  constructor(Sender?:string, Priority?:number,roomName?:string){
    super(Sender,Priority,roomName);
  }
  Action(Executer:any):number{
    var exe : StructureLab = Executer as StructureLab;
    if(exe && this.room.terminal && this.ResourceNeed && this.ResourceTyp)
    {
      var capacity = exe.store.getUsedCapacity(this.ResourceTyp);
      if(capacity == undefined || capacity <= this.ResourceNeed)
      {
        if(this.room.terminal.store.getUsedCapacity(this.ResourceTyp) >= 0 || this.room.terminal.store.getUsedCapacity(this.ResourceTyp)==null)
        {
          if(this.room.ContractManager.IsCreated(exe.id,ContractLabRefill) == false)
          {
            var ContractLab : ContractLabRefill = new ContractLabRefill(exe.id,30,this.room.name);
            ContractLab.ResourceTyp = this.ResourceTyp;
            ContractLab.ResourceNeed = this.ResourceNeed;
            this.room.ContractManager.CreateContract(ContractLab);
          }
        }
      }
      var sCreep = Game.getObjectById(this.Sender) as Creep;
      if(sCreep)
      {
        sCreep.memory.stopControl = true;
        if(sCreep.pos.getRangeTo(exe) <= 1)
        {
          exe.boostCreep(sCreep,this.ResourceNeed);
          this.room.ContractManager.ContractDone(this.ID);
          sCreep.memory.stopControl = false;
          sCreep.memory.boosted = true;
          return OK;
        }
        else{
          sCreep.travelTo(exe);
        }
      }
    }
    return 1;
  }
}
