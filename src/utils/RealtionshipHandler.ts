
declare global{
  interface RelationshipScoreMemory {
    lt: number;
    ratio: number;
  }
  interface Memory{
    relationship: {[x:string]:RelationshipScoreMemory};
  }
}
export class RelationshipHandler {

  public static getScore(player: string): number {
      let playerRelation = Memory.relationship[player];
      if (playerRelation == null) {
          return -1;
      }
      return playerRelation.ratio;
  }

  public static isFriend(player: string) {
      return this.getScore(player) > 0;
  }

  public static addUnknown(player: string) {
    if(Memory.relationship == undefined)
    {
      Memory.relationship={}
    }
      if (!Memory.relationship[player]) {
          Memory.relationship[player] = {} as RelationshipScoreMemory;
      }
      const playerRelation = Memory.relationship[player]!;
      if (playerRelation.lt == null) {
          console.log('init releationship: ' + player);
          playerRelation.ratio = 1;
          playerRelation.lt = Game.time;
      }
  }
}

declare global{
  interface Creep{
    isFriend():boolean;
  }
}

Creep.prototype.isFriend = function(){
  return RelationshipHandler.isFriend(this.owner.username);
}
