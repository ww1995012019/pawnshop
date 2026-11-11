class_name OwnershipClaims
extends Object
## Entrusted found property: public records are compared only with fresh original observations.
const ACTIONS := ["ACCEPT_OWNERSHIP_CLAIM", "DECLINE_OWNERSHIP_CLAIM", "HANDOFF_OWNERSHIP_CLAIM", "STATION_OWNERSHIP_CLAIM"]
const WORK_ACTIONS := ["SERVICE_BEGIN", "SERVICE_PROGRESS", "SERVICE_COMPLETE", "SERVICE_FINISH", "REFURB_BEGIN", "REFURB_START", "REFURB_PROGRESS", "REFURB_COMPLETE", "FORGE", "FORGE_TARGET", "REPAIR", "REPAIR_STEP", "DISMANTLE", "FORGE_BEGIN", "FORGE_PROGRESS", "FORGE_COMPLETE", "FORGE_FINISH"]

static func _find(s: Dictionary, id: String):
	for c in s.ownershipClaims.entries:
		if c.id == id: return c
	return null

static func _offer(s: Dictionary, day: int) -> Dictionary:
	var draw := Model.fnv("%s/%d/ownership-claim-v1" % [s.seed,day])
	var serial := "BC N1 %04d %06d" % [2400+draw%26,draw%1000000]
	var records := [{"id":"CHR-002","name":String(GameData.npc("CHR-002").name),"serial":serial,"model":"WCH-001","condition":0.64}, {"id":"CHR-003","name":String(GameData.npc("CHR-003").name),"serial":serial+"-8","model":"WCH-001","condition":0.82}]
	if draw%2: records.reverse()
	return {"id":"claim-%08X-%d" % [Model.fnv(s.seed),day],"availableDay":day,"dueDay":day+2,"status":"preview","uid":"","model":"WCH-001","serial":serial,"condition":0.64,"records":records,"returned":false}

static func ensure(s: Dictionary) -> void:
	GameData.ensure()
	if not s.get("ownershipClaims") is Dictionary: s.ownershipClaims = {"version":1,"startDay":int(s.day),"entries":[]}
	var data: Dictionary = s.ownershipClaims
	data.version = 1
	if not data.has("startDay"): data.startDay = int(s.day)
	if not data.get("entries") is Array: data.entries = []
	var first := int(data.startDay)+2
	if int(s.day) >= first-1:
		var count := int((int(s.day)-first+1)/12)+1
		for slot in count:
			var day := first+slot*12
			var offer := _offer(s,day)
			if _find(s,offer.id) == null: data.entries.append(offer)
	_refresh(s)

static func _original(s: Dictionary, c: Dictionary):
	var it = Model.find_inventory(s,c.uid)
	if it == null or it.get("eventClaimId","") != c.id or it.get("owner","") != "customer" or it.defId != c.model: return null
	return it

static func _fresh(it: Dictionary) -> bool:
	for tool in ["TOL-001","TOL-002"]:
		if not it.get("evidence",[]).has(tool): return false
		if String(it.get("evidenceReadings",{}).get(tool,"")) != WatchRules.reading(it,tool): return false
		var facts: Dictionary = it.get("inspectionFacts",{}).get(tool,{})
		var actual := Model.record_inspection(it.duplicate(true),tool)
		for key in ["condition","originalDefId","logo_variant" if tool == "TOL-001" else "serial"]:
			if not facts.has(key) or facts[key] != actual[key]: return false
	return true

static func _matches(it: Dictionary, record: Dictionary) -> bool:
	if not _fresh(it): return false
	var facts: Dictionary = it.inspectionFacts["TOL-001"]
	return it.inspectionFacts["TOL-002"].serial == record.serial and facts.originalDefId == record.model and is_equal_approx(float(facts.condition),float(record.condition))

static func _refresh(s: Dictionary) -> void:
	for c in s.ownershipClaims.entries:
		if c.status in ["completed","declined","expired"]: continue
		if int(s.day) > int(c.dueDay):
			c.status = "expired"
			continue
		if c.uid == "":
			c.status = "available" if int(s.day) >= int(c.availableDay) else "preview"
			continue
		c.status = "investigating"
		var it = _original(s,c)
		if it != null:
			for record in c.records:
				if _matches(it,record): c.status = "ready"

static func _safe_problem(s: Dictionary, it: Dictionary) -> String:
	if Model.trade_reserved(s,it): return "原物仍被交易占用，请先解除占用。"
	var service: Dictionary = it.get("service",{})
	if service.get("opened",false) or service.get("forge_task","") != "" or it.get("refurbishment",{}).get("active_case",false): return "请先安全回装并封盖，再移交原物。"
	for group in [service.get("operations",{}),it.get("refurbishment",{}).get("operations",{})]:
		for operation in group.values():
			if operation is Dictionary and not operation.is_empty() and not operation.get("complete",false): return "请先完成当前工作台操作并封盖，再移交原物。"
	return ""

static func _accept_problem(s: Dictionary, c: Dictionary) -> String:
	if c.status != "available": return "尚未开放或本次招领已结束。"
	var hours := Model.business_hours_problem(s)
	if hours != "": return hours
	if s.get("trade") != null: return "请先接待完当前来客，再接收失物。"
	if not Model.has_ap(s,1): return "接收失物需要 1AP。"
	if Model.empty_cell(s,{"uid":"","defId":c.model,"rotated":false}) == null: return "后仓没有保管失物的空间，请先整理。"
	return ""

static func _handoff_problem(s: Dictionary, c: Dictionary, claimant := "", station := false) -> String:
	if c.uid == "" or c.get("returned",false) or c.status == "completed": return "当前没有待移交的登记原物。"
	var it = _original(s,c)
	if it == null: return "登记原物不在保管中，不能用同型号替代。"
	var safe := _safe_problem(s,it)
	if safe != "": return safe
	if station: return ""
	if c.status == "expired": return "招领已逾期，请将原物移交失物站。"
	var hours := Model.business_hours_problem(s)
	if hours != "": return hours
	if not _fresh(it): return "请对登记原物使用放大镜和编号检测，记录最新外观与编号读数。"
	for record in c.records:
		if record.id == claimant:
			if _matches(it,record): return ""
			return "该认领人的编号、型号或外观记录与实物证据不符；可安全移交失物站。"
	return "请选择已登记的认领人。"

static func work_problem(_s: Dictionary, it: Dictionary) -> String:
	if not it.has("eventClaimId"): return ""
	return "这是代保管失物，未获物主授权维修、翻新或改刻；请保留原物并核对认领记录。"

static func _status_text(c: Dictionary) -> String:
	match c.status:
		"preview": return "即将开放 · 失物代保管"
		"available": return "可接收 · 两人认领"
		"investigating": return "待核对原物证据"
		"ready": return "已有匹配证据 · 待移交"
		"completed": return "已安全移交失物站" if c.get("station",false) else "已交还匹配物主"
		"declined": return "已婉拒 · 未接收原物"
		"expired": return "已逾期 · 原物已移交失物站" if c.get("returned",false) else "已逾期 · 请安全移交失物站" if c.uid != "" else "接收窗口已结束"
	return ""

static func view(s: Dictionary) -> Array:
	ensure(s)
	var result := []
	for c in s.ownershipClaims.entries:
		var people: Array = []
		for record in c.records:
			people.append({"id":record.id,"name":record.name,"statement":"登记型号 %s；编号 %s；可见成色 %d%%。" % [GameData.def(record.model).name,record.serial,roundi(float(record.condition)*100)]})
		var actions: Array = []
		if c.uid == "" and c.status in ["preview","available"]:
			actions.append({"label":"接收代保管失物 · 1AP","action":{"type":"ACCEPT_OWNERSHIP_CLAIM","id":c.id},"problem":_accept_problem(s,c)})
			actions.append({"label":"婉拒代保管","action":{"type":"DECLINE_OWNERSHIP_CLAIM","id":c.id},"problem":""})
		elif c.uid != "" and not c.returned and c.status != "completed":
			for person in people:
				actions.append({"label":"交还给 "+person.name,"action":{"type":"HANDOFF_OWNERSHIP_CLAIM","id":c.id,"claimantId":person.id},"problem":_handoff_problem(s,c,person.id)})
			actions.append({"label":"安全移交失物站 · 无报酬","action":{"type":"STATION_OWNERSHIP_CLAIM","id":c.id},"problem":_handoff_problem(s,c,"",true)})
		var nav: Array = []
		if _original(s,c) != null: nav.append({"label":"检查登记原物","page":"inspect","uid":c.uid})
		result.append({"id":c.id,"type":"claim","title":"失物招领 · 两份认领记录","status":c.status,"statusText":_status_text(c),"availableDay":int(c.availableDay),"dueDay":int(c.dueDay),"uid":c.uid,"description":"邻人拾得手表，明确委托本店暂存核对；不属于店铺库存。核对原物编号、型号与外观后交还；无法确定可无偿移交失物站。匹配交还可获 35Cr 寻主服务酬谢。","clues":["放大镜记录当前外观，编号检测记录当前编号。","两位认领人的登记陈述如下；陈述本身不是鉴定证据。"],"claimants":people,"actions":actions,"navigation":nav})
	return result.duplicate(true)

static func observe(_previous: Dictionary, next: Dictionary, _action: Dictionary) -> void:
	ensure(next)

static func reduce(previous: Dictionary, action: Dictionary) -> Variant:
	var type := String(action.get("type",""))
	if type == "RETURN_ITEM":
		var item = Model.find_inventory(previous,action.get("uid",""))
		if item != null and item.has("eventClaimId"): return reduce(previous,{"type":"STATION_OWNERSHIP_CLAIM","id":item.eventClaimId})
		return null
	if WORK_ACTIONS.has(type):
		var item = Model.find_inventory(previous,action.get("uid",""))
		if item == null or not item.has("eventClaimId"): return null
		return Model.notice(previous.duplicate(true),work_problem(previous,item))
	if not ACTIONS.has(type): return null
	var s := previous.duplicate(true)
	ensure(s)
	var c = _find(s,String(action.get("id","")))
	if c == null: return previous
	if type == "DECLINE_OWNERSHIP_CLAIM":
		if c.uid != "" or not c.status in ["preview","available"]: return previous
		c.status = "declined"
		return Model.notice(s,"已婉拒代保管，失物没有进入本店。")
	if type == "ACCEPT_OWNERSHIP_CLAIM":
		if c.uid != "" or c.status in ["completed","declined","expired"]: return previous
		var problem := _accept_problem(s,c)
		if problem != "": return Model.notice(s,problem)
		var item := Model.new_item(s,c.model,{"owner":"customer","eventClaimId":c.id,"condition":float(c.condition),"source":"拾得者明确委托代保管失物 / 禁止销售","cost":0})
		item.watch.serial = c.serial
		if not Model.put_in(s,item): return Model.notice(previous.duplicate(true),"后仓空间不足，尚未接收失物。")
		Model.spend(s,1)
		c.uid = item.uid
		c.acceptedDay = int(s.day)
		c.dueDay = int(s.day)+4
		c.status = "investigating"
		return Model.notice(s,"已登记代保管原物；请检查实物后核对两份认领记录。")
	if c.returned or c.status == "completed" or c.uid == "": return previous
	var station := type == "STATION_OWNERSHIP_CLAIM"
	var problem := _handoff_problem(s,c,String(action.get("claimantId","")),station)
	if problem != "": return Model.notice(s,problem)
	var item = _original(s,c)
	if not station:
		if not Model.ledger(s,"ownership-"+c.id,"service","失物寻主服务酬谢",35): return previous
		s.ledger.back().merge({"uid":item.uid,"npcId":String(action.claimantId),"defId":item.defId,"eventClaimId":c.id})
	Model._remove_item(s,item.uid)
	c.returned = true
	c.station = station
	c.completedDay = int(s.day)
	if c.status != "expired": c.status = "completed"
	return Model.notice(s,"原物已安全移交失物站，没有收取酬谢。" if station else "已凭实物证据交还匹配物主，收到 35Cr 寻主酬谢。")
