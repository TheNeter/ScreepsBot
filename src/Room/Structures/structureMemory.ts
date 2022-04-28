export{}
export class RoomFlags{
  static STRUC_HIVE_LINK : "1";
  static STRUC_HIVE_SPAWN : "2";
  static STRUC_HIVE_TOWER : "3";
  static STRUC_CONTROLLER_LINK : "4";
  static STRUC_SOURCE_LINK : "5";
}
declare global{

    interface RoomMemory{
        RefillStructure:{[ID:string]:RefillMemory},
        ActionStructures?:ActionStructures;
        [x: string]: any;
    }
    interface ActionStructures{
      HiveTower?:string,
      HiveLink?:string,
      HiveSpawn?:string,
      HiveLab?:string,
      ControllerLink?:string,
      TowerTopLeft?:string,
      TowerTopRight?:string,
      TowerBottomLeft?:string,
      TowerBottomRight?:string,
      TowerMid?:string,
      Factory?:string,
      Terminal?:string,
      Sources?:{[id:string]:SourceData}
    }
    interface SourceData{
      Link?: string,
      Container?: string
    }
    interface RefillMemory{
        Ammount:number;
        RessourceTyp:string;
        GoalAmmount:number;
        /**
         * 1 = In - Befülle diese Structure
         * 2 = Out - Entnehme aus dieser Structure
         */
        Direction:number;
    }
}
