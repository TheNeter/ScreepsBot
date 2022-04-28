import { QuadSquadPath } from "./CombatSystems/QuadSquadPathfinding";
import { RoomPlan, RoomPlans } from "./RoomBuildingSystem";
import { SpawmSystem } from "./Spawn/spawnInterface";
import { ctrlFactory } from "./Structures/Factory";
import { LinkManager } from "./Structures/LinkManager";
import { RoomFlags } from "./Structures/structureMemory";


declare global {
  interface RoomMemory {
    DefenderOrigin?: DefenderOriginPosition;
    ControllerLink?: string;
    StorageLink?: string;
    avoid?: number;
    structureMemory: StructureMemory;
  }
  interface StructureMemory {
    //Key ID ist die Soruce und gibt die ContainerID wieder.
    LayoutID?: string;
    SourceContainer?: { [id: string]: string };
    SourceLink?: { [id: string]: string };
    HiveSpawn?: string;
    HiveTower?: string;
    HiveLink?: string;
  }
  interface DefenderOriginPosition {
    X: number,
    Y: number
  }
}

export class roomHandler {


  checkMemory(): void {
    if (this._room) {
      if(this._room.memory.Structures == undefined)
      {
        this._room.memory.Structures = {};
        for(var structure of this._room.find(FIND_STRUCTURES))
        {
          if(structure.structureType == STRUCTURE_WALL ||
            structure.structureType == STRUCTURE_POWER_BANK ||
            structure.structureType == STRUCTURE_PORTAL ||
            structure.structureType == STRUCTURE_INVADER_CORE ||
            structure.structureType == STRUCTURE_KEEPER_LAIR ||
            structure.structureType == STRUCTURE_ROAD)
            {
              continue;
            }
            this._room.memory.Structures[structure.id] = {
              Typ: structure.structureType,
              Flag: "",
              Pos: {
                x: structure.pos.x,
                y: structure.pos.y
              }
            }
        }
      }

      if (this._room.memory.structureMemory == undefined) {
        this._room.memory.structureMemory = {};
      }
      if (Game.time % 15 != 0) {
        return;
      }
      for (var sources of this._room.find(FIND_SOURCES)) {
        if (this._room.memory.structureMemory != undefined) {
          if (this._room.memory.structureMemory.SourceContainer == undefined) {
            this._room.memory.structureMemory.SourceContainer = {};
          }
          if (this._room.memory.structureMemory.SourceLink == undefined) {
            this._room.memory.structureMemory.SourceLink = {};
          }
          if (this._room.memory.structureMemory.SourceContainer[sources.id] == undefined) {
            var closetContainer = sources.pos.findClosestByRange(FIND_STRUCTURES, {
              filter: (x) => {
                if (x.structureType == STRUCTURE_CONTAINER)
                  return true;
                return false;
              }
            }) as StructureContainer;
            if (closetContainer != undefined && closetContainer.pos.getRangeTo(sources) <= 1) {
              this._room.memory.structureMemory.SourceContainer[sources.id] = closetContainer.id;
            }
          }

          if (this._room.memory.structureMemory.SourceLink[sources.id] == undefined) {
            var closetSource = sources.pos.findClosestByRange(FIND_STRUCTURES, {
              filter: (x) => {
                if (x.structureType == STRUCTURE_LINK)
                  return true;
                return false;
              }
            }) as StructureContainer;
            if (closetSource != undefined && closetSource.pos.getRangeTo(sources) <= 3) {
              this._room.memory.structureMemory.SourceLink[sources.id] = closetSource.id;
            }
          }
        }
      }
    }
  }


  findControllerLink():void{
    if(this._room.memory.ActionStructures &&
      this._room.memory.ActionStructures.ControllerLink == undefined)
    {
      for (var struc of this._room.find(FIND_MY_STRUCTURES)) {
        if (struc.structureType == STRUCTURE_LINK) {
          if (struc.pos.getRangeTo(this._room.controller!.pos) <= 1) {
            this._room.memory.ActionStructures.ControllerLink = struc.id;
            this._room.memory.ControllerLink = struc.id; //Delete After Implemented
            break;
          }
        }
      }
    }
  }
  findHiveSpawn():void{
    if (this._room.memory.ActionStructures &&
      this._room.memory.ActionStructures.HiveSpawn == undefined) {
      this._room.find(FIND_MY_SPAWNS).forEach((x) => {
        if (this._room.storage!.pos.x - x.pos.x == 2 &&
          this._room.storage!.pos.y - x.pos.y == 1) {
          this._room.memory.structureMemory.HiveSpawn = x.id;//Delete After Implemented
          this._room.memory.ActionStructures!.HiveSpawn = x.id
        }
      });
    }
  }
  FindHiveTower():void{
    if (this._room.memory.ActionStructures &&
      this._room.memory.ActionStructures.HiveTower == undefined) {
        this._room.find(FIND_STRUCTURES).forEach((x) => {
          if (x.structureType == STRUCTURE_TOWER) {
            if (this._room.storage!.pos.x - x.pos.x == 0 &&
              this._room.storage!.pos.y - x.pos.y == 2) {
              this._room.memory.structureMemory.HiveTower = x.id;
              this._room.memory.ActionStructures!.HiveTower = x.id
            }
          }
        });
    }
  }
  FindHiveLink():void{
    if (this._room.memory.ActionStructures &&
      this._room.memory.ActionStructures.HiveLink == undefined) {
        this._room.find(FIND_STRUCTURES).forEach((x) => {
          if (x.structureType == STRUCTURE_LINK) {
            if (this._room.storage!.pos.x - x.pos.x == 1 &&
              this._room.storage!.pos.y - x.pos.y == 0) {
              this._room.memory.structureMemory.HiveLink = x.id;
              this._room.memory.ActionStructures!.HiveLink = x.id;
            }
          }
        });
    }
  }
  FindSourceLinks():void{
    if (this._room.memory.ActionStructures)
    {
      if(this._room.memory.ActionStructures.Sources != undefined)
      {
        var roomSources = this._room.find(FIND_SOURCES);
        var roomSourcesCount = roomSources.length;
        var iterator = 0;
        if(roomSourcesCount == 1)
        {
          if(this._room.memory.ActionStructures.Sources[roomSources[0].id] == undefined)
          {
            this._room.memory.ActionStructures.Sources[roomSources[0].id] = {};
          }
          if(this._room.memory.ActionStructures.Sources[roomSources[0].id].Link == undefined)
          {
            var Link = _.filter(this._room.find(FIND_STRUCTURES),(l)=>l.structureType == STRUCTURE_LINK && l.pos.getRangeTo(roomSources[0]) <=2);
            if(Link.length > 0)
              this._room.memory.ActionStructures.Sources[roomSources[0].id].Link = Link[0].id;
          }
          if(this._room.memory.ActionStructures.Sources[roomSources[0].id].Container == undefined)
          {
            var Container = _.filter(this._room.find(FIND_STRUCTURES),(l)=>l.structureType == STRUCTURE_CONTAINER && l.pos.getRangeTo(roomSources[0]) <=1);
            if(Container.length > 0)
              this._room.memory.ActionStructures.Sources[roomSources[0].id].Container = Container[0].id;
          }
        }
        else
        {
          for(var count = 0; count < 2; count++)
          {
            if(this._room.memory.ActionStructures.Sources[roomSources[count].id] == undefined)
            {
              this._room.memory.ActionStructures.Sources[roomSources[count].id] = {};
            }
            if(this._room.memory.ActionStructures.Sources[roomSources[count].id].Link == undefined)
            {
              var Link = _.filter(this._room.find(FIND_STRUCTURES),(l)=>l.structureType == STRUCTURE_LINK && l.pos.getRangeTo(roomSources[count]) <=2);
              if(Link.length > 0)
                this._room.memory.ActionStructures.Sources[roomSources[count].id].Link = Link[0].id;
            }
            if(this._room.memory.ActionStructures.Sources[roomSources[count].id].Container == undefined)
            {
              var Container = _.filter(this._room.find(FIND_STRUCTURES),(l)=>l.structureType == STRUCTURE_CONTAINER && l.pos.getRangeTo(roomSources[count]) <=1);
              if(Container.length > 0)
                this._room.memory.ActionStructures.Sources[roomSources[count].id].Container = Container[0].id;
            }
          }
        }
      }
      else
      {
        this._room.memory.ActionStructures.Sources = {};
      }
    }
  }
  FindHiveLab():void{
    if (this._room.memory.ActionStructures &&
      this._room.memory.ActionStructures.HiveLab == undefined) {
        this._room.find(FIND_STRUCTURES).forEach((x) => {
          if (x.structureType == STRUCTURE_LAB) {
            if (this._room.storage!.pos.x - x.pos.x == 2 &&
              this._room.storage!.pos.y - x.pos.y == 2) {
              this._room.memory.ActionStructures!.HiveLab = x.id;
            }
          }
        });
    }
  }
  FindHiveFactory():void{
    if (this._room.memory.ActionStructures &&
      this._room.memory.ActionStructures.Factory == undefined) {
        this._room.find(FIND_STRUCTURES).forEach((x) => {
          if (x.structureType == STRUCTURE_FACTORY) {
            if (this._room.storage!.pos.x - x.pos.x == 0 &&
              this._room.storage!.pos.y - x.pos.y == 1) {
              this._room.memory.ActionStructures!.Factory = x.id;
            }
          }
        });
    }
    else if(this._room.memory.ActionStructures &&
      this._room.memory.ActionStructures.Factory)
      {
        new ctrlFactory(Game.getObjectById(this._room.memory.ActionStructures.Factory) as StructureFactory);
      }
  }
  _room: Room;
  static numSpawn: number = 0;
  constructor(room: Room) {
    this._room = room;
    roomHandler.numSpawn++;
    SpawmSystem.Run(this._room, roomHandler.numSpawn);
    this.checkMemory();
    //var tick = Game.cpu.getUsed();
    if(this._room.memory.ActionStructures == undefined)
    {
      this._room.memory.ActionStructures = {};
    }

    var cpuUsedFind = Game.cpu.getUsed();
    //FIND Action Structure Memory
    this.findControllerLink();
    this.findHiveSpawn();
    this.FindHiveTower();
    this.FindHiveLink();
    this.FindSourceLinks();
    this.FindHiveLab();
    this.FindHiveFactory();
    if(this._room.memory.RefillStructure == undefined)
    {
      this._room.memory.RefillStructure = {};
    }
    //Action Structure - Actions
    new LinkManager(this._room);
    //---------------------------
    var EventLog = this._room.getEventLog();

    for(var logEntry of EventLog)
    {
      if(logEntry.event == EVENT_OBJECT_DESTROYED)
      {
        if(this._room.memory.buildingInformation)
        {
          console.log("____________EVENT LOG_________________")
          console.log("__________________________________________")
          console.log("destroyed Object ");
          console.log("__________________________________________")
          console.log("__________________________________________")
          delete this._room.memory.buildingInformation.LevelDone;
        }
      }
    }


    var cpuCostDestroy = Game.cpu.getUsed();
    for(var id in room.memory.Structures)
    {
      if(Game.getObjectById(id) == undefined)
      {
        console.log("__________________________________________")
        console.log("__________________________________________")
        console.log("destroyed Object ");
        console.log("__________________________________________")
        console.log("__________________________________________")
        this.onObjectDestroyed(id);
      }
    }
    this.onConstructionSite();
    for (var entry of EventLog) {
      switch (entry.event) {
        case EVENT_BUILD:
          this.onEventBuild(entry.objectId, entry.data);
          break;
      }
    }
    //HELP_CODE
    if (this._room.storage && this._room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 200000) {
      for (var strRoom in Game.rooms) {
        var room = Game.rooms[strRoom];
        if (room.controller && room.terminal && room.storage && room.controller.my && this._room.terminal) {
          if (room.storage.store.getUsedCapacity(RESOURCE_ENERGY) + room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 100000) {
            if (this._room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) >= 10000) {
              this._room.terminal.send(RESOURCE_ENERGY, 5000, room.name, "HELP - SEND");
            }
          }
        }
      }
    }
    if(QuadSquadPath.badPositions[this._room.name] != undefined)
    {
      for(var bp of QuadSquadPath.badPositions[this._room.name])
      {
          this._room.visual.rect(bp.x-0.5,bp.y-0.5,1,1,{
              fill: "#FF0000"
          });
      }
    }
  }

  onConstructionSite():void{
    if(this._room.controller && this._room.memory.buildingInformation &&
       this._room.memory.buildingInformation.LevelDone != this._room.controller.level)
    {
      if(this._room.find(FIND_MY_CONSTRUCTION_SITES).length < 1)
      {
        for(var nextBuild of RoomPlans.roomLayout)
        {

          var typ = nextBuild.Typ;
          if(nextBuild.Typ == STRUCTURE_RAMPART)
          {
            continue;
          }
          if(nextBuild.Typ == STRUCTURE_WALL && this._room.controller!.level < 8)
          {
            continue;
          }
          if(nextBuild.Typ == STRUCTURE_ROAD && this._room.controller!.level < 3)
          {
            continue;
          }
          if(nextBuild.Typ == STRUCTURE_CONTAINER && this._room.controller!.level < 4)
          {
            continue;
          }

          if(nextBuild.Typ == STRUCTURE_WALL)
          {
            var struct = this._room.lookForAt(LOOK_STRUCTURES,this._room.memory.buildingInformation.CenterX + nextBuild.X,this._room.memory.buildingInformation.CenterY + nextBuild.Y) as Structure[];
            for(var stru of struct)
            {
              if(stru.structureType == STRUCTURE_ROAD)
              {
                typ = STRUCTURE_RAMPART;
              }
            }
          }
          var err = this._room.createConstructionSite(this._room.memory.buildingInformation.CenterX + nextBuild.X,this._room.memory.buildingInformation.CenterY + nextBuild.Y,typ as BuildableStructureConstant);
          if(err == 0)
          {
            return;
          }
        }
        this._room.memory.buildingInformation.LevelDone = this._room.controller.level;
      }
    }
  }

  onObjectDestroyed(id:string):void{
    var structure = this._room.memory.Structures[id];
    if(this._room.createConstructionSite(structure.Pos.x,structure.Pos.y,structure.Typ as BuildableStructureConstant) == OK)
    {
      delete this._room.memory.Structures[id];
    }
  }
  onEventBuild(object: string, data: { targetId: string, amount: number, energySpent: number }): void {
    if (this._room.memory.BuldingPlan != undefined) {
      var buildingObject = Game.getObjectById(data.targetId);
      if (buildingObject instanceof ConstructionSite) {
        for (var item of this._room.memory.BuldingPlan) {
          if (item.Structure == STRUCTURE_RAMPART)
            continue;
          if (item.X == buildingObject.pos.x && item.Y == buildingObject.pos.y) {
            if (item.Structure)
              //console.log("Building "+ item.Structure+ " "+item.X+" - "+item.Y);
              break;
          }
        }
      }
    }
  }
}
