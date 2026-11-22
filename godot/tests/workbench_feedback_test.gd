extends SceneTree

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func frames() -> void:
	for i in 8: await process_frame

func check(ok: bool, message: String) -> void:
	print("WORKBENCH FEEDBACK ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1

func instructions(panel: Control) -> String:
	var result := ""
	for label in panel.find_children("*", "Label", true, false):
		if label.is_visible_in_tree(): result += label.text + "\n"
	return result

func check_illuminated_serial(serial: Label) -> void:
	await RenderingServer.frame_post_draw
	var screen := serial.get_viewport().get_screen_transform() * serial.get_global_transform_with_canvas()
	# Sample the central two rows of digits, away from the steel rim and screws.
	var sample := Rect2i(screen * Rect2(serial.size * Vector2(.30,.36),serial.size * Vector2(.40,.28)))
	var image := root.get_texture().get_image()
	var luminance: Array[float] = []
	for y in range(sample.position.y,sample.end.y):
		for x in range(sample.position.x,sample.end.x):
			luminance.append(image.get_pixel(x,y).srgb_to_linear().get_luminance())
	luminance.sort()
	var ratio := (luminance[floori(luminance.size()*.99)]+.05)/(luminance[floori(luminance.size()*.01)]+.05)
	check(ratio>=4.5,"illuminated serial strokes and outlines retain 4.5:1 contrast (%.2f at %s)" % [ratio,sample])

func run() -> void:
	root.size = Vector2i(844,390)
	var game = root.get_node("Game")
	game.new_game("BENCH-FEEDBACK")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	var shell = load("res://main.tscn").instantiate()
	shell.phone_override = true
	root.add_child(shell)
	await frames()
	shell._close_title()
	var lot := Model.new_item(game.state, "WCH-002", {"condition":.9, "working":false, "sourceVerified":true})
	Model.put_in(game.state, lot)
	shell.go("inspect", lot.uid)
	await frames()
	var page = shell.active_shell().page
	page._set_tool("TOL-001")
	page.optical_pin_button.pressed.emit()
	page._record()
	await frames()
	var estimate := Model.estimate(game.item(lot.uid))
	var interval := "%s–%s Cr" % [Model.jnum(estimate.low), Model.jnum(estimate.high)]
	check(shell.workspace_title.text.contains(interval), "phone confirmation displays both ends of the recorded estimate")
	check(not page.optical_pin_button.tooltip_text.contains("定位"), "pinned instrument stops advertising the pin action")
	page._set_tool("TOL-002")
	await frames()
	check(not page.finding_panel.visible and not page.compact_finding.visible, "switching tools clears the previous tool's finding from the mat")
	page.flip_item()
	page.optical_pin_button.pressed.emit()
	await frames()
	check(instructions(page.bench_body).contains("翻") and instructions(page.bench_body).contains("后盖"), "UV on the front tells the player to flip to the back")
	page.flip_item()
	await frames()
	check(not instructions(page.bench_body).contains("翻"), "returning to the rear restores active observation instructions")
	var serial: Label = page.item.reveal
	var field := Rect2(serial.position, serial.size * serial.scale)
	var side: float = page.item.tex_size().x
	check(Rect2(-side*.20,-side*.15,side*.40,side*.35).encloses(field), "UV serial fits inside the rear plate (%s on %.1f px)" % [field,side])
	check(serial.get_line_count() > 1 and serial.text == WatchRules.serial(game.item(lot.uid)), "legible serial wraps on the plate without changing its value")
	shell.go("repair", lot.uid)
	await frames()
	var owner = shell.active_shell()
	page = owner.page
	var inspect: Button
	for key in page.bench.find_children("*", "Button", true, false):
		if key.text == "鉴定": inspect = key
	check(is_instance_valid(inspect) and inspect.size.x*owner.touch_scale()>=43.99 and inspect.size.y*owner.touch_scale()>=43.99, "repair-to-inspection key retains a visible 44 CSS pixel touch target")
	page.art.advance()
	await create_timer(.9).timeout
	var action: Button = page.action_button
	var space := action.size - action.get_theme_stylebox("normal").get_minimum_size()
	var font := action.get_theme_font("font")
	var font_size := action.get_theme_font_size("font_size")
	var natural := font.get_string_size(action.text,HORIZONTAL_ALIGNMENT_LEFT,-1,font_size)
	var wrapped := font.get_multiline_string_size(action.text,HORIZONTAL_ALIGNMENT_LEFT,space.x,font_size)
	check(natural.x<=space.x or (action.autowrap_mode!=TextServer.AUTOWRAP_OFF and wrapped.y<=space.y+1), "the complete next operation fits beside that key (%s in %s)" % [action.text,space])
	var controls: Rect2 = page.bench.get_rect()
	check(owner.content_rect().encloses(controls) and page.guidance.get_rect().end.y+6<=controls.position.y, "wrapped action row and guidance fit together within the drawer")
	shell.close_workspace()
	root.size = Vector2i(1440,900)
	shell.phone_override = false
	shell._fit()
	await frames()
	if DisplayServer.get_name() != "headless":
		shell.go("inspect",game.state.inventory[0].uid)
		await frames()
		page = shell.active_shell().page
		page._set_tool("TOL-002")
		page.optical_pin_button.pressed.emit()
		await create_timer(1.1).timeout
		await check_illuminated_serial(page.item.reveal)
		shell.close_workspace()
		await frames()
	shell.go("repair", lot.uid)
	await frames()
	owner = shell.active_shell()
	page = owner.page
	page.art.advance()
	await create_timer(.9).timeout
	check(page.art.progress_snapshot().step == 2, "the next physical contact resumes the saved procedure")
	check(owner.hint_label.text == page.art.hint_text(), "desktop footer matches the next tool and contact point")
	shell.queue_free()
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop()
		player.stream = null
	await frames()
	quit(1 if failures else 0)
