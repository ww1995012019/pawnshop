class_name ServiceContracts
extends Object
## Continuing service work. Offers contain symptoms; the original item owns all faults.
const ACTIONS := ["TAKE_SERVICE_CONTRACT", "QUOTE_SERVICE_CONTRACT", "DELIVER_SERVICE_CONTRACT", "RETURN_SERVICE_CONTRACT"]
const WORK_ACTIONS := ["SERVICE_BEGIN", "SERVICE_PROGRESS", "SERVICE_COMPLETE", "SERVICE_FINISH", "REFURB_PROGRESS", "REFURB_COMPLETE"]
const TERMINAL := ["complete", "cancelled", "expired"]
const CUSTOMERS := ["CHR-002", "CHR-003", "CHR-004", "CHR-005"]
const MODELS := ["WCH-001", "WCH-002", "WCH-007", "WCH-008", "WCH-010", "WCH-014", "WCH-015"]

static func _offer(s: Dictionary, slot: int) -> Dictionary:
	var day := int(s.day)
	var draw := Model.fnv("%s/%d/%d/service-contract-v1" % [s.seed,day,slot])
	var npc: String = CUSTOMERS[draw % CUSTOMERS.size()]
	var model: String = MODELS[Model.lcg(draw) % MODELS.size()]
	return {"id":"service-%08X-%d-%d" % [Model.fnv(s.seed),day,slot], "title":"%s · 手表委修" % GameData.npc(npc).name,
		"npcId":npc,"model":model,"uid":"","status":"available","budget":80+int(Model.lcg(Model.lcg(draw)) % 81),
		"quote":0,"offerDay":day,"dueDay":day+2+slot,"originalParts":slot == 0,"problem":"顾客反映手表停走，表面积灰；请先实物检查再报价。", "returned":false}

static func ensure(s: Dictionary) -> void:
	GameData.ensure()
	if not s.get("serviceContracts") is Dictionary: s.serviceContracts = {"version":1,"boardDay":0,"entries":[]}
	var data: Dictionary = s.serviceContracts
	data.version = 1
	if not data.get("entries") is Array: data.entries = []
	if int(data.get("boardDay",0)) != int(s.day):
		for entry in data.entries:
			if entry.status == "available": entry.status = "expired"
		for slot in 2:
			var offer := _offer(s,slot)
			if _find(s,offer.id) == null: data.entries.append(offer)
		data.boardDay = int(s.day)
	_refresh(s)

static func _find(s: Dictionary, id: String):
	for entry in s.serviceContracts.entries:
		if entry.id == id: return entry
	return null

static func _original(s: Dictionary, c: Dictionary):
	var it = Model.find_inventory(s,c.get("uid",""))
	if it == null or it.get("owner","") != "customer" or it.get("serviceJobId","") != c.id: return null
	if it.defId != c.model: return null
	return it

static func _diagnosed(it: Dictionary) -> bool:
	# The loupe records the visible dust/condition shared by every offer. Merely
	# adding a tool token or viewing a preview does not create this observation.
	return it.get("evidence",[]).has("TOL-001") and it.get("inspectionFacts",{}).get("TOL-001",{}).has("condition") and not String(it.get("evidenceReadings",{}).get("TOL-001","")).is_empty()

static func _safe_problem(s: Dictionary, it: Dictionary) -> String:
	if Model.trade_reserved(s,it): return "原物仍被交易占用，请先解除占用。"
	var service: Dictionary = it.get("service",{})
	if service.get("opened",false) or service.get("forge_task","") != "" or it.get("refurbishment",{}).get("active_case",false): return "请先安全回装并封盖，再归还原物。"
	for operation in service.get("operations",{}).values():
		if operation is Dictionary and not operation.get("complete",false) and not operation.is_empty(): return "请先完成当前工作台操作，再归还原物。"
	for operation in it.get("refurbishment",{}).get("operations",{}).values():
		if operation is Dictionary and not operation.get("complete",false) and not operation.is_empty(): return "请先完成当前翻新操作，再归还原物。"
	return ""

static func _parts_problem(c: Dictionary, it: Dictionary) -> String:
	if not c.originalParts: return ""
	var identity: Dictionary = c.get("identity",{})
	if not it.get("authentic",false) or it.get("watch",{}).get("serial","") != identity.get("serial","") or it.get("watch",{}).get("logo_variant",0) != identity.get("logo_variant",0): return "顾客要求保留原物与原装标识，当前实物不符。"
	for method in WatchForgery.treatments(it):
		if WatchForgery.active(it,method): return "顾客要求原装，不能交付伪装加工或替代件。"
	var ref: Dictionary = it.get("refurbishment",{})
	for job in ["case","strap"]:
		if ref.get("done",[]).has(job): return "顾客要求保留原装表壳与表带，不能替换后交付。"
	for entry in ref.get("history",[]):
		if entry.get("job","") in ["case","strap"]: return "顾客要求保留原装表壳与表带，当前已有替换记录。"
	return ""

static func _delivery_problem(s: Dictionary, c: Dictionary, it) -> String:
	if it == null: return "请找回登记的顾客原物，不能用同型号替代。"
	if not c.status in ["approved","ready"] or float(c.quote) <= 0: return "请先完成实物检查并取得顾客报价同意。"
	if int(s.day) > int(c.dueDay): return "委修已超过期限，请归还顾客原物。"
	var safe := _safe_problem(s,it)
	if safe != "": return safe
	if not it.get("repaired",false) or not it.get("working",false) or not it.get("service",{}).get("finished",false) or not WatchService.finished(it): return "实际维修与封盖复测尚未完成，不能交付。"
	for fault in it.get("service",{}).get("faults",[]):
		if not fault.get("resolved",false): return "原物尚有实际故障未排除，不能交付。"
	return _parts_problem(c,it)

static func _refresh(s: Dictionary) -> void:
	for c in s.serviceContracts.entries:
		if c.status in ["complete","cancelled","expired"]: continue
		if int(s.day) > int(c.dueDay):
			c.status = "expired"
			continue
		var it = _original(s,c)
		if it == null: continue
		if c.status in ["diagnosis","quoting"]: c.status = "quoting" if _diagnosed(it) else "diagnosis"
		elif c.status in ["approved","ready"]: c.status = "ready" if _delivery_problem(s,c,it) == "" else "approved"

static func _status_text(c: Dictionary) -> String:
	match c.status:
		"available": return "可接取 · 先检后报"
		"diagnosis": return "待实物检查"
		"quoting": return "已记录观察 · 待报价"
		"declined": return "报价超预算 · 可重报或归还"
		"approved": return "顾客已批准 · 待实际维修"
		"ready": return "维修已完成 · 可交付"
		"complete": return "已交付并收取服务费"
		"cancelled": return "已归还原物 · 未收费"
		"expired": return "已逾期 · 原物已归还" if c.get("returned",false) else "已逾期 · 请归还原物" if c.get("uid","") != "" else "预约已过期"
	return ""

static func contracts(s: Dictionary) -> Array:
	ensure(s)
	var result := []
	for c in s.serviceContracts.entries:
		var public := {}
		for key in ["id","title","npcId","model","uid","status","budget","quote","dueDay","originalParts","problem"]: public[key] = c.get(key,"" if key == "uid" else null)
		public.statusText = _status_text(c)
		public.ready = c.status == "ready"
		result.append(public)
	return result

static func observe(_previous: Dictionary, next: Dictionary, _action: Dictionary) -> void:
	ensure(next)

static func work_problem(s: Dictionary, it: Dictionary) -> String:
	if not it.has("serviceJobId"): return ""
	for job in s.get("serviceContracts",{}).get("entries",[]):
		if job.get("id","")!=it.serviceJobId: continue
		if float(job.get("quote",0))>0 and job.get("status","") in ["approved","ready","expired"]: return ""
		return "请先记录实物观察，并取得顾客对报价的同意后再维修。"
	return "委修登记缺失，请保留顾客原物。"

static func reduce(previous: Dictionary, action: Dictionary) -> Variant:
	var type := String(action.get("type",""))
	if type == "RETURN_ITEM":
		var original = Model.find_inventory(previous,action.get("uid",""))
		if original != null and original.has("serviceJobId"):
			return reduce(previous,{"type":"RETURN_SERVICE_CONTRACT","id":original.serviceJobId})
		return null
	if not ACTIONS.has(type) and not WORK_ACTIONS.has(type): return null
	var s: Dictionary = previous.duplicate(true)
	ensure(s)
	if WORK_ACTIONS.has(type):
		var it = Model.find_inventory(s,action.get("uid",""))
		if it == null or not it.has("serviceJobId"): return null
		var problem := work_problem(s,it)
		return null if problem=="" else Model.notice(s,problem)
	var c = _find(s,String(action.get("id","")))
	if c == null: return s
	if type == "RETURN_SERVICE_CONTRACT":
		if c.get("uid","") == "" or c.get("returned",false) or c.status == "complete": return s
		var it = _original(s,c)
		if it == null: return Model.notice(s,"登记原物不在保管中，不能以替代品归还。")
		var problem := _safe_problem(s,it)
		if problem != "": return Model.notice(s,problem)
		Model._remove_item(s,it.uid)
		c.returned = true
		c.returnDay = int(s.day)
		if c.status != "expired": c.status = "cancelled"
		return Model.notice(s,"顾客原物已归还，没有收取费用。")
	var hours := Model.business_hours_problem(s)
	if hours != "": return Model.notice(s,hours)
	if type == "TAKE_SERVICE_CONTRACT":
		if c.status != "available" or int(c.offerDay) != int(s.day): return s
		if s.get("trade") != null: return Model.notice(s,"请先接待完当前来客，再接取委修原物。")
		var held := 0
		for existing in s.serviceContracts.entries:
			if existing.get("uid","") != "" and not existing.get("returned",false) and existing.status != "complete": held += 1
		if held >= 3: return Model.notice(s,"最多保管三件委修原物，请先交付或归还。")
		# Test placement before allocating a UID, then commit the standard item once.
		var probe := {"uid":"","defId":c.model,"rotated":false}
		if Model.empty_cell(s,probe) == null: return Model.notice(s,"后仓没有保管顾客原物的空间，请先整理。")
		var it := Model.new_item(s,c.model,{"owner":"customer","serviceJobId":c.id,"condition":0.6,"working":false,"authentic":true,"sourceVerified":true,"source":"%s 顾客委修原物 / 禁止销售" % c.id,"cost":0})
		if not Model.put_in(s,it): return Model.notice(previous.duplicate(true),"后仓空间不足，尚未接取或扣费。")
		c.uid = it.uid
		c.identity = {"serial":it.watch.serial,"logo_variant":it.watch.logo_variant}
		c.acceptedDay = int(s.day)
		c.status = "diagnosis"
		return Model.notice(s,"已保管顾客故障原表；先实物检查，再报价，尚未收费。")
	var it = _original(s,c)
	if type == "QUOTE_SERVICE_CONTRACT":
		if not c.status in ["diagnosis","quoting","declined"]: return Model.notice(s,"这张委修当前不能重新报价。")
		if it == null: return Model.notice(s,"请找回登记原物后再报价。")
		if not _diagnosed(it): return Model.notice(s,"请先在实物检查台记录至少一项相关观察。")
		var price = action.get("price",0)
		if not typeof(price) in [TYPE_INT,TYPE_FLOAT]: return Model.notice(s,"服务报价须为正整数。")
		if not is_finite(float(price)) or float(price) <= 0 or float(price) != floor(float(price)): return Model.notice(s,"服务报价须为正整数。")
		if float(price) > float(c.budget):
			c.status = "declined"
			c.declinedPrice = price
			c.quote = 0
			return Model.notice(s,"顾客拒绝超预算报价；未收费，原物仍代保管，可重报或归还。")
		c.quote = int(price)
		c.status = "approved"
		return Model.notice(s,"顾客同意 %dCr 服务费；完成实际维修并交付时才收款。" % c.quote)
	if type == "DELIVER_SERVICE_CONTRACT":
		if c.status in TERMINAL: return s
		var problem := _delivery_problem(s,c,it)
		if problem != "": return Model.notice(s,problem)
		if not Model.has_ap(s,1): return Model.notice(s,"交付委修需要 1AP。")
		var ledger_id: String = "service-job-"+c.id
		if not Model.ledger(s,ledger_id,"service-job",c.title+" · 服务费",float(c.quote),float(it.cost)): return s
		s.ledger.back().uid = it.uid
		s.ledger.back().npcId = c.npcId
		s.ledger.back().defId = it.defId
		s.ledger.back().serviceJobId = c.id
		Model.spend(s,1)
		Model._remove_item(s,it.uid)
		c.status = "complete"
		c.completedDay = int(s.day)
		return Model.notice(s,"顾客原物已交付，实际收取服务费 %dCr。" % c.quote)
	return s
