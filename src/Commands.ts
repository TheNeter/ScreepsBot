import { QuadSquadPath } from './Room/CombatSystems/QuadSquadPathfinding';
import { S_IFMT } from "constants";
import { add } from "lodash";
import { ContractExtensionRefill } from "Room/Contract/ContractTypes/Working/ContractExtensionRefill";
import { CreepType } from "Room/Creeps/mCreep";
import { RoomPlan, RoomPlans } from "Room/RoomBuildingSystem";
import "Room/RoomUtils";
import { RelationshipHandler } from "utils/RealtionshipHandler";
import { runInThisContext } from "vm";
export {}

declare global{
  function CommandCheck(rstr:string,offx:number,offy:number):void;
  function CommandBuild(rstr:string):void;
  function CommandClaim(rstr:string):void;
  function CommandStopClaim(rstr:string):void;
  function MemoryTest(rstr:string):void;
  function MemoryTest2(rstr:string):void;
  function CommandFlag(rstr:string,offx:number,offy:number):void;
  function CommandBuildPrio(rstr:string):void;
  function CommandBuildTyp(rstr:string,typ:string):void;

  function CommandDefenderOrigin(rstr:string,x:number,y:number):void;

  function CommandSpawnAttacker(room:string,destRoom:string):void;
  function CommandSpawnDismantler(room:string,destRoom:string):void;
  function CommandSpawinDrain(room:string,destRoom:string):void;
  function SpawnKobolt(room:string,destRoom:string):void;
  function SetRemoteHarvest(room:string,destRoom:string):void;
  function WriteBuildMap(room:string,x:number,y:number,Struct:string,SourceID:string|undefined):void;
  function DeleteBuildMap(room:string,x:number,y:number):void;
  function Path(room:string):void;

  function CommandSetFriend(Username:string):void;
  function Help():void;
}
var _global = global;
_global.CommandClaim = function(rstr)
{
  if(Game.rooms[rstr] != undefined)
  {
    if(Game.rooms[rstr].controller != undefined)
    {
      if(Game.rooms[rstr].controller?.my)
      {
        Memory.RoomClaimSystem = {
          destRoomName: rstr,
          SendHelp: true
        }
      }
      else
      {
        Memory.RoomClaimSystem = {
          destRoomName: rstr,
        }
      }
    }
  }
  else
  {
    Memory.RoomClaimSystem = {
      destRoomName: rstr,
    }
  }
}
_global.CommandStopClaim = function(rstr)
{
  Memory.RoomClaimSystem = undefined;
}
_global.CommandBuildTyp = function (rstr,typ)
{
  var room = Game.rooms[rstr];
  if(room.memory.BuldingPlan != undefined)
  {
    var i = 0;
    for(var nextBuild of room.memory.BuldingPlan)
    {
      i++;
      if(nextBuild.Structure == typ)
      {
        console.log("Structure: "+ nextBuild.Structure);
        console.log("Done: "+ nextBuild.Done);
        console.log("Placed: "+ nextBuild.Placed);
      }
    }
  }
}
_global.CommandBuildPrio = function (rstr)
{
  var room = Game.rooms[rstr];
  if(room.memory.BuldingPlan != undefined)
  {
    var i = 0;
    for(var nextBuild of room.memory.BuldingPlan)
    {
      if(nextBuild.Done == false && nextBuild.Placed == false)
      {
        i++;
          console.log("Step: "+ i +" Building: "+nextBuild.Structure);
          //console.log("Placing " + nextBuild.Structure + " ERR "+err + " POS: X:"+nextBuild.X + " Y: "+nextBuild.Y);
      }
    }
  }
}
_global.Help = function()
{
  console.log(`
    <b style="color:#FFFF00;font-size:16px;">CommandCheck(RaumName,X Offset,Y Offset)</b>
    \tPrüft ob in dem Raum ein Pattern gesetzt werden kann
    <tr>
    <b style="color:#FFFF00;font-size:16px;">CommandBuild(RaumName)</b>
    \tBaut in dem angegebenen Raum das Pattern
    <b style="color:#FFFF00;font-size:16px;">CommandClaim(RaumName)</b>
    \tStartet den Claimprozess auf einen Raum
    <b style="color:#FFFF00;font-size:16px;">CommandStopClaim(RaumName)</b>
    \tStoppt den Claimprozess auf einen Raum
  `);
}
_global.CommandFlag = function(rstr,ox,oy){

  var vis = new RoomVisual(rstr);
  vis.circle(ox,oy,{stroke: "#FF0000",lineStyle:"dotted"});
  vis.circle(ox,oy,{stroke: "#FF0000",lineStyle:"dotted",fill:"transparent",radius: 1});
  //if(Game.flags["ATTACK"] == undefined)
  //{
    //new RoomPosition(ox,oy,rstr).createFlag("ATTACK",COLOR_BLUE,COLOR_RED);
  //}
  //else
  //{
    //Game.flags["ATTACK"].setPosition(new RoomPosition(ox,oy,rstr));
  //}
}
_global.CommandCheck = function(rstr,ox,oy)
{
  var cpuUsed = Game.cpu.getUsed();
  var pos = new RoomPlan().Fits2(rstr,ox,oy);
  var room = Game.rooms[rstr];
  if(pos)
  {
    room.memory.buildingInformation = {
      CenterX: pos.x,
      CenterY: pos.y
    };
  }
  console.log("CommandCheck: CPU: " + (Game.cpu.getUsed() - cpuUsed));
}
_global.CommandBuild = function(rstr)
{
  var val = new RoomPlan().Fits2(rstr,0,0)!;
  new RoomPlan().checkRoom(val,RoomPlans.room2);
}
_global.CommandDefenderOrigin = function(rstring:string,x:number,y:number)
{
  Game.rooms[rstring].memory.DefenderOrigin = {
    X: x,
    Y: y,
    }
}


_global.WriteBuildMap = function(room:string,x:number,y:number,Struct:string,SourceID:string|undefined)
{
  let myRoom = Game.rooms[room];
  if(myRoom.memory.BuldingPlan != undefined)
  {
    myRoom.memory.BuldingPlan.push({
      X:x,
      Y:y,
      Structure:Struct,
      Done:true,
      Placed:true,
      SourceContainer: SourceID
    });
  }
  console.log("BuildMap: Added for "+room);
}
_global.DeleteBuildMap = function(room:string,x:number,y:number)
{
  let myRoom = Game.rooms[room];
  if(myRoom.memory.BuldingPlan != undefined)
  {
    for(var i = 0; i< myRoom.memory.BuldingPlan.length;i++)
    {
      if(myRoom.memory.BuldingPlan[i].X == x && myRoom.memory.BuldingPlan[i].Y == y)
      {
        delete myRoom.memory.BuldingPlan[i];
        return;
      }
    }
  }
  console.log("BuildMap: Added for "+room);
}
//Todo Attacker
_global.CommandSetFriend = function(userName:string){
  RelationshipHandler.addUnknown(userName);
  console.log("Friendssytem added: "+userName);
}

_global.Path = function(roomName:string){
  new QuadSquadPath(roomName).analyseRoom();
}
