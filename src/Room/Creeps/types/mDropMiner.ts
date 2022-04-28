import { baseCreeps } from "Room/Creeps/mCreep";
export{}

export class mDropMiner extends baseCreeps{
  findSource()
  {
    if(this.sCreep.memory.miningMemory == undefined && this.sCreep.ticksToLive != undefined)
    {
      for(var source of this.sCreep.room.find(FIND_SOURCES))
      {
        var sourceFree:boolean = true;
        for(var creepOfArray of this.sCreep.room.find(FIND_MY_CREEPS))
        {
          if(creepOfArray.memory.miningMemory != undefined)
          {
            if(creepOfArray.memory.miningMemory.Source == source.id)
            {
              sourceFree = false;
            }
          }
        }
        if(sourceFree)
        {
          this.sCreep.memory.miningMemory = {
            Source: source.id
          }
          return;
        }
      }
    }
  }
  onTick(): void {
    this.findSource();
    if(this.sCreep.memory.miningMemory == undefined)
      return;
    if(this.sCreep.ticksToLive == undefined || this.sCreep.ticksToLive == 0)
    {

    }
    else
    {
      if(this.sCreep.getActiveBodyparts(CARRY) > 0)
      {
        var Source = Game.getObjectById(this.sCreep.memory.miningMemory.Source!) as Source;
        var Link : StructureLink | undefined = undefined;
        var Container : StructureContainer | undefined = undefined;
        if(Source && this.sCreep.room.memory.structureMemory != undefined)
        {
          if(this.sCreep.room.memory.structureMemory.SourceContainer)
          {
            Container = Game.getObjectById(this.sCreep.room.memory.structureMemory.SourceContainer[Source.id]) as StructureContainer;
          }
          if(this.sCreep.room.memory.structureMemory.SourceLink)
          {
            Link = Game.getObjectById(this.sCreep.room.memory.structureMemory.SourceLink[Source.id]) as StructureLink;
          }
        }
        if(Container && this.sCreep.pos.getRangeTo(Container) != 0)
        {
          this.sCreep.travelTo(Container);
        }
        if(Source)
        {
          if(this.sCreep.ticksToLive <= 2)
          {
            if(Link)
              {
                if(this.sCreep.transfer(Link,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                  this.travelTo(Link);
                }
              }
            else if(Container)
              {
                this.sCreep.transfer(Container,RESOURCE_ENERGY);
              }
          }
          else if(this.sCreep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
          {
            if(Link)
              {
                if(this.sCreep.transfer(Link,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                  this.travelTo(Link);
                }
              }
            else if(Container)
              {
                this.sCreep.transfer(Container,RESOURCE_ENERGY);
              }
          }
          else if(Link && Container && Container.store.getUsedCapacity(RESOURCE_ENERGY) > 100)
          {
            this.sCreep.withdraw(Container,RESOURCE_ENERGY);
          }
          else if(this.sCreep.harvest(Source) == ERR_NOT_IN_RANGE)
          {
            if(Container)
            {
              this.sCreep.travelTo(Container);
            }
            else
            {
              this.sCreep.travelTo(Source);
            }
          }
        }
      }
      else
      {
        var Source = Game.getObjectById(this.sCreep.memory.miningMemory.Source!) as Source;
        var Container : StructureContainer | undefined = undefined;
        if(Source && this.sCreep.room.memory.structureMemory != undefined)
        {
          if(this.sCreep.room.memory.structureMemory.SourceContainer)
          {
            Container = Game.getObjectById(this.sCreep.room.memory.structureMemory.SourceContainer[Source.id]) as StructureContainer;
          }
        }
        if(Source)
        {
          if(Container)
            {
              this.sCreep.travelTo(Container);
            }
            else
            {
              this.sCreep.travelTo(Source);
            }
          if(this.sCreep.harvest(Source) == ERR_NOT_IN_RANGE)
          {
          }
        }
      }
    }
  }
  onHarvesting(): void {
  }
  onWorking(): void {
  }
  onRoomAttacked(): void {
  }
  onCreate(): void {

  }
}
