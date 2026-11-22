extends "res://tests/night_crime_ui_test.gd"

const Visits = preload("res://tests/counter_lifecycle_fixture.gd")
const Commerce = preload("res://scripts/model/commerce.gd")

func counter(state: Dictionary, phone: bool):
	var game = root.get_node("Game")
	game.state = state
	root.size = Vector2i(844,390) if phone else Vector2i(1440,900)
	var shell = load("res://main.tscn").instantiate()
	shell.phone_override = phone
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	return shell

func has_portrait(view: Node, id: String) -> bool:
	var art = load("res://scripts/ui/counter_dialogue_layout.gd")
	for image in view.find_children("*", "TextureRect", true, false):
		if image.is_visible_in_tree() and image.texture == art.portrait(id): return true
	return false

func patrol_case(state: Dictionary, phone: bool, reduced: bool) -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = reduced
	var shell = await counter(state, phone)
	var page = shell.page
	var companion = load("res://scripts/app/web_touch.gd").new()
	shell.add_child(companion)
	companion.setup(shell)
	var mobile = page.find_child("LandscapeCounter", true, false)
	var view = page.strict_view
	var trade_id: String = state.trade.id
	var npc_id: String = state.trade.npcId
	if game.state.police.paper.visible: shell.toggle_wanted_notice()
	var cash: float = game.state.cash
	game.dispatch({"type":"REPORT_VISITOR", "tradeId":trade_id})
	game.dispatch({"type":"REPORT_VISITOR", "tradeId":trade_id})
	await create_timer(.14).timeout
	var prefix := ("phone " if phone else "desktop ") + ("reduced " if reduced else "full ")
	var status: Dictionary = companion.snapshot()
	check(status.notice == page.patrol_detail and status.get("visitor", "") == page.patrol_status and status.cash == cash and not status.can_arrive, prefix+"text controls mirror the checking phase and the unsettled balance")
	check(shell.toast_box.get_child_count()==0, prefix+"previous counter messages clear during verification")
	check(page.busy, prefix+"checking has a readable locked phase")
	if phone:
		check("核对" in mobile.primary.text and "接待" not in mobile.speech_copy.text and mobile.primary.disabled, prefix+"copy and control agree during verification")
	else:
		check("核对" in view.item_name.text and "等待来客" not in view.item_meta.text, prefix+"counter shows the incident")
		check(has_portrait(view, npc_id) and has_portrait(view, WantedCases.OFFICER_ID), prefix+"both people visible on the painted counter")
	check("已带走" not in text_of(shell.toast_box) and "已入账" not in text_of(shell.toast_box), prefix+"outcome does not appear during verification")
	var result_seen := false
	var elapsed := 0.0
	while page.busy and elapsed < 12:
		var caption: String = mobile.speech_copy.text if phone else view.item_meta.text
		if ("放行" in caption if not game.state.police.lastResult.arrested else "120 Cr" in caption):
			status = companion.snapshot()
			result_seen = status.notice == page.patrol_detail and status.cash == game.state.cash and not status.can_arrive
			if not game.state.police.lastResult.arrested and game.state.police.falseReports >= 3 and game.state.police.lastResult.fine == 0:
				result_seen = result_seen and "0 Cr" in caption and "提醒" not in caption
		await create_timer(.1).timeout
		elapsed += .1
	check(result_seen, prefix+"communicates reward or release before reopening")
	check(not page.busy and game.state.police.reports.size()==1, prefix+"counter reopens after one report")
	var result: Dictionary = game.state.police.lastResult
	check(game.state.cash == cash + result.reward - result.fine and game.state.ap == state.ap, prefix+"reward or fine posted once")
	shell.queue_free()
	await frames()

func run() -> void:
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	var merchant := Model.create("EVENT-PRESENTATION")
	merchant.cursor = 4
	merchant = Commerce.reduce(merchant, {"type":"ARRIVE"})
	var shell = await counter(merchant, true)
	var mobile = shell.page.find_child("LandscapeCounter", true, false)
	check("补给" in mobile.item_name.text and "工具鉴定" not in mobile.hint.text, "merchant table connects the work surface to supplies")
	check("本店库存" in mobile.goods.text and ("补给" in mobile.primary.text or "商品" in mobile.primary.text), "visitor stock and shop stock have distinct entrances")
	shell.queue_free()
	await frames()
	var officer := WantedCases.new_officer_trade(merchant)
	merchant.trade = officer
	check("名单" in WantedCases.dialogue(merchant,"goods"), "wanted officer discusses the list")
	officer.inspectionVisit = true
	check("赃物" in WantedCases.dialogue(merchant,"goods") and "名单" not in WantedCases.dialogue(merchant,"goods"), "inspection officer discusses inventory rules")
	var fixture: Dictionary = Fixture.build()
	var morning := Commerce.reduce(fixture.insured_report, {"type":"NEXT"})
	shell = await counter(morning, true)
	shell._poll_night_report()
	await frames()
	var scroll = shell.modal_layer.find_child("ModalScroll", true, false)
	var ack := button(shell, "确认夜间记录")
	var pinned_summary: Label
	if scroll != null:
		for label in shell.modal_layer.find_children("*", "Label", true, false):
			if not scroll.is_ancestor_of(label) and "2 件" in label.text and "189 Cr" in label.text: pinned_summary = label
	check(pinned_summary!=null, "loss count and paid total remain visible above scrolling records")
	check(ack!=null and scroll!=null and not scroll.is_ancestor_of(ack) and root.get_visible_rect().encloses(ack.get_global_rect()), "morning acknowledgement always visible on landscape phone")
	root.size = Vector2i(568,320)
	await frames()
	if pinned_summary!=null and ack!=null and scroll!=null:
		var first_rect: Rect2 = pinned_summary.get_global_rect()
		var action_rect: Rect2 = ack.get_global_rect()
		scroll.scroll_vertical = 1000
		await frames()
		check(scroll.scroll_vertical>0 and first_rect==pinned_summary.get_global_rect() and action_rect==ack.get_global_rect() and root.get_visible_rect().encloses(action_rect), "small phone scrolls item detail while summary and confirmation remain on screen")
		var paid: float = game.state.cash
		await click(ack)
		check(not shell.modal_open() and NightCrime.pending_morning(game.state).is_empty() and game.state.cash==paid, "tap acknowledges the loss without repeating the payment")
	shell.queue_free()
	await frames()
	var cases: Dictionary = Visits.build()
	await patrol_case(cases.arrest, false, false)
	await patrol_case(cases.arrest.duplicate(true), true, false)
	await patrol_case(cases.false_report, true, true)
	var empty_till: Dictionary = cases.false_report.duplicate(true)
	empty_till.cash = 0
	await patrol_case(empty_till, false, true)
	print("SPECIAL EVENT PRESENTATION failures=",failures)
	quit(1 if failures else 0)
