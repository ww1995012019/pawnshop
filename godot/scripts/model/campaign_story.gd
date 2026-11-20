class_name CampaignStory
extends RefCounted
## Authored encounters use public records and never own or settle physical goods.
const DATA_PATH := "res://data/campaign_90.json"
const ROUTINE_EVENTS := ["EVT-002", "EVT-004", "EVT-009", "EVT-010", "EVT-015", "EVT-019"]
const SERIAL_TOOL := "TOL-002"
static var _beats: Array = []

static func enabled(s: Dictionary) -> bool:
	return s.get("campaignLife", {}).get("mode", "") == "story90"

static func ensure(s: Dictionary) -> void:
	if not enabled(s):
		return
	if not s.get("campaignStory") is Dictionary:
		s.campaignStory = {}
	var book: Dictionary = s.campaignStory
	book.merge({"version":1, "startDay":int(s.day), "opening":{}, "readings":[],
		"decisions":{}, "activity":{"repairedUids":{}, "inspectedPublicModels":{}}, "final":{}}, false)

static func _schedule() -> Array:
	if _beats.is_empty():
		var data = JSON.parse_string(FileAccess.get_file_as_string(DATA_PATH))
		if data is Dictionary and data.get("beats") is Array:
			_beats = data.beats
	return _beats

static func _date_contains(beat: Dictionary, day: int) -> bool:
	return day >= int(beat.firstDay) and day <= int(beat.lastDay)

static func optional_station_day(s: Dictionary) -> bool:
	var day := int(s.day)
	if day < 4 or day > 90 or day % 7 not in [2, 5]:
		return false
	for beat in _schedule():
		if _date_contains(beat, day):
			return false
	return true

static func station_event(s: Dictionary):
	var day := int(s.day)
	if Model.FIXED_EVENT_DAYS.has(day):
		var event = Model.event_for_day(s.seed, day)
		if day == 20 and event is Dictionary:
			event = event.duplicate(true)
			var helped: bool = s.events.any(func(row):
				return row.eventId == "EVT-001" and row.choiceId in ["EVT-001-repair", "EVT-001-donate"])
			var opening := "你帮过诊疗舱的那盏灯，季棠还记着。" if helped else "季棠望着廊桥的灯，想起以前的夜班。"
			event.description += "\n" + opening + "她想补一页夜班交接簿，灯会散了再来问你。"
		return event
	if not optional_station_day(s):
		return null
	if day <= 21:
		return Model.event_for_day(s.seed, day)
	var event_id: String = ROUTINE_EVENTS[Model.fnv("%s/story90/station/%d" % [s.seed, day]) % ROUTINE_EVENTS.size()]
	for event in GameData.events:
		if event.id == event_id:
			return event
	return null

static func _book(s: Dictionary) -> Dictionary:
	return s.get("campaignStory", {})

static func _opening(s: Dictionary) -> Dictionary:
	return _book(s).get("opening", {})

static func _decision(s: Dictionary, beat_id: String) -> Dictionary:
	return _book(s).get("decisions", {}).get(beat_id, {})

static func _receipts(s: Dictionary) -> Array:
	return s.get("shopJournal", {}).get("receipts", [])

static func _receipt(s: Dictionary, uid: String, directions: Array) -> Dictionary:
	if uid.is_empty():
		return {}
	var receipts := _receipts(s)
	for index in range(receipts.size() - 1, -1, -1):
		var receipt: Dictionary = receipts[index]
		if receipt.get("historical", false):
			continue
		for entry in receipt.get("entries", []):
			if entry.uid == uid and entry.direction in directions:
				return {"id":receipt.id, "day":int(receipt.day), "direction":entry.direction,
					"name":entry.name, "price":entry.price}
	return {}

static func _service_receipt(s: Dictionary, npc_id: String) -> Dictionary:
	var receipts := _receipts(s)
	for index in range(receipts.size() - 1, -1, -1):
		var receipt: Dictionary = receipts[index]
		if receipt.get("npcId", "") != npc_id or receipt.get("historical", false):
			continue
		for entry in receipt.get("entries", []):
			# Pawn fees share the journal's service classification.
			if entry.direction == "service" and entry.uid != "":
				for row in s.get("ledger", []):
					if row.id == entry.ledgerId and row.kind in ["service", "service-job"] and row.amount > 0:
						return {"id":receipt.id, "uid":entry.uid, "day":int(receipt.day), "name":entry.name}
	return {}

static func _available_original(s: Dictionary):
	var uid: String = _opening(s).get("uid", "")
	if uid.is_empty():
		return null
	var original = Model.find_inventory(s, uid)
	return original if original != null and _can_retrieve(s, original) else null

static func _can_retrieve(s: Dictionary, original: Dictionary) -> bool:
	return original.owner == "shop" and original.location in ["display", "warehouse"] \
		and original.sourceVerified and not original.sealed and not original.get("stolen", false) \
		and not original.has("orderId") and not original.get("service", {}).get("opened", false) \
		and not Model.trade_reserved(s, original)

static func _appraisal_original(s: Dictionary):
	var original = _available_original(s)
	if original != null: return original
	for item in s.get("inventory", []):
		if _can_retrieve(s, item): return item
	return null

static func _custody(s: Dictionary) -> String:
	var opening := _opening(s)
	if opening.is_empty():
		return "legacy" if int(_book(s).get("startDay", 1)) > 1 else "unseen"
	if _available_original(s) != null:
		return "held"
	var uid: String = opening.uid
	var receipt := _receipt(s, uid, ["acquisition", "sale", "return"])
	if Model.find_inventory(s, uid) == null and receipt.get("direction", "") in ["sale", "return"]:
		return "transferred"
	return "declined" if String(opening.get("receiptId", "")).is_empty() else "unavailable"

static func _recorded_reading(s: Dictionary, tool := "") -> Dictionary:
	var opening := _opening(s)
	if String(opening.get("receiptId", "")).is_empty():
		return {}
	var readings: Array = _book(s).get("readings", [])
	var original = Model.find_inventory(s, opening.uid)
	for index in range(readings.size() - 1, -1, -1):
		var reading: Dictionary = readings[index]
		if reading.uid != opening.uid or (tool != "" and reading.tool != tool):
			continue
		if original != null:
			# Some legacy helpers initialize data. A view may only inspect a copy.
			var physical: Dictionary = original.duplicate(true)
			if not Model.inspection_current(physical, reading.tool) or Model.inspection_revision(physical, reading.tool) != reading.revision:
				continue
		return reading
	return {}

static func _comparison(s: Dictionary) -> Dictionary:
	var serial: String = _opening(s).get("registrySerial", "")
	var reading := _recorded_reading(s, SERIAL_TOOL)
	if serial.strip_edges().is_empty() or String(reading.get("value", "")).strip_edges().is_empty():
		return {"status":"unknown", "reading":{}}
	var matched: bool = String(reading.value).strip_edges().to_upper() == serial.strip_edges().to_upper()
	var held := Model.find_inventory(s, _opening(s).uid) != null
	return {"status":("matched_current" if held else "matched_historical") if matched else "mismatch", "reading":reading}

static func _public_problem(s: Dictionary) -> String:
	var compared := _decision(s, "CW-38")
	if compared.get("evidenceStatus", "") not in ["matched_current", "matched_historical"]:
		return "需要先在班表上记录核对吻合的编号。"
	var checked: Dictionary = compared.get("refs", {}).get("reading", {})
	if not _book(s).get("readings", []).has(checked):
		return "找不到对应的历史读数，先留档。"
	return "后来记录的编号有出入，先留档或交站务复核。" if not _later_serial_conflict(s, checked).is_empty() else ""

static func _later_serial_conflict(s: Dictionary, checked: Dictionary) -> Dictionary:
	var readings: Array = _book(s).get("readings", [])
	var index := readings.find(checked)
	if index < 0:
		return {}
	var serial := String(checked.value).strip_edges().to_upper()
	for position in range(index + 1, readings.size()):
		var reading: Dictionary = readings[position]
		var value := String(reading.value).strip_edges().to_upper()
		if reading.uid == checked.uid and reading.tool == SERIAL_TOOL and value != "" and value != serial:
			return reading
	return {}

static func _receipt_text(receipt: Dictionary) -> String:
	return "第 %d 天 · %s · %s Cr" % [receipt.day, receipt.name, Model.jnum(receipt.price)]

static func _opening_detail(s: Dictionary) -> String:
	var custody := _custody(s)
	var receipt := _receipt(s, _opening(s).get("uid", ""), ["acquisition", "sale", "return"])
	if not receipt.is_empty():
		return ("原物转出凭据 · " if custody == "transferred" else "本店留存凭据 · ") + _receipt_text(receipt)
	if custody == "legacy":
		return "店里没有这笔旧档，先按栗叔提供的线索继续。"
	return "栗叔的转运底单 · 曾登记一只停走的北辰，未留本店交割凭据。"

static func _route(page: String, label: String, uid := "") -> Dictionary:
	return {"page":page, "label":label, "uid":uid}

static func priority_problem(s: Dictionary) -> String:
	var inspection: Dictionary = s.get("nightCrime", {}).get("days", {}).get(str(int(s.day)), {})
	if inspection.get("inspection", false) and not inspection.get("inspectionDone", false):
		return "先接待等候查货的巡警。"
	if Landlord.due_now(s):
		return "先和梁叔结清本期租金。"
	return ""

static func _choice_problem(s: Dictionary, beat_id: String, choice_id: String) -> String:
	if s.get("trade") != null:
		return "请先办完当前一笔柜台业务。"
	var priority := priority_problem(s)
	if priority != "":
		return priority
	match choice_id:
		"record_reading":
			if _recorded_reading(s).is_empty(): return "这只表尚无可用的实测记录。"
		"record_receipt":
			if _receipt(s, _opening(s).get("uid", ""), ["acquisition", "sale", "return"]).is_empty(): return "案卷未找到这件原物的交割凭据。"
		"compare":
			if _comparison(s).status == "unknown": return "需要班表和同一只原物的紫外编号。"
		"public":
			if beat_id == "CW-89": return _public_problem(s)
	return ""

static func _direction(s: Dictionary) -> String:
	var activity: Dictionary = _book(s).get("activity", {})
	var repairs: int = activity.get("repairedUids", {}).size()
	var inspections: int = activity.get("inspectedPublicModels", {}).size()
	if repairs == inspections:
		return "reconcile"
	return "repair" if repairs > inspections else "appraise"

static func _line_variant(s: Dictionary, beat: Dictionary) -> String:
	match String(beat.id):
		"CW-02", "CW-14", "CW-22", "CW-28":
			return _custody(s)
		"CW-49":
			return String(_decision(s, "CW-38").get("evidenceStatus", _custody(s)))
		"CW-74", "CW-89":
			return String(_decision(s, "CW-38").get("evidenceStatus", "unknown"))
		"CW-53":
			return _direction(s)
		"CW-66":
			return "serviced" if not _service_receipt(s, beat.npcId).is_empty() else "default"
	return "default"

static func _details(s: Dictionary, beat: Dictionary) -> String:
	match String(beat.id):
		"CW-02", "CW-22", "CW-49":
			return _opening_detail(s)
		"CW-14":
			var receipt := _receipt(s, _opening(s).get("uid", ""), ["acquisition"])
			return "旧港转运号 · YB-017\n本店交割号 · " + String(receipt.get("id", "未留凭据"))
		"CW-28":
			var reading := _recorded_reading(s)
			return "第 %d 天的实测记录 · %s" % [reading.day, reading.text] if not reading.is_empty() else _opening_detail(s)
		"CW-38":
			var reading: Dictionary = _comparison(s).reading
			var registry: String = _opening(s).get("registrySerial", "")
			return "班表登记 · %s\n实测 · %s" % [registry if registry != "" else "待核",
				"第 %d 天　%s" % [reading.day, reading.value] if not reading.is_empty() else "尚无可核对的编号"]
		"CW-66":
			var receipt := _service_receipt(s, beat.npcId)
			return "第 %d 天 · %s已交回原主" % [receipt.day, receipt.name] if not receipt.is_empty() else ""
		"CW-74", "CW-79", "CW-89":
			return _evidence_label(_decision(s, "CW-38").get("evidenceStatus", "unknown"))
		_:
			return ""

static func current(s: Dictionary) -> Dictionary:
	if not enabled(s) or s.get("phase", "") != "open":
		return {}
	var day := int(s.day)
	for beat in _schedule():
		var id: String = beat.id
		if not _date_contains(beat, day) or day < int(_book(s).get("startDay", 1)) or not _decision(s, id).is_empty():
			continue
		var actions: Array = []
		for option in beat.choices:
			var choice_id: String = option.id
			var action := {"id":choice_id, "label":option.label, "problem":_choice_problem(s, id, choice_id),
				"action":{"type":"CAMPAIGN_STORY_CHOOSE", "beatId":id, "choiceId":choice_id, "day":day}}
			if id == "CW-53":
				match choice_id:
					"repair": action.page = "orders"
					"appraise":
						var original = _appraisal_original(s)
						action.page = "inspect" if original != null else "warehouse"
						action.uid = original.uid if original != null else ""
					"reconcile": action.page = "history"
			actions.append(action)
		var navigation: Array = []
		if id in ["CW-22", "CW-28", "CW-38", "CW-49"]:
			var original = _available_original(s)
			if original != null:
				navigation.append(_route("inspect", "查验这只原表", original.uid))
			if not _receipt(s, _opening(s).get("uid", ""), ["acquisition", "sale", "return"]).is_empty():
				navigation.append(_route("history", "翻看交割回执", _opening(s).get("uid", "")))
		elif id == "CW-66":
			var service := _service_receipt(s, beat.npcId)
			if service.is_empty():
				navigation.append(_route("orders", "查看现有委修"))
			else:
				navigation.append(_route("history", "翻看履约回执", service.uid))
		return {"id":id, "title":beat.title, "npcId":beat.npcId, "firstDay":beat.firstDay,
			"lastDay":beat.lastDay, "line":beat.lines.get(_line_variant(s, beat), beat.lines["default"]),
			"detail":_details(s, beat), "actions":actions, "navigation":navigation}
	return {}

static func _evidence_label(status: String) -> String:
	return String({"matched_current":"编号已核对，吻合。",
		"matched_historical":"留存的历史读数与班表吻合，当前原物状态待核。",
		"mismatch":"实测和班表的编号有出入。",
		"unknown":"缺少可核对的编号，交接簿保留未知。"}.get(status, ""))

static func _archive_detail(decision: Dictionary) -> String:
	var refs: Dictionary = decision.get("refs", {})
	var parts: Array[String] = [String(decision.get("label", ""))]
	var known := _evidence_label(decision.get("evidenceStatus", ""))
	if known != "": parts.append(known)
	var reading: Dictionary = refs.get("reading", {})
	if not reading.is_empty(): parts.append("第 %d 天实测 · %s" % [reading.day, reading.text])
	if refs.has("registry"): parts.append("班表登记 · %s" % refs.registry)
	var receipt: Dictionary = refs.get("receipt", {})
	if not receipt.is_empty(): parts.append("留存回执 · " + _receipt_text(receipt))
	if refs.has("id"): parts.append("第 %d 天 · %s已交回原主" % [refs.day, refs.name])
	for key in ["testimony", "context"]:
		var line: String = refs.get(key, "")
		if line != "" and line != known: parts.append(line)
	return "\n".join(parts)

static func history(s: Dictionary) -> Array:
	if _book(s).is_empty():
		return []
	var day := int(s.day)
	var start_day := int(_book(s).get("startDay", 1))
	var entries: Array = []
	for beat in _schedule():
		var id: String = beat.id
		var first := int(beat.firstDay)
		var last := int(beat.lastDay)
		if first > day + 1:
			continue
		var decision := _decision(s, id)
		var status := "open"
		var detail := ""
		if last < start_day: status = "unrecorded"
		elif not decision.is_empty():
			status = "recorded"
			detail = _archive_detail(decision)
		elif day > last or (day == last and s.get("phase", "") != "open"): status = "missed"
		elif first > day: status = "upcoming"
		entries.append({"id":id, "title":beat.title, "day":int(decision.get("day", first)), "status":status, "detail":detail.strip_edges()})
	entries.reverse()
	return entries

static func reduce(previous: Dictionary, action: Dictionary) -> Variant:
	if action.get("type", "") != "CAMPAIGN_STORY_CHOOSE":
		return null
	if not (action.get("day") is int or action.get("day") is float) or action.day != previous.day:
		return previous
	var scene := current(previous)
	if scene.is_empty() or scene.id != action.get("beatId"):
		return previous
	for option in scene.actions:
		var option_id: String = option.id
		if option_id != action.get("choiceId") or not String(option.problem).is_empty():
			continue
		var next := previous.duplicate(true)
		ensure(next)
		var decision := {"choiceId":option_id, "day":int(next.day), "label":option.label,
			"evidenceStatus":"", "refs":{}}
		if scene.id == "CW-38":
			var comparison := _comparison(previous) if option_id == "compare" else {"status":"unknown", "reading":{}}
			decision.evidenceStatus = comparison.status
			decision.refs = {"reading":comparison.reading.duplicate(true)}
			if option_id == "compare":
				decision.refs.registry = _opening(previous).get("registrySerial", "")
		elif option_id == "record_reading":
			decision.refs.reading = _recorded_reading(previous).duplicate(true)
		elif option_id == "record_receipt":
			var receipt := _receipt(previous, _opening(previous).get("uid", ""), ["acquisition", "sale", "return"])
			decision.refs = {"receiptId":receipt.id, "receipt":receipt}
		elif scene.id == "CW-66" and option_id == "file_note":
			decision.refs = _service_receipt(previous, scene.npcId)
		elif option_id in ["note", "file_note"]:
			decision.refs.context = String(scene.detail)
			decision.refs.testimony = String(scene.line)
		next.campaignStory.decisions[scene.id] = decision
		return Model.notice(next, "已记入夜班案卷：" + String(option.label) + "。")
	return previous

static func _capture_opening(s: Dictionary) -> void:
	var trade = s.get("trade")
	var book := _book(s)
	if not trade is Dictionary or not trade.has("campaignOpeningUid") or not book.opening.is_empty():
		return
	var original = Model.find_item(s, trade.campaignOpeningUid)
	if original == null:
		return
	book.opening = {"uid":original.uid, "tradeId":trade.id, "receiptId":"",
		"registrySerial":String(original.watch.serial)}

static func _capture_reading(s: Dictionary, uid: String, tool: String) -> void:
	var device: String = {SERIAL_TOOL:"uv", "TOL-005":"scale"}.get(tool, "")
	if device != "" and StoreCosts.device_problem(s, device) != "":
		return
	var original = Model.find_item(s, uid)
	if original == null or not Model.inspection_current(original, tool):
		return
	var book := _book(s)
	var facts: Dictionary = original.inspectionFacts[tool]
	var day := int(s.day)
	if day >= 25 and day <= 52:
		var model: String = facts.get("appraisalObservation", {}).get("publicModel", "")
		if GameData.items.get(model, {}).get("tier", "") in ["luxury", "ultra"]:
			book.activity.inspectedPublicModels[model] = true
	if book.opening.get("uid", "") != uid:
		return
	var revision: String = facts.get("appraisalChannelRevision", "")
	for reading in book.readings:
		if reading.tool == tool and reading.revision == revision and int(reading.day) == day:
			return
	var reading_text: String = original.evidenceReadings[tool]
	book.readings.append({"uid":uid, "tool":tool, "revision":revision, "day":day,
		"value":facts.get("serial", reading_text) if tool == SERIAL_TOOL else reading_text, "text":reading_text})

static func original_summary(s: Dictionary) -> String:
	return {"held":"原物仍在店内，可调阅。", "transferred":"原物已转手，店里保留交割凭据。",
		"unavailable":"店里曾收下原物，眼下无法调阅。", "declined":"原物曾在柜台展示，没有入店。",
		"unseen":"线索来自栗叔的转运底单。", "legacy":"店里没有这笔前史。"}[_custody(s)]

static func _met_character(s: Dictionary, npc_id: String) -> bool:
	if int(s.get("shopJournal", {}).get("customers", {}).get(npc_id, {}).get("visits", 0)) > 0:
		return true
	for beat in _schedule():
		if beat.npcId == npc_id and not _decision(s, beat.id).is_empty():
			return true
	return false

static func _save_checkpoint_summary(s: Dictionary, checkpoint: Dictionary) -> void:
	var summary := {"custody":_custody(s), "openingUid":_opening(s).get("uid", ""),
		"purchaseReceiptId":_opening(s).get("receiptId", ""), "observation":_recorded_reading(s).duplicate(true),
		"decisions":_book(s).decisions.duplicate(true)}
	checkpoint.storySummary = summary
	s.report.storySummary = summary.duplicate(true)
	checkpoint.report.storySummary = summary.duplicate(true)
	if int(s.day) == 21 and not s.campaignLife.assessments.is_empty():
		var first: Dictionary = s.campaignLife.assessments[0]
		first.storySummary = summary.duplicate(true)
		first.report.storySummary = summary.duplicate(true)

static func _finalize(s: Dictionary) -> void:
	var book := _book(s)
	var choice: String = _decision(s, "CW-89").get("choiceId", "shop")
	var destination := choice
	var reason := ""
	if destination == "public":
		reason = _public_problem(s)
		if reason != "":
			destination = "shop"
	var compared := _decision(s, "CW-38")
	var status: String = compared.get("evidenceStatus", "unknown")
	var conflict := {}
	if status in ["matched_current", "matched_historical"]:
		conflict = _later_serial_conflict(s, compared.get("refs", {}).get("reading", {}))
		if not conflict.is_empty(): status = "mismatch"
	var npc_id: String = {"shop":"CHR-004", "station":"CHR-003", "public":"CHR-006"}[destination]
	var line: String = {
		"shop":"那段没拿准的，先给它留个空。等我想起来，还来跟你说。",
		"station":"这一份我签收。核对过的和待核的，分别留档。",
		"public":"那一晚确实有人值守，这一句就够了。"}[destination]
	if not _met_character(s, npc_id):
		npc_id = ""
		line = {"shop":"交接簿的副本留在店里，待核处留空。",
			"station":"站务签收了交接簿副本。", "public":"公开抄本保留已核的一行。"}[destination]
	var detail := _evidence_label(status)
	if destination == "public":
		var facts: Dictionary = compared.refs.reading
		var signature := " · 季棠" if _decision(s, "CW-79").get("choiceId") == "record_consent" else " · 夜班站医"
		detail = "公开抄本 · 第 %d 天的编号与班表吻合%s。" % [facts.day, signature]
	elif not conflict.is_empty():
		detail = "第 %d 天复测的编号有出入，早先的核对记录已留档。" % int(conflict.day)
	detail += "\n" + original_summary(s)
	book.final = {"destination":destination, "choiceId":choice, "detail":detail, "line":line,
		"npcId":npc_id, "day":int(s.day), "reason":reason, "evidenceStatus":status}
	s.report.storyFinal = book.final.duplicate(true)
	var checkpoint: Dictionary = s.campaignLife.get("checkpoints", {}).get("90", {})
	if not checkpoint.is_empty():
		checkpoint.storyFinal = book.final.duplicate(true)
		if checkpoint.get("report") is Dictionary:
			checkpoint.report.storyFinal = book.final.duplicate(true)

static func observe(previous: Dictionary, next: Dictionary, action: Dictionary) -> void:
	if not enabled(next):
		return
	ensure(next)
	var action_type: String = action.get("type", "")
	var uid: String = String(action.get("uid", ""))
	var book := _book(next)
	match action_type:
		"ARRIVE":
			_capture_opening(next)
		"CHECK":
			if previous.phase == "open":
				_capture_reading(next, uid, String(action.get("tool", "")))
		"ACCEPT", "DELIVER", "TRADE_CHECKOUT", "BUY_BULK_CRATE":
			if not book.opening.is_empty() and book.opening.get("receiptId", "") == "" and next.ledger.size() > previous.ledger.size():
				var receipt := _receipt(next, book.opening.uid, ["acquisition"])
				if not receipt.is_empty():
					book.opening.receiptId = receipt.id
		"SERVICE_FINISH", "REPAIR":
			if int(next.day) >= 25 and int(next.day) <= 52:
				var before = Model.find_inventory(previous, uid)
				var repaired = Model.find_inventory(next, uid)
				if before != null and repaired != null and not before.get("repaired", false) and repaired.get("repaired", false):
					book.activity.repairedUids[uid] = true
		"SETTLE":
			var checkpoint: Dictionary = next.campaignLife.checkpoints.get(str(int(next.day)), {})
			if next.phase == "report" and not checkpoint.is_empty() and not checkpoint.has("storySummary"):
				_save_checkpoint_summary(next, checkpoint)
			if int(next.day) == 90 and next.phase == "report" and not checkpoint.is_empty() and book.final.is_empty():
				_finalize(next)
