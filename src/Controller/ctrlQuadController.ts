import { QuadAttack } from './../Room/CombatSystems/QuadSquadPathfinding';
export class QuadController{
    public static Run():void{
        var Leader = Game.creeps[QuadAttack.Creep_BottomRight];
        var Member1 = Game.creeps[QuadAttack.Creep_BottomLeft];
        var Member2 = Game.creeps[QuadAttack.Creep_TopRight];
        var Member3 = Game.creeps[QuadAttack.Creep_TopLeft];

    }

    public static FindLeader():string{
        var Member0 = Game.creeps[QuadAttack.Creep_BottomRight];
        var Member1 = Game.creeps[QuadAttack.Creep_BottomLeft];
        var Member2 = Game.creeps[QuadAttack.Creep_TopRight];
        var Member3 = Game.creeps[QuadAttack.Creep_TopLeft];
        if(Member0.pos.getDirectionTo(Member1.pos) == TOP_LEFT)
        {

        }
    }
}
