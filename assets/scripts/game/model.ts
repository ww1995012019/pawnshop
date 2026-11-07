import {
  Category, Check, ItemId, NpcId, categories, checks, commissionParts,
  getItemDef, getNpc, itemDefs, npcs,
} from './data';

export { categories, checks, commissionParts, dayStories, itemDefs, npcs,
  getItemDef, getNpc, conditionLabel, authenticityLabel } from './data';
export type { Category, Check, ItemId, NpcId, ItemDef, NpcDef } from './data';
export type CheckType = Check;

export const SAVE_KEY = 'greyline-save-v2';
export const LEGACY_SAVE_KEY = 'greyline-save-v1';
export const RULES = Object.freeze({ days: 7, dayMinutes: 360, inventory: 12,
  display: 8, startingCash: 180, supplies: 15, commissionMinutes: 90,
  commissionPay: 40, recycleLimit: 2, offerMinutes: 4, deliveryMinutes: 6 });

export interface Attributes { condition: number; function: number; authenticity: number }
export interface Revealed { condition: boolean; function: boolean; authenticity: boolean }
export interface ItemInstance extends Attributes {
  uid: string; defId: ItemId; claimed: Attributes; revealed: Revealed;
  cost: number; listPrice: number; displayed: boolean; displaySlot?: number; riskLabel: boolean;
}
export type Market = Record<Category, number>;
export type Phase = 'open' | 'closing' | 'report' | 'ending';
export type Outcome = 'win' | 'survive' | 'bankrupt';
export type LedgerKind = 'purchase' | 'sale' | 'commission' | 'recycle' | 'supplies' | 'rent';
export interface LedgerEntry {
  id: number; transactionId: string; day: number; minute: number; kind: LedgerKind;
  label: string; amount: number; cost?: number; risk?: boolean;
}
export interface Trade {
  id: string; npc: NpcId; role: 'seller' | 'buyer'; category: Category;
  price: number; rounds: number; locked: boolean; offended: boolean;
  offers: Record<string, number>; line: string; repeat: boolean;
  item?: ItemInstance; selected?: string;
}
export interface Inspection { uid: string; check: Check; progress: number }
export interface DayReport {
  day: number; income: number; purchases: number; gross: number;
  fees: number; cash: number; missing: number;
}
export interface GameState {
  schema: 2; version: 2; seed: string; rng: number;
  day: number; minute: number; cash: number; reputation: number; sold: number;
  phase: Phase; inventory: ItemInstance[]; market: Market; queue: NpcId[];
  cursor: number; trade: Trade | null; ledger: LedgerEntry[]; report: DayReport | null;
  commission: 'available' | 'active' | 'done'; sorted: number[]; recycled: number;
  inspection: Inspection | null; discovered: ItemId[]; notice: string; nextId: number;
  completedTrades: string[]; outcome?: Outcome;
}
export type GameAction =
  | { type: 'ARRIVE' }
  | { type: 'SELECT'; uid: string }
  | { type: 'START_CHECK'; uid: string; check: Check }
  | { type: 'CHECK_STEP' }
  | { type: 'OFFER'; price: number; acknowledge?: boolean }
  | { type: 'ACCEPT' }
  | { type: 'DELIVER'; tradeId: string }
  | { type: 'DISMISS' | 'REFUSE' }
  | { type: 'DISPLAY'; uid: string; riskLabel?: boolean }
  | { type: 'PLACE'; uid: string; slot: number | null; riskLabel?: boolean }
  | { type: 'PRICE'; uid: string; price: number }
  | { type: 'RECYCLE'; uid: string }
  | { type: 'START_COMMISSION' | 'COMMISSION' }
  | { type: 'SORT'; index: number; category: Category }
  | { type: 'SORT_ALL' }
  | { type: 'CLOSE' | 'SETTLE' | 'NEXT' | 'BACK' };

const allKnown = (): Revealed => ({ condition: true, function: true, authenticity: true });
const categoryIds: Category[] = ['repair', 'life', 'collect'];
const checkIds: Check[] = ['condition', 'function', 'authenticity'];
const validMoney = (value: number): boolean => Number.isSafeInteger(value) && value > 0 && value <= 1000000000;

function hash(seed: string): number {
  let value = 2166136261;
  for (let i = 0; i < seed.length; i++) value = Math.imul(value ^ seed.charCodeAt(i), 16777619);
  return value >>> 0 || 1;
}
function random(state: GameState): number {
  let value = state.rng;
  value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
  state.rng = value >>> 0;
  return state.rng / 4294967296;
}
function pick<T>(state: GameState, values: readonly T[]): T {
  return values[Math.floor(random(state) * values.length)];
}
function makeItem(state: GameState, defId: ItemId, condition: number,
  functionality: number, authenticity: number, cost = 0, known = false): ItemInstance {
  return { uid: `item-${state.nextId++}`, defId, condition, function: functionality,
    authenticity, cost, displayed: known, riskLabel: false, listPrice: 0,
    claimed: { condition: 0.9, function: 1, authenticity: 1 },
    revealed: known ? allKnown() : { condition: false, function: false, authenticity: false } };
}

export function trueValue(item: ItemInstance, market: Market): number {
  const def = getItemDef(item.defId);
  return Math.max(5, Math.floor(def.base * item.condition * item.function *
    item.authenticity * market[def.category] + 0.5 + 1e-9));
}
export interface Appraisal {
  center: number; exact: boolean; low: number; high: number;
  /** True value, for model/debug use; the customer UI should only show it when exact. */
  price: number;
}
export function appraisal(item: ItemInstance, market: Market): Appraisal {
  const def = getItemDef(item.defId);
  const center = def.base * (item.revealed.condition ? item.condition : item.claimed.condition) *
    (item.revealed.function ? item.function : item.claimed.function) *
    (item.revealed.authenticity ? item.authenticity : item.claimed.authenticity) * market[def.category];
  const exact = checkIds.every(check => item.revealed[check]);
  const price = trueValue(item, market);
  return { center, exact, low: exact ? price : Math.max(5, Math.round(center * 0.7)),
    high: exact ? price : Math.max(5, Math.round(center * 1.3)), price };
}
export function remainingMinutes(state: GameState): number { return 360 - state.minute; }
export function rentDue(day: number): number { return day === 3 ? 90 : day === 7 ? 210 : 0; }
export function clockLabel(minute: number): string {
  return `${String(10 + Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
}
export function currentItem(state: GameState): ItemInstance | undefined {
  return state.trade?.role === 'seller' ? state.trade.item :
    state.inventory.find(item => item.uid === state.trade?.selected);
}
export function displaySlots(inventory: readonly ItemInstance[]): (ItemInstance | undefined)[] {
  const slots: (ItemInstance | undefined)[] = Array(8).fill(undefined);
  const unplaced: ItemInstance[] = [];
  for (const item of inventory.filter(entry => entry.displayed)) {
    const slot = item.displaySlot;
    if (slot !== undefined && Number.isInteger(slot) && slot >= 0 && slot < 8 && !slots[slot]) slots[slot] = item;
    else unplaced.push(item);
  }
  for (const item of unplaced) {
    const free = slots.findIndex(entry => !entry);
    if (free >= 0) slots[free] = item;
  }
  return slots;
}
export function eligibleItems(state: GameState): ItemInstance[] {
  const trade = state.trade;
  if (!trade || trade.role !== 'buyer') return [];
  const npc = getNpc(trade.npc);
  return state.inventory.filter(item => item.displayed && getItemDef(item.defId).category === trade.category &&
    (item.revealed.authenticity || (item.riskLabel && npc.risk)));
}
export function reservationPrice(state: GameState, item: ItemInstance): number {
  if (!state.trade) return 0;
  const npc = getNpc(state.trade.npc), value = trueValue(item, state.market);
  return state.trade.role === 'seller' ? Math.ceil(value * npc.floor - 1e-9) :
    Math.floor(value * npc.budget * (item.revealed.authenticity ? 1 : 0.8) + 1e-9);
}
export function wouldOffend(state: GameState, price: number): boolean {
  const trade = state.trade, item = currentItem(state);
  if (!trade || !item || trade.offended) return false;
  const effective = trade.role === 'seller' ? Math.min(price, trade.price) : Math.max(price, trade.price);
  const estimate = appraisal(item, state.market).center;
  return trade.role === 'seller' ? effective < estimate * 0.35 : effective > estimate * 1.8;
}
export function deliveryBlocker(state: GameState): string {
  const trade = state.trade;
  if (!trade?.locked) return '请先谈定价格';
  if (state.completedTrades.includes(trade.id) || state.ledger.some(entry => entry.transactionId === trade.id)) return '这笔交易已交割';
  if (remainingMinutes(state) < 6) return '剩余营业时间不足 6 分钟';
  if (trade.role === 'seller' && state.cash < trade.price) return '现金不足，不能完成收购';
  if (trade.role === 'seller' && state.inventory.length >= 12) return '库存已满，需要一个空格';
  return currentItem(state) ? '' : '商品已不在柜台';
}

function startDay(state: GameState): void {
  state.minute = 0; state.cursor = 0; state.trade = null; state.report = null;
  state.phase = 'open'; state.commission = 'available'; state.sorted = [];
  state.recycled = 0; state.inspection = null;
  const prices = [1.15, 1, 0.85];
  for (let i = prices.length - 1; i > 0; i--) {
    const j = Math.floor(random(state) * (i + 1));
    [prices[i], prices[j]] = [prices[j], prices[i]];
  }
  state.market = state.day === 1 ? { repair: 1, life: 1, collect: 1 } :
    { repair: prices[0], life: prices[1], collect: prices[2] };
  const pool: NpcId[] = npcs.flatMap(npc => [npc.id, npc.id]);
  state.queue = state.day === 1 ? ['lin', 'tao', 'zhou'] : [];
  for (const id of state.queue) pool.splice(pool.indexOf(id), 1);
  while (state.queue.length < (state.day === 1 ? 6 : 8)) {
    const index = Math.floor(random(state) * pool.length);
    state.queue.push(pool.splice(index, 1)[0]);
  }
  state.notice = state.day === 1 ? '瓶盖门铃响了。第一位客人已经等在门边。' :
    `第 ${state.day} 天，开门营业。今日行情已更新。`;
}
export function createGame(seed = 'TUTORIAL-001'): GameState {
  const normalized = String(seed).slice(0, 256) || 'TUTORIAL-001';
  const state: GameState = { schema: 2, version: 2, seed: normalized, rng: hash(normalized),
    day: 1, minute: 0, cash: 180, reputation: 50, sold: 0, phase: 'open',
    inventory: [], market: { repair: 1, life: 1, collect: 1 }, queue: [], cursor: 0,
    trade: null, ledger: [], report: null, commission: 'available', sorted: [], recycled: 0,
    inspection: null, discovered: ['I01', 'I05', 'I06'], notice: '', nextId: 1, completedTrades: [] };
  state.inventory = [makeItem(state, 'I01', 0.8, 1, 1, 25, true),
    makeItem(state, 'I05', 0.75, 1, 1, 35, true), makeItem(state, 'I06', 0.9, 1, 1, 55, true)];
  state.inventory.forEach((item, index) => {
    item.listPrice = Math.round(trueValue(item, state.market) * 1.1); item.displaySlot = index;
  });
  startDay(state);
  return state;
}

function cloneItem(item: ItemInstance): ItemInstance {
  return { ...item, claimed: { ...item.claimed }, revealed: { ...item.revealed } };
}
function clone(state: GameState): GameState {
  return { ...state, inventory: state.inventory.map(cloneItem), market: { ...state.market },
    queue: [...state.queue], ledger: state.ledger.map(entry => ({ ...entry })),
    trade: state.trade ? { ...state.trade, offers: { ...state.trade.offers },
      ...(state.trade.item ? { item: cloneItem(state.trade.item) } : {}) } : null,
    report: state.report ? { ...state.report } : null,
    inspection: state.inspection ? { ...state.inspection } : null,
    sorted: [...state.sorted], discovered: [...state.discovered], completedTrades: [...state.completedTrades] };
}
function notice(state: GameState, message: string): GameState { state.notice = message; return state; }
function finishTrade(state: GameState, message: string): GameState {
  state.trade = null; state.inspection = null; state.cursor++;
  if (state.minute >= 360 || state.cursor >= state.queue.length) state.phase = 'closing';
  return notice(state, message);
}
function addLedger(state: GameState, transactionId: string, kind: LedgerKind,
  label: string, amount: number, cost?: number, risk?: boolean): boolean {
  if (state.ledger.some(entry => entry.transactionId === transactionId)) return false;
  const cash = state.cash + amount;
  if (!Number.isSafeInteger(cash) || cash < 0) return false;
  state.cash = cash;
  state.ledger.push({ id: state.nextId++, transactionId, day: state.day, minute: state.minute,
    kind, label, amount, ...(cost === undefined ? {} : { cost }), ...(risk === undefined ? {} : { risk }) });
  return true;
}
function select(state: GameState, uid: string): void {
  const trade = state.trade;
  if (!trade || trade.role !== 'buyer' || trade.locked) return;
  const item = eligibleItems(state).find(entry => entry.uid === uid);
  if (!item) return;
  trade.selected = uid;
  trade.price = trade.offers[uid] ?? Math.floor(reservationPrice(state, item) * 0.78);
  trade.offers[uid] = trade.price;
}
function findItem(state: GameState, uid: string): ItemInstance | undefined {
  return state.trade?.item?.uid === uid ? state.trade.item : state.inventory.find(item => item.uid === uid);
}
function formatLine(line: string, item: string, category: Category): string {
  return line.split('{item}').join(item).split('{category}').join(categories[category].name);
}

/** Reducer has no clocks, storage, renderer or side effects. Repeated delivery IDs are inert. */
export function reduce(previous: GameState, action: GameAction): GameState {
  if (previous.phase === 'ending') return previous;
  const state = clone(previous);
  if (action.type === 'BACK') {
    if (state.phase === 'closing' && state.minute < 360) state.phase = 'open';
    return state;
  }
  if (action.type === 'NEXT') {
    if (state.phase !== 'report') return previous;
    if (state.outcome || state.day === 7) state.phase = 'ending';
    else { state.day++; startDay(state); }
    return state;
  }
  if (action.type === 'SETTLE') {
    if (state.phase !== 'closing') return previous;
    if (state.inspection || state.commission === 'active') return notice(state, '请先完成进行中的鉴定或委托。');
    if (state.trade) finishTrade(state, '打烊了，客人向你道别。');
    const today = state.ledger.filter(entry => entry.day === state.day);
    const report: DayReport = { day: state.day,
      income: today.filter(entry => entry.amount > 0).reduce((sum, entry) => sum + entry.amount, 0),
      purchases: -today.filter(entry => entry.kind === 'purchase').reduce((sum, entry) => sum + entry.amount, 0),
      gross: today.filter(entry => entry.kind === 'sale').reduce((sum, entry) => sum + entry.amount - (entry.cost ?? 0), 0),
      fees: 0, cash: state.cash, missing: 0 };
    const fees: [LedgerKind, string, number][] = [
      ['supplies', '每日耗材', 15], ['rent', `第 ${state.day} 天租金`, rentDue(state.day)],
    ];
    for (const [kind, label, amount] of fees) {
      if (!amount) continue;
      if (state.cash < amount) { report.missing = amount - state.cash; state.outcome = 'bankrupt'; break; }
      if (addLedger(state, `${kind}-day-${state.day}`, kind, label, -amount)) report.fees += amount;
    }
    report.cash = state.cash; state.report = report;
    if (!state.outcome && state.day === 7) state.outcome =
      state.cash >= 120 && state.reputation >= 40 && state.sold >= 12 ? 'win' : 'survive';
    state.phase = 'report';
    return state;
  }
  if (state.phase !== 'open') return previous;
  if (action.type === 'CLOSE') {
    if (state.inspection || state.commission === 'active') return notice(state, '先完成手头的鉴定或分拣，再打烊吧。');
    state.phase = 'closing'; return state;
  }
  if (action.type === 'ARRIVE') {
    if (state.trade || state.inspection || state.commission === 'active' || state.cursor >= state.queue.length) return previous;
    if (remainingMinutes(state) < 6) return notice(state, '剩余时间不足以接待新客人，可以打烊了。');
    state.minute += 6;
    const npc = getNpc(state.queue[state.cursor]);
    const repeat = state.queue.slice(0, state.cursor).includes(npc.id);
    const trade: Trade = { id: `trade-${state.nextId++}`, npc: npc.id,
      role: state.cursor % 2 === 0 ? 'seller' : 'buyer', category: pick(state, npc.preferences),
      price: 0, rounds: 0, locked: false, offended: false, offers: {}, line: '', repeat };
    state.trade = trade;
    if (trade.role === 'seller') {
      let item: ItemInstance;
      if (state.day === 1 && state.cursor === 0) item = makeItem(state, 'I07', 0.9, 1, 1);
      else if (state.day === 1 && state.cursor === 2) {
        item = makeItem(state, 'I02', 0.8, 0.6, 1); item.claimed.condition = 1;
      } else {
        const def = pick(state, itemDefs), authenticityRoll = random(state), conditionRoll = random(state);
        const authenticity = authenticityRoll < 0.7 ? 1 : authenticityRoll < 0.9 || !def.imitation ? 0.65 : 0.3;
        const condition = conditionRoll < 0.1 ? 0.5 : conditionRoll < 0.3 ? 0.75 : conditionRoll < 0.6 ? 0.8 : conditionRoll < 0.85 ? 0.9 : 1;
        item = makeItem(state, def.id, condition, random(state) < 0.8 ? 1 : 0.6, authenticity);
      }
      trade.item = item; trade.category = getItemDef(item.defId).category;
      trade.price = Math.ceil(trueValue(item, state.market) * npc.ask - 1e-9);
      trade.line = formatLine(pick(state, npc.lines.sell), getItemDef(item.defId).name, trade.category);
      if (!state.discovered.includes(item.defId)) state.discovered.push(item.defId);
    } else {
      const visible = state.inventory.filter(item => item.displayed &&
        (item.revealed.authenticity || (npc.risk && item.riskLabel)));
      trade.category = state.day === 1 && state.cursor === 1 ? 'life' : visible.length && random(state) < 0.7 ?
        getItemDef(pick(state, visible).defId).category : pick(state, categoryIds);
      trade.line = formatLine(pick(state, npc.lines.buy), '', trade.category);
      const candidates = eligibleItems(state);
      if (candidates.length) select(state, candidates[0].uid);
    }
    return notice(state, repeat ? pick(state, npc.lines.revisit) : state.day === 1 ? npc.lines.intro : trade.line);
  }
  if (action.type === 'SELECT') { if (!state.inspection) select(state, action.uid); return state; }
  if (action.type === 'START_CHECK') {
    if (!checkIds.includes(action.check) || state.inspection || state.commission === 'active' || state.trade?.locked) return previous;
    const item = findItem(state, action.uid);
    if (!item || item.revealed[action.check]) return previous;
    const check = checks[action.check];
    if (remainingMinutes(state) < check.minutes) return notice(state, '营业时间不足，无法开始这项检查。');
    state.minute += check.minutes;
    state.inspection = { uid: item.uid, check: action.check, progress: 0 };
    if (state.trade) state.trade.line = getNpc(state.trade.npc).lines.inspect[action.check === 'authenticity' ? 1 : 0];
    return state;
  }
  if (action.type === 'CHECK_STEP') {
    const inspection = state.inspection;
    if (!inspection) return previous;
    inspection.progress++;
    if (inspection.progress >= checks[inspection.check].steps) {
      const item = findItem(state, inspection.uid);
      if (item) item.revealed[inspection.check] = true;
      state.inspection = null;
      if (state.minute >= 360) state.phase = 'closing';
      notice(state, `${checks[inspection.check].name}完成。证据已记入物品档案。`);
    }
    return state;
  }
  if (action.type === 'OFFER' || action.type === 'ACCEPT') {
    const trade = state.trade, item = currentItem(state);
    if (!trade || !item || trade.locked || state.inspection || trade.rounds >= 3) return previous;
    if (remainingMinutes(state) < 10) return notice(state, '报价和交割共需至少 10 分钟。');
    const price = action.type === 'ACCEPT' ? trade.price : action.price;
    if (!validMoney(price)) return notice(state, '请输入大于零的整数价格。');
    const effective = trade.role === 'seller' ? Math.min(price, trade.price) : Math.max(price, trade.price);
    if (action.type === 'OFFER' && wouldOffend(state, effective)) {
      if (!action.acknowledge) return notice(state, '这个报价可能冒犯客人。确认后报价将损失 2 点信誉。');
      state.reputation = Math.max(0, state.reputation - 2); trade.offended = true;
    }
    state.minute += 4; trade.rounds++;
    const limit = reservationPrice(state, item), npc = getNpc(trade.npc);
    if (action.type === 'ACCEPT' || (trade.role === 'seller' ? effective >= limit : effective <= limit)) {
      trade.price = effective; trade.locked = true;
      trade.line = '价钱谈妥了。确认交割后，票子和旧物才会易手。';
      return notice(state, `双方同意 ${effective} 票。请确认交割。`);
    }
    if (trade.rounds === 3) return finishTrade(state, `${npc.name}：${npc.lines.refuse[0]}（三轮报价结束）`);
    trade.price = trade.role === 'seller' ? Math.ceil((trade.price + limit) / 2) : Math.floor((trade.price + limit) / 2);
    if (trade.selected) trade.offers[trade.selected] = trade.price;
    trade.line = npc.lines.counter[trade.rounds - 1];
    return notice(state, `${npc.name}还价 ${trade.price} 票。`);
  }
  if (action.type === 'DELIVER') {
    const trade = state.trade;
    if (!trade || trade.id !== action.tradeId || !trade.locked || state.completedTrades.includes(action.tradeId)) return previous;
    const blocked = deliveryBlocker(state);
    if (blocked) return notice(state, blocked);
    const item = currentItem(state)!;
    const name = getItemDef(item.defId).name;
    state.minute += 6;
    if (trade.role === 'seller') {
      if (!addLedger(state, trade.id, 'purchase', `收购 · ${name}`, -trade.price)) return previous;
      item.cost = trade.price; item.listPrice = Math.round(trueValue(item, state.market) * 1.1);
      item.displayed = false; delete item.displaySlot; state.inventory.push(item);
    } else {
      if (!addLedger(state, trade.id, 'sale', `出售 · ${name}`, trade.price, item.cost, !item.revealed.authenticity)) return previous;
      state.inventory = state.inventory.filter(entry => entry.uid !== item.uid); state.sold++;
      if (checkIds.every(check => item.revealed[check])) state.reputation = Math.min(100, state.reputation + 1);
    }
    state.completedTrades.push(trade.id);
    return finishTrade(state, `${getNpc(trade.npc).name}：${pick(state, getNpc(trade.npc).lines.deal)}`);
  }
  if (action.type === 'DISMISS' || action.type === 'REFUSE') {
    if (!state.trade || state.inspection) return previous;
    const name = getNpc(state.trade.npc).name;
    state.minute = Math.min(360, state.minute + 2);
    return finishTrade(state, `${name}收好行囊，向你道别。没有成交，也没有信誉损失。`);
  }
  if (action.type === 'DISPLAY' || action.type === 'PLACE') {
    const item = state.inventory.find(entry => entry.uid === action.uid);
    if (!item || state.trade?.selected === item.uid || state.inspection?.uid === item.uid) return previous;
    const slots = displaySlots(state.inventory);
    const slot = action.type === 'PLACE' ? action.slot : item.displayed ? null : slots.findIndex(entry => !entry);
    if (slot !== null && (!Number.isInteger(slot) || slot < 0 || slot >= 8)) return notice(state, '8 个陈列位已满，请先撤下一件商品。');
    const occupied = slot === null ? undefined : slots[slot];
    if (occupied && (state.trade?.selected === occupied.uid || state.inspection?.uid === occupied.uid))
      return notice(state, '这件旧物正在交易或检查中，暂时不能移动。');
    if (slot !== null && !item.revealed.authenticity && !action.riskLabel) return notice(state, '请先核验编号，或明确使用“未核验”标签。');
    slots.forEach((entry, index) => { if (entry) entry.displaySlot = index; });
    if (slot === null) { item.displayed = false; delete item.displaySlot; return notice(state, '已移回仓库。'); }
    if (occupied && occupied.uid !== item.uid) {
      const oldSlot = slots.findIndex(entry => entry?.uid === item.uid);
      if (oldSlot >= 0) occupied.displaySlot = oldSlot;
      else { occupied.displayed = false; delete occupied.displaySlot; }
    }
    item.riskLabel = !item.revealed.authenticity; item.displayed = true; item.displaySlot = slot;
    return notice(state, `已放入 ${slot + 1} 号陈列格${item.riskLabel ? '，标签：未核验' : '，标签与已知属性一致'}。`);
  }
  if (action.type === 'PRICE') {
    const item = state.inventory.find(entry => entry.uid === action.uid);
    if (item && validMoney(action.price) && state.trade?.selected !== item.uid) item.listPrice = action.price;
    return state;
  }
  if (action.type === 'RECYCLE') {
    if (state.recycled >= 2 || remainingMinutes(state) < 6 || state.inspection || state.commission === 'active') return previous;
    const item = state.inventory.find(entry => entry.uid === action.uid);
    if (!item || state.trade?.selected === item.uid) return previous;
    const amount = Math.floor(trueValue(item, state.market) * 0.35);
    state.minute += 6;
    if (!addLedger(state, `recycle-${item.uid}`, 'recycle', `回收 · ${getItemDef(item.defId).name}`, amount, item.cost)) return previous;
    state.inventory = state.inventory.filter(entry => entry.uid !== item.uid); state.recycled++;
    if (state.minute >= 360) state.phase = 'closing';
    return notice(state, `回收箱入账 ${amount} 票。回收不计入售出成绩。`);
  }
  if (action.type === 'START_COMMISSION' || action.type === 'COMMISSION') {
    if (state.trade || state.inspection || state.commission !== 'available' || remainingMinutes(state) < 90) return previous;
    state.minute += 90; state.commission = 'active'; state.sorted = [];
    return notice(state, '将六件物资分入对应类别，完成可得 40 票。');
  }
  if (action.type === 'SORT' || action.type === 'SORT_ALL') {
    if (state.commission !== 'active') return previous;
    if (action.type === 'SORT_ALL') state.sorted = commissionParts.map((_, index) => index);
    else {
      const part = commissionParts[action.index];
      if (!part || part.category !== action.category) return notice(state, '再想一想，这件物资更适合另一个类别。不会扣钱或信誉。');
      if (!state.sorted.includes(action.index)) state.sorted.push(action.index);
    }
    if (state.sorted.length === 6) {
      state.commission = 'done'; addLedger(state, `commission-day-${state.day}`, 'commission', '社区分拣委托', 40);
      if (state.minute >= 360) state.phase = 'closing';
      return notice(state, '分拣完成！社区支付了 40 票报酬。');
    }
    return state;
  }
  return previous;
}

// Storage is deliberately outside the model: Creator may use sys.localStorage or a backend.
export { parseSave, serializeGame } from './save';
