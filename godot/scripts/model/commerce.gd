extends RefCounted
## Godot's live commerce rules extend the shared legacy reducer without changing
## its TypeScript replay contract. Everything returned here is JSON-saveable.

const MERCHANT_ID := "CHR-010"
const Wanted = preload("res://scripts/model/wanted_cases.gd")
const CrimeEvents = preload("res://scripts/model/crime_events.gd")
const RARE_ITEMS := ["WCH-003", "WCH-008", "WCH-012", "WCH-015"]

static func merchant_slot(s: Dictionary) -> int:
	var day := int(s.day)
	if day == 1:
		return 4 # Keep the first four tutorial visitors intact.
	var cycle := int((day - 2) / 2)
	var draw := Model.fnv("%s/merchant/%d" % [s.seed, cycle])
	if day != 2 + cycle * 2 + draw % 2:
		return -1
	return 4 + int((draw >> 3) % 2) if day <= 3 else int((draw >> 3) % Model.daily_visit_limit())

static func merchant_due(s: Dictionary) -> bool:
	return s.phase == "open" and s.trade == null and int(s.cursor) == merchant_slot(s)

static func next_visitor(s: Dictionary) -> String:
	if merchant_due(s):
		return MERCHANT_ID
	var override := Wanted.visitor_override(s,merchant_slot(s))
	if override != "": return override
	if int(s.day) > 3:
		var key := "%s/%s/%s" % [s.seed, Model.jnum(s.day), Model.jnum(s.cursor)]
		if Model.fnv(key + "/new-visitor") % 3 == 0:
			var ids := ["CHR-011", "CHR-012", "CHR-013"]
			return ids[Model.fnv(key + "/visitor-role") % ids.size()]
		var newcomers := Wanted.live_candidates(s)
		if not newcomers.is_empty() and Model.fnv(key+"/expanded-cast") % 3 == 0:
			return newcomers[Model.fnv(key+"/expanded-person") % newcomers.size()]
	return Model.market_npc_id(s)

static func _new_merchant(s: Dictionary) -> Dictionary:
	var stock := {}
	for material in GameData.materials:
		stock[material.id] = 5
	var roll := Model.fnv("%s/merchant-stock/%s" % [s.seed, Model.jnum(s.day)])
	var rare = null
	if roll % 100 < 40:
		var item_id: String = RARE_ITEMS[int((roll >> 8) % RARE_ITEMS.size())]
		rare = {"defId": item_id, "price": maxi(1, int(round(GameData.def(item_id).value * 0.85))), "available": true}
	return {"id": Model.next_id(s, "merchant"), "npcId": MERCHANT_ID, "kind": "merchant",
		"item": null, "price": 0, "rounds": 0, "locked": false, "evidenceUsed": [],
		"line": "这趟带了常用耗材，也收多余零件。稀罕货要看运气。", "stock": stock, "rare": rare}

static func _quantity(action: Dictionary) -> int:
	var qty = action.get("qty", null)
	if not (qty is int or qty is float) or not is_finite(float(qty)):
		return 0
	if float(qty) != floor(float(qty)) or qty < 1 or qty > 99:
		return 0
	return int(qty)

static func _merchant_present(s: Dictionary) -> bool:
	return s.phase == "open" and s.trade != null and s.trade.get("kind", "") == "merchant"

static func _message(previous: Dictionary, text: String) -> Dictionary:
	return Model.notice(previous.duplicate(true), text)

static func forgery_problem(s: Dictionary, item, method := "") -> String:
	if item == null: return "请先选择一件自有手表。"
	if s.phase != "open": return "打烊后不能加工。"
	if item.owner != "shop" or item.has("orderId") or item.sealed or item.location == "isolation" or not item.sourceVerified or Model.trade_reserved(s, item):
		return "只能加工来源已核验、未被占用的店铺自有手表。"
	if item.get("service", {}).get("opened", false) and item.service.get("forge_task", "") != "forge_" + method:
		return "请先收妥内部维修并封盖，再切换伪装加工。"
	if method == "":
		for candidate in WatchForgery.available_methods(item):
			if forgery_problem(s, item, candidate) == "": return ""
		return "暂无可用加工方式，请核对材料、行动点和加工记录。"
	if not WatchForgery.available_methods(item).has(method): return "请选择标识、编号或配重加工。"
	if method in ["serial","weight"]:
		var problem := StoreCosts.device_problem(s,"uv" if method == "serial" else "scale")
		if problem != "": return problem
	if WatchForgery.completed(item,method): return "本件已做过这项加工，不能重复。"
	if WatchForgery.target_id(item)!="" and method in ["serial","weight"] and WatchForgery.appearance_id(item)!=WatchForgery.target_id(item):
		return "请先完成目标换壳，再覆印编号或校准配重。"
	if method == "case" and WatchForgery.target_id(item)=="": return "请先选择兼容的高价目标款。"
	if method == "weight":
		var ref_id := WatchForgery.target_id(item) if WatchForgery.target_id(item)!="" else String(item.defId)
		var ref: Dictionary = GameData.def(ref_id).watch
		if WatchForgery.target_id(item)!="" and absf(WatchRules.mass(item)-float(ref.nominal_mass))<=float(ref.tolerance): return "重量已在目标容差内，无需配重或额外付费。"
		if WatchRules.mass(item)>=float(ref.nominal_mass): return "当前质量不低于参考值，添加配重不能减轻手表。"
	if not Model.has_ap(s, 1): return "加工需要1 AP。"
	for id in WatchForgery.COSTS[method]:
		if s.materials.get(id, 0) < WatchForgery.COSTS[method][id]: return "材料不足：" + WatchForgery.cost_text(method)
	return ""

static func recovery_price(s: Dictionary, item: Dictionary) -> float:
	var belief_trade := {"id": "merchant-resale-" + item.uid, "npcId": MERCHANT_ID, "kind": "sell", "evidenceUsed": []}
	return maxf(1, floor(Model.trade_terms(s, belief_trade, item).value * 0.6))

static func _check_forgery(s: Dictionary, item: Dictionary) -> Array[String]:
	var expertise := Model.watch_expertise(s.trade.npcId)
	var all_checks: Dictionary = s.trade.get("forgeryChecks", {})
	var checks = all_checks.get(item.uid, {})
	if not checks is Dictionary: checks = {}
	var caught: Array[String] = []
	var targeted := WatchForgery.is_targeted(item)
	var matching := WatchForgery.matches(item)
	for method in WatchForgery.available_methods(item):
		if not targeted and (not WatchForgery.active(item,method) or checks.has(method)): continue
		if checks.get(method,"")=="caught": continue
		var chance := WatchForgery.check_chance(float(expertise[WatchForgery.SKILLS[method]]),bool(matching[method])) if targeted else float(expertise[WatchForgery.SKILLS[method]])
		var draw := Model.fnv("%s/%s/%s/forgery/%s" % [s.seed,s.trade.id,item.uid,method])%100
		checks[method]="caught" if draw<chance else "passed"
		if draw<chance:
			if WatchForgery.active(item,method): item.forgery.methods[method].exposed=true
			caught.append(WatchForgery.LABELS[method])
	all_checks[item.uid] = checks
	s.trade.forgeryChecks = all_checks
	if item.has("forgery"): item.forgery.exposed = WatchForgery.exposed(item)
	return caught

static func forgery_rejected(s: Dictionary, item: Dictionary) -> bool:
	if s.trade == null: return false
	var checks = s.trade.get("forgeryChecks", {}).get(item.uid, {})
	if not checks is Dictionary: return false
	for method in WatchForgery.available_methods(item):
		if checks.get(method, "") == "caught" and (WatchForgery.is_targeted(item) or WatchForgery.active(item,method)): return true
	return false

static func _reject_forgery(s: Dictionary, item: Dictionary, caught: Array[String]) -> Dictionary:
	s.trade.erase("selectedUid")
	s.trade.price = 0
	s.trade.evidenceUsed = []
	var checks: Dictionary = s.trade.forgeryChecks[item.uid]
	var first_penalty: bool = not checks.get("_penalized", false)
	if first_penalty:
		checks._penalized = true
		s.risk = Model.clampn(s.risk + 10)
		var faction: String = GameData.npc(s.trade.npcId).faction
		s.relations[faction] = Model.clampn(s.relations[faction] - 8)
	s.trade.line = "伪装我识破了：%s有加工痕迹，不会按这个状态收货。" % "、".join(caught)
	return Model.notice(s, "伪装被识破：%s；本次未售出。%s" % ["、".join(caught), "关注+10，阵营关系-8。" if first_penalty else "同一轮已记录处罚，不重复扣关系或增加关注。"])

static func reduce(previous: Dictionary, action: Dictionary) -> Dictionary:
	GameData.ensure()
	var batch_result=TradeSession.reduce(previous,action)
	if batch_result!=null: return batch_result
	var kind: String = action.get("type", "")
	if not TradeSession.session(previous).is_empty():
		if kind=="REFUSE": return TradeSession.reduce(previous,{"type":"TRADE_END"})
		if kind in ["SELECT_TRADE","OFFER","ACCEPT","DELIVER","PAWN","SELL_MERCHANT_ITEM"]:
			return _message(previous,"本次使用多件清单，请在清单逐件确认并统一交割，或结束接待。")
	var wanted_result = Wanted.reduce(previous, action)
	if wanted_result != null: return wanted_result
	if kind == "CHOOSE_EVENT" and CrimeEvents.is_crime(CrimeEvents.event_for_day(previous)):
		return CrimeEvents.reduce(previous, action)
	if kind == "REGISTER":
		var candidate = Model.find_inventory(previous, action.get("uid", ""))
		if candidate != null and candidate.get("stolen", false):
			return _message(previous, "疑似赃物不能登记为合法货物，请移交站务。")
	if kind == "REPORT_STOLEN":
		var candidate = Model.find_inventory(previous, action.get("uid", ""))
		if previous.phase != "open" or candidate == null or not candidate.get("stolen", false) or Model.trade_reserved(previous, candidate):
			return previous
		var s: Dictionary = previous.duplicate(true)
		Model._remove_item(s, candidate.uid)
		s.risk = Model.clampn(s.risk - 6)
		s.relations.station = Model.clampn(s.relations.station + 3)
		return Model.notice(s, "疑似赃物已移交站务，风险下降。")
	if kind == "FORGE_TARGET":
		var item=Model.find_inventory(previous,action.get("uid",""))
		var id=action.get("target","")
		if not id is String: return previous
		var why := WatchForgery.select_problem(previous,item,id)
		if why!="": return _message(previous,why)
		var s: Dictionary=previous.duplicate(true)
		item=Model.find_inventory(s,item.uid)
		if not item.get("forgery") is Dictionary: item.forgery={"methods":{}}
		if item.forgery.get("targetId","")!=id:
			for method in WatchForgery.TARGET_METHODS:
				item.get("service",{}).get("operations",{}).erase("forge_"+method)
		item.forgery.version=2
		item.forgery.targetId=id
		return Model.notice(s,"目标已选：%s。完成加工后才会改变外观与顾客估价。" % GameData.def(id).name)
	if kind == "FORGE":
		var item = Model.find_inventory(previous, action.get("uid", ""))
		var method: String = action.get("method", "logo")
		var problem := forgery_problem(previous, item, method)
		if problem != "": return _message(previous, problem)
		var operation: Dictionary = item.get("service", {}).get("operations", {}).get("forge_" + method, {})
		if not operation.get("complete", false) or operation.get("opened", false) or operation.get("targetId","")!=WatchForgery.target_id(item):
			return _message(previous, "请先在修表工作台完成这项加工的实际操作与封盖。")
		var s: Dictionary = previous.duplicate(true)
		item = Model.find_inventory(s, item.uid)
		for id in WatchForgery.COSTS[method]:
			s.materials[id] -= WatchForgery.COSTS[method][id]
			item.cost += GameData.material(id).price * WatchForgery.COSTS[method][id]
		Model.spend(s, 1)
		WatchForgery.apply(item, method)
		if method in ["serial","weight"]: StoreCosts.record(s,"uv" if method == "serial" else "scale","forge|%s|%s|%s" % [item.uid,WatchForgery.target_id(item),method],0.5)
		item.service.opened = false
		item.service.erase("forge_task")
		return Model.notice(s, "%s完成：加工痕迹与实物变化已记录，请复测；内部机芯故障仍需维修。" % WatchForgery.LABELS[method])
	if kind == "SELECT_TRADE" and previous.phase == "open" and previous.trade != null and previous.trade.kind == "sell" and not previous.trade.locked:
		var item = Model.find_inventory(previous, action.get("uid", ""))
		if item != null and not WatchForgery.treatments(item).is_empty() and Model.sale_eligibility(item, previous.trade.npcId) == null:
			var s: Dictionary = previous.duplicate(true)
			item = Model.find_inventory(s, item.uid)
			var caught := _check_forgery(s, item)
			if not caught.is_empty(): return _reject_forgery(s, item, caught)
			if forgery_rejected(s, item): return Model.notice(s, "这位顾客本轮已识破本件加工，不接受反复推荐；可更换货物或接待其他客人。")
			return Model.reduce(s, action)

	if kind == "ARRIVE" and merchant_due(previous):
		var s: Dictionary = previous.duplicate(true)
		s.trade = _new_merchant(s)
		return Model.notice(s, "流动商人已到店，可以购买维修材料、交易多余物资。")
	if kind == "ARRIVE" and previous.trade == null and previous.phase == "open" and next_visitor(previous) == Wanted.OFFICER_ID:
		var state := previous.duplicate(true)
		Wanted.ensure(state)
		state.trade = Wanted.new_officer_trade(state)
		return Model.notice(state,"巡警到店，带来了带照片的协查档案。")
	if kind == "ARRIVE":
		var next := Model.reduce(previous, action)
		if previous.trade == null and next.trade != null:
			var npc_id := next_visitor(previous)
			if npc_id != next.trade.npcId:
				var t: Dictionary = next.trade
				t.npcId = npc_id
				t.npcKnowledge = {}
				var npc := GameData.npc(npc_id)
				var greeting := Model.npc_dialogue(next, npc_id, "arrival", npc.line)
				if t.kind == "buy":
					t.price = maxf(Model.market_stock(previous).price, Model.trade_terms(next, t, t.item).floor)
					t.line = "%s 来路：%s。" % [greeting, String(t.item.source).split(" / ")[0]]
				else:
					t.line = "%s 这次采购：%s" % [greeting, Model.customer_need(npc_id)]
		return next
	if kind == "BUY_MATERIAL":
		if not _merchant_present(previous):
			return _message(previous, "维修材料只能等流动商人上门时购买。")
		var qty := _quantity(action)
		var id: String = action.get("id", "")
		if qty == 0 or GameData.material(id).is_empty():
			return previous
		if int(previous.trade.stock.get(id, 0)) < qty:
			return _message(previous, "商人携带的这种材料不足。")
		if previous.materials.get(id, 0) + qty > 99999:
			return _message(previous, "材料库存已满，本次没有购买。")
		var before: float = previous.materials.get(id, 0)
		var next := Model.reduce(previous, action)
		if next.materials.get(id, 0) == before + qty:
			next.trade.stock[id] -= qty
		return next
	if kind == "SELL_MATERIAL":
		if not _merchant_present(previous):
			return _message(previous, "商人不在店里，暂时不能出售材料。")
		var qty := _quantity(action)
		var id: String = action.get("id", "")
		var material := GameData.material(id)
		if qty == 0 or material.is_empty():
			return previous
		if previous.materials.get(id, 0) < qty:
			return _message(previous, "材料数量不足，交易未发生。")
		var price := maxi(1, floori(float(material.price) * 0.5)) * qty
		if previous.cash + price > 1000000000:
			return _message(previous, "现金已达到保存上限，本次没有出售材料。")
		var s: Dictionary = previous.duplicate(true)
		Model.ledger(s, Model.next_id(s, "material-sale"), "material-sale", "出售 %s×%d" % [material.name, qty], price)
		s.materials[id] -= qty
		return Model.notice(s, "售出 %s×%d，收到 %d Cr。" % [material.name, qty, price])
	if kind == "BUY_RARE_ITEM":
		if not _merchant_present(previous):
			return _message(previous, "商人不在店里，暂时不能购买稀有货物。")
		var rare = previous.trade.get("rare", null)
		if not rare is Dictionary or not rare.get("available", false):
			return _message(previous, "本次没有可购买的稀有货物。")
		var price: float = rare.price
		if previous.cash < price or not Model.has_ap(previous, 1):
			return _message(previous, "现金或行动点不足，稀有货物未成交。")
		var s: Dictionary = previous.duplicate(true)
		var item := Model.new_item(s, rare.defId, {"condition": 1.0, "working": true,
			"authentic": true, "sourceVerified": true, "source": "流动商人的已登记货品", "cost": price})
		if not Model.put_in(s, item):
			return _message(previous, "后仓没有足够空间，稀有货物未成交。")
		Model.ledger(s, Model.next_id(s, "merchant-purchase"), "purchase", "商人购入 %s" % GameData.def(item.defId).name, -price, price)
		Model.spend(s, 1)
		s.trade.rare.available = false
		return Model.notice(s, "稀有货物已入后仓，钱货同步交割。")
	if kind == "SELL_MERCHANT_ITEM":
		if not _merchant_present(previous):
			return _message(previous, "商人不在店里，暂时不能回收物品。")
		var item = Model.find_inventory(previous, action.get("uid", ""))
		if item == null:
			return previous
		if item.owner != "shop" or item.has("orderId") or item.sealed or item.location == "isolation" or not item.sourceVerified or Model.trade_reserved(previous, item) or item.get("service", {}).get("opened", false):
			return _message(previous, "只能回收来源已核验、未被占用的店铺自有物品。")
		if not Model.has_ap(previous, 1):
			return _message(previous, "行动点不足，旧物未售出。")
		var checked_state: Dictionary = previous.duplicate(true)
		var checked_item: Dictionary = Model.find_inventory(checked_state, item.uid)
		var caught := _check_forgery(checked_state, checked_item)
		if not caught.is_empty(): return _reject_forgery(checked_state, checked_item, caught)
		if forgery_rejected(checked_state, checked_item): return Model.notice(checked_state, "本轮商人已识破这只表的加工，不接受反复出售。")
		var price := recovery_price(checked_state, checked_item)
		if previous.cash + price > 1000000000:
			return _message(previous, "现金已达到保存上限，本次没有出售旧物。")
		var s: Dictionary = checked_state
		Model.ledger(s, Model.next_id(s, "merchant-sale"), "sale", "商人回收 %s" % WatchForgery.sale_name(item), price, item.cost)
		Model._remove_item(s, item.uid)
		Model.spend(s, 1)
		return Model.notice(s, "旧物已移交商人，收到 %s Cr。" % Model.jnum(price))
	return Model.reduce(previous, action)
