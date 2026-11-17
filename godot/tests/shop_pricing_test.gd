extends SceneTree
const Commerce = preload("res://scripts/model/commerce.gd")
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
 print("SHOP PRICING ", "PASS " if ok else "FAIL ", label)
 if not ok: failures += 1
func loaded(s: Dictionary) -> Dictionary: return JSON.parse_string(JSON.stringify(s))
func fixture(shelf := false, ask := 99999.0) -> Dictionary:
 var s := Model.create("SHOP-PRICING")
 s.inventory = []; s.ap = 10
 for key in ["weeklyMarket","shopUpgrades","shopJournal"]: s.erase(key)
 s.upgrades.shelf = shelf
 var it := Model.new_item(s,"WCH-001",{"condition":0.9,"working":true,"authentic":true,"location":"display","listPrice":ask})
 Model.put_in(s,it); it.location = "display"
 s.trade = {"id":"pricing-visit","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"npcKnowledge":{it.uid:{"condition":0.9,"working":true,"authentic":true,"marketFactor":1.0,"risk":0.0,"evidence":{},"appraisedValue":100,"forgerySignature":""}}}
 return s
func select(s: Dictionary) -> Dictionary: return Model.reduce(s,{"type":"SELECT_TRADE","uid":s.inventory[0].uid})
func batch(s: Dictionary, type: String, extra: Dictionary = {}) -> Dictionary:
 return Commerce.reduce(s,{"type":type,"tradeId":s.trade.id}.merged(extra,true))
func settlement(s: Dictionary) -> Dictionary:
 s = select(s)
 s = Model.reduce(s,{"type":"ACCEPT"})
 return Model.reduce(s,{"type":"DELIVER","tradeId":s.trade.id})
# Reconstruct the pre-change save wire format, independently of the new helper.
func old_fingerprint(it: Dictionary) -> String:
 WatchRules.initialize(it)
 var signature := [String(it.defId),snappedf(float(it.condition),0.000001),bool(it.working),bool(it.authentic),int(it.watch.logo_variant),String(it.watch.serial),snappedf(float(it.watch.mass),0.1),String(it.watch.get("missing_part","")),snappedf(float(it.watch.get("part_mass",0)),0.1),WatchForgery.active(it,"logo"),WatchForgery.active(it,"serial"),WatchForgery.active(it,"weight"),WatchRules.serial(it),snappedf(WatchRules.mass(it),0.1)]
 var refurbished: Array = it.get("refurbishment",{}).get("done",[])
 if not refurbished.is_empty(): signature.append(refurbished)
 if WatchForgery.target_id(it) != "": signature.append(WatchForgery.signature(it))
 if GameData.def(it.defId).get("watch",{}).get("brand","") == "星冕": signature.append(float(GameData.def(it.defId).value))
 return JSON.stringify([JSON.stringify(signature),it.owner,it.sourceVerified,it.sealed,it.location,it.get("orderId",""),it.get("service",{}).get("opened",false)])
func legacy_batch_integrity() -> void:
 var s := fixture(false,70)
 var uid: String = s.inventory[0].uid
 var start_cash: float = s.cash
 s = batch(s,"TRADE_OPEN")
 TradeSession.session(s).cash = 5000; TradeSession.session(s).want_count = 3
 s = batch(s,"TRADE_ADD",{"uid":uid,"direction":"sell"})
 s = batch(s,"TRADE_REVIEW")
 s = batch(s,"TRADE_CONFIRM",{"uid":uid})
 TradeSession.row(s,uid).fingerprint = old_fingerprint(s.inventory[0])
 s = loaded(s)
 var version: int = TradeSession.summary(s).version
 var checked := batch(s,"TRADE_CHECKOUT",{"version":version,"batch":"legacy-format"})
 check(checked.cash == start_cash+70 and Model.find_inventory(checked,uid) == null,"unchanged legacy confirmed batch fingerprint survives JSON reload and real checkout")
 for field in ["authentic","working"]:
  var changed := loaded(s)
  changed.inventory[0][field] = not changed.inventory[0][field]
  var blocked := batch(changed,"TRADE_CHECKOUT",{"version":version,"batch":"changed-"+field})
  check(blocked.cash == start_cash and Model.find_inventory(blocked,uid) != null and blocked.notice.contains("原物状态已变化"),"legacy fingerprint still rejects hidden original mutation %s" % field)
func single_to_batch_snapshot() -> void:
 var s := select(fixture(false,70))
 var uid: String = s.inventory[0].uid
 var factors: Dictionary = s.trade.shopPriceFactors[uid].duplicate(true)
 var known: Dictionary = loaded(s.trade.npcKnowledge[uid])
 var discussion := Model.Negotiation.state(s.trade,s.inventory[0])
 var prior_discussion: Dictionary = loaded(discussion)
 var second := Model.new_item(s,"WCH-001",{"condition":0.9})
 Model.put_in(s,second)
 s = Model.reduce(s,{"type":"SELECT_TRADE","uid":second.uid})
 s = Model.reduce(s,{"type":"PRICE","uid":uid,"price":90})
 s.upgrades.shelf = true
 s = batch(loaded(s),"TRADE_OPEN")
 s = batch(s,"TRADE_ADD",{"uid":uid,"direction":"sell"})
 var context: Dictionary = TradeSession.row(s,uid).context
 check(context.price == 70 and context.get("shopPriceFactors",{}).get(uid,{}) == factors,"single to batch transition keeps a previously selected UID's frozen tag and shelf factors")
 check(context.npcKnowledge.get(uid,{}) == known and context.get("negotiation",{}).get(uid,{}) == prior_discussion,"single to batch transition keeps per-original NPC knowledge and negotiation history")
func run() -> void:
 legacy_batch_integrity()
 single_to_batch_snapshot()
 var base := fixture()
 var shelf := fixture(true)
 var base_terms := Model.trade_terms(base,base.trade,base.inventory[0])
 var shelf_terms := Model.trade_terms(shelf,shelf.trade,shelf.inventory[0])
 check(shelf_terms.opening == floor(base_terms.opening*1.05) and shelf_terms.ceiling == floor(base_terms.ceiling*1.05),"independent shelf adds five percent to fresh displayed sale terms without optional namespaces")
 var before_cash: float = base.cash
 var sold_base := settlement(base)
 var sold_shelf := settlement(shelf)
 check(sold_shelf.cash-before_cash == floor((sold_base.cash-before_cash)*1.05) and sold_shelf.cash>sold_base.cash,"real accept and deliver posts the shelf premium to cash")
 var low := select(fixture(false,70))
 var high := select(fixture(false,90))
 check(low.trade.price == 70 and high.trade.price == 90,"reasonable displayed tags become the single-item accepted starting prices")
 check(Model.trade_terms(low,low.trade,low.inventory[0]).ceiling == Model.trade_terms(high,high.trade,high.inventory[0]).ceiling,"changing the tag cannot raise the NPC ceiling")
 var huge := select(fixture(true))
 var huge_terms := Model.trade_terms(huge,huge.trade,huge.inventory[0])
 check(huge.trade.price == huge_terms.opening and huge.trade.price <= huge_terms.ceiling,"oversized tag falls back to the NPC's own affordable opening")
 var fresh := fixture(false,70)
 var uid: String = fresh.inventory[0].uid
 var original_ap: float = fresh.ap
 var original_cash: float = fresh.cash
 fresh = batch(fresh,"TRADE_OPEN")
 TradeSession.session(fresh).cash = 5000; TradeSession.session(fresh).want_count = 3
 fresh = batch(fresh,"TRADE_ADD",{"uid":uid,"direction":"sell"})
 check(TradeSession.row(fresh,uid).context.price == 70,"batch rows start at a reasonable displayed tag")
 var snapshot: Dictionary = fresh.trade.session.lines[0].context.get("shopPriceFactors",{}).duplicate(true)
 check(snapshot.has(uid) and snapshot[uid].get("listedAsk",0) == 70,"list ask is saved with per-original economic factors")
 fresh = batch(fresh,"TRADE_REMOVE",{"uid":uid})
 fresh = Model.reduce(fresh,{"type":"PRICE","uid":uid,"price":90})
 fresh.upgrades.shelf = true; fresh.shopUpgrades = {"version":1,"extension":"display"}
 fresh = loaded(fresh)
 fresh = batch(fresh,"TRADE_ADD",{"uid":uid,"direction":"sell"})
 fresh = batch(fresh,"TRADE_REVIEW")
 check(TradeSession.row(fresh,uid).context.price == 70 and TradeSession.row(fresh,uid).context.shopPriceFactors == snapshot,"repricing remove/readd and JSON reload preserve same-visit ask and upgrade snapshot")
 check(fresh.ap == original_ap and fresh.cash == original_cash and Model.find_inventory(fresh,uid) != null,"quoting never spends AP cash or transfers originals")
 fresh = batch(fresh,"TRADE_CONFIRM",{"uid":uid})
 fresh.inventory[0].listPrice = 1
 var version: int = TradeSession.summary(fresh).version
 var checked := batch(loaded(fresh),"TRADE_CHECKOUT",{"version":version,"batch":"frozen"})
 check(checked.cash == original_cash+70 and Model.find_inventory(checked,uid) == null,"confirmed batch promise settles the frozen amount after tag and upgrade changes")
 var single := select(fixture(false,70))
 var second := Model.new_item(single,"WCH-001",{"condition":0.9})
 Model.put_in(single,second)
 single = Model.reduce(single,{"type":"SELECT_TRADE","uid":second.uid})
 single = Model.reduce(single,{"type":"PRICE","uid":single.inventory[0].uid,"price":90})
 single.upgrades.shelf = true
 single = select(loaded(single))
 check(single.trade.price == 70,"switching recommendations does not refresh the first UID's frozen ask")
 var stored := fixture(false,70)
 stored.inventory[0].location = "warehouse"
 stored = select(stored)
 var stored_terms := Model.trade_terms(stored,stored.trade,stored.inventory[0])
 stored.inventory[0].location = "display"; stored.upgrades.shelf = true
 var later_terms := Model.trade_terms(stored,stored.trade,stored.inventory[0])
 check(stored_terms == later_terms and stored.trade.get("shopPriceFactors",{}).get(stored.inventory[0].uid,{}).get("listedAsk",-1) == 0,"warehouse first quote freezes a neutral ask and factor before later display changes")
 var old_snapshot := fixture(true,70)
 old_snapshot.trade.shopPriceFactors = {old_snapshot.inventory[0].uid:{"market":1.0,"sale":1.0}}
 old_snapshot = select(old_snapshot)
 check(old_snapshot.trade.price == base_terms.opening,"legacy cached factors never acquire a newly active tag")
 var combined := fixture(true)
 combined.shopUpgrades = {"version":1,"extension":"display"}
 var combined_terms := Model.trade_terms(combined,combined.trade,combined.inventory[0])
 check(combined_terms.ceiling == floor(base_terms.ceiling*1.05*1.08),"shelf and specialty display multipliers compose")
 for changes in [{"location":"warehouse"},{"owner":"customer"},{"owner":"pawn"},{"sourceVerified":false},{"sealed":true},{"location":"isolation"},{"orderId":"held"},{"graySale":true},{"service":{"opened":true}}]:
  var excluded := fixture(true,70)
  excluded.inventory[0].merge(changes,true)
  var without := excluded.duplicate(true); without.upgrades.shelf = false
  check(Model.trade_terms(excluded,excluded.trade,excluded.inventory[0]) == Model.trade_terms(without,without.trade,without.inventory[0]),"shelf excludes restricted or undisplayed original %s" % str(changes))
 var replica := fixture(true)
 replica.inventory[0].authentic = false
 var replica_terms := Model.trade_terms(replica,replica.trade,replica.inventory[0])
 check(replica_terms == shelf_terms,"shelf eligibility does not read hidden authenticity or manufacture a new truth signal")
 for invalid_ask in [0,-1,70.5,100000,"70"]:
  var invalid := select(fixture(true))
  invalid.trade.erase("selectedUid"); invalid.trade.erase("shopPriceFactors")
  invalid.inventory[0].listPrice = invalid_ask
  invalid = select(invalid)
  check(invalid.trade.price == shelf_terms.opening,"invalid tag falls back to ordinary NPC opening %s" % str(invalid_ask))
 var buy := fixture(true,70); buy.trade.kind = "buy"
 var no_shelf := buy.duplicate(true); no_shelf.upgrades.shelf = false
 check(Model.trade_terms(buy,buy.trade,buy.inventory[0]) == Model.trade_terms(no_shelf,no_shelf.trade,no_shelf.inventory[0]),"shelf never changes NPC sell-to-player terms")
 var merchant := fixture(true,1); merchant.trade.kind = "merchant"; merchant.trade.npcId = "CHR-010"
 var plain_merchant := merchant.duplicate(true); plain_merchant.upgrades.shelf = false; plain_merchant.inventory[0].listPrice = 99999
 check(Commerce.recovery_price(merchant,merchant.inventory[0]) == Commerce.recovery_price(plain_merchant,plain_merchant.inventory[0]),"merchant recovery ignores shelf and displayed ask")
 var locked := fixture(true,1); locked.trade.locked = true; locked.trade.selectedUid = locked.inventory[0].uid; locked.trade.price = 70
 locked.shopUpgrades = {"version":1,"extension":"display"}
 var legacy := Model.reduce(loaded(locked),{"type":"DELIVER","tradeId":locked.trade.id})
 check(legacy.cash == locked.cash+70 and legacy.trade == null,"legacy locked promise never acquires a new tag or premium")
 var display := fixture(true,73); display.trade = null; display.inventory[0].location = "warehouse"; display.inventory[0].evidence = ["TOL-001","TOL-002"]
 display = Model.reduce(display,{"type":"DISPLAY","uid":display.inventory[0].uid})
 check(display.inventory[0].location == "display" and display.inventory[0].listPrice == 73,"DISPLAY preserves the manually chosen list price")
 print("SHOP PRICING RESULT ",failures)
 quit(1 if failures else 0)
