extends SceneTree

const Guide = preload("res://scripts/ui/opening_counter_guide.gd")
var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, caption: String) -> void:
	print("OPENING ", "PASS " if ok else "FAIL ", caption)
	if not ok: failures += 1

func frames() -> void:
	for i in 8: await process_frame

func run() -> void:
	var game = root.get_node("Game")
	game.new_game("FIRST-DAY-GUIDE", "story90")
	check(Guide.first_counter(game.state), "opening prompt before first arrival")
	game.dispatch({"type":"ARRIVE"})
	var originals: Array = TradeSession.session(game.state).goods
	var uid: String = originals[0].uid
	check(not Guide.first_counter(game.state) and Guide.inspect_original(game.state), "inspect the original on arrival")
	game.dispatch(CounterDialogue.action_for(game.state, "COUNTER_FOCUS", {"uid":originals[1].uid}))
	check(not Guide.inspect_original(game.state), "comparison watch has ordinary actions")
	game.dispatch(CounterDialogue.action_for(game.state, "COUNTER_FOCUS", {"uid":uid}))
	game.dispatch({"type":"CHECK", "uid":uid, "tool":"TOL-001"})
	check(not Guide.inspect_original(game.state), "recorded evidence restores ordinary actions")
	game.new_game("FIRST-DAY-GUIDE", "legacy21")
	game.dispatch({"type":"ARRIVE"})
	check(not Guide.inspect_original(game.state), "ordinary shop stays outside the story prompt")
	root.size = Vector2i(1440,900)
	game.has_save = false
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	var story = shell.title.find_child("start_campaign_90", true, false)
	story.pressed.emit()
	await create_timer(.75).timeout
	await frames()
	var view = shell.page.strict_view
	check(view.bell_caption.is_visible_in_tree() and not shell.get_meta("opening_bell_pending",true), "fresh desktop finishes its single bell cue")
	view.bell_caption.pressed.emit()
	await create_timer(.8).timeout
	await frames()
	var original_uid: String = game.state.trade.campaignOpeningUid
	check(view.ticket_inspect.is_visible_in_tree() and view.ticket_uid == original_uid and view.ticket_inspect.text == Guide.INSPECT_CAPTION, "desktop ticket guides inspection of the original")
	check(view.ticket_offer.is_visible_in_tree(), "desktop quote remains available")
	root.size = Vector2i(844,390)
	shell.phone_override = true
	shell._fit()
	await frames()
	var mobile = shell.page.find_child("LandscapeCounter", true, false)
	check(mobile.primary.is_visible_in_tree() and mobile.primary.text == Guide.INSPECT_CAPTION, "phone primary matches desktop ticket")
	check(mobile.opening_quote.is_visible_in_tree(), "free negotiation remains next to the phone action menu")
	mobile.opening_quote.pressed.emit()
	await frames()
	check(shell.modal_open(), "free negotiation opens the normal quote sheet")
	shell.close_top_modal()
	await create_timer(.4).timeout
	mobile.primary.pressed.emit()
	await frames()
	check(shell.workspace_open() and shell.workspace_shell.page.it_uid == original_uid, "phone primary opens the correct watch")
	shell.close_workspace()
	await frames()
	shell.queue_free()
	await frames()
	quit(1 if failures else 0)
