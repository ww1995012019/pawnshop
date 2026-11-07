/* Run after compiling model.ts: node model.test.cjs /absolute/path/to/compiled/model.js */
const assert = require('node:assert/strict');
const game = require(process.argv[2]);
const {
  createGame, reduce, appraisal, trueValue, reservationPrice, parseSave, serializeGame,
  commissionParts, displaySlots,
} = game;
let assertions = 0;
function check(condition, message) { assertions++; assert.ok(condition, message); }
function step(state, type, extra = {}) { return reduce(state, { type, ...extra }); }
function commission(state) {
  state = step(state, 'START_COMMISSION');
  for (let index = 0; index < commissionParts.length; index++) {
    state = step(state, 'SORT', { index, category: commissionParts[index].category });
  }
  return state;
}
function inspect(state, uid, checkType) {
  state = step(state, 'START_CHECK', { uid, check: checkType });
  while (state.inspection) state = step(state, 'CHECK_STEP');
  return state;
}

// Reproducible markets/visitors and immutable snapshots make refresh/replay safe.
let state = createGame('MODEL-TEST');
check(serializeGame(state) === serializeGame(createGame('MODEL-TEST')), 'Seeded starts are deterministic');
check(state.cash === 180 && state.inventory.length === 3, 'Original starting balance and goods');
const initialText = serializeGame(state);
state = step(state, 'ARRIVE');
check(serializeGame(createGame('MODEL-TEST')) === initialText, 'Reducer does not mutate its input');
check(state.trade.role === 'seller' && state.trade.item.defId === 'I07' && state.minute === 6, 'Tutorial seller is preserved');
const uid = state.trade.item.uid;
state = step(state, 'START_CHECK', { uid, check: 'condition' });
check(state.minute === 10 && state.inspection.progress === 0, 'A check pays its action minutes once');
state = step(state, 'CHECK_STEP');
state = step(state, 'CHECK_STEP');
check(!state.trade.item.revealed.condition, 'Appearance needs all three evidence points');
state = parseSave(serializeGame(state));
state = step(state, 'CHECK_STEP');
check(state.trade.item.revealed.condition && !state.inspection, 'Mid-check save resumes at the correct point');
const minute = state.minute;
state = step(state, 'START_CHECK', { uid, check: 'condition' });
check(state.minute === minute, 'Known checks never charge twice');
state = inspect(state, uid, 'function');
state = inspect(state, uid, 'authenticity');
const estimate = appraisal(state.trade.item, state.market);
check(estimate.exact && estimate.low === estimate.high && estimate.low === trueValue(state.trade.item, state.market), 'Full evidence gives the exact price');
const cashBeforePurchase = state.cash;
const agreedPurchase = reservationPrice(state, state.trade.item);
state = step(state, 'OFFER', { price: agreedPurchase });
const tradeId = state.trade.id;
state = step(state, 'DELIVER', { tradeId: 'stale-trade' });
check(state.cash === cashBeforePurchase, 'A stale UI cannot deliver a different trade');
state = step(state, 'DELIVER', { tradeId });
check(state.cash === cashBeforePurchase - agreedPurchase && state.inventory.some(item => item.uid === uid), 'Purchase transfers the same instance UID');
const afterPurchase = serializeGame(state);
state = step(state, 'DELIVER', { tradeId });
check(serializeGame(state) === afterPurchase, 'Repeated delivery is exactly-once');
state = step(state, 'ARRIVE');
check(state.trade.role === 'buyer' && state.trade.selected, 'Buyer selects an eligible shelf good');
const selected = state.inventory.find(item => item.uid === state.trade.selected);
const soldUid = selected.uid;
const cashBeforeSale = state.cash;
state = step(state, 'OFFER', { price: reservationPrice(state, selected) });
const salePrice = state.trade.price, saleId = state.trade.id;
state = step(state, 'DELIVER', { tradeId: saleId });
check(state.cash === cashBeforeSale + salePrice && state.sold === 1 && !state.inventory.some(item => item.uid === soldUid), 'Sale removes only the selected instance');
check(state.ledger.filter(row => row.transactionId === saleId).length === 1, 'Sale records one transaction');
state = parseSave(serializeGame(state));
state = step(state, 'DELIVER', { tradeId: saleId });
check(state.sold === 1, 'Delivery remains idempotent after reload');

// Shelf movement swaps actual slots, rather than changing a visual-only position.
let shelf = createGame('SHELF');
const [first, second] = shelf.inventory;
shelf = step(shelf, 'PLACE', { uid: first.uid, slot: 1 });
check(displaySlots(shelf.inventory)[1].uid === first.uid && displaySlots(shelf.inventory)[0].uid === second.uid, 'Occupied shelf positions swap');
check(parseSave(serializeGame(shelf)).inventory.find(item => item.uid === first.uid).displaySlot === 1, 'Shelf placement survives reload');

// Three unsuccessful rounds end the visit; extreme offers require explicit acknowledgement.
let bargaining = step(createGame('BARGAIN'), 'ARRIVE');
const offenseCash = bargaining.cash;
bargaining = step(bargaining, 'OFFER', { price: 1 });
check(bargaining.reputation === 50 && bargaining.trade.rounds === 0, 'An offensive offer waits for acknowledgement');
bargaining = step(bargaining, 'OFFER', { price: 1, acknowledge: true });
bargaining = step(bargaining, 'OFFER', { price: 1, acknowledge: true });
bargaining = step(bargaining, 'OFFER', { price: 1, acknowledge: true });
check(!bargaining.trade && bargaining.cursor === 1 && bargaining.reputation === 48 && bargaining.cash === offenseCash, 'Only one offense penalty and three bargaining rounds');

// Daily commission, recycling and all seven settlements including both rents.
let week = createGame('FULL-WEEK');
const originalUid = week.inventory[0].uid;
week = step(week, 'RECYCLE', { uid: originalUid });
check(week.recycled === 1 && week.sold === 0, 'Recycling does not inflate sales');
const afterRecycle = serializeGame(week);
week = step(week, 'RECYCLE', { uid: originalUid });
check(serializeGame(week) === afterRecycle, 'The same item cannot be recycled twice');
const initialCash = week.cash;
for (let day = 1; day <= 7; day++) {
  const startingCash = week.cash;
  week = step(week, 'START_COMMISSION');
  week = step(week, 'SORT', { index: 0, category: 'life' });
  check(week.sorted.length === 0, 'Wrong sorting does not progress or penalize');
  for (let index = 0; index < commissionParts.length; index++) week = step(week, 'SORT', { index, category: commissionParts[index].category });
  check(week.cash === startingCash + 40 && week.minute >= 90, 'One commission rewards 40 tickets each day');
  week = step(week, 'SORT_ALL');
  check(week.cash === startingCash + 40, 'Commission reward is idempotent');
  week = step(week, 'CLOSE');
  week = step(week, 'SETTLE');
  check(week.report.fees === 15 + (day === 3 ? 90 : day === 7 ? 210 : 0), 'Correct supplies/rent settlement');
  const settled = serializeGame(week);
  week = step(week, 'SETTLE');
  check(serializeGame(week) === settled, 'Repeated settlement cannot charge twice');
  week = parseSave(settled);
  week = step(week, 'NEXT');
}
check(week.phase === 'ending' && week.outcome === 'survive', 'All seven days finish without meeting sales target');
check(week.cash === initialCash + 7 * 40 - 7 * 15 - 90 - 210, 'Week cash reconciles with ledger');

// A real seven-day trading run (no balance fixtures) can reach the intended good ending.
let tradingWeek = createGame('WIN-0');
let turns = 0;
while (tradingWeek.phase !== 'ending' && turns++ < 600) {
  if (tradingWeek.phase === 'report') { tradingWeek = step(tradingWeek, 'NEXT'); continue; }
  if (tradingWeek.phase === 'closing') { tradingWeek = step(tradingWeek, 'SETTLE'); continue; }
  if (tradingWeek.commission === 'available') { tradingWeek = commission(tradingWeek); continue; }
  if (!tradingWeek.trade) {
    tradingWeek = step(tradingWeek, tradingWeek.cursor >= tradingWeek.queue.length || game.remainingMinutes(tradingWeek) < 40 ? 'CLOSE' : 'ARRIVE');
    continue;
  }
  let item = game.currentItem(tradingWeek);
  if (tradingWeek.trade.role === 'seller') {
    for (const axis of ['condition', 'function', 'authenticity']) tradingWeek = inspect(tradingWeek, item.uid, axis);
    item = game.currentItem(tradingWeek);
    const price = reservationPrice(tradingWeek, item);
    if (tradingWeek.cash < price || tradingWeek.inventory.length >= 12 || game.remainingMinutes(tradingWeek) < 10) {
      tradingWeek = step(tradingWeek, 'DISMISS'); continue;
    }
    tradingWeek = step(tradingWeek, 'OFFER', { price });
    tradingWeek = step(tradingWeek, 'DELIVER', { tradeId: tradingWeek.trade.id });
    const freeSlot = displaySlots(tradingWeek.inventory).findIndex(entry => !entry);
    tradingWeek = step(tradingWeek, 'PLACE', { uid: item.uid, slot: freeSlot < 0 ? 0 : freeSlot });
  } else if (item) {
    tradingWeek = step(tradingWeek, 'OFFER', { price: reservationPrice(tradingWeek, item) });
    tradingWeek = step(tradingWeek, 'DELIVER', { tradeId: tradingWeek.trade.id });
  } else tradingWeek = step(tradingWeek, 'DISMISS');
  check(!!parseSave(serializeGame(tradingWeek)), 'Trading-day intermediate state remains saveable');
}
check(tradingWeek.phase === 'ending' && tradingWeek.outcome === 'win' && tradingWeek.sold >= 12, 'The complete trading economy reaches the good ending');
check(tradingWeek.cash === 180 + tradingWeek.ledger.reduce((sum, row) => sum + row.amount, 0), 'Every ticket in the winning run reconciles with the ledger');

// Outcome boundary fixtures exercise the ending thresholds and unpaid-fee path.
let winner = createGame('ENDING');
winner.day = 7; winner.queue = ['lin', 'zhou', 'tao', 'wen', 'que', 'kou', 'lin', 'tao'];
winner.cash = 345; winner.sold = 12; winner.reputation = 40;
winner = step(step(step(winner, 'CLOSE'), 'SETTLE'), 'NEXT');
check(winner.outcome === 'win' && winner.cash === 120, 'Win thresholds apply after the final rent');
let bankrupt = createGame('NO-CASH'); bankrupt.cash = 14;
bankrupt = step(step(step(bankrupt, 'CLOSE'), 'SETTLE'), 'NEXT');
check(bankrupt.outcome === 'bankrupt' && bankrupt.report.missing === 1 && bankrupt.cash === 14, 'Unpayable fees produce a precise shortage without negative cash');

// Old saves migrate without losing UIDs, known evidence, the RNG or shelf positions.
const legacy = JSON.parse(initialText);
legacy.version = 1; delete legacy.schema; delete legacy.completedTrades;
delete legacy.inventory[0].displaySlot; legacy.nextId = 1;
const migrated = parseSave(JSON.stringify(legacy));
check(migrated && migrated.schema === 2 && migrated.inventory[0].uid === legacy.inventory[0].uid && migrated.nextId >= 4, 'Legacy migration preserves IDs and repairs the ID counter');
check(migrated.rng === legacy.rng && migrated.inventory.every(item => item.displaySlot !== undefined), 'Migration preserves RNG and restores legacy shelf slots');
for (const mutation of [
  raw => { raw.inventory.push(raw.inventory[0]); },
  raw => { raw.inventory[0].cost = -1; },
  raw => { raw.rng = 'oops'; },
  raw => { raw.inventory[0].defId = 'BAD'; },
  raw => { raw.inventory[1].displaySlot = raw.inventory[0].displaySlot; },
  raw => { raw.phase = 'ending'; },
  raw => { raw.completedTrades = ['unrecorded-trade']; },
]) {
  const bad = JSON.parse(initialText); mutation(bad);
  check(parseSave(JSON.stringify(bad)) === null, 'Malformed state is rejected');
}
check(parseSave('{bad json') === null && parseSave('x'.repeat(524289)) === null, 'Corrupt and oversized saves fail safely');
console.log(`Greyline model: ${assertions} checks passed`);
