class_name Landlord
extends RefCounted
## Explicit rent collection. The original rent ledger ID is also the save migration guard.
const NPC_ID := "CHR-034"

static func paid(s: Dictionary, day := -1) -> bool:
	var on_day := int(s.day) if day < 0 else day
	if s.get("rent",{}).get("days",{}).get(str(on_day),{}).get("paid",false): return true
	for entry in s.get("ledger",[]):
		if entry.get("kind","") == "rent" and int(entry.get("day",0)) == on_day and float(entry.get("amount",0)) < 0:
			return true
	return false

static func outstanding(s: Dictionary) -> int:
	return 0 if paid(s) else int(Model.rent_due(s.day))

static func ensure(s: Dictionary) -> void:
	if not s.get("rent") is Dictionary: s.rent = {"version":1,"days":{}}
	if not s.rent.get("days") is Dictionary: s.rent.days = {}
	var key := str(int(s.day))
	if not s.rent.days.has(key): s.rent.days[key] = {"paid":paid(s),"visitCounted":false,"deferred":false}
	if paid(s): s.rent.days[key].paid = true

static func due_now(s: Dictionary) -> bool:
	return s.get("phase","") == "open" and outstanding(s) > 0

static func scheduled(s: Dictionary) -> bool:
	return due_now(s) and s.trade == null and int(s.cursor) >= VisitSchedule.landlord_slot(s) and not NightCrime.inspection_pending(s)

static func _start(s: Dictionary) -> Dictionary:
	if s.trade != null: return Model.notice(s,"先完成当前来客的接待，再请房东过来。")
	var amount := outstanding(s)
	if amount == 0: return Model.notice(s,"本期租金已结清，回执在账本里。")
	VisitSchedule.reserve_landlord(s)
	s.trade = {"id":Model.next_id(s,"landlord"),"npcId":NPC_ID,"kind":"landlord","item":null,
		"price":amount,"rounds":0,"locked":false,"evidenceUsed":[],"talkLog":[],"rentDay":int(s.day),
		"line":"我是梁叔，今天来收这一期店面租金，共 %d Cr。你先核对账目，确认后再付。" % amount}
	return Model.notice(s,"房东梁叔到店收租，确认缴租前不会扣款。")

static func _finish(s: Dictionary, words: String) -> Dictionary:
	var record: Dictionary = s.rent.days[str(int(s.day))]
	if not record.visitCounted:
		record.visitCounted = true
		s.cursor += 1
	s.trade = null
	return Model.notice(s,words)

static func _relief(s: Dictionary) -> void:
	var record: Dictionary = s.rent.days[str(int(s.day))]
	record.deferred = true
	Model.ledger(s,"rent-relief-%d" % int(s.day),"rent-relief","房东同意当日筹钱，可应急清仓合法自有货",0)

static func reduce(previous: Dictionary, action: Dictionary):
	var type: String = action.get("type","")
	var visiting: bool = previous.get("trade") is Dictionary and previous.trade.get("kind","") == "landlord"
	var requested: bool = type == "CALL_LANDLORD" or (type == "SETTLE" and due_now(previous)) or (type == "ARRIVE" and scheduled(previous))
	if not visiting and not requested and type not in ["PAY_RENT","LANDLORD_LATER","RENT_DEFAULT"]: return null
	if previous.phase != "open":
		return Model.notice(previous.duplicate(true),Model.business_hours_problem(previous)) if type in ["CALL_LANDLORD","PAY_RENT","LANDLORD_LATER","RENT_DEFAULT"] else null
	# Existing police appointments are resolved first; never replace another visitor.
	if requested and not visiting and NightCrime.inspection_pending(previous):
		return Model.notice(previous.duplicate(true),"先完成待到场的查货，再请房东收租。") if type in ["SETTLE","CALL_LANDLORD"] else null
	var s: Dictionary = previous.duplicate(true)
	ensure(s)
	if not visiting:
		if type in ["PAY_RENT","LANDLORD_LATER","RENT_DEFAULT"]: return previous
		return _start(s)
	if type in ["PAY_RENT","LANDLORD_LATER","RENT_DEFAULT"] and action.get("tradeId","") != s.trade.id: return previous
	if type == "PAY_RENT":
		var amount := outstanding(s)
		if amount == 0: return previous
		if s.cash < amount:
			_relief(s)
			s.trade.line = "这期租金 %d Cr，你还差 %d Cr。先去筹钱，今天收齐再交回执。" % [amount,ceili(amount-s.cash)]
			return Model.notice(s,"现金不足，没有扣款。可先筹钱或应急清仓合法自有货，再请房东收租。")
		if not Model.ledger(s,"rent-day-%d" % int(s.day),"rent","向房东缴纳第 %d 天租金" % int(s.day),-amount): return previous
		s.rent.days[str(int(s.day))].paid = true
		s.trade.rentPaid = true
		s.trade.line = "%d Cr 收到了。这是本期回执，日结不会再扣这笔租金。生意慢慢做，账要记清楚。" % amount
		return Model.notice(s,"本期租金 %d Cr 已交给房东，回执已记入账本。" % amount)
	if type in ["LANDLORD_LATER","REFUSE","TRADE_END"]:
		if outstanding(s) > 0: _relief(s)
		return _finish(s,"房东留下当日筹钱时间；筹齐后可从账本再次请房东收租。" if outstanding(s)>0 else "本期租金已结清，房东收好账簿离开。")
	if type == "RENT_DEFAULT":
		if outstanding(s) == 0 or s.cash >= outstanding(s) or not s.rent.days[str(int(s.day))].deferred: return previous
		s.phase = "ending"
		s.outcome = "无法支付租金，交还店面"
		s.trade = null
		return Model.notice(s,"已确认无法继续租用店面。经营记录保留，本期未再扣款。")
	if type in ["OFFER","ACCEPT","DELIVER","PAWN","SELECT_TRADE","TRADE_OPEN","BUY_MATERIAL","SELL_MATERIAL","SELL_MERCHANT_ITEM","REPORT_VISITOR"]:
		return Model.notice(s,"本次是房东收租，请核对租金、缴费或商量当日筹钱。")
	return null
