extends SceneTree
## Whole-box originals, restricted public observations and atomic settlement.
var failures := 0
var bulk

func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("BULK ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func merchant(seed := "BULK-TEST") -> Dictionary:
	var s := Model.create(seed)
	s.trade = {"id":"bulk-visit", "npcId":"CHR-010", "kind":"merchant", "item":null, "locked":false, "stock":{}, "rare":null}
	s.cash = 100000
	return s
func purchase(s: Dictionary) -> Dictionary:
	return bulk.reduce(s, {"type":"BUY_BULK_CRATE", "id":bulk.offer(s).id})
func sample(s: Dictionary, index) -> Dictionary:
	return bulk.reduce(s, {"type":"SAMPLE_BULK_CRATE", "index":index})
func unchanged(a: Dictionary, b: Dictionary) -> bool:
	return a.cash == b.cash and a.ap == b.ap and a.inventory == b.inventory and a.nextId == b.nextId
func run() -> void:
	check(ResourceLoader.exists("res://scripts/model/bulk_crates.gd"), "whole-box module exists")
	if failures: quit(1); return
	bulk = load("res://scripts/model/bulk_crates.gd")
	var s := merchant()
	var before := s.duplicate(true)
	var view: Dictionary = bulk.offer(s)
	check(unchanged(s,before) and view.itemCount == 4 and view.sampleLimit == 2, "preview keeps cash, AP, originals and ID counter untouched")
	check(JSON.stringify(view) == JSON.stringify(bulk.offer(s)), "reopening keeps exactly the saved public lot")
	var fresh := merchant()
	check(JSON.stringify(view) == JSON.stringify(bulk.offer(fresh)), "seed and day deterministically reproduce the lot")
	var restored: Dictionary = JSON.parse_string(JSON.stringify(s))
	check(JSON.stringify(view) == JSON.stringify(bulk.offer(restored)), "JSON replay does not reroll the offer")
	var public_text := JSON.stringify(view)
	check(not public_text.contains("authentic") and not public_text.contains("missing_part") and not public_text.contains("cost") and not public_text.contains("fault") and not public_text.contains("value"), "public offer contains no secret truth or valuations")
	var originals: Array = s.bulkCrates.days[Model.jnum(s.day)].items.duplicate(true)
	var uids := []
	for original in originals: uids.append(original.uid)
	check(Model.uniq(uids).size() == 4 and not s.inventory.any(func(it):return it.uid in uids), "four reserved originals have unique IDs outside warehouse stock")
	var collision := merchant()
	collision.inventory[0].uid = uids[0]
	bulk.ensure(collision)
	check(collision.bulkCrates.days["1"].items[0].uid != uids[0] and collision.nextId == s.nextId, "reservation avoids an existing UID without consuming the ordinary ID sequence")
	var sampled := sample(s,0)
	check(sampled.ap == s.ap-1 and bulk.offer(sampled).sampleCount == 1 and bulk.offer(sampled).samples.size() == 1, "sampling records one supported observation for one AP")
	check(unchanged(sampled,sample(sampled,0)), "repeating an existing sample is free")
	var twice := sample(sampled,2)
	var replayed_samples: Dictionary = JSON.parse_string(JSON.stringify(twice))
	check(JSON.stringify(bulk.offer(twice)) == JSON.stringify(bulk.offer(replayed_samples)), "sampled readings survive JSON replay unchanged")
	var capped := sample(twice,1)
	check(unchanged(twice,capped) and bulk.offer(capped).sampleCount == 2 and capped.notice != twice.notice, "only two distinct originals may be sampled")
	for bad in [-1,4,0.5,"0",null,true]:
		check(unchanged(s,sample(s,bad)), "invalid sample index %s cannot mutate money or stock" % str(bad))
	check(bulk.reduce(s,{"type":"BULK_UNKNOWN"}) == null, "unknown action is unhandled")
	for change in [{"cash":0},{"ap":0},{"phase":"closed"},{"trade":null},{"trade":{"kind":"buy"}},{"trade":{"kind":"merchant","inspectionVisit":true}}]:
		var denied := s.duplicate(true)
		denied.merge(change,true)
		var blocked := purchase(denied)
		check(unchanged(denied,blocked) and not blocked.notice.is_empty(), "purchase guard reports %s" % str(change))
	var absent := Model.create("ABSENT")
	check(not bulk.offer(absent).problem.is_empty(), "absent merchant still has a safe visit-required preview")
	check(unchanged(absent,sample(absent,0)), "sampling requires the ordinary merchant visit")
	var no_ap := s.duplicate(true); no_ap.ap=0
	check(unchanged(no_ap,sample(no_ap,0)), "sampling needs one AP")
	check(unchanged(s,bulk.reduce(s,{"type":"BUY_BULK_CRATE","id":"old-lot"})), "stale lot ID cannot purchase")
	check(unchanged(s,bulk.reduce(s,{"type":"BUY_BULK_CRATE","id":5})), "wrong ID type cannot purchase")
	var collision_after := s.duplicate(true)
	collision_after.inventory[0].uid = uids[0]
	check(unchanged(collision_after,purchase(collision_after)), "later UID conflict blocks cloning an existing physical object")
	var stolen := s.duplicate(true)
	stolen.bulkCrates.days["1"].items[0].crimeRevealed = true
	check(unchanged(stolen,purchase(stolen)), "known stolen provenance cannot be laundered by box purchase")
	var full := twice.duplicate(true)
	full.inventory.clear()
	for i in 29: Model.put_in(full,Model.new_item(full,"WCH-002"))
	var rolled_back := purchase(full)
	check(unchanged(full,rolled_back) and not bulk.offer(rolled_back).purchased, "partial placement failure rolls back all four, cash, AP and purchase status")
	var pending := s.duplicate(true)
	TradeSession.ensure(pending)
	pending.trade.session.lines.append({"uid":"pending", "selected":true,"status":"confirmed","included":true})
	check(unchanged(pending,purchase(pending)), "confirmed pending batch commitments prevent box settlement")
	var bought := purchase(twice)
	check(bought.inventory.size() == twice.inventory.size()+4 and bought.cash == twice.cash-view.price and bought.ap == twice.ap-1 and bulk.offer(bought).purchased, "whole box settles once for quoted price and one AP")
	var retained := true
	var costs := 0
	for original in originals:
		var acquired = Model.find_inventory(bought,original.uid)
		if acquired == null: retained=false; continue
		for key in ["defId","authentic","condition","working","watch","service"]: retained = retained and acquired.get(key) == original.get(key)
		retained = retained and acquired.owner == "shop" and acquired.sourceVerified and not acquired.get("customerOwned",false) and not acquired.has("pawn")
		costs += int(acquired.cost)
	check(retained, "purchased originals retain sampled physical facts, identity and merchant provenance")
	check(costs == int(view.price), "allocated acquisition costs sum exactly to whole-box price")
	var postings: Array = bought.ledger.filter(func(entry):return entry.kind == "bulk-purchase")
	check(postings.size() == 1 and postings[0].itemUids == uids and postings[0].bulkPurchase and postings[0].amount == -view.price, "one bulk purchase posting records all original UIDs")
	check(unchanged(bought,purchase(bought)), "duplicate buy cannot charge or clone stock")
	var with_session := s.duplicate(true)
	TradeSession.ensure(with_session)
	var npc_cash: float = with_session.trade.session.cash
	var session_version: float = with_session.trade.session.version
	var paid := purchase(with_session)
	check(paid.trade.session.cash == npc_cash+view.price and paid.npcTrade[paid.trade.npcId].cash == npc_cash+view.price and paid.trade.session.version == session_version+1, "live session and NPC cash both receive exactly the price")
	var record_only := s.duplicate(true)
	record_only.npcTrade = {"CHR-010":{"cash":573,"owned":[]}}
	var record_paid := purchase(record_only)
	check(record_paid.npcTrade["CHR-010"].cash == 573+view.price and not record_paid.trade.has("session"), "existing NPC money updates even without opening a session")
	var odd_price := s.duplicate(true)
	odd_price.bulkCrates.days["1"].price = 163
	var odd_paid := purchase(odd_price)
	var odd_cost := 0
	for uid in uids: odd_cost += int(Model.find_inventory(odd_paid,uid).cost)
	check(odd_cost == 163 and odd_paid.cash == odd_price.cash-163, "indivisible lot price allocates its remainder without losing credits")
	var tomorrow := bought.duplicate(true); tomorrow.day += 1
	var next_offer: Dictionary = bulk.offer(tomorrow)
	var next_uids := []
	for it in tomorrow.bulkCrates.days[Model.jnum(tomorrow.day)].items: next_uids.append(it.uid)
	check(next_offer.id != view.id and not next_offer.purchased and not next_uids.any(func(uid):return uid in uids), "new day offers a distinct physical box without reusing acquired UIDs")
	print("BULK failures=",failures)
	quit(1 if failures else 0)
