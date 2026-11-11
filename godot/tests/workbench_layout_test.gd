extends SceneTree
## Check visible geometry as well as real pointer interaction in the drawer.
var failures := 0
var shell

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, message: String) -> void:
	print("LAYOUT ", "PASS " if ok else "FAIL ", message)
	if not ok:
		failures += 1

func settle() -> void:
	for i in 8:
		await process_frame

func check_workbench(page, label: String) -> void:
	var active = shell.active_shell()
	var r: Rect2 = active.content_rect()
	var left: Control = page.instrument_panel if active.page_name == "inspect" else page.get("list_panel")
	var right: Control = page.detail_panel if active.page_name == "inspect" else page.get("detail_panel")
	var bench: Control = page.bench if active.page_name == "inspect" else page.get("bench")
	if active.landscape_mode():
		check(r.encloses(bench.get_rect()),label+" mobile action controls stay inside the drawer")
		var surface: Rect2 = page.mat_rect
		check(r.encloses(surface),label+" mobile live surface stays inside the drawer")
		check(not surface.intersects(bench.get_rect()),label+" mobile controls do not cover the live surface")
		if active.page_name == "repair": check(page.art.wide_layout,label+" uses the wide physical work surface")
		return
	check(left != null and right != null and bench != null, label + " exposes all three columns")
	if left == null or right == null or bench == null:
		return
	check(is_equal_approx(left.position.y, r.position.y) and is_equal_approx(left.get_rect().end.y, r.end.y), label + " left column shares top and bottom edges")
	check(is_equal_approx(right.position.y, r.position.y) and is_equal_approx(right.get_rect().end.y, r.end.y), label + " right column shares top and bottom edges")
	check(r.encloses(bench.get_rect()) and bench.position.x >= left.get_rect().end.x + 15 and bench.get_rect().end.x <= right.position.x - 15, label + " controls stay inside the middle column")
	var mat = page.get("mat_rect")
	check(mat is Rect2, label + " has an explicit item surface")
	if mat is Rect2:
		check(r.encloses(mat) and not mat.intersects(bench.get_rect()) and is_equal_approx(mat.position.y, r.position.y), label + " item surface is aligned and clear of controls")
	var item = page.item
	if is_instance_valid(item) and item.visible:
		var transform: Transform2D = active.get_viewport().get_canvas_transform() * item.body.global_transform
		var art: Rect2 = transform * Rect2(-item.tex_size() * 0.5, item.tex_size())
		check(not art.intersects(bench.get_global_rect()) and art.position.x > left.get_global_rect().end.x and art.end.x < right.global_position.x, label + " whole item is visible between the panels")
		if mat is Rect2:
			check(mat.encloses(art), label + " item fits inside its surface")

func check_modal(owner, label: String) -> void:
	await settle()
	var dim: Control = owner.modal_layer.get_child(0)
	var sheet: Control = dim.get_child(0).get_child(0)
	check(owner.get_viewport().get_visible_rect().grow(-16).encloses(sheet.get_global_rect()), label + " sheet stays inside the screen")
	owner.close_top_modal()
	await settle()

func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	game.new_game("ORBITAL-P0")
	game.state.inventory[0].defId = "WCH-002"
	shell.go("inspect")
	await settle()
	var page = shell.active_shell().page
	check_workbench(page, "idle inspection")
	check(page.bench.size.y < 160, "idle controls do not reserve an empty instrument-sized panel")
	for tool in GameData.tools:
		page._set_tool(tool.id)
		await settle()
		check_workbench(page, tool.id)
		if tool.id == "TOL-005":
			check(page.tare_button.is_visible_in_tree(), "scale tare control is visible")
			page._scale_tare()
			page._scale_place()
			await settle()
			check_workbench(page, "occupied physical scale")
		page._set_tool("")
		await settle()
		check(not page.scale_occupied and page.item.draggable, "switching tools returns the scale item to its work surface")

	shell.active_shell().go("repair")
	await settle()
	page = shell.active_shell().page
	var service_order := ["dust","open","wash","replace","assemble","test"]
	game.item(page.it_uid).service.tasks = service_order
	for i in service_order.size():
		game.item(page.it_uid).service.done = service_order.slice(0,i)
		page._stage_ui()
		await settle()
		check_workbench(page, "repair " + service_order[i])
		if service_order[i] != "dust":
			check(page.mat_rect.encloses(page.art.get_rect()), "animated native parts remain inside the repair surface")
	for name in ["warehouse", "orders", "report"]:
		shell.active_shell().go(name)
		await settle()
		var surface = shell.active_shell().get("work_surface")
		check(surface != null and surface.get("mat_rect") == Rect2(), name + " does not show an unrelated workbench mat")
		if name == "warehouse":
			check(shell.active_shell().content_rect().encloses(shell.active_shell().page.holder.get_rect()), "warehouse storage stays inside the drawer")
		elif name == "orders":
			for status in ["open", "active", "closed"]:
				shell.active_shell().page._select_status(status)
				await settle()
				check(shell.active_shell().content_rect().encloses(shell.active_shell().page.board.get_rect()), status + " order board stays inside the drawer")
	game.state.day = 3
	game.dispatch({"type": "SETTLE"})
	await settle()
	page = shell.active_shell().page
	check(shell.active_shell().content_rect().encloses(page.sheet.get_rect()), "day-three report and upgrade controls fit the ledger")
	game.state.phase = "ending"
	page._refresh()
	page.relayout()
	await settle()
	check(shell.active_shell().content_rect().encloses(page.sheet.get_rect()), "ending report fits the ledger")
	shell.active_shell().open_settings()
	await check_modal(shell.active_shell(), "embedded settings")
	shell.close_workspace()
	await settle()
	for method in ["open_events", "open_help", "open_settings"]:
		shell.call(method)
		await check_modal(shell, method)
	for npc in GameData.people():
		shell.open_people(npc.id)
		await check_modal(shell, "resident " + npc.id)
	shell.queue_free()
	await settle()
	# Exercise the same wide, short logical viewport used by landscape phones.
	root.size = Vector2i(2730, 1080)
	root.content_scale_mode = Window.CONTENT_SCALE_MODE_CANVAS_ITEMS
	root.content_scale_aspect = Window.CONTENT_SCALE_ASPECT_EXPAND
	root.content_scale_size = Vector2i(1920, 1080)
	var phone_script := GDScript.new()
	phone_script.source_code = 'extends "res://scripts/app/shell.gd"\nfunc _landscape_phone() -> bool:\n\treturn true\n'
	phone_script.reload()
	shell = load("res://main.tscn").instantiate()
	shell.set_script(phone_script)
	root.add_child(shell)
	await settle()
	shell._close_title()
	game.new_game("ORBITAL-P0")
	game.prefs.reduced_motion = false
	game.state.inventory[0].defId = "WCH-002"
	shell.go("inspect")
	await settle()
	for tool in [""] + GameData.applicable_tools("WCH-002"):
		var inspection = shell.active_shell().page
		inspection._set_tool(tool)
		await settle()
		await create_timer(0.7).timeout
		await settle()
		check_workbench(inspection, "landscape inspection " + tool)
	shell.go("repair")
	await settle()
	var repair = shell.active_shell().page
	game.item(repair.it_uid).service.tasks = service_order
	for i in service_order.size():
		game.item(repair.it_uid).service.done = service_order.slice(0,i)
		repair._stage_ui()
		await settle()
		check_workbench(repair, "landscape repair " + service_order[i])

	shell.go("warehouse")
	await settle()
	var phone_warehouse = shell.active_shell().page
	check(shell.active_shell().content_rect().encloses(phone_warehouse.holder.get_rect()), "landscape warehouse fits inside the drawer and keeps stock lists reachable")
	check(shell.active_shell().content_rect().encloses(phone_warehouse.detail_panel.get_rect()), "landscape warehouse details fit inside the drawer")
	shell.queue_free()
	await settle()
	print("LAYOUT failures=", failures)
	quit(1 if failures else 0)
