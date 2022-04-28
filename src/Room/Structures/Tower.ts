import { ContractRefillTower } from "Room/Contract/ContractTypes/Working/ContractRefillTower";
import { ContractRefillTowerHive } from "Room/Contract/ContractTypes/Working/ContractRefillTower_Hive";

declare global{
  interface RoomMemory{
    Tower: {[key:string]:TowerMemory}
  }
  interface StructureTower{
    memory:TowerMemory;
  }
  interface TowerMemory{
    Target?:string;
  }
}

Object.defineProperty(StructureTower.prototype, "memory", {
  get: function () {
    if(Memory.rooms[this.room.name].Tower == undefined)
    {
      Memory.rooms[this.room.name].Tower = {}
    }
    if(Memory.rooms[this.room.name].Tower[this.id] == undefined)
    {
      Memory.rooms[this.room.name].Tower[this.id] = {}
    }
    return Memory.rooms[this.room.name].Tower[this.id];
  }
});
PowerCreep

export class mTower{
  _tower:StructureTower;
  constructor(sTower: StructureTower){
    this._tower = sTower;
    if(this._tower.room.memory.structureMemory != undefined && this._tower.room.memory.structureMemory.HiveTower == this._tower.id)
    {
      if(this._tower.store.getFreeCapacity(RESOURCE_ENERGY) >= 500)
      {
        if(!this._tower.room.ContractManager.IsCreated(this._tower.id,ContractRefillTowerHive))
        {
          var Prio = 50;
          if(this._tower.room.find(FIND_HOSTILE_CREEPS).length > 0)
          {
            Prio = 110;
          }
          var Contract = new ContractRefillTowerHive(this._tower.id,Prio,this._tower.room.name);
          Contract.ResourceTyp = RESOURCE_ENERGY;
          Contract.ResourceNeed = this._tower.store.getFreeCapacity(RESOURCE_ENERGY);
          this._tower.room.ContractManager.CreateContract(Contract);
        }
      }
    }
    else
    {
    }
    var killTowerActions = false;

    //ATTACK OTHER CREEP
    var AttckCreep : Creep | undefined = undefined;
    var PossibleDmg : number = 0;
    for(var enemy of this._tower.room.find(FIND_HOSTILE_CREEPS))
    {
      if(enemy.isFriend() == false)
      {
        var towerRange = this._tower.pos.getRangeTo(enemy);
        var TowerDamage = 0;
        if(towerRange > 5  && towerRange < 20)
        {
          TowerDamage = (600-((towerRange-5)*30));
        }
        else if(towerRange >= 20)
        {
          TowerDamage = 150;
        }
        else
        {
          TowerDamage = 600;
        }
        var possibleHeal = enemy.getActiveBodyparts(HEAL) * 12;
        TowerDamage = TowerDamage - possibleHeal;
        if(TowerDamage > PossibleDmg)
        {
          PossibleDmg =TowerDamage;
          AttckCreep = enemy;
        }
        else if(TowerDamage == PossibleDmg && AttckCreep != undefined)
        {
          var firstRange = AttckCreep.pos.getRangeTo(this._tower);
          var secondRange = enemy.pos.getRangeTo(this._tower);
          if(firstRange > secondRange)
          {
            PossibleDmg =TowerDamage;
            AttckCreep = enemy;
          }
        }
      }
    }
    if( AttckCreep != undefined)
    {
      if(this._tower.attack(AttckCreep) == OK)
      {
        return;
      }
    }

    for(var myStructs of this._tower.room.find(FIND_STRUCTURES))
    {

      if(myStructs.structureType != STRUCTURE_RAMPART && myStructs.structureType != STRUCTURE_WALL)
      {
        if(myStructs.hits < myStructs.hitsMax)
        {
          if(this._tower.repair(myStructs) == OK)
          {
            killTowerActions = true;
            break;
          }
        }
      }
      else
      {
      }
    }
    if(killTowerActions)
    {
      return;
    }
    if(Game.time % 10 == 0)
    {
      var structRampart = this._tower.room.find(FIND_MY_STRUCTURES).filter((x)=>{
        if(x.structureType == STRUCTURE_RAMPART && x.hits < 50000)
        {
          return true;
        }
        return false;
      });
      if(structRampart.length > 0)
      {
        structRampart.sort((a,b)=>{
          return a.hits-b.hits;
        });
        if(this._tower.repair(structRampart[0]) == OK)
        {
          killTowerActions = true;
        }
      }
      else
      {
        for(var myStructs of this._tower.room.find(FIND_STRUCTURES))
        {
          if(myStructs.structureType == STRUCTURE_WALL)
          {
            if(myStructs.hits < 12000000)
            {
              if(this._tower.repair(myStructs) == OK)
              {
                killTowerActions = true;
                break;
              }
            }
          }
          else
          {
          }
        }
      }
    }
    if(killTowerActions)
    {
      return;
    }
  }
  CalculateCreepArray(){
    var creeps = this._tower.room.find(FIND_HOSTILE_CREEPS)
    for(var creep of creeps)
    {
      creep.body.find((b)=>{
        var possibleHeal = 0;
        if(b.type == HEAL)
        {
          possibleHeal += 12;
        }
      })
    }
  }

  static GC_Memory():void{

  }
}
