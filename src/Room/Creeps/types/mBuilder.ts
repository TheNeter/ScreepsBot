import { baseCreeps, CreepType } from "Room/Creeps/mCreep";
import { copyFile } from "fs";
import { Traveler } from "traveler";
import { ContractHarvestContainer } from "Room/Contract/ContractTypes/Harvesting/ContractHarvestContainer";
import { ContractHarvestDroppedEnergy } from "Room/Contract/ContractTypes/Harvesting/ContractHarvestDroppedEnergy";
export {};
export class mBuilder extends baseCreeps {
  onTick(): void {
    var room = this.sCreep.room;
    if(room.memory.buildingInformation &&room.controller?.level &&
      room.memory.buildingInformation.LevelDone == room.controller?.level)
      {
        if(room.find(FIND_MY_CONSTRUCTION_SITES).length == 0)
        {
          this.sCreep.suicide();
        }
      }

  }
  onHarvesting(): void {
    if (
      this.sCreep.room.storage &&
      this.sCreep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 20000
    ) {
      if (
        this.sCreep.withdraw(this.sCreep.room.storage, RESOURCE_ENERGY) ==
        ERR_NOT_IN_RANGE
      ) {
        this.sCreep.travelTo(this.sCreep.room.storage);
      }
    } else {
      var DroppedResource = this.sCreep.pos.findClosestByRange(
        FIND_DROPPED_RESOURCES,
        {
          filter: (X) => {
            if (X.amount > 300) return true;
            return false;
          },
        }
      );
      if (DroppedResource != undefined && DroppedResource.amount > 300) {
        var errBuilder = this.sCreep.pickup(DroppedResource);
        if (errBuilder == ERR_NOT_IN_RANGE) {
          this.travelTo(DroppedResource);
        }
      } else {
        var Contracts = this.sCreep.Contracts;
        if (Contracts.length == 0) {
          Contracts = this.sCreep.room.ContractManager.AcceptContracts(
            this.sCreep.id,
            [ContractHarvestContainer, ContractHarvestDroppedEnergy]
          );
        }
        if (
          Contracts.length == 0 &&
          this.sCreep.room.controller &&
          this.sCreep.room.controller.level < 5
        ) {
          var source = this.sCreep.room.findSources();
          if (source != null) {
            if (
              this.sCreep.harvest(
                this.sCreep.room.findClosetSource(this.sCreep.pos)!
              ) == ERR_NOT_IN_RANGE
            ) {
              this.sCreep.travelTo(
                this.sCreep.room.findClosetSource(this.sCreep.pos)!
              );
            }
          }
        } else if (Contracts.length > 0) {
          Contracts[0].Action(this);
        }
      }
    }
  }
  onWorking(): void {
    var arrCS = this.sCreep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
    if (arrCS) {
      if (this.sCreep.build(arrCS) == ERR_NOT_IN_RANGE) {
        this.sCreep.travelTo(arrCS);
      }
    } else {
      var structExtension = this.sCreep.room
        .find(FIND_MY_STRUCTURES)
        .filter((x) => {
          if (x.structureType == STRUCTURE_RAMPART && x.hits < 500000) {
            return x;
          }
          return null;
        });

      if (structExtension.length > 0) {
        structExtension.sort((a, b) => {
          return a.hits - b.hits;
        });
        this.sCreep.repair(structExtension[0]);
      }
    }
  }
  onRoomAttacked(): void {}
  onCreate(): void {}
}
