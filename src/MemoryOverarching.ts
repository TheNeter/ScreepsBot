
export{}
declare global{
  interface Memory{
    RoomClaimSystem?:RoomClaim;
  }
  interface RoomClaim{
    destRoomName?:string;
    fromRoomName?:string;
    SendHelp?:boolean;
    scouted?:boolean;
    claimed?:boolean;
    playerInside?:boolean;
    playerConstructionInside?:boolean;
    spawnBuild?:boolean;
  }
}
