
import {ContractRefillTower} from "Room/Contract/ContractTypes/Working/ContractRefillTower";
import {ContractExtensionRefill} from "Room/Contract/ContractTypes/Working/ContractExtensionRefill";
import {ContractSpawnRefill} from "Room/Contract/ContractTypes/Working/ContractSpawnRefill";
import {ContractLinkControllerRefill} from "Room/Contract/ContractTypes/Working/ContractLinkController";
import {ContractLinkStorageRefill} from "Room/Contract/ContractTypes/Working/ContractLinkStorage";


declare global
{
  var ContractStore: any;
}

var _global = global;
_global.ContractStore = {
  ContractRefillTower,
  ContractExtensionRefill,
  ContractSpawnRefill,
  ContractLinkControllerRefill,
  ContractLinkStorageRefill
}
