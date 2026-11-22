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
var detail_scroll: ScrollContainer
var info: VBoxContainer
var bench: PanelContainer
var bench_scroll: ScrollContainer
var bench_body: VBoxContainer
var inspection_status: Label
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
var scale_status: Label
var tare_button: Button
var place_button: Button
var scale_attempt_revision := ""
var optical_fixed := false
var optical_position := Vector2.ZERO
var optical_dragging := false
var optical_grab := Vector2.ZERO
var optical_pinned := false
var optical_pin_button: Button
var optical_attempt_revision := ""
var finding_panel: Panel
var finding_label: Label
var compact_finding: Label
var finding_tween: Tween
var finding_revision := ""
var pending_tool := ""
var portrait_tools: HBoxContainer
var rules_expanded := false

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
	detail_scroll = ScrollContainer.new()
	detail_scroll.name = "inspection_detail_scroll"
	detail_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	detail_scroll.follow_focus = true
	detail_panel.add_child(detail_scroll)
	var rv := UIKit.vbox(10)
	rv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	rv.size_flags_vertical = Control.SIZE_EXPAND_FILL
	detail_scroll.add_child(rv)
	picker = UIKit.option_button()
	picker.item_selected.connect(func(i):
		Game.focus_uid = picker.get_item_metadata(i)
		_load_item())
	rv.add_child(picker)
	inspection_status = UIKit.label("",16,UIKit.INK,false,true)
	inspection_status.name = "inspection_status"
	inspection_status.hide()
	rv.add_child(inspection_status)
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
	bench_scroll = ScrollContainer.new()
	bench_scroll.name = "inspection_instruction_scroll"
	bench_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	bench.add_child(bench_scroll)
	bench_body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var instructions := UIKit.vbox(6)
	instructions.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	bench_scroll.add_child(instructions)
	compact_finding = UIKit.label("",14,UIKit.INK,false,true)
	compact_finding.name = "compact_inspection_finding"
	compact_finding.hide()
	instructions.add_child(compact_finding)
	instructions.add_child(bench_body)
	bench_body.minimum_size_changed.connect(queue_relayout)
	finding_panel = Panel.new()
	finding_panel.name = "inspection_finding"
	finding_panel.add_theme_stylebox_override("panel",UIKit.paper_style(6))
	finding_panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	finding_label = UIKit.label("",15,UIKit.INK,false,true)
	finding_label.clip_text = true
	finding_label.vertical_alignment = VERTICAL_ALIGNMENT_TOP
	finding_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	finding_panel.add_child(finding_label)
	add_child(finding_panel)
	finding_panel.hide()

func relayout() -> void:
	if not is_instance_valid(instrument_panel): return
	detail_scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO if shell.portrait_mode() else ScrollContainer.SCROLL_MODE_DISABLED
	if not shell.portrait_mode():
		bench_scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO if shell.landscape_mode() else ScrollContainer.SCROLL_MODE_DISABLED
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
		mat_rect = _desktop_layout()
	for optic in [lens,wand]:
		if is_instance_valid(optic): optic.scale = Vector2.ONE*(.5 if shell.landscape_mode() else minf(1.0,(mat_rect.size.y-16)/340.0) if optic == lens else 1.0)
	if is_instance_valid(lens):
		optical_position = _clamp_lens_position(optical_position)
		lens.global_position = optical_position
	if is_instance_valid(uv_light): uv_light.scale = Vector2(.62,.38)*(.5 if shell.landscape_mode() else 1.0)
	var action_budget := maxf(0,mat_rect.size.x-32)
	var guide_width := minf(150,action_budget*.54) if shell.portrait_mode() else 150.0
	var records_width := minf(130,action_budget*.46) if shell.portrait_mode() else 130.0
	var guide_button := get_node_or_null("watch_manual") as Button
	if guide_button != null:
		var content: Rect2 = shell.content_rect()
		guide_button.position = Vector2(content.end.x-104,content.position.y) if shell.landscape_mode() else Vector2(mat_rect.end.x-guide_width,content.position.y)
		if shell.portrait_mode():
			guide_button.position = Vector2(mat_rect.end.x-12-guide_width,mat_rect.position.y+12)
		guide_button.custom_minimum_size = Vector2(104,30) if shell.landscape_mode() else Vector2(guide_width,44 if shell.mobile_mode() else 52)
		guide_button.size = guide_button.custom_minimum_size
	var records := get_node_or_null("portrait_records") as Button
	if records != null:
		records.visible = shell.mobile_mode()
		records.custom_minimum_size = Vector2(98,30) if shell.landscape_mode() else Vector2(records_width,44)
		records.size = records.custom_minimum_size
		records.position = Vector2(shell.content_rect().end.x-208,shell.content_rect().position.y) if shell.landscape_mode() else mat_rect.position+Vector2(12,12)
	if is_instance_valid(item):
		var fitting := mat_rect
		if is_instance_valid(scale_pan):
			var scale_size := minf(1.0,(mat_rect.size.x-16)/scale_pan.body_rect().size.x)
			scale_pan.scale = Vector2.ONE * scale_size
			scale_pan.position = shell.ui_to_world(Vector2(mat_rect.get_center().x,mat_rect.end.y-8-scale_pan.body_rect().end.y*scale_size))
			# The portrait paper actions occupy a real row above the watch.
			# Fit the complete original below that row, rather than behind it.
			if shell.portrait_mode(): fitting.position.y += 64
			fitting.size.y = maxf(40,shell.world_to_ui(scale_pan.to_global(scale_pan.pan_position())).y-fitting.position.y)
		var next_home := fit_workbench_item(item,fitting,28.0) if is_instance_valid(scale_pan) else fit_workbench_item(item,fitting)
		var offset := next_home-item_home
		item.position += offset
		item.target += offset
		scale_origin += offset
		scale_target = next_home + Vector2(35,20)
		item_home = next_home
		if is_instance_valid(scale_pan):
			scale_target = scale_pan.to_global(scale_pan.pan_position())-Vector2(0,item.tex_size().y*item.display_scale*.5)
		if optical_pinned: optical_position = _optical_target()
	_layout_scale_console()
	if is_instance_valid(optical_pin_button):
		var height := minf(maxf(44,44/maxf(shell.touch_scale(),.1)),maxf(30,mat_rect.size.y*.42))
		optical_pin_button.size = Vector2(maxf(112,optical_pin_button.get_combined_minimum_size().x),height)
		optical_pin_button.position = mat_rect.end-optical_pin_button.size-Vector2(6,6)
	_layout_finding()

func _layout_finding() -> void:
	if not finding_panel.visible and not compact_finding.visible: return
	var padding := Vector2(8,5)
	var left := mat_rect.position.x+6
	var right := mat_rect.end.x-6
	var watch_half := item.tex_size().x*item.display_scale*.5
	var watch_left: float = shell.world_to_ui(item.position-Vector2(watch_half,0)).x
	var watch_right: float = shell.world_to_ui(item.position+Vector2(watch_half,0)).x
	if tool in ["TOL-001","TOL-002"] and is_instance_valid(lens_ring):
		var optic := lens if tool=="TOL-001" else wand
		var radius := float(lens_ring.radius)*optic.scale.x+4
		watch_left = minf(watch_left,shell.world_to_ui(_optical_target()-Vector2(radius,0)).x)
		watch_right = maxf(watch_right,shell.world_to_ui(_optical_target()+Vector2(radius,0)).x)
	var available := watch_left-left-6
	var on_right := right-watch_right-6>available+24
	if on_right: available = right-watch_right-6
	var natural_width := 0.0
	var font := finding_label.get_theme_font("font")
	for line in finding_label.text.split("\n"):
		natural_width = maxf(natural_width,font.get_string_size(line,HORIZONTAL_ALIGNMENT_LEFT,-1,finding_label.get_theme_font_size("font_size")).x)
	var width := maxf(1,minf(natural_width+padding.x*2+2,available))
	finding_label.position = padding
	finding_label.size.x = maxf(1,width-padding.x*2)
	var lines := finding_label.get_line_count()
	var height := float(maxi(0,lines-1)*finding_label.get_theme_constant("line_spacing"))
	for i in lines: height += finding_label.get_line_height(i)
	finding_label.size.y = height
	var use_details: bool = shell.landscape_mode() and (available<120 or height+padding.y*2+12>mat_rect.size.y)
	if use_details:
		var lines_of_text := finding_label.text.split("\n",true,1)
		var reading := lines_of_text[0].split(" · ",true,1)
		compact_finding.text = String(lines_of_text[1])+"\n"+String(reading[-1]).trim_prefix("可见标识：")
		if not compact_finding.visible: bench_scroll.scroll_vertical = 0
	compact_finding.visible = use_details
	finding_panel.visible = not use_details
	if use_details: return
	finding_panel.size = Vector2(width,height+padding.y*2)
	finding_panel.position = Vector2(right-width if on_right else left,mat_rect.position.y+(62 if shell.portrait_mode() else 6))

func _layout_scale_console() -> void:
	if not is_instance_valid(instrument) or not is_instance_valid(scale_pan): return
	# Keep real GUI controls in the page's keyboard/touch tree while their
	# visible surface follows the same physical housing in the world layer.
	var projection := get_global_transform_with_canvas().affine_inverse()*scale_pan.get_global_transform_with_canvas()
	instrument.position = projection.origin
	instrument.scale = projection.get_scale()

func _desktop_layout() -> Rect2:
	var r: Rect2 = shell.content_rect()
	instrument_panel.hide()
	detail_panel.show()
	bench.show()
	detail_panel.add_theme_stylebox_override("panel",UIKit.plate_style())
	bench.add_theme_stylebox_override("panel",UIKit.plate_style())
	if not is_instance_valid(portrait_tools):
		portrait_tools = UIKit.hbox(8)
		add_child(portrait_tools)
	# The drawer keyboard bridge follows scene order; tools lead every layout.
	move_child(portrait_tools,0)
	portrait_tools.show()
	var width := r.size.x-490.0
	portrait_tools.position = r.position
	portrait_tools.size = Vector2(width-158,52)
	for id in TOOL_IDS:
		var key: Button = tool_buttons[id]
		if key.get_parent() != portrait_tools: key.reparent(portrait_tools)
		key.custom_minimum_size = Vector2(0,52)
		key.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		key.text = {"TOL-001":"放大镜","TOL-002":"紫外灯","TOL-005":"电子秤"}[id]
		key.clip_text = false
		key.icon = UIKit.tool_icon(id)
		key.add_theme_font_size_override("font_size",18)
		key.add_theme_constant_override("icon_max_width",32)
		for state in ["normal","hover","pressed","disabled"]:
			key.add_theme_stylebox_override(state,UIKit.key_style("primary" if tool==id else "secondary",state))
	detail_panel.position = Vector2(r.end.x-470,r.position.y)
	detail_panel.size = Vector2(470,r.size.y)
	var height := maxf(84,bench.get_combined_minimum_size().y)
	bench.position = Vector2(r.position.x,r.end.y-height)
	bench.size = Vector2(width,height)
	var mat := Rect2(r.position+Vector2(0,64),Vector2(width,r.size.y-height-84))
	shell.work_surface.set_mat(mat)
	return mat

func prepare_close_workspace() -> void:
	optical_dragging = false
	if is_instance_valid(item) and item.dragging: item.end_drag()

func show_status(text: String, tone: String) -> void:
	inspection_status.text = text
	inspection_status.visible = not text.is_empty()
	inspection_status.add_theme_color_override("font_color",UIKit.INK if tone == "info" else UIKit.DANGER)

func _landscape_layout() -> Rect2:
	var r: Rect2 = shell.content_rect()
	instrument_panel.hide()
	if not is_instance_valid(portrait_tools):
		portrait_tools = UIKit.hbox(4)
		add_child(portrait_tools)
	# The drawer keyboard bridge follows scene order; tools lead every layout.
	move_child(portrait_tools,0)
	portrait_tools.show()
	portrait_tools.position = r.position
	portrait_tools.size = Vector2(r.size.x-220,30)
	for id in TOOL_IDS:
		var key: Button = tool_buttons[id]
		if key.get_parent() != portrait_tools: key.reparent(portrait_tools)
		key.custom_minimum_size = Vector2(0,30)
		key.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		key.add_theme_font_size_override("font_size",14)
		key.text = {"TOL-001":"放大镜","TOL-002":"紫外灯","TOL-005":"电子秤"}[id]
		key.clip_text = true
		PortraitSkin.button(key,false,true)
		key.icon = null
	var actions := find_child("inspection_actions",true,false) as GridContainer
	if actions.get_parent() != self: actions.reparent(self)
	actions.position = Vector2(r.position.x,r.end.y-30)
	actions.size = Vector2(r.size.x-208,30)
	for key in actions.get_children():
		key.custom_minimum_size = Vector2(0,30)
		key.add_theme_font_size_override("font_size",14)
		key.text = {"翻面 F":"翻面","实物归位":"归位","回柜台":"回柜台","去维修":"去维修"}.get(key.get_meta("desktop_caption"),key.text)
		key.clip_text = true
		PortraitSkin.button(key,false,true)
	var sidebar := 200.0
	detail_panel.position = Vector2(r.end.x-sidebar,r.position.y+36)
	detail_panel.size = Vector2(sidebar,30)
	detail_panel.add_theme_stylebox_override("panel",PortraitSkin.panel("wine",4))
	picker.expand_icon = true
	picker.add_theme_constant_override("icon_max_width",18)
	bench.position = Vector2(r.end.x-sidebar,r.position.y+72)
	bench.size = Vector2(sidebar,r.size.y-72)
	bench.add_theme_stylebox_override("panel",PortraitSkin.panel("wine",8))
	var mat := Rect2(r.position+Vector2(0,36),Vector2(r.size.x-sidebar-8,r.size.y-72))
	for node in bench_body.find_children("*","Label",true,false):
		node.add_theme_font_size_override("font_size",13)
		node.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		node.custom_minimum_size.x = 0
	for node in bench_body.find_children("*","Button",true,false):
		node.custom_minimum_size.y = 30
		node.add_theme_font_size_override("font_size",13)
	shell.work_surface.set_mat(mat)
	return mat

func _portrait_records() -> void:
	var current = Game.item(it_uid)
	var modal: Array = shell.modal("检验记录",350)
	if current == null:
		modal[0].add_child(UIKit.label("请先选择一件物品。",17))
		return
	modal[0].add_child(UIKit.label(GameData.def(current.defId).name,22,UIKit.AMBER,false,true))
	var appraisal := Model.estimate(current)
	modal[0].add_child(UIKit.label(_price_summary(current.uid,appraisal),18,UIKit.TEXT,false,true))
	modal[0].add_child(UIKit.label("已验 %d / %d" % [appraisal.count,TOOL_IDS.size()],16,UIKit.AMBER))
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
	# The drawer keyboard bridge follows scene order; tools lead every layout.
	move_child(portrait_tools,0)
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
	var mat := Rect2(r.position+Vector2(0,62),Vector2(r.size.x,280 if tool == "TOL-005" else 220))
	bench.position = Vector2(r.position.x,mat.end.y+8)
	var bottom_height := maxf(100,bench_body.get_combined_minimum_size().y+bench.get_theme_stylebox("panel").get_minimum_size().y)
	var remaining := r.end.y-bench.position.y-8
	var compact_notes := remaining-bottom_height < 80
	if compact_notes:
		# Keep a full action row reachable on a short phone. Only these two
		# paper panels scroll; the physical watch and instrument stay fixed.
		bottom_height = minf(bottom_height,maxf(24,remaining-80))
	bench_scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO if compact_notes else ScrollContainer.SCROLL_MODE_DISABLED
	bench.size = Vector2(r.size.x,bottom_height)
	detail_panel.position = Vector2(r.position.x,bench.position.y+bottom_height+8)
	detail_panel.size = Vector2(r.size.x,maxf(1,r.end.y-detail_panel.position.y))
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

func _price_summary(uid: String, appraisal: Dictionary) -> String:
	var estimate := "估价 %s–%s Cr" % [Model.jnum(appraisal.low),Model.jnum(appraisal.high)]
	var trade = Game.state.trade
	if trade != null and trade.kind in ["buy","sell"]:
		var row := TradeSession.row(Game.state,uid)
		if not row.is_empty() and row.included and row.status != "done":
			return "%s %s   /   %s" % ["要价" if row.direction == "buy" else "出价",UIKit.money(row.context.price),estimate]
		var current = Model.trade_item(Game.state)
		if not CounterDialogue.active(Game.state) and current != null and current.uid == uid:
			return "%s %s   /   %s" % ["要价" if trade.kind == "buy" else "出价",UIKit.money(trade.price),estimate]
	return estimate

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
	info.add_child(UIKit.label(_price_summary(it_uid,appraisal),22,UIKit.INK,true,true))
	info.add_child(UIKit.label("已验 %d / %d" % [appraisal.count,TOOL_IDS.size()],18,UIKit.AMBER,true))
	var wear_note := "\n品相记录待更新：任选一项免费复核即可更新估价，未受影响的物证仍保留。" if int(appraisal.count)>0 and not appraisal.get("conditionCurrent",false) else ""
	var model_recorded := false
	for facts in it.get("inspectionFacts",{}).values():
		if facts.get("appraisalObservation",{}).get("publicModel","")==WatchForgery.appearance_id(it): model_recorded=true
	if int(appraisal.count)>0 and not model_recorded:
		wear_note += "\n当前型号尚未登记进检验履历，任选一项免费复核即可登记。"
	if wear_note != "":
		info.add_child(UIKit.label(wear_note.strip_edges(),16,UIKit.MUTED,false,true))
	var progress := UIKit.grid(3,4)
	progress.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	info.add_child(progress)
	for index in TOOL_IDS.size():
		var id: String = TOOL_IDS[index]
		var done: bool = it.evidence.has(id)
		var fresh: bool = Model.inspection_current(it, id)
		var state := UIKit.label(GameData.tool(id).name + "\n" + ("✓ 已记录" if fresh else "↻ 需复测" if done else "○ 待检"),15,UIKit.GOOD if fresh else UIKit.AMBER if done else UIKit.MUTED,false,true)
		state.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		progress.add_child(state)
		var problem := _tool_problem(id)
		tool_buttons[id].disabled = problem != ""
		tool_buttons[id].tooltip_text = problem
		if problem != "": info.add_child(UIKit.label(problem, 16, UIKit.DANGER, false, true))
		tool_buttons[id].text = GameData.tool(id).name + ("  ✓" if fresh else " · 复测" if done else "")
		tool_buttons[id].add_theme_stylebox_override("normal",UIKit.key_style("primary" if tool == id else "secondary","normal"))
		if done:
			info.add_child(UIKit.record_card(Model.evidence_caption(it, id), Model.displayed_clue(it, id), "物证 / %02d%s" % [index + 1, " · 需复测" if not fresh else ""]))
	var first_record_cost := "已安装工作灯，每件原物首次记录不耗 AP" if Game.state.upgrades.lamp else "每件原物首次记录消耗 1 AP"
	info.add_child(UIKit.note_card("当前消耗", first_record_cost + "；后续取证不耗 AP。紫外与称重按新的有效读数计电费。"))
	var rules := UIKit.button("收起检验须知" if rules_expanded else "查看检验须知", "secondary", Vector2(0, 40), 16)
	rules.name = "inspection_rules_toggle"
	rules.pressed.connect(func():
		rules_expanded = not rules_expanded
		_refresh_info())
	info.add_child(rules)
	if rules_expanded:
		var note := UIKit.note_card("检验须知", "估价依据已记录品相与物证；正常读数不保证原装、走时或防水，异常读数或加工痕迹可能使范围更宽。各工具分别保留有效记录，只复测受影响的项目；品相变化后任选一项免费复核即可更新估价。重描、覆印和配重会留下痕迹。重复查看旧结果不收费。")
		note.name = "inspection_rules"
		info.add_child(note)

func _clear_finding() -> void:
	if finding_tween:
		finding_tween.kill()
		finding_tween = null
	finding_panel.hide()
	compact_finding.hide()

func _load_item() -> void:
	_clear_finding()
	_set_tool("")
	if is_instance_valid(item): item.queue_free()
	item = null
	var it = Game.workbench_item()
	it_uid = it.uid if it != null else ""
	Game.focus_uid = it_uid
	_fill_picker()
	_refresh_info()
	if it == null: return
	item = ItemSprite.new()
	item.setup(it.defId,it.uid,360.0, false, true)
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
	if compact_finding.visible: _clear_finding()
	show_status("","info")
	if is_instance_valid(optical_pin_button):
		remove_child(optical_pin_button)
		optical_pin_button.queue_free()
		optical_pin_button = null
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
	if is_instance_valid(instrument):
		instrument.hide()
		instrument.queue_free()
	instrument = null
	scale_label = null
	scale_status = null
	tare_button = null
	place_button = null
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
	if id == "TOL-001":
		optical_fixed = true
		optical_position = shell.ui_to_world(mat_rect.get_center()+Vector2(-95,-25))
		node.global_position = _clamp_lens_position(optical_position)
		optical_position = node.global_position
	bench_body.add_child(UIKit.label("拖动镜片寻找表盘印记，停稳后留下记录。" if id == "TOL-001" else "移动紫外灯寻找后盖编号，照稳后留下记录。",18,UIKit.TEXT,false,true))
	var fixed := UIKit.button(_pin_caption(),"secondary",Vector2(108,30),16)
	fixed.name = "inspection_pin"
	fixed.tooltip_text = "定位并固定标识" if id == "TOL-001" else "定位并固定编号"
	optical_pin_button = fixed
	fixed.pressed.connect(func():
		optical_pinned = not optical_pinned
		optical_fixed = id == "TOL-001" or optical_pinned
		optical_dragging = false
		if optical_pinned: optical_position = _optical_target()
		fixed.text = _pin_caption())
	add_child(fixed)
	if id == "TOL-002": bench_body.add_child(UIKit.label(_power_copy(id), 16, UIKit.CYAN, false, true))

func _pin_caption() -> String:
	return "解除固定" if optical_pinned else "固定镜片" if tool == "TOL-001" else "固定紫外灯"

func _optical_target() -> Vector2:
	return item.logo_world_position() if tool == "TOL-001" else item.reveal_center()

func _clamp_lens_position(point: Vector2) -> Vector2:
	if not is_instance_valid(lens) or mat_rect.size == Vector2.ZERO: return point
	var frame := Rect2(-136,-136,328,328)
	var inset := lens.scale.x
	var at: Vector2 = shell.world_to_ui(point)
	at.x = clampf(at.x,mat_rect.position.x-frame.position.x*inset,mat_rect.end.x-frame.end.x*inset)
	at.y = clampf(at.y,mat_rect.position.y-frame.position.y*inset,mat_rect.end.y-frame.end.y*inset)
	return shell.ui_to_world(at)

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT or what == NOTIFICATION_WM_WINDOW_FOCUS_OUT:
		optical_dragging = false

## Visible instrument geometry for the existing accessible web companion.
## Screen pixels avoid a JavaScript/DPR read on each companion refresh.
func snapshot() -> Dictionary:
	var transform: Transform2D = get_viewport().get_screen_transform()
	var a: Vector2 = transform*mat_rect.position
	var b: Vector2 = transform*mat_rect.end
	var out := {"inspection_mat":{"x":a.x,"y":a.y,"width":b.x-a.x,"height":b.y-a.y},"inspection_lens":{}}
	if is_instance_valid(lens):
		var optical_transform: Transform2D = transform*lens.get_global_transform_with_canvas()
		var center := optical_transform*Vector2.ZERO
		var handle := optical_transform*Vector2(155,155)
		out.inspection_lens = {"x":center.x,"y":center.y,"handle_x":handle.x,"handle_y":handle.y,"radius":(optical_transform*Vector2(128,0)).distance_to(center),"dragging":optical_dragging}
	return out

func _scale() -> void:
	scale_pan = ScalePan.new()
	scale_pan.position = item_home+Vector2(35,110)
	scale_pan.z_index = -1
	add_world(scale_pan,"fg")
	instrument = Control.new()
	instrument.name = "scale_console"
	instrument.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(instrument)
	scale_label = UIKit.label("0.0 g",22,Color("223c34"),true)
	scale_label.position = Vector2(-137,30)
	scale_label.size = Vector2(104,28)
	scale_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	scale_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	instrument.add_child(scale_label)
	scale_status = UIKit.label("请先归零",11,Color("294b36"))
	scale_status.position = Vector2(-137,58)
	scale_status.size = Vector2(100,18)
	scale_status.mouse_filter = Control.MOUSE_FILTER_IGNORE
	instrument.add_child(scale_status)
	bench_body.add_child(UIKit.label("空秤归零后放表；读数稳定时自动记录。",15,UIKit.TEXT,false,true))
	bench_body.add_child(UIKit.label(_power_copy("TOL-005"), 16, UIKit.CYAN, false, true))
	var grid := UIKit.grid(2,8)
	grid.position = Vector2(-16,28)
	grid.size = Vector2(164,48)
	grid.custom_minimum_size = grid.size
	for entry in [["TARE\n归零",_scale_tare,76,"primary"],["放到秤上",_scale_place,80,"secondary"]]:
		var b := UIKit.button(entry[0],entry[3],Vector2(entry[2],48),14)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		for state in ["normal","hover","pressed","disabled"]:
			b.add_theme_stylebox_override(state,UIKit.key_style(entry[3],state,true))
		b.pressed.connect(entry[1])
		grid.add_child(b)
	tare_button = grid.get_child(0)
	tare_button.name = "scale_tare"
	tare_button.tooltip_text = "空秤归零 · TARE"
	place_button = grid.get_child(1)
	place_button.name = "scale_place"
	instrument.add_child(grid)
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
	scale_label.text = "%.1f g" % scale_reading
	scale_status.text = "稳定 ✓" if scale_stable else "正在稳定…" if scale_occupied else "空秤已归零" if tared else "请先归零"
	if is_instance_valid(scale_pan): scale_pan.set_reading(scale_reading,tared,scale_occupied,scale_stable)

func _record() -> void:
	if _tool_problem(tool) != "": return
	if (tool == "TOL-001" or tool == "TOL-002") and not _optical_face_visible(): return
	var it = Game.item(it_uid)
	if it == null: return
	var facts: Dictionary = it.get("inspectionFacts", {}).get(tool, {})
	var recorded_condition: float = facts.get("appraisalObservation", {}).get("condition", -1.0)
	var recorded_model: String = facts.get("appraisalObservation",{}).get("publicModel","")
	if Model.inspection_current(it,tool) and is_equal_approx(recorded_condition,float(it.condition)) and recorded_model==WatchForgery.appearance_id(it): return
	var before := Model.estimate(it)
	var recorded_tool := tool
	if not Game.dispatch({"type":"CHECK","uid":it_uid,"tool":recorded_tool}): return
	var updated = Game.item(it_uid)
	if updated == null or not updated.evidence.has(recorded_tool): return
	var new_facts: Dictionary = updated.get("inspectionFacts",{}).get(recorded_tool,{})
	if new_facts.is_empty() or facts == new_facts: return
	var owner_shell: Node = shell.workspace_parent if shell.workspace_mode else shell
	owner_shell.set_meta("latest_inspection",{"uid":it_uid,"tool":recorded_tool,"facts":new_facts.duplicate(true)})
	finding_revision = Model.trade_revision(updated)
	_show_finding("%s · %s" % [GameData.tool(recorded_tool).name,Model.displayed_clue(updated,recorded_tool)],before,Model.estimate(updated))
	_refresh_info()

func _show_finding(reading: String, before: Dictionary, after: Dictionary) -> void:
	if finding_tween:
		finding_tween.kill()
		finding_tween = null
	finding_panel.show()
	var from_range := Vector2(before.low,before.high)
	var to_range := Vector2(after.low,after.high)
	var caption := "%s\n估价 %s–%s → " % [reading,Model.jnum(before.low),Model.jnum(before.high)]
	var display_range := func(value: Vector2):
		finding_label.text = "%s%s–%s Cr" % [caption,Model.jnum(roundi(value.x)),Model.jnum(roundi(value.y))]
		_layout_finding()
	if Game.prefs.reduced_motion or from_range==to_range:
		display_range.call(to_range)
	else:
		display_range.call(from_range)
		finding_tween = create_tween()
		finding_tween.tween_method(display_range,from_range,to_range,.36).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)

func _inspection_attempt(it: Dictionary) -> String:
	return Model.inspection_revision(it,tool)+":"+str(snappedf(float(it.condition),0.000001))+":"+str(Game.state.ap)

func on_changed(_p: Dictionary,_n: Dictionary,_a: Dictionary) -> void:
	# A linked repair workspace can replace the physical UV marking while
	# this exact item stays on the inspection mat. Refresh only its marking.
	var current = Game.item(it_uid)
	if (finding_panel.visible or compact_finding.visible) and (current==null or Model.trade_revision(current)!=finding_revision):
		_clear_finding()
	if current == null and _a.get("type", "") == "WORKSPACE_RESUME":
		_load_item()
		queue_relayout()
		return
	if current != null and is_instance_valid(item):
		var serial: String = WatchRules.serial(current)
		if item.reveal.text != serial: item.set_reveal(serial,Vector2(.5,.62))
	if _tool_problem(tool) != "": _set_tool("")
	_refresh_info()

func world_cursor_shape(p: Vector2) -> int:
	if not is_instance_valid(item) or shell.modal_open(): return Input.CURSOR_ARROW
	if item.dragging: return Input.CURSOR_DRAG
	if tool == "TOL-001":
		if optical_dragging: return Input.CURSOR_DRAG
		return Input.CURSOR_CAN_DROP if lens_ring.contains_point(lens.to_local(p)) else Input.CURSOR_ARROW
	if tool == "TOL-002": return Input.CURSOR_CROSS
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
				elif tool == "TOL-001" and lens_ring.contains_point(lens.to_local(p)):
					optical_fixed = true
					optical_pinned = false
					optical_dragging = true
					optical_grab = optical_position-p
					if is_instance_valid(optical_pin_button): optical_pin_button.text = _pin_caption()
				elif tool == "TOL-002" and mat_rect.has_point(shell.world_to_ui(p)):
					optical_fixed = true
					optical_pinned = false
					optical_dragging = true
					optical_position = p
					if is_instance_valid(optical_pin_button): optical_pin_button.text = _pin_caption()
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
	# Page transitions move the GUI tree independently of the world instrument.
	# Native canvas transforms keep its real controls on the housing throughout.
	_layout_scale_console()
	var modal_blocked: bool = shell.modal_open() or (shell.workspace_mode and shell.workspace_parent.modal_open())
	if tool == "TOL-001" or tool == "TOL-002":
		var optical: Node2D = lens if tool == "TOL-001" else wand
		var available: bool = not modal_blocked and (optical_pinned or shell.world_pointer_available())
		if modal_blocked or not shell.world_pointer_available(): optical_dragging = false
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
		scale_target = scale_pan.to_global(scale_pan.pan_position())-Vector2(0,item.tex_size().y*item.display_scale*.5)
		scale_pan.queue_redraw()
		if scale_stable:
			var revision := _inspection_attempt(it)
			if revision != scale_attempt_revision:
				scale_attempt_revision = revision
				_scale_record()
				var current = Game.item(it_uid)
				if current != null: scale_attempt_revision = _inspection_attempt(current)
		_scale_controls()
	elif tool == "TOL-001" or tool == "TOL-002":
		var node: Node2D = lens if tool == "TOL-001" else wand
		if optical_dragging:
			if Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT): optical_position = _clamp_lens_position(p+optical_grab) if tool == "TOL-001" else p
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
				var revision := _inspection_attempt(it)
				if revision != optical_attempt_revision:
					optical_attempt_revision = revision
					_record()
					var current = Game.item(it_uid)
					if current != null: optical_attempt_revision = _inspection_attempt(current)
		else: progress = 0.0
		lens_ring.progress = progress
		lens_ring.queue_redraw()

class ScalePan extends Node2D:
	var depression := 0.0
	var reading := 0.0
	var tared := false
	var occupied := false
	var stable := false
	func body_rect() -> Rect2: return Rect2(-166,-16,332,116)
	func pan_position() -> Vector2: return Vector2(0,-8+depression)
	func display_state() -> String:
		return "STABLE" if stable else "SETTLING" if occupied else "ZERO" if tared else "ZERO REQUIRED"
	func set_reading(value: float, zeroed: bool, loaded: bool, settled: bool) -> void:
		reading = value
		tared = zeroed
		occupied = loaded
		stable = settled
		queue_redraw()
	func _draw() -> void:
		# Cast feet and a deep front apron make the pan read as an instrument.
		for x in [-132,104]:
			draw_style_box(UIKit.key_style("secondary","normal"),Rect2(x,82,28,18))
		draw_style_box(UIKit.key_style("secondary","normal"),Rect2(-166,17,332,75))
		draw_style_box(UIKit.screen_style(4),Rect2(-158,18,316,63))
		draw_rect(Rect2(-72,1,144,22),Color("574d42"))
		draw_rect(Rect2(-57,1,114,16),Color("8b8e7b"))
		var pan := Rect2(-153,-12+depression,306,17)
		draw_style_box(UIKit.key_style("secondary","normal"),pan)
		draw_rect(Rect2(-145,-10+depression,290,8),Color("c3c5b2"))
		draw_line(Vector2(-143,-9+depression),Vector2(143,-9+depression),Color("fff1d2"),2)
		for x in range(-132,140,24): draw_line(Vector2(x,-7+depression),Vector2(x+13,-7+depression),Color("a2aa98"),1)
		draw_style_box(UIKit.inset_style(3),Rect2(-146,27,122,52))
		draw_rect(Rect2(-141,32,112,42),Color("b6c4a4"))
		draw_circle(Vector2(-32,70),3,Color("426f58") if stable or tared and not occupied else Color("a15d35"))

class Ring extends Node2D:
	var ultraviolet := false
	var radius := 128.0
	var progress := 0.0
	func contains_point(point: Vector2) -> bool:
		return point.length() <= radius+8 or point.distance_to(Geometry2D.get_closest_point_to_segment(point,Vector2(91,91),Vector2(178,178))) <= 18
	func _draw() -> void:
		if ultraviolet:
			draw_texture_rect(Util.radial(256,.22),Rect2(-150,-92,300,184),false,Color(.55,.28,.94,.24))
			return
		draw_line(Vector2(91,91),Vector2(178,178),Color("332f29"),32,true)
		draw_line(Vector2(101,101),Vector2(178,178),Color("8c6544"),23,true)
		draw_line(Vector2(107,102),Vector2(178,173),Color("c69c68"),5,true)
		draw_arc(Vector2.ZERO,radius,0,TAU,96,Color("39382f"),11,true)
		draw_arc(Vector2.ZERO,radius,0,TAU,96,Color("baa379"),6,true)
		draw_arc(Vector2.ZERO,radius-5,-PI*.83,-PI*.25,32,Color("eddfb5"),2,true)
		if progress>0: draw_arc(Vector2.ZERO,radius+6,-PI/2,-PI/2+TAU*progress,64,Color("91dab7"),5)
