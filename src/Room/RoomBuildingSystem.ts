import { Console, dirxml } from "console";
import { RSA_X931_PADDING, SIGXCPU } from "constants";
import { filter, object } from "lodash";
import { _roomCache } from "Room/RoomCache";
import { Traveler } from "traveler";

//https://screeps.admon.dev/building-planner/?share=N4IgdghgtgpiBcIQBoQHcD2AnANgEwRCigxRAGcALCLAxKmvABjKwGMcEAOVAIwFcAlvkFgA5uQSgYADwAuMMOUEYwUkAAcMk+AG1QMhACYmqAJ4IAjABYAvsgPHTIC-EsBme4-hHL5q54OIIY+fi5WRl7Bxkb+bpFBIUax4W6WUUnucZbpicZZqZZMGcbW2cV5Ps6ulgBsJVXZAOwNvs2tYTVcrSldPdkAnK0FNUOVRiNOrWWpJq21cXPjTYsV3kYrhWPrPFutu33jA9ndR+2V7tVWLRdXbvW32XaPhYHrx6+tHzUJO9m-0R8BysuXWmxqoMBG3K8xh4xmh3WC0Kp28lm+11ad0sqKhnSs2yhvSm40moVa4OMkKSwKqX0GDUuJ0Z+LcNzB53WZMs7MB7lZHkZ2IBSQxaX2cI5qUJmTiMpikrx2WpTn+DXR2U8AF17CAsBgIHRQFodPooQBWVawvbLZnjWk8+mFB7eJmFc1OmrPP6fW2FEXGZEQ1qWwprKEIkHDNXjYluN5KwreqHYj3jAUuomcqHc3FJSNueU+Sk+ANAxYqnxipau7FF-l211xx0XZsJkIN-1C5WeqzhmlyilxPMExsphnpq2xivR2Zloyh1zJRnNtPrRfcaZPWc1duB7d+3db90h7KZpJBqxriPZ2XO601XlJEt1U++tEOp9WB3XkI4zXqmKljztilZtGGO6bhcGYsgeaJAcmf5AeepSDuMl7wEWRgYb4x5LmBcZDDqqByBgaAwFg6gmggZpJBu5LQdkv7GPRRYaie4z0TYb6PrYxEUBoEBoGo8DGtoNHrAKzE+Fx0lGEBHr8eQpFYBAYhwKJmjiXo64MvxChYFAogQJwmnUTpWb3vxshyKpbAqVR2m6PxABmED2dgrhiaa6yrnxuoYLw5AUQAbhRjk+ZZXr+agWjkVgADKgnCRFEk5tu-FgPwADW4VmU5XJMTFIA4BAvCpRZdE9pxMZIrVN5dvCAHoc1UrRYeV4ShxPrRfxbCqHIECiHl3lpfmZ4PlY9T8apUCCVgcgVbRqrvomPz9IUYHcv2qEQaS1W+fVSQCnujRJoBRX7bMO0+AWNbpTah2PVF34dGOx23itvHjNiKFnTUckCohCqrUkzbA6Wl2SVDL33G995Xd9T1Iw9NR-UYBYtoVKJ4a9TXPVVBMsVOumzGBOE3dCRPFiTUIOlhDojlW73GEBX7wG6KMdr9k2FkOOP2p9zMI7WMPPkLVNo7zOI8XjdWFOz2ETfjUs1SLFpi8T50td1UIYdxHVuHJL4Q0YDqmz+vZG1bBui9rdtHmcoOs0dxgOvODpgS+XuKoTNSU-rlOsdLYFcWBmNba7PjcqdExwajnUq4n6yY6bmOx5j85cVnrV67nF5R5LET847PUBLButIfnX3F5Om0bf7kGYSXCAM77Lv1y862Mc7HMCuznNy1CQFt9dLcMdj+ENyS0PUyYLOFu0-E4KI2VLaTfQ6rYthAA
//{"name":"","world":"mmo","shard":"shard0","rcl":8,"buildings":{"extension":{"pos":[{"x":20,"y":14},{"x":20,"y":13},{"x":21,"y":13},{"x":21,"y":12},{"x":22,"y":11},{"x":23,"y":11},{"x":24,"y":10},{"x":20,"y":16},{"x":20,"y":17},{"x":21,"y":17},{"x":21,"y":18},{"x":22,"y":19},{"x":23,"y":19},{"x":23,"y":20},{"x":24,"y":20},{"x":26,"y":20},{"x":27,"y":20},{"x":27,"y":19},{"x":28,"y":19},{"x":29,"y":18},{"x":29,"y":17},{"x":30,"y":17},{"x":30,"y":16},{"x":30,"y":14},{"x":29,"y":13},{"x":24,"y":18},{"x":27,"y":17},{"x":23,"y":17},{"x":24,"y":12},{"x":25,"y":12},{"x":25,"y":11},{"x":26,"y":12},{"x":26,"y":13},{"x":27,"y":15},{"x":28,"y":15},{"x":28,"y":16},{"x":28,"y":14},{"x":27,"y":11},{"x":26,"y":10},{"x":30,"y":13},{"x":29,"y":12},{"x":28,"y":11},{"x":27,"y":10},{"x":23,"y":16},{"x":23,"y":10},{"x":26,"y":16},{"x":25,"y":19},{"x":25,"y":18},{"x":27,"y":16},{"x":26,"y":18},{"x":27,"y":13},{"x":22,"y":14},{"x":23,"y":14},{"x":22,"y":16},{"x":26,"y":17},{"x":24,"y":16}]},"road":{"pos":[{"x":25,"y":20},{"x":26,"y":19},{"x":27,"y":18},{"x":28,"y":17},{"x":29,"y":16},{"x":30,"y":15},{"x":29,"y":14},{"x":28,"y":13},{"x":27,"y":12},{"x":26,"y":11},{"x":25,"y":10},{"x":24,"y":11},{"x":23,"y":12},{"x":22,"y":13},{"x":21,"y":14},{"x":20,"y":15},{"x":21,"y":16},{"x":22,"y":17},{"x":23,"y":18},{"x":24,"y":19},{"x":23,"y":13},{"x":25,"y":16},{"x":24,"y":17},{"x":24,"y":14},{"x":26,"y":15},{"x":27,"y":14}]},"tower":{"pos":[{"x":25,"y":17},{"x":22,"y":12},{"x":28,"y":12},{"x":28,"y":18},{"x":22,"y":18},{"x":25,"y":13}]},"spawn":{"pos":[{"x":21,"y":15},{"x":29,"y":15},{"x":25,"y":14}]},"storage":{"pos":[{"x":25,"y":15}]},"terminal":{"pos":[{"x":24,"y":13}]},"extractor":{"pos":[]},"factory":{"pos":[]},"observer":{"pos":[]},"powerSpawn":{"pos":[{"x":22,"y":15}]},"nuker":{"pos":[{"x":23,"y":15}]},"lab":{"pos":[{"x":26,"y":14}]},"container":{"pos":[]},"rampart":{"pos":[{"x":20,"y":13},{"x":21,"y":12},{"x":22,"y":11},{"x":24,"y":10},{"x":23,"y":11},{"x":21,"y":13},{"x":20,"y":14},{"x":23,"y":20},{"x":24,"y":20},{"x":23,"y":19},{"x":22,"y":19},{"x":21,"y":18},{"x":21,"y":17},{"x":20,"y":17},{"x":20,"y":16},{"x":20,"y":15},{"x":21,"y":14},{"x":22,"y":13},{"x":21,"y":15},{"x":21,"y":16},{"x":23,"y":17},{"x":22,"y":17},{"x":23,"y":16},{"x":24,"y":17},{"x":23,"y":18},{"x":24,"y":18},{"x":24,"y":19},{"x":25,"y":20},{"x":26,"y":20},{"x":27,"y":19},{"x":27,"y":20},{"x":28,"y":19},{"x":29,"y":18},{"x":29,"y":17},{"x":30,"y":17},{"x":30,"y":16},{"x":26,"y":19},{"x":27,"y":18},{"x":28,"y":17},{"x":29,"y":16},{"x":30,"y":15},{"x":27,"y":17},{"x":25,"y":16},{"x":29,"y":15},{"x":29,"y":14},{"x":30,"y":14},{"x":29,"y":13},{"x":25,"y":10},{"x":26,"y":11},{"x":24,"y":11},{"x":23,"y":12},{"x":23,"y":13},{"x":27,"y":12},{"x":28,"y":13},{"x":22,"y":12},{"x":22,"y":14},{"x":22,"y":15},{"x":22,"y":16},{"x":22,"y":18},{"x":23,"y":15},{"x":23,"y":14},{"x":24,"y":15},{"x":25,"y":15},{"x":25,"y":13},{"x":24,"y":13},{"x":24,"y":14},{"x":24,"y":12},{"x":25,"y":12},{"x":25,"y":11},{"x":26,"y":12},{"x":26,"y":13},{"x":27,"y":13},{"x":27,"y":14},{"x":26,"y":15},{"x":26,"y":16},{"x":26,"y":18},{"x":25,"y":18},{"x":25,"y":19},{"x":25,"y":17},{"x":28,"y":16},{"x":27,"y":16},{"x":27,"y":15},{"x":28,"y":15},{"x":28,"y":14},{"x":28,"y":12},{"x":29,"y":12},{"x":30,"y":13},{"x":28,"y":11},{"x":27,"y":11},{"x":27,"y":10},{"x":26,"y":10},{"x":23,"y":10},{"x":28,"y":18},{"x":25,"y":14},{"x":26,"y":17},{"x":24,"y":16},{"x":26,"y":14}]},"link":{"pos":[{"x":24,"y":15}]}}}
//https://screeps.admon.dev/building-planner/?share=N4IgdghgtgpiBcIQBoQHcD2AnANgEwRCigxRAGcALCLAxKmvABjKwGMcEAOVAIwFcAlvkFgA5uQSgYADwAuMMOUEYwUkAAcMk+AG1QMhACYALKgCexpgF9kB4wGYLV2-fhGnIS-ACMATlcQQ3cjZ18AuyDjHzCfLkDgoxivBB8AdgSrWIzIxKZYgDZM93yU3xNio1LvHwdK5Jq63OjYo0rQsp8fSs8a7ub3XtSbAdNYkbcjAvHKtJnRuc7+yZ4lyr9W9dimtwdq1J2o+D3YioGTzqLz-d8cyY3Ou6OjB5r40dWaiMnFr9mwqqVaZlQGjACssW+zwhnXekzMsKBsThz1+qSeiWBNSuP0KlU+qRxzwJvjB-06ZI+px62Rpl3aeNGHRqZ0mQ3KlRhLKRnVZzyxB3JjR5NTa4M2owRos5sW6AF1bCAsBgIHRQFodPp+ZChakUYkSektvTrrFKfdqVTOodEmjfGLJgLfMtofN4bK6dKmdtPYLJZbJg1Uny8mb6ozJsz0b7fPrjFLUlDElyXP7HjKTY6wwtqQrUHIMGgYFh1BqEFrk7TxdaGYjvZ0HcSJStkdY8xQNBA0Gp4OrtOWs+nRkHScaamT2+QC1gIGI4L3NP29JMU6P2wosFBRBBOAuy8vngnfHV27I5DO2NPS0vdO2AGYQS-Ybx9zXtjC8cjFgBuxevb8VLQiywABlTtu3-AdnijNdFTAfgAGs-z3G82TDdscAgXhIIPRIjx8Ip2zYVQ5AgURkNfct2xnKBOywOQcNvRUcFEBDGPdCk22sbigA

declare global {


  interface RoomBuildingPlan{
    Typ:string,
    X:number,
    Y:number,
  }

  interface RoomMemory {
    BuldingPlan?: buildingPlan[];
    StorageEnergy02?: number;
    StorageEnergy01?: number;
    buildingInformation: BuildingInformation;
  }
  interface BuildingInformation {
    CenterX:number,
    CenterY:number
    LevelDone?:number;
  }
  interface buildingPlan {
    X: number,
    Y: number,
    Structure: string,
    ConnectionRound?: boolean,
    ConnectionPoint?: boolean,
    Done: boolean,
    buildingID?: string,
    Placed: boolean,
    constructionID?: string,
    SourceLink?: string,
    SourceContainer?: string,
    MineralContainer?: boolean
  }
}

interface roomDesign {

}
export interface Pos {
  "x": number;
  "y": number;
  "roadConnectionPoint"?: boolean;
}
export interface Buildings {
  pos: Pos[];
}

export interface RootObject {
  name: string;
  world: string;
  shard: string;
  rcl: number;
  buildings: { [key: string]: Buildings };
}
export class RoomPlans {
  public static room: RootObject = { "name": "", "world": "mmo", "shard": "shard0", "rcl": 8, "buildings": { "extension": { "pos": [{ "x": 20, "y": 14 }, { "x": 20, "y": 13 }, { "x": 21, "y": 13 }, { "x": 21, "y": 12 }, { "x": 22, "y": 12 }, { "x": 22, "y": 11 }, { "x": 23, "y": 11 }, { "x": 23, "y": 10 }, { "x": 24, "y": 10 }, { "x": 20, "y": 16 }, { "x": 20, "y": 17 }, { "x": 21, "y": 17 }, { "x": 21, "y": 18 }, { "x": 22, "y": 18 }, { "x": 22, "y": 19 }, { "x": 23, "y": 19 }, { "x": 23, "y": 20 }, { "x": 24, "y": 20 }, { "x": 26, "y": 20 }, { "x": 27, "y": 20 }, { "x": 27, "y": 19 }, { "x": 28, "y": 19 }, { "x": 28, "y": 18 }, { "x": 29, "y": 18 }, { "x": 29, "y": 17 }, { "x": 30, "y": 17 }, { "x": 30, "y": 16 }, { "x": 30, "y": 14 }, { "x": 30, "y": 13 }, { "x": 29, "y": 13 }, { "x": 29, "y": 12 }, { "x": 28, "y": 12 }, { "x": 28, "y": 11 }, { "x": 27, "y": 11 }, { "x": 27, "y": 10 }, { "x": 26, "y": 10 }, { "x": 24, "y": 18 }, { "x": 26, "y": 18 }, { "x": 19, "y": 17 }, { "x": 20, "y": 18 }, { "x": 21, "y": 19 }, { "x": 22, "y": 20 }, { "x": 23, "y": 21 }, { "x": 27, "y": 21 }, { "x": 28, "y": 20 }, { "x": 29, "y": 19 }, { "x": 30, "y": 18 }, { "x": 31, "y": 17 }, { "x": 27, "y": 17 }, { "x": 23, "y": 17 }, { "x": 31, "y": 13 }, { "x": 30, "y": 12 }, { "x": 29, "y": 11 }, { "x": 28, "y": 10 }, { "x": 27, "y": 9 }, { "x": 23, "y": 9 }, { "x": 22, "y": 10 }, { "x": 21, "y": 11 }, { "x": 20, "y": 12 }, { "x": 19, "y": 13 }] }, "road": { "pos": [{ "x": 25, "y": 20 }, { "x": 26, "y": 19 }, { "x": 27, "y": 18 }, { "x": 28, "y": 17 }, { "x": 29, "y": 16 }, { "x": 30, "y": 15 }, { "x": 29, "y": 14 }, { "x": 28, "y": 13 }, { "x": 27, "y": 12 }, { "x": 26, "y": 11 }, { "x": 25, "y": 10 }, { "x": 24, "y": 11 }, { "x": 23, "y": 12 }, { "x": 22, "y": 13 }, { "x": 21, "y": 14 }, { "x": 20, "y": 15 }, { "x": 21, "y": 16 }, { "x": 22, "y": 17 }, { "x": 23, "y": 18 }, { "x": 24, "y": 19 }, { "x": 27, "y": 22 }, { "x": 28, "y": 21 }, { "x": 29, "y": 20 }, { "x": 30, "y": 19 }, { "x": 31, "y": 18 }, { "x": 32, "y": 17 }, { "x": 32, "y": 13 }, { "x": 31, "y": 12 }, { "x": 30, "y": 11 }, { "x": 29, "y": 10 }, { "x": 28, "y": 9 }, { "x": 27, "y": 8 }, { "x": 19, "y": 18 }, { "x": 20, "y": 19 }, { "x": 21, "y": 20 }, { "x": 22, "y": 21 }, { "x": 23, "y": 22 }, { "x": 25, "y": 22 }, { "x": 32, "y": 15 }, { "x": 25, "y": 8 }, { "x": 24, "y": 14 }, { "x": 23, "y": 13 }, { "x": 26, "y": 14 }, { "x": 27, "y": 13 }, { "x": 24, "y": 15 }, { "x": 25, "y": 16 }, { "x": 26, "y": 15 }, { "x": 24, "y": 17 }, { "x": 23, "y": 16 }, { "x": 26, "y": 17 }, { "x": 27, "y": 16 }, { "x": 25, "y": 13 }, { "x": 18, "y": 17 }, { "x": 18, "y": 15 }, { "x": 18, "y": 13 }, { "x": 19, "y": 12 }, { "x": 20, "y": 11 }, { "x": 21, "y": 10 }, { "x": 23, "y": 8 }, { "x": 31, "y": 16 }, { "x": 31, "y": 14 }, { "x": 19, "y": 14 }, { "x": 19, "y": 16 }, { "x": 24, "y": 9 }, { "x": 26, "y": 9 }, { "x": 26, "y": 21 }, { "x": 24, "y": 21 }, { "x": 22, "y": 9 }] }, "tower": { "pos": [{ "x": 25, "y": 21 }, { "x": 31, "y": 15 }, { "x": 25, "y": 9 }, { "x": 19, "y": 15 }, { "x": 25, "y": 14 }, { "x": 25, "y": 17 }] }, "spawn": { "pos": [{ "x": 21, "y": 15 }, { "x": 25, "y": 15 }, { "x": 29, "y": 15 }] }, "storage": { "pos": [{ "x": 25, "y": 19 }] }, "terminal": { "pos": [{ "x": 22, "y": 16 }] }, "extractor": { "pos": [] }, "factory": { "pos": [{ "x": 22, "y": 15 }] }, "observer": { "pos": [{ "x": 22, "y": 14 }] }, "powerSpawn": { "pos": [{ "x": 23, "y": 14 }] }, "nuker": { "pos": [{ "x": 23, "y": 15 }] }, "lab": { "pos": [{ "x": 25, "y": 11 }, { "x": 25, "y": 12 }, { "x": 26, "y": 12 }, { "x": 24, "y": 12 }, { "x": 24, "y": 13 }, { "x": 26, "y": 13 }, { "x": 27, "y": 14 }, { "x": 27, "y": 15 }, { "x": 28, "y": 15 }, { "x": 28, "y": 14 }] }, "container": { "pos": [{ "x": 24, "y": 16 }, { "x": 26, "y": 16 }] }, "rampart": { "pos": [{ "x": 20, "y": 13 }, { "x": 21, "y": 12 }, { "x": 22, "y": 11 }, { "x": 23, "y": 10 }, { "x": 24, "y": 10 }, { "x": 23, "y": 11 }, { "x": 22, "y": 12 }, { "x": 21, "y": 13 }, { "x": 20, "y": 14 }, { "x": 19, "y": 15 }, { "x": 23, "y": 20 }, { "x": 24, "y": 20 }, { "x": 23, "y": 19 }, { "x": 22, "y": 19 }, { "x": 22, "y": 18 }, { "x": 21, "y": 18 }, { "x": 21, "y": 17 }, { "x": 20, "y": 17 }, { "x": 20, "y": 16 }, { "x": 20, "y": 15 }, { "x": 21, "y": 14 }, { "x": 22, "y": 13 }, { "x": 22, "y": 14 }, { "x": 22, "y": 15 }, { "x": 21, "y": 15 }, { "x": 22, "y": 16 }, { "x": 21, "y": 16 }, { "x": 23, "y": 17 }, { "x": 22, "y": 17 }, { "x": 23, "y": 16 }, { "x": 24, "y": 17 }, { "x": 23, "y": 18 }, { "x": 24, "y": 18 }, { "x": 24, "y": 19 }, { "x": 25, "y": 19 }, { "x": 25, "y": 20 }, { "x": 25, "y": 21 }, { "x": 26, "y": 20 }, { "x": 27, "y": 19 }, { "x": 27, "y": 20 }, { "x": 28, "y": 19 }, { "x": 28, "y": 18 }, { "x": 29, "y": 18 }, { "x": 29, "y": 17 }, { "x": 30, "y": 17 }, { "x": 30, "y": 16 }, { "x": 26, "y": 19 }, { "x": 27, "y": 18 }, { "x": 28, "y": 17 }, { "x": 29, "y": 16 }, { "x": 30, "y": 15 }, { "x": 27, "y": 17 }, { "x": 27, "y": 16 }, { "x": 26, "y": 18 }, { "x": 25, "y": 18 }, { "x": 26, "y": 17 }, { "x": 26, "y": 16 }, { "x": 24, "y": 16 }, { "x": 25, "y": 16 }, { "x": 25, "y": 15 }, { "x": 25, "y": 14 }, { "x": 26, "y": 15 }, { "x": 26, "y": 14 }, { "x": 27, "y": 15 }, { "x": 27, "y": 14 }, { "x": 28, "y": 14 }, { "x": 28, "y": 15 }, { "x": 29, "y": 15 }, { "x": 29, "y": 14 }, { "x": 30, "y": 14 }, { "x": 30, "y": 13 }, { "x": 29, "y": 13 }, { "x": 29, "y": 12 }, { "x": 28, "y": 12 }, { "x": 28, "y": 11 }, { "x": 27, "y": 11 }, { "x": 27, "y": 10 }, { "x": 25, "y": 10 }, { "x": 26, "y": 10 }, { "x": 25, "y": 9 }, { "x": 26, "y": 11 }, { "x": 25, "y": 11 }, { "x": 24, "y": 11 }, { "x": 23, "y": 12 }, { "x": 23, "y": 13 }, { "x": 23, "y": 14 }, { "x": 23, "y": 15 }, { "x": 24, "y": 15 }, { "x": 24, "y": 14 }, { "x": 24, "y": 13 }, { "x": 24, "y": 12 }, { "x": 25, "y": 12 }, { "x": 25, "y": 13 }, { "x": 26, "y": 13 }, { "x": 26, "y": 12 }, { "x": 27, "y": 12 }, { "x": 27, "y": 13 }, { "x": 28, "y": 13 }, { "x": 31, "y": 15 }, { "x": 19, "y": 13 }, { "x": 20, "y": 12 }, { "x": 21, "y": 11 }, { "x": 22, "y": 10 }, { "x": 23, "y": 9 }, { "x": 27, "y": 9 }, { "x": 28, "y": 10 }, { "x": 29, "y": 11 }, { "x": 30, "y": 12 }, { "x": 31, "y": 13 }, { "x": 31, "y": 17 }, { "x": 30, "y": 18 }, { "x": 29, "y": 19 }, { "x": 28, "y": 20 }, { "x": 27, "y": 21 }, { "x": 23, "y": 21 }, { "x": 22, "y": 20 }, { "x": 21, "y": 19 }, { "x": 20, "y": 18 }, { "x": 19, "y": 17 }, { "x": 25, "y": 17 }] }, "link": { "pos": [{ "x": 25, "y": 18 }] } } }
  public static room2: RootObject = {"name":"","world":"mmo","shard":"shard0","rcl":8,"buildings":{"extension":{"pos":[{"x":24,"y":20},{"x":23,"y":20},{"x":23,"y":19},{"x":22,"y":19},{"x":21,"y":18},{"x":21,"y":17},{"x":20,"y":17},{"x":20,"y":16},{"x":20,"y":14},{"x":20,"y":13},{"x":21,"y":13},{"x":21,"y":12},{"x":22,"y":11},{"x":23,"y":11},{"x":23,"y":10},{"x":24,"y":10},{"x":26,"y":10},{"x":27,"y":10},{"x":27,"y":11},{"x":29,"y":12},{"x":29,"y":13},{"x":30,"y":13},{"x":30,"y":14},{"x":30,"y":16},{"x":30,"y":17},{"x":29,"y":17},{"x":29,"y":18},{"x":28,"y":19},{"x":27,"y":19},{"x":27,"y":20},{"x":26,"y":20},{"x":25,"y":19},{"x":25,"y":18},{"x":24,"y":18},{"x":26,"y":18},{"x":27,"y":17},{"x":26,"y":16},{"x":28,"y":16},{"x":28,"y":15},{"x":27,"y":15},{"x":28,"y":14},{"x":23,"y":17},{"x":23,"y":16},{"x":22,"y":16},{"x":26,"y":14},{"x":26,"y":13},{"x":27,"y":13},{"x":26,"y":12},{"x":25,"y":12},{"x":25,"y":11},{"x":24,"y":16},{"x":29,"y":15},{"x":21,"y":15},{"x":26,"y":17},{"x":22,"y":14},{"x":28,"y":11}]},"road":{"pos":[{"x":26,"y":19},{"x":27,"y":18},{"x":28,"y":17},{"x":29,"y":16},{"x":30,"y":15},{"x":29,"y":14},{"x":28,"y":13},{"x":27,"y":12},{"x":26,"y":11},{"x":25,"y":10},{"x":24,"y":11},{"x":23,"y":12},{"x":22,"y":13},{"x":21,"y":14},{"x":20,"y":15},{"x":21,"y":16},{"x":22,"y":17},{"x":23,"y":18},{"x":24,"y":19},{"x":25,"y":20},{"x":24,"y":17},{"x":25,"y":16},{"x":26,"y":15},{"x":27,"y":14}]},"tower":{"pos":[{"x":25,"y":17},{"x":25,"y":13},{"x":22,"y":18},{"x":22,"y":12},{"x":28,"y":12},{"x":28,"y":18}]},"spawn":{"pos":[{"x":27,"y":16},{"x":23,"y":14},{"x":24,"y":12}]},"storage":{"pos":[{"x":25,"y":15}]},"terminal":{"pos":[{"x":24,"y":13}]},"extractor":{"pos":[]},"factory":{"pos":[{"x":25,"y":14}]},"observer":{"pos":[]},"powerSpawn":{"pos":[{"x":22,"y":15}]},"nuker":{"pos":[{"x":23,"y":15}]},"lab":{"pos":[{"x":23,"y":13}]},"container":{"pos":[]},"rampart":{"pos":[]},"link":{"pos":[{"x":24,"y":15}]},"constructedWall":{"pos":[{"x":25,"y":7},{"x":24,"y":7},{"x":26,"y":7},{"x":27,"y":7},{"x":33,"y":10},{"x":33,"y":9},{"x":33,"y":8},{"x":33,"y":7},{"x":32,"y":7},{"x":30,"y":7},{"x":29,"y":7},{"x":28,"y":7},{"x":33,"y":14},{"x":33,"y":16},{"x":33,"y":15},{"x":33,"y":13},{"x":33,"y":12},{"x":33,"y":11},{"x":31,"y":7},{"x":33,"y":18},{"x":33,"y":19},{"x":33,"y":20},{"x":33,"y":21},{"x":33,"y":22},{"x":33,"y":17},{"x":28,"y":23},{"x":29,"y":23},{"x":30,"y":23},{"x":31,"y":23},{"x":32,"y":23},{"x":33,"y":23},{"x":24,"y":23},{"x":21,"y":23},{"x":20,"y":23},{"x":18,"y":23},{"x":19,"y":23},{"x":22,"y":23},{"x":23,"y":23},{"x":25,"y":23},{"x":26,"y":23},{"x":27,"y":23},{"x":17,"y":20},{"x":17,"y":23},{"x":17,"y":22},{"x":17,"y":21},{"x":17,"y":19},{"x":17,"y":18},{"x":17,"y":17},{"x":17,"y":16},{"x":17,"y":15},{"x":17,"y":14},{"x":17,"y":13},{"x":17,"y":12},{"x":17,"y":11},{"x":17,"y":10},{"x":17,"y":9},{"x":17,"y":8},{"x":17,"y":7},{"x":18,"y":7},{"x":19,"y":7},{"x":20,"y":7},{"x":21,"y":7},{"x":22,"y":7},{"x":23,"y":7}]}}}
  public static roomLayout: RoomBuildingPlan[] = [{"Typ":"extension","X":-1,"Y":5},{"Typ":"extension","X":-2,"Y":5},{"Typ":"extension","X":-2,"Y":4},{"Typ":"extension","X":-3,"Y":4},{"Typ":"extension","X":-4,"Y":3},{"Typ":"extension","X":-4,"Y":2},{"Typ":"extension","X":-5,"Y":2},{"Typ":"extension","X":-5,"Y":1},{"Typ":"extension","X":-5,"Y":-1},{"Typ":"extension","X":-5,"Y":-2},{"Typ":"extension","X":-4,"Y":-2},{"Typ":"extension","X":-4,"Y":-3},{"Typ":"extension","X":-3,"Y":-4},{"Typ":"extension","X":-2,"Y":-4},{"Typ":"extension","X":-2,"Y":-5},{"Typ":"extension","X":-1,"Y":-5},{"Typ":"extension","X":1,"Y":-5},{"Typ":"extension","X":2,"Y":-5},{"Typ":"extension","X":2,"Y":-4},{"Typ":"extension","X":4,"Y":-3},{"Typ":"extension","X":4,"Y":-2},{"Typ":"extension","X":5,"Y":-2},{"Typ":"extension","X":5,"Y":-1},{"Typ":"extension","X":5,"Y":1},{"Typ":"extension","X":5,"Y":2},{"Typ":"extension","X":4,"Y":2},{"Typ":"extension","X":4,"Y":3},{"Typ":"extension","X":3,"Y":4},{"Typ":"extension","X":2,"Y":4},{"Typ":"extension","X":2,"Y":5},{"Typ":"extension","X":1,"Y":5},{"Typ":"extension","X":0,"Y":4},{"Typ":"extension","X":0,"Y":3},{"Typ":"extension","X":-1,"Y":3},{"Typ":"extension","X":1,"Y":3},{"Typ":"extension","X":2,"Y":2},{"Typ":"extension","X":1,"Y":1},{"Typ":"extension","X":3,"Y":1},{"Typ":"extension","X":3,"Y":0},{"Typ":"extension","X":2,"Y":0},{"Typ":"extension","X":3,"Y":-1},{"Typ":"extension","X":-2,"Y":2},{"Typ":"extension","X":-2,"Y":1},{"Typ":"extension","X":-3,"Y":1},{"Typ":"extension","X":1,"Y":-1},{"Typ":"extension","X":1,"Y":-2},{"Typ":"extension","X":2,"Y":-2},{"Typ":"extension","X":1,"Y":-3},{"Typ":"extension","X":0,"Y":-3},{"Typ":"extension","X":0,"Y":-4},{"Typ":"extension","X":-1,"Y":1},{"Typ":"extension","X":4,"Y":0},{"Typ":"extension","X":-4,"Y":0},{"Typ":"extension","X":1,"Y":2},{"Typ":"extension","X":-3,"Y":-1},{"Typ":"extension","X":3,"Y":-4},{"Typ":"road","X":1,"Y":4},{"Typ":"road","X":2,"Y":3},{"Typ":"road","X":3,"Y":2},{"Typ":"road","X":4,"Y":1},{"Typ":"road","X":5,"Y":0},{"Typ":"road","X":4,"Y":-1},{"Typ":"road","X":3,"Y":-2},{"Typ":"road","X":2,"Y":-3},{"Typ":"road","X":1,"Y":-4},{"Typ":"road","X":0,"Y":-5},{"Typ":"road","X":-1,"Y":-4},{"Typ":"road","X":-2,"Y":-3},{"Typ":"road","X":-3,"Y":-2},{"Typ":"road","X":-4,"Y":-1},{"Typ":"road","X":-5,"Y":0},{"Typ":"road","X":-4,"Y":1},{"Typ":"road","X":-3,"Y":2},{"Typ":"road","X":-2,"Y":3},{"Typ":"road","X":-1,"Y":4},{"Typ":"road","X":0,"Y":5},{"Typ":"road","X":-1,"Y":2},{"Typ":"road","X":0,"Y":1},{"Typ":"road","X":1,"Y":0},{"Typ":"road","X":2,"Y":-1},{"Typ":"tower","X":0,"Y":2},{"Typ":"tower","X":0,"Y":-2},{"Typ":"tower","X":-3,"Y":3},{"Typ":"tower","X":-3,"Y":-3},{"Typ":"tower","X":3,"Y":-3},{"Typ":"tower","X":3,"Y":3},{"Typ":"spawn","X":2,"Y":1},{"Typ":"spawn","X":-2,"Y":-1},{"Typ":"spawn","X":-1,"Y":-3},{"Typ":"storage","X":0,"Y":0},{"Typ":"terminal","X":-1,"Y":-2},{"Typ":"factory","X":0,"Y":-1},{"Typ":"powerSpawn","X":-3,"Y":0},{"Typ":"nuker","X":-2,"Y":0},{"Typ":"lab","X":-2,"Y":-2},{"Typ":"link","X":-1,"Y":0},{"Typ":"constructedWall","X":0,"Y":-8},{"Typ":"constructedWall","X":-1,"Y":-8},{"Typ":"constructedWall","X":1,"Y":-8},{"Typ":"constructedWall","X":2,"Y":-8},{"Typ":"constructedWall","X":8,"Y":-5},{"Typ":"constructedWall","X":8,"Y":-6},{"Typ":"constructedWall","X":8,"Y":-7},{"Typ":"constructedWall","X":8,"Y":-8},{"Typ":"constructedWall","X":7,"Y":-8},{"Typ":"constructedWall","X":5,"Y":-8},{"Typ":"constructedWall","X":4,"Y":-8},{"Typ":"constructedWall","X":3,"Y":-8},{"Typ":"constructedWall","X":8,"Y":-1},{"Typ":"constructedWall","X":8,"Y":1},{"Typ":"constructedWall","X":8,"Y":0},{"Typ":"constructedWall","X":8,"Y":-2},{"Typ":"constructedWall","X":8,"Y":-3},{"Typ":"constructedWall","X":8,"Y":-4},{"Typ":"constructedWall","X":6,"Y":-8},{"Typ":"constructedWall","X":8,"Y":3},{"Typ":"constructedWall","X":8,"Y":4},{"Typ":"constructedWall","X":8,"Y":5},{"Typ":"constructedWall","X":8,"Y":6},{"Typ":"constructedWall","X":8,"Y":7},{"Typ":"constructedWall","X":8,"Y":2},{"Typ":"constructedWall","X":3,"Y":8},{"Typ":"constructedWall","X":4,"Y":8},{"Typ":"constructedWall","X":5,"Y":8},{"Typ":"constructedWall","X":6,"Y":8},{"Typ":"constructedWall","X":7,"Y":8},{"Typ":"constructedWall","X":8,"Y":8},{"Typ":"constructedWall","X":-1,"Y":8},{"Typ":"constructedWall","X":-4,"Y":8},{"Typ":"constructedWall","X":-5,"Y":8},{"Typ":"constructedWall","X":-7,"Y":8},{"Typ":"constructedWall","X":-6,"Y":8},{"Typ":"constructedWall","X":-3,"Y":8},{"Typ":"constructedWall","X":-2,"Y":8},{"Typ":"constructedWall","X":0,"Y":8},{"Typ":"constructedWall","X":1,"Y":8},{"Typ":"constructedWall","X":2,"Y":8},{"Typ":"constructedWall","X":-8,"Y":5},{"Typ":"constructedWall","X":-8,"Y":8},{"Typ":"constructedWall","X":-8,"Y":7},{"Typ":"constructedWall","X":-8,"Y":6},{"Typ":"constructedWall","X":-8,"Y":4},{"Typ":"constructedWall","X":-8,"Y":3},{"Typ":"constructedWall","X":-8,"Y":2},{"Typ":"constructedWall","X":-8,"Y":1},{"Typ":"constructedWall","X":-8,"Y":0},{"Typ":"constructedWall","X":-8,"Y":-1},{"Typ":"constructedWall","X":-8,"Y":-2},{"Typ":"constructedWall","X":-8,"Y":-3},{"Typ":"constructedWall","X":-8,"Y":-4},{"Typ":"constructedWall","X":-8,"Y":-5},{"Typ":"constructedWall","X":-8,"Y":-6},{"Typ":"constructedWall","X":-8,"Y":-7},{"Typ":"constructedWall","X":-8,"Y":-8},{"Typ":"constructedWall","X":-7,"Y":-8},{"Typ":"constructedWall","X":-6,"Y":-8},{"Typ":"constructedWall","X":-5,"Y":-8},{"Typ":"constructedWall","X":-4,"Y":-8},{"Typ":"constructedWall","X":-3,"Y":-8},{"Typ":"constructedWall","X":-2,"Y":-8}];
}
export class RoomPlan {
  LenX = 14;
  LenY = 14;
  xOff = 18;
  yOff = 8;
  Fits2(roomName: string, offx: number, offy: number): RoomPosition | null {
    var terrain = Game.map.getRoomTerrain(roomName)
    var retBool = true;
    var retVal = new RoomPosition(2, 2, roomName);
    var room = Game.rooms[roomName];

    for (var x = offx; x < 48; x++) {
      for (var y = offy; y < 48; y++) {
        retBool = true;
        retVal = new RoomPosition(x, y, roomName);
        var objRet: RoomBuildingPlan |undefined = undefined;
        for (var obj of RoomPlans.roomLayout) {
          var actualX = x - obj.X;
          var actualY = y - obj.Y;
          if(obj.Typ == "constructedWall")
            continue;

          if (terrain.get(actualX, actualY) == TERRAIN_MASK_WALL) {
            retBool = false;
            break;
          }
          if(actualX < 0 || actualY < 0)
          {
            retBool = false;
            break;
          }
          if (actualX >= 48 || actualY >= 48) {
            retBool = false;
            break;
          }
          objRet = obj;
        }
        if (retBool == true && objRet != undefined) {
          retVal = new RoomPosition(x, y, roomName);
          var rv = new RoomVisual(roomName);
          for (var objDraw of RoomPlans.roomLayout) {
            var xO = x - objDraw.X;
            var yO = y - objDraw.Y;
            rv.structure(xO, yO, objDraw.Typ);
          }
          return retVal;
        }
      }
    }
    if (retBool == false) {
      return null;
    }
    else {
      return retVal;
    }
  }

  checkBuildingMap(room: Room, x: number, y: number): Structure | ConstructionSite | null {
    for (var object of room.find(FIND_STRUCTURES)) {
      if (object.pos.x == x && object.pos.y == y) {
        return object;
      }
    }
    for (var object2 of room.find(FIND_CONSTRUCTION_SITES)) {
      if (object2.pos.x == x && object2.pos.y == y) {
        return object2;
      }
    }
    return null;
  }
  checkRoom(roomPos: RoomPosition, buildingm: RootObject): void {
    var _Room = Game.rooms[roomPos.roomName];
    _Room.memory.BuldingPlan = [];
    for (let building in buildingm.buildings) {
      if (building == "spawn")
        console.log("spawn");
      for (let exPos of buildingm.buildings[building].pos) {
        var rPos = new RoomPosition((roomPos.x + (exPos.x - this.xOff)), (roomPos.y + (exPos.y - this.yOff)), roomPos.roomName);
        var _placedStructure = this.checkBuildingMap(_Room, (roomPos.x + (exPos.x - this.xOff)), (roomPos.y + (exPos.y - this.yOff)));

        if (_placedStructure != null) {
          if (_placedStructure instanceof Structure) {
            if (_placedStructure.structureType == building) //Schon gebaut und fertig
            {

              _Room.memory.BuldingPlan.push({
                X: (roomPos.x + (exPos.x - this.xOff)),
                Y: (roomPos.y + (exPos.y - this.yOff)),
                Structure: building,
                Done: true,
                buildingID: _placedStructure.id,
                Placed: false,
                ConnectionPoint: exPos.roadConnectionPoint
              });
            }
            else if (_placedStructure.structureType == STRUCTURE_RAMPART) {
              if (building == STRUCTURE_RAMPART) {
                _Room.memory.BuldingPlan.push({
                  X: (roomPos.x + (exPos.x - this.xOff)),
                  Y: (roomPos.y + (exPos.y - this.yOff)),
                  Structure: building,
                  Done: true,
                  buildingID: _placedStructure.id,
                  Placed: false,
                  ConnectionPoint: exPos.roadConnectionPoint
                });
              }
              else {
                _Room.memory.BuldingPlan.push({
                  X: (roomPos.x + (exPos.x - this.xOff)),
                  Y: (roomPos.y + (exPos.y - this.yOff)),
                  Structure: building,
                  Done: false,
                  buildingID: building,
                  Placed: false,
                  ConnectionPoint: exPos.roadConnectionPoint
                });
              }
            }
            else if (building == STRUCTURE_RAMPART) {
              _Room.memory.BuldingPlan.push({
                X: (roomPos.x + (exPos.x - this.xOff)),
                Y: (roomPos.y + (exPos.y - this.yOff)),
                Structure: building,
                Done: false,
                buildingID: _placedStructure.id,
                Placed: false,
                ConnectionPoint: exPos.roadConnectionPoint
              });

            }
            else    // Nicht das was wir brauchen!
            {
              console.log("Cannot Place " + building)
            }
          }
          else if (_placedStructure.structureType == STRUCTURE_RAMPART) {
            _Room.memory.BuldingPlan.push({
              X: (roomPos.x + (exPos.x - this.xOff)),
              Y: (roomPos.y + (exPos.y - this.yOff)),
              Structure: building,
              Done: false,
              buildingID: building,
              Placed: false,
              ConnectionPoint: exPos.roadConnectionPoint
            });
          }

          else if (_placedStructure instanceof ConstructionSite) {
            if (_placedStructure.structureType == building) {
              _Room.memory.BuldingPlan.push({
                X: (roomPos.x + (exPos.x - this.xOff)),
                Y: (roomPos.y + (exPos.y - this.yOff)),
                Structure: building,
                Done: false,
                constructionID: _placedStructure.id,
                Placed: true,
                ConnectionPoint: exPos.roadConnectionPoint
              });
            }
          }
        }
        else {
          _Room.memory.BuldingPlan.push({
            X: (roomPos.x + (exPos.x - this.xOff)),
            Y: (roomPos.y + (exPos.y - this.yOff)),
            Structure: building,
            Done: false,
            Placed: false,
            ConnectionPoint: exPos.roadConnectionPoint
          });
        }
        _Room.visual.structure((roomPos.x + (exPos.x - this.xOff)), (roomPos.y + (exPos.y - this.yOff)), building);
      }
    }


    //SourceContainer
    for (var sourcef of _Room.find(FIND_SOURCES)) {
      var terrain = _Room.getTerrain();
      for (var xD = -1; xD < 2; xD++) {
        var brakD = false;
        for (var yD = -1; yD < 2; yD++) {
          if (xD == 0 && yD == 0)
            continue;
          if (terrain.get(sourcef.pos.x + xD, sourcef.pos.y + yD) != TERRAIN_MASK_WALL) {
            _Room.memory.BuldingPlan!.push({
              X: sourcef.pos.x + xD,
              Y: sourcef.pos.y + yD,
              Structure: STRUCTURE_CONTAINER,
              Done: false,
              Placed: false,
              ConnectionRound: false,
              SourceContainer: sourcef.id
            });
            brakD = true;
            console.log("FOUND SOURCE CONTAINER");
            break;
          }
        }
        if (brakD == true) {
          break;
        }
      }
    }
    //BUILD MINERALS
    for (var minerals of _Room.find(FIND_MINERALS)) {
      _Room.memory.BuldingPlan!.push({
        X: minerals.pos.x,
        Y: minerals.pos.y,
        Structure: STRUCTURE_EXTRACTOR,
        Done: false,
        Placed: false,
        ConnectionRound: false
      });
      var stop = false;
      for (var rangeMineralX = -1; rangeMineralX < 2; rangeMineralX++) {
        for (var rangeMineralY = -1; rangeMineralY < 2; rangeMineralY++) {
          if (rangeMineralX == 0 && rangeMineralY == 0) {
            continue;
          }
          if (_Room.getTerrain().get(minerals.pos.x + rangeMineralX, minerals.pos.y + rangeMineralY) != TERRAIN_MASK_WALL) {
            _Room.memory.BuldingPlan!.push({
              X: minerals.pos.x,
              Y: minerals.pos.y,
              Structure: STRUCTURE_CONTAINER,
              Done: false,
              Placed: false,
              ConnectionRound: false,
              MineralContainer: true
            });
            stop = true;
            break;
          }
          if (stop)
            break;
        }
      }
    }
    //Straßen zu SOURCE, COntroller Erst ab lvl 3
    for (var source of _Room.find(FIND_SOURCES)) {
      let Range = -1;
      var plan: buildingPlan | undefined = undefined;
      for (var _bulding of _Room.memory.BuldingPlan) {
        if (_bulding.ConnectionPoint != undefined && _bulding.ConnectionPoint == true) {
          var cmpRange = new RoomPosition(_bulding.X, _bulding.Y, source.room.name).getRangeTo(source.pos)
          if (cmpRange || Range == -1) {
            Range = cmpRange;
            plan = _bulding;
          }
        }
      }
      if (plan != undefined) {
        for (var point of _Room.findPath(new RoomPosition(plan.X, plan.Y, _Room.name), new RoomPosition(source.pos.x, source.pos.y, _Room.name), {
          ignoreCreeps: true,
          swampCost: 2,
          range: 1
        })) {
          var x = _Room.memory.BuldingPlan!.find((dx, i, arr) => {
            if (dx.X == point.x && dx.Y == point.y)
              return true;
            return false;
          });
          if (x != undefined) {
            continue;
          }


          _Room.memory.BuldingPlan!.push({
            X: point.x,
            Y: point.y,
            Structure: STRUCTURE_ROAD,
            Done: false,
            Placed: false,
            ConnectionRound: true
          });
          _Room.visual.structure(point.x, point.y, STRUCTURE_ROAD);
        }
      }
    }
    //Controller Roads
    if (_Room.controller != undefined) {
      let Range = -1;
      var plan: buildingPlan | undefined = undefined;
      for (var _bulding of _Room.memory.BuldingPlan) {
        if (_bulding.ConnectionPoint != undefined && _bulding.ConnectionPoint == true) {
          var cmpRange = new RoomPosition(_bulding.X, _bulding.Y, _Room.controller.room.name).getRangeTo(_Room.controller.pos)
          if (cmpRange || Range == -1) {
            Range = cmpRange;
            plan = _bulding;
          }
        }
      }
      if (plan != undefined) {
        for (var point of _Room.findPath(new RoomPosition(plan.X, plan.Y, _Room.name), new RoomPosition(_Room.controller.pos.x, _Room.controller.pos.y, _Room.name), {
          ignoreCreeps: true,
          swampCost: 2,
          range: 1
        })) {
          var x = _Room.memory.BuldingPlan!.find((dx, i, arr) => {
            if (dx.X == point.x && dx.Y == point.y)
              return true;
            return false;
          });
          if (x != undefined) {
            continue;
          }


          _Room.memory.BuldingPlan!.push({
            X: point.x,
            Y: point.y,
            Structure: STRUCTURE_ROAD,
            Done: false,
            Placed: false,
            ConnectionRound: true
          });
          _Room.visual.structure(point.x, point.y, STRUCTURE_ROAD);
        }
      }
    }
    /*for(var _bulding of _Room.memory.BuldingPlan)
    {
        if(_bulding.ConnectionPoint != undefined && _bulding.ConnectionPoint == true)
        {
            _Room.find(FIND_SOURCES).forEach((source)=>{
                for(var point of _Room.findPath(new RoomPosition(_bulding.X,_bulding.Y,_Room.name),new RoomPosition(source.pos.x,source.pos.y,_Room.name),{
                  ignoreCreeps: true,
                  swampCost: 1,
                  range: 1
                }))
                {
                    var x = _Room.memory.BuldingPlan!.find((dx,i ,arr)=>{
                        if(dx.X == point.x && dx.Y == point.y)
                            return true;
                        return false;
                    });
                    if(x != undefined)
                    {
                      continue;
                    }


                    _Room.memory.BuldingPlan!.push({
                        X: point.x,
                        Y: point.y,
                        Structure: STRUCTURE_ROAD,
                        Done: false,
                        Placed: false,
                        ConnectionRound:true
                    });
                    _Room.visual.structure(point.x,point.y,STRUCTURE_ROAD);
                }
            });
            _Room.find(FIND_STRUCTURES).forEach((struc)=>{
              if(struc.structureType != STRUCTURE_CONTROLLER)
                return;

              for(var point of _Room.findPath(new RoomPosition(_bulding.X,_bulding.Y,_Room.name),new RoomPosition(struc.pos.x,struc.pos.y,_Room.name),{
                ignoreCreeps: true,
                range: 1
              }))
              {
                  var x = _Room.memory.BuldingPlan!.find((dx,i ,arr)=>{
                      if(dx.X == point.x && dx.Y == point.y)
                          return true;
                      return false;
                  });
                  if(x != undefined)
                  {
                    continue;
                  }


                  _Room.memory.BuldingPlan!.push({
                      X: point.x,
                      Y: point.y,
                      Structure: STRUCTURE_ROAD,
                      Done: false,
                      Placed: false,
                      ConnectionRound:true
                  });
                  _Room.visual.structure(point.x,point.y,STRUCTURE_ROAD);
              }
          });
        }
    }*/
    _Room.visual.connectRoads();
    _Room.memory.BuldingPlan = _Room.memory.BuldingPlan.sort((a, b) => {
      var aVal = 0;
      if (a.Structure == STRUCTURE_SPAWN)
        aVal = 100;
      if (a.Structure == STRUCTURE_EXTENSION)
        aVal = 90;
      if (a.Structure == STRUCTURE_TOWER)
        aVal = 85;
      if (a.Structure == STRUCTURE_ROAD)
        aVal = 80;
      if (a.Structure == STRUCTURE_STORAGE)
        aVal = 95;
      if (a.Structure == STRUCTURE_LINK)
        aVal = 70;
      if (a.Structure == STRUCTURE_LAB)
        aVal = 10;
      if (a.Structure == STRUCTURE_FACTORY)
        aVal = 0;

      var bVal = 0;
      if (b.Structure == STRUCTURE_SPAWN)
        bVal = 100;
      if (b.Structure == STRUCTURE_EXTENSION)
        bVal = 90;
      if (b.Structure == STRUCTURE_TOWER)
        bVal = 85;
      if (b.Structure == STRUCTURE_ROAD)
        bVal = 80;
      if (b.Structure == STRUCTURE_STORAGE)
        bVal = 95;
      if (b.Structure == STRUCTURE_LINK)
        aVal = 70;
      if (b.Structure == STRUCTURE_LAB)
        aVal = 10;
      if (b.Structure == STRUCTURE_FACTORY)
        aVal = 0;

      return bVal - aVal;
    });

  }

  checkStatus(room: Room): void {
    for (let buildingID in room.memory.BuldingPlan!) {
      let building = room.memory.BuldingPlan[buildingID];
      var _placedStructure = this.checkBuildingMap(room, building.X, building.Y);
      if (_placedStructure != null) {
        if (_placedStructure instanceof Structure) {
          if (_placedStructure.structureType == building.Structure) //Schon gebaut und fertig
          {
            room.memory.BuldingPlan[buildingID].Done = true;
            room.memory.BuldingPlan[buildingID].buildingID = _placedStructure.id;
            room.memory.BuldingPlan[buildingID].constructionID = undefined;
            room.memory.BuldingPlan[buildingID].Placed = false;
          }
        }
        else if (_placedStructure instanceof ConstructionSite) {
          if (_placedStructure.structureType == building.Structure) //Schon gebaut und fertig
          {
            room.memory.BuldingPlan[buildingID].Done = false;
            room.memory.BuldingPlan[buildingID].buildingID = undefined;
            room.memory.BuldingPlan[buildingID].constructionID = _placedStructure.id;
            room.memory.BuldingPlan[buildingID].Placed = true;
          }
        }
      }
      else {
        if (building.Done == true) {
          if (Game.getObjectById(building.buildingID!) == null) {
            room.memory.BuldingPlan[buildingID].Done = false;
            room.memory.BuldingPlan[buildingID].buildingID = undefined;
          }
        }
        else if (building.Placed == true) {
          if (Game.getObjectById(building.constructionID!) == null) {
            room.memory.BuldingPlan[buildingID].Placed = false;
            room.memory.BuldingPlan[buildingID].constructionID = undefined;
          }
        }
      }
    }
  }
}

