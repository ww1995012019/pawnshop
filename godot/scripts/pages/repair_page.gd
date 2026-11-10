extends Page
## Persistent watch work orders; each tool touches the same physical watch.
const Service = preload("res://scripts/model/watch_service.gd")
const Cleaning = preload("res://scripts/model/watch_cleaning.gd")
const BenchArt = preload("res://scripts/ui/watch_refurb_art.gd")
const Commerce = preload("res://scripts/model/commerce.gd")
var it_uid := ""
var mode := "service"
var task := ""
var stage := 0
var item: ItemSprite
var item_home := Vector2.ZERO
var mat_rect := Rect2()
var list_panel: PanelContainer
var detail_panel: PanelContainer
var bench: PanelContainer
var list_box: VBoxContainer
var info: VBoxContainer
var bench_body: VBoxContainer
var art: Control
var cleaning: RefCounted
var mask_tex: ImageTexture
var dirty := 0.0
var scrubbing := false
var last_uv := Vector2.ZERO
var cloth_uv := Vector2(-1, -1)
var cloth_direction := Vector2.RIGHT
var show_residual := false
var cleaning_unsaved := false
var save_clock := 0.0
var grime_label: Label
var action_button: Button
var mode_buttons: Dictionary = {}
var guidance: PanelContainer
var guidance_body: VBoxContainer
var instruction: Label
var refresh_pending := false
var pending_operation := {}
var pending_task := ""
var saved_boundary := ""
var operation_clock := 0.0

func scene_name() -> String: return "workbench"

func hint_text() -> String:
	if mode == "forge": return "伪装只改变对应表象，会留下加工痕迹；不会修好真实故障。"
	if task == "dust": return "按住手表来回擦拭。查看残留可指出未擦到的污渍，离开后进度保留。"
	if is_instance_valid(art) and art.visible: return art.hint_text()
	return "按本件故障工单处理；无故障的部件不需要重复维修。"

func enter() -> void:
	list_panel = left_panel(260)
	var left := UIKit.vbox(10)
	list_panel.add_child(left)
	left.add_child(UIKit.module_header("修表台", "逐件记录 · 随时续修", "SERVICE"))
	var modes := UIKit.vbox(6)
	for spec in [["维修保养", open_service, "service"], ["独立翻新", open_refurb, "refurb"], ["伪装加工", open_forgery, "forge"]]:
		var b := UIKit.button(spec[0], "secondary", Vector2(0, 48), 18)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.toggle_mode = true
		b.pressed.connect(spec[1])
		mode_buttons[spec[2]] = b
		modes.add_child(b)
	left.add_child(modes)
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	list_box = UIKit.vbox(8)
	list_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(list_box)
	left.add_child(scroll)
	detail_panel = side_panel(350)
	var details := ScrollContainer.new()
	details.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	info = UIKit.vbox(10)
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	details.add_child(info)
	detail_panel.add_child(details)
	guidance = UIKit.plate(UIKit.screen_style(12))
	guidance.mouse_filter = Control.MOUSE_FILTER_IGNORE
	guidance_body = UIKit.vbox(4)
	guidance_body.mouse_filter = Control.MOUSE_FILTER_IGNORE
	guidance_body.minimum_size_changed.connect(queue_relayout)
	guidance.add_child(guidance_body)
	add_child(guidance)
	bench = UIKit.plate()
	add_child(bench)
	bench_body = UIKit.vbox(6)
	bench.add_child(bench_body)
	bench_body.minimum_size_changed.connect(queue_relayout)
	art = BenchArt.new()
	art.progressed.connect(_operation_progressed)
	art.completed.connect(_art_completed)
	add_child(art)
	move_child(bench, -1)
	var candidates := _candidates()
	var selected := ""
	for candidate in candidates:
		if candidate.uid == Game.focus_uid: selected = candidate.uid
	if selected == "" and not candidates.is_empty(): selected = candidates[0].uid
	_select(selected)

func _candidates() -> Array:
	var out := []
	for it in Game.state.inventory:
		if it.owner != "pawn" and it.get("watch", null) is Dictionary: out.append(it)
	return out

func _select(uid: String) -> void:
	_save_cleaning()
	_save_operation()
	it_uid = uid
	Game.focus_uid = uid
	scrubbing = false
	cloth_uv = Vector2(-1,-1)
	show_residual = false
	if is_instance_valid(item): item.queue_free()
	item = null
	cleaning = null
	var it = Game.item(uid)
	if it != null:
		Game.dispatch({"type":"SERVICE_BEGIN", "uid":uid})
		it = Game.item(uid)
		item = ItemSprite.new()
		item.setup(it.defId, uid, 360.0)
		item.draggable = false
		add_world(item)
		var alpha: Image = item.body.texture.get_image().get_region(Rect2i(item.body.region_rect))
		cleaning = Cleaning.new()
		cleaning.configure(alpha, uid, it.get("service", {}).get("operations", {}).get("dust", {}))
		mask_tex = ImageTexture.create_from_image(cleaning.image())
		item.mat.set_shader_parameter("grime_mask",mask_tex)
	if it != null and it.get("refurbishment",{}).get("active_case",false):
		mode = "refurb"
		task = "refurb_case"
	_fill_list()
	_stage_ui()
	_refresh_info()

func _fill_list() -> void:
	UIKit.clear(list_box)
	for it in _candidates():
		var selected: bool = it.uid == it_uid
		var row := UIKit.button("", "primary" if selected else "secondary", Vector2(0, 76), 17)
		var service: Dictionary = it.get("service", {})
		var completed: int = service.get("done", []).size()
		var count: int = service.get("tasks", []).size()
		var status := "工单 %d/%d" % [completed,count] if count > 0 else ("已保养" if it.repaired else "待检查")
		row.text = Game.def_name(it.defId) + "\n" + status
		row.icon = UIKit.item_icon(it.defId)
		row.expand_icon = true
		row.add_theme_constant_override("icon_max_width",48)
		row.alignment = HORIZONTAL_ALIGNMENT_LEFT
		var uid: String = it.uid
		row.pressed.connect(func(): call_deferred("_select",uid))
		list_box.add_child(row)
	if list_box.get_child_count() == 0: list_box.add_child(UIKit.label("暂无可维护的手表。",18,UIKit.MUTED,false,true))

func repair_status(it: Dictionary) -> String:
	var profile: Dictionary = Service.profile(it)
	var movement := "机械机芯" if profile.movement == "mechanical" else "石英机芯"
	var cover: String = {"screw":"旋入式后盖","snap":"压入式后盖","bolts":"螺钉式后盖"}.get(profile.caseback,"后盖")
	var text := movement + " · " + cover
	if it.evidence.is_empty(): text += "\n尚无检验记录；内部故障需开盖后逐步检查。"
	else: text += "\n" + Model.evidence_caption(it,it.evidence[-1]) + "：" + Model.displayed_clue(it,it.evidence[-1])
	return text

func _refresh_info() -> void:
	UIKit.clear(info)
	var it = Game.item(it_uid)
	if it == null:
		info.add_child(UIKit.label("选择左侧手表。",20,UIKit.MUTED))
		return
	info.add_child(UIKit.record_card(Game.def_name(it.defId),repair_status(it) + ("\n当前品相：" + UIKit.pct(it.condition) if mode == "refurb" else ""),"工单 / " + it_uid))
	if mode == "refurb":
		info.add_child(UIKit.module_header("独立翻新项目","自由选择 · 完成时单独结算","REFURBISH"))
		for job in WatchRefurbishment.JOBS:
			var done: bool = it.get("refurbishment",{}).get("done",[]).has(job)
			var button := UIKit.button(("✓ " if done else "")+WatchRefurbishment.LABELS[job],"primary" if task == "refurb_"+job else "secondary",Vector2(0,48),18)
			var candidate: String = job
			button.pressed.connect(func(): call_deferred("open_refurb",candidate))
			info.add_child(button)
			info.add_child(UIKit.label(WatchRefurbishment.DESCRIPTIONS[job],16,UIKit.MUTED,false,true))
			info.add_child(UIKit.label(_cost_text(WatchRefurbishment.cost(job)),16,UIKit.CYAN,false,true))
		info.add_child(UIKit.label("品相 %s · 不修复机芯故障，不改变真伪。" % UIKit.pct(it.condition),17,UIKit.TEXT,false,true))
	elif mode == "forge":
		info.add_child(UIKit.note_card("伪装加工", "只改变标识、编号或读数；真实故障、缺件与真伪仍保留。被识破会影响交易与关系。"))
		for method in WatchForgery.METHODS:
			var selected: bool = task == "forge_" + method
			var button := UIKit.button(WatchForgery.LABELS[method],"primary" if selected else "secondary",Vector2(0,48),19)
			var candidate: String = method
			button.pressed.connect(func(): call_deferred("open_forgery",candidate))
			info.add_child(button)
			info.add_child(UIKit.label(WatchForgery.cost_text(method),16,UIKit.MUTED,false,true))
		if it.has("forgery"): info.add_child(UIKit.label(WatchForgery.summary(it),17,UIKit.AMBER,false,true))
	else:
		info.add_child(UIKit.module_header("本次维修工单", "只处理实际存在的问题", "WORK ORDER"))
		var service: Dictionary = it.get("service",{})
		var visible_faults := []
		for fault in service.get("faults",[]):
			if not fault.get("internal",false) or fault.get("discovered",false):
				visible_faults.append(("✓ " if fault.get("resolved",false) else "· ") + String(fault.get("label",fault.get("id",""))))
		if not visible_faults.is_empty(): info.add_child(UIKit.label("\n".join(visible_faults),17,UIKit.TEXT,false,true))
		var work: Array = Service.tasks(it)
		for step in work:
			var done: bool = service.get("done",[]).has(step)
			info.add_child(UIKit.label(("✓ " if done else ("▶ " if step == task else "· ")) + Service.label(step,it),18,UIKit.GOOD if done else (UIKit.AMBER if step == task else UIKit.MUTED),false,true))
		if work.is_empty(): info.add_child(UIKit.label("本件暂无必须维修的故障。",18,UIKit.GOOD,false,true))
		if service.get("opened",false): info.add_child(UIKit.label("后盖已打开 · 需回装封盖后才能出售",17,UIKit.AMBER,false,true))
		if task != "": info.add_child(UIKit.label("本工序：" + _cost_text(Service.step_cost(task,it)),17,UIKit.CYAN,false,true))
	var why := _current_problem()
	if why != "": info.add_child(UIKit.label(why,17,UIKit.DANGER,false,true))
	info.add_child(UIKit.rule())
	info.add_child(UIKit.module_header("材料库存","完成对应操作时扣除","SUPPLIES"))
	for material in GameData.materials:
		info.add_child(UIKit.label("%s  ×%s" % [material.name,Model.jnum(Game.state.materials.get(material.id,0))],16,UIKit.MUTED))

func _cost_text(cost: Dictionary) -> String:
	var parts := []
	for id in cost.get("materials",{}): parts.append("%s ×%s" % [GameData.material(id).name, Model.jnum(cost.materials[id])])
	parts.append("%s AP" % Model.jnum(cost.get("ap",0)))
	return " · ".join(parts)

func _current_problem() -> String:
	var it = Game.item(it_uid)
	if it == null: return "请选择手表"
	if mode == "refurb": return WatchRefurbishment.problem(Game.state,it,task.trim_prefix("refurb_"))
	if mode == "forge": return Commerce.forgery_problem(Game.state,it,task.trim_prefix("forge_"))
	return Service.problem(Game.state,it,task)

func _stage_ui() -> void:
	UIKit.clear(bench_body)
	UIKit.clear(guidance_body)
	_sync_modes()
	grime_label = null
	var it = Game.item(it_uid)
	if it == null:
		art.hide()
		return
	if mode == "service": task = Service.current(it)
	elif mode == "refurb" and not task.begins_with("refurb_"): task = "refurb_blow"
	stage = it.get("service",{}).get("done",[]).size()
	var dust := mode == "service" and task == "dust"
	if is_instance_valid(item):
		item.visible = dust or task == ""
		if item.visible and item.logo_variant != WatchRules.logo_variant(it): item._apply_face()
		item.mat.set_shader_parameter("grime",1.0 if dust else 0.0)
	art.visible = not dust and task != ""
	art.set_process(art.visible)
	var title: String = WatchForgery.LABELS.get(task.trim_prefix("forge_"),"伪装加工") if mode == "forge" else Service.label(task,it)
	if mode == "refurb": title = WatchRefurbishment.LABELS.get(task.trim_prefix("refurb_"),"独立翻新")
	if task == "": title = "本次工单已完成" if not Service.tasks(it).is_empty() and Service.finished(it) else "本件无需维修"
	var mode_title := "独立翻新" if mode == "refurb" else ("伪装加工" if mode == "forge" else "维修保养")
	guidance_body.add_child(UIKit.label(mode_title + "  /  " + title,22,UIKit.AMBER))
	instruction = UIKit.label("",18,UIKit.TEXT,false,true)
	instruction.mouse_filter = Control.MOUSE_FILTER_IGNORE
	guidance_body.add_child(instruction)
	var row := UIKit.hbox(10)
	action_button = UIKit.button("","primary",Vector2(0,50),20)
	action_button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	action_button.pressed.connect(_primary_action)
	row.add_child(action_button)
	if dust:
		dirty = cleaning.remaining()
		grime_label = UIKit.label("污垢剩余 %d%%" % ceili(dirty*100),18,UIKit.AMBER)
		row.add_child(grime_label)
		_update_cleaning_controls()
	else:
		if task != "":
			var saved: Dictionary = it.get("refurbishment",{}).get("operations",{}).get(task.trim_prefix("refurb_"),{}) if mode == "refurb" else it.get("service",{}).get("operations",{}).get(task,{})
			art.configure(it,task,saved)
			instruction.text = art.hint_text()
			action_button.text = art.action_text()
		else:
			instruction.text = "已完成的工序保留记录；鉴定读数若受维修影响，请复查。"
			action_button.text = "完成工单 · 记录交工"
		action_button.disabled = _current_problem() != ""
	var inspect := UIKit.button("去鉴定","secondary",Vector2(126,50),19)
	inspect.pressed.connect(func(): call_deferred("_open_inspection"))
	row.add_child(inspect)
	bench_body.add_child(row)
	_update_guidance()
	shell.hint(hint_text())
	queue_relayout()
	queue_redraw()

func _sync_modes() -> void:
	for id in mode_buttons:
		var button: Button = mode_buttons[id]
		var selected: bool = id == mode
		button.set_pressed_no_signal(selected)
		button.text = ("✓ " if selected else "") + {"service":"维修保养","refurb":"独立翻新","forge":"伪装加工"}[id]
		for state in ["normal", "hover", "pressed", "hover_pressed"]:
			button.add_theme_stylebox_override(state, UIKit.key_style("primary" if selected else "secondary", "normal" if state == "hover_pressed" else state, false))

func _update_guidance() -> void:
	if not is_instance_valid(instruction): return
	var current = Game.item(it_uid)
	if mode == "refurb" and current != null and current.get("refurbishment",{}).get("done",[]).has(task.trim_prefix("refurb_")):
		instruction.text = "本项翻新已完成 · 当前品相 %s；可选择其他独立项目。" % UIKit.pct(current.condition)
		instruction.add_theme_color_override("font_color",UIKit.GOOD)
		return
	var why := _cleaning_problem() if task == "dust" and cleaning != null and not cleaning.complete() else _current_problem()
	instruction.text = "暂不能操作 · " + why if why != "" else (art.hint_text() if art.visible else instruction.text)
	instruction.add_theme_color_override("font_color", UIKit.DANGER if why != "" else UIKit.TEXT)
	instruction.mouse_filter = Control.MOUSE_FILTER_IGNORE

func _open_inspection() -> void:
	if it_uid != "": shell.go("inspect",it_uid)

func _resume_case() -> bool:
	var current = Game.item(it_uid)
	if current != null and current.get("refurbishment",{}).get("active_case",false):
		open_refurb("case")
		shell.toast("请先完成换壳并封盖，再切换其他操作。")
		return true
	return false

func open_refurb(job := "") -> void:
	_sync_modes()
	_save_cleaning()
	_save_operation()
	var current = Game.item(it_uid)
	if current == null: return
	if current.get("refurbishment",{}).get("active_case",false): job = "case"
	if job == "": job = "blow"
	mode = "refurb"
	task = "refurb_"+job
	_stage_ui()
	_refresh_info()

func open_service() -> void:
	if _resume_case(): return
	_save_cleaning()
	_save_operation()
	mode = "service"
	_stage_ui()
	_refresh_info()

func open_forgery(method := "") -> void:
	if _resume_case(): return
	_sync_modes()
	_save_cleaning()
	_save_operation()
	var it = Game.item(it_uid)
	if it == null: return
	var ongoing: String = it.get("service",{}).get("forge_task", "")
	if ongoing != "": method = ongoing.trim_prefix("forge_")
	if it.get("service",{}).get("opened",false) and ongoing == "":
		_sync_modes()
		shell.toast("先完成当前机芯回装与封盖，再切换加工。")
		return
	mode = "forge"
	if method == "":
		method = "logo"
		for candidate in WatchForgery.METHODS:
			if Commerce.forgery_problem(Game.state,it,candidate) == "":
				method = candidate
				break
	task = "forge_" + method
	_refresh_info()
	_stage_ui()

func _primary_action() -> void:
	if task == "dust":
		var current = Game.item(it_uid)
		var unfinished: String = current.get("service",{}).get("forge_task","") if current != null else ""
		if unfinished != "":
			open_forgery(unfinished.trim_prefix("forge_"))
			return
		var blocked := _cleaning_problem()
		if blocked != "":
			shell.toast(blocked)
			return
		if cleaning != null and cleaning.complete():
			_operation_completed()
			return
		show_residual = not show_residual
		action_button.text = "隐藏残留" if show_residual else "查看残留"
		queue_redraw()
		return
	var why := _current_problem()
	if why != "":
		shell.toast(why)
		return
	if task == "":
		confirm_repair()
		return
	var selected = Game.item(it_uid)
	var operation: Dictionary = selected.get("refurbishment",{}).get("operations",{}).get(task.trim_prefix("refurb_"),{}) if mode == "refurb" else selected.get("service",{}).get("operations",{}).get(task,{})
	if operation.get("complete",false): _operation_completed()
	else: art.advance()

func _operation_progressed(progress: Dictionary) -> void:
	if not is_inside_tree() or task == "" or not art.visible or progress.get("task", "") != task: return
	pending_operation = progress
	pending_task = task
	var boundary: String = task + ":" + str(progress.get("step", 0)) + ":" + String(progress.get("phase", "idle"))
	if saved_boundary != boundary or operation_clock >= 0.35 or progress.get("complete",false):
		saved_boundary = boundary
		_save_operation()
	if is_instance_valid(action_button): action_button.text = art.action_text()
	_update_guidance()

func _save_operation() -> void:
	if pending_operation.is_empty() or pending_task == "" or it_uid == "": return
	var progress := pending_operation
	pending_operation = {}
	operation_clock = 0.0
	if pending_task.begins_with("refurb_"):
		Game.dispatch({"type":"REFURB_PROGRESS","uid":it_uid,"job":pending_task.trim_prefix("refurb_"),"progress":progress})
	else:
		Game.dispatch({"type":"SERVICE_PROGRESS","uid":it_uid,"task":pending_task,"progress":progress})

func _art_completed() -> void:
	if not art.visible or art.progress_snapshot().get("task", "") != task: return
	_operation_completed()

func _operation_completed() -> void:
	_save_operation()
	var it = Game.item(it_uid)
	if it == null or task == "": return
	if mode == "refurb":
		var job := task.trim_prefix("refurb_")
		Game.dispatch({"type":"REFURB_COMPLETE","uid":it_uid,"job":job})
		_request_refresh()
		return
	var progress: Dictionary = it.get("service",{}).get("operations",{}).get(task,{}).duplicate(true)
	progress.complete = true
	Game.dispatch({"type":"SERVICE_PROGRESS","uid":it_uid,"task":task,"progress":progress})
	if mode == "forge":
		Game.dispatch({"type":"FORGE","uid":it_uid,"method":task.trim_prefix("forge_")})
	else:
		Game.dispatch({"type":"SERVICE_COMPLETE","uid":it_uid,"task":task})
		it = Game.item(it_uid)
		if Service.current(it) == "" and not Service.tasks(it).is_empty(): Game.dispatch({"type":"SERVICE_FINISH","uid":it_uid})
	_request_refresh()

func confirm_repair() -> void:
	Game.dispatch({"type":"SERVICE_FINISH","uid":it_uid})
	_request_refresh()

func _cleaning_problem() -> String:
	var current = Game.item(it_uid)
	return "请选择手表" if current == null else Service.progress_problem(Game.state,current,"dust")

func _update_cleaning_controls() -> void:
	var blocked := _cleaning_problem()
	var current = Game.item(it_uid)
	var unfinished: String = current.get("service",{}).get("forge_task","") if current != null else ""
	action_button.disabled = false
	if blocked != "":
		instruction.text = blocked
		action_button.text = "继续伪装加工并封盖" if unfinished != "" else "暂不能清洁"
		action_button.disabled = unfinished == ""
	elif cleaning.complete():
		var cost_problem := _current_problem()
		instruction.text = "擦拭已完成，进度已保存。" + (cost_problem if cost_problem != "" else "提交后记录本工序并扣除对应行动点。")
		action_button.text = "提交清洁结果"
		action_button.disabled = cost_problem != ""
	else:
		instruction.text = "按住表面来回擦，污渍沿轨迹消失；不会把划痕擦掉。"
		action_button.text = "查看残留" if not show_residual else "隐藏残留"

	_update_guidance()

func _wipe_uv(from_uv: Vector2,to_uv: Vector2,elapsed := 0.0) -> void:
	if cleaning == null or task != "dust" or _cleaning_problem() != "": return
	if cleaning.stroke(from_uv,to_uv,0.075,elapsed):
		mask_tex.update(cleaning.image())
		dirty = cleaning.remaining()
		cleaning_unsaved = true
		if is_instance_valid(grime_label): grime_label.text = "污垢剩余 %d%%" % ceili(dirty*100)
		if cleaning.complete():
			scrubbing = false
			_save_cleaning()
			if _current_problem() == "":
				_operation_completed()
			else:
				_update_cleaning_controls()
				_refresh_info()
	if from_uv.distance_squared_to(to_uv) > 0.000001:
		cloth_direction = (to_uv-from_uv).normalized()
	cloth_uv = to_uv
	queue_redraw()

func _save_cleaning() -> void:
	if not cleaning_unsaved or cleaning == null or it_uid == "": return
	cleaning_unsaved = false
	Game.dispatch({"type":"SERVICE_PROGRESS","uid":it_uid,"task":"dust","progress":cleaning.serialize()})

func relayout() -> void:
	if not is_instance_valid(bench) or not is_instance_valid(art): return
	mat_rect = layout_workbench(list_panel,detail_panel,bench,260,350)
	guidance.position = mat_rect.position
	guidance.size.x = mat_rect.size.x
	guidance.size.y = maxf(132.0, guidance.get_combined_minimum_size().y)
	var working := Rect2(mat_rect.position + Vector2(0,guidance.size.y + 10), mat_rect.size - Vector2(0,guidance.size.y + 10))
	art.position = working.position
	art.size = working.size
	if is_instance_valid(item):
		item_home = fit_workbench_item(item,working)
		item.position = item_home
	queue_redraw()

func _unhandled_input(event: InputEvent) -> void:
	if task != "dust" or mode != "service" or not is_instance_valid(item) or shell.modal_open(): return
	var world: Vector2 = shell.world_mouse()
	var uv: Vector2 = item.body.to_local(world) / item.tex_size() + Vector2(0.5,0.5)
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed and item.contains(world):
			var blocked := _cleaning_problem()
			if blocked != "":
				scrubbing = false
				cloth_uv = Vector2(-1,-1)
				_update_cleaning_controls()
				shell.toast(blocked)
				queue_redraw()
				return
			scrubbing = true
			last_uv = uv
			cloth_uv = uv
			queue_redraw()
		elif not event.pressed:
			scrubbing = false
			_save_cleaning()

func _process(delta: float) -> void:
	if is_instance_valid(instruction):
		# Preserve layout while a transient notice occupies the instruction row.
		instruction.self_modulate.a = 0.0 if shell.toast_box.get_child_count() > 0 else 1.0
	if scrubbing and task == "dust" and mode == "service" and is_instance_valid(item):
		if shell.modal_open() or _cleaning_problem() != "":
			scrubbing = false
			cloth_uv = Vector2(-1,-1)
			_update_cleaning_controls()
			queue_redraw()
		else:
			var world: Vector2 = shell.world_mouse()
			var uv: Vector2 = item.body.to_local(world) / item.tex_size() + Vector2(0.5,0.5)
			_wipe_uv(last_uv,uv,delta)
			last_uv = uv
	save_clock += delta
	operation_clock += delta
	if save_clock >= 0.4:
		save_clock = 0.0
		_save_cleaning()

func _draw() -> void:
	if task != "dust" or mode != "service" or not is_instance_valid(item) or cleaning == null: return
	if show_residual:
		for uv in cleaning.residual_points():
			var p: Vector2 = shell.world_to_ui(item.uv_global(uv))
			draw_arc(p,5,0,TAU,14,Color(1,0.78,0.35,0.65),1.3,true)
	if cloth_uv.x >= 0.0:
		var at: Vector2 = shell.world_to_ui(item.uv_global(cloth_uv))
		var angle := cloth_direction.angle() * 0.15
		draw_set_transform(at+Vector2(14,-10),angle)
		draw_style_box(UIKit.inset_style(7),Rect2(-26,-18,52,36))
		draw_colored_polygon(PackedVector2Array([Vector2(-24,-16),Vector2(21,-18),Vector2(28,9),Vector2(7,19),Vector2(-26,13)]),Color("c0bfa6"))
		for x in [-14,-4,6,16]: draw_line(Vector2(x,-12),Vector2(x+3,11),Color("949782"),1,true)
		draw_line(Vector2(-19,-9),Vector2(18,-12),Color("ece6c6"),2,true)
		draw_set_transform(Vector2.ZERO)

func world_cursor_shape(point: Vector2) -> int:
	return Input.CURSOR_CROSS if task == "dust" and is_instance_valid(item) and item.contains(point) and _cleaning_problem() == "" else Input.CURSOR_ARROW

func toast_rect() -> Rect2:
	if not is_instance_valid(guidance): return Rect2()
	return Rect2(guidance.position + Vector2(0,48), Vector2(guidance.size.x, guidance.size.y - 48))

func on_changed(_prev: Dictionary,_next: Dictionary,action: Dictionary) -> void:
	if action.type in ["SERVICE_PROGRESS","SERVICE_BEGIN","REFURB_PROGRESS"]: return
	if action.type == "BUY_MATERIAL":
		call_deferred("_refresh_info")
		return
	_request_refresh()

func _request_refresh() -> void:
	if refresh_pending: return
	refresh_pending = true
	call_deferred("_refresh_after_change")

func _refresh_after_change() -> void:
	refresh_pending = false
	if not is_inside_tree(): return
	_fill_list()
	_stage_ui()
	_refresh_info()

func snapshot() -> Dictionary:
	var it = Game.item(it_uid)
	if it == null: return {}
	var service: Dictionary = it.get("service",{})
	var targets := []
	var ratio := float(JavaScriptBridge.eval("devicePixelRatio || 1",true)) if OS.has_feature("web") else 1.0
	var transform: Transform2D = get_viewport().get_screen_transform()
	if art.visible:
		for target in art.interaction_targets():
			var position: Vector2 = transform * art.get_global_transform_with_canvas() * target.position / ratio
			var drop: Vector2 = transform * art.get_global_transform_with_canvas() * target.drop_position / ratio
			targets.append({"id":target.id,"label":target.label,"x":position.x,"y":position.y,"drop_x":drop.x,"drop_y":drop.y,"busy":target.busy})
	var object_rect := {}
	if is_instance_valid(item) and item.visible:
		var body_transform: Transform2D = transform * item.body.get_global_transform_with_canvas()
		var a: Vector2 = body_transform * (-item.tex_size()*0.5) / ratio
		var b: Vector2 = body_transform * (item.tex_size()*0.5) / ratio
		object_rect = {"x":a.x,"y":a.y,"width":b.x-a.x,"height":b.y-a.y}
	return {"repair_uid":it_uid,"repair_mode":mode,"repair_task":task,"repair_tasks":Service.tasks(it),
		"forge_uid":it_uid,"forge_name":Game.def_name(it.defId),"forge_done":not WatchForgery.treatments(it).is_empty(),
		"refurb_done":it.get("refurbishment",{}).get("done",[]),"refurb_condition":it.condition,
		"repair_done":service.get("done",[]),"repair_opened":service.get("opened",false),
		"repair_grime":dirty if task == "dust" else 0.0,"repair_reason":_current_problem(),
		"repair_action":action_button.text if is_instance_valid(action_button) else "",
		"repair_can_finish":task == "" and not Service.tasks(it).is_empty(),"repair_targets":targets,
		"repair_object":object_rect,"repair_animation":art.progress_snapshot() if art.visible else {}}

func leave() -> void:
	_save_cleaning()
	_save_operation()
	super.leave()
