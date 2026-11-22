extends "res://tests/night_crime_ui_test.gd"

const Commerce = preload("res://scripts/model/commerce.gd")
var game: Node

func opening() -> Dictionary:
	var state := Model.create("COUNTER-QUOTE-UI")
	var watch := Model.new_item(state, "WCH-001", {"owner":"npc", "sourceVerified":true, "condition":0.65})
	watch.evidence = ["TOL-001"]
	Model.record_inspection(watch, "TOL-001")
	state.trade = {"id":"counter-test", "npcId":"CHR-004", "kind":"buy", "item":watch,
		"price":80, "rounds":0, "locked":false, "evidenceUsed":[], "line":"请验货。"}
	# JSON-round-tripped single-item saves predate the session/quick-list UI.
	return CounterDialogue.begin(JSON.parse_string(JSON.stringify(state)))

func mount(state: Dictionary, phone: bool):
	game.state = state
	root.size = Vector2i(844,390) if phone else Vector2i(1920,1080)
	var shell = load("res://main.tscn").instantiate()
	shell.phone_override = phone
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	return shell

func run() -> void:
	game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	await quote()
	await sendoff(false)
	await sendoff(true)
	print("TRADE QUOTE/SENDOFF failures=", failures)
	quit(1 if failures else 0)

func quote() -> void:
	var shell = await mount(opening(), false)
	var desk = shell.page
	var uid: String = game.state.trade.session.focus
	var list = desk.strict_view.quick_list
	var sale_name := WatchForgery.sale_name(TradeSession.item(game.state, uid))
	for control in [list.row_views[uid].inspect, list.row_views[uid].offer, list.row_views[uid].choose, list.row_views[uid].more]:
		check(control.accessibility_name.contains(sale_name), "each row action identifies its original")
	await click(list.row_views[uid].offer)
	var edit: LineEdit = list.find_child("QuickOfferValue", true, false)
	check(edit.accessibility_name.contains("报价") and edit.virtual_keyboard_type == LineEdit.KEYBOARD_TYPE_NUMBER, "the quote editor has a spoken price name and numeric keyboard")
	check(list.popup.find_children("*", "Button", true, false).any(func(b): return b.accessibility_name == "关闭议价"), "the icon-only quote close button has a spoken name")
	edit.text = "81"
	game.dispatch({"type":"ASK_VISITOR", "tradeId":game.state.trade.id, "topic":"identity"})
	await frames()
	var chip: Button = list.find_child("QuickEvidence_TOL-001", true, false)
	await click(chip)
	check(edit.text == "81" and desk.chosen_evidence == "TOL-001" and text_of(list.popup).contains(Model.displayed_clue(TradeSession.item(game.state, uid), "TOL-001")), "after ambient dialogue the evidence preview and typed price belong to this open quote")
	game.dispatch({"type":"ASK_VISITOR", "tradeId":game.state.trade.id, "topic":"origin"})
	await frames()
	await click(list.find_child("QuickOfferSubmit", true, false))
	var line := TradeSession.row(game.state, uid)
	check(line.selected and line.context.price == 81 and line.context.evidenceUsed.has("TOL-001"), "the submitted original keeps both its 81 Cr draft and its selected evidence through another reply")
	check(not game.state.trade.line.contains("出示") and game.state.notice.contains("标识") and game.state.notice.contains("出示") and shell.toast_box.get_children().any(func(b): return b.get_meta("message", "") == game.state.notice), "the evidence acknowledgement is a visible shop notice and the customer speaks only their reply")
	check(list.row_views[uid].offer.disabled and desk.strict_view.ticket_offer.disabled, "both quote entry points reflect the locked price")
	check(list.row_views[uid].choose.accessibility_name.contains("取消锁价"), "the focused original tells assistive technology how to unlock")
	await click(list.row_views[uid].choose)
	check(not TradeSession.row(game.state, uid).selected and not list.row_views[uid].offer.disabled and not desk.strict_view.ticket_offer.disabled, "unlocking this original makes both quote entries available again")
	await click(desk.strict_view.ticket_offer)
	edit = list.find_child("QuickOfferValue", true, false)
	check(edit != null and edit.editable, "the table ticket reopens an editable quote after unlocking")
	list.close_popup()
	shell.queue_free()
	await frames()

func request_departure(shell, phone: bool) -> void:
	if phone:
		await click(shell.page.find_child("landscape_more", true, false))
		await click(button(shell.modal_layer, "送客"))
	else:
		await click(shell.page.strict_view.quick_list.sendoff)
	await frames()

func sendoff(phone: bool) -> void:
	var state := opening()
	var first: String = state.trade.session.focus
	var own_watch: Dictionary = state.inventory[0]
	own_watch.sourceVerified = true
	own_watch.working = true
	own_watch.condition = 1.0
	state = Commerce.reduce(state, CounterDialogue.action_for(state, "ACCEPT"))
	state = Commerce.reduce(state, {"type":"SELECT_TRADE", "uid":own_watch.uid})
	TradeSession.row(state, own_watch.uid).context.price = 12
	state = Commerce.reduce(state, CounterDialogue.action_for(state, "ACCEPT"))
	check(TradeSession.summary(state).expense == 80 and TradeSession.summary(state).income == 12, "fixture has two mixed locked originals")
	var shell = await mount(state, phone)
	var before_cash: float = game.state.cash
	var before_ap: float = game.state.ap
	var inventory: Array = game.state.inventory.duplicate(true)
	await request_departure(shell, phone)
	check(game.state.trade != null and shell.modal_open(), "sendoff with locks awaits an explicit answer on "+str(root.size))
	if shell.modal_open() and game.state.trade != null:
		var terms := text_of(shell.modal_layer)
		check(terms.contains("2 件") and terms.contains("80 Cr") and terms.contains("12 Cr") and terms.contains("68 Cr"), "the confirmation identifies count, gross payments and net")
		await click(button(shell.modal_layer, "返回继续商谈"))
		check(not shell.modal_open() and TradeSession.row(game.state, first).selected and TradeSession.row(game.state, own_watch.uid).selected, "returning to the desk retains both agreed prices")
		if not phone:
			await request_departure(shell, false)
			game.dispatch(CounterDialogue.action_for(game.state, "COUNTER_UNSELECT"))
			await click(button(shell.modal_layer, "放弃约定并送客"))
			check(game.state.trade != null and TradeSession.summary(game.state).buy_count == 1, "an old confirmation cannot dismiss the visitor after an agreement changes")
		await request_departure(shell, phone)
		await click(button(shell.modal_layer, "放弃约定并送客"))
		check(game.state.trade == null and game.state.cash == before_cash and game.state.ap == before_ap and game.state.inventory == inventory, "explicitly abandoning ends the visit without settlement")
	await idle(shell.page)
	shell.queue_free()
	await frames()
	shell = await mount(opening(), phone)
	await request_departure(shell, phone)
	check(game.state.trade == null and not shell.modal_open(), "visits without locked originals still end on the first click")
	await idle(shell.page)
	shell.queue_free()
	await frames()
