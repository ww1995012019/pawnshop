import type {
  Attributes, DayReport, GameState, Inspection, ItemInstance, LedgerEntry, LedgerKind,
  Market, Outcome, Phase, Revealed, Trade,
} from './model';
import { Category, Check, ItemId, NpcId, itemDefs, npcs } from './data';

type RecordValue = Record<string, unknown>;
const categoryIds: readonly Category[] = ['repair', 'life', 'collect'];
const checkIds: readonly Check[] = ['condition', 'function', 'authenticity'];
const itemIds: readonly ItemId[] = itemDefs.map(item => item.id);
const npcIds: readonly NpcId[] = npcs.map(npc => npc.id);
const ledgerKinds: readonly LedgerKind[] = ['purchase', 'sale', 'commission', 'recycle', 'supplies', 'rent'];
const phases: readonly Phase[] = ['open', 'closing', 'report', 'ending'];
const outcomes: readonly Outcome[] = ['win', 'survive', 'bankrupt'];
const MAX_MONEY = 1000000000;

function record(value: unknown): value is RecordValue {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function integer(value: unknown, min = 0, max = MAX_MONEY): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
}
function string(value: unknown, max = 1000): value is string {
  return typeof value === 'string' && value.length <= max;
}
function identifier(value: unknown): value is string {
  return string(value, 128) && value.length > 0 && /^[A-Za-z0-9_.:-]+$/.test(value) &&
    value !== '__proto__' && value !== 'constructor' && value !== 'prototype';
}
function oneOf<T extends string | number>(value: unknown, values: readonly T[]): value is T {
  return values.includes(value as T);
}
function bool(value: unknown): value is boolean { return typeof value === 'boolean'; }
function unique(values: readonly unknown[]): boolean { return new Set(values).size === values.length; }

function attributes(value: unknown): Attributes | null {
  if (!record(value) || !oneOf(value.condition, [0.5, 0.75, 0.8, 0.9, 1]) ||
    !oneOf(value.function, [0.6, 1]) || !oneOf(value.authenticity, [0.3, 0.65, 1])) return null;
  return { condition: value.condition, function: value.function, authenticity: value.authenticity };
}
function revelation(value: unknown): Revealed | null {
  if (!record(value) || !bool(value.condition) || !bool(value.function) || !bool(value.authenticity)) return null;
  return { condition: value.condition, function: value.function, authenticity: value.authenticity };
}
function readItem(value: unknown): ItemInstance | null {
  if (!record(value)) return null;
  const actual = attributes(value), claimed = attributes(value.claimed), revealed = revelation(value.revealed);
  if (!actual || !claimed || !revealed || !identifier(value.uid) || !oneOf(value.defId, itemIds) ||
    !integer(value.cost) || !integer(value.listPrice) || !bool(value.displayed) || !bool(value.riskLabel) ||
    (value.displaySlot !== undefined && !integer(value.displaySlot, 0, 7))) return null;
  return { uid: value.uid, defId: value.defId, ...actual, claimed, revealed,
    cost: value.cost, listPrice: value.listPrice, displayed: value.displayed, riskLabel: value.riskLabel,
    ...(value.displaySlot === undefined ? {} : { displaySlot: value.displaySlot as number }) };
}
function readLedger(value: unknown, legacy: boolean): LedgerEntry[] | null {
  if (!Array.isArray(value) || value.length > 2048) return null;
  const ledger: LedgerEntry[] = [];
  for (const row of value as unknown[]) {
    if (!record(row) || !integer(row.id, 1) || !integer(row.day, 1, 7) || !integer(row.minute, 0, 360) ||
      !oneOf(row.kind, ledgerKinds) || !string(row.label) || !integer(row.amount, -MAX_MONEY) ||
      (row.cost !== undefined && !integer(row.cost)) || (row.risk !== undefined && !bool(row.risk))) return null;
    const transactionId = legacy ? `${row.kind}-legacy-${row.id}` : row.transactionId;
    if (!identifier(transactionId)) return null;
    if ((row.kind === 'purchase' || row.kind === 'supplies' || row.kind === 'rent') && row.amount > 0) return null;
    if ((row.kind === 'sale' || row.kind === 'commission' || row.kind === 'recycle') && row.amount < 0) return null;
    ledger.push({ id: row.id, transactionId, day: row.day, minute: row.minute, kind: row.kind,
      label: row.label, amount: row.amount, ...(row.cost === undefined ? {} : { cost: row.cost as number }),
      ...(row.risk === undefined ? {} : { risk: row.risk as boolean }) });
  }
  if (!unique(ledger.map(row => row.id)) || !unique(ledger.map(row => row.transactionId))) return null;
  return ledger;
}
function readTrade(value: unknown, inventory: ItemInstance[]): Trade | null {
  if (!record(value) || !identifier(value.id) || !oneOf(value.npc, npcIds) ||
    !oneOf(value.role, ['seller', 'buyer'] as const) || !oneOf(value.category, categoryIds) ||
    !integer(value.price) || !integer(value.rounds, 0, 3) || !bool(value.locked) || !bool(value.offended) ||
    !string(value.line, 2000) || (value.repeat !== undefined && !bool(value.repeat)) || !record(value.offers)) return null;
  const offers: Record<string, number> = {};
  if (Object.keys(value.offers).length > 12) return null;
  for (const [uid, price] of Object.entries(value.offers)) {
    if (!identifier(uid) || !integer(price)) return null;
    // A historical offer can reference a removed good; it has no authority to select it.
    offers[uid] = price;
  }
  const trade: Trade = { id: value.id, npc: value.npc, role: value.role, category: value.category,
    price: value.price, rounds: value.rounds, locked: value.locked, offended: value.offended,
    offers, line: value.line, repeat: value.repeat === true };
  if (value.role === 'seller') {
    const item = readItem(value.item);
    if (!item || inventory.some(entry => entry.uid === item.uid) || item.displayed) return null;
    if (itemDefs.find(def => def.id === item.defId)?.category !== trade.category) return null;
    trade.item = item;
  } else if (value.selected !== undefined && value.selected !== null) {
    if (!identifier(value.selected) || !inventory.some(item => item.uid === value.selected)) return null;
    trade.selected = value.selected;
    const selected = inventory.find(item => item.uid === trade.selected)!;
    const npc = npcs.find(entry => entry.id === trade.npc)!;
    if (!selected.displayed || itemDefs.find(def => def.id === selected.defId)?.category !== trade.category ||
      (!selected.revealed.authenticity && !(selected.riskLabel && npc.risk))) return null;
  }
  if (trade.locked && (!trade.price || !trade.rounds || (trade.role === 'buyer' && !trade.selected))) return null;
  return trade;
}
function readReport(value: unknown): DayReport | null {
  if (!record(value) || !integer(value.day, 1, 7) || !integer(value.income, 0, MAX_MONEY * 2048) ||
    !integer(value.purchases, 0, MAX_MONEY * 2048) || !integer(value.gross, -MAX_MONEY * 2048, MAX_MONEY * 2048) ||
    !integer(value.fees) || !integer(value.cash) || !integer(value.missing)) return null;
  return { day: value.day, income: value.income, purchases: value.purchases, gross: value.gross,
    fees: value.fees, cash: value.cash, missing: value.missing };
}

/** Strict, bounded decoder. Accepts the old bare version:1 save and emits only schema:2 fields. */
export function parseSave(text: string | null | undefined): GameState | null {
  if (typeof text !== 'string' || text.length > 512 * 1024 || !text.length) return null;
  try {
    const raw: unknown = JSON.parse(text);
    if (!record(raw)) return null;
    const legacy = raw.version === 1 && raw.schema === undefined;
    if (!legacy && (raw.schema !== 2 || raw.version !== 2)) return null;
    if (!string(raw.seed, 256) || !raw.seed.length || !integer(raw.rng, 0, 4294967295) ||
      !integer(raw.day, 1, 7) || !integer(raw.minute, 0, 360) || !integer(raw.cash) ||
      !integer(raw.reputation, 0, 100) || !integer(raw.sold, 0, 54) || !oneOf(raw.phase, phases) ||
      !Array.isArray(raw.inventory) || raw.inventory.length > 12 || !record(raw.market) ||
      !categoryIds.every(category => oneOf((raw.market as RecordValue)[category], [0.85, 1, 1.15])) ||
      !Array.isArray(raw.queue) || raw.queue.length !== (raw.day === 1 ? 6 : 8) ||
      !raw.queue.every(id => oneOf(id, npcIds)) || !integer(raw.cursor, 0, raw.queue.length) ||
      !oneOf(raw.commission, ['available', 'active', 'done'] as const) ||
      !Array.isArray(raw.sorted) || !raw.sorted.every(index => integer(index, 0, 5)) || !unique(raw.sorted) ||
      !integer(raw.recycled, 0, 2) || !Array.isArray(raw.discovered) || raw.discovered.length > 12 ||
      !raw.discovered.every(id => oneOf(id, itemIds)) || !unique(raw.discovered) ||
      !string(raw.notice, 2000) || !integer(raw.nextId, 1) ||
      (raw.outcome !== undefined && !oneOf(raw.outcome, outcomes))) return null;
    const items = (raw.inventory as unknown[]).map(readItem);
    if (items.some(item => !item)) return null;
    const inventory = items as ItemInstance[];
    if (!unique(inventory.map(item => item.uid)) || inventory.filter(item => item.displayed).length > 8) return null;
    // Version 1 could have displayed goods without a slot. Preserve order and repair slot collisions.
    const used = new Set<number>();
    for (const item of inventory.filter(entry => entry.displayed)) {
      if (item.displaySlot === undefined || used.has(item.displaySlot)) {
        if (!legacy) return null;
        item.displaySlot = Array.from({ length: 8 }, (_, i) => i).find(slot => !used.has(slot));
      }
      if (item.displaySlot === undefined || (!item.revealed.authenticity && !item.riskLabel)) return null;
      used.add(item.displaySlot);
    }
    for (const item of inventory.filter(entry => !entry.displayed)) delete item.displaySlot;
    const ledger = readLedger(raw.ledger, legacy);
    if (!ledger || ledger.some(entry => entry.day > (raw.day as number))) return null;
    const trade = raw.trade === null || raw.trade === undefined ? null : readTrade(raw.trade, inventory);
    if (raw.trade && !trade) return null;
    let inspection: Inspection | null = null;
    if (raw.inspection !== null && raw.inspection !== undefined) {
      const value = raw.inspection;
      if (!record(value) || !identifier(value.uid) || !oneOf(value.check, checkIds) ||
        !integer(value.progress, 0, value.check === 'condition' ? 2 : 0)) return null;
      const item = trade?.item?.uid === value.uid ? trade.item : inventory.find(entry => entry.uid === value.uid);
      if (!item || item.revealed[value.check] || trade?.locked) return null;
      inspection = { uid: value.uid, check: value.check, progress: value.progress };
    }
    const report = raw.report === null || raw.report === undefined ? null : readReport(raw.report);
    if ((raw.report && !report) || (report && (report.day !== raw.day || report.cash !== raw.cash)) ||
      (raw.phase === 'report' && !report) || (raw.phase === 'ending' && !raw.outcome) ||
      ((raw.phase === 'report' || raw.phase === 'ending') && (trade || inspection || raw.commission === 'active')) ||
      (raw.outcome && raw.phase !== 'report' && raw.phase !== 'ending') ||
      (raw.commission === 'active' && (trade || inspection || raw.sorted.length >= 6)) ||
      (raw.commission === 'available' && raw.sorted.length !== 0) ||
      (raw.commission === 'done' && raw.sorted.length !== 6)) return null;
    const tradeTransactions = ledger.filter(row => row.kind === 'sale' || row.kind === 'purchase').map(row => row.transactionId);
    let completedTrades: string[];
    if (legacy) completedTrades = tradeTransactions;
    else {
      if (!Array.isArray(raw.completedTrades) || raw.completedTrades.length > 54 ||
        !raw.completedTrades.every(identifier) || !unique(raw.completedTrades)) return null;
      completedTrades = [...raw.completedTrades] as string[];
      if (tradeTransactions.some(id => !completedTrades.includes(id)) ||
        completedTrades.some(id => !tradeTransactions.includes(id))) return null;
    }
    if (trade && (completedTrades.includes(trade.id) || ledger.some(row => row.transactionId === trade.id))) return null;
    // Never trust an old nextId: derive a collision-free lower bound from every persisted identity.
    let nextId = raw.nextId;
    const ids = [...inventory.map(item => item.uid), ...ledger.map(row => String(row.id)),
      ...completedTrades, ...(trade ? [trade.id, ...(trade.item ? [trade.item.uid] : [])] : [])];
    for (const id of ids) {
      const match = /(?:^|[-:])(\d+)$/.exec(id);
      if (match) {
        const number = Number(match[1]);
        if (!Number.isSafeInteger(number) || number >= MAX_MONEY) return null;
        nextId = Math.max(nextId, number + 1);
      }
    }
    const market: Market = { repair: raw.market.repair as number,
      life: raw.market.life as number, collect: raw.market.collect as number };
    return { schema: 2, version: 2, seed: raw.seed, rng: raw.rng, day: raw.day, minute: raw.minute,
      cash: raw.cash, reputation: raw.reputation, sold: raw.sold, phase: raw.phase,
      inventory, market, queue: [...raw.queue] as NpcId[], cursor: raw.cursor, trade, ledger, report,
      commission: raw.commission, sorted: [...raw.sorted] as number[], recycled: raw.recycled,
      inspection, discovered: [...raw.discovered] as ItemId[], notice: raw.notice, nextId,
      completedTrades, ...(raw.outcome === undefined ? {} : { outcome: raw.outcome as Outcome }) };
  } catch {
    return null;
  }
}

/** Invalid data is never silently written over a good save. */
export function serializeGame(state: GameState): string {
  const text = JSON.stringify(state);
  if (!parseSave(text)) throw new Error('Cannot serialize invalid Greyline game state');
  return text;
}
