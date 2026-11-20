extends SceneTree
## XDG_DATA_HOME=$(mktemp -d) godot --headless --no-header --path godot --script res://tests/campaign_90_balance.gd
## Optional arguments after --: --tier=repair|resale|mixed|idle, --seed=01,
## --days=7, --mode=legacy21, --format=csv, --gate. An explicit seed can be
## used for a holdout series. Legacy proceeds via the normal D21 continuation.
## The default sweep writes JSON Lines. --gate requires at least 7 of 8 runs
## per route to settle. Run --tier=idle separately to check for a shortfall.

class BalanceGame extends "res://scripts/app/game.gd":
	func save() -> void:
		# Exercise the application reducers and observers without writing a user save.
		pass

const CommerceRules = preload("res://scripts/model/commerce.gd")
const Contracts = preload("res://scripts/model/service_contracts.gd")
const Auction = preload("res://scripts/model/auction_nights.gd")
const Market = preload("res://scripts/model/weekly_market.gd")
const Campaign = preload("res://scripts/model/campaign_life.gd")
const ROUTES := ["repair", "resale", "mixed"]
const REPAIR_MATERIALS := ["MAT-007", "MAT-008", "MAT-009", "MAT-010"]
const CAMPAIGN_DAYS := 90
const START_CASH := 1200.0
const DAILY_AP := 12.0
const MARGIN := 15
const AUDIT_DAYS := [7, 21, 49, 84]
const FEE_KINDS := ["electricity", "cleaning", "maintenance"]
const RECEIPT_KINDS := ["purchase", "sale", "service", "service-job"]
const CSV_FIELDS := [
	"record", "mode", "seed", "tier", "week", "day", "daysSettled", "success", "failure", "detail",
	"cash", "apLeft", "apUsed", "ordinaryVisits", "saleAttempts", "rentDue", "rentPaid", "feesDue", "feesPaid", "outstanding", "nextReserve", "deposits", "ownedCost", "pendingJobs",
	"purchases", "sales", "repairs", "purchaseOutflow", "saleIncome", "repairIncome", "materialOutflow", "auctionDeposits", "auctionRefunds", "addedOriginals", "removedOriginals",
	"abandoned", "reconciliation", "passed", "total", "required",
]

var shop: BalanceGame
var route := ""
var stats: Dictionary
var checked_today := 0
var taken_today := false
var audit_error := ""

func _initialize() -> void:
	call_deferred("run")

func _options() -> Dictionary:
	var options := {"tier":"all", "seed":"", "days":"90", "mode":"story90", "format":"json", "gate":false}
	for arg in OS.get_cmdline_user_args():
		if arg == "--gate":
			options.gate = true
			continue
		var pair := arg.trim_prefix("--").split("=", true, 1)
		if not arg.begins_with("--") or pair.size() != 2 or not options.has(pair[0]) or pair[0] == "gate":
			return {}
		options[pair[0]] = pair[1]
	if not options.tier in ROUTES + ["all", "idle"] or not options.mode in ["story90", "legacy21"] \
		or not options.format in ["json", "csv"] or not options.days.is_valid_int() \
		or int(options.days) < 1 or int(options.days) > CAMPAIGN_DAYS:
		return {}
	return options

func run() -> void:
	var options := _options()
	if options.is_empty():
		printerr("Expected --tier=repair|resale|mixed|idle, --seed=SEED, --days=1..90, --mode=story90|legacy21, --format=json|csv, or --gate after --.")
		quit(2)
		return
	shop = BalanceGame.new()
	var seeds: Array[String] = []
	if String(options.seed).is_empty():
		for index in range(1, 9):
			seeds.append("ORBITAL-90-%02d" % index)
	else:
		seeds.append("ORBITAL-90-%02d" % int(options.seed) if options.seed.is_valid_int() else options.seed)
	var routes: Array = ROUTES if options.tier == "all" else [options.tier]
	var failed := false
	if options.format == "csv":
		print(",".join(CSV_FIELDS))
	for selected in routes:
		var passed := 0
		for seed in seeds:
			var result := _play(seed, selected, options)
			if result.is_empty():
				_output({"record":"result", "mode":options.mode, "tier":selected, "seed":seed, "success":false, "failure":"simulation_error"}, options.format)
				failed = true
				continue
			passed += int(result.success if selected != "idle" else result.failure in ["rent_shortfall", "operating_shortfall"])
			failed = failed or not audit_error.is_empty()
		var required := seeds.size() if seeds.size() < 8 or selected == "idle" else 7
		_output({"record":"summary", "mode":options.mode, "tier":selected, "day":int(options.days), "passed":passed, "total":seeds.size(), "required":required}, options.format)
		failed = failed or (options.gate and passed < required)
	shop.free()
	await process_frame
	quit(1 if failed else 0)

func _output(record: Dictionary, format: String) -> void:
	if format == "json":
		print(JSON.stringify(record))
		return
	var cells: PackedStringArray = []
	for key in CSV_FIELDS:
		var value = record.get(key, "")
		var cell := JSON.stringify(value) if value is Dictionary or value is Array else str(value)
		cells.append('"%s"' % cell.replace('"', '""'))
	print(",".join(cells))

func _metrics() -> Dictionary:
	return {"ordinaryVisits":0, "saleAttempts":0, "apUsed":0.0, "rentDue":0, "rentPaid":0, "feesDue":0, "feesPaid":0, "abandoned":{}, "purchases":0, "sales":0, "repairs":0,
		"purchaseOutflow":0, "saleIncome":0, "repairIncome":0, "materialOutflow":0, "auctionDeposits":0, "auctionRefunds":0, "addedOriginals":0, "removedOriginals":0}

func _play(seed: String, selected: String, options: Dictionary) -> Dictionary:
	route = selected
	audit_error = ""
	shop.new_game(seed, options.mode)
	_verify(shop.state.cash == START_CASH and shop.state.ap == DAILY_AP and shop.state.day == 1, "new shop changed its starting cash, AP, or day")
	_verify(Campaign.mode(shop.state) == options.mode, "new shop started in the wrong campaign mode")
	var days_settled := 0
	var reason := ""
	var detail := ""
	var totals := _metrics()
	stats = _metrics()
	var start_ledger := 0
	var target := int(options.days)
	var days_in_week := 0
	for day in range(1, target + 1):
		if audit_error.is_empty():
			var opening_ap := float(shop.state.ap)
			if shop.state.phase == "open":
				_run_business_day()
			var closing := _close_day()
			stats.apUsed += opening_ap - float(shop.state.ap)
			reason = closing.failure
			detail = closing.detail
			if reason.is_empty():
				days_settled = day
		if day == CAMPAIGN_DAYS and options.mode == "story90" and days_settled == day:
			_verify(not Campaign.checkpoint(shop.state, day).is_empty(), "day 90 settlement did not freeze a campaign assessment")
		days_in_week += 1
		if day % 7 == 0 or day == target or not reason.is_empty() or not audit_error.is_empty():
			_record_week(start_ledger, totals, seed, options, days_settled, reason, detail)
			days_in_week = 0
			start_ledger = shop.state.ledger.size()
			stats = _metrics()
		if not reason.is_empty() or not audit_error.is_empty() or day == target:
			break
		# Finish the weekly snapshot before NEXT applies overnight cash and inventory changes.
		_act("CONTINUE_CAMPAIGN" if options.mode == "legacy21" and day == 21 else "NEXT")
		if int(shop.state.day) != day + 1 or shop.state.phase not in ["open", "report"]:
			reason = "cannot_advance"
			detail = String(shop.state.notice)
			if days_in_week > 0:
				_record_week(start_ledger, totals, seed, options, days_settled, reason, detail)
			break
	stats = totals
	if days_settled == target and reason.is_empty():
		_verify(is_equal_approx(float(stats.rentDue), float(stats.rentPaid)), "campaign did not pay each scheduled rent")
		_verify(is_equal_approx(float(stats.feesDue), float(stats.feesPaid)), "campaign did not pay each day's store costs")
	var result := _snapshot("result", seed, options.mode, days_settled, reason, detail)
	result.reconciliation = _reconcile()
	if not audit_error.is_empty():
		result.failure = "reconciliation"
		result.detail = audit_error
	result.success = days_settled == target and String(result.failure).is_empty()
	_output(result, options.format)
	return result

func _run_business_day() -> void:
	checked_today = 0
	taken_today = false
	var repairs := route in ["repair", "mixed"]
	if repairs:
		_repair_board()
	var materials: Dictionary = shop.state.materials
	var cash := float(shop.state.cash)
	if route in ["resale", "mixed"]:
		_auction()
	if route != "idle":
		_visits()
	if repairs and (materials != shop.state.materials or cash < float(shop.state.cash)):
		_repair_board()

func _record_week(start_ledger: int, totals: Dictionary, seed: String, options: Dictionary, days_settled: int, reason: String, detail: String) -> void:
	_collect_metrics(start_ledger)
	var week := _snapshot("week", seed, options.mode, days_settled, reason, detail)
	if int(shop.state.day) in AUDIT_DAYS:
		week.reconciliation = _reconcile()
	if not audit_error.is_empty():
		week.failure = "reconciliation"
		week.detail = audit_error
	_output(week, options.format)
	for key in stats:
		if key != "abandoned":
			totals[key] += stats[key]
	for label in stats.abandoned:
		totals.abandoned[label] = int(totals.abandoned.get(label, 0)) + int(stats.abandoned[label])

func _act(type: String, fields := {}) -> void:
	var originals := _originals()
	shop.dispatch({"type":type}.merged(fields, true))
	_verify(float(shop.state.ap) >= 0.0 and float(shop.state.ap) <= DAILY_AP, "AP out of range after " + type)
	var current := _originals()
	_verify(current.size() == shop.state.inventory.size(), "duplicate original in inventory after " + type)
	for uid in current:
		stats.addedOriginals += int(not originals.has(uid))
	for uid in originals:
		stats.removedOriginals += int(not current.has(uid))

func _verify(ok: bool, message: String) -> void:
	if not ok and audit_error.is_empty():
		audit_error = message

func _abandon(reason: String) -> void:
	stats.abandoned[reason] = int(stats.abandoned.get(reason, 0)) + 1

func _base_fee(day: int) -> int:
	var costs: Dictionary = shop.state.storeCosts
	var projection := {"day":day, "phase":"open", "upgrades":shop.state.upgrades,
		"storeCosts":{"version":costs.version, "fromDay":costs.fromDay, "devices":costs.devices.duplicate(true)}}
	return int(StoreCosts.quote(projection).total)

func _reserve(usage_cr := 0.0) -> int:
	var s := shop.state
	var forecast := s.duplicate(false)
	var total := 0
	var first := int(s.day) + int(s.phase != "open")
	for day in range(first, CAMPAIGN_DAYS + 1):
		if day == int(s.day):
			var quote := StoreCosts.quote(s)
			var cents := int(quote.details.totalCents) + roundi(usage_cr * 100.0)
			total += int(quote.total) - int(quote.electricity) + ceili(cents / 100.0)
		else:
			total += _base_fee(day)
		forecast.day = day
		# The legacy comparison opts into normal ongoing rent after its D21 report.
		if day > 21 and Campaign.mode(s) == "legacy21":
			forecast.campaignLife = {"mode":"endless"}
		var rent := Landlord.nominal_due(forecast)
		if rent > 0 and not Landlord.paid(s, day):
			return total + rent
	return total

func _finish_rent() -> bool:
	var due := Landlord.outstanding(shop.state)
	if due > 0:
		_act("PAY_RENT", {"tradeId":shop.state.trade.id})
		if Landlord.outstanding(shop.state) > 0:
			return false
	_act("REFUSE")
	return shop.state.trade == null

func _inspection() -> void:
	if shop.state.trade == null and NightCrime.inspection_pending(shop.state):
		_act("ARRIVE_INSPECTION")
	if shop.state.trade != null and shop.state.trade.get("inspectionVisit", false):
		var id: String = shop.state.trade.id
		_act("PREPARE_INSPECTION", {"tradeId":id})
		_act("RESOLVE_INSPECTION", {"tradeId":id})

func _close_day() -> Dictionary:
	var s := shop.state
	var first_row: int = s.ledger.size()
	var rent := Landlord.nominal_due(s)
	stats.rentDue += rent
	stats.feesDue += int(StoreCosts.quote(s).total)
	if s.phase == "report" and s.report.get("closed", false):
		if Campaign.pending_closed_checkpoint(s):
			_act("SETTLE")
		return {"failure":"", "detail":""}
	_inspection()
	if Landlord.due_now(shop.state) and shop.state.trade == null:
		_act("CALL_LANDLORD")
	if shop.state.trade != null and shop.state.trade.kind == "landlord" and not _finish_rent():
		return {"failure":"rent_shortfall", "detail":"%s Cr available for %s Cr rent" % [shop.state.cash, Landlord.outstanding(shop.state)]}
	var payment := int(StoreCosts.quote(shop.state).total)
	var shortage: bool = float(shop.state.cash) < payment
	_act("SETTLE")
	var paid_fees := 0.0
	for row in shop.state.ledger.slice(first_row):
		if row.kind in FEE_KINDS:
			paid_fees -= float(row.amount)
	if shortage:
		return {"failure":"operating_shortfall", "detail":"%s Cr available for %s Cr store fees · %s" % [shop.state.cash, payment, shop.state.notice]}
	if shop.state.report == null or int(shop.state.report.day) != int(s.day):
		return {"failure":"cannot_settle", "detail":String(shop.state.notice)}
	_verify(is_equal_approx(paid_fees, float(payment)), "settlement did not post the quoted store fees")
	_verify(rent == 0 or Landlord.paid(shop.state), "settlement skipped payable rent")
	return {"failure":"", "detail":""}

func _visits() -> void:
	var ordinary := 0
	var limit := 4 if route == "resale" else 3 if route == "mixed" else 2
	while NightCrime.can_arrive(shop.state):
		var merchant := CommerceRules.merchant_due(shop.state)
		var landlord := Landlord.scheduled(shop.state)
		var needs_stock := route == "repair" and _needs_materials() and CommerceRules.merchant_slot(shop.state) >= int(shop.state.cursor)
		if ordinary >= limit and not (merchant or landlord or needs_stock):
			break
		var cursor := int(shop.state.cursor)
		_act("ARRIVE")
		var trade = shop.state.trade
		if trade == null:
			break
		if trade.get("inspectionVisit", false):
			_inspection()
		elif trade.kind == "landlord":
			if float(shop.state.cash) < Landlord.outstanding(shop.state) or not _finish_rent():
				break
		elif trade.kind == "merchant":
			if route in ["repair", "mixed"]:
				_stock_materials()
			_act("REFUSE")
		elif trade.kind in ["buy", "sell"]:
			ordinary += 1
			stats.ordinaryVisits += 1
			if ordinary <= limit and Model.has_ap(shop.state, 1):
				if not _sale_stock().is_empty():
					stats.saleAttempts += 1
					_sell()
				if route in ["resale", "mixed"] and shop.state.trade != null:
					_buy()
			if shop.state.trade != null:
				_act("REFUSE")
		else:
			_act("REFUSE")
		_verify(shop.state.trade == null, "visitor did not leave: " + String(shop.state.notice))
		if not audit_error.is_empty() or (int(shop.state.cursor) == cursor and not trade.get("bonusVisit", false)):
			break
	_verify(route == "repair" or ordinary <= limit, "ordinary visit limit exceeded")

func _needs_materials() -> bool:
	return REPAIR_MATERIALS.any(func(id): return int(shop.state.materials.get(id, 0)) < 2)

func _stock_materials() -> void:
	for id in REPAIR_MATERIALS:
		var deficit := 2 - int(shop.state.materials.get(id, 0))
		var price := int(GameData.material(id).price)
		var available := maxf(0.0, float(shop.state.cash) - float(_reserve()))
		var qty := mini(deficit, mini(int(shop.state.trade.stock.get(id, 0)), floori(available / price)))
		if qty > 0:
			_act("BUY_MATERIAL", {"id":id, "qty":qty})
		elif deficit > 0:
			_abandon("materials_cash_or_stock")

func _jobs() -> Array:
	var pending: Array = []
	for item in shop.state.inventory:
		if item.owner == "customer" and (item.has("serviceJobId") or item.has("orderId")):
			pending.append(item)
	return pending

func _repair_board() -> void:
	if shop.state.trade != null:
		return
	var pending := _jobs()
	var board: Array = Contracts.contracts(shop.state)
	var by_id := {}
	for contract in board:
		by_id[contract.id] = contract
	pending.sort_custom(func(a, b): return _job_due(a, by_id) < _job_due(b, by_id))
	for item in pending:
		var contract: Dictionary = by_id.get(item.get("serviceJobId", ""), {})
		_work_job(String(item.uid), contract)
	if taken_today or _jobs().size() >= (1 if route == "mixed" else 2) or not Model.has_ap(shop.state, 5):
		return
	var choices: Array = []
	for order in Model.available_orders(shop.state):
		if order.get("customerOwned", false) and order.get("needsRepair", false):
			choices.append({"id":order.id, "model":order.itemId, "fee":order.reward, "dueDay":Model.order_due(shop.state, order.id), "fixed":true})
	for contract in board:
		if contract.status == "available":
			choices.append({"id":contract.id, "model":contract.model, "fee":contract.budget, "dueDay":contract.dueDay, "fixed":false})
	choices.sort_custom(func(a, b):
		if a.fixed != b.fixed:
			return a.fixed
		if a.fee != b.fee:
			return a.fee > b.fee
		return a.dueDay < b.dueDay)
	for choice in choices:
		var quartz: bool = WatchRules.model_reference(choice.model).movement == "quartz"
		# Price the advertised symptoms with ordinary parts, before a disassembly
		# can identify the exact fault. Do not inspect the offer's future original.
		var material_ids := ["MAT-008", "MAT-010"] if quartz else ["MAT-007", "MAT-008", "MAT-009"]
		var material_cost := 0
		for id in material_ids:
			material_cost += int(GameData.material(id).price)
		var use_fee := StoreCosts.usage_quote(shop.state, "repair_tester", 1.0 if quartz else 1.5)
		if choice.fixed:
			use_fee += StoreCosts.usage_quote(shop.state, "uv", 0.5)
		if float(choice.fee) <= float(material_cost) + use_fee or float(shop.state.cash) < _reserve(use_fee):
			continue
		var mats: Dictionary = shop.state.materials
		var has_battery := int(mats.get("MAT-010", 0)) > 0
		var has_part := int(mats.get("MAT-008", 0)) > 0
		var has_wash := int(mats.get("MAT-007", 0)) > 0 and int(mats.get("MAT-009", 0)) > 0
		if not (has_battery if quartz else has_part or has_wash):
			continue
		if Model.empty_cell(shop.state, {"uid":"", "defId":choice.model, "rotated":false}) == null:
			continue
		taken_today = true
		_act("TAKE_ORDER" if choice.fixed else "TAKE_SERVICE_CONTRACT", {"id":choice.id})
		for item in _jobs():
			if choice.id == item.get("orderId", "") or choice.id == item.get("serviceJobId", ""):
				_work_job(String(item.uid), {} if choice.fixed else by_id[choice.id])
				return
		_abandon("order_not_accepted")
		return
	if not choices.is_empty():
		_abandon("no_affordable_service_job")

func _job_due(item: Dictionary, by_id: Dictionary) -> int:
	if item.has("orderId"):
		return Model.order_due(shop.state, item.orderId)
	return int(by_id.get(item.serviceJobId, {}).get("dueDay", 0))

func _work_job(uid: String, contract: Dictionary) -> void:
	var it = Model.find_inventory(shop.state, uid)
	if it == null:
		return
	var fixed: bool = it.has("orderId")
	var id: String = it.orderId if fixed else it.serviceJobId
	var expired := int(shop.state.day) > _job_due(it, {id:contract})
	if expired and not it.service.opened:
		_act("RETURN_ITEM", {"uid":uid})
		_abandon("service_expired")
		return
	if not fixed and not contract.get("status", "") in ["approved", "ready", "expired"]:
		if not Model.has_ap(shop.state, 1):
			return
		if not it.evidence.has("TOL-001"):
			_act("CHECK", {"uid":uid, "tool":"TOL-001"})
		_act("QUOTE_SERVICE_CONTRACT", {"id":id, "price":int(contract.budget)})
		if Contracts.work_problem(shop.state, Model.find_inventory(shop.state, uid)) != "":
			_abandon("service_quote_unapproved")
			return
	it = Model.find_inventory(shop.state, uid)
	if not it.service.active and not it.service.finished:
		_act("SERVICE_BEGIN", {"uid":uid})
	for step in WatchService.TASKS.size():
		it = Model.find_inventory(shop.state, uid)
		var task := WatchService.current(it)
		if task.is_empty():
			break
		if WatchService.problem(shop.state, it, task) != "":
			_abandon("service_materials_ap_or_tool")
			return
		if task == "test":
			var usage := StoreCosts.usage_quote(shop.state, "repair_tester", 1.0 if WatchService.profile(it).movement == "quartz" else 1.5)
			if float(shop.state.cash) < _reserve(usage):
				_abandon("test_operating_reserve")
				return
		_act("SERVICE_PROGRESS", {"uid":uid, "task":task, "progress":{"complete":true, "opened":task == "open"}})
		_act("SERVICE_COMPLETE", {"uid":uid, "task":task})
		if WatchService.current(Model.find_inventory(shop.state, uid)) == task:
			_abandon("service_step_rejected")
			return
	it = Model.find_inventory(shop.state, uid)
	if not it.service.finished:
		_act("SERVICE_FINISH", {"uid":uid})
	if expired:
		_act("RETURN_ITEM", {"uid":uid})
		_abandon("service_expired")
		return
	if fixed:
		for tool in ["TOL-001", "TOL-002"]:
			if Model.find_inventory(shop.state, uid).evidence.has(tool):
				continue
			var use_fee := StoreCosts.usage_quote(shop.state, "uv", 0.5) if tool == "TOL-002" else 0.0
			if not Model.has_ap(shop.state, 2) or float(shop.state.cash) < _reserve(use_fee):
				return
			_act("CHECK", {"uid":uid, "tool":tool})
	if not Model.has_ap(shop.state, 1):
		return
	var fee := float(GameData.order(id).reward) if fixed else float(contract.get("quote", 0))
	if not fixed and fee == 0:
		fee = float(contract.budget)
	var first_receipt: int = shop.state.shopJournal.receipts.size()
	_act("DELIVER_ORDER" if fixed else "DELIVER_SERVICE_CONTRACT", {"uid":uid, "id":id})
	if Model.find_inventory(shop.state, uid) == null:
		_check_receipt(first_receipt, {uid:fee})
	else:
		_abandon("service_delivery_rejected")

func _sale_stock() -> Array:
	var candidates := []
	for item in shop.state.inventory:
		if item.owner == "shop" and item.sourceVerified and not item.sealed and not item.get("crimeRevealed", false) \
			and item.location in ["warehouse", "display", "recovery"] and not item.has("orderId") and not NightCrime.unfinished_work(item):
			candidates.append(item)
	var hot: String = Market.current(shop.state).get("hotTier", "")
	candidates.sort_custom(func(a, b):
		var left := GameData.def(WatchForgery.appearance_id(a))
		var right := GameData.def(WatchForgery.appearance_id(b))
		if (left.tier == hot) != (right.tier == hot):
			return left.tier == hot
		return left.value > right.value if left.value != right.value else String(a.uid) < String(b.uid))
	return candidates

func _sell() -> void:
	var selected := false
	for item in _sale_stock():
		var uid: String = item.uid
		var costs: Dictionary = shop.state.shopJournal.recordedCosts.get(uid, {})
		var minimum := ceili(float(item.cost) + float(costs.get("electricity", 0))) + MARGIN
		_act("SELECT_TRADE", {"uid":uid})
		var row := TradeSession.row(shop.state, uid)
		if row.is_empty() or not row.status in ["ready", "counter"]:
			_abandon("buyer_declined_original")
			continue
		if float(row.context.price) < minimum:
			_abandon("buyer_quote_below_cost_plus_margin")
			continue
		_trade_action("TRADE_CONFIRM", {"uid":uid})
		var confirmed := TradeSession.row(shop.state, uid)
		if confirmed.get("status", "") != "confirmed":
			_abandon("buyer_budget_or_acceptance")
			continue
		selected = true
	if selected:
		_checkout()

func _trade_action(type: String, fields: Dictionary) -> void:
	_act(type, fields.merged({"tradeId":shop.state.trade.id}, true))

func _buy() -> void:
	if not Model.has_ap(shop.state, 1) or float(shop.state.cash) - _reserve() < 1:
		return
	var goods: Array = TradeSession.session(shop.state).get("goods", []).duplicate()
	# An ask well below the public ceiling is a better use of the limited
	# inspections than a huge absolute spread on an expensive watch.
	goods.sort_custom(func(a, b):
		var left := _ask_fraction(a)
		var right := _ask_fraction(b)
		return left < right if left != right else String(a.uid) < String(b.uid))
	for lot in goods:
		if shop.state.trade == null or not Model.has_ap(shop.state, 1):
			break
		if not lot.sourceVerified or lot.sealed or lot.get("crimeRevealed", false):
			_abandon("supply_not_registered")
			continue
		var uid: String = lot.uid
		var row := TradeSession.row(shop.state, uid)
		var valuation := Model.estimate(lot)
		if float(valuation.high) - float(row.context.price) < MARGIN or Model.empty_cell(shop.state, lot) == null:
			_abandon("supply_opening_ask_or_space")
			continue
		if valuation.count < 1:
			if checked_today >= 2 or not Model.has_ap(shop.state, 2):
				continue
			checked_today += 1
			_act("CHECK", {"uid":uid, "tool":"TOL-001"})
			valuation = Model.estimate(TradeSession.item(shop.state, uid))
		var max_bid := mini(floori(float(shop.state.cash) - _reserve()), int(valuation.low) - MARGIN)
		if valuation.count < 1 or not Model.valid_price(max_bid):
			_abandon("inspected_lower_beats_no_legal_offer")
			continue
		if float(row.context.price) > max_bid:
			var offer := {"uid":uid, "price":max_bid}
			if TradeSession.item(shop.state, uid).evidence.has("TOL-001"):
				offer.evidence = "TOL-001"
			_trade_action("TRADE_OFFER", offer)
			if shop.state.trade == null:
				_abandon("seller_left_after_offer")
				break
			row = TradeSession.row(shop.state, uid)
		if not row.status in ["ready", "counter"] or float(row.context.price) > max_bid:
			_abandon("seller_counter_above_inspected_lower")
			continue
		_trade_action("TRADE_CONFIRM", {"uid":uid})
		if TradeSession.row(shop.state, uid).get("status", "") != "confirmed":
			_abandon("seller_quote_unconfirmed")
			continue
		_checkout()

func _ask_fraction(item: Dictionary) -> float:
	var row := TradeSession.row(shop.state, item.uid)
	return float(row.get("context", {}).get("price", INF)) / float(Model.estimate(item).high)

func _checkout() -> void:
	var cost := TradeSession.summary(shop.state)
	if float(cost.net) < 0.0 and float(shop.state.cash) + float(cost.net) < _reserve():
		_abandon("checkout_operating_reserve")
		return
	var problem := TradeSession.checkout_problem(shop.state)
	if not problem.is_empty():
		_abandon("checkout_rejected")
		return
	var expected := {}
	for row in cost.lines:
		if row.included and row.selected and row.status == "confirmed":
			expected[row.uid] = float(row.context.price) * (1.0 if row.direction == "sell" else -1.0)
	var before := float(shop.state.ap)
	var receipts: int = shop.state.shopJournal.receipts.size()
	var batch := "balance-%d" % int(cost.version)
	_trade_action("TRADE_CHECKOUT", {"batch":batch, "version":cost.version})
	if not TradeSession.session(shop.state).get("completed", []).has(batch):
		_abandon("checkout_rejected")
		return
	_verify(is_equal_approx(float(shop.state.ap), before - 1), "checkout did not take exactly 1 AP")
	_check_receipt(receipts, expected)
	for uid in expected:
		var held = Model.find_inventory(shop.state, uid)
		_verify((held != null and held.owner == "shop") if float(expected[uid]) < 0 else held == null, "checkout failed to transfer original " + uid)

func _auction() -> void:
	if shop.state.trade != null or checked_today >= 2 or not Model.has_ap(shop.state, 1):
		return
	for event in shop.state.auctionNights.entries:
		if event.status != "available" or int(event.dueDay) != int(shop.state.day):
			continue
		# Use the same public model and recorded appraisal as at the counter.
		# The saved original is only passed to the public appraisal query.
		if float(Model.estimate(event.original).high) - float(event.price) < MARGIN or Model.empty_cell(shop.state, event.original) == null:
			return
		var id: String = event.id
		var uid: String = event.original.uid
		var liquid := floori(float(shop.state.cash)) - _reserve()
		if liquid < maxi(Auction.DEPOSIT, int(event.price)):
			_abandon("auction_operating_reserve")
			return
		checked_today += 1
		_act("AUCTION_INSPECT", {"id":id, "tool":"TOL-001"})
		var inspected := Auction._entry(shop.state, id)
		var estimate := Model.estimate(inspected.original)
		var budget := mini(liquid, int(estimate.low) - MARGIN)
		if estimate.count < 1 or budget < int(inspected.price):
			_abandon("auction_ask_above_inspected_lower")
			return
		_act("AUCTION_JOIN", {"id":id, "price":budget})
		for bid in 3:
			var offer := Auction._entry(shop.state, id)
			if offer.status != "bidding" or int(offer.price) > budget or int(offer.round) != bid:
				break
			_act("AUCTION_BID", {"id":id})
		var final := Auction._entry(shop.state, id)
		if final.status == "won":
			var receipts: int = shop.state.shopJournal.receipts.size()
			_act("AUCTION_SETTLE", {"id":id})
			if Model.find_inventory(shop.state, uid) != null:
				_check_receipt(receipts, {uid:-float(final.price)})
				return
		if int(Auction._entry(shop.state, id).deposit) > 0:
			_act("AUCTION_PASS", {"id":id})
		_abandon("auction_outbid_or_unsettled")
		return

func _check_receipt(previous_count: int, expected: Dictionary) -> void:
	var receipts: Array = shop.state.shopJournal.receipts
	if receipts.size() != previous_count + 1:
		_verify(false, "completed original changed hands without one new receipt")
		return
	var receipt: Dictionary = receipts.back()
	var entries := {}
	for row in receipt.entries:
		entries[row.uid] = float(row.cashImpact)
	_verify(not receipt.historical and entries == expected, "receipt does not match the live original and payment")

func _originals() -> Dictionary:
	var result := {}
	for item in shop.state.inventory:
		result[item.uid] = true
	return result

func _collect_metrics(start_ledger: int) -> void:
	for row in shop.state.ledger.slice(start_ledger):
		match row.kind:
			"rent":
				stats.rentPaid -= float(row.amount)
			"electricity", "cleaning", "maintenance":
				stats.feesPaid -= float(row.amount)
			"purchase":
				stats.purchases += 1
				stats.purchaseOutflow -= float(row.amount)
			"sale":
				stats.sales += 1
				stats.saleIncome += float(row.amount)
			"service", "service-job":
				stats.repairs += 1
				stats.repairIncome += float(row.amount)
			"materials":
				stats.materialOutflow -= float(row.amount)
			"auction-deposit":
				stats.auctionDeposits -= float(row.amount)
			"auction-deposit-return":
				stats.auctionRefunds += float(row.amount)

func _snapshot(record: String, seed: String, mode: String, days_settled: int, reason: String, detail: String) -> Dictionary:
	var s := shop.state
	var owned_cost := 0.0
	for item in s.inventory:
		if item.owner == "shop":
			owned_cost += float(item.cost)
	var deposits := 0
	for event in s.auctionNights.entries:
		deposits += int(event.deposit)
	return stats.merged({"record":record, "mode":mode, "seed":seed, "tier":route, "day":int(s.day), "week":ceili(float(s.day) / 7.0),
		"daysSettled":days_settled, "failure":reason, "detail":detail, "cash":float(s.cash), "apLeft":float(s.ap), "nextReserve":_reserve(),
		"outstanding":maxf(0.0, float(stats.rentDue + stats.feesDue - stats.rentPaid - stats.feesPaid)), "deposits":deposits, "ownedCost":owned_cost, "pendingJobs":_jobs().size()})

func _reconcile() -> Dictionary:
	var expected := START_CASH
	var ledger_deposits := 0.0
	var held_deposits := 0
	var ids := {}
	var receipt_ledger := {}
	var matched := {}
	for row in shop.state.ledger:
		_verify(not ids.has(row.id), "duplicate ledger ID " + String(row.id))
		ids[row.id] = true
		expected += float(row.amount)
		if row.kind in ["auction-deposit", "auction-deposit-return"]:
			ledger_deposits -= float(row.amount)
		if row.kind in RECEIPT_KINDS:
			receipt_ledger[row.id] = float(row.amount)
		_verify(row.kind != "clearance", "route used emergency clearance")
	for event in shop.state.auctionNights.entries:
		held_deposits += int(event.deposit)
	for receipt in shop.state.shopJournal.receipts:
		for entry in receipt.entries:
			if receipt_ledger.has(entry.ledgerId):
				_verify(is_equal_approx(float(receipt_ledger[entry.ledgerId]), float(entry.cashImpact)), "receipt differs from ledger " + String(entry.ledgerId))
				_verify(not matched.has(entry.ledgerId), "multiple receipts for ledger " + String(entry.ledgerId))
				matched[entry.ledgerId] = true
	_verify(receipt_ledger.size() == matched.size(), "one or more business ledger rows lack an original receipt")
	_verify(is_equal_approx(expected, float(shop.state.cash)), "starting cash plus ledger differs from closing cash")
	_verify(is_equal_approx(ledger_deposits, float(held_deposits)), "refundable auction balances differ from the ledger")
	return {"expectedCash":expected, "expectedDeposits":ledger_deposits, "heldDeposits":held_deposits, "ledgerRows":ids.size(), "receipts":shop.state.shopJournal.receipts.size()}
