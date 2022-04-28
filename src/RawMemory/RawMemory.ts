export class mMemory {
  static loadData:number[] = [];
  static loadBuildmap():void{
  }
  static Load():void{
    RawMemory.setActiveSegments(this.loadData);
    this.loadData = [];
  }
}
