extends RefCounted
## Godot's live commerce rules extend the shared legacy reducer without changing
## its TypeScript replay contract. Everything returned here is JSON-saveable.

const MERCHANT_ID := "CHR-010"
const CrimeEvents = preload("res://scripts/model/crime_events.gd")
const RARE_ITEMS := ["ITM-056", "ITM-055", "ITM-072", "ITM-099"]

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
	if int(s.day) > 3:
		var key := "%s/%s/%s" % [s.seed, Model.jnum(s.day), Model.jnum(s.cursor)]
		if Model.fnv(key + "/new-visitor") % 3 == 0:
			var ids := ["CHR-011", "CHR-012", "CHR-013"]
			return ids[Model.fnv(key + "/visitor-role") % ids.size()]
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

static func forgery_problem(s: Dictionary, item) -> String:
	if item == null:
		return "请先选择一件自有物品。"
	if s.phase != "open":
		return "打烊后不能处理货物。"
	if item.owner != "shop" or item.has("orderId") or item.sealed or item.location == "isolation" or not item.sourceVerified or Model.trade_reserved(s, item):
		return "只能处理来源已核验、未被占用的店铺自有货物。"
	if item.has("forgery"):
		return "这件物品已经做过伪装。"
	if item.condition >= 0.9 and item.working and item.authentic:
		return "这件货物的品相和状态已经足够好。"
	if not Model.has_ap(s, 1):
		return "伪装需要 1 AP。"
	if s.materials.get("MAT-001", 0) < 1 or s.materials.get("MAT-004", 0) < 1:
		return "伪装需要导电纤维×1和合规封签×1。"
	return ""

static func reduce(previous: Dictionary, action: Dictionary) -> Dictionary:
	GameData.ensure()
	var kind: String = action.get("type", "")
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
	if kind == "FORGE":
		var item = Model.find_inventory(previous, action.get("uid", ""))
		var problem := forgery_problem(previous, item)
		if problem != "":
			return _message(previous, problem)
		var s: Dictionary = previous.duplicate(true)
		item = Model.find_inventory(s, item.uid)
		s.materials["MAT-001"] -= 1
		s.materials["MAT-004"] -= 1
		Model.spend(s, 1)
		item.cost += GameData.material("MAT-001").price + GameData.material("MAT-004").price
		item.forgery = {"condition": maxf(float(item.condition), 0.9), "working": true,
			"authentic": true, "exposed": false}
		return Model.notice(s, "伪装完成：真实状态未改变。顾客仍可能识破。")
	if kind == "SELECT_TRADE" and previous.phase == "open" and previous.trade != null and previous.trade.kind == "sell" and not previous.trade.locked:
		var item = Model.find_inventory(previous, action.get("uid", ""))
		var forged = item.get("forgery", null) if item != null else null
		var checked: Dictionary = previous.trade.get("forgeryChecks", {})
		if forged is Dictionary and not forged.get("exposed", false) and not checked.has(item.uid) and Model.sale_eligibility(item, previous.trade.npcId) == null:
			var s: Dictionary = previous.duplicate(true)
			item = Model.find_inventory(s, item.uid)
			var npc := GameData.npc(s.trade.npcId)
			var chance := clampi(int(npc.get("detect", 42)), 0, 100)
			var draw := Model.fnv("%s/%s/%s/forgery" % [s.seed, s.trade.id, item.uid]) % 100
			var checks: Dictionary = s.trade.get("forgeryChecks", {})
			checks[item.uid] = "caught" if draw < chance else "passed"
			s.trade.forgeryChecks = checks
			if draw < chance:
				item.forgery.exposed = true
				s.trade.erase("selectedUid")
				s.trade.price = 0
				s.trade.evidenceUsed = []
				s.risk = Model.clampn(s.risk + 10)
				var faction: String = npc.faction
				s.relations[faction] = Model.clampn(s.relations[faction] - 8)
				s.trade.line = "伪装被识破了，我不会按这个状态收货。"
				return Model.notice(s, "顾客识破伪装：货物未售出，风险上升，关系下降。")
			return Model.reduce(s, action)
	if kind == "ARRIVE" and merchant_due(previous):
		var s: Dictionary = previous.duplicate(true)
		s.trade = _new_merchant(s)
		return Model.notice(s, "流动商人已到店，可以购买维修材料、交易多余物资。")
	if kind == "ARRIVE":
		var next := Model.reduce(previous, action)
		if previous.trade == null and next.trade != null:
			var npc_id := next_visitor(previous)
			if npc_id != next.trade.npcId:
				var t: Dictionary = next.trade
				t.npcId = npc_id
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
		if item.owner != "shop" or item.has("orderId") or item.sealed or item.location == "isolation" or not item.sourceVerified or Model.trade_reserved(previous, item):
			return _message(previous, "只能回收来源已核验、未被占用的店铺自有物品。")
		if not Model.has_ap(previous, 1):
			return _message(previous, "行动点不足，旧物未售出。")
		var price := maxf(1, floor(Model.item_value(item) * 0.6))
		if previous.cash + price > 1000000000:
			return _message(previous, "现金已达到保存上限，本次没有出售旧物。")
		var s: Dictionary = previous.duplicate(true)
		Model.ledger(s, Model.next_id(s, "merchant-sale"), "sale", "商人回收 %s" % GameData.def(item.defId).name, price, item.cost)
		Model._remove_item(s, item.uid)
		Model.spend(s, 1)
		return Model.notice(s, "旧物已移交商人，收到 %s Cr。" % Model.jnum(price))
	return Model.reduce(previous, action)
