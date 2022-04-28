import { CreepType } from "Room/Creeps/mCreep";


export interface IcreepSpawn{
  SpawnNeeded(room:Room):boolean;
  Typ(room:Room):CreepType;
  Priority(room:Room):number;
  Direction(room:Room):DirectionConstant[]|undefined;
  Spawn(room:Room):string|undefined;
  getAttackMemory(room:Room):AttackMemory | undefined;
  BodyParts(room:Room):BodyPartConstant[];
  Memory(room:Room):CreepMemory|undefined;
}

export class CreepBodyUtils{
  static Part(Body: {[key:string]:number}):BodyPartConstant[]{
    var arr : BodyPartConstant[] = []
    for(var b in Body)
    {
      var bp = Body[b];
      for(var i = 0; i < bp;i++)
      {
        switch(b)
        {
          case "WORK":
            arr.push(WORK);
            break;
          case "CARRY":
            arr.push(CARRY);
            break;
          case "MOVE":
            arr.push(MOVE);
            break;
          case "ATTACK":
            arr.push(ATTACK);
            break;
          case "RANGED_ATTACK":
            arr.push(RANGED_ATTACK);
            break;
          case "HEAL":
            arr.push(HEAL);
            break;
          case "CLAIM":
            arr.push(CLAIM);
            break;
          case "TOUGH":
            arr.push(TOUGH);
            break;
        }
      }
    }
    return arr;
  }

  static Cost(Body: BodyPartConstant[]):number{
    var arr : BodyPartConstant[] = []
    var cost : number = 0;
    for(var b of Body)
    {
      switch(b)
      {
        case WORK:
          cost += 100;
          break;
        case MOVE:
          cost += 50;
          break;
        case CARRY:
          cost += 50;
          break;
        case ATTACK:
          cost += 80;
          break;
        case RANGED_ATTACK:
          cost += 150;
          break;
        case HEAL:
          cost += 250;
          break;
        case CLAIM:
          cost += 600;
          break;
        case TOUGH:
          cost += 10;
          break;
      }
    }
    return cost;
  }
}

export class SpawmSystem{

  static GenerateName(){
    var randomVal = Math.floor(Math.random() * 1000);
    var Name = "GENPETER_"+randomVal;
    return Name;
  }
  static Run(room:Room, id?:number):void{
    try
    {
      if(Game.time % 3 != 0 ) return;
      var spawnArrayFunction:{SpawnClass:any, Prio:number}[] = []
      for(var func of registeredClasses)
      {
        var testSpawn:IcreepSpawn = new func();
        if(testSpawn.SpawnNeeded(room))
        {
          spawnArrayFunction.push({
            SpawnClass: func,
            Prio: testSpawn.Priority(room)
          });
        }
      }
      spawnArrayFunction = spawnArrayFunction.sort((a,b)=>{
        return b.Prio-a.Prio
      });

      var SpawnedThisTick = false;
      var spawningSpawn = room.find(FIND_MY_SPAWNS).filter((X)=>{
        if(X.spawning && X.spawning.needTime - X.spawning.remainingTime < 10)
          return true;
        return false;
      });
      for(var item of spawnArrayFunction)
      {
        var _Class:IcreepSpawn = new item.SpawnClass();
        var exit = false;
        for(var spawn of room.find(FIND_MY_SPAWNS))
        {
          if(spawn.spawning == null && SpawnedThisTick == false)
          {
            var directions:DirectionConstant[] = [];
            var mem : CreepMemory|undefined = _Class.Memory(room);
            if(_Class.Direction(room) != undefined && _Class.Spawn(room) != undefined)
            {
              if(_Class.Spawn(room) == spawn.id)
              {
                directions = _Class.Direction(room)!;
              }
            }
            else
            {
              directions.push(TOP);
              directions.push(TOP_LEFT);
              directions.push(TOP_RIGHT);
              directions.push(RIGHT);
              directions.push(BOTTOM_RIGHT);
              directions.push(BOTTOM);
              directions.push(BOTTOM_LEFT);
              directions.push(LEFT);
            }
            if(mem == undefined)
            {
              mem = {
                creepGlobal: {
                  Typ: _Class.Typ(room) as string,
                  Room: spawn.room.name
                }
              }
            }
            var err = spawn.spawnCreep(_Class.BodyParts(room),SpawmSystem.GenerateName(),{
              directions:directions,
              memory:mem
            });
            if(err == OK)
            {
              SpawnedThisTick = true;
              exit = true;
              break;
            }
            else if(err == ERR_NOT_ENOUGH_ENERGY)
            {
              exit = true;
              break;
            }
          }
        }
        if(exit)
          break;
      }
    }
    catch(e){
      console.log("ERROR: SpawnManager > "+(e as Error).message);
    }
  }
}

export var registeredClasses:any[] = [];

export function CreepSpawn() {
     return function(target: any) {
          registeredClasses.push(target);
     };
}
