export {}
declare global{
  interface CreepMemory{
    creepGlobal:CreepGlobal;
    harvestingMemory?:HarvestingMemory;
    miningMemory?:MiningMemory;
    attackMemory?:AttackMemory;
    remoteMemory?:RemoteMemory;
    boostMemory?:BoostMemory;
    exuseMemory?:ExcuseMemory;
    groupMemory?:GroupMemory;
    attackControllerMemory?:AttackControllerMemory;
    _trav?:any;
    _travel?:any;
  }
  interface CreepGlobal{
    /**
     * Creep Typ (CreepTyp.XX)
     */
    Typ: string;
    /**
     * Der Raum in dem er Erstellt wurde
     */
    Room: string;
  }
  interface BoostMemory{
    Work:boolean;
    Move:boolean;
    Carry:boolean;
    Attack:boolean;
    Ranged_Attack:boolean;
    Heal:boolean;
  }
  interface HarvestingMemory{
    RefillResource:boolean;
    Ammount?:number;
    Resource:ResourceConstant;
  }
  interface MiningMemory{
    Source?:string;
    Mineral?:string;
  }
  interface AttackMemory{
  }
  interface AttackControllerMemory{
    attackController:boolean;
    claimController:boolean;
    reservateController:boolean;
  }
  interface RemoteMemory{
    remoteRoom:string;
  }
  interface GroupMemory{
    groupID:number;
    memberNumber:number;
  }
  interface ExcuseMemory{
    direction:number;
  }
}
