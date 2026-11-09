class_name Model
## Faithful GDScript port of assets/scripts/orbital/{model,Negotiation,Market,
## ItemReadings,NpcConversation,StationEvents}.ts. State is a JSON-shaped
## Dictionary so traces can be diffed against the TypeScript reducer
## (tools/trace.mjs + tests/replay.gd). Keep the two in lock-step.

const MASK := 0xFFFFFFFF
const FACTIONS := ["station", "salvage", "merchant"]
const FIXED_EVENT_DAYS := {1: "EVT-001", 7: "EVT-007", 14: "EVT-014", 20: "EVT-020", 21: "EVT-021"}

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
	if x < 0 or y < 0 or x + d[0] > 10 or y + d[1] > 6:
		return false
	return not _overlaps(s, uid, int(x), int(y), d[0], d[1])

static func empty_cell(s: Dictionary, it: Dictionary):
	var d := dimensions(it)
	for y in range(0, 6 - d[1] + 1):
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
	if s.trade != null and s.trade.item != null and s.trade.item.uid == uid:
		return s.trade.item
	return null

static func item_value(it: Dictionary) -> float:
	return maxf(1, jround(D(it.defId).value * clampn(it.condition, 0.35, 1) * (1.0 if it.working else 0.5) * (1.0 if it.authentic else 0.6)))

static func estimate(it: Dictionary) -> Dictionary:
	var base: float = D(it.defId).value
	var known := evidence_count(it)
	if known < 2:
		return {"low": jround(base * 0.35 * 0.5 * 0.6), "high": jround(base), "exact": false}
	var relevant := []
	for t in D(it.defId).tools:
		if it.evidence.has(t):
			relevant.append(t)
	if it.evidence.has("SPEC") and not GameData.inspection_profile(it.defId).is_empty():
		relevant.append("SPEC")
	if relevant.size() < 2:
		return {"low": jround(base * 0.3), "high": jround(base), "exact": false}
	var p := item_value(it)
	return {"low": p, "high": p, "exact": true}

static func available_orders(s: Dictionary) -> Array:
	var out := []
	for d in GameData.orders:
		var o = _order_state(s, d.id)
		if float(GameData.order_earliest.get(d.id, 1)) <= s.day and d.dueDay >= s.day and o != null and o.status == "available":
			out.append(d)
	return out

static func _order_state(s: Dictionary, id: String):
	for o in s.orders:
		if o.id == id:
			return o
	return null

static func finish_trade(s: Dictionary, text: String) -> Dictionary:
	s.trade = null
	s.cursor += 1
	s.tutorial = maxf(s.tutorial, 1)
	return notice(s, text)

static func inspection_ready(s: Dictionary) -> bool:
	for it in s.inventory:
		if it.owner == "shop" and not it.sourceVerified and it.location != "isolation":
			return false
	return true

static func rent_due(day: float) -> float:
	return jround(450 * pow(1.1, floor((day - 1) / 7.0))) if int(day) % 7 == 0 else 0.0

# ------------------------------------------------------------ negotiation

static func trade_item(s: Dictionary, t = null):
	if t == null:
		t = s.trade
	if t == null:
		return null
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
	if p.has("purchase") and p.has("desire"):
		return p.desire
	if npc_id == "CHR-002" or npc_id == "CHR-004":
		return "回收零件与旧设备，可收故障品；来源必须清楚"
	if npc_id == "CHR-003":
		return "站务采购：正品、功能正常、品相至少65%"
	return "整备与收藏：正品、功能正常、品相至少55%"

static func sale_eligibility(it: Dictionary, npc_id: String):
	if it.owner != "shop" or it.has("orderId"):
		return "受托、抵押或订单预留的物品不能出售。"
	if it.sealed or it.location == "isolation" or not it.sourceVerified:
		return "先解除封存并核验来源，顾客才会收货。"
	var demand = GameData.npc(npc_id).get("purchase", null)
	if demand != null:
		if demand.has("categories") and not demand.categories.has(D(it.defId).category):
			return "这件货物不在这位顾客的采购范围内，可从人物档案查看需求。"
		if demand.authentic and not it.authentic:
			return "这位顾客要求正品，请补齐鉴定或选择其他货物。"
		if demand.working and not it.working:
			return "这位顾客需要功能正常的设备，请先维修或换货。"
		if it.condition < demand.minCondition:
			return "这位顾客要求品相至少 %s%%。" % jnum(jround(demand.minCondition * 100))
	if npc_id == "CHR-003" or npc_id == "CHR-005":
		if not it.authentic:
			return "这位顾客要求正品，无法按此采购。可寻找零件回收客。"
		if not it.working:
			return "这位顾客要能正常工作的设备，请先维修或换货。"
		if it.condition < (0.65 if npc_id == "CHR-003" else 0.55):
			return "品相未达到这位顾客的采购要求。"
	return null

static func trade_terms(s: Dictionary, t: Dictionary, it: Dictionary) -> Dictionary:
	var def := D(it.defId)
	var value := maxf(1, jround(def.value * maxf(0.35, minf(1, it.condition)) * (1.0 if it.working else 0.5) * (1.0 if it.authentic else 0.6)))
	var proof := relevant_evidence(it, t.evidenceUsed).size()
	var faction: String = GameData.npc(t.npcId).faction
	var relation := maxf(0, minf(100, s.relations[faction]))
	var variation := ((fnv("%s|%s|%s|%s" % [s.seed, t.id, it.uid, t.npcId]) % 7) - 3) / 100.0
	var market_cap := maxf(1, minf(99999, ceil(def.value * 2)))
	var floor_p := maxf(1, ceil(value * (0.68 + variation - minf(0.09, proof * 0.03))))
	var ceiling := maxf(1, floor(value * ((0.98 if faction == "salvage" else 1.04) + variation + minf(0.09, proof * 0.03) + relation * 0.0003)))
	var opening := maxf(1, minf(ceiling, floor(value * (0.78 + variation))))
	return {"value": value, "floor": floor_p, "ceiling": ceiling, "opening": opening, "marketCap": market_cap, "proof": proof}

static func offer_bounds(s: Dictionary, t: Dictionary, it: Dictionary) -> Dictionary:
	var terms := trade_terms(s, t, it)
	return {"min": 1, "max": minf(terms.marketCap, floor(s.cash)) if t.kind == "buy" else terms.marketCap}

static func price_agreed(s: Dictionary, t: Dictionary, it: Dictionary, price = null) -> bool:
	var p = t.price if price == null else price
	var terms := trade_terms(s, t, it)
	return float(p) == floor(float(p)) and p >= 1 and p <= terms.marketCap and (p <= terms.ceiling if t.kind == "sell" else p >= terms.floor)

static func counter_price(s: Dictionary, t: Dictionary, it: Dictionary) -> float:
	var terms := trade_terms(s, t, it)
	var step := maxf(1, ceil(terms.value * 0.07))
	if t.kind == "sell":
		return minf(terms.ceiling, maxf(terms.opening, t.price) + step)
	return maxf(terms.floor, minf(terms.marketCap, t.price) - step)

# ------------------------------------------------------------ market

static func daily_visit_limit() -> int:
	return 6

static func _shuffled(seed: String, cycle: int) -> Array:
	var ids := []
	for d in GameData.item_list:
		ids.append(d.id)
	var n := fnv("%s/stock-v1/%d" % [seed, cycle])
	for i in range(ids.size() - 1, 0, -1):
		n = lcg(n)
		var j := n % (i + 1)
		var tmp = ids[i]
		ids[i] = ids[j]
		ids[j] = tmp
	return ids

static func _seeded_id(s: Dictionary, day: int, slot: int) -> String:
	var count := GameData.item_list.size()
	var index := 54 + day - 1 if day <= 3 else (day - 4) * 3 + slot / 2
	var cycle := index / count
	return _shuffled(s.seed, cycle)[index % count]

static func market_stock(s: Dictionary, day = null, slot = null) -> Dictionary:
	var dd: int = int(s.day if day == null else day)
	var sl: int = int(s.cursor if slot == null else slot)
	var opening := [["ITM-011", "ITM-001"], ["ITM-009", "ITM-010"], ["ITM-049", "ITM-050"]]
	if dd <= 3 and sl < 4:
		var def_id: String = opening[dd - 1][sl / 2]
		var unverified := dd == 3 and sl == 0
		return {"defId": def_id, "condition": 0.65 if sl == 0 else 0.8, "working": sl != 0, "authentic": not (dd == 2 and sl == 2), "sourceVerified": not unverified,
			"source": "封签批次与旧港注销清单待比对" if unverified else "供货人登记回执 / 旧港回收批次", "price": jround(D(def_id).value * (0.42 if sl == 0 else 0.7))}
	var def_id := _seeded_id(s, dd, sl)
	var key := "%s/%d/%d/physical-v1" % [s.seed, dd, sl]
	var draw := func(tag: String) -> float: return fnv(key + "/" + tag) / 4294967296.0
	var condition := jround((0.45 + draw.call("wear") * 0.5) * 100) / 100.0
	var working: bool = draw.call("working") >= 0.35
	var authentic: bool = draw.call("authentic") >= 0.2
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
	return visitors[fnv("%s/%d/%d/visitor" % [s.seed, dd, sl]) % visitors.size()].id

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
	return "原始编号与底层暗纹一致" if it.authentic else "编号重叠 / 复制暗纹与原厂记录不符"

static func _physical_clue(it: Dictionary, tool: String) -> String:
	var wear := "外壳仅有轻微使用痕迹" if it.condition >= 0.85 else ("接缝有磨损和旧装配痕迹" if it.condition >= 0.65 else "接缝与活动部件磨损明显")
	var result := ("维修后的复测响应稳定，故障已排除" if it.repaired else "工作响应稳定，未出现失效症状") if it.working else fault_label(it)
	match tool:
		"TOL-001": return "侧光观察：%s。%s" % [wear, "可见本店修复标记。" if it.repaired else ""]
		"TOL-002": return "紫外显影：%s；%s。" % [item_mark(it), "来源回执可交叉核对" if it.sourceVerified else "来源回执仍需补证"]
		"TOL-003": return "材料谱线：%s。" % ("主材与型号参考谱一致" if it.authentic else "主材与原厂参考谱不一致，符合替代件或复制品特征")
		"TOL-004": return "接口回路：%s。" % result
		"TOL-005": return "质量校零：%s。" % ("质量分布落在原型号公差内" if it.authentic else "质量分布偏离原型号公差，需结合暗纹判断真伪")
		"TOL-006": return "模拟负载：%s。%s" % [result, "磨损仍会限制长期可靠性。" if it.condition < 0.65 else ""]
	return ""

static func item_clue(it: Dictionary, tool: String) -> String:
	if tool == "SPEC":
		var profile := GameData.inspection_profile(it.defId)
		if profile.is_empty():
			return ""
		var measured: Dictionary = it.duplicate()
		var snapshot = it.get("specificResult", null)
		if snapshot is Dictionary:
			measured.working = snapshot.get("working", it.working)
			measured.repaired = snapshot.get("repaired", it.repaired)
		return "%s：%s。" % [profile.title, profile.normal if measured.working else profile.get("fault", fault_label(measured))]
	var c = GameData.content_clues.get(it.defId, null)
	var focus = c.clues.get(tool, null) if c != null else null
	return _physical_clue(it, tool) + (" 本次核对：%s。" % focus if focus != null else "")

static func displayed_clue(it: Dictionary, tool: String) -> String:
	if not GameData.applicable_tools(it.defId).has(tool):
		return "旧版检测记录：保留此前的物证，可用于估值与议价。" if GameData.relevant_tool(it.defId, tool) else "旧版检测记录：保留此前的辅助物证。"
	return item_clue(it, tool)

static func evidence_caption(it: Dictionary, tool: String) -> String:
	var caption := GameData.evidence_name(it.defId, tool)
	var recorded = it.get("specificResult", null)
	if tool == "SPEC" and it.repaired and recorded is Dictionary and not recorded.get("repaired", false):
		caption += " · 维修前记录"
	return caption

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

static func event_availability(s: Dictionary, choice: Dictionary):
	if s.phase != "open":
		return "每日事件只在营业期间处理。"
	if s.trade != null:
		return "先完成当前交易或送客，再处理每日事件。"
	var event = event_for_day(s.seed, s.day)
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
	var s := {"schema": 3, "seed": seed, "day": 1, "ap": 12, "cash": 1200, "phase": "open", "risk": 12, "relations": {"station": 30, "salvage": 35, "merchant": 20},
		"inventory": [], "trade": null, "cursor": 0, "ledger": [], "completedTrades": [], "orders": orders, "materials": mats, "events": [], "repairProgress": {},
		"scanned": [], "inspection": "announced", "upgrades": {"lamp": false, "shelf": false}, "report": null,
		"notice": "回环九号旧港重新点灯。先接待栗叔，翻面检查巡检蜂，再安排维修和订单。", "nextId": 1, "tutorial": 0}
	for id in ["ITM-001", "ITM-002", "ITM-003", "ITM-026", "ITM-027", "ITM-041"]:
		var it := new_item(s, id, {"condition": 0.55 if id == "ITM-001" else 0.85, "working": id != "ITM-001", "source": "前任店主移交清单 / 所有权已核对", "cost": jround(D(id).value * 0.28)})
		put_in(s, it)
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
	if def.id != "ORD-011" and (it.location == "isolation" or it.sealed):
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
	if not def.get("customerOwned", false) and def.id != "ORD-011" and not it.sourceVerified:
		return "来源尚未核验，不能履约。"
	if not def.get("customerOwned", false) and def.id != "ORD-011" and not it.working:
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

static func reduce(previous: Dictionary, a: Dictionary) -> Dictionary:
	GameData.ensure()
	var s: Dictionary = previous.duplicate(true)
	var type: String = a.type
	if type == "NEXT":
		if s.phase != "report":
			return previous
		if s.day >= 21 or s.has("outcome"):
			s.phase = "ending"
			return s
		s.day += 1
		s.ap = 12
		s.phase = "open"
		s.cursor = 0
		s.trade = null
		s.report = null
		s.scanned = []
		s.inspection = "pending" if s.day >= 3 else "announced"
		for o in s.orders:
			if (o.status == "available" or o.status == "active") and GameData.order(o.id).dueDay < s.day:
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
		var text := "第%s天开门。核对订单与到期抵押，租金和维护费在日结显示。" % jnum(s.day)
		if s.day == 2:
			text = "第2天：阿篁与澄九带来委修预约。到订单页接单，再到维修台换件复测。"
		elif s.day == 3:
			text = "第3天：饶静预约核验。先扫描来源不明货物，再登记或隔离，日结可选择首个升级。"
		return notice(s, text)
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
		s.report.upgraded = true
		s.report.cash = s.cash
		return notice(s, "工作灯已换装：新日鉴定首次费用减为0AP。" if a.id == "lamp" else "陈列架已换装：合法货物的陈列报价提高5%。")
	if s.phase != "open":
		return previous
	match type:
		"CHOOSE_EVENT":
			var event = event_for_day(s.seed, s.day)
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
			s.ap = clampn(s.ap + eff.get("ap", 0), 0, 12)
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
				if r.kind == "relief-window" and r.day == s.day:
					window = true
			if not window:
				return notice(s, "限期清仓只在首次结算欠费的救济窗口开放。")
			var due := rent_due(s.day)
			if s.cash >= 20 + due:
				return notice(s, "维护与租金缺口已补齐，请返回日结，清仓不会继续低价出售。")
			var it = find_inventory(s, a.uid)
			if it == null:
				return previous
			if trade_reserved(s, it) or not owns(it) or it.has("orderId") or not it.sourceVerified or it.sealed or it.location == "isolation":
				return notice(s, "应急清仓仍不能出售顾客、抵押、预留或来源未核货物。")
			var amount := maxf(1, floor(item_value(it) * 0.55))
			if not ledger(s, "relief-sale-%s" % it.uid, "clearance", "应急清仓 %s" % D(it.defId).name, amount, it.cost):
				return previous
			_remove_item(s, it.uid)
			return notice(s, "原物按清仓报价%sCr移交，未消耗AP。%s" % [jnum(amount), "欠款已补齐，可以重新结算。" if s.cash >= 20 + due else "可继续处理合法自有库存，直到补齐本次欠款。"])
		"ARRIVE":
			if s.trade != null:
				return notice(s, "先完成当前交易，或请客人收好物品。")
			if s.cursor >= daily_visit_limit():
				return notice(s, "今日六位预约已处理。可以维修、履约或提前打烊。")
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
					t.line = "这台折叠巡检蜂从旧航道带回。机臂展开后有点迟，你先看看。"
				elif s.day == 3 and s.cursor == 0:
					t.line = "这张定位片的持续脉冲和封签不一致，先别放上销售架。"
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
			t.line = npc_dialogue(s, t.npcId, "counter", "%s可以考虑。我先出%sCr，检测结果好的话还可以谈。" % [D(it.defId).name, jnum(t.price)], t.price)
			return s
		"CHECK":
			var it = find_item(s, a.uid)
			if it == null or not GameData.tool_ids.has(a.tool):
				return previous
			if a.tool == "SPEC" and GameData.inspection_profile(it.defId).is_empty():
				return previous
			if it.evidence.has(a.tool):
				if a.tool == "SPEC":
					it.specificResult = {"working": it.working, "repaired": it.repaired}
					return notice(s, "%s 已免费复测。" % item_clue(it, a.tool))
				return notice(s, "已取得该工具的证据，免费复看，不重复扣AP。")
			if not it.inspectedPaid:
				var cost := 0.0 if s.upgrades.lamp else 1.0
				if not has_ap(s, cost):
					return notice(s, "今日行动点不足，明日可继续，物证不会丢失。")
				spend(s, cost)
				it.inspectedPaid = true
			it.evidence.append(a.tool)
			if a.tool == "SPEC":
				it.specificResult = {"working": it.working, "repaired": it.repaired}
			s.tutorial = maxf(s.tutorial, 1)
			var extra := "已有两条独立物证，可交叉判断估值。" if evidence_count(it) >= 2 else "仍需另一工具的独立物证，不能只凭外观定真伪。"
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
			if t.rounds >= 3:
				return notice(s, "三次有效还价已用完，可以接受当前报价或送客。")
			var ev = a.get("evidence", null)
			if ev != null and (not it.evidence.has(ev) or not GameData.relevant_tool(it.defId, ev)):
				return notice(s, "请选这件实物已取得的相关物证，其他读数不能支撑议价。")
			t.evidenceUsed = relevant_evidence(it, t.evidenceUsed)
			if ev != null and not t.evidenceUsed.has(ev):
				t.evidenceUsed.append(ev)
			var terms := trade_terms(s, t, it)
			var acceptable := price_agreed(s, t, it, a.price)
			t.rounds += 1
			if acceptable:
				t.price = a.price
				t.locked = true
				t.line = npc_dialogue(s, t.npcId, "agreed", "物证说得通。价格确认，我们按这个数交割。", t.price)
			else:
				var insulting: bool = a.price > terms.ceiling * 1.5 if t.kind == "sell" else a.price < terms.floor * 0.55
				if t.rounds >= 3 or (insulting and t.rounds >= 2):
					return finish_trade(s, "%s %s" % [npc_dialogue(s, t.npcId, "refused", "今天先到这里。"), "连续悬殊报价耗尽了耐心，客人收起票据离开。钱货未发生变化。" if insulting else "三轮议价仍未达成一致，客人离开了。下一位预约仍可接待。"])
				t.price = counter_price(s, t, it)
				if insulting:
					t.line = "这个数太离谱了。我的报价是%sCr，再这样我就走。" % jnum(t.price)
				else:
					t.line = "%s 还剩%s轮。" % [npc_dialogue(s, t.npcId, "counter", "我只能让到%sCr。" % jnum(t.price), t.price), jnum(3 - t.rounds)]
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
				ledger(s, t.id, "sale", "售出 %s" % D(it.defId).name, t.price, it.cost)
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
			if not owns(it) or it.has("orderId") or it.location == "isolation" or it.sealed:
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
				it.listPrice = jround(item_value(it) * 1.05)
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
		"REPAIR_STEP":
			var it = find_inventory(s, a.uid)
			if it == null or trade_reserved(s, it) or it.owner == "pawn" or it.location == "isolation" or it.sealed or not it.sourceVerified or it.repaired:
				return notice(s, "该物件不能开始新的维修工序。")
			var progress: float = s.repairProgress.get(it.uid, 0)
			if a.stage != progress or a.stage < 0 or a.stage > 2:
				return notice(s, "按清洁排故、换件连接、负载复测的顺序操作。")
			s.repairProgress[it.uid] = progress + 1
			return notice(s, "三道工序准备完成，确认后才扣除材料与AP。" if progress == 2 else "工序位置已记录，材料与AP尚未提交。")
		"REPAIR":
			var it = find_inventory(s, a.uid)
			var r := GameData.recipe(a.recipeId)
			if it == null or r.is_empty() or r.kind != "repair":
				return previous
			if it.repaired:
				return notice(s, "该物件已完成本次修复，不能重复刷价值。")
			if trade_reserved(s, it) or it.owner == "pawn" or it.location == "isolation" or it.sealed or not it.sourceVerified:
				return notice(s, "保管、来源未核或隔离货物不能加工。")
			if r.itemId != it.defId and D(it.defId).get("recipeId", "") != r.id:
				return notice(s, "配方与实际物件不兼容。")
			if evidence_count(it) < 1:
				return notice(s, "先取得故障诊断证据，再开始修复。")
			if s.repairProgress.get(it.uid, 0) != 3:
				return notice(s, "尚未完成三道可见维修工序。")
			if not has_ap(s, r.ap):
				return notice(s, "修复需%sAP，当前不足。" % jnum(r.ap))
			for id in r.materials:
				if s.materials.get(id, 0) < r.materials[id]:
					return notice(s, "维修材料不足，请从物资采购补齐；尚未扣料。")
			for id in r.materials:
				s.materials[id] -= r.materials[id]
			spend(s, r.ap)
			it.cost += _materials_cost(r)
			it.repaired = true
			it.working = true
			it.condition = minf(0.9 if r.id == "REC-001" else 0.95, it.condition + 0.3)
			it.listPrice = item_value(it)
			s.tutorial = maxf(s.tutorial, 2)
			return notice(s, "修复与负载复测通过。外壳保留维修标记，真伪和来源没有改变。")
		"DISMANTLE":
			var it = find_inventory(s, a.uid)
			if it == null:
				return previous
			if trade_reserved(s, it) or not owns(it) or it.has("orderId") or it.location == "isolation" or it.sealed or not it.sourceVerified:
				return notice(s, "受托、抵押、订单占用、来源未核或隔离物品不能拆解。")
			if evidence_count(it) < 1 or not has_ap(s, 1):
				return notice(s, "拆解前需要故障诊断证据和1AP。")
			_remove_item(s, it.uid)
			s.materials["MAT-001"] = s.materials.get("MAT-001", 0) + 2
			s.materials["MAT-003"] = s.materials.get("MAT-003", 0) + 1
			spend(s, 1)
			return notice(s, "原物已不可逆拆解：获得导电纤维×2、标准微线圈×1。")
		"CRAFT":
			var r := GameData.recipe(a.recipeId)
			if r.is_empty() or r.kind != "craft" or not r.has("outputId"):
				return previous
			var ok := func(i: Dictionary, def_id: String) -> bool:
				return i.defId == def_id and owns(i) and not i.has("orderId") and i.working and i.sourceVerified and not trade_reserved(s, i) and not i.sealed and i.location != "isolation"
			var servo = null
			var bearing = null
			for i in s.inventory:
				if servo == null and ok.call(i, r.itemId):
					servo = i
				if bearing == null and ok.call(i, "ITM-027"):
					bearing = i
			if servo == null or bearing == null:
				return notice(s, "组装需要一台正常伺服器与一只已注销轴承，顾客原物不能作主料。")
			if s.repairProgress.get(servo.uid, 0) != 3:
				return notice(s, "请先将两件主料装入实体槽位并完成端子复测，再提交组装。")
			var lacking := false
			for id in r.materials:
				if s.materials.get(id, 0) < r.materials[id]:
					lacking = true
			if not has_ap(s, r.ap) or lacking:
				return notice(s, "组装材料或AP不足，主料未消耗。")
			var candidate := new_item(s, r.outputId, {"condition": 1, "working": true, "repaired": true, "evidence": ["TOL-004", "TOL-006"], "inspectedPaid": true, "cost": servo.cost + bearing.cost + _materials_cost(r)})
			var remaining := []
			for i in s.inventory:
				if i.uid != servo.uid and i.uid != bearing.uid:
					remaining.append(i)
			var trial := s.duplicate()
			trial.inventory = remaining
			var pos = empty_cell(trial, candidate)
			if pos == null:
				return notice(s, "组装成品需要3×2仓位，先整理后仓。")
			s.inventory = remaining
			candidate.x = pos.x
			candidate.y = pos.y
			s.inventory.append(candidate)
			for id in r.materials:
				s.materials[id] -= r.materials[id]
			spend(s, r.ap)
			return notice(s, "伺服器与轴承已装入维护框，双向限位测试通过，产出舱门维护套组。")
		"TAKE_ORDER":
			var def := GameData.order(a.id)
			var o = _order_state(s, a.id)
			if def.is_empty() or o == null or o.status != "available":
				return previous
			if s.day < float(GameData.order_earliest.get(def.id, 1)) or s.day > def.dueDay:
				return notice(s, "这张预约尚未开始或已经到期。")
			if def.id == "ORD-011" and not s.inventory.any(func(i): return i.defId == def.itemId and not i.sourceVerified):
				return notice(s, "没有实际来源争议件，不生成虚假的归还订单。")
			if def.id == "ORD-004" and not ["ITM-003", "ITM-041"].all(func(id): return s.inventory.any(func(i): return i.defId == id and owns(i) and i.working)):
				return notice(s, "需要同时持有正常光合灯与健康藻苗罐才能接单。")
			if def.id == "ORD-003" and not s.inventory.any(func(i): return i.defId == def.itemId and owns(i) and i.working):
				return notice(s, "先备好自有正常保温杯，再预约栗叔取货。")
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
			if def.id == "ORD-004":
				for i in s.inventory:
					if order_item_valid(s, a.id, i, "ITM-041") == null:
						extra = i
						break
				if extra == null:
					return notice(s, "还缺可交付的藻苗罐，请核对归属、封存、报价占用和物证后再交货。")
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
			if s.trade != null:
				return notice(s, "先交割或送客，再打烊。")
			if s.day >= 3 and s.inspection == "pending" and not inspection_ready(s):
				return notice(s, "预约安检尚未完成：把来源待核货物扫描并登记，或放入隔离柜。")
			var due := rent_due(s.day)
			var maintenance := 20.0
			var income := 0.0
			var expenses := 0.0
			for r in s.ledger:
				if r.day != s.day:
					continue
				if r.amount > 0 and r.kind != "pawn-return":
					income += r.amount
				if r.amount < 0:
					expenses -= r.amount
			if s.cash < maintenance + due:
				var current := false
				var used := false
				for r in s.ledger:
					if r.kind == "relief-window":
						used = true
						if r.day == s.day:
							current = true
				if not used:
					ledger(s, "relief-day-%s" % jnum(s.day), "relief-window", "首次欠费：限期清仓救济窗口", 0)
					return notice(s, "结算暂缓：维护%sCr、租金%sCr，尚缺%sCr。首次救济已开放，可在仓储应急清仓合法自有货，0AP变现；也可完成维修订单补齐后再结算。" % [jnum(maintenance), jnum(due), jnum(maintenance + due - s.cash)])
				if current and s.inventory.any(func(it): return owns(it) and not it.has("orderId") and it.sourceVerified and not it.sealed and it.location != "isolation"):
					return notice(s, "本次欠费还差%sCr。清仓窗口仍开放，请到仓储处理合法自有货再结算。" % jnum(maintenance + due - s.cash))
				s.phase = "ending"
				s.outcome = "限期清仓后仍无力支付店铺费用"
				return notice(s, "一次限期清仓机会已经提供；本次无法补齐费用，进入可回看的清算。")
			ledger(s, "maintenance-day-%s" % jnum(s.day), "maintenance", "每日能源维护", -maintenance)
			if due:
				ledger(s, "rent-day-%s" % jnum(s.day), "rent", "第%s天租金" % jnum(s.day), -due)
			s.report = {"day": s.day, "income": income, "expenses": expenses, "maintenance": maintenance, "rent": due, "cash": s.cash, "upgraded": false}
			s.phase = "report"
			if s.day == 21:
				s.outcome = "高风险转运站" if s.risk >= 60 else ("稀有收藏行" if s.relations.merchant > s.relations.salvage else "可信赖维修店")
			return notice(s, "日结完成。选择工作灯或模组货架作为首个升级，明日能看到变化。" if s.day >= 3 and not s.upgrades.lamp and not s.upgrades.shelf else "日结完成，租金与维护收据已归档。")
	return previous
