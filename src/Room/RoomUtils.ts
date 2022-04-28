import { object } from "lodash";
import { getMaxListeners } from "process";

export { }

declare global {

  function analyseWallDistanceMin(room: Room, x: number, y: number): number;
  function analyseDistanceCenter(room: Room, x: number, y: number): number;
  function analyseDistanceController(room: Room, x: number, y: number): number;
  interface Room {
    GetCreepsWithTyp(Typ: string): Creep[];

    getCreepsAlive(Typ: string, minTtl: number): Creep[];
    GetSpawns(): StructureSpawn[];
    GetDropMinerWithSource(source: Source): Creep | undefined;
    findDroppedEnergy(minEnergyCal: number, pos: RoomPosition): Resource | null;
    findDroppedEnergyMax(minEnergyCal: number): Resource | null;
    findSources(): Source | null;
    findClosetSource(from: RoomPosition): Source | null;
    TempCache: RoomCache;
    //Neu
    UsedExtensions(): StructureExtension[];


    Mineral: MineralConstant | undefined;
  }
  interface RoomCache {
    CreepCounter?: { [TypeName: string]: Creep[] };
  }
}

Object.defineProperty(Room.prototype, "Mineral", {
  get: function () {
    var room: Room = this;
    var minerals = room.find(FIND_MINERALS);
    if (minerals.length > 0) {
      return minerals[0].mineralType;
    }
    return undefined;
  }
})

/**Sucht die Benutzen Extensions und gibt diese aus */
Room.prototype.UsedExtensions = function () {
  return this.find(FIND_MY_STRUCTURES).filter((x) => x.structureType == STRUCTURE_EXTENSION && x.store.getFreeCapacity(RESOURCE_ENERGY) >= 0) as StructureExtension[];
}



Room.prototype.findSources = function () {
  for (var res of this.find(FIND_SOURCES)) {
    return res;
  }
  return null;
}
Room.prototype.findClosetSource = function (rpos) {
  return rpos.findClosestByRange(FIND_SOURCES_ACTIVE);
}
Room.prototype.getCreepsAlive = function (typ, minttl) {
  var arrRet: Creep[] = [];
  for (var crpName in Game.creeps) {
    var crp = Game.creeps[crpName];
    if (crp.room.name == this.name) {
      if (crp.memory.creepGlobal.Typ != undefined) {
        if (crp.memory.creepGlobal.Typ == typ) {
          if (crp.ticksToLive == undefined || crp.ticksToLive >= minttl) {
            arrRet.push(crp);
          }
        }
      }
    }
  }
  return arrRet;
}
Room.prototype.findDroppedEnergy = function (minVal, pos) {
  var dropedRes: Resource | null = null;
  /*for(let res of this.find(FIND_DROPPED_RESOURCES))
  {
    if(res.resourceType == RESOURCE_ENERGY && res.amount >= minVal)
    {
      if(dropedRes == null)
      {
        dropedRes = res;
      }
      else if(dropedRes != null)
      {
        if(res.amount > dropedRes.amount)
        {
          dropedRes = res;
        }
      }
    }
  }*/
  dropedRes = pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
    filter: (dr) => {
      if (dr.amount >= minVal)
        return dr;
      return null;
    }
  })
  return dropedRes;
}
Room.prototype.findDroppedEnergyMax = function (minVal) {
  var DroppedEnergy: Resource;
  var value = 0;
  for (var res of this.find(FIND_DROPPED_RESOURCES)) {
    if (res.resourceType == RESOURCE_ENERGY && res.amount >= minVal) {
      if (value < res.amount) {
        value = res.amount;
        DroppedEnergy = res;
      }
    }
  }
  return DroppedEnergy!;
}
Room.prototype.GetSpawns = function () {
  var lstSpawns: StructureSpawn[] = new Array();
  this.find(FIND_MY_SPAWNS).forEach((crp) => {
    lstSpawns.push(crp);
  });
  return lstSpawns;
}

Room.prototype.GetCreepsWithTyp = function (Typ) {
  var RetString = "";
  if (this.Cache().Get<Creep[]>("CreepsFromType" + Typ) == null) {
    var arrRet: Creep[] = [];
    this.find(FIND_MY_CREEPS).forEach((crp) => {
      if (crp.memory.Typ != undefined) {
        if (crp.memory.Typ == Typ && crp.ticksToLive != undefined) {
          arrRet.push(crp);
        }
      }
    });
    this.Cache().Set("CreepsFromType" + Typ, arrRet);
  }
  return this.Cache().Get<Creep[]>("CreepsFromType" + Typ)!;
}


var _global = global;
export class RoomMath {
  static inDistance(From: RoomPosition, x: number, y: number, rangeFrom: number, rangeTo: number): boolean {
    var Distance = From.getRangeTo(x, y);
    if (Distance >= rangeFrom && Distance <= rangeTo) {
      return true;
    }
    return false;
  }
}

/**
 * Analysiert die Distanz zum Controller
 * @param room Der Raum für den das berechnet wird
 * @param x die X Koordinate für die der Wert berechnet werden soll
 * @param y die Y Koordinate für die der Wert berechnet werden soll
 * @returns Ein numerischer Wert zwischen 1 - 50 für die Distanz zum Controller
 */
_global.analyseDistanceController = function (room: Room, x: number, y: number) {
  var _roomPosition: RoomPosition = new RoomPosition(x, y, room.name);
  return room.controller!.pos.getRangeTo(x, y);
}

/**
 * Analysiert die Distanz zur Mitte
 * @param room Der Raum für den das berechnet wird
 * @param x die X Koordinate für die der Wert berechnet werden soll
 * @param y die Y Koordinate für die der Wert berechnet werden soll
 * @returns Ein numerischer Wert zwischen 1 - 50 für die Distanz zur Mitte
 */
_global.analyseDistanceCenter = function (room: Room, x: number, y: number) {
  var _roomPosition: RoomPosition = new RoomPosition(x, y, room.name);
  return _roomPosition.getRangeTo(25, 25);
}

/**
 * Analysiert die minimale Distance
 * @param room Der Raum für den das berechnet wird
 * @param x die X Koordinate für die der Wert berechnet werden soll
 * @param y die Y Koordinate für die der Wert berechnet werden soll
 * @returns Ein numerischer Wert zwischen 1 - 50 für die minimale Distanz zur Wand
 */
_global.analyseWallDistanceMin = function (room: Room, x: number, y: number) {
  var _terrain = room.getTerrain();
  var Distance = 50;
  var _roomPosition: RoomPosition = new RoomPosition(x, y, room.name);
  for (var x = 0; x < 50; x++) {
    for (var y = 0; y < 50; y++) {
      if (_terrain.get(x, y) == TERRAIN_MASK_WALL) {
        var tmpDistance = _roomPosition.getRangeTo(x, y);
        if (Distance > tmpDistance) {
          Distance = tmpDistance;
        }
      }
    }
  }
  return Distance;
}
