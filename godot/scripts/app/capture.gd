extends Node
## Scripted visual walkthrough; separate input tests verify actual pointer events.
## `godot --path godot -- --capture=DIR` saves all equipment states.

var shell
var dir := ""

func shot(name: String) -> void:
	await RenderingServer.frame_post_draw
	get_viewport().get_texture().get_image().save_png("%s/%s.png" % [dir, name])
	print("captured ", name)

func wait(t: float) -> void:
	await get_tree().create_timer(t).timeout

func point(world: Vector2) -> void:
	shell.active_shell().pointer_override = world

func run(s, d: String) -> void:
	shell = s
	dir = d
	DirAccess.make_dir_recursive_absolute(dir)
	Game.new_game("ORBITAL-P0")
	await wait(1.6)
	point(Vector2(960, 500))
	await shot("01_counter_idle")
	shell.active_shell().page._ring()
	await wait(4.2)
	await shot("02_arrive")
	shell.go("inspect")
	await wait(1.2)
	await shot("03_inspect")
	var pg = shell.active_shell().page
	pg._set_tool("TOL-001")
	point(pg.item.uv_global(pg._spot("seam")) + Vector2(-120, -60))
	await wait(0.5)
	point(pg.item.uv_global(pg._spot("seam")))
	await wait(1.6)
	await shot("04_lens")
	pg._set_tool("TOL-003")
	await wait(0.3)
	var sp = pg.instrument
	for i in 3:
		pg.sliders[i].value = sp.targets[i] + sp.offset
	await wait(0.3)
	await shot("05_spectrum")
	await wait(0.6)
	pg._set_tool("TOL-006")
	pg.load_dial.set_value(int(pg.instrument.band + 6))
	await wait(0.5)
	await shot("06_load")
	await wait(0.8)
	shell.go("counter")
	await wait(0.8)
	point(Vector2(1000, 800))
	await shot("07_counter_evidence")
	var t = Game.state.trade
	var it = Model.trade_item(Game.state)
	var terms := Model.trade_terms(Game.state, t, it)
	shell.active_shell().page.dial.set_value(int(terms.floor * 0.6))
	shell.active_shell().page._offer()
	await wait(1.2)
	await shot("08_lowball")
	shell.active_shell().page.dial.set_value(int(terms.floor + 2))
	shell.active_shell().page._offer()
	await wait(1.0)
	Game.dispatch({"type": "DELIVER", "tradeId": t.id})
	await wait(0.6)
	await shot("09_deal")
	await wait(4.0)
	shell.go("warehouse")
	await wait(1.0)
	shell.active_shell().page.select(Game.state.inventory[0].uid)
	await wait(0.4)
	await shot("10_warehouse")
	shell.go("repair")
	await wait(1.2)
	await shot("11_repair")
	shell.go("orders")
	await wait(0.8)
	await shot("12_orders")
	shell.open_events()
	await wait(0.6)
	await shot("13_events")
	for c in shell.modal_layer.get_children():
		c.queue_free()
	shell.go("report")
	await wait(0.8)
	Game.dispatch({"type": "SETTLE"})
	await wait(0.6)
	await shot("14_report")
	Game.dispatch({"type": "NEXT"})
	await wait(0.75)
	await shot("15_shutter")
	await wait(2.0)
	await shot("16_day2")
	get_tree().quit()
