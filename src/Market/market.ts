export class Market{
  static run(){
    if(Game.time % 200 != 0) return;
    var orders = Game.market.getAllOrders();
    var buyOrders = _.filter(orders,(x)=>{
      if(x.type == ORDER_BUY)
      {
        return true;
      }
      return false;
    });
    var sellOrders = _.filter(orders,(x)=>{
      if(x.type == ORDER_SELL)
      {
        return true;
      }
      return false;
    });

    for(var roomName in Game.rooms)
    {
      var room = Game.rooms[roomName];
      //Buying
      //-----
      //-----
      if(room.terminal)
      {
        if(room.terminal.store.getUsedCapacity(RESOURCE_CATALYZED_GHODIUM_ACID) < 3000)
        {
          var buy = _.filter(sellOrders,(x)=>{
            if(x.roomName == undefined) return false;
            if(Game.market.calcTransactionCost(x.amount,x.roomName,room.name) < 10000)
            {
              if(x.resourceType == RESOURCE_CATALYZED_GHODIUM_ACID)
              {
                return true;
              }
            }
            return false;
          });
          buy = buy.sort((a,b)=>a.price-b.price);
          console.log("TERMINAL BUY ERROR ");
          if(buy.length > 0)
          {
            console.log("TERMINAL BUY ERROR PRICE "+buy[0].price);
            if(buy[0].price < 25)
            {
              var buyErr = Game.market.deal(buy[0].id,buy[0].amount,room.name);
              console.log("TERMINAL BUY ERROR " + buyErr);
            }
          }
        }
        if(room.terminal.store.getUsedCapacity(RESOURCE_CATALYZED_LEMERGIUM_ACID) < 2000)
        {
          var buy = _.filter(sellOrders,(x)=>{
            if(x.roomName == undefined) return false;
            if(Game.market.calcTransactionCost(x.amount,x.roomName,room.name) < 10000)
            {
              if(x.resourceType == RESOURCE_CATALYZED_LEMERGIUM_ACID)
              {
                return true;
              }
            }
            return false;
          });
          buy = buy.sort((a,b)=>a.price-b.price);
          console.log("TERMINAL BUY ERROR ");
          if(buy.length > 0)
          {
            console.log("TERMINAL BUY ERROR PRICE "+buy[0].price);
            if(buy[0].price < 10)
            {
              var buyErr = Game.market.deal(buy[0].id,buy[0].amount,room.name);
              console.log("TERMINAL BUY ERROR " + buyErr);
            }
          }
        }
      }
      //SELL
      if(room.controller && room.controller.my == false) continue;
      if(room.Mineral)
      {
        if(room.terminal && room.terminal.store.getUsedCapacity(room.Mineral) > 20000)
        {
          if(room.terminal.cooldown > 0) continue;
          if(room.storage)
          {
            if(room.storage.store.getUsedCapacity(RESOURCE_ENERGY) < 50000)
            {
              continue;
            }
          }
          var capacity = room.terminal.store.getUsedCapacity(room.Mineral);
          var mineralBuyOrder = _.filter(buyOrders,(x)=>{
            if(x.roomName == undefined) return false;
            if(Game.market.calcTransactionCost(x.amount,x.roomName,room.name) < 10000)
            {
              if(x.resourceType == room.Mineral)
              {
                return true;
              }
            }
            return false;
          });
          if(mineralBuyOrder.length > 0)
          {
            mineralBuyOrder = mineralBuyOrder.sort((a,b) => b.price - a.price);
            if(mineralBuyOrder[0].price > 0.2)
            {
              var err = 0;
              if(mineralBuyOrder[0].amount <= capacity)
              {
                err = Game.market.deal(mineralBuyOrder[0].id,mineralBuyOrder[0].amount,room.name);
              }
              else
              {
                err = Game.market.deal(mineralBuyOrder[0].id,capacity,room.name);
              }
              if(err == OK)
              {
                console.log("------------DEAL----");
                console.log("Resource: "+ mineralBuyOrder[0].resourceType)
                console.log("Price: "+ mineralBuyOrder[0].price);
                console.log("Ammount: "+ mineralBuyOrder[0].amount);
              }
              continue;
            }
          }

        }
      }
    }
  }

}
