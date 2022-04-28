import { baseCreeps, CreepType } from "Room/Creeps/mCreep";
import { Traveler } from "traveler";
export{}

declare global{
}


export class mRangeHealAttacker extends baseCreeps{
  onTick(): void {
  }
  onHarvesting(): void {
  }
  onWorking(): void {if(this.sCreep.memory.AttackMem != undefined && this.sCreep.memory.AttackMem.destRoom != undefined)
    {
      this.sCreep.memory.AttackMem.PreRoom = this.sCreep.room.name;

      if(this.sCreep.room.name != this.sCreep.memory.AttackMem.destRoom)
      {
        Traveler.travelTo(this.sCreep,new RoomPosition(25,25,this.sCreep.memory.AttackMem.destRoom),{
          preferHighway: true,
        });
        if(this.sCreep.hits < this.sCreep.hitsMax)
        {
          this.sCreep.heal(this.sCreep);
        }
        return;
      }
    }
    if(this.sCreep.hits < this.sCreep.hitsMax)
    {
      this.sCreep.heal(this.sCreep);
    }
    var crpHostileTower = this.sCreep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,{
      filter:(f)=>{
        if(f.structureType == STRUCTURE_TOWER)
        {
          return f;
        }
        return null;
      }
    }) as StructureTower;
    var crpHostileAttacker = this.sCreep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{
      filter: (possibleCrp)=>{
        if(possibleCrp.isFriend())
        {
          return null;
        }
        if(possibleCrp.pos.x == 0 || possibleCrp.pos.x == 1 || possibleCrp.pos.x == 49 || possibleCrp.pos.x == 48
          || possibleCrp.pos.y == 0 || possibleCrp.pos.y == 1 || possibleCrp.pos.y == 49 || possibleCrp.pos.y == 48)
          {
            return null;
          }
        if(possibleCrp.getActiveBodyparts(ATTACK) > 0)
        {
          return possibleCrp;
        }
        if(possibleCrp.getActiveBodyparts(RANGED_ATTACK) > 0)
        {
          return possibleCrp;
        }
        return null;
      }
    });
    var crpClosetCreep = this.sCreep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{
      filter: (possibleCrp)=>{
        if(possibleCrp.isFriend())
        {
          return null;
        }
        if(possibleCrp.pos.x == 0 || possibleCrp.pos.x == 1 || possibleCrp.pos.x == 49 || possibleCrp.pos.x == 48
          || possibleCrp.pos.y == 0 || possibleCrp.pos.y == 1 || possibleCrp.pos.y == 49 || possibleCrp.pos.y == 48)
          {
            return null;
          }
        var workParts = possibleCrp.getActiveBodyparts(WORK);
        var raParts = possibleCrp.getActiveBodyparts(RANGED_ATTACK);
        var healParts = possibleCrp.getActiveBodyparts(HEAL);
        var attackParts = possibleCrp.getActiveBodyparts(ATTACK);
        var claimParts = possibleCrp.getActiveBodyparts(CLAIM);
        if(workParts > 0 || raParts > 0 || healParts > 0 || attackParts > 0 || claimParts > 0)
        {
          return possibleCrp
        }
        else
        {
          return possibleCrp
        }
      }
    });
    var creepsinRange = this.sCreep.pos.findInRange(FIND_HOSTILE_CREEPS,3,{
      filter: (possibleCrp)=>{
        if(possibleCrp.owner.username =="lovalgo")
        {
          return null;
        }
        if(possibleCrp.pos.x == 0 || possibleCrp.pos.x == 1 || possibleCrp.pos.x == 49 || possibleCrp.pos.x == 48
          || possibleCrp.pos.y == 0 || possibleCrp.pos.y == 1 || possibleCrp.pos.y == 49 || possibleCrp.pos.y == 48)
          {
            return null;
          }
          return possibleCrp
      }
    });
    if(crpHostileAttacker != undefined)
    {
      var crpRange = crpHostileAttacker.pos.getRangeTo(this.sCreep);
      if(crpRange <= 3 && crpRange > 1)
      {
        //FLEECODE
        var Direction = this.sCreep.pos.getDirectionTo(crpHostileAttacker);
        if(this.sCreep.hits > this.sCreep.hitsMax-80)
        {
          //this.sCreep.move(Direction%8);
        }
        else
        {
          this.sCreep.moveTo(crpHostileAttacker,{
            ignoreCreeps:false
          });
        }
        this.sCreep.heal(this.sCreep);
        if(creepsinRange.length == 1)
        {
          this.sCreep.rangedAttack(crpHostileAttacker);
        }
        else
        {
          this.sCreep.rangedMassAttack();
        }
        return;
      }
      else if(crpRange >= 0 && crpRange <= 1)
      {
        var Direction = this.sCreep.pos.getDirectionTo(crpHostileAttacker);
        if(this.sCreep.hits > this.sCreep.hitsMax-80)
        {
          //this.sCreep.move(Direction%8);
        }
        else
        {
          this.sCreep.moveTo(crpHostileAttacker,{
            ignoreCreeps:false
          });
        }
        this.sCreep.attack(crpHostileAttacker);
        if(creepsinRange.length <= 1)
        {
          this.sCreep.rangedAttack(crpHostileAttacker);
        }
        else
        {
          this.sCreep.rangedMassAttack();
        }
        return;
      }
    }
    if(crpClosetCreep != undefined)
    {
      if(crpClosetCreep.pos.getRangeTo(this.sCreep) > 1)
      {
        this.sCreep.moveTo(crpClosetCreep,{
          ignoreCreeps:false
        });
      }
      if(crpClosetCreep.pos.getRangeTo(this.sCreep) <= 3)
      {
        if(creepsinRange.length <= 1)
        {
          this.sCreep.rangedAttack(crpClosetCreep);
        }
        else
        {
          this.sCreep.rangedMassAttack();
        }
      }
      if(crpClosetCreep.pos.getRangeTo(this.sCreep) <= 1)
      {
        this.sCreep.attack(crpClosetCreep);
      }
      if(this.sCreep.hits < this.sCreep.hitsMax)
      {
        this.sCreep.heal(this.sCreep);
      }
      if(crpClosetCreep.pos.getRangeTo(this.sCreep) <= 3)
      {
        return;
      }
    }
    if(crpClosetCreep == undefined && crpHostileAttacker == undefined)
    {
      var crp = this.sCreep.pos.findClosestByRange(FIND_HOSTILE_CREEPS,{
        filter: (x)=>
        {
          if(x.isFriend()) return null;
          if(x.pos.getRangeTo(this.sCreep) <= 3)
          {
            return x;
          }
          return null;
        }
      });
      if(crp != null)
      {
        this.sCreep.rangedAttack(crp);
      }
      else
      {
        var Friendly = _.filter(this.sCreep.room.find(FIND_HOSTILE_CREEPS),(fX)=> fX.isFriend() && fX.hits <fX.hitsMax);
        if(Friendly.length > 0)
        {
          if(Friendly[0].pos.getRangeTo(this.sCreep) > 1)
          {
            if(this.sCreep.rangedHeal(Friendly[0]) == ERR_NOT_IN_RANGE)
            {
              this.sCreep.travelTo(Friendly[0]);
            }
          }
          else
          {
            if(this.sCreep.heal(Friendly[0]) == ERR_NOT_IN_RANGE)
            {
              this.sCreep.travelTo(Friendly[0]);
            }
          }
        }
        else
        {
          this.sCreep.travelTo(new RoomPosition(25,25,this.sCreep.memory.AttackMem!.destRoom!));
        }
      }
    }
  }
  onRoomAttacked(): void {
  }
  onCreate(): void {
  }
}
