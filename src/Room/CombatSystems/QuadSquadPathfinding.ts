import { filter } from 'lodash';

export class QuadAttack
{
    static badPositions:{[x:string]:RoomPosition[]} = {};
    static fromRoom:string = "";
    static toRoom:string = "";
    /**
     * 0 Group after Spawn
     * 1 Move To Room
     * 2 Group in the room before Destination
     * 4 Group in Room
     * 5 Travel to Destination
     */
    static Status : number = 0;

    /**
     * Leader Creep - Bottom Right
     */
    static Creep_BottomRight : string = "";
    static Creep_BottomLeft : string = "";
    static Creep_TopRight : string = "";
    static Creep_TopLeft : string = "";
}

export class QuadSquadPath{
    roomTerrain:RoomTerrain;
    room:Room;

    static badPositions:{[x:string]:RoomPosition[]} = {};
    constructor(pRoom:string)
    {
        this.room = Game.rooms[pRoom];
        this.roomTerrain = this.room.getTerrain();
    }
    isWall(x:number,y:number):boolean{
        if(this.roomTerrain.get(x,y) == TERRAIN_MASK_WALL)
        {
            return true;
        }
        else
        {
            var userStructures = this.room.lookForAt(LOOK_STRUCTURES,x,y);
            for(var usrStruc of userStructures)
            {
                if(usrStruc.structureType == STRUCTURE_WALL || usrStruc.structureType == STRUCTURE_RAMPART)
                {
                    return true;
                }
            }
        }
        return false;
    }
    analyseRoom():void{
        if(QuadSquadPath.badPositions[this.room.name] == undefined)
        {
            QuadSquadPath.badPositions[this.room.name] = []
        }
        for(var x = 1; x < 49;x++)
        {
            for(var y = 1; y < 49; y++)
            {
                if(this.roomTerrain.get(x,y) != TERRAIN_MASK_WALL)
                {
                    var badPos: RoomPosition | undefined = undefined;
                    if(this.isWall(x-1,y-1) && !this.isWall(x,y-1))
                    {
                        badPos = new RoomPosition(x,y,this.room.name);
                    }
                    if(this.isWall(x-1,y))
                    {
                        badPos = new RoomPosition(x,y,this.room.name);
                    }
                    if(this.isWall(x,y-1))
                    {
                        badPos = new RoomPosition(x,y,this.room.name);
                    }
                    if(this.isWall(x,y))
                    {
                        badPos = new RoomPosition(x,y,this.room.name);
                    }
                    else if(this.isWall(x-1,y) && this.isWall(x+1,y))
                    {
                        badPos = new RoomPosition(x,y,this.room.name);
                    }
                    else if(this.isWall(x,y-1) && this.isWall(x,y+1) && !this.isWall(x+1,y+1))
                    {
                        badPos = new RoomPosition(x,y,this.room.name);
                    }
                    if(badPos != undefined)
                    {
                        if(QuadSquadPath.badPositions[this.room.name].find((x)=>{
                            if(x == badPos)
                                return true;
                            return false;
                        }) == undefined )
                        {
                            QuadSquadPath.badPositions[this.room.name].push(badPos);
                        }
                    }
                }
                else
                {
                }
            }
        }
        var tmpRoom = this.room;
        var path = new RoomPosition(15,1,tmpRoom.name).findPathTo(30,34,{
            costCallback: function(rName,Matrix){
                if(rName ==tmpRoom.name)
                {
                    for(var bp of QuadSquadPath.badPositions[tmpRoom.name])
                    {
                        Matrix.set(bp.x,bp.y,255);
                    }
                }
            }
        });

        for(var point of path)
        {
            var xOff = 0;
            var yOff = 0;

            if(point.direction == TOP)
            {
                xOff = 0;
                yOff = -1;
            }
            else if(point.direction == TOP_RIGHT)
            {
                xOff = 1;
                yOff = -1;
            }
            else if(point.direction == RIGHT)
            {
                xOff = 1;
                yOff = 0;
            }
            else if(point.direction == BOTTOM_RIGHT)
            {
                xOff = 1;
                yOff = 1;
            }
            else if(point.direction == BOTTOM)
            {
                xOff = 0;
                yOff = 1;
            }
            else if(point.direction == BOTTOM_LEFT)
            {
                xOff = -1;
                yOff = 1;
            }
            else if(point.direction == LEFT)
            {
                xOff = 0;
                yOff = -1;
            }
            else if(point.direction == TOP_LEFT)
            {
                xOff = -1;
                yOff = -1;
            }
            this.room.visual.rect(point.x-0.5,point.y-0.5,1,1);
        }
    }
}
