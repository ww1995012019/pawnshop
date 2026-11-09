extends Page
## Three tools provide observable evidence; interpretation belongs to the player.
const TOOL_IDS := ["TOL-001", "TOL-002", "TOL-005"]
const SETTLE_SECONDS := 1.2
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
var tared := false
var scale_occupied := false
var scale_stable := false
var scale_elapsed := 0.0
var scale_reading := 0.0
var scale_origin := Vector2.ZERO
var drag_origin := Vector2.ZERO
var scale_target := Vector2.ZERO
var scale_pan: ScalePan
var scale_label: Label
var tare_button: Button
var place_button: Button
var record_button: Button
var remove_button: Button
var optical_fixed := false
var optical_position := Vector2.ZERO
var pending_tool := ""

func scene_name() -> String:
	return "workbench"

func hint_text() -> String:
	return "放大镜看标识，紫外线读编号；称重先空秤归零，再放表、等待稳定并记录。可随时查说明书。"

func enter() -> void:
	_build_panels()
	_load_item()
	call_deferred("relayout")

func _build_panels() -> void:
	instrument_panel = left_panel(300)
	var lv := UIKit.vbox(10)
	instrument_panel.add_child(lv)
	instrument_header = UIKit.vbox(10)
	instrument_header.add_child(UIKit.label("检验工具", 24, UIKit.AMBER))
	instrument_header.add_child(UIKit.label("观察实物 · 对照说明书", 16, UIKit.MUTED))
	lv.add_child(instrument_header)
	instrument_list = UIKit.vbox(10)
	lv.add_child(instrument_list)
	for id in TOOL_IDS:
		var b := UIKit.button(GameData.tool(id).name, "secondary", Vector2(0,72),19)
		b.icon = UIKit.tool_icon(id)
		b.expand_icon = true
		b.add_theme_constant_override("icon_max_width", 48)
		b.pressed.connect(func(): _set_tool("" if tool == id else id))
		instrument_list.add_child(b)
		tool_buttons[id] = b
	var manual := UIKit.button("检验说明书", "primary", Vector2(0,60),20)
	manual.name = "watch_manual"
	manual.pressed.connect(func():
		var it = Game.item(it_uid)
		if it != null: shell.open_watch_manual(it.defId))
	lv.add_child(manual)
	detail_panel = side_panel(470)
	var rv := UIKit.vbox(10)
	detail_panel.add_child(rv)
	picker = OptionButton.new()
	picker.custom_minimum_size = Vector2(0,52)
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
	var row := UIKit.grid(2,10)
	for entry in [["翻面 F",flip_item],["实物归位",_home],["回柜台",func(): shell.go("counter")],["去维修",func(): shell.go("repair",it_uid)]]:
		var b := UIKit.button(entry[0],"secondary",Vector2(0,54),20)
		b.pressed.connect(entry[1])
		row.add_child(b)
	rv.add_child(row)
	bench = UIKit.plate()
	add_child(bench)
	bench_body = UIKit.vbox(8)
	bench.add_child(bench_body)
	bench_body.minimum_size_changed.connect(queue_relayout)

func relayout() -> void:
	if not is_instance_valid(instrument_panel): return
	mat_rect = layout_workbench(instrument_panel,detail_panel,bench,300)
	if is_instance_valid(item):
		var next_home := fit_workbench_item(item,mat_rect)
		var offset := next_home-item_home
		item.position += offset
		item.target += offset
		scale_origin += offset
		scale_target = next_home + Vector2(35,20)
		item_home = next_home
		if is_instance_valid(scale_pan): scale_pan.position = scale_target + Vector2(0,90)

func _fill_picker() -> void:
	picker.clear()
	var list := []
	var trade = Game.trade_item()
	if trade != null: list.append(trade)
	list.append_array(Game.state.inventory)
	for it in list:
		picker.add_item(GameData.def(it.defId).name)
		picker.set_item_metadata(picker.item_count-1,it.uid)
		if it.uid == it_uid: picker.select(picker.item_count-1)

func _refresh_info() -> void:
	UIKit.clear(info)
	var it = Game.item(it_uid)
	if it == null:
		info.add_child(UIKit.label("工作台空着。去柜台或仓储挑一只表。",20,UIKit.MUTED,false,true))
		return
	var def := GameData.def(it.defId)
	info.add_child(UIKit.label(def.name,28,UIKit.AMBER))
	info.add_child(UIKit.label(def.description,18,UIKit.TEXT,false,true))
	info.add_child(UIKit.label("工具记录物证，不能单独证明原装、走时或防水。请对照说明书判断。",17,UIKit.MUTED,false,true))
	info.add_child(UIKit.label("首次记录本件消耗 1 AP；后续取证免费。",16,UIKit.MUTED,false,true))
	for id in TOOL_IDS:
		var done: bool = it.evidence.has(id)
		tool_buttons[id].text = GameData.tool(id).name + ("  ✓" if done else "")
		tool_buttons[id].add_theme_stylebox_override("normal",UIKit.key_style("primary" if tool == id else "secondary","normal"))
		if done:
			info.add_child(UIKit.label(GameData.tool(id).name + "：" + Model.displayed_clue(it,id),17,UIKit.CYAN,false,true))

func _load_item() -> void:
	_set_tool("")
	if is_instance_valid(item): item.queue_free()
	var it = Game.workbench_item()
	it_uid = it.uid if it != null else ""
	Game.focus_uid = it_uid
	_fill_picker()
	_refresh_info()
	if it == null: return
	item = ItemSprite.new()
	item.setup(it.defId,it.uid,360.0)
	item.position = item_home
	item.target = item_home
	item.bounds = Rect2(560,330,700,260)
	item.set_reveal(WatchRules.serial(it),Vector2(.5,.62))
	item.flipped.connect(func(_back: bool): _reset_optical_observation())
	add_world(item,"fg")

func _home() -> void:
	if not is_instance_valid(item): return
	if scale_occupied: _scale_remove()
	item.position = item_home
	item.target = item_home

func flip_item() -> void:
	if is_instance_valid(item) and not scale_occupied:
		_reset_optical_observation()
		item.flip()

func _optical_face_visible() -> bool:
	if not is_instance_valid(item) or item.busy: return false
	return (tool == "TOL-001" and not item.back) or (tool == "TOL-002" and item.back)

func _reset_optical_observation() -> void:
	progress = 0.0
	if is_instance_valid(lens_ring):
		lens_ring.progress = 0.0
		lens_ring.queue_redraw()
	if is_instance_valid(item):
		item.mat.set_shader_parameter("uv_r",0.0)
		item.reveal.material.set_shader_parameter("uv_r",0.0)

func _set_tool(id: String) -> void:
	if id != "" and not TOOL_IDS.has(id): return
	if id != "" and Game.item(it_uid) == null: return
	if scale_occupied: _scale_remove()
	tool = id
	progress = 0.0
	optical_fixed = false
	tared = false
	if is_instance_valid(item):
		item.end_drag()
		item.draggable = true
		item.mat.set_shader_parameter("uv_r",0.0)
		item.mat.set_shader_parameter("lens_r",0.0)
		item.reveal.material.set_shader_parameter("uv_r",0.0)
	for n in [lens,wand,uv_light,scale_pan]:
		if is_instance_valid(n): n.queue_free()
	lens = null
	wand = null
	uv_light = null
	scale_pan = null
	shell.ambient_target = shell.ambient_base
	UIKit.clear(bench_body)
	if id == "TOL-005":
		_scale()
	elif id == "TOL-001" or id == "TOL-002":
		_optical(id)
	else:
		bench_body.add_child(UIKit.label("选择工具观察实物；说明书随时可查。",18,UIKit.MUTED,false,true))
	_refresh_info()
	call_deferred("relayout")

func _optical(id: String) -> void:
	var node := Node2D.new()
	node.z_index = 60
	lens_ring = Ring.new()
	lens_ring.radius = 128 if id == "TOL-001" else 90
	node.add_child(lens_ring)
	if id == "TOL-001":
		var glass := Sprite2D.new()
		glass.texture = Util.white(8)
		glass.scale = Vector2.ONE * 250.0/8.0
		var material := ShaderMaterial.new()
		material.shader = load("res://shaders/lens.gdshader")
		glass.material = material
		node.add_child(glass)
		lens = node
	else:
		wand = node
		shell.ambient_target = Color(.17,.15,.27)
		uv_light = PointLight2D.new()
		uv_light.texture = Util.light_tex()
		uv_light.color = Color(.62,.36,1)
		uv_light.energy = 2.4
		add_world(uv_light,"top")
	add_world(node,"top")
	bench_body.add_child(UIKit.label("翻到正面，移动镜片观察表盘标识；停住记录细节。" if id == "TOL-001" else "翻到背面，移动紫外灯照亮隐藏编号；停住记录字符。",18,UIKit.TEXT,false,true))
	var fixed := UIKit.button("定位并固定标识" if id == "TOL-001" else "定位并固定编号","primary",Vector2(0,48),18)
	fixed.pressed.connect(func():
		optical_fixed = not optical_fixed
		optical_position = _optical_target()
		fixed.text = "解除固定" if optical_fixed else "定位并固定观察点")
	bench_body.add_child(fixed)

func _optical_target() -> Vector2:
	return item.logo_world_position() if tool == "TOL-001" else item.reveal_center()

func _scale() -> void:
	scale_pan = ScalePan.new()
	scale_pan.position = item_home+Vector2(35,110)
	scale_pan.z_index = -1
	add_world(scale_pan,"fg")
	scale_label = UIKit.label("0.0 g · 请先空秤归零",22,UIKit.CYAN)
	bench_body.add_child(scale_label)
	var grid := UIKit.grid(2,8)
	for entry in [["空秤归零",_scale_tare],["放到秤上",_scale_place],["记录克数",_scale_record],["取回手表",_scale_remove]]:
		var b := UIKit.button(entry[0],"secondary",Vector2(0,44),18)
		b.pressed.connect(entry[1])
		grid.add_child(b)
	tare_button = grid.get_child(0)
	place_button = grid.get_child(1)
	record_button = grid.get_child(2)
	remove_button = grid.get_child(3)
	bench_body.add_child(grid)
	_scale_controls()

func _scale_tare() -> bool:
	if tool != "TOL-005" or scale_occupied: return false
	tared = true
	scale_reading = 0.0
	_scale_controls()
	return true

func _scale_place() -> bool:
	if tool != "TOL-005" or not tared or scale_occupied or item.busy: return false
	scale_origin = drag_origin if item.dragging else item.position
	item.end_drag()
	item.draggable = false
	scale_occupied = true
	scale_stable = false
	scale_elapsed = 0.0
	scale_reading = 0.0
	_scale_controls()
	return true

func _scale_remove() -> void:
	if not scale_occupied: return
	scale_occupied = false
	scale_stable = false
	scale_elapsed = 0.0
	scale_reading = 0.0
	item.draggable = true
	item.position = scale_origin
	item.target = scale_origin
	if is_instance_valid(scale_pan): scale_pan.depression = 0.0
	_scale_controls()

func _scale_record() -> bool:
	if tool != "TOL-005" or not scale_occupied or not scale_stable: return false
	_record()
	return Game.item(it_uid).evidence.has("TOL-005")

func _scale_controls() -> void:
	if not is_instance_valid(scale_label): return
	tare_button.disabled = scale_occupied
	place_button.disabled = not tared or scale_occupied
	record_button.disabled = not scale_occupied or not scale_stable
	remove_button.disabled = not scale_occupied
	scale_label.text = "%.1f g · %s" % [scale_reading,"稳定 ✓" if scale_stable else "正在稳定…" if scale_occupied else "空秤已归零" if tared else "请先空秤归零"]

func _record() -> void:
	if (tool == "TOL-001" or tool == "TOL-002") and not _optical_face_visible(): return
	var it = Game.item(it_uid)
	if it == null: return
	if it.evidence.has(tool) and Model.displayed_clue(it,tool) == WatchRules.reading(it,tool): return
	Game.dispatch({"type":"CHECK","uid":it_uid,"tool":tool})
	_refresh_info()

func on_changed(_p: Dictionary,_n: Dictionary,_a: Dictionary) -> void:
	_refresh_info()

func world_cursor_shape(p: Vector2) -> int:
	if not is_instance_valid(item) or shell.modal_open(): return Input.CURSOR_ARROW
	if item.dragging: return Input.CURSOR_DRAG
	if tool == "TOL-001" or tool == "TOL-002": return Input.CURSOR_CROSS
	if item.draggable and item.contains(p): return Input.CURSOR_CAN_DROP
	return Input.CURSOR_ARROW

func _unhandled_input(e: InputEvent) -> void:
	if shell.modal_open() or not is_instance_valid(item): return
	var p: Vector2 = shell.world_mouse()
	if e is InputEventMouseButton:
		if e.button_index == MOUSE_BUTTON_LEFT:
			if e.pressed:
				if tool == "" or (tool == "TOL-005" and not scale_occupied):
					if item.contains(p):
						drag_origin = item.position
						item.begin_drag(p)
				elif tool == "TOL-001" or tool == "TOL-002":
					optical_fixed = true
					optical_position = p
			else:
				if item.dragging and tool == "TOL-005" and item.position.distance_to(scale_target)<125:
					_scale_place()
				item.end_drag()
		elif e.button_index == MOUSE_BUTTON_RIGHT and e.pressed: flip_item()
	elif e is InputEventKey and e.pressed and not e.echo:
		if e.keycode == KEY_F: flip_item()
		elif e.keycode >= KEY_1 and e.keycode <= KEY_3: _set_tool(TOOL_IDS[e.keycode-KEY_1])
		elif e.keycode == KEY_ESCAPE: _set_tool("")

func _process(delta: float) -> void:
	if not is_instance_valid(item) or shell.modal_open(): return
	var it = Game.item(it_uid)
	if it == null: return
	var p: Vector2 = shell.world_mouse()
	if item.dragging: item.drag_to(p)
	if tool == "TOL-005" and scale_occupied:
		scale_elapsed += delta
		var f := clampf(scale_elapsed/SETTLE_SECONDS,0.0,1.0)
		var move_f := 1.0 if Game.prefs.reduced_motion else minf(1.0,scale_elapsed/.3)
		item.position = scale_origin.lerp(scale_target,move_f)
		item.target = item.position
		scale_stable = f >= 1.0
		var mass := WatchRules.mass(it)
		scale_reading = mass if scale_stable else maxf(0.0,mass * (1.0 + .08*sin(f*23.0)*(1.0-f)))
		scale_pan.depression = 6.0*f
		scale_pan.queue_redraw()
		_scale_controls()
	elif tool == "TOL-001" or tool == "TOL-002":
		var node: Node2D = lens if tool == "TOL-001" else wand
		var at := optical_position if optical_fixed else p
		node.global_position = at
		if not _optical_face_visible():
			_reset_optical_observation()
			return
		if tool == "TOL-002":
			uv_light.global_position = at
			item.mat.set_shader_parameter("uv_pos",at)
			item.mat.set_shader_parameter("uv_r",230.0)
			item.reveal.material.set_shader_parameter("uv_pos",at)
			item.reveal.material.set_shader_parameter("uv_r",230.0)
		if at.distance_to(_optical_target())<65:
			progress = minf(1.0,progress+delta/.9)
			if progress >= 1.0: _record()
		else: progress = 0.0
		lens_ring.progress = progress
		lens_ring.queue_redraw()

class ScalePan extends Node2D:
	var depression := 0.0
	func _draw() -> void:
		draw_style_box(UIKit.inset_style(12),Rect2(-155,10,310,38))
		draw_rect(Rect2(-135,depression,270,16),Color("b6b6a4"))
		draw_line(Vector2(-135,depression),Vector2(135,depression),Color("f3e6cc"),3)

class Ring extends Node2D:
	var radius := 128.0
	var progress := 0.0
	func _draw() -> void:
		draw_arc(Vector2.ZERO,radius,0,TAU,64,Color("ab9267"),3)
		if progress>0: draw_arc(Vector2.ZERO,radius+6,-PI/2,-PI/2+TAU*progress,64,Color("91dab7"),5)
