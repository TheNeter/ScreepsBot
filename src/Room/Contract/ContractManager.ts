
import { baseCreeps } from "Room/Creeps/mCreep";
import { ContractRefillTower } from "./ContractTypes/Working/ContractRefillTower";
declare global{

  interface Room{
    ContractManager: classContractManager;
  }
  interface RoomMemory{
    //ContractManager:{[uniq:string]:mContract};
  }
}
var _glob = global;



Object.defineProperty(Room.prototype,"ContractManager",{
  get: function(){
    return new classContractManager(this);
  }
})

export class classContractManager{
  private room:Room;
  private rName:string = "";
  public static AllContracts:{[roomName:string]:mContract[]} = {};
  public static CPUCost:number = 0;
  constructor(room:Room)
  {
    var Messung1 = Game.cpu.getUsed();
    this.room = room;
    this.rName = room.name;
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
  }
  CreateContract(Contract: mContract)
  {
    var Messung1 = Game.cpu.getUsed();
    classContractManager.AllContracts[this.rName].push(Contract);
    var Messung = Game.cpu.getUsed() - Messung1;
    if(Messung > 0.4)
    {
      console.log("CM - CreateContract = "+Messung)
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
  }
  AcceptContracts(id:string,Types: any[]):mContract[]{
    var Messung1 = Game.cpu.getUsed();
    var possibleContracts = this.room.ContractManager.ContractsWithType(Types);
    var acceptedContracts:mContract[] = [];
    if(possibleContracts.length > 0)
    {
      if(possibleContracts[0].AssignedTo == undefined)
      {
        this.room.ContractManager.AssignContractTo(possibleContracts[0],id);
        acceptedContracts.push(possibleContracts[0]);
      }
    }
    var Messung = Game.cpu.getUsed() - Messung1;
    if(Messung > 0.4)
    {
      console.log("CM - AcceptContracts = "+Messung)
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
    return acceptedContracts;
  }
  FreeContract(executerID: string)
  {
    var Messung1 = Game.cpu.getUsed();
    classContractManager.AllContracts[this.rName].forEach((c)=>{
      if(c.AssignedTo == executerID)
      {
        c.AssignTo(undefined);
      }
    });
    var Messung = Game.cpu.getUsed() - Messung1;
    if(Messung > 0.4)
    {
      console.log("CM - FreeContract = "+Messung)
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
  }
  AssignContractTo(Contract: mContract, ID:string)
  {
    var Messung1 = Game.cpu.getUsed();
    for(var con in classContractManager.AllContracts[this.rName])
    {
      var _tmpContract = classContractManager.AllContracts[this.rName][con];
      if(_tmpContract.ID == Contract.ID)
      {
        classContractManager.AllContracts[this.rName][con].AssignTo(ID);
        return;
      }
    }
    var Messung = Game.cpu.getUsed() - Messung1;
    if(Messung > 0.4)
    {
      console.log("CM - AssignContractTo = "+Messung)
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
  }

  ContractsWithType(Types: any[]):mContract[] {
    var Messung1 = Game.cpu.getUsed();
    var retVal:mContract[] = [];
    for(var contract of classContractManager.AllContracts[this.rName])
    {
      if(contract == undefined) continue;
      for(var typ of Types)
      {
        if(contract.Typ == typ.name)
        {
          retVal.push(contract);
        }
      }
    }
    var Messung = Game.cpu.getUsed() - Messung1;
    if(Messung > 0.4)
    {
      console.log("CM - ContractsWithType = "+Messung)
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
    return retVal;
  }
  GetAssignedTo(id:string):mContract[]{
    var Messung1 = Game.cpu.getUsed();
    var contractArr:mContract[] = [];
    for(var _Contract of classContractManager.AllContracts[this.rName])
    {
      if(_Contract == undefined) continue;
      if(_Contract.AssignedTo != undefined)
      {
        if(_Contract.AssignedTo == id)
        {
          contractArr.push(_Contract);
        }
      }
    }
    var Messung = Game.cpu.getUsed() - Messung1;
    if(Messung > 0.4)
    {
      console.log("CM - GetAssignedTo = "+Messung)
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
    return contractArr;
  }
  Init(room:Room):void{
    var Messung1 = Game.cpu.getUsed();
    if(classContractManager.AllContracts == undefined)
    {
      classContractManager.AllContracts = {};
    }
    if(classContractManager.AllContracts[this.rName] == undefined)
    {
      classContractManager.AllContracts[this.rName] = [];
    }

    if(classContractManager.AllContracts[this.rName].length > 0)
    {
      classContractManager.AllContracts[this.rName] = classContractManager.AllContracts[this.rName].sort((a,b)=>{
        if((b.storagePhi != undefined && a.storagePhi != undefined))
        {
          if(b.Priority == a.Priority)
          {
            return b.storagePhi - a.storagePhi;
          }
        }
        return b.Priority - a.Priority;
      });
    }

    for(var num in classContractManager.AllContracts[this.rName])
    {
      var contract = classContractManager.AllContracts[this.rName][num];
      contract.drawDirection();
      if(contract == undefined) return;
      if(contract.AssignedTo != undefined)
      {
        if(Game.getObjectById(contract.AssignedTo) == undefined)
        {
          contract.AssignTo(undefined);
        }
      }
      if(contract.Sender != undefined)
      {
        if(Game.getObjectById(contract.Sender) == undefined)
        {

          this.ContractDone(contract.ID);
        }
      }
    }
    var Messung = Game.cpu.getUsed() - Messung1;
    if(Messung > 0.4)
    {
      console.log("CM - Init = "+Messung)
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
  }
  SetPriotity(ID:string,Prio:number){
    var Messung1 = Game.cpu.getUsed();
    for(var con in classContractManager.AllContracts[this.rName])
    {
      var tmpContract = classContractManager.AllContracts[this.rName][con];
      if(tmpContract.ID == ID)
      {
        classContractManager.AllContracts[this.rName][con].Priority =Prio;
      }
    }
    var Messung = Game.cpu.getUsed() - Messung1;
    if(Messung > 0.4)
    {
      console.log("CM - SetPriotity = "+Messung)
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
  }
  IsCreated(Sender:string,x : any&Function) : boolean
  {
    var Messung1 = Game.cpu.getUsed();
    for(var e of classContractManager.AllContracts[this.rName])
    {
      if(e.ID == x.name+Sender)
      {
        return true;
      }
    }
    var Messung = Game.cpu.getUsed() - Messung1;
    if(Messung > 0.4)
    {
      console.log("CM - Is Created = "+Messung)
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
    return false;
  }
  ContractDone(contractID:string):void{
    var Messung1 = Game.cpu.getUsed();
    for(var con = 0; con <classContractManager.AllContracts[this.rName].length; con++)
    {
      var tmpContract = classContractManager.AllContracts[this.rName][con];
      if(tmpContract.ID == contractID)
      {
        classContractManager.AllContracts[this.rName].splice(con,1);
      }
    }
    classContractManager.CPUCost += Game.cpu.getUsed() - Messung1;
  }
}
export abstract class mContract{
  public Typ:string = "";
  private idSender:string = "";
  private idTo:string|undefined = undefined;
  private _Priority:number = 0;
  private _room:string | undefined = "";
  private _ResourceType:ResourceConstant|undefined = undefined;
  private _ResourceNeed:number | undefined = undefined;

  public storageRange: number| undefined = undefined;
  public storagePhi :number | undefined = undefined;
  constructor(Sender?:string, Priority?:number,_Rname?:string)
  {
    this.Typ = this.constructor["name"];
    if(Sender != undefined && Priority != undefined)
    {
      this.idSender = Sender;
      this._Priority = Priority;
      this._room = _Rname;
    }
    if(_Rname != undefined)
    {
      var room: Room = Game.rooms[_Rname];

      if(room.storage != undefined)
      {
        var objectSender = Game.getObjectById(this.idSender) as Structure;
        var rangeToStorage = room.storage.pos.getRangeTo(objectSender.pos);
        this.storageRange = rangeToStorage;
        var Phi = 0;
        var normX = objectSender.pos.x - room.storage.pos.x;
        var normY = objectSender.pos.y - room.storage.pos.y;
        var radians = Math.atan(normY/normX);
        if(1/normX < 0) radians += Math.PI;
        if(1/radians < 0) radians += 2 * Math.PI;
        var degrees = radians*180/Math.PI;
        Phi = degrees
        this.storagePhi = Math.round(Phi);

      }
    }
  }

  drawDirection():void{
    var objectSender = Game.getObjectById(this.idSender) as Structure;
    //objectSender.room.visual.text(""+this.storagePhi,objectSender.pos.x,objectSender.pos.y);
  }
  public get ResourceTyp() : ResourceConstant|undefined {
    return this._ResourceType;
  }
  public set ResourceTyp(v : ResourceConstant|undefined) {
    this._ResourceType = v;
  }

  public get ResourceNeed() : number|undefined {
    return this._ResourceNeed;
  }
  public set ResourceNeed(v : number|undefined) {
    this._ResourceNeed = v;
  }

  public get room(): Room{
    return Game.rooms[this._room!];
  }
  public get ID(): string{
    return this.Typ+this.Sender;
  }
  public get Sender() : string {
    return this.idSender;
  }
  public get AssignedTo() : string | undefined {
    return this.idTo;
  }
  public get ContractTyp():string{
    return this.Typ;
  }

  public get Priority():number{
    return this._Priority;
  }
  public set Priority(val){
    this._Priority = val;
  };

  AssignTo(ID:string | undefined):void
  {
    this.idTo = ID;
  }
  abstract Action(Executer : any):number;
  abstract Loop():void;
}
