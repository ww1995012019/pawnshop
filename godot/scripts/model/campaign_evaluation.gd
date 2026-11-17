class_name CampaignEvaluation
extends RefCounted
## Read-only lower bounds from retained public records. No observer or migration
## runs here: opening an assessment cannot create history or move resources.

const SPECIALTY_MINIMUM := 3
const CRITERIA := "完成维修至少3件或检查至少3种名贵/珍稀公开型号可形成专长；两项达标取数量较高者，平手维修优先；均未达标为稳健旧货铺，关注达到60优先判为高风险。"

static func _credit(ids: Dictionary, identity: String) -> void:
	if identity != "": ids[identity]=true

static func _originals(s: Dictionary) -> Dictionary:
	var result: Dictionary={}
	var lots: Array=s.get("inventory",[]).duplicate()
	var trade: Dictionary=s.get("trade",{}) if s.get("trade") is Dictionary else {}
	if trade.get("item") is Dictionary: lots.append(trade.item)
	var session: Dictionary=trade.get("session",{})
	lots.append_array(session.get("goods",[]))
	lots.append_array(session.get("acquired",[]))
	for it in lots:
		if it is Dictionary and String(it.get("uid",""))!="": result[String(it.uid)]=it
	return result

static func _recorded_repair(ids: Dictionary, marker: String) -> void:
	var key:=marker.trim_prefix("event/")
	var parts:=key.split("/")
	if parts.size()==3 and parts[0]=="repair" and parts[2].is_valid_int(): _credit(ids,parts[1])

static func _fixed_delivery(orders: Dictionary, repairs: Dictionary, delivered: Dictionary, id: String, uid := "") -> void:
	var definition: Dictionary=GameData.order(id)
	if definition.is_empty(): return
	_credit(orders,"order:"+id)
	if definition.get("needsRepair",false):
		_credit(delivered,"order:"+id)
		_credit(repairs,uid)

static func _rolling_delivery(orders: Dictionary, repairs: Dictionary, delivered: Dictionary, id: String, uid: String) -> void:
	if id=="": return
	_credit(orders,"service:"+id)
	_credit(delivered,"service:"+id)
	_credit(repairs,uid)

static func summary(s: Dictionary) -> Dictionary:
	GameData.ensure()
	var repairs: Dictionary={}
	var orders: Dictionary={}
	var delivered: Dictionary={}
	var inspected: Dictionary={}
	var originals:=_originals(s)
	for uid in originals:
		var it: Dictionary=originals[uid]
		if it.get("repaired",false) and it.get("owner","") in ["shop","customer"]: _credit(repairs,uid)
		for tool in it.get("evidence",[]):
			var observed: Dictionary=it.get("inspectionFacts",{}).get(tool,{}).get("appraisalObservation",{})
			# The physical casing can change after an observation. Only the
			# public model stamped when checking identifies what was inspected.
			if observed.get("schema",0)!=1 or observed.get("unknown",false) or observed.get("tool","")!=tool: continue
			_credit(inspected,String(observed.get("publicModel","")))
	var journal: Dictionary=s.get("shopJournal",{})
	for uid in journal.get("histories",{}):
		for event in journal.histories[uid]: _recorded_repair(repairs,String(event.get("id","")))
	for marker in journal.get("markers",{}): _recorded_repair(repairs,String(marker))
	for uid in journal.get("originals",{}):
		var recorded: Dictionary=journal.originals[uid]
		# Lifetime inspected+current casing does not prove the casing was
		# inspected. Exact public inspection history also survives departure.
		for id in recorded.get("inspectedModels",[]): _credit(inspected,String(id))
	for row in s.get("orders",[]):
		if row.get("status","")=="done": _fixed_delivery(orders,repairs,delivered,String(row.get("id","")),String(row.get("uid","")))
	for row in s.get("serviceContracts",{}).get("entries",[]):
		if row.get("status","")=="complete": _rolling_delivery(orders,repairs,delivered,String(row.get("id","")),String(row.get("uid","")))
	for identity in s.get("storageExpansion",{}).get("completedOrderIds",[]):
		var id:=String(identity)
		if id.begins_with("order:"): _fixed_delivery(orders,repairs,delivered,id.trim_prefix("order:"))
		elif id.begins_with("service:"): _rolling_delivery(orders,repairs,delivered,id.trim_prefix("service:"),"")
	var net:=0.0
	for row in s.get("ledger",[]):
		net+=float(row.get("amount",0))
		var id:=String(row.get("id",""))
		var kind:=String(row.get("kind",""))
		if kind in ["order","service"] and id.begins_with("order-"):
			_fixed_delivery(orders,repairs,delivered,id.trim_prefix("order-"),String(row.get("uid","")))
		elif kind=="service-job":
			var job:=String(row.get("serviceJobId",id.trim_prefix("service-job-") if id.begins_with("service-job-") else ""))
			_rolling_delivery(orders,repairs,delivered,job,String(row.get("uid","")))
	var rare:=0
	var models:=0
	for id in inspected:
		var definition: Dictionary=GameData.items.get(id,{})
		if definition.is_empty(): continue
		models+=1
		if definition.get("tier","") in ["luxury","ultra"]: rare+=1
	var count:=repairs.size()
	var risk:=float(s.get("risk",0))
	var route:="稳健旧货铺"
	if risk>=60: route="高风险转运站"
	elif count>=SPECIALTY_MINIMUM and count>=rare: route="可信赖维修店"
	elif rare>=SPECIALTY_MINIMUM: route="稀有收藏行"
	var reason:="留存成果：完成维修%d件，已检查名贵/珍稀型号%d种。%s" % [count,rare,CRITERIA]
	if s.has("outcome"):
		route=String(s.outcome)
		reason="已保存的结局予以保留，不按新规则改写。"+reason
	return {"version":1,"repairsCompleted":count,"fulfilledOrders":orders.size(),"repairDeliveries":delivered.size(),
		"inspectedModels":models,"rareModels":rare,"netCashFlow":net,"cash":float(s.get("cash",0)),"risk":risk,
		"outcome":route,"reason":reason,"evidenceNote":"仅统计留存记录可确认的成果，旧档可能只是历史下限；未记录检查时公开型号的旧物证不推定收藏专长，无原物编号的维修交付单列，不补写已离店原物。净现金流是账本收付合计，不代表利润。"}

static func outcome(s: Dictionary) -> String:
	return String(summary(s).outcome)
