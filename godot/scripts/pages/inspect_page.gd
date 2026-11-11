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
var scale_attempt_revision := ""
var optical_fixed := false
var optical_position := Vector2.ZERO
var optical_dragging := false
var optical_pinned := false
var optical_pin_button: Button
var optical_attempt_revision := ""
var pending_tool := ""
var portrait_tools: HBoxContainer

func scene_name() -> String:
	return "workbench"

func hint_text() -> String:
	return "放大镜看标识，紫外线读编号；称重先空秤归零，再放表，稳定后自动记录。可随时查说明书。"

func enter() -> void:
	_build_panels()
	_load_item()
	call_deferred("relayout")

func _build_panels() -> void:
	instrument_panel = left_panel(300)
	var lv := UIKit.vbox(10)
	instrument_panel.add_child(lv)
	instrument_header = UIKit.module_header("检验工具", "观察实物 · 对照说明书", "BENCH / 01")
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
	var manual := UIKit.button("检验说明书", "primary", Vector2(150,44),18)
	manual.name = "watch_manual"
	manual.pressed.connect(func():
		var it = Game.item(it_uid)
		if it != null: shell.open_watch_manual(it.defId))
	add_child(manual)
	manual.position = Vector2(1260,108)
	manual.z_index = 4
	if shell.mobile_mode():
		var records := UIKit.button("检验记录", "secondary", Vector2(130,44),16)
		records.name = "portrait_records"
		records.pressed.connect(_portrait_records)
		add_child(records)
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
	var row := UIKit.grid(4,6)
	row.set_meta("home_parent",rv)
	row.name = "inspection_actions"
	row.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	for entry in [["翻面 F",flip_item],["实物归位",_home],["回柜台",func(): shell.go("counter")],["去维修",func(): shell.go("repair",it_uid)]]:
		var b := UIKit.button(entry[0],"secondary",Vector2(0,54),18)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.set_meta("desktop_caption",entry[0])
		b.pressed.connect(entry[1])
		row.add_child(b)
	rv.add_child(row)
	bench = UIKit.plate()
	add_child(bench)
	bench_body = UIKit.vbox(8)
	if shell.landscape_mode():
		var scroll := ScrollContainer.new()
		scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
		bench.add_child(scroll)
		bench_body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		scroll.add_child(bench_body)
	else: bench.add_child(bench_body)
	bench_body.minimum_size_changed.connect(queue_relayout)

func relayout() -> void:
	if not is_instance_valid(instrument_panel): return
	var action_grid := find_child("inspection_actions",true,false) as GridContainer
	if not shell.landscape_mode() and action_grid.get_parent() == self:
		action_grid.reparent(action_grid.get_meta("home_parent"))
		for key in action_grid.get_children():
			key.text = key.get_meta("desktop_caption")
			key.clip_text = false
			key.custom_minimum_size.y = 54
			key.add_theme_font_size_override("font_size",18)
			for state in ["normal","hover","pressed","disabled"]: key.add_theme_stylebox_override(state,UIKit.key_style("secondary",state))
	# The dedicated records sheet replaces a cramped duplicate note scroller.
	info.get_parent().visible = not shell.mobile_mode()
	if shell.landscape_mode():
		mat_rect = _landscape_layout()
	elif shell.portrait_mode():
		mat_rect = _portrait_layout()
	else:
		instrument_panel.show()
		if is_instance_valid(portrait_tools):
			detail_panel.add_theme_stylebox_override("panel",UIKit.plate_style())
			bench.add_theme_stylebox_override("panel",UIKit.plate_style())
			portrait_tools.hide()
			for id in TOOL_IDS:
				var b: Button = tool_buttons[id]
				if b.get_parent() != instrument_list: b.reparent(instrument_list)
				b.custom_minimum_size = Vector2(0,72)
				b.text = GameData.tool(id).name
				b.clip_text = false
				b.add_theme_font_size_override("font_size",19)
				b.add_theme_constant_override("icon_max_width",48)
				b.icon = UIKit.tool_icon(id)
				for state in ["normal","hover","pressed","disabled"]:
					b.add_theme_stylebox_override(state,UIKit.key_style("primary" if tool==id else "secondary",state))
		mat_rect = layout_workbench(instrument_panel,detail_panel,bench,300)
	for optic in [lens,wand]:
		if is_instance_valid(optic): optic.scale = Vector2.ONE*(.5 if shell.landscape_mode() else 1.0)
	if is_instance_valid(uv_light): uv_light.scale = Vector2(.62,.38)*(.5 if shell.landscape_mode() else 1.0)
	var guide_button := get_node_or_null("watch_manual") as Button
	if guide_button != null: guide_button.position = Vector2(shell.content_rect().end.x-150,shell.content_rect().position.y) if shell.landscape_mode() else Vector2(mat_rect.end.x-158,mat_rect.position.y+12)
	var records := get_node_or_null("portrait_records") as Button
	if records != null:
		records.visible = shell.mobile_mode()
		records.position = Vector2(shell.content_rect().end.x-292,shell.content_rect().position.y) if shell.landscape_mode() else mat_rect.position+Vector2(12,12)
	if is_instance_valid(item):
		var fitting := mat_rect
		if shell.landscape_mode() and tool == "TOL-005": fitting.size.y -= 48
		var next_home := fit_workbench_item(item,fitting)
		var offset := next_home-item_home
		item.position += offset
		item.target += offset
		scale_origin += offset
		scale_target = next_home + Vector2(35,20)
		item_home = next_home
		if is_instance_valid(scale_pan):
			if shell.landscape_mode():
				scale_pan.scale = Vector2.ONE*minf(1.0,(mat_rect.size.x-8)/310.0)
				scale_pan.position = shell.ui_to_world(Vector2(mat_rect.get_center().x,mat_rect.end.y-50))
				scale_target = scale_pan.position-Vector2(0,item.tex_size().y*item.display_scale*.5-4)
			else:
				scale_pan.scale = Vector2.ONE
				scale_pan.position = scale_target + Vector2(0,90)

func prepare_close_workspace() -> void:
	optical_dragging = false
	if is_instance_valid(item) and item.dragging: item.end_drag()

func _landscape_layout() -> Rect2:
	var r: Rect2 = shell.content_rect()
	instrument_panel.hide()
	if not is_instance_valid(portrait_tools):
		portrait_tools = UIKit.hbox(4)
		add_child(portrait_tools)
	portrait_tools.show()
	portrait_tools.position = r.position
	portrait_tools.size = Vector2(r.size.x-300,44)
	for id in TOOL_IDS:
		var key: Button = tool_buttons[id]
		if key.get_parent() != portrait_tools: key.reparent(portrait_tools)
		key.custom_minimum_size = Vector2(0,44)
		key.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		key.add_theme_font_size_override("font_size",14)
		key.text = {"TOL-001":"放大镜","TOL-002":"紫外灯","TOL-005":"电子秤"}[id]
		key.clip_text = true
		PortraitSkin.button(key)
		key.icon = null
	var actions := find_child("inspection_actions",true,false) as GridContainer
	if actions.get_parent() != self: actions.reparent(self)
	actions.position = Vector2(r.position.x,r.end.y-44)
	actions.size = Vector2(r.size.x-256,44)
	for key in actions.get_children():
		key.custom_minimum_size = Vector2(0,44)
		key.add_theme_font_size_override("font_size",14)
		key.text = {"翻面 F":"翻面","实物归位":"归位","回柜台":"回柜台","去维修":"去维修"}.get(key.get_meta("desktop_caption"),key.text)
		key.clip_text = true
		PortraitSkin.button(key)
	var sidebar := 248.0
	detail_panel.position = Vector2(r.end.x-sidebar,r.position.y+52)
	detail_panel.size = Vector2(sidebar,52)
	detail_panel.add_theme_stylebox_override("panel",PortraitSkin.panel("wine",4))
	bench.position = Vector2(r.end.x-sidebar,r.position.y+110)
	bench.size = Vector2(sidebar,r.size.y-110)
	bench.add_theme_stylebox_override("panel",PortraitSkin.panel("wine",8))
	var mat := Rect2(r.position+Vector2(0,52),Vector2(r.size.x-sidebar-8,r.size.y-102))
	for node in bench_body.find_children("*","Label",true,false):
		node.add_theme_font_size_override("font_size",15)
		node.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		node.custom_minimum_size.x = 0
	shell.work_surface.set_mat(mat)
	return mat

func _portrait_records() -> void:
	var current = Game.item(it_uid)
	var modal: Array = shell.modal("检验记录",350)
	if current == null:
		modal[0].add_child(UIKit.label("请先选择一件物品。",17))
		return
	modal[0].add_child(UIKit.label(GameData.def(current.defId).name,22,UIKit.AMBER,false,true))
	modal[0].add_child(UIKit.label(Model.appraisal_text(current),17,UIKit.TEXT,false,true))
	for evidence in current.evidence:
		modal[0].add_child(UIKit.label(Model.evidence_caption(current,evidence),18,UIKit.AMBER,false,true))
		modal[0].add_child(UIKit.label(Model.displayed_clue(current,evidence),17,UIKit.TEXT,false,true))
	if current.evidence.is_empty():
		modal[0].add_child(UIKit.label("尚无检验记录。使用工具观察实物，对照说明书判断。",17,UIKit.MUTED,false,true))

func _portrait_layout() -> Rect2:
	var r: Rect2 = shell.content_rect()
	instrument_panel.hide()
	detail_panel.add_theme_stylebox_override("panel",PortraitSkin.panel("wine",12))
	bench.add_theme_stylebox_override("panel",PortraitSkin.panel("felt",12))
	if not is_instance_valid(portrait_tools):
		portrait_tools = UIKit.hbox(4)
		add_child(portrait_tools)
	portrait_tools.show()
	for id in TOOL_IDS:
		var b: Button = tool_buttons[id]
		if b.get_parent() != portrait_tools: b.reparent(portrait_tools)
		b.custom_minimum_size = Vector2(0,54)
		b.text = GameData.tool(id).name
		b.clip_text = false
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.add_theme_font_size_override("font_size",14)
		b.add_theme_constant_override("icon_max_width",24)
		b.icon = PortraitSkin.tool(id)
		PortraitSkin.button(b)
	portrait_tools.position = r.position
	portrait_tools.size = Vector2(r.size.x,54)
	var bottom_height := maxf(100.0,bench.get_combined_minimum_size().y)
	var mat := Rect2(r.position+Vector2(0,62),Vector2(r.size.x,220))
	bench.position = Vector2(r.position.x,mat.end.y+8)
	bench.size = Vector2(r.size.x,bottom_height)
	detail_panel.position = Vector2(r.position.x,bench.position.y+bottom_height+8)
	detail_panel.size = Vector2(r.size.x,maxf(110,r.end.y-detail_panel.position.y))
	# Controls below the notes use two rows on a phone.
	for child in detail_panel.find_children("*","GridContainer",true,false): child.columns = 2
	shell.work_surface.set_mat(mat)
	return mat

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
	info.add_child(UIKit.module_header(def.name, String(def.description).split("。")[0] + "。", "实物档案"))
	info.add_child(UIKit.label("型号档次：%s" % GameData.tier_label(it.defId), 17, UIKit.RUST))
	if GameData.def(it.defId).get("tier") in ["luxury","ultra"]:
		var distinction := UIKit.hbox(8)
		distinction.add_child(UIKit.tier_badge(it.defId))
		distinction.add_child(UIKit.label("珍稀型号 · 穹铸工艺" if GameData.def(it.defId).get("tier")=="ultra" else "名贵型号 · 金饰徽章", 16, UIKit.AMBER))
		info.add_child(distinction)
	var appraisal := Model.estimate(it)
	var price_text := "估价 %s–%s Cr" % [Model.jnum(appraisal.low), Model.jnum(appraisal.high)]
	info.add_child(UIKit.note_card("检验估价 · %d/3" % appraisal.count, price_text + "\n鉴定只提供参考范围；加工或维修后复测不耗 AP，用电另计。"))
	info.add_child(UIKit.label("观察记录 · %d / %d" % [it.evidence.size(), TOOL_IDS.size()], 17, UIKit.AMBER))
	var pending: Array[String] = []
	for index in TOOL_IDS.size():
		var id: String = TOOL_IDS[index]
		var done: bool = it.evidence.has(id)
		var fresh: bool = done and it.get("inspectionFacts", {}).get(id, {}).get("appraisalRevision", "") == Model.appraisal_revision(it)
		var problem := _tool_problem(id)
		tool_buttons[id].disabled = problem != ""
		tool_buttons[id].tooltip_text = problem
		if problem != "": info.add_child(UIKit.label(problem, 16, UIKit.DANGER, false, true))
		tool_buttons[id].text = GameData.tool(id).name + ("  ✓" if fresh else " · 复测" if done else "")
		tool_buttons[id].add_theme_stylebox_override("normal",UIKit.key_style("primary" if tool == id else "secondary","normal"))
		if done:
			info.add_child(UIKit.record_card(Model.evidence_caption(it, id), Model.displayed_clue(it, id), "物证 / %02d%s" % [index + 1, " · 需复测" if not fresh else ""]))
		if not fresh:
			pending.append("%02d %s" % [index + 1, GameData.tool(id).name])
	if not pending.is_empty():
		info.add_child(UIKit.label("待检：" + " / ".join(pending), 16, UIKit.MUTED, false, true))
	info.add_child(UIKit.note_card("检验须知", "单项物证不能证明原装、走时或防水。三项当前记录齐全后缩小估价范围，仍需自行议价。重描、覆印和配重会留下对应加工痕迹。\n首次记录本件消耗 1 AP；后续取证不耗 AP。紫外与称重各按新的有效读数计电费，重复查看旧结果不收费。"))

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
	item.flip_finished.connect(func(_back: bool): _orient_for_tool())
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
	optical_attempt_revision = ""
	if is_instance_valid(lens_ring):
		lens_ring.progress = 0.0
		lens_ring.queue_redraw()
	if is_instance_valid(item):
		item.mat.set_shader_parameter("uv_r",0.0)
		item.mat.set_shader_parameter("lens_r",0.0)
		item.reveal.material.set_shader_parameter("uv_r",0.0)

func _orient_for_tool() -> void:
	if pending_tool == "" or not is_instance_valid(item) or item.busy: return
	var needs_back := pending_tool == "TOL-002"
	pending_tool = ""
	if item.back != needs_back: item.flip()

func _tool_problem(id: String) -> String:
	if id == "TOL-002": return StoreCosts.device_problem(Game.state, "uv")
	if id == "TOL-005": return StoreCosts.device_problem(Game.state, "scale")
	return ""

func _power_copy(id: String) -> String:
	if id not in ["TOL-002", "TOL-005"]: return ""
	var charge := StoreCosts.usage_quote(Game.state, "uv" if id == "TOL-002" else "scale", 0.5)
	if charge <= 0: return "本日沿用旧版能源维护，不另计作业电费。"
	return "本次预计电费 +%s Cr，成功记录新的有效读数后，日结时统一收取。" % Model.jnum(charge)

func _set_tool(id: String) -> void:
	if id != "" and not TOOL_IDS.has(id): return
	if id != "" and Game.item(it_uid) == null: return
	var problem := _tool_problem(id)
	if problem != "":
		shell.toast(problem)
		return
	if scale_occupied: _scale_remove()
	tool = id
	pending_tool = id if id in ["TOL-001", "TOL-002"] else ""
	progress = 0.0
	optical_fixed = false
	optical_pinned = false
	optical_dragging = false
	optical_attempt_revision = ""
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
		bench_body.add_child(UIKit.label("选择工具观察实物；检验记录和说明书随时可查。",15,UIKit.TEXT,false,true) if shell.landscape_mode() else UIKit.module_header("工作台待命", "选择工具观察实物；说明书随时可查。", "READY"))
	_orient_for_tool()
	_refresh_info()
	call_deferred("relayout")

func _optical(id: String) -> void:
	var node := Node2D.new()
	node.z_index = 60
	lens_ring = Ring.new()
	lens_ring.radius = 128
	if shell.landscape_mode(): node.scale = Vector2.ONE*.5
	lens_ring.ultraviolet = id == "TOL-002"
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
		uv_light.energy = 1.5
		uv_light.scale = Vector2(.62,.38)
		add_world(uv_light,"top")
	add_world(node,"top")
	bench_body.add_child(UIKit.label("移动镜片观察表盘标识；停住记录细节。" if id == "TOL-001" else "移动紫外灯照亮后盖编号；停住记录字符。",18,UIKit.TEXT,false,true))
	var fixed := UIKit.button("定位并固定标识" if id == "TOL-001" else "定位并固定编号","primary",Vector2(0,48),18)
	optical_pin_button = fixed
	fixed.pressed.connect(func():
		optical_pinned = not optical_pinned
		optical_fixed = optical_pinned
		optical_dragging = false
		optical_position = _optical_target()
		fixed.text = "解除固定" if optical_pinned else "定位并固定观察点")
	bench_body.add_child(fixed)
	if id == "TOL-002": bench_body.add_child(UIKit.label(_power_copy(id), 16, UIKit.CYAN, false, true))

func _optical_target() -> Vector2:
	return item.logo_world_position() if tool == "TOL-001" else item.reveal_center()

func _scale() -> void:
	scale_pan = ScalePan.new()
	scale_pan.position = item_home+Vector2(35,110)
	scale_pan.z_index = -1
	add_world(scale_pan,"fg")
	scale_label = UIKit.label("0.0 g · 请先空秤归零",22,UIKit.CYAN)
	bench_body.add_child(scale_label)
	bench_body.add_child(UIKit.label(_power_copy("TOL-005"), 16, UIKit.CYAN, false, true))
	var grid := UIKit.grid(2,8)
	grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	for entry in [["空秤归零",_scale_tare],["放到秤上",_scale_place]]:
		var b := UIKit.button(entry[0],"secondary",Vector2(0,44),18)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.pressed.connect(entry[1])
		grid.add_child(b)
	tare_button = grid.get_child(0)
	place_button = grid.get_child(1)
	bench_body.add_child(grid)
	_scale_controls()

func _scale_tare() -> bool:
	if tool != "TOL-005" or _tool_problem(tool) != "": return false
	if scale_occupied: _scale_remove()
	tared = true
	scale_reading = 0.0
	_scale_controls()
	return true

func _scale_place() -> bool:
	if tool != "TOL-005" or _tool_problem(tool) != "" or not tared or item.busy: return false
	if scale_occupied: _scale_remove()
	scale_origin = drag_origin if item.dragging else item.position
	item.end_drag()
	item.draggable = false
	scale_occupied = true
	scale_stable = false
	scale_elapsed = 0.0
	scale_attempt_revision = ""
	scale_reading = 0.0
	_scale_controls()
	return true

func _scale_remove() -> void:
	if not scale_occupied: return
	scale_occupied = false
	scale_stable = false
	scale_elapsed = 0.0
	scale_attempt_revision = ""
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
	tare_button.disabled = _tool_problem(tool) != ""
	place_button.disabled = not tared or _tool_problem(tool) != ""
	place_button.text = "重新称量" if scale_occupied else "放到秤上"
	scale_label.text = "%.1f g · %s" % [scale_reading,"稳定 ✓" if scale_stable else "正在稳定…" if scale_occupied else "空秤已归零" if tared else "请先空秤归零"]

func _record() -> void:
	if _tool_problem(tool) != "": return
	if (tool == "TOL-001" or tool == "TOL-002") and not _optical_face_visible(): return
	var it = Game.item(it_uid)
	if it == null: return
	if it.evidence.has(tool) and Model.displayed_clue(it,tool) == WatchRules.reading(it,tool) and it.get("inspectionFacts", {}).get(tool, {}).get("appraisalRevision", "") == Model.appraisal_revision(it): return
	Game.dispatch({"type":"CHECK","uid":it_uid,"tool":tool})
	_refresh_info()

func on_changed(_p: Dictionary,_n: Dictionary,_a: Dictionary) -> void:
	if _tool_problem(tool) != "": _set_tool("")
	_refresh_info()

func world_cursor_shape(p: Vector2) -> int:
	if not is_instance_valid(item) or shell.modal_open(): return Input.CURSOR_ARROW
	if item.dragging: return Input.CURSOR_DRAG
	if tool == "TOL-001" or tool == "TOL-002": return Input.CURSOR_CROSS
	if item.draggable and item.contains(p): return Input.CURSOR_CAN_DROP
	return Input.CURSOR_ARROW

func _unhandled_input(e: InputEvent) -> void:
	if shell.modal_open() or not is_instance_valid(item): return
	if e is InputEventMouse and not shell.world_pointer_available(): return
	var p: Vector2 = shell.world_mouse()
	if e is InputEventMouseButton:
		if e.button_index == MOUSE_BUTTON_LEFT:
			if e.pressed:
				if tool == "" or (tool == "TOL-005" and not scale_occupied):
					if item.contains(p):
						drag_origin = item.position
						item.begin_drag(p)
				elif (tool == "TOL-001" or tool == "TOL-002") and mat_rect.has_point(shell.world_to_ui(p)):
					optical_fixed = true
					optical_pinned = false
					optical_dragging = true
					optical_position = p
					if is_instance_valid(optical_pin_button): optical_pin_button.text = "定位并固定标识" if tool == "TOL-001" else "定位并固定编号"
			else:
				optical_dragging = false
				if item.dragging and tool == "TOL-005" and item.position.distance_to(scale_target)<125:
					_scale_place()
				item.end_drag()
		elif e.button_index == MOUSE_BUTTON_RIGHT and e.pressed: flip_item()
	elif e is InputEventKey and e.pressed and not e.echo:
		if e.keycode == KEY_F: flip_item()
		elif e.keycode >= KEY_1 and e.keycode <= KEY_3: _set_tool(TOOL_IDS[e.keycode-KEY_1])
		elif e.keycode == KEY_ESCAPE: _set_tool("")

func _process(delta: float) -> void:
	if not is_instance_valid(item): return
	var modal_blocked: bool = shell.modal_open() or (shell.workspace_mode and shell.workspace_parent.modal_open())
	if tool == "TOL-001" or tool == "TOL-002":
		var optical: Node2D = lens if tool == "TOL-001" else wand
		var available: bool = not modal_blocked and (optical_pinned or shell.world_pointer_available())
		optical.visible = available
		if is_instance_valid(uv_light): uv_light.visible = available
		if not available:
			# Pause partial observation; recorded evidence and the explicit pin
			# remain intact. Hidden tools must not expose the physical texture.
			item.mat.set_shader_parameter("lens_r",0.0)
			item.mat.set_shader_parameter("uv_r",0.0)
			item.reveal.material.set_shader_parameter("uv_r",0.0)
			return
	if modal_blocked: return
	if _tool_problem(tool) != "":
		_set_tool("")
		return
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
		if scale_stable:
			var revision := Model.appraisal_revision(it)+":"+str(Game.state.ap)
			if revision != scale_attempt_revision:
				scale_attempt_revision = revision
				_scale_record()
				var current = Game.item(it_uid)
				if current != null: scale_attempt_revision = Model.appraisal_revision(current)+":"+str(Game.state.ap)
		_scale_controls()
	elif tool == "TOL-001" or tool == "TOL-002":
		var node: Node2D = lens if tool == "TOL-001" else wand
		if optical_dragging:
			if Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT): optical_position = p
			else: optical_dragging = false
		var at := optical_position if optical_fixed else p
		node.global_position = at
		if not _optical_face_visible():
			_reset_optical_observation()
			return
		if tool == "TOL-001":
			item.mat.set_shader_parameter("lens_pos",at)
			item.mat.set_shader_parameter("lens_r",125.0*node.scale.x)
		if tool == "TOL-002":
			uv_light.global_position = at
			item.mat.set_shader_parameter("uv_pos",at)
			item.mat.set_shader_parameter("uv_r",150.0*node.scale.x)
			item.reveal.material.set_shader_parameter("uv_pos",at)
			item.reveal.material.set_shader_parameter("uv_r",150.0*node.scale.x)
		if at.distance_to(_optical_target())<65:
			progress = minf(1.0,progress+delta/.9)
			if progress >= 1.0:
				var revision := Model.appraisal_revision(it)+":"+str(Game.state.ap)
				if revision != optical_attempt_revision:
					optical_attempt_revision = revision
					_record()
					var current = Game.item(it_uid)
					if current != null: optical_attempt_revision = Model.appraisal_revision(current)+":"+str(Game.state.ap)
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
	var ultraviolet := false
	var radius := 128.0
	var progress := 0.0
	func _draw() -> void:
		if ultraviolet:
			draw_texture_rect(Util.radial(256,.22),Rect2(-150,-92,300,184),false,Color(.55,.28,.94,.24))
			return
		draw_arc(Vector2.ZERO,radius,0,TAU,64,Color("ab9267"),3)
		if progress>0: draw_arc(Vector2.ZERO,radius+6,-PI/2,-PI/2+TAU*progress,64,Color("91dab7"),5)
