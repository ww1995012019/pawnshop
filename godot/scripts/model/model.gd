class_name Model
extends Node
## Base gameplay rules. State is a JSON-shaped Dictionary.
## Live commerce and crime events are layered in commerce.gd and crime_events.gd.

const MASK := 0xFFFFFFFF
const FACTIONS := ["station", "salvage", "merchant"]
const Negotiation = preload("res://scripts/model/negotiation.gd")
const Market = preload("res://scripts/model/weekly_market.gd")
const Extensions = preload("res://scripts/model/shop_upgrades.gd")
const Journal = preload("res://scripts/model/shop_journal.gd")
const FIXED_EVENT_DAYS := {1: "EVT-001", 7: "EVT-007", 14: "EVT-014", 20: "EVT-020", 21: "EVT-021"}

# Only actual business commands produce a closed-hours notice; unknown input stays a no-op.
const BUSINESS_ACTIONS := ["CHOOSE_EVENT", "EMERGENCY_SALE", "ARRIVE", "SELECT_TRADE", "CHECK", "OFFER", "ACCEPT", "DELIVER", "PAWN", "REDEEM", "REFUSE", "MOVE", "DISPLAY", "PRICE", "ISOLATE", "SCAN", "REGISTER", "RETURN_ITEM", "REFURB_PROGRESS", "REFURB_COMPLETE", "SERVICE_BEGIN", "SERVICE_PROGRESS", "SERVICE_COMPLETE", "SERVICE_FINISH", "REPAIR_STEP", "REPAIR", "DISMANTLE", "CRAFT", "TAKE_ORDER", "DELIVER_ORDER", "BUY_MATERIAL", "SETTLE"]

# ------------------------------------------------------------ JS semantics

static func fnv(s: String) -> int:
	var n := 2166136261
	for i in s.length():
		n = (n ^ s.unicode_at(i)) & MASK
		n = (n * 16777619) & MASK
	return n

static func lcg(n: int) -> int:
	return (((n * 1664525) & MASK) + 1013904223) & MASK

## Math.round
static func jround(x: float) -> float:
	return floor(x + 0.5)

## `${n}` for numbers.
static func jnum(x) -> String:
	var f := float(x)
	if f == floor(f) and absf(f) < 1e15:
		return str(int(f))
	# Shortest decimal that round-trips, like JavaScript's Number#toString.
	for d in range(1, 18):
		var t := String.num(f, d)
		if t.to_float() == f:
			return t
	return String.num_scientific(f)

static func clampn(n: float, lo := 0.0, hi := 100.0) -> float:
	return maxf(lo, minf(hi, n))

static func valid_price(n) -> bool:
	return (typeof(n) == TYPE_INT or typeof(n) == TYPE_FLOAT) and float(n) == floor(float(n)) and n > 0 and n <= 10000000

static func D(id: String) -> Dictionary:
	return GameData.def(id)

static func uniq(a: Array) -> Array:
	var out := []
	for x in a:
		if not out.has(x):
			out.append(x)
	return out

# ------------------------------------------------------------ small helpers

static func notice(s: Dictionary, text: String) -> Dictionary:
	s.notice = text
	return s

static func next_id(s: Dictionary, prefix: String) -> String:
	var id := "%s-%s" % [prefix, jnum(s.nextId)]
	s.nextId = int(s.nextId) + 1
	return id

static func has_ap(s: Dictionary, n: float) -> bool:
	return s.ap >= n

static func owns(it: Dictionary) -> bool:
	return it.owner == "shop"

static func trade_reserved(s: Dictionary, it: Dictionary) -> bool:
	if s.trade!=null and s.trade.get("session") is Dictionary:
		for line in s.trade.session.get("lines",[]):
			if line.uid==it.uid and line.get("selected",false) and line.get("status","")=="confirmed": return true
		return false
	return s.trade != null and s.trade.get("selectedUid", null) == it.uid

static func evidence_count(it: Dictionary) -> int:
	return uniq(it.evidence).size()

static func spend(s: Dictionary, n: float) -> void:
	s.ap -= n

static func ledger(s: Dictionary, id: String, kind: String, label: String, amount: float, cost := 0.0) -> bool:
	for r in s.ledger:
		if r.id == id:
			return false
	s.cash += amount
	s.ledger.append({"id": id, "day": s.day, "kind": kind, "label": label, "amount": amount, "cost": cost, "transactionId": id})
	return true

static func new_item(s: Dictionary, id: String, options := {}) -> Dictionary:
	var def := D(id)
	var it := {"uid": next_id(s, "item"), "defId": id, "owner": "shop", "condition": 0.8, "working": true, "authentic": true, "sourceVerified": true, "source": "回环九号旧港登记批次", "evidence": [], "inspectedPaid": false, "repaired": false, "location": "warehouse", "x": 0, "y": 0, "rotated": false, "listPrice": ceil(def.value * 0.88), "cost": 0, "sealed": false}
	for k in options:
		it[k] = options[k]
	WatchRules.initialize(it, s.seed)
	WatchService.ensure(it, s.seed)
	return it

static func dimensions(it: Dictionary, rotated = null) -> Array:
	var r: bool = it.rotated if rotated == null else rotated
	var sz: Array = D(it.defId).size
	return [sz[1], sz[0]] if r else [sz[0], sz[1]]

static func _overlaps(s: Dictionary, uid: String, x: int, y: int, w: int, h: int) -> bool:
	for o in s.inventory:
		if o.uid == uid or o.location != "warehouse":
			continue
		var od := dimensions(o)
		if x < o.x + od[0] and x + w > o.x and y < o.y + od[1] and y + h > o.y:
			return true
	return false

static func can_place(s: Dictionary, uid: String, x, y, rotated = null) -> bool:
	var it = find_inventory(s, uid)
	if it == null and s.trade != null and s.trade.item != null and s.trade.item.uid == uid:
		it = s.trade.item
	if it == null:
		return false
	if float(x) != floor(float(x)) or float(y) != floor(float(y)):
		return false
	var d := dimensions(it, it.rotated if rotated == null else rotated)
	if x < 0 or y < 0 or x + d[0] > 10 or y + d[1] > Extensions.storage_rows(s):
		return false
	return not _overlaps(s, uid, int(x), int(y), d[0], d[1])

static func empty_cell(s: Dictionary, it: Dictionary):
	var d := dimensions(it)
	for y in range(0, Extensions.storage_rows(s) - d[1] + 1):
		for x in range(0, 10 - d[0] + 1):
			if not _overlaps(s, it.uid, x, y, d[0], d[1]):
				return {"x": x, "y": y}
	return null

static func put_in(s: Dictionary, it: Dictionary) -> bool:
	var pos = empty_cell(s, it)
	if pos == null:
		return false
	it.location = "warehouse"
	it.x = pos.x
	it.y = pos.y
	s.inventory.append(it)
	return true

static func find_inventory(s: Dictionary, uid):
	for it in s.inventory:
		if it.uid == uid:
			return it
	return null

static func find_item(s: Dictionary, uid):
	var it = find_inventory(s, uid)
	if it != null:
		return it
	if s.trade!=null and s.trade.get("session") is Dictionary:
		for lot in s.trade.session.get("goods",[]):
			if lot.uid==uid: return lot
		return null
	if s.trade != null and s.trade.item != null and s.trade.item.uid == uid:
		return s.trade.item
	return null

static func item_value(it: Dictionary) -> float:
	var missing := not String(it.get("watch", {}).get("missing_part", "")).is_empty()
	return maxf(1, jround(D(it.defId).value * clampn(it.condition, 0.35, 1) * (1.0 if it.working else 0.5) * (1.0 if it.authentic else 0.6) * (0.85 if missing else 1.0)))

## A loupe observation belongs to the physical mark, independent of repairs,
## serial overprinting or ballast. Kept in the existing saved evidence snapshot.
static func logo_revision(it: Dictionary) -> String:
	WatchRules.initialize(it)
	return JSON.stringify([String(it.defId), int(it.watch.logo_variant), WatchForgery.active(it, "logo"), WatchForgery.logo_id(it)]) if WatchForgery.target_id(it)!="" else JSON.stringify([String(it.defId), int(it.watch.logo_variant), WatchForgery.active(it, "logo")])

static func appraisal_revision(it: Dictionary) -> String:
	WatchRules.initialize(it)
	var signature := [String(it.defId), snappedf(float(it.condition), 0.000001), bool(it.working), bool(it.authentic), int(it.watch.logo_variant), String(it.watch.serial), snappedf(float(it.watch.mass), 0.1), String(it.watch.get("missing_part", "")), snappedf(float(it.watch.get("part_mass", 0)), 0.1), WatchForgery.active(it,"logo"), WatchForgery.active(it,"serial"), WatchForgery.active(it,"weight"), WatchRules.serial(it), snappedf(WatchRules.mass(it), 0.1)]
	var refurbished: Array = it.get("refurbishment",{}).get("done",[])
	if not refurbished.is_empty(): signature.append(refurbished)
	if WatchForgery.target_id(it)!="": signature.append(WatchForgery.signature(it))
	if D(it.defId).get("watch",{}).get("brand","")=="星冕": signature.append(float(D(it.defId).value))
	return JSON.stringify(signature)

static func estimate(it: Dictionary) -> Dictionary:
	var base: float = D(it.defId).value
	var low := maxf(1, floor(base * 0.05))
	var high := maxf(low + 1, ceil(base))
	var count := 0
	var value := 0.0
	var revision := appraisal_revision(it)
	for tool in ["TOL-001", "TOL-002", "TOL-005"]:
		var facts: Dictionary = it.get("inspectionFacts", {}).get(tool, {})
		if it.evidence.has(tool) and facts.get("appraisalRevision", "") == revision and facts.has("appraisalValue"):
			count += 1
			value = facts.appraisalValue
	# Binary buckets are nested, include the recorded value, and never use
	# hidden price information before the first current inspection.
	for step in count:
		if high - low <= 1: break
		var midpoint: float = floor((low + high) * 0.5)
		if value <= midpoint: high = midpoint
		else: low = midpoint + 1
	return {"low":low, "high":high, "exact":false, "count":count}

static func appraisal_text(it: Dictionary) -> String:
	var appraisal := estimate(it)
	return "估价 %s–%s Cr · 当前检验%d/3项" % [jnum(appraisal.low), jnum(appraisal.high), appraisal.count]

static func available_orders(s: Dictionary) -> Array:
	var out := []
	for d in GameData.orders:
		var o = _order_state(s, d.id)
		if float(GameData.order_earliest.get(d.id, 1)) <= s.day and order_due(s,d.id) >= s.day and o != null and o.status == "available":
			out.append(d)
	return out

static func _order_state(s: Dictionary, id: String):
	for o in s.orders:
		if o.id == id:
			return o
	return null

static func finish_trade(s: Dictionary, text: String) -> Dictionary:
	TradeSession.persist_holdings(s)
	s.trade = null
	s.cursor += 1
	s.tutorial = maxf(s.tutorial, 1)
	return notice(s, text)

static func inspection_ready(s: Dictionary) -> bool:
	for it in s.inventory:
		if it.owner == "shop" and not it.sourceVerified and not it.get("graySale",false) and it.location != "isolation":
			return false
	return true

static func rent_due(day: float) -> float:
	# The original three rents are unchanged; continued weeks stop at 900 Cr.
	# Bound the exponent too, so very long-running saves never overflow.
	return minf(900,jround(450 * pow(1.1, minf(8,floor((day - 1) / 7.0))))) if int(day) % 7 == 0 else 0.0

# ------------------------------------------------------------ negotiation

static func trade_item(s: Dictionary, t = null):
	if t == null:
		t = s.trade
	if t == null:
		return null
	if t.get("session") is Dictionary: return find_item(s,t.session.get("focus",""))
	if t.kind == "sell":
		return find_inventory(s, t.get("selectedUid", ""))
	return t.item

static func relevant_evidence(it: Dictionary, used: Array) -> Array:
	var out := []
	for e in uniq(used):
		if it.evidence.has(e) and GameData.relevant_tool(it.defId, e):
			out.append(e)
	return out

static func customer_need(npc_id: String) -> String:
	var p := GameData.npc(npc_id)
	if p.has("desire") and (p.has("purchase") or p.get("role", "") == "supplier"):
		return p.desire
	if npc_id == "CHR-002" or npc_id == "CHR-004":
		return "回收零件与旧设备，可收故障品；来源必须清楚"
	if npc_id == "CHR-003":
		return "站务采购：正品、功能正常、品相至少65%"
	return "整备与收藏：正品、功能正常、品相至少55%"

## Only a buyer's first impression changes; the owned item's true fields and
## all inspection/order calculations remain untouched.
static func sale_appearance(it: Dictionary) -> Dictionary:
	# Visible wear and the stated history are public. Internal truth is not.
	var claims: Dictionary = it.get("claims", {})
	var view := {"condition": float(it.condition), "working": claims.get("working", true), "authentic": claims.get("authentic", true)}

	return view

static func watch_expertise(npc_id: String) -> Dictionary:
	return GameData.npc(npc_id).get("expertise", {}).get("watch", {"logo": 20, "serial": 20, "structure": 20, "market": 30})

static func npc_knowledge(t: Dictionary, it: Dictionary) -> Dictionary:
	var all_known: Dictionary = t.get("npcKnowledge", {})
	if not all_known.has(it.uid) or all_known[it.uid].get("forgerySignature","") != (WatchForgery.signature(it) if WatchForgery.is_targeted(it) else ""):
		var learned: Dictionary=all_known.get(it.uid,{}).duplicate(true)
		var visible := sale_appearance(it)
		var expertise := watch_expertise(t.npcId)
		var specialist := maxf(float(expertise.market), maxf(float(expertise.logo), maxf(float(expertise.serial), float(expertise.structure)))) >= 80.0
		var key := "%s/%s/%s" % [t.npcId, t.id, it.uid]
		var recognized := fnv(key + "/appraisal-recognition-v1") % 100 < (85 if specialist else 20)
		var grade := ("accurate" if specialist else "rough") if recognized else "impression"
		var error := float(int(fnv(key + "/appraisal-error") % 25) - 12) / 100.0
		if not specialist and recognized and absf(error) < 0.03: error = 0.06
		var market_error := (float(fnv(key + "/market-belief") % 61) - 30.0) / 100.0
		market_error *= 1.0 - float(expertise.market) / 150.0
		var ref := WatchRules.model_reference(WatchForgery.target_id(it) if WatchForgery.is_targeted(it) else String(it.defId))
		var visible_risks := {"TOL-001":0.18 * float(expertise.logo) / 100.0 if WatchRules.logo_variant(it) else 0.0,
			"TOL-002":0.22 * float(expertise.serial) / 100.0 if not WatchRules.serial(it).begins_with("%s %s " % [ref.serial_prefix, ref.model]) else 0.0,
			"TOL-005":0.16 * float(expertise.structure) / 100.0 if absf(WatchRules.mass(it) - float(ref.nominal_mass)) > float(ref.tolerance) else 0.0}
		var visible_risk := 0.0
		for assessment in visible_risks.values(): visible_risk += float(assessment)
		var prior: Dictionary = it.get("npcKnowledge", {}).get(t.npcId, {})
		all_known[it.uid] = {"condition":prior.get("condition", visible.condition), "working":prior.get("working", visible.working), "authentic":prior.get("authentic", visible.authentic),
			"marketFactor":1.0 + market_error, "evidence":{}, "risk":clampf(visible_risk,0,0.45), "visibleRisks":visible_risks, "appraisalGrade":grade,
			"appraisalError":0.0 if specialist else error, "forgerySignature":WatchForgery.signature(it) if WatchForgery.is_targeted(it) else ""}
		if recognized and not WatchForgery.is_targeted(it): all_known[it.uid].appraisedValue = maxf(1, jround(item_value(it) * (1.0 if specialist else 1.0 + error)))
		if learned.get("identityRevealed",false):
			all_known[it.uid].identityRevealed=true
			all_known[it.uid].evidence=learned.get("evidence",{}).duplicate(true)
			all_known[it.uid].appraisalGrade=learned.get("appraisalGrade","impression")
			all_known[it.uid].appraisalError=learned.get("appraisalError",0)
			all_known[it.uid].appraisedValue=maxf(1,jround(item_value(it)*(1.0+float(learned.get("appraisalError",0)))))
		t.npcKnowledge = all_known
	return all_known[it.uid]

static func record_inspection(it: Dictionary, tool: String) -> Dictionary:
	var facts := {"condition":sale_appearance(it).condition, "appraisalRevision":appraisal_revision(it), "appraisalValue":item_value(it), "tampered":WatchForgery.trace(it, tool) != "", "originalDefId":String(it.defId)}
	match tool:
		"TOL-001":
			facts.logo_variant = WatchRules.logo_variant(it)
			facts.logoRevision = logo_revision(it)
		"TOL-002": facts.serial = WatchRules.serial(it)
		"TOL-005": facts.mass = WatchRules.mass(it)
	var readings: Dictionary = it.get("evidenceReadings", {})
	var snapshots: Dictionary = it.get("inspectionFacts", {})
	readings[tool] = WatchRules.reading(it, tool)
	snapshots[tool] = facts
	it.evidenceReadings = readings
	it.inspectionFacts = snapshots
	return facts

static func disclose_evidence(t: Dictionary, it: Dictionary, tool: String) -> void:
	var known := npc_knowledge(t, it)
	# Compatibility with initial direct-rule fixtures/early watch saves: establish
	# one first snapshot. Subsequent disclosures always use recorded facts.
	var snapshots: Dictionary = it.get("inspectionFacts", {})
	var facts: Dictionary = snapshots[tool] if snapshots.has(tool) else record_inspection(it.duplicate(true), tool)
	if not snapshots.has(tool):
		facts.erase("appraisalRevision")
		facts.erase("appraisalValue")
	if known.evidence.has(tool) and known.evidence[tool].get("facts", {}) == facts:
		return
	var ref := WatchRules.model_reference(it.defId)
	var expertise := watch_expertise(t.npcId)
	var strength := 0.0
	match tool:
		"TOL-001":
			strength = (0.16 if facts.logo_variant else -0.025) * float(expertise.logo) / 100.0
		"TOL-002":
			var expected := "%s %s " % [ref.serial_prefix, ref.model]
			strength = (0.19 if not String(facts.serial).begins_with(expected) else -0.025) * float(expertise.serial) / 100.0
		"TOL-005":
			var difference := absf(float(facts.mass) - float(ref.nominal_mass))
			strength = (0.13 if difference > float(ref.tolerance) else -0.02) * float(expertise.structure) / 100.0
	if facts.get("tampered", false):
		var skill: String = "logo" if tool == "TOL-001" else "serial" if tool == "TOL-002" else "structure"
		strength = maxf(strength, 0.28 * float(expertise[skill]) / 100.0)
	if known.get("appraisalGrade", "impression") != "impression" and facts.get("appraisalRevision", "") == appraisal_revision(it):
		# An able buyer reassesses this watch from current shared observations;
		# an old/private player price snapshot is never their source of truth.
		known.appraisedValue = maxf(1, jround(item_value(it) * (1.0 + float(known.get("appraisalError", 0)))))
	known.evidence[tool] = {"reading": it.get("evidenceReadings", {}).get(tool, WatchRules.reading(it, tool)), "facts": facts.duplicate(true), "adjustment": strength}
	if WatchForgery.is_targeted(it) and facts.get("appraisalRevision","")==appraisal_revision(it) and facts.get("originalDefId","")==it.defId:
		known.identityRevealed=true
		known.appraisedValue=maxf(1,jround(item_value(it)*(1.0+float(known.get("appraisalError",0)))))
	var total := 0.0
	for channel in ["TOL-001", "TOL-002", "TOL-005"]:
		total += float(known.evidence[channel].adjustment) if known.evidence.has(channel) else float(known.get("visibleRisks", {}).get(channel, 0))
	known.risk = clampf(total, -0.08, 0.45)
	# Wear is refreshed only with newly recorded and explicitly presented facts.
	known.condition = facts.condition

static func sale_eligibility(it: Dictionary, npc_id: String):
	if it.get("service", {}).get("opened", false):
		return "后盖或内部装配尚未收妥，请先完成工作台复核并封盖。"
	if it.owner != "shop" or it.has("orderId"):
		return "受托、抵押或订单预留的物品不能出售。"
	if it.sealed or it.location == "isolation" or (not it.sourceVerified and not it.get("graySale",false)):
		return "先解除封存并核验来源，顾客才会收货。"
	var apparent := sale_appearance(it)
	var demand = GameData.npc(npc_id).get("purchase", null)
	if demand != null:
		if demand.has("categories") and not demand.categories.has(D(it.defId).category):
			return "这件货物不在这位顾客的采购范围内，可从人物档案查看需求。"
		if demand.authentic and not apparent.authentic:
			return "这位顾客要求正品，请补齐鉴定或选择其他货物。"
		if demand.working and not apparent.working:
			return "这位顾客需要功能正常的设备，请先维修或换货。"
		if apparent.condition < demand.minCondition:
			return "这位顾客要求品相至少 %s%%。" % jnum(jround(demand.minCondition * 100))
	if npc_id == "CHR-003" or npc_id == "CHR-005":
		if not apparent.authentic:
			return "这位顾客要求正品，无法按此采购。可寻找零件回收客。"
		if not apparent.working:
			return "这位顾客要能正常工作的设备，请先维修或换货。"
		if apparent.condition < (0.65 if npc_id == "CHR-003" else 0.55):
			return "品相未达到这位顾客的采购要求。"
	return null

static func _shop_price_factors(s: Dictionary, t: Dictionary, it: Dictionary) -> Dictionary:
	var neutral := {"market":1.0,"sale":1.0}
	if t.get("shopPriceFactors",{}).has(it.uid): return t.shopPriceFactors[it.uid]
	# Old locked promises predate these systems. Enabling a namespace on load
	# must never invalidate an already agreed single-item or batch-line price.
	if t.get("locked",false): return neutral
	if s.get("trade") is Dictionary:
		for line in s.trade.get("session",{}).get("lines",[]):
			if line.get("uid","") == it.uid and line.get("status","") == "confirmed" and line.get("context",{}).get("id","") == t.get("id",""): return neutral
	if not s.get("weeklyMarket") is Dictionary and not s.get("shopUpgrades") is Dictionary and not s.get("shopJournal") is Dictionary: return neutral
	var factors := {"market":Market.multiplier(s,it),"sale":1.0}
	if t.get("kind","") == "sell":
		factors.sale = Extensions.sale_multiplier(s,it)
		if s.get("shopJournal") is Dictionary: factors.sale *= Journal.price_multiplier(s,String(t.npcId))
	if not t.get("shopPriceFactors") is Dictionary: t.shopPriceFactors = {}
	t.shopPriceFactors[it.uid] = factors
	return factors

static func trade_terms(s: Dictionary, t: Dictionary, it: Dictionary) -> Dictionary:
	var def := D(it.defId)
	var priced := npc_knowledge(t, it)
	var value := maxf(1, jround(WatchForgery.perceived_base(it) * clampf(float(priced.condition), 0.35, 1.0) * (1.0 if priced.working else 0.65) * (1.0 if priced.authentic else 0.75) * float(priced.marketFactor) * (1.0 - float(priced.risk))))
	if priced.has("appraisedValue"):
		value = float(priced.appraisedValue)
	var shop_factors := _shop_price_factors(s,t,it)
	value *= float(shop_factors.market)
	var proof: int = priced.evidence.size()
	var faction: String = GameData.npc(t.npcId).faction
	var relation := maxf(0, minf(100, s.relations[faction]))
	var variation := ((fnv("%s|%s|%s|%s" % [s.seed, t.id, it.uid, t.npcId]) % 7) - 3) / 100.0
	var market_cap := maxf(1, minf(99999, ceil(WatchForgery.perceived_base(it) * 2)))
	var floor_p := maxf(1, ceil(value * (0.68 + variation - minf(0.09, proof * 0.03))))
	var ceiling := maxf(1, floor(value * ((0.98 if faction == "salvage" else 1.04) + variation + minf(0.09, proof * 0.03) + relation * 0.0003)))
	var opening := maxf(1, minf(ceiling, floor(value * (0.78 + variation))))
	var provenance := Negotiation.provenance(priced, it)
	var source_adjustment := 0.03 if provenance == "verified" else -0.06 if provenance == "contradictory" else -0.03 if provenance == "unverified" else 0.0
	ceiling = maxf(1, floor(ceiling + value * source_adjustment))
	floor_p = maxf(1, ceil(floor_p + value * minf(0, source_adjustment)))
	opening = minf(opening, ceiling)
	if float(shop_factors.sale) != 1.0:
		ceiling = maxf(1,floor(ceiling * float(shop_factors.sale)))
		opening = minf(ceiling,maxf(1,floor(opening * float(shop_factors.sale))))
	return {"value": value, "floor": floor_p, "ceiling": ceiling, "opening": opening, "marketCap": market_cap, "proof": proof, "provenance": provenance}

static func offer_bounds(s: Dictionary, t: Dictionary, it: Dictionary) -> Dictionary:
	var terms := trade_terms(s, t, it)
	return {"min": 1, "max": minf(terms.marketCap, floor(s.cash)) if t.kind == "buy" else terms.marketCap}

static func price_agreed(s: Dictionary, t: Dictionary, it: Dictionary, price = null) -> bool:
	if t.get("negotiation", {}).get(it.uid, {}).get("status", "") == "rejected": return false
	var p = t.price if price == null else price
	var terms := trade_terms(s, t, it)
	return float(p) == floor(float(p)) and p >= 1 and p <= terms.marketCap and (p <= terms.ceiling if t.kind == "sell" else p >= terms.floor)

static func counter_price(s: Dictionary, t: Dictionary, it: Dictionary) -> float:
	var terms := trade_terms(s, t, it)
	var discussion: Dictionary = t.get("negotiation", {}).get(it.uid, {})
	var step := maxf(1, ceil(terms.value * (0.03 + minf(0.03, terms.proof * 0.01))))
	var previous_quote := float(discussion.get("lastCounter", t.price))
	if t.kind == "sell":
		return minf(terms.ceiling, maxf(terms.opening, previous_quote) + step)
	return maxf(terms.floor, minf(terms.marketCap, previous_quote) - step)

# ------------------------------------------------------------ market

static func daily_visit_limit(s: Dictionary = {}) -> int:
	return preload("res://scripts/model/visit_schedule.gd").limit(s)

static func market_stock(s: Dictionary, day = null, slot = null) -> Dictionary:
	var dd: int = int(s.day if day == null else day)
	var sl: int = int(s.cursor if slot == null else slot)
	var opening := [["WCH-001", "WCH-002"], ["WCH-007", "WCH-008"], ["WCH-013", "WCH-014"]]
	if dd <= 3 and sl < 4:
		var def_id: String = opening[dd - 1][sl / 2]
		var unverified := dd == 3 and sl == 0
		return {"defId": def_id, "condition": 0.65 if sl == 0 else 0.8, "working": sl != 0, "authentic": not (dd == 2 and sl == 2), "sourceVerified": not unverified,
			"source": "封签批次与旧港注销清单待比对" if unverified else "供货人登记回执 / 旧港回收批次", "price": jround(D(def_id).value * (0.42 if sl == 0 else 0.7))}
	var supply_key := "market/%d/%d" % [dd,sl]
	var def_id := WatchSupply.pick(s.seed, supply_key)
	var key := "%s/%d/%d/physical-v1" % [s.seed, dd, sl]
	var draw := func(tag: String) -> float: return fnv(key + "/" + tag) / 4294967296.0
	var condition := jround((0.45 + draw.call("wear") * 0.5) * 100) / 100.0
	var working: bool = draw.call("working") >= 0.35
	var authentic := WatchSupply.authentic(s.seed, supply_key)
	var verified: bool = draw.call("source") >= 0.28
	var origins := ["港务退役设备清单", "拾荒船舱回收批次", "维修工备件清库", "居民搬舱转让回执"]
	var origin: String = origins[int(floor(draw.call("origin") * origins.size()))]
	var lot := "MKT-%08X-%d-%d" % [fnv(s.seed), dd, sl]
	var price := maxf(1, jround(D(def_id).value * (0.48 + draw.call("ask") * 0.27)))
	return {"defId": def_id, "condition": condition, "working": working, "authentic": authentic, "sourceVerified": verified,
		"source": "%s / %s · %s" % [origin, "回执已核对" if verified else "回执待补证", lot], "price": price, "lotId": lot}

static func stock_preview(s: Dictionary, day = null, slot = null) -> Dictionary:
	var stock := market_stock(s, day, slot)
	var value: float = D(stock.defId).value
	return {"defId": stock.defId, "source": stock.source, "priceBand": [jround(value * 0.4), jround(value * 0.8)]}

static func market_npc_id(s: Dictionary, day = null, slot = null) -> String:
	var dd: int = int(s.day if day == null else day)
	var sl: int = int(s.cursor if slot == null else slot)
	if dd <= 3 and sl < 4:
		return ["CHR-004", "CHR-002", "CHR-005", "CHR-003"][sl]
	var visitors := []
	for n in GameData.npcs:
		if n.id != "CHR-001":
			visitors.append(n)
	var fallback: String = visitors[fnv("%s/%d/%d/visitor" % [s.seed, dd, sl]) % visitors.size()].id
	if not s.get("shopJournal") is Dictionary: return fallback
	var preview := s.duplicate(false)
	preview.day = dd
	preview.cursor = sl
	return Journal.preferred_npc(preview,fallback)

static func stock_item_options(stock: Dictionary) -> Dictionary:
	var o := stock.duplicate(true)
	o.erase("defId")
	o.erase("price")
	return o

# ------------------------------------------------------------ readings & voices

static func fault_label(it: Dictionary) -> String:
	if it.working:
		return "维修与复测通过，功能已恢复。" if it.repaired else "功能响应正常，未发现失效症状。"
	var f = GameData.faults.get(it.defId, null)
	if f == null:
		var c = GameData.content_clues.get(it.defId, null)
		f = c.defect if c != null else "功能响应偏离型号基准"
	return "异常响应：%s" % f

static func item_mark(it: Dictionary) -> String:
	return WatchRules.serial(it)

static func _physical_clue(it: Dictionary, tool: String) -> String:
	return WatchRules.reading(it, tool)

static func item_clue(it: Dictionary, tool: String) -> String:
	return WatchRules.reading(it, tool)

static func displayed_clue(it: Dictionary, tool: String) -> String:
	return String(it.get("evidenceReadings", {}).get(tool, item_clue(it, tool)))

static func evidence_caption(it: Dictionary, tool: String) -> String:
	return GameData.evidence_name(it.defId, tool)

static func npc_dialogue(s: Dictionary, npc_id: String, stage: String, fallback: String, price := 0.0) -> String:
	var voice = GameData.npc(npc_id).get("voice", null)
	if voice == null or not voice.has(stage) or voice[stage].is_empty():
		return fallback
	var lines: Array = voice[stage]
	var line: String = lines[fnv("%s/%s/%s/%s/%s" % [s.seed, jnum(s.day), jnum(s.cursor), npc_id, stage]) % lines.size()]
	return line.replace("{price}", jnum(price))

# ------------------------------------------------------------ station events

static func event_for_day(seed: String, day) -> Variant:
	if typeof(day) != TYPE_INT and float(day) != floor(float(day)):
		return null
	var dd := int(day)
	if dd < 1 or dd > 21:
		return null
	if FIXED_EVENT_DAYS.has(dd):
		for e in GameData.events:
			if e.id == FIXED_EVENT_DAYS[dd]:
				return e
		return null
	var deck := []
	for e in GameData.events:
		if not FIXED_EVENT_DAYS.values().has(e.id):
			deck.append(e)
	var draw := fnv(seed)
	for i in range(deck.size() - 1, 0, -1):
		draw = lcg(draw)
		var j := draw % (i + 1)
		var tmp = deck[i]
		deck[i] = deck[j]
		deck[j] = tmp
	var index := 0
	for date in range(2, dd):
		if not FIXED_EVENT_DAYS.has(date):
			index += 1
	return deck[index] if index < deck.size() else null

## The state-free lookup above deliberately retains its 21-day contract.
## Continued campaigns reuse ordinary station situations, never the finale.
static func event_for_state(s: Dictionary) -> Variant:
	var day := int(s.day)
	if day <= 21 or not s.get("campaignLife",{}).get("endless",false):
		return event_for_day(s.seed,s.day)
	var deck := []
	for event in GameData.events:
		if not FIXED_EVENT_DAYS.values().has(event.id): deck.append(event)
	if deck.is_empty(): return null
	return deck[(fnv(String(s.seed)+"/recurring-station-events")+day-22)%deck.size()]

static func event_availability(s: Dictionary, choice: Dictionary):
	if s.phase != "open":
		return "每日事件只在营业期间处理。"
	if s.trade != null:
		return "先完成当前交易或送客，再处理每日事件。"
	var event = event_for_state(s)
	var option = null
	if event != null:
		for c in event.choices:
			if c.id == choice.id:
				option = c
	if event == null or option == null:
		return "这项选择已不属于今天的事件。"
	for r in s.events:
		if r.day == s.day:
			return "今天的事件已经处理，不能重复领取结果。"
	for e in s.ledger:
		if e.id == "station-event-day-%s" % jnum(s.day):
			return "今天的事件已经处理，不能重复领取结果。"
	var eff: Dictionary = option.effects
	var cash: float = s.cash + eff.get("cash", 0)
	if cash < 0:
		return "现金不足，需要%sCr。" % jnum(-eff.get("cash", 0))
	if cash > 1e9:
		return "现金已达到保存上限，请先安排其他业务。"
	if s.ap + eff.get("ap", 0) < 0:
		return "行动点不足，需要%sAP。" % jnum(-eff.get("ap", 0))
	var mats: Dictionary = eff.get("materials", {})
	for id in mats:
		var m := GameData.material(id)
		var amount: float = s.materials.get(id, 0) + mats[id]
		if m.is_empty() or amount < 0:
			return "%s不足，本次不会扣除其他资源。" % (m.get("name", "材料"))
		if amount > 99999:
			return "%s已达到材料容量上限，本次不会扣除其他资源。" % m.name
	return null

# ------------------------------------------------------------ state

static func create(seed := "ORBITAL-P0") -> Dictionary:
	GameData.ensure()
	var mats := {}
	for m in GameData.materials:
		mats[m.id] = 2
	var orders := []
	for d in GameData.orders:
		orders.append({"id": d.id, "status": "available"})
	var s := {"schema": 4, "serviceVersion": 1, "seed": seed, "day": 1, "ap": 12, "cash": 1200, "phase": "open", "risk": 12, "relations": {"station": 30, "salvage": 35, "merchant": 20},
		"inventory": [], "trade": null, "cursor": 0, "ledger": [], "completedTrades": [], "orders": orders, "materials": mats, "events": [], "repairProgress": {},
		"scanned": [], "inspection": "announced", "upgrades": {"lamp": false, "shelf": false}, "report": null,
		"storeCosts": {"version": 1, "fromDay": 1}, "notice": "回环九号旧港重新点灯。先接待来客，对照说明书检验手表，再安排维护和订单。", "nextId": 1, "tutorial": 0}
	for id in ["WCH-001", "WCH-002", "WCH-003", "WCH-010", "WCH-011", "WCH-014"]:
		var it := new_item(s, id, {"condition": 0.55 if id == "WCH-001" else 0.85, "working": id != "WCH-001", "source": "前任店主移交清单 / 所有权已核对", "cost": jround(D(id).value * 0.28)})
		put_in(s, it)
	StoreCosts.ensure(s)
	NightCrime.ensure(s)
	NightCrime.ensure_day(s)
	return s

static func validated_trade_item(s: Dictionary, t: Dictionary):
	return find_inventory(s, t.get("selectedUid", "")) if t.kind == "sell" else t.item

static func order_item_valid(s: Dictionary, id: String, it: Dictionary, required = null):
	var def := GameData.order(id)
	var order = _order_state(s, id)
	var primary: bool = required == null or required == def.itemId
	if order == null or order.status != "active":
		return "请先接取这张订单。"
	if it.defId != (required if required != null else def.itemId):
		return "交付物品型号不符，原物保留在库存。"
	if trade_reserved(s, it):
		return "当前报价已占用该物件，先取消交易再交单。"
	if it.get("service", {}).get("opened", false):
		return "后盖或内部装配尚未收妥，请先完成工作台复核并封盖。"
	if it.location == "isolation" or it.sealed:
		return "隔离或封存的物件不能交付，先核对并解除保管状态。"
	if def.get("customerOwned", false) and (it.owner != "customer" or it.get("orderId", "") != id or order.get("uid", "") != it.uid):
		return "委修单必须交还顾客原物，不能拿自有货替换。"
	if not def.get("customerOwned", false) and not owns(it):
		return "这件物品不属于店铺，不能代替自有货交单。"
	if not def.get("customerOwned", false) and it.has("orderId"):
		return "这件物品已由其他订单占用，不能重复交付。"
	if primary and it.condition < def.minCondition:
		return "品相尚未达到订单要求。"
	if primary and def.needsRepair and (not it.repaired or not it.working):
		return "维修与复测尚未完成。"
	if evidence_count(it) < 2:
		return "请至少记录两条独立物证后再交付。"
	if not def.get("customerOwned", false) and not it.sourceVerified:
		return "来源尚未核验，不能履约。"
	if not def.get("customerOwned", false) and not it.working:
		return "购买订单要求功能正常的货物，鉴定服务可如实报告故障。"
	return null

static func _materials_cost(r: Dictionary) -> float:
	var n := 0.0
	for id in r.materials:
		n += GameData.material(id).get("price", 0) * r.materials[id]
	return n

static func _remove_item(s: Dictionary, uid: String) -> void:
	var keep := []
	for i in s.inventory:
		if i.uid != uid:
			keep.append(i)
	s.inventory = keep

static func business_hours_problem(s: Dictionary) -> String:
	if s.phase == "open": return ""
	if s.phase == "ending": return "本轮经营已结束，不能继续办理业务；可以查看经营记录。"
	return "店铺已打烊，当前不能办理业务。请先开始下一营业日。"

static func reduce(previous: Dictionary, a: Dictionary) -> Dictionary:
	GameData.ensure()
	var s: Dictionary = previous.duplicate(true)
	StoreCosts.ensure(s)
	NightCrime.ensure(s)
	var type: String = a.type
	if type == "NEXT":
		if s.phase != "report":
			return previous
		if not s.get("campaignLife",{}).get("endless",false) and (s.day >= 21 or s.has("outcome")):
			s.phase = "ending"
			return s
		s.day += 1
		s.ap = Extensions.daily_ap(s)
		s.phase = "open"
		s.cursor = 0
		s.trade = null
		s.report = null
		s.scanned = []
		s.inspection = "pending" if s.day >= 3 else "announced"
		load("res://scripts/model/robbery.gd").extend_deadlines(s)
		for o in s.orders:
			if (o.status == "available" or o.status == "active") and order_due(s,o.id) < s.day:
				o.status = "failed"
		for it in s.inventory:
			if it.owner == "pawn" and it.has("pawnDay") and s.day > it.pawnDay + 4:
				it.owner = "shop"
				it.sealed = false
				var pos = empty_cell(s, it)
				if pos != null:
					it.location = "warehouse"
					it.x = pos.x
					it.y = pos.y
				it.erase("pawnPrincipal")
				it.erase("pawnDay")
		StoreCosts.ensure(s)
		NightCrime.morning(s,int(previous.day))
		NightCrime.ensure_day(s)
		var text := "第%s天开门。核对订单与到期抵押，店铺电费、清洁费和租金在日结显示。" % jnum(s.day)
		if s.day == 2:
			text = "第2天：阿篁与澄九带来委修预约。到订单页接单，再到维修台换件复测。"
		elif s.day == 3:
			text = "第3天：饶静预约核验。先扫描来源不明货物，再登记或隔离，日结可选择首个升级。"
		notice(s,text)
		load("res://scripts/model/robbery.gd").open_day(s)
		return s
	if type == "UPGRADE":
		if s.phase != "report" or s.report == null:
			return notice(s, "店铺升级在日结后安排。")
		if s.day < 3:
			return notice(s, "首个设备升级在第3日日结开放。")
		if s.report.upgraded or s.upgrades[a.id]:
			return notice(s, "本次升级已经登记，请迎接明天。")
		var cost := 120.0 if a.id == "lamp" else 160.0
		if s.cash < cost:
			return notice(s, "升级需要%sCr，现金不足。" % jnum(cost))
		ledger(s, "upgrade-%s" % a.id, "upgrade", "可变焦工作灯升级" if a.id == "lamp" else "模组陈列架升级", -cost)
		s.upgrades[a.id] = true
		StoreCosts.ensure(s)
		s.report.upgraded = true
		s.report.cash = s.cash
		return notice(s, "工作灯已换装：新日鉴定首次费用减为0AP。" if a.id == "lamp" else "陈列架已换装：合法货物的陈列报价提高5%。")
	if s.phase != "open":
		return notice(s,business_hours_problem(s)) if BUSINESS_ACTIONS.has(type) else previous
	var required_device := ""
	if type in ["SELECT_TRADE","OFFER","ACCEPT","PRICE"]: required_device = "quote_terminal"
	if type in ["TAKE_ORDER","DELIVER_ORDER"]: required_device = "order_terminal"
	if required_device != "":
		var problem := StoreCosts.device_problem(s,required_device)
		if problem != "": return notice(s,problem)
	match type:
		"CHOOSE_EVENT":
			var event = event_for_state(s)
			var choice = null
			if event != null:
				for c in event.choices:
					if c.id == a.choiceId:
						choice = c
			var done := false
			for r in s.events:
				if r.day == s.day:
					done = true
			if event == null or event.id != a.eventId or choice == null or done:
				return previous
			var invalid = event_availability(s, choice)
			if invalid != null:
				return notice(s, invalid)
			var eff: Dictionary = choice.effects
			var c_cash: float = eff.get("cash", 0)
			if not ledger(s, "station-event-day-%s" % jnum(s.day), "station-event", "%s · %s" % [event.title, choice.label], c_cash, -c_cash if c_cash < 0 else 0.0):
				return previous
			s.ap = clampn(s.ap + eff.get("ap", 0), 0, Extensions.daily_ap(s))
			s.risk = clampn(s.risk + eff.get("risk", 0))
			var mats: Dictionary = eff.get("materials", {})
			for id in mats:
				s.materials[id] = s.materials.get(id, 0) + mats[id]
			var rel: Dictionary = eff.get("relations", {})
			for f in FACTIONS:
				s.relations[f] = clampn(s.relations[f] + rel.get(f, 0))
			s.events.append({"day": s.day, "eventId": event.id, "choiceId": choice.id})
			return notice(s, choice.result)
		"EMERGENCY_SALE":
			var window := false
			for r in s.ledger:
				if r.kind in ["relief-window","rent-relief"] and r.day == s.day:
					window = true
			if not window:
				return notice(s, "限期清仓只在首次结算欠费的救济窗口开放。")
			var due := Landlord.outstanding(s)
			var required: float = StoreCosts.quote(s).total + due
			if s.cash >= required:
				return notice(s, "维护与租金缺口已补齐，请返回日结，清仓不会继续低价出售。")
			var it = find_inventory(s, a.uid)
			if it == null:
				return previous
			if trade_reserved(s, it) or not owns(it) or it.has("orderId") or not it.sourceVerified or it.sealed or it.location == "isolation" or it.get("service", {}).get("opened", false):
				return notice(s, "应急清仓仍不能出售顾客、抵押、预留或来源未核货物。")
			var amount := maxf(1, floor(D(it.defId).value * sale_appearance(it).condition * 0.45))
			if not ledger(s, "relief-sale-%s" % it.uid, "clearance", "应急清仓 %s" % D(it.defId).name, amount, it.cost):
				return previous
			_remove_item(s, it.uid)
			return notice(s, "原物按清仓报价%sCr移交，未消耗AP。%s" % [jnum(amount), "欠款已补齐，可以重新结算。" if s.cash >= required else "可继续处理合法自有库存，直到补齐本次欠款。"])
		"ARRIVE":
			if s.trade != null:
				return notice(s, "先完成当前交易，或请客人收好物品。")
			if s.cursor >= daily_visit_limit(s):
				return notice(s, "今日预约已处理。可以维修、履约或提前打烊。")
			var sell := int(s.cursor) % 2 == 1
			var npc_id := market_npc_id(s)
			var greeting := npc_dialogue(s, npc_id, "arrival", GameData.npc(npc_id).line)
			var t := {"id": next_id(s, "trade"), "npcId": npc_id, "kind": "sell" if sell else "buy", "item": null, "price": 0, "rounds": 0, "locked": false, "evidenceUsed": [],
				"line": "%s 这次采购：%s" % [greeting, customer_need(npc_id)] if sell else greeting}
			if not sell:
				var stock := market_stock(s)
				t.item = new_item(s, stock.defId, stock_item_options(stock))
				t.price = maxf(stock.price, trade_terms(s, t, t.item).floor)
				if s.day == 1 and s.cursor == 0:
					t.line = "这只北辰通勤表从旧航道带回。表带连接需要维护，你先对照手册看看。"
				elif s.day == 3 and s.cursor == 0:
					t.line = "这只旧航表的来源回执还没有核对，先别放上销售架。"
				else:
					t.line = "%s 来路：%s。" % [greeting, stock.source.split(" / ")[0]]
			s.trade = t
			return notice(s, "顾客在柜台等候，请从仓储选择自有货物推荐。" if sell else "客人把货物放到柜台，先拿到鉴定台观察。")
		"SELECT_TRADE":
			var t = s.trade
			var it = find_inventory(s, a.uid)
			if t == null or t.kind != "sell" or t.locked or it == null:
				return previous
			var invalid = sale_eligibility(it, t.npcId)
			if invalid != null:
				return notice(s, invalid)
			if t.get("selectedUid", null) == it.uid:
				return s
			t.selectedUid = it.uid
			t.evidenceUsed = []
			t.price = trade_terms(s, t, it).opening
			t.line = npc_dialogue(s, t.npcId, "counter", "%s可以考虑。我先出%sCr，检测结果好的话还可以谈。" % [WatchForgery.sale_name(it), jnum(t.price)], t.price)
			return s
		"CHECK":
			var it = find_item(s, a.uid)
			if it == null or not GameData.tool_ids.has(a.tool):
				return previous
			var device: String = "uv" if a.tool == "TOL-002" else "scale" if a.tool == "TOL-005" else ""
			if device != "":
				var problem := StoreCosts.device_problem(s,device)
				if problem != "": return notice(s,problem)
			if it.evidence.has(a.tool):
				if device != "": StoreCosts.record(s,device,"check|%s|%s|%s" % [it.uid,a.tool,WatchRules.reading(it,a.tool)],0.5)
				record_inspection(it, a.tool)
				return notice(s, "本次实物读数已更新，复测不重复扣AP。")
			if not it.inspectedPaid:
				var cost := 0.0 if s.upgrades.lamp else 1.0
				if not has_ap(s, cost):
					return notice(s, "今日行动点不足，明日可继续，物证不会丢失。")
				spend(s, cost)
				it.inspectedPaid = true
			if device != "": StoreCosts.record(s,device,"check|%s|%s|%s" % [it.uid,a.tool,WatchRules.reading(it,a.tool)],0.5)
			it.evidence.append(a.tool)
			record_inspection(it, a.tool)
			s.tutorial = maxf(s.tutorial, 1)
			var extra := appraisal_text(it) + "；鉴定仅提供参考范围，成交价仍需议定。"
			return notice(s, "%s %s" % [item_clue(it, a.tool), extra])
		"OFFER":
			var t = s.trade
			if t == null or t.locked or validated_trade_item(s, t) == null:
				return previous
			if not has_ap(s, 1):
				return notice(s, "交割需要保留1AP，请先送客，明日再安排交易。")
			var it = validated_trade_item(s, t)
			if t.kind == "sell":
				var invalid = sale_eligibility(it, t.npcId)
				if invalid != null:
					return notice(s, invalid)
			var bounds := offer_bounds(s, t, it)
			if bounds.max < 1:
				return notice(s, "现金不足1Cr，暂时无法提出收购报价，可以先送客整理库存。")
			if not valid_price(a.price) or a.price < bounds.min or a.price > bounds.max:
				return notice(s, "本件报价范围为1–%sCr%s，无效报价不计轮次。" % [jnum(bounds.max), "（受现金余额限制）" if t.kind == "buy" else ""])
			var ev = a.get("evidence", null)
			if ev != null and (not ev is String or not it.evidence.has(ev) or not GameData.relevant_tool(it.defId, ev)):
				return notice(s, "请选这件实物已取得的相关物证，其他读数不能支撑议价。")
			t.evidenceUsed = relevant_evidence(it, t.evidenceUsed)
			var decision := Negotiation.decide(s, t, it, a.price, ev)
			if decision.decision == "leave":
				return finish_trade(s, decision.reason)
			if decision.duplicate or decision.decision == "refuse":
				t.line = decision.reason
				return notice(s, decision.reason)
			var acceptable: bool = decision.decision == "accept"
			if acceptable:
				t.price = a.price
				t.locked = true
				t.line = npc_dialogue(s, t.npcId, "agreed", "物证说得通。价格确认，我们按这个数交割。", t.price)
			else:
				t.price = counter_price(s, t, it)
				t.line = "%s 我的报价是%sCr。" % [decision.reason, jnum(t.price)]
			return notice(s, "证据与报价已确认，交割前不会扣款。" if acceptable else "客人递回反报价。还价不消耗额外AP。")
		"ACCEPT":
			var t = s.trade
			if t == null or t.locked:
				return previous
			var it = validated_trade_item(s, t)
			if it == null:
				return notice(s, "请先选定要交易的实物。")
			if not has_ap(s, 1):
				return notice(s, "交割需要保留1AP；可取消本次交易后打烊。")
			if t.kind == "sell":
				var invalid = sale_eligibility(it, t.npcId)
				if invalid != null:
					return notice(s, invalid)
			if not price_agreed(s, t, it):
				return notice(s, "票据报价超出顾客的交易范围，请重新议价或送客。")
			if t.kind == "buy" and s.cash < t.price:
				return notice(s, "现金不足，还差%sCr。" % jnum(t.price - s.cash))
			t.locked = true
			t.line = "%s 确认交割后钱货同时入账。" % npc_dialogue(s, t.npcId, "agreed", "就按票据上的价格。", t.price)
			return s
		"DELIVER":
			var t = s.trade
			if t == null or t.id != a.tradeId or not t.locked or s.completedTrades.has(a.tradeId):
				return previous
			var it = validated_trade_item(s, t)
			if it == null:
				return notice(s, "货物已变化，请重新核对。")
			if not price_agreed(s, t, it):
				return notice(s, "价格已超出约定范围，钱货均未变动，请取消后重新议价。")
			if not has_ap(s, 1):
				return notice(s, "交割需要1AP，当前余额不足。")
			if t.kind == "buy":
				if s.cash < t.price:
					return notice(s, "现金不足，钱货均未变动。")
				var pos = empty_cell(s, it)
				if pos == null:
					return notice(s, "后仓没有可容纳该形状的空位，先整理格子。")
				it.owner = "shop"
				it.cost = t.price
				it.x = pos.x
				it.y = pos.y
				it.location = "warehouse"
				s.inventory.append(it)
				ledger(s, t.id, "purchase", "收购 %s" % D(it.defId).name, -t.price, t.price)
				if not it.sourceVerified:
					s.risk = clampn(s.risk + 12)
			else:
				var invalid = sale_eligibility(it, t.npcId)
				if invalid != null:
					return notice(s, invalid)
				ledger(s, t.id, "sale", "售出 %s" % WatchForgery.sale_name(it), t.price, it.cost)
				_remove_item(s, it.uid)
				var f: String = GameData.npc(t.npcId).faction
				s.relations[f] = clampn(s.relations[f] + 2)
			spend(s, 1)
			s.completedTrades.append(t.id)
			return finish_trade(s, "钱货已交割，回执和物件归属同步保存。")
		"PAWN":
			var t = s.trade
			if t == null or t.kind != "buy" or t.item == null or t.id != a.tradeId or s.completedTrades.has(t.id):
				return previous
			var it: Dictionary = t.item
			var pawned := 0
			for i in s.inventory:
				if i.location == "pawn":
					pawned += 1
			if pawned >= 16:
				return notice(s, "抵押保管柜16格已满。")
			if evidence_count(it) < 2:
				return notice(s, "抵押前须取得两条独立物证。")
			var ap_est := estimate(it)
			var amount: float = floor((ap_est.low + ap_est.high) / 2.0 * 0.4)
			if not has_ap(s, 1) or s.cash < amount:
				return notice(s, "现金或行动点不足，抵押合同未成立。")
			it.owner = "pawn"
			it.location = "pawn"
			it.pawnDay = s.day
			it.pawnPrincipal = amount
			it.cost = amount
			it.sealed = true
			s.inventory.append(it)
			ledger(s, t.id, "pawn-principal", "抵押本金 %s" % D(it.defId).name, -amount)
			spend(s, 1)
			s.completedTrades.append(t.id)
			return finish_trade(s, "发放%sCr本金。3日赎期加1日宽限，8%%服务费；保管物不可出售或拆解。" % jnum(amount))
		"REDEEM":
			var it = find_inventory(s, a.uid)
			if it == null or it.owner != "pawn" or not it.has("pawnPrincipal") or not it.has("pawnDay"):
				return previous
			if s.day > it.pawnDay + 4:
				return notice(s, "已超过宽限，请先核对抵押到期处理。")
			var principal: float = it.pawnPrincipal
			var fee := jround(principal * 0.08 * 100) / 100.0
			ledger(s, "redeem-principal-%s" % it.uid, "pawn-return", "收回抵押本金 %s" % D(it.defId).name, principal)
			ledger(s, "redeem-fee-%s" % it.uid, "pawn-fee", "抵押服务费", fee)
			_remove_item(s, it.uid)
			return notice(s, "原物归还，本金%sCr及服务费%sCr分账入册。" % [jnum(principal), jnum(fee)])
		"REFUSE":
			if s.trade == null:
				return previous
			return finish_trade(s, "%s 客人收回物件离开，没有资金或所有权变化。" % npc_dialogue(s, s.trade.npcId, "refused", "改天再谈。"))
		"MOVE":
			var it = find_inventory(s, a.uid)
			if it == null:
				return previous
			if trade_reserved(s, it) or it.owner == "pawn" or it.sealed or it.location == "isolation":
				return notice(s, "当前交易、封存或抵押货物不能移入普通仓格。")
			if not can_place(s, it.uid, a.x, a.y, a.get("rotated", null)):
				return notice(s, "放置会重叠或越界，货物已回到原位。")
			it.location = "warehouse"
			it.x = a.x
			it.y = a.y
			it.rotated = a.get("rotated", it.rotated)
			return notice(s, "仓格位置已保存。")
		"DISPLAY":
			var it = find_inventory(s, a.uid)
			if it == null:
				return previous
			if trade_reserved(s, it):
				return notice(s, "这件实物已在当前报价中，先交割或取消交易。")
			if it.location == "display":
				var pos = empty_cell(s, it)
				if pos == null:
					return notice(s, "后仓没有可容纳该形状的空位。")
				it.location = "warehouse"
				it.x = pos.x
				it.y = pos.y
				return notice(s, "已从陈列架移回后仓。")
			if not owns(it) or it.has("orderId") or it.location == "isolation" or it.sealed or it.get("service", {}).get("opened", false):
				return notice(s, "受托、预留、隔离或封存物品不能上架。")
			if not it.sourceVerified or evidence_count(it) < 2:
				return notice(s, "请先取得两条独立物证并核验来源，再上架。")
			var shown := 0
			for i in s.inventory:
				if i.location == "display":
					shown += 1
			if shown >= 24:
				return notice(s, "24个销售陈列位已满。")
			it.location = "display"
			if s.upgrades.shelf:
				it.listPrice = jround(D(it.defId).value * sale_appearance(it).condition * 0.9)
			return notice(s, "物品与已知证据价签已上架。")
		"PRICE":
			var it = find_inventory(s, a.uid)
			if it == null or trade_reserved(s, it) or not owns(it) or it.has("orderId") or not valid_price(a.price):
				return previous
			it.listPrice = a.price
			return notice(s, "挂牌价格已保存。")
		"ISOLATE":
			var it = find_inventory(s, a.uid)
			if it == null or it.owner == "pawn":
				return previous
			if trade_reserved(s, it):
				return notice(s, "这件实物正在交易，先交割或取消报价。")
			if it.location == "isolation":
				if not it.sourceVerified:
					return notice(s, "来源仍未通过核验，不能解除隔离。")
				var pos = empty_cell(s, it)
				if pos == null:
					return notice(s, "后仓没有空位。")
				it.location = "warehouse"
				it.sealed = false
				it.x = pos.x
				it.y = pos.y
				return notice(s, "隔离解除，回到普通后仓。")
			var isolated := 0
			for i in s.inventory:
				if i.location == "isolation":
					isolated += 1
			if isolated >= 12:
				return notice(s, "4×3隔离柜已满，请先核验或归还现有货物。")
			it.location = "isolation"
			it.sealed = true
			if s.inspection == "pending" and inspection_ready(s):
				s.inspection = "cleared"
			return notice(s, "原物已转入隔离柜，暂停销售；核验可继续。")
		"SCAN":
			var it = find_inventory(s, a.uid)
			if it == null:
				return previous
			var problem := StoreCosts.device_problem(s,"scanner")
			if problem != "": return notice(s,problem)
			StoreCosts.record(s,"scanner","scan|%s|%s" % [it.uid,JSON.stringify([it.get("source",""),it.sourceVerified,it.owner,it.get("orderId","")])],0.5)
			if not s.scanned.has(it.uid):
				s.scanned.append(it.uid)
			if s.day >= 3 and inspection_ready(s):
				s.inspection = "cleared"
			return notice(s, "箱号、封签和来源回执一致，扫描记录已保存。" if it.sourceVerified else "箱号与来源回执尚未一致。可以隔离、补交登记或主动归还。")
		"REGISTER":
			var it = find_inventory(s, a.uid)
			if it == null or it.owner == "pawn":
				return previous
			if it.sourceVerified:
				return notice(s, "来源已登记，不重复收取费用。")
			if not s.scanned.has(it.uid) or evidence_count(it) < 2:
				return notice(s, "先过安检扫描并记录两条独立物证，再提交登记申请。")
			if s.cash < 35 or not has_ap(s, 1):
				return notice(s, "登记需要35Cr和1AP，资料与原物保持不变。")
			ledger(s, "register-%s" % it.uid, "registration", "来源登记手续费", -35)
			spend(s, 1)
			it.sourceVerified = true
			s.risk = clampn(s.risk - 6)
			if inspection_ready(s):
				s.inspection = "cleared"
			return notice(s, "公开批次与物证已完成登记比对，原物可解除隔离。")
		"RETURN_ITEM":
			var it = find_inventory(s, a.uid)
			if it == null or it.owner == "pawn":
				return previous
			if trade_reserved(s, it):
				return notice(s, "这件实物正在交易，不能同时返还。")
			_remove_item(s, it.uid)
			if it.has("orderId"):
				var order = _order_state(s, it.orderId)
				if order != null and order.status == "active":
					order.status = "failed"
			if not it.sourceVerified:
				s.risk = clampn(s.risk - 6)
			if inspection_ready(s):
				s.inspection = "cleared"
			return notice(s, "已打印返还凭证，原物移交。未伪造来源或额外收取报酬。")
		"REFURB_PROGRESS", "REFURB_COMPLETE":
			var it = find_inventory(s,a.get("uid",""))
			if it == null: return previous
			WatchService.ensure(it,s.seed)
			var job := String(a.get("job",""))
			if it.get("refurbishment",{}).get("done",[]).has(job): return previous
			var why := WatchRefurbishment.save_progress(s,it,job,a.get("progress")) if a.type == "REFURB_PROGRESS" else WatchRefurbishment.commit(s,it,job)
			if why != "": return notice(s,why)
			return s if a.type == "REFURB_PROGRESS" else notice(s,"已完成：%s。外观变化已记录，旧鉴定需复测。" % WatchRefurbishment.LABELS[job])
		"SERVICE_BEGIN":
			var it = find_inventory(s, a.get("uid", ""))
			if it == null: return previous
			WatchService.ensure(it,s.seed)
			var blocked := WatchService.available(s,it)
			if blocked != "": return notice(s,blocked)
			it.service.active = true
			return notice(s,"维修工单已保存：只处理本件实际故障。")
		"SERVICE_PROGRESS":
			var it = find_inventory(s, a.get("uid", ""))
			if it == null: return previous
			WatchService.ensure(it,s.seed)
			var blocked := WatchService.available(s,it)
			if blocked != "": return notice(s,blocked)
			var task := String(a.get("task", ""))
			var progress = a.get("progress", null)
			var device: String = "repair_tester" if task == "test" else "uv" if task == "forge_serial" else "scale" if task == "forge_weight" else ""
			if device != "":
				var problem := StoreCosts.device_problem(s,device)
				if problem != "": return notice(s,problem)
			if not progress is Dictionary or not WatchService.valid_progress(progress): return previous
			if task.begins_with("forge_"):
				var method := task.trim_prefix("forge_")
				if not WatchForgery.available_methods(it).has(method) or WatchForgery.completed(it,method): return previous
				if it.owner != "shop" or it.has("orderId"): return notice(s,"伪装加工只开放给店铺自有手表。")
				if WatchForgery.target_id(it)!="":
					if method in ["serial","weight"] and WatchForgery.appearance_id(it)!=WatchForgery.target_id(it): return notice(s,"请先完成目标换壳。")
					if progress.get("complete",false) or progress.get("opened",false) or int(progress.get("step",0))>0 or progress.get("phase","started")!="idle": it.forgery.target_locked=true
				if it.service.opened and it.service.get("forge_task", "") != task: return notice(s,"请先收妥内部维修并封盖。")
				if progress.has("opened"):
					it.service.opened = bool(progress.opened)
					if progress.opened: it.service.forge_task = task
			else:
				if not WatchService.TASKS.has(task) or task != WatchService.current(it) or it.service.done.has(task) or it.service.get("forge_task", "") != "": return previous
				if task == "open" and progress.get("opened", false): it.service.opened = true
			if task.begins_with("forge_"): progress=progress.duplicate(true);progress.targetId=WatchForgery.target_id(it)
			it.service.operations[task] = progress.duplicate(true)
			return s
		"SERVICE_COMPLETE":
			var it = find_inventory(s, a.get("uid", ""))
			if it == null: return previous
			WatchService.ensure(it,s.seed)
			var task := String(a.get("task", ""))
			if task == "" or not WatchService.TASKS.has(task): return previous
			var blocked := WatchService.problem(s,it,task)
			if blocked != "": return notice(s,blocked)
			if not it.service.operations.get(task, {}).get("complete", false): return notice(s,"请先完成这道工序的实际操作。")
			if task == "test":
				var problem := StoreCosts.device_problem(s,"repair_tester")
				if problem != "": return notice(s,problem)
			var cost := WatchService.step_cost(task,it)
			for id in cost.materials:
				s.materials[id] -= cost.materials[id]
				it.cost += GameData.material(id).price * cost.materials[id]
			spend(s,cost.ap)
			it.service.paid[task] = cost.duplicate(true)
			WatchService.commit(it,task)
			if task == "test": StoreCosts.record(s,"repair_tester","service|%s|test" % it.uid,1.5 if WatchService.profile(it).movement == "mechanical" else 1.0)
			it.listPrice = jround(D(it.defId).value * it.condition * 0.88)
			return notice(s,"已完成：%s。实物变化已记录，请按需复测旧物证。" % WatchService.label(task,it))
		"SERVICE_FINISH":
			var it = find_inventory(s, a.get("uid", ""))
			if it == null: return previous
			WatchService.ensure(it,s.seed)
			var blocked := WatchService.available(s,it)
			if blocked != "": return notice(s,blocked)
			if not WatchService.finished(it): return notice(s,"工单尚未完成，不能跳过故障处理、回装或封盖。")
			if it.service.finished: return previous
			it.service.active = false
			it.service.finished = true
			if not it.service.tasks.is_empty(): it.repaired = true
			s.tutorial = maxf(s.tutorial,2)
			return notice(s,"本次工单已交工；仅记录实际完成的维护，不证明真伪或防水。")
		"REPAIR_STEP", "REPAIR":
			return notice(s,"旧版三道维修工序已停用，请到修表工作台按实际工单操作。")
		"DISMANTLE", "CRAFT":
			return notice(s, "本店目前只提供手表基础维护。")
		"TAKE_ORDER":
			var def := GameData.order(a.id)
			var o = _order_state(s, a.id)
			if def.is_empty() or o == null or o.status != "available":
				return previous
			if s.day < float(GameData.order_earliest.get(def.id, 1)) or s.day > order_due(s,def.id):
				return notice(s, "这张预约尚未开始或已经到期。")
			if def.get("customerOwned", false):
				var it := new_item(s, def.itemId, {"owner": "customer", "orderId": def.id, "condition": 0.55 if def.needsRepair else 0.8, "working": not def.needsRepair, "sourceVerified": true, "source": "%s 顾客委修登记 / 禁止销售" % def.id, "cost": 0})
				if not put_in(s, it):
					return notice(s, "后仓缺少保管原物的空间，请先整理。")
				o.uid = it.uid
			o.status = "active"
			return notice(s, "已接取委托，顾客原物已入受托保管位；没有支付采购款。" if def.get("customerOwned", false) else "订单已接取，将合格自有货拖入交付盘预览。")
		"DELIVER_ORDER":
			var o = _order_state(s, a.id)
			var it = find_inventory(s, a.uid)
			if o == null or it == null or o.status != "active":
				return previous
			var bad = order_item_valid(s, a.id, it)
			if bad != null:
				return notice(s, bad)
			var def := GameData.order(a.id)
			if not has_ap(s, 1):
				return notice(s, "订单交付需要1AP，当前不足。")
			var extra = null
			var id := "order-%s" % o.id
			for e in s.ledger:
				if e.id == id:
					return previous
			ledger(s, id, "service" if def.get("customerOwned", false) else "order", "%s · 交付" % def.name, def.reward, it.cost + (extra.cost if extra != null else 0))
			_remove_item(s, it.uid)
			if extra != null:
				_remove_item(s, extra.uid)
			o.status = "done"
			spend(s, 1)
			s.relations[def.faction] = clampn(s.relations[def.faction] + 4)
			if def.id == "ORD-010":
				s.risk = clampn(s.risk - 2)
			if def.id == "ORD-011":
				s.risk = clampn(s.risk - 6)
			return notice(s, "订单盖章：%s，%sCr已到账，原物已交还。" % [def.name, jnum(def.reward)])
		"BUY_MATERIAL":
			var m := GameData.material(a.id)
			if m.is_empty() or float(a.qty) != floor(float(a.qty)) or a.qty < 1 or a.qty > 99:
				return previous
			var cost: float = m.price * a.qty
			if s.cash < cost:
				return notice(s, "采购现金不足。")
			ledger(s, next_id(s, "materials"), "materials", "%s×%s" % [m.name, jnum(a.qty)], -cost)
			s.materials[m.id] = s.materials.get(m.id, 0) + a.qty
			return notice(s, "耗材已入工具柜，采购不消耗AP。")
		"SETTLE":
			var rent_result = Landlord.reduce(previous,a)
			if rent_result != null: return rent_result
			if NightCrime.inspection_pending(s):
				return notice(s,"打烊前须接待待到场的查货；0 AP也可呼叫巡警完成核对。")
			if s.trade != null:
				return notice(s, "先交割或送客，再打烊。")
			if s.day >= 3 and s.inspection == "pending" and not inspection_ready(s):
				return notice(s, "预约安检尚未完成：把来源待核货物扫描并登记，或放入隔离柜。")
			var due := Landlord.outstanding(s)
			var costs := StoreCosts.quote(s)
			var maintenance: int = costs.maintenance
			var payment: float = costs.total + due
			var income := 0.0
			var expenses := 0.0
			for r in s.ledger:
				if r.day != s.day:
					continue
				if r.amount > 0 and r.kind != "pawn-return":
					income += r.amount
				if r.amount < 0:
					expenses -= r.amount
			if s.cash < payment:
				var current := false
				var used := false
				for r in s.ledger:
					if r.kind == "relief-window":
						used = true
						if r.day == s.day:
							current = true
				if not used:
					ledger(s, "relief-day-%s" % jnum(s.day), "relief-window", "首次欠费：限期清仓救济窗口", 0)
					return notice(s, "结算暂缓：店铺费用%sCr、租金%sCr，尚缺%sCr。首次救济已开放，可在仓储应急清仓合法自有货，0AP变现；也可完成维修订单补齐后再结算。" % [jnum(costs.total), jnum(due), jnum(payment - s.cash)])
				if current and s.inventory.any(func(it): return owns(it) and not it.has("orderId") and it.sourceVerified and not it.sealed and it.location != "isolation"):
					return notice(s, "本次欠费还差%sCr。清仓窗口仍开放，请到仓储处理合法自有货再结算。" % jnum(payment - s.cash))
				s.phase = "ending"
				s.outcome = "限期清仓后仍无力支付店铺费用"
				return notice(s, "一次限期清仓机会已经提供；本次无法补齐费用，进入可回看的清算。")
			if costs.legacy:
				ledger(s, "maintenance-day-%s" % jnum(s.day), "maintenance", "旧版能源维护", -maintenance)
			else:
				ledger(s, "electricity-day-%s" % jnum(s.day), "electricity", "店铺电费", -costs.electricity)
				s.ledger.back().details = costs.details.duplicate(true)
				ledger(s, "cleaning-day-%s" % jnum(s.day), "cleaning", "店铺清洁费", -costs.cleaning)
			if due:
				ledger(s, "rent-day-%s" % jnum(s.day), "rent", "第%s天租金" % jnum(s.day), -due)
			s.report = {"day": s.day, "income": income, "expenses": expenses, "maintenance": maintenance, "electricity": costs.electricity, "cleaning": costs.cleaning, "costs": costs.duplicate(true), "rent": rent_due(s.day), "settlementRent": due, "cash": s.cash, "upgraded": false}
			s.phase = "report"
			NightCrime.settle(s)
			if s.day == 21:
				s.outcome = "高风险转运站" if s.risk >= 60 else ("稀有收藏行" if s.relations.merchant > s.relations.salvage else "可信赖维修店")
			return notice(s, "日结完成：旧版能源维护 %s Cr，租金 %s Cr；本次支付 %s Cr。" % [jnum(maintenance),jnum(due),jnum(payment)] if costs.legacy else "日结完成：电费 %s Cr，清洁费 %s Cr，租金 %s Cr；本次支付 %s Cr。" % [jnum(costs.electricity),jnum(costs.cleaning),jnum(due),jnum(payment)])
	return previous

static func order_due(s: Dictionary, id: String) -> int:
	var extension:=0
	for o in s.orders:
		if o.id==id: extension=int(o.get("closureExtension",0));break
	return int(GameData.order(id).dueDay)+extension
