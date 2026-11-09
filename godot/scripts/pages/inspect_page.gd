extends Page
## Workbench: six instruments, each a hands-on mechanic. A reading is recorded
## (CHECK) only when the physical step succeeds; readings reflect the item's
## real state, so a faulty object sags under load and a copy reads off-spectrum.

var item_home := Vector2(900, 500)
var mat_rect := Rect2()

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
var instrument_panel: PanelContainer
var instrument_header: VBoxContainer
var instrument_list: VBoxContainer
var detail_panel: PanelContainer
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
var specific_step := 0
var specific_buttons: Array = []
var specific_status: Label
var specific_motion
var specific_running := false
var specific_elapsed := 0.0
var specific_duration := 0.9
var specific_active_index := -1
var specific_result_running := false
var specific_result_elapsed := 0.0
var pending_tool := ""

func scene_name() -> String:
	return "workbench"

func hint_text() -> String:
	if tool == "":
		if shell._landscape_phone():
			return "在下方选择仪器；拖动实物摆位，可用「翻面」查看背面。"
		return "选左侧仪器开始取证；拖动实物摆位，右键或 F 翻面。"
	if tool == "SPEC":
		return "按顺序操作物品，完成专属检测后记录物证。"
	return GameData.tool(tool).instruction if GameData.tool(tool).has("instruction") else ""

func enter() -> void:
	_build_panels()
	_load_item()
	call_deferred("relayout")

func _hash01(tag: String) -> float:
	return Model.fnv("%s/%s/%s" % [Game.state.seed, it_uid, tag]) / 4294967296.0

func _spot(tag: String) -> Vector2:
	return Vector2(0.3 + _hash01(tag + "x") * 0.4, 0.32 + _hash01(tag + "y") * 0.36)

# ---------------------------------------------------------------- UI

func _build_panels() -> void:
	instrument_panel = left_panel(300)
	var left := instrument_panel
	var lv := UIKit.vbox(10)
	left.add_child(lv)
	instrument_header = UIKit.vbox(10)
	instrument_header.add_child(UIKit.label("鉴定仪器", 24, UIKit.AMBER))
	instrument_header.add_child(UIKit.label("选择工具，逐项记录物证", 16, UIKit.MUTED))
	instrument_header.add_child(UIKit.rule())
	lv.add_child(instrument_header)
	var tool_scroll := ScrollContainer.new()
	tool_scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	tool_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	tool_scroll.follow_focus = true
	instrument_list = UIKit.vbox(10)
	instrument_list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	tool_scroll.add_child(instrument_list)
	lv.add_child(tool_scroll)
	for t in GameData.tools:
		var b := UIKit.button(t.name, "secondary", Vector2(0, 72), 19)
		b.icon = UIKit.tool_icon(t.id)
		b.expand_icon = true
		b.add_theme_constant_override("icon_max_width", 54)
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		var id: String = t.id
		b.pressed.connect(func(): _set_tool("" if tool == id else id))
		instrument_list.add_child(b)
		tool_buttons[id] = b
	var specific := UIKit.button("专属检测", "secondary", Vector2(0, 72), 19)
	specific.name = "specific_check"
	specific.icon = UIKit.icon("check")
	specific.expand_icon = true
	specific.add_theme_constant_override("icon_max_width", 40)
	specific.alignment = HORIZONTAL_ALIGNMENT_LEFT
	specific.pressed.connect(func(): _set_tool("" if tool == "SPEC" else "SPEC"))
	instrument_list.add_child(specific)
	tool_buttons["SPEC"] = specific
	detail_panel = side_panel(470)
	var right := detail_panel
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
	flip.pressed.connect(flip_item)
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
	bench = UIKit.plate()
	add_child(bench)
	bench_body = UIKit.vbox(10)
	bench.add_child(bench_body)
	bench_body.minimum_size_changed.connect(queue_relayout)

## Resize the surface and controls together without rebuilding tool state.
func relayout() -> void:
	if not is_instance_valid(instrument_panel) or not is_instance_valid(instrument_list):
		return
	mat_rect = layout_workbench(instrument_panel, detail_panel, bench, 300)
	if is_instance_valid(item):
		var next_home := fit_workbench_item(item, mat_rect)
		item.position += next_home - item_home
		item.target += next_home - item_home
		item_home = next_home
		item.position = item.position.clamp(item.bounds.position, item.bounds.end)
		for i in probes.size():
			var probe: Probe = probes[i]
			probe.home = shell.ui_to_world(Vector2(mat_rect.end.x - 120 + i * 60, mat_rect.get_center().y - 45))
			if not probe.attached and drag_probe != i:
				probe.position = probe.home

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
	var description: String = GameData.inspection_profile(it.defId).get("description", def.description)
	if description.contains("→"):
		description = description.split("。")[0] + "。"
	info.add_child(UIKit.label(description, 18, UIKit.TEXT, false, true))
	var e := Model.estimate(it)
	var est := UIKit.plate(UIKit.inset_style(12))
	var ev := UIKit.vbox(2)
	ev.add_child(UIKit.label("参考估值", 15, UIKit.CYAN))
	ev.add_child(UIKit.label(UIKit.money(e.low) if e.exact else "%s–%s Cr" % [Model.jnum(e.low), Model.jnum(e.high)], 34, UIKit.AMBER, true))
	ev.add_child(UIKit.label("物证 %d 条 · 适用检测 %d 项\n%s" % [Model.evidence_count(it), GameData.applicable_tools(it.defId).size(), "首次记录本件消耗 1 AP" if not it.inspectedPaid and not Game.state.upgrades.lamp else "本件后续取证免费"], 16, UIKit.MUTED))
	est.add_child(ev)
	info.add_child(est)
	info.add_child(UIKit.label("来源：" + String(it.source), 16, UIKit.MUTED, false, true))
	for t in it.evidence:
		var card := UIKit.plate(UIKit.paper_style(12))
		var cv := UIKit.vbox(2)
		var caption := Model.evidence_caption(it, t)
		cv.add_child(UIKit.label(caption, 18, UIKit.RUST))
		cv.add_child(UIKit.label(Model.displayed_clue(it, t), 16, UIKit.INK, false, true))
		card.add_child(cv)
		info.add_child(card)
	for k in tool_buttons:
		var b: Button = tool_buttons[k]
		var done: bool = it.evidence.has(k)
		var relevant: bool = GameData.relevant_tool(it.defId, k)
		b.visible = GameData.applicable_tools(it.defId).has(k)
		var name: String = GameData.inspection_profile(it.defId).get("title", "专属检测") if k == "SPEC" else GameData.tool(k).name
		b.text = "%s%s\n%s" % [name, "  ✓" if done else "", "已取证" if done else ("专属检测 · 可议价" if k == "SPEC" else "关键物证 · 可议价" if relevant else "通用检查")]
		b.tooltip_text = GameData.tool(k).instruction if GameData.tool(k).has("instruction") else ""
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
	item.position = item_home
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
	if Game.prefs.reduced_motion:
		item.position = item_home
		return
	var tw := create_tween()
	tw.tween_property(item, "position", item_home, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func flip_item() -> void:
	if not is_instance_valid(item) or specific_running:
		return
	# An open part belongs to the current face. Return it before flipping.
	if tool == "SPEC":
		_set_tool("")
	item.flip()

func _return_probe(probe: Probe) -> void:
	if Game.prefs.reduced_motion:
		probe.position = probe.home
	else:
		create_tween().tween_property(probe, "position", probe.home, 0.25).set_trans(Tween.TRANS_BACK)

# ---------------------------------------------------------------- instruments

func _set_tool(id: String) -> void:
	if id == "":
		pending_tool = ""
	var current = Game.item(it_uid)
	if id != "" and (current == null or not GameData.applicable_tools(current.defId).has(id)):
		return
	if id != "" and is_instance_valid(item) and item.busy:
		if tool != "":
			_set_tool("")
		_queue_tool_after_flip(id)
		return
	if id == "SPEC" and is_instance_valid(item) and item.back:
		if tool != "":
			_set_tool("")
		_queue_tool_after_flip(id)
		item.flip()
		return
	if is_instance_valid(specific_motion):
		specific_motion.cancel()
		specific_motion.queue_free()
		specific_motion = null
	tool = id
	progress = 0.0
	hold = 0.0
	drag_probe = -1
	if is_instance_valid(item):
		item.end_drag()
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
	specific_step = 0
	specific_buttons.clear()
	specific_status = null
	specific_running = false
	specific_elapsed = 0.0
	specific_active_index = -1
	specific_result_running = false
	specific_result_elapsed = 0.0
	shell.ambient_target = shell.ambient_base
	shell.focus = 0.0
	UIKit.clear(bench_body)
	instrument = null
	if item != null and is_instance_valid(item):
		item.mat.set_shader_parameter("lens_r", 0.0)
		item.mat.set_shader_parameter("uv_r", 0.0)
		# The hidden mark has its own material; switch its UV window off too,
		# or the last reading stays printed on the object under other tools.
		(item.reveal.material as ShaderMaterial).set_shader_parameter("uv_r", 0.0)
	if id != "":
		shell.sound("click", -6, 1.2)
	var heading: String = GameData.tool(id).name + " · " + GameData.tool(id).instruction if id != "" else "选择一种仪器开始取证"
	if id == "SPEC":
		heading = GameData.inspection_profile(current.defId).title + " · 按顺序完成检测"
	var title := UIKit.label(heading, 20, UIKit.AMBER if id != "" else UIKit.MUTED, false, true)
	bench_body.add_child(title)
	match id:
		"TOL-001": _lens()
		"TOL-002": _uv()
		"TOL-003": _spectrum()
		"TOL-004": _circuit()
		"TOL-005": _scale()
		"TOL-006": _load()
		"SPEC": _specific()
	_refresh_info()
	shell.hint(hint_text())
	call_deferred("relayout")

func _queue_tool_after_flip(id: String) -> void:
	pending_tool = id
	if not item.flip_finished.is_connected(_open_pending_tool):
		item.flip_finished.connect(_open_pending_tool)

func _open_pending_tool(_back: bool) -> void:
	var next := pending_tool
	pending_tool = ""
	if next != "" and is_inside_tree():
		_set_tool(next)

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
		# Keep both tips clear of the drawer side panel and bottom instrument
		# shelf, including the workbench camera's inspection zoom.
		pr.home = item_home + Vector2(190 + i * 65, -45)
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
	var wr := UIKit.grid(3, 8)
	# A standard 5-10-20-20-50-100 set reaches every 5 g step up to 205 g, so
	# every nominal mass (and every off-weight copy) can be balanced.
	var set_weights := [5, 10, 20, 20, 50, 100]
	for i in set_weights.size():
		var w: int = set_weights[i]
		var b := UIKit.button("%dg" % w, "chip", Vector2(64, 48), 18)
		b.toggle_mode = true
		b.toggled.connect(func(on):
			if on:
				weights[i] = w
			else:
				weights.erase(i)
			var total := 0
			for k in weights:
				total += int(weights[k])
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

func _specific() -> void:
	var it = Game.item(it_uid)
	var profile := GameData.inspection_profile(it.defId)
	specific_motion = preload("res://scripts/world/inspection_motion.gd").new()
	specific_motion.setup(item, GameData.motion_profile(it.defId))
	item.add_child(specific_motion)
	var row := UIKit.hbox(8)
	for i in profile.steps.size():
		var b := UIKit.button("%d  %s" % [i + 1, profile.steps[i]], "secondary", Vector2(0, 52), 17)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.disabled = i != 0
		b.pressed.connect(func(): _advance_specific(i))
		row.add_child(b)
		specific_buttons.append(b)
	bench_body.add_child(row)
	specific_status = UIKit.label("已有记录，可按步骤免费复测。" if it.evidence.has("SPEC") else "依次完成上方操作，观察这件物品的实际表现。", 17, UIKit.CYAN if it.evidence.has("SPEC") else UIKit.MUTED, false, true)
	bench_body.add_child(specific_status)

func _advance_specific(index: int) -> void:
	var it = Game.item(it_uid)
	if tool != "SPEC" or it == null or item.busy or specific_running or index < 0 or index >= specific_buttons.size() or index != specific_step:
		return
	if index == specific_buttons.size() - 1:
		var cost := 0.0 if Game.state.upgrades.lamp else 1.0
		if not it.inspectedPaid and not Model.has_ap(Game.state, cost):
			specific_status.text = "行动点不足，明天可继续检测。"
			return
	specific_active_index = index
	specific_motion.start(index)
	# Reduced-motion players still see each completed pose, without the tween.
	if Game.prefs.reduced_motion and index < specific_buttons.size() - 1:
		specific_motion.finish(true)
		_finish_specific_step(index)
		return
	specific_running = true
	specific_elapsed = 0.0
	specific_duration = (0.9 if Game.prefs.reduced_motion else 1.65) if index == specific_buttons.size() - 1 else 0.9
	specific_status.text = "正在%s。" % GameData.inspection_profile(it.defId).steps[index]
	for b in specific_buttons:
		b.disabled = true

func _finish_specific_step(index: int) -> void:
	var it = Game.item(it_uid)
	if it == null:
		return
	if index == specific_buttons.size() - 1:
		_record()
		it = Game.item(it_uid)
		if it != null and it.evidence.has("SPEC"):
			specific_step = specific_buttons.size()
			specific_motion.reveal_result(bool(it.specificResult.working))
			if Game.prefs.reduced_motion:
				specific_motion.sample_result(1.0)
				specific_motion.finish_result()
			else:
				specific_result_running = true
				specific_result_elapsed = 0.0
			specific_status.text = Model.item_clue(it, "SPEC")
			specific_status.add_theme_color_override("font_color", UIKit.CYAN)
		else:
			specific_status.text = "行动点不足，明天可继续检测。"
	else:
		specific_step = index + 1
		specific_status.text = "已完成：%s。继续下一步。" % GameData.inspection_profile(it.defId).steps[index]
	for i in specific_buttons.size():
		specific_buttons[i].disabled = i != specific_step

func _record() -> void:
	progress = 0.0
	hold = 0.0
	var before: int = Game.item(it_uid).evidence.size()
	Game.dispatch({"type": "CHECK", "uid": it_uid, "tool": tool})
	var after = Game.item(it_uid)
	if after != null and (after.evidence.size() > before or (tool == "SPEC" and after.evidence.has("SPEC"))):
		shell.sound("check", -2)
		if not Game.prefs.reduced_motion:
			shell.shake = 0.2
		if tool == "TOL-001":
			item.mat.set_shader_parameter("found_seam", 1.0)
	_refresh_info()
	_fill_picker()

func on_changed(_p: Dictionary, _n: Dictionary, _a: Dictionary) -> void:
	_refresh_info()

# ---------------------------------------------------------------- input & frame

func world_cursor_shape(p: Vector2) -> int:
	if not is_instance_valid(item):
		return Input.CURSOR_ARROW
	if item.dragging or drag_probe >= 0:
		return Input.CURSOR_DRAG
	if shell.modal_open():
		return Input.CURSOR_ARROW
	if tool == "TOL-001" or tool == "TOL-002":
		return Input.CURSOR_CROSS
	if tool == "TOL-004":
		for probe in probes:
			if is_instance_valid(probe) and p.distance_to(probe.tip()) < 40:
				return Input.CURSOR_CAN_DROP
	elif tool == "" and item.draggable and not item.busy and item.contains(p):
		return Input.CURSOR_CAN_DROP
	return Input.CURSOR_ARROW

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
					_return_probe(pr)
				drag_probe = -1
		elif mb.button_index == MOUSE_BUTTON_RIGHT and mb.pressed:
			flip_item()
	elif e is InputEventKey and e.pressed and not e.echo:
		var k := (e as InputEventKey).keycode
		if k == KEY_F:
			flip_item()
		elif k >= KEY_1 and k <= KEY_6:
			_set_tool(GameData.tools[k - KEY_1].id)
		elif k == KEY_7:
			_set_tool("SPEC")
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
	if specific_running and tool == "SPEC":
		specific_elapsed += delta
		var fraction := clampf(specific_elapsed / specific_duration, 0.0, 1.0)
		specific_motion.sample(1.0 if Game.prefs.reduced_motion else fraction)
		if specific_elapsed >= specific_duration:
			specific_running = false
			specific_motion.finish()
			_finish_specific_step(specific_active_index)
	if specific_result_running and tool == "SPEC":
		specific_result_elapsed += delta
		specific_motion.sample_result(clampf(specific_result_elapsed / 0.9, 0.0, 1.0))
		if specific_result_elapsed >= 0.9:
			specific_result_running = false
			specific_motion.finish_result()
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
					hold = -999.0
			elif hold >= 0.0:
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
					var jitter := Vector2.ZERO if Game.prefs.reduced_motion else Vector2(randf_range(-8, 8), randf_range(-8, 8))
					pts.append(a.lerp(b, f) + jitter * sin(f * PI))
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
	if it.evidence.has(tool):
		# Already on record: keep the reading visible without re-submitting it
		# (and re-toasting "already recorded") every second.
		progress = 1.0 if target >= 0.0 and target < 80.0 else 0.0
	elif target >= 0.0 and target < 80.0:
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
		var pulse := 0.0 if Game.prefs.reduced_motion else sin(t * 5.0) * 3.0
		draw_circle(Vector2.ZERO, 16 + pulse, Color(1.0, 0.7, 0.3, 0.25))
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
			# Peaks stay below the caption line.
			ref.append(Vector2(x * size.x, size.y - 8 - _curve(targets, x) * (size.y - 42)))
			cur.append(Vector2(x * size.x, size.y - 8 - _curve(peaks, x) * (size.y - 42)))
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
		var t := 0.0 if Game.prefs.reduced_motion else Time.get_ticks_msec() / 1000.0
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
	## The player holds the applied load in the test band; the output trace is
	## the reading. A faulty item sags below the load, which is the evidence —
	## it must not make the test itself impossible to finish.
	func in_band() -> bool:
		var l := float(dial.value)
		return l >= band and l <= band + 12.0
	func _process(_d: float) -> void:
		queue_redraw()
	func _draw() -> void:
		draw_rect(Rect2(Vector2.ZERO, size), Color("041010"))
		var w := size.x - 20
		var top := 34.0
		var lane := (size.y - top - 22.0) * 0.5
		draw_rect(Rect2(10 + w * band / 100.0, top - 2, w * 12.0 / 100.0, lane * 2 + 4), Color(0.35, 0.8, 0.5, 0.22))
		var l := float(dial.value)
		var v := voltage()
		draw_rect(Rect2(10, top, w * clampf(l, 0, 100) / 100.0, lane - 4), Color("98ffb0") if in_band() else Color("ffb35c"))
		draw_rect(Rect2(10, top + lane, w * clampf(v, 0, 100) / 100.0, lane - 4), Color(0.5, 0.85, 1.0, 0.85))
		draw_rect(Rect2(10, size.y - 14, w * progress, 6), Color("98ffb0"))
		draw_string(UIKit.mono, Vector2(10, 24), "负载 %d%% · 输出 %d%%  转旋钮把负载稳在绿区，观察输出" % [dial.value, roundi(v)], HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color(0.7, 0.9, 0.85))
