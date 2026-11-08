import type {StationEventRecord} from './StationEvents';
export type ToolId = 'TOL-001'|'TOL-002'|'TOL-003'|'TOL-004'|'TOL-005'|'TOL-006';
export type Faction = 'station'|'salvage'|'merchant';
export type PageId = 'counter'|'inspect'|'repair'|'warehouse'|'trade'|'orders'|'report'|'settings';
export type Location = 'warehouse'|'display'|'isolation'|'pawn';
export interface ItemDef {
  id:string; name:string; category:string; value:number; sprite:number;
  size:[number,number]; tools:ToolId[]; description:string; defect:string;
  clues:Partial<Record<ToolId,string>>; recipeId?:string;
  art?:{front:string;back:string;index:number;columns:number;rows:number};
}
export interface ToolDef {id:ToolId;name:string;short:string;instruction:string;unit:string;sprite:number}
export interface MaterialDef {id:string;name:string;price:number;description:string}
export interface NpcDef {
  id:string;name:string;title:string;faction:Faction;sprite:number;line:string;
  bio?:string;desire?:string;
  art?:{key:string;index:number;columns:number;rows:number};
  purchase?:{minCondition:number;authentic:boolean;working:boolean;categories?:string[]};
  voice?:{arrival:string[];counter:string[];agreed:string[];refused:string[]};
}
export interface RecipeDef {id:string;name:string;itemId:string;materials:Record<string,number>;steps:[string,string,string];ap:number;kind:'repair'|'craft';outputId?:string}
export interface OrderDef {id:string;name:string;itemId:string;reward:number;dueDay:number;minCondition:number;needsRepair:boolean;faction:Faction;customerOwned?:boolean;description:string}
export interface OrbitalItem {
  uid:string;defId:string;owner:'shop'|'customer'|'pawn';condition:number;working:boolean;
  authentic:boolean;sourceVerified:boolean;source:string;evidence:ToolId[];inspectedPaid:boolean;
  repaired:boolean;location:Location;x:number;y:number;rotated:boolean;listPrice:number;cost:number;
  sealed:boolean;orderId?:string;pawnDay?:number;pawnPrincipal?:number;lotId?:string;
}
export interface OrbitalTrade {id:string;npcId:string;kind:'buy'|'sell'|'pawn';item:OrbitalItem|null;selectedUid?:string;price:number;rounds:number;locked:boolean;evidenceUsed:ToolId[];line:string}
export interface LedgerEntry {id:string;day:number;kind:string;label:string;amount:number;cost:number;transactionId?:string}
export interface OrderState {id:string;status:'available'|'active'|'done'|'failed';uid?:string}
export interface DayReport {day:number;income:number;expenses:number;maintenance:number;rent:number;cash:number;upgraded:boolean}
export interface OrbitalState {
  schema:3;seed:string;day:number;ap:number;cash:number;phase:'open'|'report'|'ending';risk:number;
  relations:Record<Faction,number>;inventory:OrbitalItem[];trade:OrbitalTrade|null;cursor:number;
  ledger:LedgerEntry[];completedTrades:string[];orders:OrderState[];materials:Record<string,number>;events:StationEventRecord[];
  repairProgress:Record<string,number>;scanned:string[];inspection:'announced'|'pending'|'cleared';
  upgrades:{lamp:boolean;shelf:boolean};report:DayReport|null;notice:string;nextId:number;
  tutorial:number;outcome?:string;
}
export type OrbitalAction =
  |{type:'ARRIVE'}|{type:'SELECT_TRADE';uid:string}|{type:'CHECK';uid:string;tool:ToolId}
  |{type:'OFFER';price:number;evidence?:ToolId}|{type:'ACCEPT'}|{type:'DELIVER';tradeId:string}|{type:'REFUSE'}
  |{type:'MOVE';uid:string;x:number;y:number;rotated?:boolean}|{type:'DISPLAY';uid:string}
  |{type:'PRICE';uid:string;price:number}|{type:'ISOLATE';uid:string}|{type:'SCAN';uid:string}
  |{type:'REGISTER';uid:string}|{type:'RETURN_ITEM';uid:string}
  |{type:'REPAIR_STEP';uid:string;stage:number}|{type:'REPAIR';uid:string;recipeId:string}
  |{type:'DISMANTLE';uid:string}|{type:'CRAFT';recipeId:string}
  |{type:'TAKE_ORDER';id:string}|{type:'DELIVER_ORDER';id:string;uid:string}
  |{type:'BUY_MATERIAL';id:string;qty:number}|{type:'PAWN';tradeId:string}|{type:'REDEEM';uid:string}
  |{type:'EMERGENCY_SALE';uid:string}
  |{type:'CHOOSE_EVENT';eventId:string;choiceId:string}
  |{type:'SETTLE'}|{type:'UPGRADE';id:'lamp'|'shelf'}|{type:'NEXT'};

export interface OrbitalPrefs {sound:boolean;reducedMotion:boolean;largeText:boolean}
