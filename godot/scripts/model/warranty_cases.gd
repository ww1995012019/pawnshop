class_name WarrantyCases
extends Object
## Warranty custody is a saved snapshot of an actual paid delivery, never a draw.
const ACTIONS := ["TAKE_WARRANTY_CASE","REJECT_WARRANTY_CASE","FREE_WARRANTY_REPAIR","PAID_WARRANTY_REPAIR","REFUND_WARRANTY_CASE","DELIVER_WARRANTY_CASE","RETURN_WARRANTY_CASE"]
const WORK_ACTIONS := ["SERVICE_BEGIN","SERVICE_PROGRESS","SERVICE_COMPLETE","SERVICE_FINISH","REFURB_PROGRESS","REFURB_COMPLETE"]
const CLOSED := ["resolved","rejected","returned"]

static func ensure(s: Dictionary) -> void:
	if not s.get("warrantyCases") is Dictionary: s.warrantyCases = {"version":1,"startDay":int(s.day),"entries":[],"history":[]}
	var data: Dictionary = s.warrantyCases
	data.version = 1
	if not data.has("startDay"): data.startDay = int(s.day)
	if not data.get("entries") is Array: data.entries = []
	if not data.get("history") is Array: data.history = []
	for c in data.entries:
		if c.status in CLOSED: continue
		if c.get("acceptedDay",0) > 0:
			if int(s.day) > int(c.dueDay): c.status = "expired"
		elif int(s.day) > int(c.availableDay)+2: c.status = "expired"
		elif int(s.day) >= int(c.availableDay): c.status = "available"
		else: c.status = "upcoming"

static func _find(s: Dictionary, id: String):
	for c in s.get("warrantyCases",{}).get("entries",[]):
		if c.id == id: return c
	return null

static func _original(s: Dictionary, c: Dictionary):
	var it = Model.find_inventory(s,c.uid)
	if it == null or it.get("owner","") != "customer" or it.get("warrantyCaseId","") != c.id or it.defId != c.original.defId: return null
	return it

static func _collision(s: Dictionary, uid: String) -> bool:
	if Model.find_inventory(s,uid) != null: return true
	var trade = s.get("trade")
	if trade is Dictionary:
		if trade.get("item",{}).get("uid","") == uid or trade.get("selectedUid","") == uid: return true
		for it in trade.get("items",[]):
			if it is Dictionary and it.get("uid","") == uid: return true
	for record in s.get("nightCrime",{}).get("cases",[]):
		for it in record.get("items",[]):
			if it.get("uid","") == uid: return true
	return false

static func _custody_problem(s: Dictionary, it: Dictionary) -> String:
	if it.get("stolen",false) or it.has("crimeCaseId") or not it.get("sourceVerified",false) or it.get("sealed",false) or it.get("location","") == "isolation": return "原物涉及来源或站务保管，请先处理保管记录。"
	if Model.trade_reserved(s,it): return "原物仍被交易占用，请先解除占用。"
	return ""

static func _safe_problem(s: Dictionary, it: Dictionary) -> String:
	var custody := _custody_problem(s,it)
	if custody != "": return custody
	var service: Dictionary = it.get("service",{})
	if service.get("opened",false) or service.get("forge_task","") != "" or it.get("refurbishment",{}).get("active_case",false): return "请先安全回装并封盖，再归还原物。"
	for data in [service,it.get("refurbishment",{})]:
		for operation in data.get("operations",{}).values():
			if operation is Dictionary and not operation.is_empty() and not operation.get("complete",false): return "请先完成当前工作台操作，再归还原物。"
	return ""

static func _diagnosed(c: Dictionary, it: Dictionary) -> bool:
	# This case concerns visible new accumulation, not a hidden functional diagnosis.
	var facts: Dictionary = it.get("inspectionFacts",{}).get("TOL-001",{})
	return it.get("evidence",[]).has("TOL-001") and facts.has("condition") and facts.get("originalDefId","") == it.defId and is_equal_approx(float(facts.condition),float(c.returnedCondition)) and not String(it.get("evidenceReadings",{}).get("TOL-001","")).is_empty()

static func work_problem(s: Dictionary, it: Dictionary) -> String:
	if not it.has("warrantyCaseId"): return ""
	var c = _find(s,String(it.warrantyCaseId))
	if c == null or _original(s,c) == null: return "返修登记缺失，请保留顾客原物。"
	var custody := _custody_problem(s,it)
	if custody != "": return custody
	if c.get("resolution","") in ["free","paid"] and c.status in ["approved","expired"]: return ""
	return "请先对返还原物重新检查，再取得顾客对免费或付费返修的同意。"

static func observe(previous: Dictionary, next: Dictionary, action: Dictionary) -> void:
	ensure(next)
	if not action.get("type","") in ["DELIVER_SERVICE_CONTRACT","DELIVER_ORDER"]: return
	var seen := {}
	for row in previous.get("ledger",[]): seen[String(row.get("id",""))] = true
	for row in next.get("ledger",[]):
		if seen.has(String(row.get("id",""))) or not row.get("kind","") in ["service-job","service"] or float(row.get("amount",0)) <= 0: continue
		var uid := String(row.get("uid",""))
		var npc := String(row.get("npcId",""))
		if uid == "" or npc == "": continue
		var it = Model.find_inventory(previous,uid)
		if it == null or Model.find_inventory(next,uid) != null or it.get("owner","") != "customer" or it.has("warrantyCaseId") or it.get("stolen",false) or it.has("crimeCaseId"): continue
		if _custody_problem(previous,it) != "" or not it.get("repaired",false) or not it.get("service",{}).get("finished",false): continue
		var original: Dictionary = it.duplicate(true)
		if not WatchService.finished(original): continue
		if original.service.get("faults",[]).any(func(f): return not f.get("resolved",false)): continue
		if row.get("defId",original.defId) != original.defId: continue
		var duplicate := false
		for c in next.warrantyCases.entries:
			if c.uid == uid: duplicate = true
		if duplicate: continue
		var available := int(next.day)+2
		# A fixed new external problem changes condition/service, never identity/parts.
		var returned_condition := minf(float(original.condition)-0.12,0.65)
		var prior_dust := false
		for f in original.service.get("faults",[]):
			if f.get("id","") == "dust" and f.get("resolved",false): prior_dust = true
		next.warrantyCases.entries.append({"id":"warranty-"+String(row.id),"uid":uid,"npcId":npc,"status":"upcoming","availableDay":available,"dueDay":available+2,"original":original,"priorFee":float(row.amount),"receiptId":row.id,"completedDay":int(next.day),"priorAction":String(action.get("type","")),"returnedCondition":returned_condition,"priorDust":prior_dust,"acceptedDay":0,"resolution":"","fee":0,"returned":false})

static func _problem(s: Dictionary, c: Dictionary, type: String) -> String:
	if c.status in CLOSED: return "此返修记录已结案。"
	if type == "REJECT_WARRANTY_CASE": return "" if int(c.acceptedDay) == 0 and c.status in ["available","upcoming"] else "已经保管原物，请用归还原物结案。"
	if type == "TAKE_WARRANTY_CASE":
		if c.status != "available": return "返修预约尚未开放或已经过期。"
		var hours := Model.business_hours_problem(s)
		if hours != "": return hours
		if s.get("trade") != null: return "请先接待完当前来客，再接取返修原物。"
		if _collision(s,c.uid): return "原物编号仍在交易、仓库或失窃保管记录中，不能重复接取。"
		if Model.empty_cell(s,c.original) == null: return "后仓没有保管顾客原物的空间，请先整理。"
		return ""
	var it = _original(s,c)
	if it == null: return "登记的顾客原物不在保管中，不能使用替代品。"
	if type in ["RETURN_WARRANTY_CASE","REFUND_WARRANTY_CASE"]: return _safe_problem(s,it)
	if c.status == "expired": return "返修已逾期；可安全收工并归还原物，不能新增收费。"
	var hours := Model.business_hours_problem(s)
	if hours != "": return hours
	if type in ["FREE_WARRANTY_REPAIR","PAID_WARRANTY_REPAIR"]:
		if c.status != "diagnosis": return "顾客已经确认处理方案，不能重复议价。"
		var custody := _custody_problem(s,it)
		if custody != "": return custody
		if not _diagnosed(c,it): return "请在检查台对这件返还原物重新记录放大镜观察。"
		return ""
	if type == "DELIVER_WARRANTY_CASE":
		if c.status != "approved": return "请先重新检查并与顾客确认返修方案。"
		var safe := _safe_problem(s,it)
		if safe != "": return safe
		if not it.get("repaired",false) or not it.get("working",false) or not it.get("service",{}).get("finished",false) or not WatchService.finished(it): return "实际返修与安全封盖尚未完成，不能交付。"
		for fault in it.service.get("faults",[]):
			if not fault.get("resolved",false): return "原物尚有实际故障未排除，不能交付。"
		if it.watch != c.original.watch or it.service.profile != c.original.service.profile: return "请保留登记原物的序号、原有零件与机芯配置。"
		if c.resolution == "paid" and not Model.has_ap(s,1): return "付费返修交付需要 1AP。"
	return ""

static func _close(s: Dictionary, c: Dictionary, resolution: String, trust: int) -> void:
	c.status = "resolved" if resolution in ["free","paid","refund"] else "returned"
	c.resolution = resolution
	c.trustDelta = trust
	c.resolvedDay = int(s.day)
	c.returned = true
	c.outcomeNote = "原服务记录包含清洁；本次观察可支持同类复查，但不能证明故障责任。" if c.priorDust else "原服务记录未包含此次积灰问题；已公开说明这是有争议的新问题，不把返修当作原维修失误。"
	s.warrantyCases.history.append({"id":c.id,"uid":c.uid,"npcId":c.npcId,"resolution":resolution,"day":int(s.day)})

static func reduce(previous: Dictionary, action: Dictionary) -> Variant:
	var type := String(action.get("type",""))
	if type == "RETURN_ITEM":
		var it = Model.find_inventory(previous,action.get("uid",""))
		if it == null or not it.has("warrantyCaseId"): return null
		return reduce(previous,{"type":"RETURN_WARRANTY_CASE","id":it.warrantyCaseId})
	if not type in ACTIONS and not type in WORK_ACTIONS: return null
	var s := previous.duplicate(true)
	ensure(s)
	if type in WORK_ACTIONS:
		var it = Model.find_inventory(s,action.get("uid",""))
		if it == null or not it.has("warrantyCaseId"): return null
		var why := work_problem(s,it)
		return null if why == "" else Model.notice(s,why)
	var c = _find(s,String(action.get("id","")))
	if c == null: return s
	var problem := _problem(s,c,type)
	if problem != "": return Model.notice(s,problem)
	match type:
		"REJECT_WARRANTY_CASE":
			c.status = "rejected"
			c.resolution = "rejected"
			c.trustDelta = 0
			c.resolvedDay = int(s.day)
			return Model.notice(s,"已拒绝返修预约，没有接取原物或收取费用。")
		"TAKE_WARRANTY_CASE":
			var it: Dictionary = c.original.duplicate(true)
			for key in ["serviceJobId","orderId","reservedBy","reservedFor","tradeId"]: it.erase(key)
			it.owner = "customer"
			it.warrantyCaseId = c.id
			it.condition = c.returnedCondition
			it.repaired = false
			it.evidence = []
			it.evidenceReadings = {}
			it.inspectionFacts = {}
			it.inspectedPaid = false
			it.service = {"version":1,"profile":c.original.service.profile.duplicate(true),"faults":[{"id":"dust","kind":"dust","label":"返还原物可见新积灰；需重新检查，不能据此确定责任。","internal":false,"functional":false,"resolved":false,"discovered":true}],"tasks":["dust"],"done":[],"opened":false,"operations":{},"paid":{},"active":false,"finished":false}
			if not Model.put_in(s,it): return Model.notice(previous.duplicate(true),"后仓空间不足，未接取原物。")
			c.acceptedDay = int(s.day)
			c.dueDay = int(s.day)+4
			c.status = "diagnosis"
			return Model.notice(s,"已接回同一顾客原表；旧维修记录单独保留，请重新检查当前积灰。")
		"FREE_WARRANTY_REPAIR","PAID_WARRANTY_REPAIR":
			var fee = action.get("price",20)
			if type == "PAID_WARRANTY_REPAIR" and (not typeof(fee) in [TYPE_INT,TYPE_FLOAT] or not is_finite(float(fee)) or float(fee) != floor(float(fee)) or float(fee) < 1 or float(fee) > 20): return Model.notice(s,"协商返修费须为 1 至 20Cr 的整数，交付时才收费。")
			c.resolution = "free" if type == "FREE_WARRANTY_REPAIR" else "paid"
			c.fee = 0 if c.resolution == "free" else int(fee)
			c.status = "approved"
			return Model.notice(s,"顾客已确认返修方案；请完成实际工作，尚未收取费用。")
		"REFUND_WARRANTY_CASE":
			var amount = action.get("amount",c.priorFee)
			if not typeof(amount) in [TYPE_INT,TYPE_FLOAT] or not is_finite(float(amount)) or float(amount) <= 0 or float(amount) > float(c.priorFee): return Model.notice(s,"退款须大于零且不超过原服务实收费用。")
			if float(s.cash) < float(amount): return Model.notice(s,"现金不足，尚未退款或归还原物。")
			if not Model.ledger(s,"warranty-refund-"+c.id,"service-refund","返修协商退款",-float(amount)): return s
			s.ledger.back().merge({"uid":c.uid,"npcId":c.npcId,"defId":c.original.defId,"warrantyCaseId":c.id})
			Model._remove_item(s,c.uid)
			c.refund = float(amount)
			_close(s,c,"refund",1)
			return Model.notice(s,"已按原服务实收上限退款并归还原物；未声称完成维修。")
		"RETURN_WARRANTY_CASE":
			Model._remove_item(s,c.uid)
			_close(s,c,"refused",0)
			return Model.notice(s,"原物已安全归还，问题未解决，没有新增收费。")
		"DELIVER_WARRANTY_CASE":
			if c.resolution == "paid":
				if not Model.ledger(s,"warranty-service-"+c.id,"service-job","协商返修服务费",float(c.fee)): return s
				s.ledger.back().merge({"uid":c.uid,"npcId":c.npcId,"defId":c.original.defId,"warrantyCaseId":c.id})
				Model.spend(s,1)
			Model._remove_item(s,c.uid)
			_close(s,c,c.resolution,1)
			return Model.notice(s,"已交还实际修复并安全封盖的原物；按确认方案结算。")
	return s

static func view(previous: Dictionary) -> Array:
	var s := previous.duplicate(true)
	ensure(s)
	var result: Array = []
	for c in s.warrantyCases.entries:
		if int(s.day) < int(c.availableDay)-1: continue
		var status_text := {"upcoming":"明日返修预约","available":"顾客待接洽 · 三日窗口","diagnosis":"原物保管中 · 待重新检查","approved":"方案已同意 · 待实际返修","expired":"已过期 · 可安全归还原物","resolved":"返修协商已结案","returned":"原物已归还 · 问题未解决","rejected":"预约已拒绝"}
		var p := {"id":c.id,"type":"warranty","title":"%s · 服务后回访" % GameData.npc(c.npcId).name,"status":c.status,"statusText":status_text.get(c.status,c.status),"availableDay":c.availableDay,"dueDay":c.dueDay,"uid":c.uid,"npcId":c.npcId,"description":"顾客带回曾付费服务的同一原表，反映表面重新积灰。原费 %sCr；需新观察再协商，旧记录不能代替当前检查。" % Model.jnum(c.priorFee),"clues":[],"actions":[],"navigation":[]}
		p.clues.append("原服务实际完成：%d日；实收 %sCr。" % [c.completedDay,Model.jnum(c.priorFee)])
		var prior_steps: Array[String] = []
		for task in c.original.service.get("done",[]): prior_steps.append(WatchService.label(String(task),c.original))
		if not prior_steps.is_empty(): p.clues.append("原服务已完成工序："+"、".join(prior_steps))
		p.clues.append("原记录包含除尘；本次同类复查可能合理，仍不能据此断定责任。" if c.priorDust else "原记录未包含本次积灰；这是有争议的新问题，可协商新服务。")
		if c.status in CLOSED:
			p.resolution = c.get("resolution","")
			p.trustDelta = c.get("trustDelta",0)
			p.clues.append(c.get("outcomeNote","未接取原物，没有发生维修或退款。"))
		else:
			var choices := []
			if int(c.acceptedDay) == 0 and c.status in ["upcoming","available"]: choices = [["接取返修原物","TAKE_WARRANTY_CASE"],["拒绝预约","REJECT_WARRANTY_CASE"]]
			elif int(c.acceptedDay) > 0:
				if c.status == "diagnosis": choices = [["免费返修","FREE_WARRANTY_REPAIR"],["协商付费 20Cr","PAID_WARRANTY_REPAIR"]]
				if c.status == "approved": choices.append(["交还修复原物","DELIVER_WARRANTY_CASE"])
				choices.append(["退还原服务费并归还","REFUND_WARRANTY_CASE"])
				choices.append(["归还原物 · 问题未解决","RETURN_WARRANTY_CASE"])
				p.navigation = [{"label":"重新检查原物","page":"inspect","uid":c.uid},{"label":"实际返修工作台","page":"repair","uid":c.uid}]
			for choice in choices:
				var why := _problem(s,c,choice[1])
				if choice[1] == "REFUND_WARRANTY_CASE" and why == "" and float(s.cash) < float(c.priorFee): why = "现金不足，尚未退款或归还原物。"
				p.actions.append({"label":choice[0],"action":{"type":choice[1],"id":c.id},"problem":why})
		result.append(p)
	return result
