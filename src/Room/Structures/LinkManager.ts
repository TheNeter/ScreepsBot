import { ContractEmptyHiveLink } from "Room/Contract/ContractTypes/Working/ContractEmptyHiveLink";

export class LinkManager {
  private room: Room;

  private ControllerLink: StructureLink | undefined;
  private ControllerLinkBusy: boolean = false;

  private StorageLink: StructureLink | undefined;
  private StorageLinkBusy: boolean = false;

  private SourceLink1: StructureLink | undefined;
  private SourceLink1Busy: boolean = false;

  private SourceLink2: StructureLink | undefined;
  private SourceLink2Busy: boolean = false;

  private Structures: ActionStructures;
  constructor(pRoom: Room) {
    this.room = pRoom;
    this.Structures = this.room.memory.ActionStructures!;
    try {
      if (this.room.controller!.level >= 6) {
        if (this.Structures.HiveLink) {
          this.StorageLink = Game.getObjectById(
            this.Structures.HiveLink
          ) as StructureLink;
          if(this.StorageLink.cooldown > 0)
          {
            this.StorageLinkBusy = true;
          }
        }
        if (this.Structures.ControllerLink) {
          this.ControllerLink = Game.getObjectById(
            this.Structures.ControllerLink
          ) as StructureLink;
          if(this.ControllerLink.cooldown > 0)
          {
            this.ControllerLinkBusy = true;
          }
        }
        if (this.Structures.Sources) {
          for (var SourceID in this.Structures.Sources)
          {
            var SourceData = this.Structures.Sources[SourceID];
            if (this.SourceLink1 == undefined && SourceData.Link) {
              this.SourceLink1 = Game.getObjectById(
                SourceData.Link
              ) as StructureLink;
              if(this.SourceLink1.cooldown > 0)
              {
                this.SourceLink1Busy = true;
              }
            } else if (this.SourceLink2 == undefined && SourceData.Link) {
              this.SourceLink2 = Game.getObjectById(
                SourceData.Link
              ) as StructureLink;
              if(this.SourceLink2.cooldown > 0)
              {
                this.SourceLink2Busy = true;
              }
            }
          }
        }
        this.run();
      } else {
        return;
      }
    } catch (err) {
      console.log(`Error | LinkManager | ${this.room.name} | ${err}`);
    }
  }
  private run(): void {

    //ToDo Umschreiben für EmptyMemory - Danach Löschen
    if(this.StorageLink)
    {
      if(this.StorageLink.store.getUsedCapacity(RESOURCE_ENERGY) >= 400)
      {
        if(!this.StorageLink.room!.ContractManager.IsCreated(this.StorageLink.id,ContractEmptyHiveLink))
        {
          var Contract = new ContractEmptyHiveLink(this.StorageLink.id,40,this.StorageLink.room!.name);
          this.StorageLink.room!.ContractManager.CreateContract(Contract);
        }
      }
    }
    //--------------------------------------------------
    if(this.StorageLink)
    {
      if(this.room.memory.RefillStructure[this.StorageLink.id])
      {
        if(this.StorageLink.store.getUsedCapacity(RESOURCE_ENERGY) >= 800)
        {
          delete this.room.memory.RefillStructure[this.StorageLink.id];
        }
      }
    }
    if(this.StorageLink&&this.room.storage && this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) >= 300000)
    {
      var sourcesActive = this.room.find(FIND_SOURCES_ACTIVE);

      if((this.ControllerLink && this.ControllerLink.store.getUsedCapacity(RESOURCE_ENERGY) <= 0))
      {
        if(this.room.memory.RefillStructure[this.StorageLink.id] == undefined)
        {
          this.room.memory.RefillStructure[this.StorageLink.id] = {
            Ammount: 800,
            RessourceTyp: RESOURCE_ENERGY,
            GoalAmmount: 800,
            Direction: 1
          }
        }
      }
      if(this.ControllerLink && this.ControllerLink.store.getUsedCapacity(RESOURCE_ENERGY) <= 600 && this.StorageLink.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
      {
        this.StorageLink.transferEnergy(this.ControllerLink);
      }
    }
    if(this.room.storage && this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) >= 15000)
    {
      this.SendSourceTo(this.ControllerLink);
      this.SendSourceTo(this.StorageLink);
    }
    else if(this.room.storage && this.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) < 15000)
    {
      this.SendSourceTo(this.StorageLink);
    }
  }

  private SendSourceTo(To:StructureLink|undefined):boolean{
    if(To)
    {
      if(this.SourceLink1 &&
         this.SourceLink1Busy == false &&
         this.SendTo(this.SourceLink1,To))
      {
        this.SourceLink1Busy = true;
        return true;
      }
      else if(this.SourceLink2 &&
        this.SourceLink2Busy == false &&
        this.SendTo(this.SourceLink2,To))
      {
        this.SourceLink2Busy = true;
        return true;
      }
      else if(this.StorageLink &&
        this.StorageLinkBusy == false &&
        this.StorageLink.store.getUsedCapacity(RESOURCE_ENERGY) >= 800 &&
        this.SendTo(this.StorageLink,To))
        {
          this.StorageLinkBusy = true;
          return true;
        }
    }
    return false;
  }

  private SendTo(From:StructureLink, To:StructureLink):boolean
  {
    if (From &&
      From.store.getUsedCapacity(RESOURCE_ENERGY) >= 400 &&
      To &&
      To.store.getFreeCapacity(RESOURCE_ENERGY) > 100)
    {
      if(From.transferEnergy(To) == OK)
      {
        return true;
      }
    }
    return false;
  }
}
