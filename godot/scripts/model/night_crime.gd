class_name NightCrime
extends RefCounted
## Persistent physical cases. Random decisions use independent, purpose-specific
## campaign hashes and are saved before presentation or financial consequences.
const Wanted = preload("res://scripts/model/wanted_cases.gd")
const DISCLAIMER := "来源资料受理不等于确认原物合法；确认为赃物不予赔付，保费不退。新增货与维修增值须更新保障。"

static func ensure(s: Dictionary) -> void:
	if not s.has("nightCrime") or not s.nightCrime is Dictionary:
		s.nightCrime = {"version":1,"policies":{},"nights":{},"cases":[],"mornings":[],"days":{},
			"cooperation":{"count":0,"cases":[],"targets":[]},"lastInspection":{},"reportOpen":false}
		for target in s.get("police",{}).get("caught",[]):
			credit(s,"",String(target))
	var defaults := {"version":1,"policies":{},"nights":{},"cases":[],"mornings":[],"days":{},
		"cooperation":{"count":0,"cases":[],"targets":[]},"lastInspection":{},"reportOpen":false}
	for key in defaults:
		if not s.nightCrime.has(key): s.nightCrime[key] = defaults[key]

static func credit(s: Dictionary, case_id: String, target := "") -> void:
	var c: Dictionary = s.nightCrime.cooperation
	var duplicate: bool = (case_id != "" and c.cases.has(case_id)) or (target != "" and c.targets.has(target))
	if case_id != "" and not c.cases.has(case_id): c.cases.append(case_id)
	if target != "" and not c.targets.has(target): c.targets.append(target)
	if not duplicate and (case_id != "" or target != ""): c.count += 1

static func theft_draw(seed: String, day: int) -> bool:
	return day >= 3 and day <= 20 and Model.fnv("%s/night/theft/%d" % [seed,day]) % 10000 < 300

static func inspection_chance(risk: float) -> int:
	return 8 if risk < 30 else 15 if risk < 60 else 25

static func leniency_chance(count: int) -> int:
	return 0 if count < 2 else 30 if count < 4 else 60 if count < 6 else 80

static func unfinished_work(item: Dictionary) -> bool:
	for group in [item.get("service",{}),item.get("refurbishment",{})]:
		if group.get("opened",false) or group.get("active_case",false): return true
		for job in group.get("operations",{}):
			var operation = group.operations[job]
			if operation is Dictionary and not operation.get("complete",false): return true
	return false

static func stealable(s: Dictionary, item: Dictionary) -> bool:
	return not unfinished_work(item) and item.owner == "shop" and not item.has("orderId") and not item.sealed and item.location in ["warehouse","display"] and not Model.trade_reserved(s,item) and not item.get("service",{}).get("opened",false) and GameData.def(item.defId).category == "watch"

static func insurable(s: Dictionary, item: Dictionary) -> bool:
	# Do not consult stolen, culprit, or unrevealed case metadata here.
	return stealable(s,item) and item.sourceVerified and not item.get("crimeRevealed",false)

static func insurance_quote(s: Dictionary) -> Dictionary:
	ensure(s)
	var policy: Dictionary = s.nightCrime.policies.get(str(int(s.day)),{})
	var entries := []
	var total := 0.0
	var highest := 0.0
	for item in s.inventory:
		if not insurable(s,item): continue
		var value := Model.item_value(item)
		var confirmed: float = policy.get("values",{}).get(item.uid,0)
		entries.append({"uid":item.uid,"defId":item.defId,"name":GameData.def(item.defId).name,"value":value,"confirmedValue":confirmed,"covered":confirmed > 0})
		total += value
		highest = maxf(highest,value)
	var premium := maxi(5,ceili(total*.005+highest*.03)) if not entries.is_empty() else 0
	var paid: float = policy.get("paid",0)
	return {"day":int(s.day),"items":entries,"total":total,"maxValue":highest,"premium":premium,"paid":paid,"due":maxf(0,premium-paid),"purchased":not policy.is_empty(),"disclaimer":DISCLAIMER}

static func insurance_problem(s: Dictionary) -> String:
	if s.phase != "open": return "打烊后不能补买或更新保险。"
	if int(s.day) < 3 or int(s.day) > 20: return "第3至20天营业期间可投保今晚失窃。"
	var q := insurance_quote(s)
	if q.items.is_empty(): return "没有来源已核验、可承保的店铺自有手表。"
	if s.cash < q.due: return "现金不足，今晚保障尚未变动。"
	return ""

static func thieves(s: Dictionary) -> Array:
	var result := []
	var caught: Array = s.get("police",{}).get("caught",[])
	for p in Wanted.profiles():
		if p.npcId != "" and not caught.has(p.id): result.append(p.id)
	return result

static func settle(s: Dictionary) -> void:
	ensure(s)
	var day := int(s.day)
	var key := str(day)
	if day < 3 or day > 20 or s.nightCrime.nights.has(key): return
	var candidates := []
	for item in s.inventory:
		if stealable(s,item): candidates.append(item.duplicate(true))
	var n := {"day":day,"settled":true,"applied":false,"losses":[],"policy":s.nightCrime.policies.get(key,{}).duplicate(true),"inventory":candidates.duplicate(true)}
	s.nightCrime.nights[key] = n
	var active := thieves(s)
	if not theft_draw(s.seed,day) or candidates.is_empty() or active.is_empty(): return
	var culprit: String = active[Model.fnv("%s/night/culprit/%d" % [s.seed,day]) % active.size()]
	var count := 2 if candidates.size() >= 2 and Model.fnv("%s/night/count/%d" % [s.seed,day]) % 100 < 10 else 1
	for index in count:
		var pos := Model.fnv("%s/night/item/%d/%d" % [s.seed,day,index]) % candidates.size()
		n.losses.append(candidates.pop_at(pos))
	n.culprit = culprit

static func morning(s: Dictionary, previous_day: int) -> void:
	ensure(s)
	var n: Dictionary = s.nightCrime.nights.get(str(previous_day),{})
	if n.is_empty() or n.applied: return
	n.applied = true
	var receipt := {"day":int(s.day),"night":previous_day,"losses":[],"payout":0.0,"acknowledged":n.losses.is_empty()}
	var case_id := "NIGHT-%d" % previous_day
	var case_record := {"id":case_id,"origin":"shop","lossDay":previous_day,"culprit":n.get("culprit",""),"revealed":false,"arrested":false,"items":[]}
	for snapshot in n.losses:
		var item = Model.find_inventory(s,snapshot.uid)
		if item == null: continue
		var value := Model.item_value(snapshot)
		var confirmed: float = n.policy.get("values",{}).get(item.uid,0)
		var illegal: bool = bool(snapshot.get("stolen",false))
		var payout := minf(value,confirmed) if not illegal else 0.0
		var row := {"uid":item.uid,"defId":item.defId,"name":GameData.def(item.defId).name,"condition":item.condition,"location":item.location,"value":value,"confirmedValue":confirmed,"covered":confirmed>0,"payout":payout,"caseId":case_id,"claimReason":"理赔核查确认原物涉失窃案，拒赔；保费不退。" if illegal and confirmed>0 else ""}
		if payout > 0:
			Model.ledger(s,"insurance-claim-%d-%s" % [previous_day,item.uid],"insurance-payout","夜间失窃保险赔款 · "+item.uid,payout)
		var prior_case := _case(s,String(snapshot.get("crimeCaseId","")))
		var prior := _row(prior_case,item.uid)
		var insurer_right: bool = payout>0 or bool(prior.get("paid",false))
		var original_lawful: bool = not illegal if prior.is_empty() else bool(prior.get("originalLawful",false))
		if not prior.is_empty():
			prior.holder = "case-transfer"
			prior.recovery = "原物转入后续失窃案 " + case_id
			snapshot.provenanceCaseId = snapshot.get("provenanceCaseId",prior_case.id)
		Model._remove_item(s,item.uid)
		snapshot.crimeCaseId = case_id
		snapshot.stolen = true
		snapshot.sourceVerified = false
		snapshot.source = "朋友托售，回执暂缺 / 请核对实物编号"
		case_record.items.append({"uid":item.uid,"item":snapshot,"holder":"case","paid":insurer_right,"originalLawful":original_lawful,"payout":payout,"handled":false,"resolved":false,"recovery":""})
		receipt.losses.append(row)
		receipt.payout += payout
	if not case_record.items.is_empty(): s.nightCrime.cases.append(case_record)
	s.nightCrime.mornings.append(receipt)
	if not receipt.losses.is_empty(): s.nightCrime.reportOpen = true

static func _merchant_slot(s: Dictionary) -> int:
	var day := int(s.day)
	if day == 1: return 4
	var cycle := int((day-2)/2)
	var draw := Model.fnv("%s/merchant/%d" % [s.seed,cycle])
	if day != 2+cycle*2+draw%2: return -1
	return 4+int((draw>>3)%2) if day <= 3 else int((draw>>3)%6)

static func ensure_day(s: Dictionary) -> void:
	ensure(s)
	Wanted.ensure(s)
	var key := str(int(s.day))
	if s.phase != "open" or s.nightCrime.days.has(key): return
	var day := int(s.day)
	var inspection: bool = day >= 3 and Model.fnv("%s/police/inspection/%d" % [s.seed,day])%100 < inspection_chance(s.risk)
	var merchant := _merchant_slot(s)
	var patrol := Wanted.officer_slot(s,merchant)
	var available := []
	for slot in 6:
		if slot == merchant or slot == patrol or (day <= 3 and slot < 4): continue
		available.append(slot)
	var inspector: int = patrol if patrol >= 0 else (int(available.pop_front()) if not available.is_empty() else 6)
	var d := {"inspection":inspection,"inspectionDone":false,"inspectionSlot":inspector,"inspectionStarted":false,"leniency":false,"fence":{},"fenceDone":false}
	s.nightCrime.days[key] = d
	if not inspection and inspector != patrol and inspector < 6: available.push_front(inspector)
	if available.is_empty() or day < 3: return
	var active := thieves(s)
	if active.is_empty(): return
	var options := []
	for c in s.nightCrime.cases:
		if c.arrested or not active.has(c.culprit) or day < int(c.lossDay)+2: continue
		for row in c.items:
			if row.holder == "case" and not row.resolved: options.append({"caseId":c.id,"uid":row.uid,"culprit":c.culprit})
	if not options.is_empty() and Model.fnv("%s/fence/return/%d" % [s.seed,day])%100 < 20:
		d.fence = options[Model.fnv("%s/fence/object/%d" % [s.seed,day])%options.size()]
	elif Model.fnv("%s/fence/external/%d" % [s.seed,day])%100 < 10:
		d.fence = {"caseId":"EXTERNAL-%d" % day,"uid":"","culprit":active[Model.fnv("%s/fence/culprit/%d" % [s.seed,day])%active.size()]}
	if not d.fence.is_empty(): d.fence.slot = available[Model.fnv("%s/fence/slot/%d" % [s.seed,day])%available.size()]

static func inspection_pending(s: Dictionary) -> bool:
	ensure_day(s)
	var d: Dictionary = s.nightCrime.days.get(str(int(s.day)),{})
	return s.phase == "open" and d.get("inspection",false) and not d.get("inspectionDone",false)

static func visitor_override(s: Dictionary) -> String:
	ensure_day(s)
	if s.phase != "open" or s.trade != null: return ""
	var d: Dictionary = s.nightCrime.days[str(int(s.day))]
	if d.inspection and not d.inspectionDone and int(s.cursor) >= int(d.inspectionSlot): return Wanted.OFFICER_ID
	if not d.fenceDone and not d.fence.is_empty() and int(s.cursor) == int(d.fence.slot) and thieves(s).has(d.fence.culprit):
		var c := _case(s,d.fence.caseId)
		var row := _row(c,d.fence.uid)
		if c.is_empty() or (not row.is_empty() and row.holder == "case" and not row.resolved): return Wanted.profile(d.fence.culprit).npcId
	return ""

static func can_arrive(s: Dictionary) -> bool:
	return s.phase == "open" and s.trade == null and (int(s.cursor)<6 or inspection_pending(s))

static func _case(s: Dictionary, id: String) -> Dictionary:
	for c in s.nightCrime.cases:
		if c.id == id: return c
	return {}

static func _row(c: Dictionary, uid: String) -> Dictionary:
	for row in c.get("items",[]):
		if row.uid == uid: return row
	return {}

static func _start_inspection(s: Dictionary, bonus: bool) -> Dictionary:
	var d: Dictionary = s.nightCrime.days[str(int(s.day))]
	if not d.inspectionStarted:
		d.inspectionStarted = true
		d.leniency = Model.fnv("%s/police/leniency/%d" % [s.seed,int(s.day)])%100 < leniency_chance(int(s.nightCrime.cooperation.count))
	s.trade = Wanted.new_officer_trade(s)
	s.trade.inspectionVisit = true
	s.trade.bonusVisit = bonus
	s.trade.line = "例行查货，核对当前商品来源与尚未处置的经手案件；核对不消耗AP。"
	return Model.notice(s,"巡警到店查货，请完成核对后再打烊。")

static func _finish(s: Dictionary, text: String) -> Dictionary:
	if s.trade != null and s.trade.get("bonusVisit",false):
		s.trade = null
		return Model.notice(s,text)
	return Model.finish_trade(s,text)

static func _recover(s: Dictionary, c: Dictionary, row: Dictionary) -> void:
	if row.resolved: return
	var live = Model.find_inventory(s,row.uid)
	if live != null: row.item = live.duplicate(true)
	elif s.trade != null and s.trade.get("item") is Dictionary and s.trade.item.uid == row.uid:
		row.item = s.trade.item.duplicate(true)
	Model._remove_item(s,row.uid)
	if c.origin == "shop" and not row.paid and row.get("originalLawful",true):
		var item: Dictionary = row.item.duplicate(true)
		item.erase("stolen")
		item.erase("crimeCaseId")
		item.erase("grayAuthorized")
		item.sourceVerified = true
		item.source = "警方核实归还本店失物 / "+c.id
		item.sealed = false
		if not Model.put_in(s,item):
			# Recovery never disappears because the warehouse was rearranged.
			item.location = "recovery"
			s.inventory.append(item)
		row.holder = "inventory"
		row.recovery = "已归还本店原物"
	else:
		row.holder = "insurer" if row.paid else "police"
		row.recovery = "已移交保险方" if row.paid else "已移交警方归还原主"
	row.resolved = true

static func arrest(s: Dictionary, target: String) -> void:
	ensure(s)
	var associated := false
	for c in s.nightCrime.cases:
		if c.culprit != target or c.arrested: continue
		associated = true
		credit(s,c.id,target)
		c.revealed = true
		c.arrested = true
		for row in c.items:
			if row.holder in ["case","trade","inventory"]: _recover(s,c,row)
	if not associated: credit(s,"",target)

static func _inspect(s: Dictionary) -> Dictionary:
	var d: Dictionary = s.nightCrime.days[str(int(s.day))]
	var confiscated := []
	var implicated := []
	var total := 0.0
	var uncertain := []
	for item in s.inventory.duplicate():
		if item.owner != "shop" or item.has("orderId"): continue
		if not item.get("stolen",false):
			if not item.sourceVerified:
				uncertain.append(item.uid)
				if not d.leniency:
					item.sealed = true
					item.location = "isolation"
			continue
		var c := _case(s,String(item.get("crimeCaseId","")))
		var row := _row(c,item.uid)
		var voluntary: bool = item.location == "isolation" and item.sealed
		if not voluntary:
			total += Model.item_value(item)
			implicated.append(item.uid)
		confiscated.append(item.uid)
		if not row.is_empty(): row.item = item.duplicate(true)
		Model._remove_item(s,item.uid)
		if not c.is_empty():
			c.revealed = true
			if not row.is_empty(): _recover(s,c,row)
	for c in s.nightCrime.cases:
		for row in c.items:
			if row.get("handled",false) and not row.get("liabilityResolved",false):
				if not implicated.has(row.uid):
					total += Model.item_value(row.item)
					implicated.append(row.uid)
				row.liabilityResolved = true
				c.revealed = true
	var due := maxi(30,ceili(total*.2)) if not implicated.is_empty() else 0
	var paid := mini(int(s.cash),due) if not d.leniency else 0
	if due > 0 and not d.leniency:
		Model.ledger(s,"police-fine-%d" % int(s.day),"fine","查货合并处罚",-paid)
		s.risk = Model.clampn(s.risk+10)
		s.relations.station = Model.clampn(s.relations.station-5)
	var text := "查货完成。追回原物%d件；应罚%d Cr，实缴%d Cr。%s" % [confiscated.size(),due,paid,"你帮过我们不少，这次给你个方便：免罚、免风险与关系扣减；确切赃物仍须归还。" if d.leniency else "来源待核物请补证或隔离。"]
	s.nightCrime.lastInspection = {"day":int(s.day),"confiscated":confiscated,"implicated":implicated,"uncertain":uncertain,"fineDue":due,"finePaid":paid,"waived":d.leniency,"leniency":d.leniency,"cooperation":s.nightCrime.cooperation.count,"text":text}
	d.inspectionDone = true
	if Model.inspection_ready(s): s.inspection = "cleared"
	return _finish(s,text)

static func lost_item_problem(s: Dictionary) -> String:
	if s.phase != "open" or s.trade == null or not s.trade.get("crimeCaseId","").begins_with("NIGHT-"): return "柜台没有可核对的本店失物。"
	var c := _case(s,s.trade.crimeCaseId)
	if c.is_empty() or c.arrested: return "该案已经处置。"
	if not s.trade.item.evidence.has("TOL-002"): return "先用编号检测取得这件原物的编号证据，再与案件记录核对。"
	return ""

static func public_report(s: Dictionary) -> Dictionary:
	ensure(s)
	var cases := []
	for c in s.nightCrime.cases:
		if c.origin != "shop" and not c.revealed: continue
		var items := []
		for row in c.items:
			items.append({"uid":row.uid,"defId":row.item.defId,"name":GameData.def(row.item.defId).name,"paid":row.paid,"payout":row.payout,"recovery":row.recovery,"resolved":row.resolved})
		var entry := {"id":c.id,"lossDay":c.lossDay,"origin":c.origin,"revealed":c.revealed,"arrested":c.arrested,"items":items}
		if c.revealed: entry.suspect = Wanted.profile(c.culprit).get("name","")
		cases.append(entry)
	var latest: Dictionary = s.nightCrime.mornings.back().duplicate(true) if not s.nightCrime.mornings.is_empty() else {"day":int(s.day),"losses":[],"payout":0,"acknowledged":true}
	var d: Dictionary = s.nightCrime.days.get(str(int(s.day)),{})
	return {"cases":cases,"mornings":s.nightCrime.mornings.duplicate(true),"morning":latest,"unread":not latest.acknowledged,"reportOpen":s.nightCrime.reportOpen,"policy":insurance_quote(s),"cooperation":int(s.nightCrime.cooperation.count),"leniencyChance":leniency_chance(int(s.nightCrime.cooperation.count)),"inspection":{"pending":d.get("inspection",false) and not d.get("inspectionDone",false),"active":s.trade != null and s.trade.get("inspectionVisit",false)},"lastInspection":s.nightCrime.lastInspection.duplicate(true)}

static func reduce(previous: Dictionary, action: Dictionary) -> Variant:
	var type := String(action.get("type",""))
	var s := previous.duplicate(true)
	ensure(s)
	ensure_day(s)
	if type in ["ACK_NIGHT_REPORT","OPEN_NIGHT_REPORT"]:
		s.nightCrime.reportOpen = type == "OPEN_NIGHT_REPORT"
		if type == "ACK_NIGHT_REPORT":
			for m in s.nightCrime.mornings:
				if not action.has("day") or int(action.day) == int(m.day): m.acknowledged = true
		return s
	if type in ["BUY_INSURANCE","UPDATE_INSURANCE"]:
		var problem := insurance_problem(s)
		if problem != "": return Model.notice(s,problem)
		var key := str(int(s.day))
		if type == "BUY_INSURANCE" and s.nightCrime.policies.has(key): return previous
		if type == "UPDATE_INSURANCE" and not s.nightCrime.policies.has(key): return Model.notice(s,"请先购买今晚保险。")
		var q := insurance_quote(s)
		var p: Dictionary = s.nightCrime.policies.get(key,{"day":int(s.day),"paid":0,"values":{},"revision":0})
		p.revision += 1
		if q.due > 0: Model.ledger(s,"insurance-premium-%s-%d" % [key,int(p.revision)],"insurance-premium","今晚失窃保险保费",-q.due)
		p.paid += q.due
		for item in q.items: p.values[item.uid] = maxf(float(p.values.get(item.uid,0)),float(item.value))
		s.nightCrime.policies[key] = p
		return Model.notice(s,"今晚保障已确认，新增货与维修增值需更新保障；明天不自动续保。")
	if s.phase != "open":
		return null
	var d: Dictionary = s.nightCrime.days[str(int(s.day))]
	if type == "SETTLE" and inspection_pending(s): return Model.notice(s,"打烊前须接待待到场的查货；0 AP也可呼叫巡警完成核对。")
	if s.trade != null and s.trade.get("inspectionVisit",false):
		if type == "RESOLVE_INSPECTION" and action.get("tradeId","") == s.trade.id: return _inspect(s)
		if type == "REFUSE": return Model.notice(s,"请先完成本次查货核对。")
	if type in ["ARRIVE","ARRIVE_INSPECTION"] and s.trade == null and inspection_pending(s):
		if type == "ARRIVE_INSPECTION" or int(s.cursor) >= int(d.inspectionSlot):
			return _start_inspection(s,type == "ARRIVE_INSPECTION" or int(s.cursor) >= 6 or int(s.cursor) != int(d.inspectionSlot))
	if type == "ARRIVE_INSPECTION": return previous
	if type == "ARRIVE" and s.trade == null and not d.fenceDone and not d.fence.is_empty() and int(s.cursor) == int(d.fence.slot):
		var active := thieves(s)
		if not active.has(d.fence.culprit): return null
		var c := _case(s,d.fence.caseId)
		if c.is_empty():
			var item := Model.new_item(s,"WCH-002",{"sourceVerified":false,"source":"朋友托售，回执暂缺","stolen":true,"crimeCaseId":d.fence.caseId,"cost":0})
			c = {"id":d.fence.caseId,"origin":"external","lossDay":int(s.day)-2,"culprit":d.fence.culprit,"revealed":false,"arrested":false,"items":[{"uid":item.uid,"item":item,"holder":"case","paid":false,"payout":0,"handled":false,"resolved":false,"recovery":""}]}
			s.nightCrime.cases.append(c)
			d.fence.uid = item.uid
		var row := _row(c,d.fence.uid)
		if row.is_empty() or row.holder != "case" or row.resolved: return null
		row.holder = "trade"
		d.fenceDone = true
		var item: Dictionary = row.item.duplicate(true)
		s.trade = {"id":Model.next_id(s,"fence"),"npcId":Wanted.profile(c.culprit).npcId,"kind":"buy","item":item,"price":maxf(1,floor(Model.item_value(item)*.55)),"rounds":0,"locked":false,"evidenceUsed":[],"crimeCaseId":c.id,"line":"朋友托我带来的，回执暂时找不到。你先看看实物，价格可以商量。"}
		s.trade.price = maxf(s.trade.price,Model.trade_terms(s,s.trade,item).floor)
		return Model.notice(s,"客人带来一只旧表，请核对来源与实物编号。")
	if type == "REPORT_LOST_ITEM":
		if s.trade == null or action.get("tradeId","") != s.trade.id: return previous
		var problem := lost_item_problem(s)
		if problem != "": return Model.notice(s,problem)
		var c := _case(s,s.trade.crimeCaseId)
		var row := _row(c,s.trade.item.uid)
		row.item = s.trade.item.duplicate(true)
		Wanted.ensure(s)
		if not s.police.caught.has(c.culprit): s.police.caught.append(c.culprit)
		if s.police.wanted.has(c.culprit):
			s.police.issued = false
			s.police.wanted = []
			s.police.paper.visible = false
			s.documents = s.documents.filter(func(doc): return doc.get("uid","") != Wanted.DOCUMENT_ID)
		arrest(s,c.culprit)
		return _finish(s,"警方核对原编号与失窃记录一致，已抓获作案者；"+row.recovery+"。有效协警已登记。")
	if type == "GRAY_TRADE":
		if not action.get("confirmed",false) or s.trade == null or action.get("tradeId","") != s.trade.id or s.trade.locked: return previous
		var item = s.trade.item if s.trade.kind == "buy" else Model.find_inventory(s,action.get("uid",""))
		if item == null or item.owner != "shop" or item.has("orderId") or item.sealed or item.location == "isolation" or item.get("crimeRevealed",false): return Model.notice(s,"顾客、抵押、封存与明确立案物不能灰色收售。")
		item.grayAuthorized = s.trade.id
		item.graySale = true
		return Model.notice(s,"已确认来源未核风险：本次完成灰色收售将增加8风险；登记不改变真实归属，确切赃物仍可能追回。")
	if type in ["SELECT_TRADE","OFFER","ACCEPT","DELIVER"] and s.trade != null and s.trade.kind == "sell":
		var uid: String = action.get("uid",s.trade.get("selectedUid",""))
		var item = Model.find_inventory(s,uid)
		if item != null and not item.sourceVerified and item.get("grayAuthorized","") != s.trade.id:
			return Model.notice(s,"来源未核货须先确认本次灰色收售风险；仍保留真实来源与案件记录。")
	if type == "PAWN" and s.trade != null and s.trade.get("crimeCaseId","") != "":
		return Model.notice(s,"案件来源尚未核对，不能转为抵押保管；可拒收、核对报警或确认灰色收购风险。")
	if type in ["ACCEPT","DELIVER","PAWN"] and s.trade != null and s.trade.kind == "buy" and s.trade.item != null and int(s.day)>=3 and not s.trade.item.sourceVerified and s.trade.item.get("grayAuthorized","") != s.trade.id:
		return Model.notice(s,"来源尚未核实，须先明确确认灰色收售风险，或拒收。")
	if type == "REGISTER":
		var item = Model.find_inventory(s,action.get("uid",""))
		if item != null and item.get("stolen",false): return Model.notice(s,"来源记录存在案件冲突，登记不能改变原物归属，请主动移交警方。")
	if type == "REPORT_STOLEN":
		var item = Model.find_inventory(s,action.get("uid",""))
		if item == null or not item.get("stolen",false) or Model.trade_reserved(s,item): return previous
		var c := _case(s,item.get("crimeCaseId",""))
		Model._remove_item(s,item.uid)
		if not c.is_empty():
			c.revealed = true
			var row := _row(c,item.uid)
			if not row.is_empty():
				row.item = item.duplicate(true)
				row.liabilityResolved = true
				_recover(s,c,row)
			credit(s,c.id)
		s.risk = Model.clampn(s.risk-6)
		s.relations.station = Model.clampn(s.relations.station+3)
		return Model.notice(s,"原物已移交警方，案件登记完成；同一案件不重复增加协警次数。")
	return null

static func after_action(previous: Dictionary, s: Dictionary, action: Dictionary) -> void:
	ensure(s)
	# Every removal path must move the canonical holder, including terminal returns
	# that have no active counter trade. Historical records never resurrect it.
	for c in s.nightCrime.cases:
		for row in c.items:
			if row.holder != "inventory" or row.resolved: continue
			var before = Model.find_inventory(previous,row.uid)
			if before == null or Model.find_inventory(s,row.uid) != null: continue
			row.item = before.duplicate(true)
			if action.get("type","") == "RETURN_ITEM":
				row.holder = "insurer" if row.paid else "police"
				row.resolved = true
				row.liabilityResolved = true
				row.recovery = "已主动移交保险方" if row.paid else "已主动归还原主"
				c.revealed = true
				credit(s,c.id)
			else:
				row.holder = "buyer" if action.get("type","") in ["DELIVER","SELL_MERCHANT_ITEM","EMERGENCY_SALE","DELIVER_ORDER"] else "disposed"
				row.handled = true

	if previous.trade == null: return
	var trade: Dictionary = previous.trade
	var item = Model.trade_item(previous,trade)
	if item == null: return
	var c := _case(s,String(trade.get("crimeCaseId",item.get("crimeCaseId",""))))
	var row := _row(c,item.uid)
	var delivered: bool = action.get("type","") == "DELIVER" and s.completedTrades.has(trade.id) and not previous.completedTrades.has(trade.id)
	if delivered:
		if item.get("grayAuthorized","") == trade.id and not item.sourceVerified:
			s.risk = Model.clampn(previous.risk+8)
		if not row.is_empty():
			row.holder = "inventory" if trade.kind == "buy" else "buyer"
			row.handled = true
			row.item = item.duplicate(true)
	elif s.trade == null and not row.is_empty() and row.holder == "trade":
		row.item = item.duplicate(true)
		row.holder = "case"
