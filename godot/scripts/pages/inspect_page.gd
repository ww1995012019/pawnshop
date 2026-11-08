extends Page
## Workbench: six instruments, each a hands-on mechanic. A reading is recorded
## (CHECK) only when the physical step succeeds; readings reflect the item's
## real state, so a faulty object sags under load and a copy reads off-spectrum.

const ITEM_POS := Vector2(900, 500)

var item: ItemSprite
var it_uid := ""
var tool := ""
var progress := 0.0
var lens: Node2D
var lens_ring
var wand: Node2D
var uv_light: PointLight2D
var probes: Array = []
var ports: Array = []
var arc: Line2D
var drag_probe := -1
var tool_buttons := {}
var info: VBoxContainer
var bench: PanelContainer
var bench_body: VBoxContainer
var instrument: Control
var picker: OptionButton
var sliders: Array = []
var weights := {}
var tared := false
var load_dial: Dial
var hold := 0.0

func scene_name() -> String:
	return "workbench"

func hint_text() -> String:
	if tool == "":
		return "选左侧仪器开始取证；拖动实物摆位，右键或 F 翻面。"
	return GameData.tool(tool).instruction if GameData.tool(tool).has("instruction") else ""

func enter() -> void:
	_build_panels()
	_load_item()

func _hash01(tag: String) -> float:
	return Model.fnv("%s/%s/%s" % [Game.state.seed, it_uid, tag]) / 4294967296.0

func _spot(tag: String) -> Vector2:
	return Vector2(0.3 + _hash01(tag + "x") * 0.4, 0.32 + _hash01(tag + "y") * 0.36)

# ---------------------------------------------------------------- UI

func _build_panels() -> void:
	var left := left_panel(300)
	var lv := UIKit.vbox(10)
	left.add_child(lv)
	lv.add_child(UIKit.label("鉴定仪器", 22, UIKit.MUTED))
	for t in GameData.tools:
		var b := UIKit.button("", "secondary", Vector2(0, 92), 21)
		b.icon = UIKit.tool_icon(t.id)
		b.expand_icon = true
		b.add_theme_constant_override("icon_max_width", 76)
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		var id: String = t.id
		b.pressed.connect(func(): _set_tool("" if tool == id else id))
		lv.add_child(b)
		tool_buttons[id] = b
	var right := side_panel(470)
	var rv := UIKit.vbox(12)
	right.add_child(rv)
	picker = OptionButton.new()
	picker.custom_minimum_size = Vector2(0, 52)
	picker.add_theme_font_size_override("font_size", 19)
	picker.item_selected.connect(func(i):
		Game.focus_uid = picker.get_item_metadata(i)
		_load_item())
	rv.add_child(picker)
	var sc := ScrollContainer.new()
	sc.size_flags_vertical = Control.SIZE_EXPAND_FILL
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	info = UIKit.vbox(10)
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	sc.add_child(info)
	rv.add_child(sc)
	var row := UIKit.grid(2, 10)
	var flip := UIKit.button("翻面 F", "secondary", Vector2(0, 54), 20, "flip")
	flip.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	flip.pressed.connect(func(): if item: item.flip())
	row.add_child(flip)
	var home := UIKit.button("实物归位", "secondary", Vector2(0, 54), 20, "recentre")
	home.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	home.pressed.connect(func(): if item: _home())
	row.add_child(home)
	var back := UIKit.button("回柜台", "primary", Vector2(0, 54), 20, "counter")
	back.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	back.pressed.connect(func(): shell.go("counter"))
	row.add_child(back)
	var fix := UIKit.button("去维修", "secondary", Vector2(0, 54), 20, "repair")
	fix.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	fix.pressed.connect(func(): shell.go("repair", it_uid))
	row.add_child(fix)
	rv.add_child(row)
	# Instrument bench between the side panels.
	var r: Rect2 = shell.content_rect()
	bench = UIKit.plate()
	bench.position = Vector2(r.position.x + 300 + 20, r.end.y - 220)
	bench.size = Vector2(r.size.x - 300 - 470 - 40, 220)
	add_child(bench)
	bench_body = UIKit.vbox(10)
	bench.add_child(bench_body)

func _fill_picker() -> void:
	picker.clear()
	var list := []
	var t = Game.trade_item()
	if t != null:
		list.append([t, "柜台来货 · "])
	for it in Game.state.inventory:
		list.append([it, ""])
	var sel := 0
	for i in list.size():
		var it: Dictionary = list[i][0]
		picker.add_item("%s%s · 物证 %d" % [list[i][1], GameData.def(it.defId).name, Model.evidence_count(it)])
		picker.set_item_metadata(i, it.uid)
		if it.uid == it_uid:
			sel = i
	if picker.item_count:
		picker.select(sel)

func _refresh_info() -> void:
	UIKit.clear(info)
	var it = Game.item(it_uid)
	if it == null:
		info.add_child(UIKit.label("工作台空着。去柜台或仓储挑一件。", 20, UIKit.MUTED, false, true))
		return
	var def := GameData.def(it.defId)
	info.add_child(UIKit.label(def.name, 30, Color("f3e6cc")))
	info.add_child(UIKit.label("%s · 占格 %d×%d" % [def.category, def.size[0], def.size[1]], 17, UIKit.MUTED))
	info.add_child(UIKit.label(def.description, 18, UIKit.TEXT, false, true))
	var e := Model.estimate(it)
	var est := UIKit.plate(UIKit.inset_style(12))
	var ev := UIKit.vbox(2)
	ev.add_child(UIKit.label("参考估值", 15, UIKit.CYAN))
	ev.add_child(UIKit.label(UIKit.money(e.low) if e.exact else "%s–%s Cr" % [Model.jnum(e.low), Model.jnum(e.high)], 34, UIKit.AMBER, true))
	ev.add_child(UIKit.label("物证 %d/6 · %s" % [Model.evidence_count(it), "首次记录本件消耗 1 AP" if not it.inspectedPaid and not Game.state.upgrades.lamp else "本件后续取证免费"], 16, UIKit.MUTED))
	est.add_child(ev)
	info.add_child(est)
	info.add_child(UIKit.label("来源：" + String(it.source), 16, UIKit.MUTED, false, true))
	for t in it.evidence:
		var card := UIKit.plate(UIKit.paper_style(12))
		var cv := UIKit.vbox(2)
		cv.add_child(UIKit.label(GameData.tool(t).name, 18, UIKit.RUST))
		cv.add_child(UIKit.label(Model.item_clue(it, t), 16, UIKit.INK, false, true))
		card.add_child(cv)
		info.add_child(card)
	for k in tool_buttons:
		var b: Button = tool_buttons[k]
		var done: bool = it.evidence.has(k)
		var relevant: bool = def.tools.has(k)
		b.text = "%s%s\n%s" % [GameData.tool(k).name, "  ✓" if done else "", "已取证" if done else ("型号相关" if relevant else "可取证")]
		b.add_theme_stylebox_override("normal", UIKit.key_style("primary" if k == tool else ("good" if done else "secondary"), "normal"))

# ---------------------------------------------------------------- item

func _load_item() -> void:
	_set_tool("")
	if item != null and is_instance_valid(item):
		item.queue_free()
	var it = Game.workbench_item()
	it_uid = it.uid if it != null else ""
	Game.focus_uid = it_uid
	_fill_picker()
	_refresh_info()
	if it == null:
		return
	item = ItemSprite.new()
	item.setup(it.defId, it.uid, 360.0)
	item.position = ITEM_POS
	item.bounds = Rect2(560, 330, 700, 260)
	item.dropped.connect(func():
		shell.sound("drop", -5, randf_range(0.9, 1.1))
		shell.dust_burst(item.global_position + Vector2(0, 110), shell.layer("fg")))
	item.flipped.connect(func(b): shell.sound("page", -6))
	add_world(item, "fg")
	item.mat.set_shader_parameter("seam_uv", _spot("seam"))
	if Game.item(it_uid).evidence.has("TOL-001"):
		item.mat.set_shader_parameter("found_seam", 1.0)
	item.set_reveal(Model.item_mark(it), _spot("mark"))
	if not Game.prefs.reduced_motion:
		item.land(80.0)

func _home() -> void:
	var tw := create_tween()
	tw.tween_property(item, "position", ITEM_POS, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

# ---------------------------------------------------------------- instruments

func _set_tool(id: String) -> void:
	tool = id
	progress = 0.0
	hold = 0.0
	for n in [lens, wand, uv_light, arc]:
		if n != null and is_instance_valid(n):
			n.queue_free()
	for p in probes + ports:
		if is_instance_valid(p):
			p.queue_free()
	probes.clear()
	ports.clear()
	lens = null
	wand = null
	uv_light = null
	arc = null
	sliders.clear()
	weights.clear()
	tared = false
	shell.ambient_target = shell.ambient_base
	shell.focus = 0.0
	UIKit.clear(bench_body)
	instrument = null
	if item != null and is_instance_valid(item):
		item.mat.set_shader_parameter("lens_r", 0.0)
		item.mat.set_shader_parameter("uv_r", 0.0)
	if id != "":
		shell.sound("click", -6, 1.2)
		shell.focus = 1.0
		shell.focus_point = ITEM_POS + Vector2(0, -40)
	var title := UIKit.label(GameData.tool(id).name + " · " + GameData.tool(id).instruction if id != "" else "选择一种仪器开始取证", 20, UIKit.AMBER if id != "" else UIKit.MUTED, false, true)
	bench_body.add_child(title)
	match id:
		"TOL-001": _lens()
		"TOL-002": _uv()
		"TOL-003": _spectrum()
		"TOL-004": _circuit()
		"TOL-005": _scale()
		"TOL-006": _load()
	_refresh_info()
	shell.hint(hint_text())

func _lens() -> void:
	lens = Node2D.new()
	lens.z_index = 60
	var handle := Line2D.new()
	handle.points = PackedVector2Array([Vector2(85, 85), Vector2(200, 200)])
	handle.width = 26
	handle.default_color = Color("3a2a1b")
	handle.begin_cap_mode = Line2D.LINE_CAP_ROUND
	handle.end_cap_mode = Line2D.LINE_CAP_ROUND
	handle.material = Util.unshaded()
	lens.add_child(handle)
	var glass := Sprite2D.new()
	glass.texture = Util.white(8)
	glass.scale = Vector2.ONE * 250.0 / 8.0
	var lm := ShaderMaterial.new()
	lm.shader = load("res://shaders/lens.gdshader")
	glass.material = lm
	lens.add_child(glass)
	lens_ring = Ring.new()
	lens_ring.radius = 138.0
	lens.add_child(lens_ring)
	add_world(lens, "top")
	bench_body.add_child(UIKit.label("沿接缝、铆点和活动部件慢慢移动镜片；停在可疑处会出现读数进度。", 18, UIKit.TEXT, false, true))

func _uv() -> void:
	shell.ambient_target = Color(0.17, 0.15, 0.27)
	wand = Node2D.new()
	wand.z_index = 60
	var w := Sprite2D.new()
	w.texture = UIKit.tool_icon("TOL-002")
	w.scale = Vector2.ONE * 0.42
	w.rotation = -0.5
	w.position = Vector2(80, 120)
	w.material = Util.unshaded()
	wand.add_child(w)
	var tip := Sprite2D.new()
	tip.texture = Util.radial(128, 0.3)
	tip.modulate = Color(0.7, 0.4, 1.0, 0.8)
	tip.scale = Vector2.ONE * 1.4
	tip.material = Util.add_material()
	wand.add_child(tip)
	lens_ring = Ring.new()
	lens_ring.radius = 70.0
	wand.add_child(lens_ring)
	add_world(wand, "top")
	uv_light = PointLight2D.new()
	uv_light.texture = Util.light_tex()
	uv_light.texture_scale = 1.2
	uv_light.color = Color(0.62, 0.36, 1.0)
	uv_light.energy = 2.4
	uv_light.height = 80
	add_world(uv_light, "top")
	bench_body.add_child(UIKit.label("店里的灯会暗下来。用紫外灯扫过外壳，底层暗纹或编号会发荧光；停住读取。", 18, UIKit.TEXT, false, true))

func _spectrum() -> void:
	var w := Spectrum.new()
	w.custom_minimum_size = Vector2(0, 110)
	w.targets = [0.15 + _hash01("p0") * 0.2, 0.42 + _hash01("p1") * 0.16, 0.7 + _hash01("p2") * 0.18]
	var it = Game.item(it_uid)
	w.offset = 0.0 if it.authentic else 0.07
	instrument = w
	var row := UIKit.hbox(18)
	row.add_child(w)
	w.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var sv := UIKit.vbox(8)
	sv.custom_minimum_size = Vector2(300, 0)
	for i in 3:
		var s := HSlider.new()
		s.min_value = 0.0
		s.max_value = 1.0
		s.step = 0.005
		s.value = [0.1, 0.5, 0.9][i]
		s.custom_minimum_size = Vector2(0, 30)
		s.value_changed.connect(func(v):
			w.peaks[i] = v
			w.queue_redraw())
		sv.add_child(s)
		sliders.append(s)
		w.peaks[i] = s.value
	row.add_child(sv)
	bench_body.add_child(row)

func _circuit() -> void:
	var p_uv := [_spot("portA"), _spot("portB") * Vector2(1, 1) + Vector2(0.18, 0.1)]
	for i in 2:
		var port := Port.new()
		port.uv = Vector2(clampf(p_uv[i].x, 0.25, 0.75), clampf(p_uv[i].y, 0.25, 0.75))
		port.position = item.uv_global(port.uv)
		add_world(port, "top")
		ports.append(port)
	for i in 2:
		var pr := Probe.new()
		pr.color = Color("d24a3c") if i == 0 else Color("2b2b2b")
		pr.home = Vector2(560 + i * 90, 900)
		pr.position = pr.home
		add_world(pr, "top")
		probes.append(pr)
	arc = Line2D.new()
	arc.width = 3
	arc.default_color = Color(0.6, 0.95, 1.0, 0.9)
	arc.material = Util.add_material()
	arc.z_index = 70
	add_world(arc, "top")
	var scope := Scope.new()
	scope.custom_minimum_size = Vector2(0, 120)
	scope.working = Game.item(it_uid).working
	instrument = scope
	bench_body.add_child(scope)

func _scale() -> void:
	var it = Game.item(it_uid)
	var mass := 10 * (3 + int(_hash01("mass") * 15))
	var g := Gauge.new()
	g.custom_minimum_size = Vector2(300, 130)
	g.mass = float(mass) * (1.0 if it.authentic else 1.08)
	g.nominal = mass
	instrument = g
	var row := UIKit.hbox(14)
	row.add_child(g)
	var bv := UIKit.vbox(8)
	var tare := UIKit.button("空秤校零", "primary", Vector2(160, 48), 19)
	tare.pressed.connect(func():
		tared = true
		g.tared = true
		shell.sound("check", -10, 1.4)
		g.queue_redraw())
	bv.add_child(tare)
	var wr := UIKit.hbox(8)
	for w in [10, 20, 50, 100]:
		var b := UIKit.button("%dg" % w, "chip", Vector2(76, 48), 18)
		b.toggle_mode = true
		b.toggled.connect(func(on):
			if on:
				weights[w] = true
			else:
				weights.erase(w)
			var total := 0
			for k in weights:
				total += k
			g.weights = total
			shell.sound("drop", -14, 1.6)
			g.queue_redraw())
		wr.add_child(b)
	bv.add_child(wr)
	bv.add_child(UIKit.label("型号标称 %d g · 配平到指针归零" % mass, 16, UIKit.MUTED))
	row.add_child(bv)
	bench_body.add_child(row)

func _load() -> void:
	var it = Game.item(it_uid)
	var row := UIKit.hbox(16)
	load_dial = Dial.new()
	load_dial.min_value = 0
	load_dial.max_value = 100
	load_dial.value = 0
	load_dial.custom_minimum_size = Vector2(140, 140)
	load_dial.changed.connect(func(_v): shell.sound("click", -22, 1.8))
	row.add_child(load_dial)
	var m := Meter.new()
	m.custom_minimum_size = Vector2(0, 120)
	m.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	m.band = 45.0 + _hash01("band") * 30.0
	m.working = it.working
	m.dial = load_dial
	instrument = m
	row.add_child(m)
	bench_body.add_child(row)

func _record() -> void:
	progress = 0.0
	hold = 0.0
	var before: int = Game.item(it_uid).evidence.size()
	Game.dispatch({"type": "CHECK", "uid": it_uid, "tool": tool})
	var after = Game.item(it_uid)
	if after != null and after.evidence.size() > before:
		shell.sound("check", -2)
		shell.shake = 0.2
		if tool == "TOL-001":
			item.mat.set_shader_parameter("found_seam", 1.0)
	_refresh_info()
	_fill_picker()

func on_changed(_p: Dictionary, _n: Dictionary, _a: Dictionary) -> void:
	_refresh_info()

# ---------------------------------------------------------------- input & frame

func _unhandled_input(e: InputEvent) -> void:
	if shell.modal_open() or item == null or not is_instance_valid(item):
		return
	var p: Vector2 = shell.world_mouse()
	if e is InputEventMouseButton:
		var mb := e as InputEventMouseButton
		if mb.button_index == MOUSE_BUTTON_LEFT and mb.pressed:
			if tool == "TOL-004":
				for i in probes.size():
					if p.distance_to(probes[i].tip()) < 40:
						drag_probe = i
						return
			elif tool == "":
				if item.contains(p):
					item.begin_drag(p)
		elif mb.button_index == MOUSE_BUTTON_LEFT and not mb.pressed:
			item.end_drag()
			if drag_probe >= 0:
				var pr: Probe = probes[drag_probe]
				var snapped := false
				for port in ports:
					if pr.tip().distance_to(port.position) < 46:
						pr.position += port.position - pr.tip()
						pr.attached = true
						snapped = true
						shell.sound("click", -4, 0.7)
				if not snapped:
					pr.attached = false
					create_tween().tween_property(pr, "position", pr.home, 0.25).set_trans(Tween.TRANS_BACK)
				drag_probe = -1
		elif mb.button_index == MOUSE_BUTTON_RIGHT and mb.pressed:
			item.flip()
	elif e is InputEventKey and e.pressed and not e.echo:
		var k := (e as InputEventKey).keycode
		if k == KEY_F:
			item.flip()
		elif k >= KEY_1 and k <= KEY_6:
			_set_tool(GameData.tools[k - KEY_1].id)
		elif k == KEY_ESCAPE:
			_set_tool("")

func _process(delta: float) -> void:
	if item == null or not is_instance_valid(item):
		return
	var p: Vector2 = shell.world_mouse()
	if item.dragging:
		item.drag_to(p)
	item.hover = lerpf(item.hover, 1.0 if tool == "" and (item.contains(p) or item.dragging) else 0.0, 0.2)
	var it = Game.item(it_uid)
	if it == null:
		return
	var target := -1.0
	match tool:
		"TOL-001":
			lens.position = lens.position.lerp(shell.layer("top").to_local(p), 1.0 - exp(-delta * 18.0))
			item.mat.set_shader_parameter("lens_pos", lens.global_position)
			item.mat.set_shader_parameter("lens_r", 125.0)
			item.mat.set_shader_parameter("seam_uv", _spot("seam"))
			target = lens.global_position.distance_to(item.uv_global(_spot("seam")))
		"TOL-002":
			wand.position = wand.position.lerp(shell.layer("top").to_local(p), 1.0 - exp(-delta * 18.0))
			uv_light.global_position = wand.global_position
			item.mat.set_shader_parameter("uv_pos", wand.global_position)
			item.mat.set_shader_parameter("uv_r", 230.0)
			var rm := item.reveal.material as ShaderMaterial
			rm.set_shader_parameter("uv_pos", wand.global_position)
			rm.set_shader_parameter("uv_r", 230.0)
			target = wand.global_position.distance_to(item.reveal_center())
		"TOL-003":
			var sp: Spectrum = instrument
			if sp.matched():
				hold += delta
				if hold > 0.6:
					_record()
			else:
				hold = 0.0
		"TOL-004":
			if drag_probe >= 0:
				probes[drag_probe].position = shell.layer("top").to_local(p) - Vector2(0, -0)
			for i in ports.size():
				ports[i].position = item.uv_global(ports[i].uv)
			var both := probes.size() == 2 and probes.all(func(pr): return pr.attached)
			(instrument as Scope).live = both
			if both:
				var a: Vector2 = probes[0].tip()
				var b: Vector2 = probes[1].tip()
				var pts := PackedVector2Array()
				for k in 12:
					var f := k / 11.0
					pts.append(a.lerp(b, f) + Vector2(randf_range(-8, 8), randf_range(-8, 8)) * sin(f * PI))
				arc.points = pts
				hold += delta
				if hold > 0.9:
					_record()
					hold = -999.0
			else:
				arc.points = PackedVector2Array()
		"TOL-005":
			var g: Gauge = instrument
			if tared and g.balanced():
				hold += delta
				if hold > 0.6:
					_record()
					hold = -999.0
			elif hold >= 0.0:
				hold = 0.0
		"TOL-006":
			var m: Meter = instrument
			if m.in_band():
				hold += delta
				m.progress = clampf(hold / 1.0, 0.0, 1.0)
				if hold > 1.0:
					_record()
					hold = -999.0
			elif hold >= 0.0:
				hold = 0.0
				m.progress = 0.0
	if target >= 0.0 and target < 80.0:
		progress += delta / 0.9
		if progress >= 1.0:
			_record()
	elif target >= 0.0:
		progress = maxf(0.0, progress - delta * 2.0)
	if lens_ring != null and is_instance_valid(lens_ring):
		lens_ring.value = progress


class Ring extends Node2D:
	var value := 0.0
	var radius := 132.0
	func _process(_d: float) -> void:
		queue_redraw()
	func _draw() -> void:
		if value > 0.01:
			draw_arc(Vector2.ZERO, radius, -PI * 0.5, -PI * 0.5 + TAU * value, 48, Color(1, 0.75, 0.4, 0.9), 6.0, true)


class Port extends Node2D:
	var uv := Vector2.ZERO
	func _process(_d: float) -> void:
		queue_redraw()
	func _draw() -> void:
		var t := Time.get_ticks_msec() / 1000.0
		draw_circle(Vector2.ZERO, 16 + sin(t * 5.0) * 3.0, Color(1.0, 0.7, 0.3, 0.25))
		draw_arc(Vector2.ZERO, 12, 0, TAU, 24, Color(1.0, 0.75, 0.35), 3.0)
		draw_circle(Vector2.ZERO, 4, Color(1.0, 0.85, 0.5))


class Probe extends Node2D:
	var color := Color.RED
	var home := Vector2.ZERO
	var attached := false
	func tip() -> Vector2:
		return global_position
	func _ready() -> void:
		material = Util.unshaded()
	func _process(_d: float) -> void:
		queue_redraw()
	func _draw() -> void:
		var base := Vector2(-30, 150)
		draw_line(base + Vector2(0, 60), base, Color(0.1, 0.1, 0.1), 10.0)
		draw_line(base, Vector2(0, -2), color.darkened(0.2), 16.0)
		draw_line(base + Vector2(4, -8), Vector2(2, -6), color.lightened(0.3), 4.0)
		draw_line(Vector2(0, 0), Vector2(4, -26), Color(0.8, 0.8, 0.82), 4.0)
		draw_circle(Vector2(4, -26), 3, Color(1, 1, 1))
		if attached:
			draw_circle(Vector2(4, -26), 10, Color(0.6, 0.95, 1.0, 0.5))


class Spectrum extends Control:
	var targets := [0.2, 0.5, 0.8]
	var peaks := [0.1, 0.5, 0.9]
	var offset := 0.0
	func matched() -> bool:
		for i in 3:
			if absf(peaks[i] - targets[i] - offset) > 0.03:
				return false
		return true
	func _curve(ps: Array, x: float) -> float:
		var y := 0.0
		for p in ps:
			y += exp(-pow((x - p) / 0.035, 2.0))
		return y
	func _draw() -> void:
		draw_rect(Rect2(Vector2.ZERO, size), Color("041010"))
		for i in 8:
			draw_line(Vector2(i * size.x / 8.0, 0), Vector2(i * size.x / 8.0, size.y), Color(0.2, 0.5, 0.45, 0.25))
		var ref := PackedVector2Array()
		var cur := PackedVector2Array()
		var shifted := []
		for t in targets:
			shifted.append(t + offset)
		for k in 120:
			var x := k / 119.0
			ref.append(Vector2(x * size.x, size.y - 8 - _curve(targets, x) * (size.y - 20)))
			cur.append(Vector2(x * size.x, size.y - 8 - _curve(peaks, x) * (size.y - 20)))
		draw_polyline(ref, Color(0.45, 0.8, 0.75, 0.55), 2.0)
		draw_polyline(cur, Color("ffb35c") if not matched() else Color("98ffb0"), 3.0)
		var f: Font = UIKit.mono
		draw_string(f, Vector2(10, 22), "参考谱（型号）· 拖动三根滑杆对齐", HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color(0.6, 0.9, 0.85))


class Scope extends Control:
	var live := false
	var working := true
	func _process(_d: float) -> void:
		queue_redraw()
	func _draw() -> void:
		draw_rect(Rect2(Vector2.ZERO, size), Color("041010"))
		var t := Time.get_ticks_msec() / 1000.0
		var pts := PackedVector2Array()
		for k in 160:
			var x := k / 159.0
			var y := 0.0
			if live:
				y = sin(x * 30.0 - t * 8.0) * 0.6
				if not working and fmod(x * 4.0 + t, 1.0) < 0.25:
					y = 0.05 * sin(x * 200.0)
			pts.append(Vector2(x * size.x, size.y * 0.5 - y * size.y * 0.35))
		draw_polyline(pts, Color(0.5, 1.0, 0.85) if live else Color(0.3, 0.5, 0.45), 2.5)
		draw_string(UIKit.mono, Vector2(10, 22), "把红、黑探针拖到实物上发光的两个接口" if not live else ("回路闭合 · 波形稳定" if working else "回路闭合 · 波形间歇中断"), HORIZONTAL_ALIGNMENT_LEFT, -1, 15, Color(0.6, 0.9, 0.85))


class Gauge extends Control:
	var mass := 100.0
	var nominal := 100
	var weights := 0
	var tared := false
	var shown := 0.0
	func balanced() -> bool:
		return absf(float(weights) - mass) < 6.0
	func _process(d: float) -> void:
		var want := 0.0 if not tared else clampf((mass - weights) / maxf(40.0, mass), -1.0, 1.0)
		shown = lerpf(shown, want, 1.0 - exp(-d * 6.0))
		queue_redraw()
	func _draw() -> void:
		var c := Vector2(size.x * 0.5, size.y - 10)
		var r := minf(size.x * 0.45, size.y - 20)
		draw_arc(c, r, PI, TAU, 48, Color("2f3b3c"), 14.0)
		draw_arc(c, r, PI * 1.47, PI * 1.53, 8, Color("98d6a8"), 14.0)
		var a := PI * 1.5 + shown * PI * 0.45
		draw_line(c, c + Vector2(cos(a), sin(a)) * r * 0.92, Color("ffb35c"), 4.0)
		draw_circle(c, 8, Color("8b939a"))
		draw_string(UIKit.mono, Vector2(10, 22), ("砝码 %dg" % weights) if tared else "先空秤校零", HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(0.7, 0.9, 0.85))


class Meter extends Control:
	var band := 60.0
	var working := true
	var dial: Dial
	var progress := 0.0
	func voltage() -> float:
		var l := float(dial.value)
		var v := l
		if not working and l > 30.0:
			v = l - (l - 30.0) * 0.7 + sin(Time.get_ticks_msec() / 90.0) * 4.0
		return v
	func in_band() -> bool:
		var v := voltage()
		return v >= band and v <= band + 12.0
	func _process(_d: float) -> void:
		queue_redraw()
	func _draw() -> void:
		draw_rect(Rect2(Vector2.ZERO, size), Color("041010"))
		var w := size.x - 20
		draw_rect(Rect2(10 + w * band / 100.0, 34, w * 12.0 / 100.0, size.y - 50), Color(0.35, 0.8, 0.5, 0.35))
		var v := voltage()
		draw_rect(Rect2(10, size.y - 40, w * clampf(v, 0, 100) / 100.0, 18), Color("ffb35c") if not in_band() else Color("98ffb0"))
		draw_rect(Rect2(10, size.y - 14, w * progress, 6), Color("98ffb0"))
		draw_string(UIKit.mono, Vector2(10, 24), "负载 %d%% · 输出 %d%%  把输出稳定在绿区" % [dial.value, roundi(v)], HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(0.7, 0.9, 0.85))
