class_name BulkCrates
extends Object
## Saved physical originals stay private; offer() returns only visible observations.
const COUNT := 4
const SAMPLE_LIMIT := 2
const SOURCE := "流动商人整理的已登记回收旧表；整箱按现状出售，真伪与内部故障未作保证。"

static func ensure(s: Dictionary) -> void:
	if not s.get("bulkCrates") is Dictionary:
		s.bulkCrates = {"version":1,"days":{}}
	s.bulkCrates.version = 1
	if not s.bulkCrates.get("days") is Dictionary: s.bulkCrates.days = {}
	var day := Model.jnum(s.day)
	if s.bulkCrates.days.has(day): return
	GameData.ensure()
	var key := "bulk-%s-%s" % [str(Model.fnv(String(s.seed))),day]
	var items := []
	var models := []
	for index in COUNT:
		var physical_key := "%s/%d" % [key,index]
		var definition_id := WatchSupply.pick(String(s.seed),physical_key)
		# A salvage box contains visibly varied models rather than four clones.
		if definition_id in models:
			for definition in GameData.item_list:
				if definition.id not in models:
					definition_id = definition.id
					break
		models.append(definition_id)
		var uid := "%s-item-%d" % [key,index]
		var suffix := 0
		while _contains_uid(s,uid):
			suffix += 1
			uid = "%s-item-%d-reserved-%d" % [key,index,suffix]
		var draw := Model.fnv(String(s.seed)+physical_key+"/condition")
		var scratch := {"seed":s.seed,"nextId":1}
		items.append(Model.new_item(scratch,definition_id,{
			"uid":uid,"owner":"npc","condition":0.35+float((draw%15)+index*13)/100.0,
			"working":index%2==0,"authentic":WatchSupply.authentic(String(s.seed),physical_key),
			"sourceVerified":true,"source":SOURCE}))
	var price := 0
	for original in items: price += int(ceil(float(GameData.def(original.defId).value)*float(original.condition)*0.22))
	price = clampi(price,160,900)
	s.bulkCrates.days[day] = {"id":key,"title":"回收旧表整箱", "price":price,"items":items,"samples":[],"purchased":false,"sourceStatement":SOURCE}

static func _contains_uid(value, uid: String) -> bool:
	if value is Dictionary:
		if value.get("uid",null) == uid: return true
		for child in value.values():
			if (child is Dictionary or child is Array) and _contains_uid(child,uid): return true
	elif value is Array:
		for child in value:
			if (child is Dictionary or child is Array) and _contains_uid(child,uid): return true
	return false

static func _live_uid_exists(s: Dictionary, uid: String) -> bool:
	for key in s:
		if key != "bulkCrates" and _contains_uid(s[key],uid): return true
	return false

static func _lot(s: Dictionary) -> Dictionary:
	return s.bulkCrates.days[Model.jnum(s.day)]

static func _visit_problem(s: Dictionary) -> String:
	if s.get("phase","") != "open": return "打烊后不能抽检或买箱，请明日营业后再操作。"
	var trade = s.get("trade")
	if not trade is Dictionary or trade.get("kind","") != "merchant" or trade.get("inspectionVisit",false) or not String(trade.get("crimeCaseId","")).is_empty():
		return "请先接待普通流动商人，再抽检或购买本日整箱。"
	return ""

static func _sampled(lot: Dictionary, index: int) -> bool:
	return lot.samples.any(func(reading):return int(reading.index)==index)

static func _sample_problem(s: Dictionary, lot: Dictionary) -> String:
	if lot.purchased: return "本箱已经购入，可在后仓继续逐件检验。"
	var problem := _visit_problem(s)
	if problem != "": return problem
	if lot.samples.size() >= SAMPLE_LIMIT: return "本箱最多抽检两件不同原物，已有记录可免费重看。"
	if not Model.has_ap(s,1): return "抽检一件需要1 AP；已有记录可免费重看。"
	return ""

static func _buy_problem(s: Dictionary, lot: Dictionary) -> String:
	if lot.purchased: return "本箱已经购入，不能重复购买。"
	var problem := _visit_problem(s)
	if problem != "": return problem
	var trade: Dictionary = s.trade
	if trade.get("locked",false): return "请先完成或取消已确认的交易，再购买整箱。"
	for line in trade.get("session",{}).get("lines",[]):
		if line.get("status","") == "confirmed": return "请先完成或取消清单中已确认的商品，再购买整箱。"
	if float(s.cash) < float(lot.price): return "现金不足以支付整箱报价，钱货未变动。"
	if not Model.has_ap(s,1): return "购买整箱需要1 AP，钱货未变动。"
	for original in lot.items:
		if _live_uid_exists(s,String(original.uid)): return "整箱原物编号与现有持货冲突，请重新核对货物。"
		if original.get("stolen",false) or original.get("crimeRevealed",false) or not String(original.get("crimeCaseId","")).is_empty():
			return "整箱中存在失窃来源记录，不能按登记回收货品购入。"
	return ""

static func _visible(original: Dictionary, index: int) -> Dictionary:
	return {"index":index,"uid":original.uid,"defId":original.defId,"model":GameData.def(original.defId).name,"condition":original.condition,"working":original.working}

static func offer(s: Dictionary) -> Dictionary:
	ensure(s)
	var lot := _lot(s)
	var sample_problem := _sample_problem(s,lot)
	var buy_problem := _buy_problem(s,lot)
	var result := {"id":lot.id,"title":lot.title,"price":int(lot.price),"itemCount":COUNT,
		"sampleLimit":SAMPLE_LIMIT,"sampleCount":lot.samples.size(),"sampleOptions":[],
		"samples":lot.samples.duplicate(true),"items":[],"sourceStatement":lot.sourceStatement,
		"purchased":lot.purchased,"problem":buy_problem,"buyProblem":buy_problem,"sampleProblem":sample_problem}
	for reading in result.samples: reading.index = int(reading.index)
	for index in COUNT:
		var visible := _visible(lot.items[index],index)
		visible.sampled = _sampled(lot,index)
		result.items.append(visible)
		result.sampleOptions.append({"index":index,"label":"抽检第%d件 · %s" % [index+1,visible.model],"sampled":visible.sampled,"enabled":visible.sampled or sample_problem == "","problem":"" if visible.sampled else sample_problem})
	return result

static func reduce(previous: Dictionary, action: Dictionary):
	var type = action.get("type","")
	if type not in ["SAMPLE_BULK_CRATE","BUY_BULK_CRATE"]: return null
	var s := previous.duplicate(true)
	ensure(s)
	var lot := _lot(s)
	if type == "SAMPLE_BULK_CRATE":
		var index = action.get("index")
		if typeof(index) not in [TYPE_INT,TYPE_FLOAT] or float(index) != floor(float(index)) or float(index) < 0 or float(index) >= COUNT:
			return Model.notice(s,"请选择本箱第1至第4件原物抽检。")
		var visit_problem := _visit_problem(s)
		if visit_problem != "": return Model.notice(s,visit_problem)
		if _sampled(lot,int(index)): return Model.notice(s,"这件原物已有抽检记录，重看不再消耗 AP。")
		var problem := _sample_problem(s,lot)
		if problem != "": return Model.notice(s,problem)
		var original: Dictionary = lot.items[int(index)]
		var reading := _visible(original,int(index))
		reading.observation = "外观成色约%d%%；%s。仅作外观及短时试走记录，未开盖，也未判定真伪。" % [int(round(float(original.condition)*100)),"短时试走可见运行" if original.working else "短时试走未见运行"]
		lot.samples.append(reading)
		Model.spend(s,1)
		return Model.notice(s,"已抽检第%d件原物，记录已保存（1 AP）。" % [int(index)+1])
	var id = action.get("id")
	if not id is String or id != lot.id: return Model.notice(s,"整箱报价已变化，请重新查看本日货箱；钱货未变动。")
	var problem := _buy_problem(s,lot)
	if problem != "": return Model.notice(s,problem)
	var uids := []
	var remaining := int(lot.price)
	for index in COUNT:
		var original: Dictionary = lot.items[index].duplicate(true)
		original.owner = "shop"
		original.cost = int(lot.price)/COUNT if index < COUNT-1 else remaining
		remaining -= int(original.cost)
		if not Model.put_in(s,original): return Model.notice(previous.duplicate(true),"后仓无法放下整箱四件原物，请整理后重试；钱货、AP 与购买状态均未变动。")
		uids.append(original.uid)
	if not Model.ledger(s,lot.id,"bulk-purchase","商人整箱回收旧表（4件原物）",-float(lot.price),float(lot.price)):
		return Model.notice(previous.duplicate(true),"本箱已有交割记录，未重复支付或入库。")
	s.ledger.back().itemUids = uids
	s.ledger.back().bulkPurchase = true
	s.ledger.back().source = lot.sourceStatement
	lot.purchased = true
	Model.spend(s,1)
	var trade: Dictionary = s.trade
	var session: Dictionary = trade.get("session",{})
	var record: Dictionary = s.get("npcTrade",{}).get(trade.get("npcId",""),{})
	if not session.is_empty():
		session.cash = float(session.cash)+float(lot.price)
		session.version = int(session.get("version",0))+1
		if not record.is_empty(): record.cash = session.cash
	elif not record.is_empty(): record.cash = float(record.get("cash",0))+float(lot.price)
	return Model.notice(s,"整箱购入完成：四件原物已进入后仓，支付%s Cr 与1 AP。" % Model.jnum(lot.price))
