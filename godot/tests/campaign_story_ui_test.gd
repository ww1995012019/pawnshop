extends SceneTree

const WINDOW := "CW-02"
var failures := 0

func _initialize() -> void:
	call_deferred("run")

func frames() -> void:
	for frame in 8:
		await process_frame

func check(ok: bool, detail: String) -> void:
	print("CAMPAIGN UI ","PASS " if ok else "FAIL ",detail)
	if not ok:
		failures += 1

func receipt(shell: Node) -> Button:
	for key in shell.page.find_children("campaign_story_ticket","Button",true,false):
		if key.is_visible_in_tree():
			return key
	return null

func click(key: Button) -> void:
	var point := key.get_viewport().get_screen_transform() * key.get_global_transform_with_canvas() * (key.size * .5)
	var motion := InputEventMouseMotion.new()
	motion.position = point
	Input.parse_input_event(motion)
	for down in [true,false]:
		var event := InputEventMouseButton.new()
		event.position = point
		event.global_position = point
		event.button_index = MOUSE_BUTTON_LEFT
		event.pressed = down
		Input.parse_input_event(event)
		await frames()

func run() -> void:
	var game := root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.new_game("CAMPAIGN-RECEIPT-UI","story90")
	game.dispatch({"type":"SETTLE"})
	game.dispatch({"type":"NEXT"})
	check(int(game.state.day) == 2 and game.state.phase == "open","test opens the first letter's window through normal day transitions")
	var shell: Node = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	var stock: Dictionary = game.state.duplicate(true)
	for dimensions in [Vector2i(1440,900),Vector2i(844,390),Vector2i(568,320)]:
		shell.phone_override = dimensions.x < 1000
		root.size = dimensions
		await frames()
		var key := receipt(shell)
		check(key != null and not key.disabled,"current letter can be opened at %s" % str(dimensions))
		if key == null:
			continue
		var count := 0
		for copy in shell.page.find_children("campaign_story_ticket","Button",true,false):
			if copy.is_visible_in_tree():
				count += 1
		check(count == 1,"exactly one visible letter")
		await click(key)
		var scene: Control = shell.modal_layer.find_child("CampaignStoryScene",true,false)
		check(scene != null,"counter letter opens the story scene")
		if scene == null:
			continue
		var sheet: Control = shell.modal_layer.find_child("ModalSheet",true,false)
		var close: Button = sheet.find_child("modal_close",true,false)
		check(shell.safe_area().encloses(sheet.get_global_rect()) and sheet.get_global_rect().encloses(close.get_global_rect()),"scene and dismiss remain inside the view")
		check(scene.find_child("campaign_choice_note",true,false) != null,"scene exposes the model's note choice")
		var line: Label = scene.find_child("campaign_line",true,false)
		check(line != null and line.text.contains("船上的回收记录"),"letter uses the unseen first-visit dialogue")
		await click(close)
		check(not shell.modal_open() and receipt(shell) == key,"dismiss returns to the same counter receipt")
	check(game.state == stock,"reading and dismissing have no saved effects")
	var key := receipt(shell)
	if key != null:
		shell.open_shop_plan()
		await frames()
		var overview: Button = shell.modal_layer.find_child("open_campaign_scene",true,false)
		check(overview != null and not overview.disabled,"shop plan provides the same idle letter")
		if overview != null:
			await click(overview)
		var note: Button = shell.modal_layer.find_child("campaign_choice_note",true,false)
		check(note != null,"shop plan opens the shared scene after closing its sheet")
		if note != null:
			await click(note)
			check(game.state.campaignStory.decisions.get(WINDOW,{}).get("choiceId","") == "note","explicit selection saves one decision")
			check(receipt(shell) == null and not shell.modal_open(),"selection clears the active letter and closes the scene")
			for field in ["cash","ap","cursor","inventory","ledger"]:
				check(game.state[field] == stock[field],"story choice leaves %s intact" % field)
			shell.open_story_book()
			await frames()
			var file: Button = shell.modal_layer.find_child("story_filter_campaign",true,false)
			check(file != null and file.is_visible_in_tree(),"recorded campaign has a tab in the casebook")
			if file != null:
				await click(file)
				check(shell.modal_layer.find_child("campaign_history_" + WINDOW,true,false) != null,"recorded letter is available from the casebook")
			shell.close_top_modal()
			await frames()
	game.state = Model.reduce(stock,{"type":"ARRIVE"})
	shell.go("counter")
	await frames()
	key = receipt(shell)
	check(game.state.trade != null and key != null and key.disabled,"a live trade keeps the notice visible and blocks reading")
	shell.open_campaign_scene(WINDOW)
	check(not shell.modal_open(),"shell guard also blocks direct open during the trade")
	game.state = stock.duplicate(true)
	game.state.day = 3
	NightCrime.ensure_day(game.state)
	game.state.nightCrime.days["3"].inspection = true
	shell.go("counter")
	await frames()
	check(receipt(shell) == null,"pending police inspection takes priority over the counter letter")
	shell.open_campaign_scene(WINDOW)
	check(not shell.modal_open(),"shell guard also blocks direct open before the inspection")
	shell.queue_free()
	await frames()
	await check_original_links(game)
	quit(1 if failures else 0)

func check_original_links(game: Node) -> void:
	game.new_game("STORY90-ORBITAL","story90")
	game.dispatch({"type":"ARRIVE"})
	var uid: String = game.state.campaignStory.opening.uid
	game.dispatch(CounterDialogue.action_for(game.state,"ACCEPT"))
	game.dispatch(CounterDialogue.action_for(game.state,"DELIVER"))
	game.dispatch({"type":"REFUSE"})
	check(Model.find_inventory(game.state,uid) != null,"link fixture bought the exact watch")
	game.state.day = 22
	var shell: Node = load("res://main.tscn").instantiate()
	shell.phone_override = true
	root.size = Vector2i(844,390)
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	var before: Dictionary = game.state.duplicate(true)
	var key := receipt(shell)
	check(key != null,"day 22 revisit has a counter letter")
	if key != null:
		await click(key)
		var line: Label = shell.modal_layer.find_child("campaign_line",true,false)
		check(line != null and line.text.contains("你手上那只停走的北辰"),"holding the original changes the visible day 22 dialogue")
		var inspect: Button = shell.modal_layer.find_child("campaign_navigation_inspect",true,false)
		check(inspect != null,"owned original has an appraisal link")
		if inspect != null:
			check(link_label_fits(inspect), "the mobile appraisal link shows its full label and can be tapped")
			await click(inspect)
			check(shell.workspace_open() and shell.active_shell().page_name == "inspect" and game.focus_uid == uid,"appraisal opens on the exact story original")
			if shell.workspace_open():
				await click(shell.workspace_close)
				check(not shell.workspace_open() and receipt(shell) == key,"closing appraisal returns to the same counter letter")
		if not shell.modal_open():
			await click(key)
		var history: Button = shell.modal_layer.find_child("campaign_navigation_history",true,false)
		check(history != null,"an actual payment has a receipt link")
		if history != null:
			check(link_label_fits(history), "the mobile receipt link shows its full label and can be tapped")
			await click(history)
			var plan: Control = shell.modal_layer.find_child("ShopPlan",true,false)
			check(plan != null and plan.section == "history" and plan.receipt_uid == uid,"receipt link filters the existing plan to the same UID")
	check(game.state == before,"navigating to appraisal and receipts leaves the scene unresolved")
	shell.queue_free()
	await frames()

func link_label_fits(key: Button) -> bool:
	var font := key.get_theme_font("font")
	var text_width := font.get_string_size(key.text, HORIZONTAL_ALIGNMENT_LEFT, -1, key.get_theme_font_size("font_size")).x
	return key.size.x >= text_width + 16.0 and key.size.y >= 44.0
