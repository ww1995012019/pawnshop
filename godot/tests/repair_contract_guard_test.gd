extends SceneTree
## Contract approval gates the visible workbench before physical work begins.
const Contracts = preload("res://scripts/model/service_contracts.gd")
var failures := 0

func _initialize() -> void: call_deferred("run")

func check(ok: bool, label: String) -> void:
	print("REPAIR CONTRACT ","PASS " if ok else "FAIL ",label)
	if not ok: failures += 1

func frames() -> void:
	for i in 12: await process_frame

func run() -> void:
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state = Model.create("CONTRACT-WORKBENCH-UI")
	game.state.inventory = []
	game.state.cash = 10000
	game.state.ap = 100
	for id in game.state.materials: game.state.materials[id] = 50
	var offer: Dictionary = Contracts.contracts(game.state)[0]
	game.dispatch({"type":"TAKE_SERVICE_CONTRACT","id":offer.id})
	var uid: String = Contracts.contracts(game.state)[0].uid
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	shell.go("repair",uid)
	await frames()
	var page = shell.active_shell().page
	var blocked: String = Contracts.work_problem(game.state,game.item(uid))
	check(page.task == "dust" and blocked.contains("报价"),"accepted contract starts with cleaning behind the approval gate")
	check(page._cleaning_problem() == blocked and page._current_problem() == blocked,"cleaning and repair use the reducer's approval reason")
	check(page.action_button.disabled and page.instruction.text.contains(blocked) and page.hint_text() == blocked,"unapproved cleaning disables its action and explains the guard in guidance and hint")
	var cleaning_before: Dictionary = page.cleaning.serialize().duplicate(true)
	var money_before: float = game.state.cash
	var ap_before: float = game.state.ap
	page._wipe_uv(Vector2(0.1,0.1),Vector2(0.9,0.9),0.3)
	check(page.cleaning.serialize() == cleaning_before and game.state.cash == money_before and game.state.ap == ap_before,"blocked wiping cannot create local progress or spend resources")
	page.open_refurb("blow")
	await frames()
	check(page._current_problem() == blocked and page.action_button.disabled and page.art.interaction_targets().is_empty() and page.instruction.text.contains(blocked),"unapproved exterior work disables physical targets with the same reason")
	page.confirm_repair()
	await frames()
	check(not game.item(uid).service.finished and not game.item(uid).repaired,"direct finish cannot bypass contract approval or complete the original")
	game.dispatch({"type":"CHECK","uid":uid,"tool":"TOL-001"})
	game.dispatch({"type":"QUOTE_SERVICE_CONTRACT","id":offer.id,"price":offer.budget+1})
	await frames()
	check(page._current_problem() == blocked and page.action_button.disabled,"declined quote leaves physical work visibly blocked")
	game.dispatch({"type":"QUOTE_SERVICE_CONTRACT","id":offer.id,"price":offer.budget})
	page.open_service()
	await frames()
	check(page._cleaning_problem() == "" and page._current_problem() == "" and not page.action_button.disabled and not page.instruction.text.contains(blocked),"approved quote unlocks the original cleaning operation")
	var approved: Dictionary = game.state.duplicate(true)
	game.state.day = int(offer.dueDay)+1
	Contracts.ensure(game.state)
	page._refresh_after_change()
	await frames()
	check(page._cleaning_problem() == "" and not page.action_button.disabled,"previously approved expired work remains closable without another approval")
	game.state = approved.duplicate(true)
	game.dispatch({"type":"SERVICE_BEGIN","uid":uid})
	game.dispatch({"type":"SERVICE_PROGRESS","uid":uid,"task":"dust","progress":{"complete":true,"opened":false}})
	game.dispatch({"type":"SERVICE_COMPLETE","uid":uid,"task":"dust"})
	var next_task: String = WatchService.current(game.item(uid))
	game.dispatch({"type":"SERVICE_PROGRESS","uid":uid,"task":next_task,"progress":{"step":1,"opened":true,"complete":false}})
	game.state.day = int(offer.dueDay)+1
	Contracts.ensure(game.state)
	var original_before: Dictionary = game.item(uid).duplicate(true)
	game.dispatch({"type":"RETURN_SERVICE_CONTRACT","id":offer.id})
	check(game.item(uid) != null and game.item(uid) == original_before and not game.item(uid).service.finished,"returning an expired open movement cannot force completion or remove its original")
	game.state = approved.duplicate(true)
	for entry in game.state.serviceContracts.entries:
		if entry.id == offer.id:
			entry.status = "expired"
			entry.quote = 0
	page.open_service()
	await frames()
	check(page._cleaning_problem() == blocked and page.action_button.disabled,"expired work without an approved quote remains blocked")
	var original: Dictionary = game.item(uid)
	original.serviceJobId = "missing-contract"
	page._stage_ui()
	page._refresh_info()
	check(page._cleaning_problem().contains("登记缺失") and page.action_button.disabled,"missing contract registration is explained before physical work")
	game.state = Model.create("ORDINARY-WORKBENCH")
	page._select(game.state.inventory[0].uid)
	await frames()
	check(page._cleaning_problem() == "" and not page.action_button.disabled,"ordinary owned cleaning still follows its existing availability")
	shell.queue_free()
	await frames()
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop()
		player.stream = null
	await process_frame
	print("REPAIR CONTRACT failures=",failures)
	quit(1 if failures else 0)
