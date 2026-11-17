extends SceneTree
## A phone tap emits mouse input as well as touch input. Rebuilding the quote
## form inside the mouse callback must not detach the touch-focus target before
## the paired touch release. The native runner's engine-error gate catches this.
var failures := 0
var approvals := 0

func _initialize() -> void: call_deferred("run")

func frames(count := 12) -> void:
	for index in count: await process_frame

func check(ok: bool, message: String) -> void:
	print("SHOP TOUCH ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1

func observed(_previous: Dictionary, _next: Dictionary, action: Dictionary) -> void:
	if action.get("type", "") == "QUOTE_SERVICE_CONTRACT": approvals += 1

func run() -> void:
	var game = root.get_node("Game")
	game.new_game("SHOP-TOUCH-LIFECYCLE")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state.inventory = []
	game.state.ap = 100
	game.state.cash = 10000
	game.ensure_shop_state(game.state)
	var contract: Dictionary = ServiceContracts.contracts(game.state)[0]
	var id: String = contract.id
	game.dispatch({"type":"TAKE_SERVICE_CONTRACT", "id":id})
	var uid: String = ServiceContracts.contracts(game.state)[0].uid
	game.dispatch({"type":"CHECK", "uid":uid, "tool":"TOL-001"})
	var cash: float = game.state.cash
	var ap: float = game.state.ap
	root.size = Vector2i(844,390)
	var shell = load("res://main.tscn").instantiate()
	shell.phone_override = true
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	shell.open_shop_plan("contracts")
	await frames()
	var submit: Button = shell.modal_layer.find_child("service_quote_submit_"+id,true,false)
	check(submit != null and not submit.disabled, "diagnosed original has an enabled quote submit control")
	if submit != null:
		var scroll: ScrollContainer = shell.modal_layer.find_child("ModalScroll",true,false)
		scroll.ensure_control_visible(submit)
		await frames()
		var point: Vector2 = root.get_final_transform() * submit.get_global_rect().get_center()
		check(scroll.get_global_rect().has_point(submit.get_global_rect().get_center()), "quote submit is inside the phone scroll viewport")
		game.changed.connect(observed)
		var original_emulation := Input.emulate_mouse_from_touch
		Input.emulate_mouse_from_touch = true
		for pressed in [true,false]:
			var event := InputEventScreenTouch.new()
			event.index = 0
			event.position = point
			event.pressed = pressed
			Input.parse_input_event(event)
			Input.flush_buffered_events()
			await frames(2)
		Input.emulate_mouse_from_touch = original_emulation
		await frames()
		var approved: Dictionary = ServiceContracts.contracts(game.state)[0]
		check(approvals == 1 and approved.status == "approved", "one physical phone tap approves exactly once")
		check(approved.quoteTerms.band == "standard" and approved.quoteTerms.trust == 1, "touch submits the standard default and frozen reward")
		check(game.state.cash == cash and game.state.ap == ap and game.item(uid) != null, "approval keeps cash, AP and original custody unchanged")
		check(shell.modal_layer.find_child("service_quote_submit_"+id,true,false) == null, "approved form refreshes after the input event")
		game.changed.disconnect(observed)
	shell.queue_free()
	await frames()
	print("SHOP TOUCH failures=",failures)
	quit(1 if failures else 0)
