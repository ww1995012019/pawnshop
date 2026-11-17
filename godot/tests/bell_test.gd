extends SceneTree
var failures := 0
var arrivals := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("BELL ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func frame() -> void:
	await process_frame
	await process_frame
func run() -> void:
	# Use the desktop canvas when measuring the scene bell's real animation.
	root.size=Vector2i(1920,1080)
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = false
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frame()
	shell._close_title()
	game.new_game("bell-regression")
	await frame()
	game.changed.connect(func(_p, _n, a):
		if a.type == "ARRIVE": arrivals += 1)
	for method in ["_bell_clicked", "_ring"]:
		game.new_game("bell-regression")
		await frame()
		var page = shell.active_shell().page
		var bell = page.bell
		check(page.strict_view.bell_art.is_visible_in_tree(), method + " animates a visible bell")
		var original: Transform2D = bell.transform
		# Capture both lobes of each oscillation instead of aliasing a zero crossing.
		var wobble_samples:Array[Vector2]=[]
		var sample_wobble=func():
			if bell.motion!=null and bell.motion.is_valid():
				wobble_samples.append(Vector2(bell.motion.get_total_elapsed_time(),absf(bell.rotation)))
		process_frame.connect(sample_wobble)
		var before_count := arrivals
		if method == "_bell_clicked":
			page.fixture_buttons.bell.pressed.emit()
		else:
			var action: Button
			for button in page.actions.get_children():
				if button.text == "接待下一位来客": action = button
			check(action != null, "next-customer action is present")
			if action != null: action.pressed.emit()
		await create_timer(0.035).timeout
		# A timer can expire before a newly-created Tween receives its first tick.
		await process_frame
		check(arrivals == before_count + 1, method + " dispatches exactly one arrival")
		check(not bell.transform.is_equal_approx(original), method + " presses the same scene bell")
		var count := arrivals
		page._ring()
		page._bell_clicked()
		check(arrivals == count, "busy/trade rejects repeat arrival from both inputs")
		while bell.motion.is_valid() and bell.motion.get_total_elapsed_time()<0.47:
			await process_frame
		process_frame.disconnect(sample_wobble)
		var early_peak:=0.0
		var late_peak:=0.0
		for sample in wobble_samples:
			if sample.x>=0.05 and sample.x<0.255:early_peak=maxf(early_peak,sample.y)
			elif sample.x>=0.255 and sample.x<=0.455:late_peak=maxf(late_peak,sample.y)
		check(early_peak > 0.025 and late_peak > 0.006 and late_peak < early_peak, "painted bell wobbles with decreasing amplitude")
		await create_timer(0.50).timeout
		check(bell.transform.is_equal_approx(original), "damped bell returns exactly to its painted pose")
	game.new_game("bell-blocked")
	await frame()
	var page = shell.active_shell().page
	page.busy = true
	var count := arrivals
	page._ring()
	page._bell_clicked()
	check(arrivals == count and game.state.trade == null, "busy guard covers fixture and action entry points")
	page.busy = false
	page._workspace_suspended = true
	page._ring()
	page._bell_clicked()
	check(arrivals == count and game.state.trade == null, "blocked scene rejects both bell entry points")
	page._workspace_suspended = false
	game.prefs.reduced_motion = true
	var original: Transform2D = page.bell.transform
	page._ring()
	await create_timer(0.035).timeout
	check(page.bell.transform.is_equal_approx(original), "reduced motion rings without wobble or compression")
	shell.queue_free()
	await frame()
	print("BELL failures=", failures)
	quit(1 if failures else 0)
