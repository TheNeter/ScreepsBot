import { QuadController } from './ctrlQuadController';
import { QuadAttack } from './../Room/CombatSystems/QuadSquadPathfinding';
import "Room/Creeps/mCreep";
import { CreepType } from "Room/Creeps/mCreep";
import { mWorker } from "Room/Creeps/types/mWorker";
import { mDropMiner } from "Room/Creeps/types/mDropMiner";
import { mUpgrader } from "Room/Creeps/types/mUpgrader";
import { mBuilder } from "Room/Creeps/types/mBuilder";
import { mRangeHealAttacker } from "Room/Creeps/types/mRangeHealAttack";
import { mNineralMiner } from "Room/Creeps/types/mMineralMiner";
import { mHive } from "Room/Creeps/types/mHive";
import { mReservator } from "Room/Creeps/types/Remote/mReservator";
import { mBaseRefill } from "Room/Creeps/types/Harvest/mBaseRefill";
import { KeyObject } from 'crypto';

export class CreepController
{
  constructor(room:string)
  {
    var _room = Game.rooms[room];
    for(let crp of _room.find(FIND_MY_CREEPS))
    {
        var strCreep = crp.name;
        var cpu = Game.cpu.getUsed();
        if(crp.room.name != room) continue;
        if(crp.memory.creepGlobal == undefined)
        {
          crp.memory.creepGlobal = {
            Typ: "",
            Room: crp.room.name
          }
        }
        if(crp.memory.creepGlobal.Room == undefined)
        {
          crp.memory.creepGlobal.Room = crp.room.name;
        }

        switch(crp.memory.creepGlobal.Typ!)
        {
          case CreepType.WORKER:
            new mBaseRefill(strCreep);
            break;
          case CreepType.DROPMINER:
            new mDropMiner(strCreep);
            break;
          case CreepType.UPGRADER:
            new mUpgrader(strCreep);
            break;
          case CreepType.BUILDER:
            new mBuilder(strCreep);
            break;
          case CreepType.REMOTEWORKER:
            new mWorker(strCreep);
            break;
          case CreepType.RANGE_HEAL_ATTACKER:
            new mRangeHealAttacker(strCreep);
            break;
          case CreepType.MINERAL_MINER:
            new mNineralMiner(strCreep);
            break;
          case CreepType.HIVE:
            new mHive(strCreep);
            break;
          case CreepType.RESERVATOR:
            new mReservator(strCreep);
            break;
          case CreepType.BASEREFILL:
            new mBaseRefill(strCreep);
            break;
          case CreepType.QuadMember:
            this.checkQuadMember(strCreep);
            break;
        }
        cpu = CreepController.extround(Game.cpu.getUsed() -cpu,2);
        crp.room.visual.infoBox(["TTL: "+ crp.ticksToLive, "Type: "+crp.memory.creepGlobal.Typ! , "CPU: " + cpu],crp.pos.x,crp.pos.y,{

          color: "#0087ff"
        });
    }
    QuadController.Run();
  }
  public static extround(zahl: number, stellen: number): number {
    zahl = (Math.round(zahl * Math.pow(10, stellen)) / Math.pow(10, stellen));
    return zahl;
  }

  checkQuadMember(strCreep:string):void{
    if(!this.checkIsQuadMember(strCreep))
    {
      if(QuadAttack.Creep_BottomRight == "")
      {
        QuadAttack.Creep_BottomRight = strCreep;
      }
      else if(QuadAttack.Creep_BottomLeft == "")
      {
        QuadAttack.Creep_BottomLeft = strCreep;
      }
      else if(QuadAttack.Creep_TopLeft == "")
      {
        QuadAttack.Creep_TopLeft = strCreep;
      }
      else if(QuadAttack.Creep_TopRight == "")
      {
        QuadAttack.Creep_TopRight = strCreep;
      }
    }
  }
  checkIsQuadMember(strCreep:string):boolean{
    if(QuadAttack.Creep_BottomLeft ==strCreep)
    {
      return true;
    }
    else if(QuadAttack.Creep_BottomRight ==strCreep)
    {
      return true;
    }
    else if(QuadAttack.Creep_TopLeft ==strCreep)
    {
      return true;
    }
    else if(QuadAttack.Creep_TopRight == strCreep)
    {
      return true;
    }
    return false;
  }
}
