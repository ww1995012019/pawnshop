extends SceneTree
const Fixture = preload("res://tests/night_crime_fixture.gd")
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("NIGHT UI ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func frames() -> void:
	for i in 12: await process_frame
func button(node: Node, caption: String) -> Button:
	for b in node.find_children("*", "Button", true, false):
		if b.text == caption and b.is_visible_in_tree(): return b
	return null
func click(b: Button) -> void:
	if b == null: return
	var parent := b.get_parent()
	while parent != null:
		if parent is ScrollContainer: parent.ensure_control_visible(b)
		parent = parent.get_parent()
	await frames()
	var point := b.get_viewport().get_screen_transform() * b.get_global_transform_with_canvas() * (b.size * 0.5)
	var motion := InputEventMouseMotion.new(); motion.position = point; Input.parse_input_event(motion)
	for pressed in [true, false]:
		var e := InputEventMouseButton.new(); e.position=point; e.global_position=point; e.button_index=MOUSE_BUTTON_LEFT; e.pressed=pressed; Input.parse_input_event(e)
		await frames()
func text_of(node: Node) -> String:
	var out := ""
	for label in node.find_children("*", "Label", true, false): out += label.text + "\n"
	return out
func idle(page) -> void:
	var deadline := Time.get_ticks_msec()+6000
	while page.busy and Time.get_ticks_msec()<deadline: await process_frame
	await frames()
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion=true; game.prefs.sound=false
	var fixture: Dictionary = Fixture.build()
	game.state=fixture.before_insurance.duplicate(true)
	var shell = load("res://main.tscn").instantiate(); root.add_child(shell); await frames(); shell._close_title(); await frames()
	shell.go("report"); await frames()
	var buy := button(shell, "购买今晚保险")
	check(buy != null, "ledger provides real insurance purchase control")
	if buy == null:
		shell.queue_free(); await frames(); quit(1); return
	var before: float=game.state.cash
	var quote := NightCrime.insurance_quote(game.state)
	await click(buy)
	check(game.state.cash == before-quote.due, "native pointer purchases policy immediately")
	check(button(shell,"更新保障") != null, "policy update remains available")
	check(shell.has_method("open_night_report"), "persistent history has shell control")

	# Zero-cost update still confirms additional UID under the already paid minimum.
	var added := Model.new_item(game.state,"WCH-001",{"sourceVerified":true,"condition":0.1,"working":false})
	Model.put_in(game.state,added)
	shell.active_shell().page._refresh(); await frames()
	var update := button(shell,"更新保障")
	check(update != null and not update.disabled, "new UID can be confirmed even at zero incremental premium")
	before=game.state.cash
	await click(update)
	var covered := false
	for row in NightCrime.insurance_quote(game.state).items:
		if row.uid==added.uid: covered=row.covered
	check(covered and game.state.cash==before, "native update confirms zero-cost added coverage")
	for spec in [[0,3,"现金不足"],[10000,2,"第3至20天"]]:
		game.state=fixture.before_insurance.duplicate(true); game.state.cash=spec[0]; game.state.day=spec[1]
		shell.active_shell().page._refresh(); await frames()
		check(button(shell,"购买今晚保险").disabled and text_of(shell.active_shell().page).contains(spec[2]), "disabled insurance discloses reason: "+spec[2])
	game.state=fixture.insured_report.duplicate(true)
	shell.active_shell().page._refresh(); await frames()
	check(button(shell,"更新保障").disabled, "closed shop cannot update insurance")
	# Actual NEXT applies a saved two-item loss once and automatically opens the sheet.
	shell.go("counter"); await frames()
	game.dispatch({"type":"NEXT"}); await create_timer(3).timeout; await frames()
	check(shell.modal_open(), "actual NEXT automatically opens unread loss report")
	var printed := text_of(shell.modal_layer)
	for uid in fixture.meta.lossUIDs: check(printed.contains(uid), "morning lists each physical loss UID "+uid)
	check(printed.contains("陈列架") or printed.contains("后仓"), "location is human readable")
	check(not printed.contains("culprit") and not printed.contains("stolen"), "report prints public records without hidden truth")
	before=game.state.cash
	var stock: Array=game.state.inventory.duplicate(true)
	await click(button(shell,"确认夜间记录"))
	check(not shell.modal_open() and not game.state.nightCrime.reportOpen, "native ACK closes and persists acknowledgement")
	game.state=JSON.parse_string(JSON.stringify(game.state)); shell.queue_free(); await frames()
	shell=load("res://main.tscn").instantiate(); root.add_child(shell); await frames(); shell._close_title(); await frames()
	check(not shell.modal_open(), "acknowledged save does not reopen automatically")
	shell.go("report"); await frames(); await click(button(shell,"夜间失窃与查货记录"))
	check(shell.modal_open() and text_of(shell.modal_layer).contains(fixture.meta.lossUIDs[0]), "real history button reopens loss records")
	check(game.state.cash==before and game.state.inventory==stock, "history reopening neither pays nor removes items")
	await click(button(shell,"确认夜间记录")); shell.go("counter"); await frames()
	# Natural pending police schedule remains playable after six ordinary slots at 0 AP.
	game.state=fixture.inspection_pending.duplicate(true); shell.page._refresh(); await frames()
	await click(button(shell,"接待查货警察")); await idle(shell.page)
	check(game.state.trade != null and game.state.trade.get("inspectionVisit",false), "native arrival summons late inspector at 0 AP")
	await click(button(shell,"配合查货")); await idle(shell.page)
	check(game.state.trade==null and game.state.ap==0 and not game.state.nightCrime.lastInspection.is_empty(), "native inspection completes without AP")
	check(text_of(shell).contains("查货回执") and text_of(shell).contains("有效协警"), "inspection receipt prints actual outcome and cooperation")
	if shell.modal_open(): await click(button(shell,"确认夜间记录"))
	# A real unverified offer remains unchanged until the explicit risk confirmation.
	game.state=Fixture.fresh("UI-GRAY")
	game.state.trade={"id":"ui-gray","npcId":"CHR-002","kind":"buy","item":Model.new_item(game.state,"WCH-002",{"sourceVerified":false}),"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"回执暂缺，请核对来源。"}
	shell.go("counter"); await frames()
	before=game.state.cash
	await click(button(shell,"接受 100 Cr"))
	check(shell.modal_open() and not game.state.trade.locked and game.state.cash==before, "accepting unverified offer first displays risk without trading")
	await click(button(shell,"取消"))
	check(not game.state.trade.item.has("grayAuthorized"), "canceling risk sheet grants no authorization")
	await click(button(shell,"接受 100 Cr")); await click(button(shell,"承担风险并锁价")); await frames()
	check(game.state.trade.locked and game.state.trade.item.get("grayAuthorized","")==game.state.trade.id, "native risk confirmation authorizes and locks actual trade")
	var risk: float=game.state.risk
	await click(button(shell,"支付 100 Cr 并交割")); await idle(shell.page)
	check(game.state.trade==null and game.state.cash==before-100 and game.state.risk==risk+8, "native delivery completes gray purchase and adds eight risk")
	game.state=Fixture.fresh("UI-GRAY-OFFER")
	game.state.trade={"id":"ui-gray-offer","npcId":"CHR-002","kind":"buy","item":Model.new_item(game.state,"WCH-002",{"sourceVerified":false}),"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"回执暂缺。"}
	shell.go("counter"); await frames()
	var terms := Model.trade_terms(game.state,game.state.trade,game.state.trade.item)
	var selected_price := int(maxf(100,terms.floor))
	shell.page.dial.set_value(selected_price,false); shell.page._update_offer_value(selected_price)
	before=game.state.cash; risk=game.state.risk
	await click(button(shell,"出价 "+(Model.jnum(selected_price)+" Cr")))
	check(shell.modal_open() and not game.state.trade.locked, "native OFFER prompts source risk before lock")
	if shell.modal_open():
		await click(button(shell,"承担风险并锁价")); await frames()
		check(game.state.trade.locked and game.state.trade.price==selected_price and game.state.risk==risk, "confirmed OFFER preserves chosen price and defers risk charge")
		await click(button(shell,"支付 "+(Model.jnum(selected_price)+" Cr")+" 并交割")); await idle(shell.page)
		check(game.state.trade==null and game.state.cash==before-selected_price and game.state.risk==risk+8, "native OFFER route delivers once after consent")
	game.state=Fixture.fresh("UI-GRAY-SALE")
	var sale_item: Dictionary=game.state.inventory[0]
	sale_item.sourceVerified=false
	game.state.trade={"id":"ui-gray-sale","npcId":"CHR-002","kind":"sell","item":null,"price":60,"rounds":0,"locked":false,"evidenceUsed":[],"line":"我来选一件旧表。"}
	before=game.state.cash; risk=game.state.risk
	shell.queue_free(); await frames()
	shell=load("res://main.tscn").instantiate(); root.add_child(shell); await frames(); shell._close_title(); await frames()
	shell.go("warehouse",sale_item.uid); await frames()
	check(not text_of(shell.active_shell().page).contains("疑似赃物"), "unknown warehouse goods do not print hidden stolen verdict")
	await click(button(shell,"灰色收售"))
	check(shell.active_shell().modal_open(), "warehouse gray selection has actual risk dialog")
	await click(button(shell,"承担风险并选货")); await frames()
	check(game.state.trade.get("selectedUid","")==sale_item.uid and not shell.workspace_open(), "per-item consent selects original and returns to counter")
	var accept: Button=null
	for b in shell.page.actions.get_children():
		if b.text.begins_with("接受 "): accept=b
	await click(accept); await frames()
	var delivery: Button=null
	for b in shell.page.actions.get_children():
		if b.text.begins_with("收款 "): delivery=b
	await click(delivery); await idle(shell.page)
	check(game.state.trade==null and Model.find_inventory(game.state,sale_item.uid)==null and game.state.cash>before and game.state.risk==risk+8, "native warehouse gray sale completes actual payment and transfer")
	game.state=Fixture.resale_state()
	check(not game.state.is_empty(), "actual lost-original resale fixture exists")
	shell.go("counter"); await frames()
	var recovered_uid: String=game.state.trade.item.uid
	check(button(shell,"失物报警")==null, "model match does not reveal lost-item report before serial evidence")
	game.dispatch({"type":"CHECK","uid":recovered_uid,"tool":"TOL-002"}); await frames()
	check(button(shell,"失物报警")!=null, "serial evidence unlocks real lost-original report control")
	before=game.state.cash
	await click(button(shell,"失物报警")); await click(button(shell,"核对原编号并报警")); await idle(shell.page)
	check(game.state.trade==null and Model.find_inventory(game.state,recovered_uid)!=null and game.state.cash==before, "native loss report returns original without buying")
	check(game.state.nightCrime.cooperation.count==1 and text_of(shell).contains("有效协警"), "actual arrest grants one cooperation credit and visible case history")
	if shell.modal_open(): await click(button(shell,"确认夜间记录"))
	# The bounded sheet leaves its confirmation within desktop/short/mobile logical bounds.
	for extent in [Vector2i(1920,1080),Vector2i(1280,720),Vector2i(960,700)]:
		root.size=extent; root.content_scale_size=extent; await frames()
		shell.open_night_report(); await frames()
		var ack := button(shell,"确认夜间记录")
		check(root.get_visible_rect().encloses(ack.get_global_rect()), "night confirmation stays in viewport "+str(extent))
		for label in shell.modal_layer.find_children("*", "Label", true, false):
			if label.text.length()>10 and label.autowrap_mode != TextServer.AUTOWRAP_OFF: check(label.size.x>=160, "proportional report text has readable width")
		await click(ack)
	shell.queue_free(); await frames(); quit(1 if failures else 0)
