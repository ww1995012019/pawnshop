extends RefCounted
## Godot-only crime cases layered over the legacy daily event deck.

static func event_for_day(s: Dictionary):
	var ordinary = Model.event_for_state(s)
	var day := int(s.day)
	var continued: bool = s.get("campaignLife",{}).get("endless",false) and day > 21
	if day < 3 or (day > 19 and not continued) or Model.FIXED_EVENT_DAYS.has(day):
		return ordinary
	var roll := Model.fnv("%s/crime/%d" % [s.seed, int(s.day)]) % 5
	if roll == 1:
		return {"id": "CRIME-GOODS", "title": "没有回执的箱子", "speakerId": "CHR-006",
			"description": "有人想把疑似失窃的旧设备寄存在店里，没有出示来源回执。收下后必须隔离，不能登记成合法货物。",
			"choices": [
				{"id": "CRIME-GOODS-report", "label": "立即通知站务", "costText": "无", "rewardText": "站务关系+4；风险−3"},
				{"id": "CRIME-GOODS-hold", "label": "暂存并封入隔离柜", "costText": "占用一个隔离位；风险+8", "rewardText": "取得一件待移交旧物"},
				{"id": "CRIME-GOODS-reject", "label": "拒收", "costText": "无", "rewardText": "保留现状"}]}
	return ordinary

static func is_crime(event) -> bool:
	return event is Dictionary and String(event.get("id", "")).begins_with("CRIME-")

static func availability(s: Dictionary, choice: Dictionary):
	var event = event_for_day(s)
	if not is_crime(event):
		return Model.event_availability(s, choice)
	if s.phase != "open":
		return "每日事件只在营业期间处理。"
	if s.trade != null:
		return "先完成当前交易或送客，再处理每日事件。"
	if not event.choices.any(func(c): return c.id == choice.get("id", "")):
		return "这项选择已不属于今天的事件。"
	for record in s.events:
		if record.day == s.day:
			return "今天的事件已经处理。"
	if choice.id == "CRIME-THEFT-secure" and not Model.has_ap(s, 1):
		return "守住后仓需要 1 AP。"
	if choice.id == "CRIME-GOODS-hold":
		var count := 0
		for item in s.inventory:
			if item.location == "isolation":
				count += 1
		if count >= 12:
			return "隔离柜已满，先移交现有物品。"
	return null

static func reduce(previous: Dictionary, action: Dictionary) -> Dictionary:
	var event = event_for_day(previous)
	if not is_crime(event) or action.get("eventId", "") != event.id:
		return previous
	var choice = null
	for option in event.choices:
		if option.id == action.get("choiceId", ""):
			choice = option
	if choice == null:
		return previous
	var reason = availability(previous, choice)
	if reason != null:
		return Model.notice(previous.duplicate(true), reason)
	var s: Dictionary = previous.duplicate(true)
	var message := ""
	match choice.id:
		"CRIME-GOODS-report":
			NightCrime.ensure(s)
			NightCrime.credit(s,"EVENT-GOODS-%d" % int(s.day))
			s.risk = Model.clampn(s.risk - 3)
			s.relations.station = Model.clampn(s.relations.station + 4)
			message = "站务接走疑似赃物并登记线索。"
		"CRIME-GOODS-hold":
			var item := Model.new_item(s, "WCH-002", {"condition": 0.6, "working": false,
				"sourceVerified": false, "source": "疑似失窃物品 / 待移交站务", "sealed": true,
				"location": "isolation", "stolen": true, "cost": 0})
			NightCrime.ensure(s)
			var case_id := "EVENT-GOODS-%d" % int(s.day)
			item.crimeCaseId = case_id
			s.nightCrime.cases.append({"id":case_id,"origin":"external","lossDay":int(s.day),"culprit":"","revealed":true,"arrested":false,"items":[{"uid":item.uid,"item":item.duplicate(true),"holder":"inventory","paid":false,"payout":0,"originalLawful":false,"handled":false,"resolved":false,"recovery":""}]})
			s.inventory.append(item)
			s.risk = Model.clampn(s.risk + 8)
			message = "疑似赃物已封入隔离柜；请从仓储移交站务。"
		"CRIME-GOODS-reject":
			message = "你拒收了没有来源回执的箱子。"
	Model.ledger(s, "station-event-day-%s" % Model.jnum(s.day), "station-event", "%s · %s" % [event.title, choice.label], 0)
	s.events.append({"day": s.day, "eventId": event.id, "choiceId": choice.id})
	return Model.notice(s, message)
