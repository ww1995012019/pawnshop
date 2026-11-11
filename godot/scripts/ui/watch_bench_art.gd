class_name WatchBenchArt
extends Control
## Native, resolution-independent watch work. State is JSON-safe and entirely
## visual: only the owning page may commit costs, repairs or forged observations.
signal progressed(progress: Dictionary)
signal completed

const SURFACE := Vector2(640, 460)
const CENTER := Vector2(248, 227)
const COVER_TRAY := Vector2(510, 150)
const GEAR_SEAT := Vector2(275, 204)
const BASKET := Vector2(518, 251)
const PHASES := ["take", "contact", "act", "release", "result"]
const INK := Color("d4dacd")
const MUTED := Color("8a9b96")
const CYAN := Color("86c9bc")
const GOLD := Color("c9ae72")
const STEEL := Color("a4b4b0")
const DARK := Color("182326")
const TOOL_NAMES := {"driver":"螺丝刀", "tweezers":"镊子", "oiler":"点油笔", "brush":"清洗刷", "pen":"描绘笔", "probe":"检测探针", "blower":"吹气球", "opener":"双爪开盖器", "caseknife":"开盖刀", "uv":"紫外灯", "swab":"清洁棉签", "press":"压盖器", "fingers":"手部操作", "springbar":"生耳批"}
# Keep the established atlas identity from generate-watch-art.py; these are
# physical model palettes/silhouettes, independent of true or forged markings.
const EXTRA_TEMPLATES := [0, 6, 2, 9, 1, 3, 6, 3, 7, 10, 11, 8, 12, 14, 7, 13, 10, 8]
const STRAP_TYPES := ["leather", "metal", "cloth", "metal", "rubber", "cloth", "leather", "leather", "metal", "cloth", "metal", "rubber", "leather", "leather", "metal"]
const STRAP_COLORS := ["76543f", "9eabad", "5e695b", "a6b7bb", "273236", "737856", "735244", "513f3a", "9baba9", "77705a", "879496", "3d5150", "66493b", "78513b", "a4aa9c"]
const EXTRA_STRAP_COLORS := ["8b694b", "655442", "737b63", "827c60", "a7b2af", "9eaaa6", "585060", "a4b4bf", "48536c", "96a9a0", "465d53", "a6a8b6", "54463e", "c4b87e", "473a57", "6b4939", "b4bba7", "c3b591"]

var _supplies: Dictionary = {}
var _supplies_known := false
var _item: Dictionary = {}
var _task := ""
var _profile := {"movement":"quartz", "caseback":"screw"}
var _plan: Array[Dictionary] = []
var _screw_layout: Dictionary = {}
var _legacy_screws := false
var _state: Dictionary = {}
var _pressed := false
var _drag_origin := Vector2.ZERO
var _drag_at := Vector2.ZERO
var _pointer_dragging := false
var _feedback := ""
var _art: Dictionary = {}
var _glyph: Array = []
var _reference: Dictionary = {}
var _font: Font
var _mono: Font
var _appearance: Dictionary = {}
var _started_opened := false
var interaction_allowed := true

func set_interaction_allowed(allowed: bool) -> void:
	interaction_allowed = allowed
	if not allowed:
		_pressed = false
		_pointer_dragging = false
	focus_mode = Control.FOCUS_ALL if allowed else Control.FOCUS_NONE
	set_process(visible and allowed)
	queue_redraw()

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_STOP
	clip_contents = true
	focus_mode = Control.FOCUS_ALL
	custom_minimum_size = Vector2(160, 120)
	UIKit.ensure()
	_font = UIKit.font
	_mono = UIKit.mono
	resized.connect(queue_redraw)

func configure(it: Dictionary, task: String, progress: Dictionary = {}) -> void:
	_item = it.duplicate(true)
	_task = task
	_profile = WatchService.profile(it)
	var id := WatchForgery.appearance_id(it)
	_art = WatchLogo.art(id)
	_glyph = WatchLogo.pixels(WatchForgery.target_id(it) if task=="forge_logo" and WatchForgery.target_id(it)!="" else WatchForgery.logo_id(it),0)
	var definition: Dictionary = GameData.def(id)
	_reference = GameData.def(WatchForgery.target_id(it)).watch if task.begins_with("forge_") and WatchForgery.target_id(it)!="" else definition.get("watch", {})
	var template: int = WatchForgery.template(id)
	_appearance = {"template":template, "case_shape":_art.get("shape","square" if template == 6 else "round"),
		"strap":WatchLogo.art(WatchForgery.strap_id(it)).get("strap",STRAP_TYPES[WatchForgery.template(WatchForgery.strap_id(it))]), "strap_color":_strap_color(WatchForgery.strap_id(it)),
		"case_color":_art.get("case_color", "bda064" if template == 13 or definition.get("tier", "") in ["luxury","ultra"] else "b6c0c0")}
	_contour_rays.clear()
	_started_opened = bool(it.get("service", {}).get("opened", false))
	if progress.get("version", 0) == 1 and progress.get("task", "") == task:
		# The reducer updates service.opened during this operation. Its original
		# plan basis must survive that change, or numeric action indices shift.
		_started_opened = bool(progress.get("started_opened", _started_opened))
	var restoring: bool = progress.get("version", 0) == 1 and progress.get("task", "") == task
	_screw_layout = progress.get("screw_layout", {}).duplicate(true) if restoring else {}
	var legacy_action := ""
	if restoring and not progress.has("screw_layout"):
		# Numeric v1 indices refer to individual screws, including in-flight
		# phases. Recover the original action before reducing the plan.
		_legacy_screws = true
		_build_plan()
		var old_step := clampi(int(progress.get("step", 0)), 0, _plan.size())
		if old_step < _plan.size(): legacy_action = _plan[old_step].id
		_migrate_screw_layout(old_step, String(progress.get("phase", "idle")))
		_legacy_screws = false
	_build_plan()
	_state = _initial_state()
	if progress.get("version", 0) == 1 and progress.get("task", "") == task:
		for key in _state:
			if progress.has(key):
				_state[key] = progress[key].duplicate(true) if progress[key] is Dictionary or progress[key] is Array else progress[key]
		if not progress.has("screw_layout"):
			_state.screw_layout = _screw_layout.duplicate(true)
			_state.step = _plan.size()
			for n in range(_plan.size()):
				if _plan[n].id == legacy_action or _plan[n].get("legacy_ids", []).has(legacy_action):
					_state.step = n
					break
		_state.step = clampi(int(_state.step), 0, _plan.size())
		if not PHASES.has(_state.phase) and _state.phase != "idle":
			_state.phase = "idle"
		if _state.step >= _plan.size():
			_state.complete = true
			_state.phase = "idle"
	_pressed = false
	_pointer_dragging = false
	_feedback = ""
	queue_redraw()

func _initial_state() -> Dictionary:
	var cover_off: bool = _task in ["wash", "assemble", "test"] or (_task == "replace" and _replacement_internal()) or bool(_item.get("service", {}).get("opened", false))
	if _task in ["forge_logo", "forge_serial"]:
		cover_off = false
	var screws_off: bool = cover_off and _profile.get("caseback", "screw") == "bolts"
	var part := Vector2(518, 251) if _task == "assemble" else GEAR_SEAT
	return {"version":1, "task":_task, "step":0, "phase":"idle", "elapsed":0.0,
		"tool":{"kind":"", "position":[74.0, 407.0], "angle":0.0},
		"parts":{"cover":_arr(COVER_TRAY if cover_off else CENTER), "component":_arr(part),
			"old_part":[275.0, 252.0], "new_part":[555.0, 268.0], "ballast":[558.0, 270.0], "fixing":[540.0, 251.0], "link":[560.0, 269.0], "watch":[248.0,227.0], "scale_pan":[248.0,237.0]},
		"screw_layout":_screw_layout.duplicate(true),
		"screws":[screws_off, screws_off, screws_off, screws_off], "power_safe":false, "clamp_open":false,
		"washed":0.0, "dry":0.0, "oil":[], "seated":false, "test":0.0,
		"logo":0.0, "serial":0.0, "uv":false, "ballast_set":false, "scale":0.0, "watch_on_scale":false, "watch_scale":1.0,
		"trace":"", "complete":false, "opened":cover_off, "started_opened":_started_opened}

func progress_snapshot() -> Dictionary:
	return _state.duplicate(true)

func appearance_signature() -> Dictionary:
	return _appearance.duplicate(true)

func action_plan_signature() -> String:
	var ids: Array[String] = []
	for a in _plan:
		ids.append(a.id)
	return "/".join(ids)

func stage_working_rect() -> Rect2:
	var scale_factor := minf(size.x / SURFACE.x, size.y / SURFACE.y)
	return Rect2((size - SURFACE * scale_factor) * 0.5, SURFACE * scale_factor)

func _surface_to_local(p: Vector2) -> Vector2:
	var rect := stage_working_rect()
	return rect.position + p * rect.size.x / SURFACE.x

func _local_to_surface(p: Vector2) -> Vector2:
	var rect := stage_working_rect()
	return (p - rect.position) * SURFACE.x / maxf(rect.size.x, 0.001)

func set_supplies(supplies: Dictionary) -> void:
	_supplies=supplies.duplicate()
	_supplies_known=true
	queue_redraw()

func replacement_visible(part: String, material_id: String) -> bool:
	var at:=_v(_state.parts.get(part,[555.0,272.0]))
	return at.x<420 or not _supplies_known or float(_supplies.get(material_id,0))>0

func interaction_targets() -> Array:
	if not interaction_allowed or _state.is_empty() or _state.complete or _plan.is_empty():
		return []
	var a: Dictionary = _plan[mini(int(_state.step), _plan.size() - 1)]
	var point := _v(a.at)
	return [{"id":a.id, "label":a.label, "position":_surface_to_local(point),
		"radius":maxf(22.0, stage_working_rect().size.x / SURFACE.x * 28.0),
		"drop_position":_surface_to_local(_v(a.get("to", a.at))), "busy":_state.phase != "idle"}]

func action_text() -> String:
	if _state.is_empty(): return "准备工位"
	if _state.complete: return "工序已完成"
	if _plan.is_empty(): return "无需操作"
	return String(_plan[mini(int(_state.step), _plan.size() - 1)].label)

func hint_text() -> String:
	if not _feedback.is_empty(): return _feedback
	if _state.is_empty(): return "将手表放入软垫表座。"
	if _state.complete: return _result_text()
	if _plan.is_empty(): return "当前没有可操作的工序。"
	var a: Dictionary = _plan[mini(int(_state.step), _plan.size() - 1)]
	if _state.phase != "idle":
		return "正在" + String(a.label) + " · 等工具移开后再进行下一步"
	if a.has("part"):
		var guide := _transfer_guide(a)
		if _v(a.at).distance_to(_v(a.to)) <= 68.0:
			return "点按%s或下方按钮，工具会将%s放到%s。" % [guide.part, guide.part, guide.destination]
		return "拖动%s → %s；也可点按%s或下方按钮，工具会自动代放。" % [guide.part, guide.destination, guide.part]
	return "点按标记处，使用%s：%s。%s" % [TOOL_NAMES.get(a.tool, "工具"), a.label, a.hint]

func _transfer_guide(a: Dictionary) -> Dictionary:
	var mech: bool = _profile.get("movement", "quartz") == "mechanical"
	var parts := {"cover":"后盖", "old_part":"旧齿轮" if mech else "旧电池", "new_part":"新齿轮" if mech else "新电池", "component":"金属部件", "fixing":"固定件", "link":"表节", "ballast":"配重片", "watch":"手表"}
	var destinations := {"lift_cover":"右上后盖格", "return_cover":"表壳座", "remove_fault":"旧件格", "place_replacement":"轮轴座" if mech else "电池座", "remove_washable":"清洗篮", "return_bridge":"定位柱", "place_fixing":"固定孔", "place_link":"表带缺口", "place_ballast":"后盖内侧槽", "move_to_scale":"称盘中央"}
	return {"part":parts.get(a.get("part", ""), "零件"), "destination":destinations.get(a.id, "对应工位")}

func advance() -> void:
	if not interaction_allowed or _state.is_empty() or _state.complete or _state.phase != "idle" or _plan.is_empty(): return
	_feedback = ""
	var a: Dictionary = _plan[int(_state.step)]
	_state.phase = "take"
	_state.elapsed = 0.0
	_state.tool.kind = a.tool
	_state.tool.position = _arr(_rack(a.tool))
	_state.tool.angle = 0.0
	_animate()
	progressed.emit(progress_snapshot())
	queue_redraw()

func _gui_input(event: InputEvent) -> void:
	if not interaction_allowed or _state.is_empty() or _state.complete: return
	if event is InputEventKey and event.pressed and not event.echo and event.keycode in [KEY_ENTER, KEY_SPACE]:
		advance()
		accept_event()
		return
	var pos := Vector2.ZERO
	var down := false
	var up := false
	var motion := false
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		pos = event.position
		down = event.pressed
		up = not event.pressed
	elif event is InputEventScreenTouch:
		pos = event.position
		down = event.pressed
		up = not event.pressed
	elif event is InputEventMouseMotion and _pressed:
		pos = event.position
		motion = true
	elif event is InputEventScreenDrag and _pressed:
		pos = event.position
		motion = true
	else: return
	if _state.phase != "idle": return
	var previous_feedback := _feedback
	var at := _local_to_surface(pos)
	var a: Dictionary = _plan[int(_state.step)]
	if down:
		var reach := maxf(29.0, 23.0 * SURFACE.x / maxf(stage_working_rect().size.x, 1.0))
		_pressed = at.distance_to(_v(a.at)) <= reach
		_drag_origin = at
		_drag_at = at
		_pointer_dragging = false
		if not _pressed:
			_feedback = "请对准标出的接触点：" + String(a.label)
		else:
			_feedback = ""
	elif motion and _pressed:
		_drag_at = at.clamp(Vector2(18, 65), SURFACE - Vector2(18, 30))
		_pointer_dragging = _drag_origin.distance_to(at) > 8.0
	elif up and _pressed:
		_pressed = false
		# A tap is the accessible snap-to-contact equivalent. Dragged transfers
		# must land on the tray/seat, so a misplaced part never teleports away.
		if _pointer_dragging and a.has("part") and at.distance_to(_v(a.to)) > 65.0:
			var guide := _transfer_guide(a)
			_feedback = "%s还未放入%s，已留在原位。请按箭头重试。" % [guide.part, guide.destination]
		else:
			advance()
		_pointer_dragging = false
	accept_event()
	if _feedback != previous_feedback:
		progressed.emit(progress_snapshot())
	queue_redraw()

func _process(delta: float) -> void:
	if not interaction_allowed or _state.is_empty(): return
	if _state.phase == "idle":
		if _task == "test" and float(_state.test) > 0.0:
			queue_redraw()
		return
	var remaining := maxf(0.0, delta)
	while remaining > 0.0 and _state.phase != "idle":
		var duration := _phase_duration()
		var consumed := minf(remaining, maxf(0.0, duration - float(_state.elapsed)))
		_state.elapsed = float(_state.elapsed) + consumed
		remaining -= consumed
		_animate()
		if float(_state.elapsed) >= duration - 0.00001:
			_next_phase()
		else: break
	# Every emitted position is resumable, including tool contact and lifted parts.
	progressed.emit(progress_snapshot())
	queue_redraw()

func _reduced() -> bool:
	var game = get_node_or_null("/root/Game")
	return game != null and bool(game.prefs.get("reduced_motion", false))

func _phase_duration() -> float:
	var a: Dictionary = _plan[int(_state.step)]
	var duration: float = {"take":0.18, "contact":0.28, "act":float(a.get("duration", 0.8)), "release":0.27, "result":0.20}.get(_state.phase, 0.20)
	return minf(duration, 0.13 if _state.phase == "act" else 0.07) if _reduced() else duration

func _next_phase() -> void:
	var index := PHASES.find(_state.phase)
	if _state.phase == "act": _apply_effect(_plan[int(_state.step)])
	_state.elapsed = 0.0
	if index == PHASES.size() - 1:
		_state.step = int(_state.step) + 1
		_state.phase = "idle"
		_state.tool.kind = ""
		if int(_state.step) >= _plan.size():
			_state.complete = true
			progressed.emit(progress_snapshot())
			completed.emit()
	else:
		_state.phase = PHASES[index + 1]
		_animate()

func _animate() -> void:
	var a: Dictionary = _plan[int(_state.step)]
	var t := clampf(float(_state.elapsed) / maxf(0.001, _phase_duration()), 0.0, 1.0)
	var eased := t * t * (3.0 - 2.0 * t)
	var contact := _motion_tip(a, 0.0)
	var rack := _rack(a.tool)
	var tip := rack
	var angle := 0.0
	match String(_state.phase):
		"take": tip = rack + Vector2(0, -10 * eased)
		"contact": tip = (rack + Vector2(0, -10)).lerp(contact, eased)
		"act":
			tip = _motion_tip(a, t)
			if String(a.get("motion", "press")) in ["turn", "screw_group"]: angle = sin(t * TAU * 2) * 0.24
			if a.has("part"):
				_state.parts[a.part] = _arr(tip)
				if a.part == "watch": _state.watch_scale = lerpf(1.0, 0.94, eased)
			_update_visual_effect(a, t)
		"release":
			tip = _motion_tip(a, 1.0).lerp(rack, eased) + Vector2(0, -18 * sin(t * PI))
		"result": tip = rack
	_state.tool.position = _arr(tip)
	_state.tool.angle = angle

func _motion_tip(a: Dictionary, t: float) -> Vector2:
	var contact := _v(a.at)
	var eased := t * t * (3.0 - 2.0 * t)
	match String(a.get("motion", "press")):
		"screw_group":
			var screws: Array = a.screw_indices
			if screws.size() == 1: return contact
			var second := _screw_pos(int(screws[1]))
			if t <= 0.42: return contact
			if t >= 0.58: return second
			var travel := (t - 0.42) / 0.16
			return contact.lerp(second, travel) + Vector2(0, -12 * sin(travel * PI))
		"lever": return contact + Vector2(3 * sin(t * PI), -9 * sin(t * PI))
		"transfer": return contact.lerp(_v(a.get("to",a.at)), eased) + Vector2(0, -35 * sin(t * PI))
		"wash": return contact + Vector2(sin(t * TAU * 3) * 6, sin(t * TAU * 6) * 2)
		"blow": return contact + Vector2(0, sin(t * TAU * 3) * 3)
		"glyph": return _glyph_point(t)
		"serial": return Vector2(165.0 + 163.0 * t, 230.0 + 7.0 * sin(t * TAU * 14))
		"trace": return contact + Vector2(sin(t * TAU * 2) * 4, 0)
		"oil": return contact + Vector2(0, 2 * sin(t * PI))
		"settle": return contact + Vector2(0, 3 * sin(t * PI))
	return contact

func _update_visual_effect(a: Dictionary, t: float) -> void:
	if a.has("screw_indices") and a.screw_indices.size() > 1 and t >= 0.42:
		# The first physical screw is stored before crossing to its partner.
		_set_screw(int(a.screw_indices[0]), String(a.id).begins_with("unscrew_"))
	match String(a.id):
		"wash_metal": _state.washed = t
		"dry_metal": _state.dry = t
		"paint_logo": _state.logo = t
		"print_serial": _state.serial = t
		"measure_ballast": _state.scale = t
		"mechanical_trace", "quartz_tick", "final_check": _state.test = t

func _apply_effect(a: Dictionary) -> void:
	if a.has("part"): _state.parts[a.part] = a.to.duplicate()
	var id := String(a.id)
	if a.has("screw_indices"):
		for index in a.screw_indices:
			_set_screw(int(index), id.begins_with("unscrew_"))
		if id.begins_with("fasten_") and int(a.screw_indices[-1]) == 3: _state.opened = false
	if id.begins_with("oil_"):
		if not _state.oil.has(id): _state.oil.append(id)
	match id:
		"return_cover":
			# Replacement shells may introduce bolts on a formerly snap-fit case.
			if int(_state.step) + 1 < _plan.size() and _plan[int(_state.step) + 1].has("screw_indices"):
				_state.screws = [true, true, true, true]
		"lift_cover", "unscrew_cover", "lever_snap": _state.opened = true
		"tighten_cover", "press_snap": _state.opened = false
		"safe_quartz", "safe_mechanical": _state.power_safe = true
		"release_clamp": _state.clamp_open = true
		"secure_clamp", "seat_bridge":
			_state.clamp_open = false
			_state.seated = true
		"wash_metal": _state.washed = 1.0
		"dry_metal": _state.dry = 1.0
		"paint_logo":
			_state.logo = 1.0
			_state.trace = "漆层边缘厚差与重描纹"
		"print_serial":
			_state.serial = 1.0
			_state.trace = "覆印晕边与残留底码"
		"uv_check": _state.uv = true
		"place_ballast":
			_state.ballast_set = true
			_state.trace = "后盖内侧配重与固定片加工痕"
		"move_to_scale":
			_state.watch_on_scale = true
			_state.watch_scale = 0.94
		"measure_ballast": _state.scale = 1.0
		"mechanical_trace", "quartz_tick", "final_check": _state.test = 1.0

func _action(id: String, label: String, hint: String, tool: String, at: Vector2, motion := "press", duration := 0.8) -> void:
	_plan.append({"id":id, "label":label, "hint":hint, "tool":tool, "at":_arr(at), "motion":motion, "duration":duration})

func _transfer(id: String, label: String, hint: String, part: String, from: Vector2, to: Vector2) -> void:
	_action(id, label, hint, "tweezers", from, "transfer", 0.9)
	_plan[-1].part = part
	_plan[-1].to = _arr(to)

func _build_plan() -> void:
	_plan.clear()
	var mech: bool = _profile.get("movement", "quartz") == "mechanical"
	match _task:
		"open":
			_safe_action()
			_open_actions()
			_action("inspect_mechanical" if mech else "inspect_quartz", "定位异常轮系与固定点" if mech else "检查供电端子与固定点", "放大观察已露出的实际部件，再记录内部检查结果", "probe", Vector2(268, 215) if mech else Vector2(283, 238), "trace", 1.2)
		"wash":
			_safe_action()
			_transfer("remove_washable", "取出可洗金属件", "夹住桥板边缘，移至清洗篮；电子模块留在表内", "component", GEAR_SEAT, BASKET)
			_action("wash_metal", "清洗金属件", "轻刷清洗篮中的旧油，不浸泡表盘或电子模块", "brush", BASKET, "wash", 1.5)
			_action("drain_metal", "提篮沥干", "抬高清洗篮，让清洗液从网孔流回", "tweezers", BASKET, "lever", 0.8)
			_action("dry_metal", "吹干轴孔与凹槽", "气嘴对准金属件，待残液完全退去", "blower", BASKET, "blow", 1.3)
		"replace":
			if _replacement_internal():
				_safe_action()
			if _has_fault("battery") or _has_fault("movement_part") or _item.get("service", {}).get("faults", []).is_empty():
				_action("release_clamp", "抬起电池压片" if not mech else "松开故障轮桥板", "先释放固定件，再取出故障件", "driver", Vector2(292, 237), "turn")
				_transfer("remove_fault", "取出旧电池" if not mech else "取出损伤齿轮", "夹住边缘，移入旧件盘，保持孔位可见", "old_part", Vector2(275, 252), Vector2(476, 272))
				_transfer("place_replacement", "装入匹配新电池" if not mech else "对准轮轴落座新轮", "从新件格夹起，沿定位孔轻放，不压电路或轮齿", "new_part", Vector2(555, 268), Vector2(275, 252))
				_action("secure_clamp", "固定电池压片" if not mech else "固定轮桥并检查啮合", "固定点对准后再紧固", "driver", Vector2(292, 237), "turn")
			if _has_fault("missing_fixing"):
				_transfer("place_fixing", "补入匹配内侧固定件", "将缺失的固定件落入空定位孔，保留原零件", "fixing", Vector2(540, 251), Vector2(322, 259))
				_action("secure_fixing", "拧紧内侧固定件", "刀口对准新件槽口，固定后检查机芯无晃动", "driver", Vector2(322, 259), "turn")
			if _has_fault("missing_link"):
				_action("release_springbar", "压缩生耳并对准缺节处", "生耳批接触表带内侧肩位，不打开后盖", "springbar", Vector2(286, 356), "press")
				_transfer("place_link", "补入匹配金属表节", "表节方向与两侧拉丝一致，对准生耳孔位落座", "link", Vector2(560, 269), Vector2(248, 356))
				_action("secure_link", "释放生耳并拉力复核", "生耳两端归入孔位后，轻拉两侧确认固定", "springbar", Vector2(286, 356), "lever", 1.0)
		"assemble":
			if mech and (_item.get("service", {}).get("done", []).has("wash") or _has_fault("old_oil")):
				for p in [Vector2(216, 205), Vector2(274, 204), Vector2(242, 270)]:
					_action("oil_%d" % _plan.size(), "微量点油 · 轴承 %d" % (_plan.size() + 1), "仅在红宝石轴承中心留下一点油珠", "oiler", p, "oil", 0.75)
			_transfer("return_bridge", "对位回装轮桥" if mech else "回装绝缘压片", "将干燥部件对准两个定位柱，平稳落座", "component", BASKET, GEAR_SEAT)
			_action("seat_bridge", "固定轮桥" if mech else "固定压片并恢复供电", "交替紧固定位点，后盖仍留在零件盘", "driver", Vector2(292, 237), "turn")
		"test":
			if mech:
				_action("attach_timegrapher", "连接校表仪拾音夹", "拾音头贴合表壳，观察两列走时轨迹", "probe", Vector2(356, 220), "press")
				_action("adjust_regulator", "轻调快慢针", "微调摆轮旁快慢针，让轨迹逐渐平行", "oiler", Vector2(208, 270), "trace", 1.4)
				_action("mechanical_trace", "观察稳定走时轨迹", "等待摆幅与走时读数稳定，不触碰轮系", "probe", Vector2(356, 220), "settle", 1.5)
			else:
				_action("check_voltage", "测量电池供电", "表笔接触电池与端子；石英机芯无需调快慢针", "probe", Vector2(275, 252), "press", 1.1)
				_action("set_crown", "校正指针并推回表冠", "沿表冠轴向校时，恢复每秒一步", "fingers", _crown_contact(), "turn", 1.0)
				_action("quartz_tick", "复核石英步进", "观察供电与连续步进，不跳过稳定读数", "probe", Vector2(356, 220), "settle", 1.5)
			_close_actions()
			_action("final_check", "封盖后最终复核", "确认后盖齐平、表冠归位与走时稳定", "probe", Vector2(360, 227), "settle", 1.1)
		"forge_logo":
			_action("prepare_logo", "细笔蘸取重描涂层", "固定表盘，将笔尖落在原有标识边缘", "pen", Vector2(215, 156), "press", 0.8)
			_action("paint_logo", "沿本型号标识重描", "细笔贴着标识轮廓走，笔画随接触逐一形成", "pen", _glyph_point(0.0), "glyph", 2.8)
			_action("dry_logo", "吹干并观察漆层边缘", "反光掠过后，仍能看到边缘厚差与重描纹", "blower", Vector2(248, 170), "blow", 1.1)
		"forge_serial":
			_action("clean_serial", "清洁后盖编号区", "沿后盖中部擦净，保留原底码的浅痕", "swab", Vector2(248, 227), "wash", 1.0)
			_action("print_serial", "定位并逐字覆印编号", "模板贴合后盖，字符随笔头接触依次形成", "pen", Vector2(165, 230), "serial", 2.3)
			_action("uv_check", "紫外照射检查覆印", "紫外灯掠过后盖，查看新码与周围覆印晕边", "uv", Vector2(248, 227), "trace", 1.4)
		"forge_weight":
			if not _started_opened:
				_safe_action()
				_open_actions()
			_transfer("place_ballast", "放入配重并贴合内盖", "从新件格夹起配重，安放在后盖内侧的定位槽", "ballast", Vector2(558, 270), Vector2(315, 288))
			_action("secure_ballast", "压牢配重固定片", "固定片沿边缘贴合，留下可观察的加工痕", "driver", Vector2(315, 288), "press", 0.85)
			_close_actions()
			_action("move_to_scale", "将封好的手表移上称盘", "握住表壳两侧，抬离表座后轻放在称盘中央", "fingers", CENTER, "transfer", 1.15)
			_plan[-1].part = "watch"
			_plan[-1].to = [248.0, 237.0]
			_action("measure_ballast", "称重并等待数值稳定", "将封好的手表置于称盘，等待克数稳定；内盖保留配重固定痕", "probe", Vector2(354, 287), "settle", 1.8)

func _has_fault(kind: String) -> bool:
	var faults = _item.get("service", {}).get("faults", [])
	if faults is Dictionary: return bool(faults.get(kind, false))
	for fault in faults:
		if fault is Dictionary and String(fault.get("kind", fault.get("id", ""))) == kind and not bool(fault.get("resolved", false)):
			return true
	return false

func _replacement_internal() -> bool:
	return _has_fault("battery") or _has_fault("movement_part") or _has_fault("missing_fixing") or _item.get("service", {}).get("faults", []).is_empty()

func _external_only() -> bool:
	return _task == "replace" and _has_fault("missing_link") and not _replacement_internal()

func _safe_action() -> void:
	var mech: bool = _profile.get("movement", "quartz") == "mechanical"
	_action("safe_mechanical" if mech else "safe_quartz", "停机并释放储能" if mech else "停机并隔离供电", "固定软垫表座，操作表冠；拆出部件前安全停机", "fingers", _crown_contact(), "turn", 0.9)

func _open_actions() -> void:
	match String(_profile.get("caseback", "screw")):
		"bolts":
			_screw_actions("unscrew", [0, 1, 2, 3])
		"snap": _action("lever_snap", "从缺口撬起压入式后盖", "刀口仅插入壳侧缺口，轻抬至盖缘分离", "caseknife", _snap_contact(), "lever", 1.0)
		_: _action("unscrew_cover", "双爪旋开旋入式后盖", "开盖器两爪卡入对侧槽口，逆时针旋松", "opener", CENTER, "turn", 1.4)
	_transfer("lift_cover", "取下后盖放入零件盘", "夹住盖缘，抬起后移入有软垫的后盖格", "cover", CENTER, COVER_TRAY)

func _close_actions() -> void:
	_transfer("return_cover", "对准密封圈放回后盖", "确认边缘齐平，后盖回到原壳位", "cover", COVER_TRAY, CENTER)
	match String(_profile.get("caseback", "screw")):
		"bolts":
			_screw_actions("fasten", [0, 2, 1, 3])
		"snap": _action("press_snap", "均匀压合压入式后盖", "沿盖缘均匀施力，确认后盖完全落座", "press", CENTER, "press", 1.0)
		_: _action("tighten_cover", "顺时针旋紧后盖", "双爪卡住槽口，顺时针旋至盖缘齐平", "opener", CENTER, "turn", 1.15)

# Persist the actual grouping for migrated work. Completed screws stay behind
# the cursor; an active old single-screw animation retains its exact trajectory.
func _migrate_screw_layout(step: int, phase: String) -> void:
	_screw_layout.clear()
	for prefix in ["unscrew", "fasten"]:
		var completed_screws := []
		var pending := []
		var active := []
		for n in range(_plan.size()):
			var action: Dictionary = _plan[n]
			if not String(action.id).begins_with(prefix + "_") or not action.has("screw_indices"): continue
			var screw: int = action.screw_indices[0]
			if n < step: completed_screws.append(screw)
			elif n == step and phase != "idle": active.append(screw)
			else: pending.append(screw)
		var groups := []
		for n in range(0, completed_screws.size(), 2): groups.append(completed_screws.slice(n, n + 2))
		if not active.is_empty(): groups.append(active)
		for n in range(0, pending.size(), 2): groups.append(pending.slice(n, n + 2))
		if not groups.is_empty(): _screw_layout[prefix] = groups

func _screw_actions(prefix: String, order: Array) -> void:
	var groups: Array = _screw_layout.get(prefix, [order.slice(0, 2), order.slice(2, 4)])
	if _legacy_screws:
		groups = []
		for index in order: groups.append([index])
	for group in groups:
		var legacy_ids := []
		var suffix := ""
		var numbers := PackedStringArray()
		for index in group:
			legacy_ids.append("%s_%d" % [prefix, int(index)])
			suffix += str(int(index))
			numbers.append(str(int(index) + 1))
		var opening := prefix == "unscrew"
		var id: String = legacy_ids[0] if _legacy_screws else "%s_group_%s" % [prefix, suffix]
		_action(id, ("卸下后盖螺钉组 · " if opening else "交叉紧固后盖螺钉组 · ") + " / ".join(numbers),
			"刀口对准槽口，同组螺钉依次旋松后收入零件盘" if opening else "先紧固对角螺钉，再交叉收妥另一组，避免盖缘偏斜",
			"driver", _screw_pos(int(group[0])), "turn" if group.size() == 1 else "screw_group", 0.85 if opening else 0.75)
		_plan[-1].screw_indices = group.duplicate()
		_plan[-1].legacy_ids = legacy_ids

func _set_screw(index: int, removed: bool) -> void:
	_state.screws[index] = removed
	if removed: _state.opened = true

func _rack(_tool: String) -> Vector2:
	return Vector2(91, 430)

func _screw_pos(index: int) -> Vector2:
	return CENTER + Vector2.from_angle(-PI * 0.75 + index * PI * 0.5) * 91.0

func _glyph_point(t: float) -> Vector2:
	if _glyph.is_empty(): return Vector2(248, 155)
	var cursor := clampf(t,0.0,1.0) * float(_glyph.size() - 1)
	var index := int(cursor)
	var p: Array = _glyph[index]
	var next: Array = _glyph[mini(index + 1,_glyph.size() - 1)]
	return Vector2(200 + float(p[0]) * 4,125 + float(p[1]) * 4).lerp(Vector2(200 + float(next[0]) * 4,125 + float(next[1]) * 4), cursor - index)

func _result_text() -> String:
	match _task:
		"open": return "后盖与螺钉已收妥 · 机芯保持在表座内"
		"wash": return "可洗金属件已清洗、沥干并吹干 · 等待回装"
		"replace": return "匹配部件已落座固定 · 旧件留在零件盘"
		"assemble": return "部件已回装到位 · 后盖仍待走时复核后封回"
		"test": return "走时复核完成 · 后盖已封妥"
		_: return "加工完成 · " + String(_state.get("trace", "保留加工痕迹"))

static func _arr(v: Vector2) -> Array:
	return [v.x, v.y]

static func _v(a) -> Vector2:
	return Vector2(float(a[0]), float(a[1]))

func _draw() -> void:
	if _state.is_empty() or _font == null: return
	var rect := stage_working_rect()
	var unit := rect.size.x / SURFACE.x
	if unit <= 0.0: return
	draw_set_transform(rect.position, 0.0, Vector2.ONE * unit)
	_draw_mat()
	_draw_tray()
	_draw_holder()
	var watch_scale := float(_state.get("watch_scale", 1.0))
	var watch_position := _v(_state.parts.get("watch", [248.0,227.0]))
	draw_set_transform(rect.position + (watch_position - CENTER * watch_scale) * unit, 0.0, Vector2.ONE * unit * watch_scale)
	_draw_strap()
	_draw_case()
	if _task == "forge_logo" or _external_only():
		_draw_dial()
		if _external_only(): _draw_external_parts()
	else:
		_draw_movement()
		_draw_loose_parts()
		_draw_cover(_v(_state.parts.cover))
	draw_set_transform(rect.position, 0.0, Vector2.ONE * unit)
	_draw_instrument()
	_draw_rack()
	_draw_contact()
	_draw_tool()
	_draw_labels()
	draw_set_transform(Vector2.ZERO)

func _draw_mat() -> void:
	_panel(Rect2(3, 3, 634, 454), Color("142326"), Color("53635c"), 13)
	_panel(Rect2(11, 11, 618, 438), Color("203332"), Color("304541"), 9)
	for x in range(24, 630, 13):
		draw_line(Vector2(x, 61), Vector2(x, 433), Color(0.54, 0.65, 0.57, 0.025), 1)
	for y in range(67, 435, 13):
		draw_line(Vector2(22, y), Vector2(620, y), Color(0.54, 0.65, 0.57, 0.025), 1)
	draw_line(Vector2(22, 58), Vector2(618, 58), Color("51615b"), 1)
	for p in [Vector2(21, 20), Vector2(619, 20), Vector2(21, 440), Vector2(619, 440)]:
		_draw_screw(p, 3.2, 0.4, Color("788b7e"))

func _draw_tray() -> void:
	_panel(Rect2(437, 69, 177, 232), Color("101c1e"), Color("65746b"), 8)
	_panel(Rect2(446, 94, 159, 115), Color("2d3c37"), Color("48554c"), 5)
	_panel(Rect2(446, 218, 72, 72), Color("2e3731"), Color("48554c"), 4)
	_panel(Rect2(526, 218, 79, 72), Color("304038"), Color("48554c"), 4)
	_text(Vector2(448, 86), "零件盘 / PARTS", 11, MUTED)
	_text(Vector2(451, 231), "旧件", 10, MUTED)
	_text(Vector2(532, 231), "匹配件", 10, MUTED)
	for i in range(4):
		if bool(_state.screws[i]): _draw_screw(Vector2(462 + i * 14, 198), 4, -0.3, STEEL)
	if _task in ["wash", "assemble"]:
		# Only the small removable metal component goes in liquid; the watch,
		# dial and circuit board remain visibly outside this shallow basket.
		_panel(Rect2(477, 233, 94, 51), Color("182c2b"), Color("a1b2a8"), 6)
		for x in range(482, 569, 7): draw_line(Vector2(x, 239), Vector2(x, 279), Color("536c63"), 1)
		for y in range(240, 283, 7): draw_line(Vector2(482, y), Vector2(566, y), Color("536c63"), 1)
		if _task == "wash" and float(_state.dry) < 1.0:
			draw_rect(Rect2(481, 252, 86, 25), Color(0.28, 0.52, 0.52, 0.22 * (1.0 - float(_state.dry))))

func _draw_holder() -> void:
	var placing: bool = not _state.complete and not _plan.is_empty() and _plan[mini(int(_state.step), _plan.size() - 1)].id == "move_to_scale" and _state.phase != "idle"
	if _task == "forge_weight" and (bool(_state.get("watch_on_scale", false)) or placing):
		var pan := _v(_state.parts.get("scale_pan", [248.0,237.0]))
		_panel(Rect2(126, 137, 244, 244), Color("29392f"), Color("899a80"), 15)
		_panel(Rect2(141, 344, 214, 35), Color("526951"), Color("a0ad8e"), 5)
		draw_circle(pan + Vector2(2, 5), 129, Color(0.02, 0.05, 0.03, 0.5))
		draw_circle(pan, 127, Color("bac7ad"))
		draw_circle(pan, 124, Color("697f68"))
		draw_circle(pan, 121, Color("8a9c7e"))
		draw_arc(pan, 124, -2.9, -0.25, 70, Color("d7ddbd"), 1.5, true)
		for x in range(132, 368, 8):
			draw_line(Vector2(x, 365), Vector2(x + 4, 365), Color("829875"), 1)
		_text(Vector2(167, 375), "称盘 / 平稳放置后读取克数", 10, Color("d2d7b6"))
		draw_polyline(PackedVector2Array([Vector2(368, 352), Vector2(410, 352), Vector2(438, 350)]), Color("b9ba8c"), 2, true)
		return
	# A low, stationary holder: contact shadows stay under the held watch.
	_panel(Rect2(107, 105, 283, 248), Color("0e1b1b"), Color("45534d"), 18)
	_panel(Rect2(116, 115, 265, 229), Color("293c34"), Color("657461"), 13)
	for p in [Vector2(126, 144), Vector2(369, 144), Vector2(126, 311), Vector2(369, 311)]:
		_panel(Rect2(p - Vector2(12, 17), Vector2(24, 34)), Color("778475"), Color("a1ab91"), 3)
		draw_rect(Rect2(p - Vector2(10, 12), Vector2(20, 24)), Color("26342e"))
		_draw_screw(p + Vector2(0, 11), 4, 0, Color("b8c4ab"))

func _draw_strap() -> void:
	var metal: bool = _appearance.get("strap", "leather") == "metal"
	var strap_color := Color(String(_appearance.get("strap_color", "76543f")))
	for top in [true, false]:
		var start := 65.0 if top else 328.0
		var height := 64.0 if top else 63.0
		var rect := Rect2(213, start, 70, height)
		_panel(rect, strap_color.darkened(0.24), strap_color.lightened(0.05), 4)
		if metal:
			for y in range(int(start + 2), int(start + height - 2), 10):
				if _task == "replace" and _has_fault("missing_link") and y > 344 and y < 370: continue
				draw_rect(Rect2(218, y, 60, 8), strap_color.darkened(0.18))
				draw_line(Vector2(224, y + 1), Vector2(271, y + 1), strap_color.lightened(0.20), 1)
				draw_line(Vector2(232, y), Vector2(232, y + 7), Color("47584f"), 1)
				draw_line(Vector2(263, y), Vector2(263, y + 7), Color("47584f"), 1)
		elif _appearance.get("strap") == "rubber":
			for y in range(int(start + 4), int(start + height - 3), 8):
				draw_rect(Rect2(219, y, 58, 3), strap_color.darkened(0.48))
				draw_line(Vector2(220, y + 3), Vector2(276, y + 3), strap_color.lightened(0.08), 1)
		elif _appearance.get("strap") == "cloth":
			for x in range(217, 280, 4):
				draw_line(Vector2(x, start + 1), Vector2(x, start + height - 1), strap_color.lightened(0.12), 1)
			for y in range(int(start + 2), int(start + height - 2), 5):
				draw_line(Vector2(216, y), Vector2(280, y), strap_color.darkened(0.18), 1)
		else:
			for y in range(int(start + 3), int(start + height - 3), 7):
				draw_line(Vector2(218, y), Vector2(220, y + 3), Color("9a8160"), 1)
				draw_line(Vector2(276, y), Vector2(278, y + 3), Color("9a8160"), 1)
			for y in range(int(start + 12), int(start + height - 6), 13):
				draw_circle(Vector2(248, y), 2, Color("201f1a"))
	for y in [118.0, 336.0]:
		draw_line(Vector2(201, y), Vector2(294, y), Color("232e2a"), 9)
		draw_line(Vector2(204, y - 1), Vector2(291, y - 1), Color("a5b1a4"), 3)

func _draw_case() -> void:
	if _shaped_case(): _case_shape(CENTER+Vector2(4,7),123,Color(0.02,0.05,0.05,0.5))
	else: draw_circle(CENTER + Vector2(4, 7), 123, Color(0.02, 0.05, 0.05, 0.5))
	var rim := Color(String(_appearance.get("case_color", "b6c0c0")))
	_case_shape(CENTER, 121, Color("182221"))
	_case_shape(CENTER, 117, rim.darkened(0.20))
	_case_shape(CENTER, 113, rim)
	_case_shape(CENTER, 109, rim.darkened(0.45))
	_case_shape(CENTER, 106, Color("0e1a19"))
	if _appearance.case_shape == "square":
		draw_line(CENTER + Vector2(-114, 114), CENTER + Vector2(-114, -114), rim.lightened(0.20), 2)
		draw_line(CENTER + Vector2(-114, -114), CENTER + Vector2(114, -114), rim.lightened(0.20), 2)
	else:
		_draw_contour_arc(CENTER,115,-2.85,-0.7,60,rim.lightened(0.20),2.5)
		_draw_contour_arc(CENTER,117,0.35,1.98,45,rim.darkened(0.45),2)
		_draw_contour_arc(CENTER,108,-0.3,2.9,70,Color("899575"),1)
	for angle in [0.0, PI]:
		var p := CENTER + _case_offset(121,angle) + Vector2.from_angle(angle)*3
		draw_line(p - Vector2(0, 11), p + Vector2(0, 11), Color("bbc7b9"), 3)
	var crown := _crown_rect()
	_panel(crown, Color("768e80"), Color("bfccba"), 4)
	for offset in [8,12,16,20,24]: draw_line(crown.position+Vector2(offset,3),crown.position+Vector2(offset,19),Color("3c5146"),1)
	if bool(_state.power_safe):
		draw_line(crown.position+Vector2(27,3),crown.position+Vector2(27,19),GOLD,2)

func _draw_movement() -> void:
	draw_circle(CENTER, 103, Color("53695a"))
	draw_circle(CENTER, 99, Color("8f9c80"))
	for y in range(144, 317, 6):
		var half := sqrt(maxf(0, 96.0 * 96.0 - pow(float(y) - CENTER.y, 2)))
		draw_line(Vector2(CENTER.x - half, y), Vector2(CENTER.x + half, y), Color(0.91, 0.91, 0.72, 0.08), 1)
	if _profile.get("movement", "quartz") == "mechanical": _draw_mechanical()
	else: _draw_quartz()
	if bool(_state.ballast_set) or _task == "forge_weight":
		var p := _v(_state.parts.ballast)
		_draw_ballast(p)

func _draw_mechanical() -> void:
	var running := float(_state.test) > 0.0
	var theta := float(Time.get_ticks_msec()) * 0.00035 if running and not _reduced() else 0.0
	_draw_gear(Vector2(209, 192), 34, 22, theta, Color("bca362"))
	_draw_gear(Vector2(266, 191), 24, 17, -theta * 1.3, Color("aa995c"))
	_draw_gear(Vector2(312, 211), 25, 18, theta, Color("c9b67c"))
	_draw_gear(Vector2(244, 234), 24, 17, theta * 1.4, Color("c4ad6b"))
	_draw_gear(Vector2(206, 270), 30, 18, sin(theta * 35) * 0.15, Color("d0bb84"))
	for radius in [8.0, 11.0, 15.0, 19.0]:
		draw_arc(Vector2(206, 270), radius, 0.2, TAU - 0.1, 42, Color("494f3a"), 1, true)
	draw_line(Vector2(196, 257), Vector2(211 + float(_state.test) * 4, 247), Color("c2cbb3"), 3)
	draw_line(Vector2(196, 257), Vector2(200, 246), Color("1c2924"), 1)
	_text(Vector2(173, 299), "17 JEWELS", 8, Color("3c4d3d"), true)
	# A visibly separate bridge leaves the winding train and escapement exposed.
	var poly := PackedVector2Array([Vector2(182, 178), Vector2(199, 169), Vector2(278, 182), Vector2(284, 198), Vector2(251, 208), Vector2(208, 198), Vector2(189, 202)])
	draw_colored_polygon(poly, Color("a9b198"))
	draw_polyline(poly, Color("d5d5b9"), 1.4, true)
	for p in [Vector2(191, 187), Vector2(276, 190), Vector2(244, 234), Vector2(206, 270)]:
		draw_circle(p, 5.0, Color("523f46"))
		draw_circle(p, 3.0, Color("9a5a66"))
		draw_circle(p, 1.2, Color("d5aabc"))
	for i in range(_state.oil.size()):
		var p: Vector2 = [Vector2(216, 205), Vector2(274, 204), Vector2(242, 270)][mini(i, 2)]
		draw_circle(p, 4, Color(0.78, 0.62, 0.22, 0.65))
		draw_circle(p - Vector2(1, 1), 1.1, Color("f2e9b8"))
	_draw_replaceable()

func _draw_quartz() -> void:
	var board := PackedVector2Array([Vector2(175, 169), Vector2(263, 150), Vector2(319, 181), Vector2(325, 234), Vector2(291, 230), Vector2(270, 214), Vector2(177, 224)])
	draw_colored_polygon(board, Color("284f41"))
	draw_polyline(board, Color("758f64"), 1.5, true)
	for i in range(5):
		var y := 174.0 + i * 9
		draw_polyline(PackedVector2Array([Vector2(179, y), Vector2(211 + i * 4, y), Vector2(223 + i * 4, y + 16), Vector2(257, y + 16)]), Color("c1a960"), 1.5, true)
		for x in [181.0, 256.0]: draw_circle(Vector2(x, y), 1.7, Color("d3c276"))
	_panel(Rect2(219, 166, 30, 31), Color("111f1e"), Color("6b7f68"), 2)
	for y in range(170, 198, 5):
		draw_line(Vector2(214, y), Vector2(220, y), Color("c5ba7d"), 2)
		draw_line(Vector2(249, y), Vector2(254, y), Color("c5ba7d"), 2)
	_panel(Rect2(184, 208, 40, 13), Color("bac2ae"), Color("53665b"), 6)
	_text(Vector2(188, 217), "32.768", 6, Color("4d6056"), true)
	_panel(Rect2(273, 167, 38, 42), Color("554e33"), Color("af9b5d"), 4)
	for x in range(277, 310, 3): draw_line(Vector2(x, 172), Vector2(x, 204), Color("c98b4a"), 1.7)
	_draw_gear(Vector2(210, 265), 22, 16, 0, Color("cccfb4"))
	_draw_gear(Vector2(240, 282), 15, 12, 0, Color("dbd4b2"))
	_draw_replaceable()
	_text(Vector2(176, 300), "QUARTZ / DC", 8, Color("3d5545"), true)

func _draw_replaceable() -> void:
	var old: Vector2 = _v(_state.parts.old_part)
	var new_part: Vector2 = _v(_state.parts.new_part)
	var replacing := _task == "replace"
	var mech: bool = _profile.get("movement", "quartz") == "mechanical"
	# Fixed seat and central polarity mark remain visible when the old part lifts.
	draw_circle(Vector2(275, 252), 28, Color("4a5c4d"))
	draw_circle(Vector2(275, 252), 24, Color("1e332a"))
	draw_line(Vector2(272, 250), Vector2(278, 250), Color("6d8b72"), 1)
	draw_line(Vector2(275, 247), Vector2(275, 253), Color("6d8b72"), 1)
	if not replacing or old.distance_to(Vector2(275, 252)) < 90:
		if mech: _draw_gear(old, 23, 17, 0, Color("a99959"))
		else: _draw_battery(old, false)
	if replacing and new_part.distance_to(Vector2(275, 252)) < 90:
		if mech: _draw_gear(new_part, 23, 17, 0.08, Color("d0b974"))
		else: _draw_battery(new_part, true)
	var lift := -12.0 if bool(_state.clamp_open) else 0.0
	var clamp := PackedVector2Array([Vector2(293, 236), Vector2(301, 240), Vector2(297, 269 + lift), Vector2(285, 272 + lift), Vector2(285, 267 + lift), Vector2(292, 264 + lift)])
	draw_colored_polygon(clamp, Color("c7ceba"))
	draw_polyline(clamp, Color("71866d"), 1.0, true)
	_draw_screw(Vector2(292, 237), 4.0, 0.4, STEEL)

func _draw_loose_parts() -> void:
	if _task == "replace" and _has_fault("missing_link"): _draw_external_parts()
	if _task == "replace" and _has_fault("missing_fixing") and replacement_visible("fixing","MAT-008"):
		_draw_screw(_v(_state.parts.fixing), 6, 0.2, STEEL)
	if _task == "replace" and (_has_fault("battery") or _has_fault("movement_part")):
		var mech: bool = _profile.get("movement", "quartz") == "mechanical"
		for name in ["old_part", "new_part"]:
			if name=="new_part" and not replacement_visible("new_part","MAT-010" if _has_fault("battery") else "MAT-008"): continue
			var p := _v(_state.parts[name])
			if p.x > 420:
				if mech: _draw_gear(p, 19, 17, 0.1, Color("b9a565") if name == "old_part" else GOLD)
				else: _draw_battery(p, name == "new_part", 0.75)
	if _task in ["wash", "assemble"]:
		var p := _v(_state.parts.component)
		var clean := float(_state.washed) if _task == "wash" else 1.0
		var poly := PackedVector2Array([p + Vector2(-24, -8), p + Vector2(-14, -16), p + Vector2(22, -10), p + Vector2(27, 4), p + Vector2(10, 13), p + Vector2(-22, 8)])
		draw_colored_polygon(poly, Color("a4a78b").lerp(Color("ced2b7"), clean))
		draw_polyline(poly, Color("e0ddbf"), 1, true)
		for offset in [Vector2(-12, -2), Vector2(14, 1)]:
			draw_circle(p + offset, 4, Color("455c49"))
			draw_arc(p + offset, 5.5, 0, TAU, 20, Color("7f8d6d"), 1, true)
		for i in range(8):
			var dirt := p + Vector2(-19 + i * 6, -5 + (i % 3) * 3)
			draw_circle(dirt, 2 + i % 2, Color(0.25, 0.22, 0.12, (1.0 - clean) * 0.85))
		if _task == "wash" and clean > 0.0 and float(_state.dry) < 1.0:
			for i in range(3):
				draw_circle(p + Vector2(-12 + i * 13, 7), 2.4, Color(0.63, 0.84, 0.80, (1.0 - float(_state.dry)) * 0.65))

func _draw_external_parts() -> void:
	if _task=="replace" and not replacement_visible("link","MAT-008"): return
	var p := _v(_state.parts.link)
	_panel(Rect2(p - Vector2(29, 9), Vector2(58, 18)), Color("7d9182"), Color("c7d0b9"), 3)
	for offset in [-15.0, 15.0]:
		draw_line(p + Vector2(offset, -7), p + Vector2(offset, 7), Color("495f4e"), 1)
	draw_line(p + Vector2(-25, -5), p + Vector2(25, -5), Color("aeba9f"), 1)
	if p.x < 420:
		draw_line(p + Vector2(-34, 0), p + Vector2(34, 0), Color("c7ceba"), 1.5)
		_draw_screw(p + Vector2(33, 0), 3, 0.2, STEEL)

func _draw_cover(p: Vector2) -> void:
	var distance := clampf(p.distance_to(CENTER) / CENTER.distance_to(COVER_TRAY), 0.0, 1.0)
	var radius := lerpf(104.0, 51.0, distance)
	if _shaped_case(): _case_shape(p+Vector2(2,4),radius+1,Color(0.02,0.04,0.03,0.5))
	else: draw_circle(p + Vector2(2, 4), radius + 1, Color(0.02, 0.04, 0.03, 0.5))
	_case_shape(p, radius, Color("bac4b3"))
	_case_shape(p, radius - 3, Color("596e5f"))
	_case_shape(p, radius - 6, Color("8d9e89"))
	for y in range(int(-radius + 9), int(radius - 8), 4):
		if _shaped_case():
			for span in _case_hatch_spans(radius-9,float(y)):
				draw_line(p+Vector2(span.x,y),p+Vector2(span.y,y),Color(0.86,0.91,0.80,0.11),1)
		else:
			var half := radius - 9 if _appearance.case_shape == "square" else sqrt(maxf(0.0, pow(radius - 9, 2) - pow(float(y), 2)))
			draw_line(p + Vector2(-half, y), p + Vector2(half, y), Color(0.86, 0.91, 0.80, 0.11), 1)
	if _appearance.case_shape == "square":
		draw_rect(Rect2(p - Vector2.ONE * (radius - 10), Vector2.ONE * (radius - 10) * 2), Color("516849"), false, 1)
	else:
		_draw_contour_arc(p,radius-4,-2.8,-0.6,52,Color("e4e5cb"),1.6)
		_draw_contour_arc(p,radius-10,0,TAU,90,Color("516849"),1)
	var ratio := radius / 104.0
	if String(_profile.get("caseback", "screw")) == "screw":
		for i in range(6):
			var slot := _cover_slot(radius,float(i)*TAU/6.0)
			draw_line(p+slot[0],p+slot[1],Color("40594b"),3*ratio)
	elif String(_profile.get("caseback", "screw")) == "snap":
		var notch := _snap_notch(radius)
		draw_line(p+notch[0],p+notch[1],Color("2d4337"),3)
	else:
		for i in range(4):
			if not bool(_state.screws[i]):
				_draw_screw(p + (_screw_pos(i) - CENTER) * ratio, 5.2 * ratio, -0.5, Color("d9ddc1"))
	if distance < 0.65:
		_text(p + Vector2(-43, -43) * ratio, String(_reference.get("brand", "ORB")), int(12 * ratio), Color("40563e"))
		_text(p + Vector2(-38, 56) * ratio, String(_reference.get("model", "N01")) + " · CASE", int(10 * ratio), Color("435b43"), true)
		if _task == "forge_serial": _draw_serial(p)
		else:
			_text(p + Vector2(-57, 5), "SERVICE BACK", 10, Color("667c61"), true)

func _mark_observed() -> bool:
	if not _item.get("evidence",[]).has("TOL-001"): return false
	var facts: Dictionary = _item.get("inspectionFacts",{}).get("TOL-001",{})
	var revision: String = facts.get("logoRevision","")
	if revision.is_empty():
		var prior = JSON.parse_string(facts.get("appraisalRevision",""))
		if prior is Array and prior.size() >= 10: revision = JSON.stringify([prior[0],int(prior[4]),bool(prior[9])])
	return revision == Model.logo_revision(_item)

func mark_visibility() -> String:
	if _task == "forge_logo" and float(_state.get("logo",0)) > 0 and not _state.get("complete",false): return "painting"
	if WatchForgery.active(_item,"logo") and _item.get("owner","")=="shop": return "crafted"
	return "observed" if _mark_observed() else "hidden"

func _draw_dial() -> void:
	var face := Color(_art.get("face", "#ddd9bc"))
	var dial_ink := Color(_art.get("ink", "#252a30"))
	_case_shape(CENTER, 104, face.darkened(0.20))
	_case_shape(CENTER, 100, face)
	for i in range(60):
		var angle := float(i) * TAU / 60 - PI * 0.5
		draw_line(CENTER+_case_offset(87 if i%5==0 else 93,angle),CENTER+_case_offset(98,angle),dial_ink,3 if i%5==0 else 1,true)
	for i in range(12):
		if i in [0, 3, 6, 9]:
			var offset := _case_offset(77,float(i)*TAU/12-PI*0.5)
			_text(CENTER + offset - Vector2(6, -4), str(12 if i == 0 else i), 13, dial_ink, true)
	_draw_model_dial(dial_ink)
	draw_line(CENTER, CENTER + Vector2(-43, -29), dial_ink.darkened(0.2), 7, true)
	draw_line(CENTER, CENTER + Vector2(38, -61), dial_ink, 4, true)
	draw_line(CENTER, CENTER + Vector2(18, 65), Color("ac6a4a"), 1.5, true)
	draw_circle(CENTER, 5, Color("c0aa6e"))
	var fraction := float(_state.logo) if _task == "forge_logo" and not WatchForgery.active(_item,"logo") else 1.0
	var variant := int(_item.get("watch", {}).get("logo_variant", 1))
	if WatchForgery.active(_item, "logo"): variant = 0
	var observed := mark_visibility() in ["observed","crafted"]
	if observed:
		for pixel in WatchLogo.pixels(WatchForgery.logo_id(_item), variant):
			draw_rect(Rect2(Vector2(200 + pixel[0] * 4,125 + pixel[1] * 4),Vector2(3.7,3.7)),Color(dial_ink,0.28))
	else:
		# Same mosaic for both variants: service work never grants inspection evidence.
		for y in 5:
			for x in 8:
				draw_rect(Rect2(200+x*12,125+y*13,12,13),face.darkened(0.10 + ((x*3+y*5)%4)*0.055))
	var visible_glyph: Array = _glyph if _task == "forge_logo" else WatchLogo.pixels(WatchForgery.logo_id(_item), variant)
	var visible_count := int(ceil(fraction * visible_glyph.size())) if mark_visibility() != "hidden" else 0
	for i in range(visible_count):
		var pixel: Array = visible_glyph[i]
		var origin := Vector2(200 + pixel[0] * 4, 125 + pixel[1] * 4)
		draw_rect(Rect2(origin + Vector2(0.8, 1.0), Vector2(4.3, 4.2)), face.darkened(0.3))
		draw_rect(Rect2(origin, Vector2(3.8, 3.8)), dial_ink)
		if i % 4 == 0: draw_line(origin + Vector2(0, 0.5), origin + Vector2(2.5, 0.5), dial_ink.lightened(0.22), 0.7)
	_text(Vector2(217, 282), String(GameData.def(WatchForgery.logo_id(_item)).watch.model), 10, dial_ink, true)
	# Narrow, directional glass reflection; it never obscures the contact point.
	draw_arc(CENTER, 99, -2.8, -2.25, 25, Color(1, 1, 0.9, 0.28), 5, true)
	if fraction >= 1.0 and _task == "forge_logo":
		_text(Vector2(152, 370), "漆层厚差 / 重描纹保留", 11, GOLD)

func _draw_model_dial(ink: Color) -> void:
	var style := int(_art.get("dial_style",-1))
	if style < 0: return
	var accent := GOLD if _reference.get("brand","")=="星冕" else ink.lightened(0.15)
	match style:
		0:
			draw_arc(CENTER,83,0,TAU,72,accent,1.2,true)
			for offset in [Vector2(-70,0),Vector2(70,0),Vector2(0,70)]: draw_rect(Rect2(CENTER+offset-Vector2(2,6),Vector2(4,12)),accent)
		1:
			for radius in [47,65]: draw_arc(CENTER+Vector2(0,18),radius,0.1,PI-0.1,42,accent,1.3,true)
			for offset in [Vector2(-65,0),Vector2(65,0),Vector2(-48,54),Vector2(48,54)]:
				draw_line(CENTER+offset-Vector2(5,0),CENTER+offset+Vector2(5,0),accent,1.5)
				draw_line(CENTER+offset-Vector2(0,5),CENTER+offset+Vector2(0,5),accent,1.5)
		2:
			var p := CENTER+Vector2(0,56)
			draw_circle(p,24,Color("182537"))
			draw_arc(p,24,0,TAU,36,accent,1.2,true)
			draw_circle(p,13,Color("e4d598"))
			draw_circle(p+Vector2(7,-5),12,Color("182537"))
		3:
			for x in [-73,-65,65,73]: draw_line(CENTER+Vector2(x,-8),CENTER+Vector2(x,8),accent,2)
			for x in [-8,0,8]: draw_line(CENTER+Vector2(x,66),CENTER+Vector2(x,80),accent,2)
			draw_arc(CENTER+Vector2(0,25),22,0,TAU,36,accent,1.3,true)
			draw_line(CENTER+Vector2(0,25),CENTER+Vector2(11,16),accent,1.5)
		4:
			for offset in [Vector2(-74,0),Vector2(74,0),Vector2(0,74)]:
				var p: Vector2 = CENTER+offset
				draw_colored_polygon(PackedVector2Array([p+Vector2(0,-8),p+Vector2(5,0),p+Vector2(0,8),p+Vector2(-5,0)]),accent)
		5:
			for offset in [Vector2(-43,18),Vector2(43,18),Vector2(0,61)]:
				var p: Vector2 = CENTER+offset
				draw_circle(p,21,Color("253437"))
				draw_arc(p,21,0,TAU,32,accent,1.6,true)
				draw_arc(p,11,0,TAU,24,accent,1.2,true)
				draw_line(p-Vector2(14,0),p+Vector2(14,0),accent,1.2)
				draw_line(p-Vector2(0,14),p+Vector2(0,14),accent,1.2)

func _draw_serial(p: Vector2) -> void:
	var fraction := float(_state.serial)
	var uv: bool = bool(_state.uv) or (_state.phase == "act" and _plan[int(_state.step)].id == "uv_check")
	var serial := String(_item.get("watch", {}).get("serial", "ORB N01 2417 003417"))
	if serial.length() > 24: serial = serial.left(24)
	var target := WatchForgery.target_serial(_item) if not _item.get("watch", {}).is_empty() else serial
	if target.is_empty(): target = serial
	if target.length() > 24: target = target.left(24)
	var origin := p + Vector2(-84, 6)
	if uv:
		draw_circle(p, 73, Color(0.42, 0.34, 0.73, 0.12))
		_text(origin + Vector2(1.4, 1), target.left(int(ceil(target.length() * fraction))), 10, Color(0.48, 0.83, 0.76, 0.40), true)
	_text(origin + Vector2(0, 11), serial, 8, Color(0.23, 0.35, 0.23, 0.26), true)
	_text(origin, target.left(int(ceil(target.length() * fraction))), 10, Color("9ce0ca") if uv else Color("638c70"), true)
	if _state.phase == "act" and _plan[int(_state.step)].id == "print_serial":
		draw_rect(Rect2(p + Vector2(-94, -14), Vector2(188, 35)), Color("b9c0a5"), false, 1.4)
		for x in range(162, 340, 8): draw_line(Vector2(x, 207), Vector2(x, 211), Color("c4d0b1"), 1)
	if bool(_state.complete): _text(Vector2(155, 370), "底码浅痕 / 覆印晕边保留", 11, GOLD)

func _draw_instrument() -> void:
	if not _task in ["test", "forge_weight"]: return
	_panel(Rect2(439, 310, 176, 76), Color("384a40"), Color("91a184"), 6)
	_panel(Rect2(448, 326, 157, 48), Color("111f1b"), Color("596e4d"), 3)
	_text(Vector2(449, 321), "电子天平" if _task == "forge_weight" else ("校表仪" if _profile.get("movement") == "mechanical" else "石英供电 / 步进"), 10, Color("acb99e"))
	if _task == "forge_weight":
		var value := maxf(float(_reference.get("nominal_mass", 48)), float(_item.get("watch", {}).get("mass", 0.0)))
		var settling := 1.0 - float(_state.scale)
		var mass := value + sin(float(_state.scale) * 39) * settling * 2.3
		_text(Vector2(469, 354), "%05.1f g" % mass if float(_state.scale) > 0 else "---.- g", 24, Color("abcea4"), true)
		draw_line(Vector2(461, 367), Vector2(590, 367), Color("7c9c6f"), 1)
		if float(_state.scale) >= 1.0: _text(Vector2(452, 396), "克数已稳定 · 内盖固定痕保留", 10, GOLD)
	elif _profile.get("movement", "quartz") == "mechanical":
		for x in range(455, 598, 4):
			var drift := 11.0 * (1.0 - float(_state.test))
			var y := 343.0 + float(x - 455) * drift * 0.04
			draw_circle(Vector2(x, y), 1, Color("8fc194"))
			draw_circle(Vector2(x, y + 7), 1, Color("8fc194"))
		_text(Vector2(456, 369), "+%02d s/d  %03d°" % [int(18 * (1.0 - float(_state.test))), int(226 + 42 * float(_state.test))], 10, Color("a5bc8e"), true)
	else:
		_text(Vector2(457, 345), "1.55 V  /  1 Hz", 15, Color("accf9f"), true)
		for i in range(5):
			var x := 456.0 + i * 28
			draw_polyline(PackedVector2Array([Vector2(x, 366), Vector2(x + 11, 366), Vector2(x + 11, 356), Vector2(x + 15, 356), Vector2(x + 15, 366), Vector2(x + 25, 366)]), Color("8bb288"), 1, true)
	if _task == "test":
		draw_polyline(PackedVector2Array([Vector2(445, 364), Vector2(420, 364), Vector2(412, 301), Vector2(360, 227)]), Color("d1b16d"), 2, true)

func _draw_rack() -> void:
	_panel(Rect2(31, 398, 578, 47), Color("132320"), Color("52665c"), 5)
	if not interaction_allowed:
		_text(Vector2(49, 427), "暂不能操作 · 条件满足后可继续", 16, MUTED)
		return
	if _state.complete or _plan.is_empty():
		_text(Vector2(49, 426), "本工序已完成 · 工具已收妥", 14, CYAN)
		return
	var a: Dictionary = _plan[mini(int(_state.step), _plan.size() - 1)]
	_panel(Rect2(40, 404, 100, 35), Color("263932"), Color("607467"), 4)
	# Show the actual tool silhouette. This is an automatic tool rest, not
	# a row of indistinguishable objects suggesting a tool-selection puzzle.
	if _state.phase == "idle":
		_draw_implement(String(a.tool), _rack(a.tool), 0.0, 0.42, false)
	else:
		_text(Vector2(64, 427), "使用中", 13, CYAN)
	_text(Vector2(154, 418), "本步工具  " + String(TOOL_NAMES.get(a.tool, "工具")), 17, INK)
	_text(Vector2(154, 435), "自动取用 · 操作表上的标记，无需点击工具栏", 13, MUTED)

func _draw_contact() -> void:
	if not interaction_allowed or _state.complete or _plan.is_empty() or _state.phase != "idle": return
	var a: Dictionary = _plan[int(_state.step)]
	var p := _v(a.at)
	for i in range(4):
		var angle := float(i) * PI * 0.5 + 0.18
		draw_arc(p, 26, angle, angle + 1.20, 18, Color(0.02,0.07,0.06,0.95), 9, true)
		draw_arc(p, 26, angle, angle + 1.20, 18, Color("a4f0d9"), 4, true)
	draw_circle(p, 4, Color("ffe5a2"))
	if a.has("part") and p.distance_to(_v(a.to)) > 68.0:
		var to := _v(a.to)
		var guide := _transfer_guide(a)
		_draw_part_outline(to, String(a.part), GOLD)
		var direction := (to - p).normalized()
		var from := p + direction * 29
		var end := to - direction * 39
		draw_dashed_line(from, end, Color(0.79, 0.68, 0.45, 0.8), 2, 7, true)
		for sign_value in [-1.0, 1.0]:
			draw_line(end, end - direction.rotated(sign_value * 0.55) * 11, GOLD, 2, true)
		_draw_guide_tag(p + Vector2(0, 43 if p.x > 420 else -43), "① 拖动" + String(guide.part), CYAN)
		_draw_guide_tag(to + Vector2(0, 45), "② " + String(guide.destination), GOLD)
	else:
		var label := "点按此处 · " + String(TOOL_NAMES.get(a.tool, "工具"))
		if a.has("part"):
			var guide := _transfer_guide(a)
			label = "点按" + String(guide.part) + " · 移至" + String(guide.destination)
		_draw_guide_tag(p + Vector2(0, 43 if p.x > 420 else -43), label, CYAN)
	if _pressed:
		if _pointer_dragging and a.has("part"):
			_draw_part_outline(_drag_at, String(a.part), Color("d9dfce"))
		else:
			draw_arc(_drag_at, 22, 0, TAU, 30, GOLD, 1.6, true)

func _draw_guide_tag(at: Vector2, text: String, color: Color) -> void:
	var width := _font.get_string_size(text, HORIZONTAL_ALIGNMENT_LEFT, -1, 16).x + 20
	var box := Rect2(Vector2(clampf(at.x - width * 0.5, 20, SURFACE.x - width - 20), at.y - 15), Vector2(width, 31))
	_panel(box, Color("142322"), color.darkened(0.35), 4)
	_text(box.position + Vector2(10, 22), text, 16, color)

func _draw_part_outline(at: Vector2, part: String, color: Color) -> void:
	if part in ["cover", "watch"] and _appearance.case_shape == "square":
		draw_rect(Rect2(at - Vector2(32, 32), Vector2(64, 64)), Color(color, 0.10))
		draw_rect(Rect2(at - Vector2(32, 32), Vector2(64, 64)), color, false, 2)
	elif part in ["ballast", "link", "component"]:
		draw_rect(Rect2(at - Vector2(23, 12), Vector2(46, 24)), Color(color, 0.10))
		draw_rect(Rect2(at - Vector2(23, 12), Vector2(46, 24)), color, false, 2)
	else:
		var radius := 32.0 if part in ["cover", "watch"] else 19.0
		draw_circle(at, radius, Color(color, 0.10))
		draw_arc(at, radius, 0, TAU, 48, color, 2, true)
	draw_line(at - Vector2(5, 0), at + Vector2(5, 0), Color(color, 0.65), 1)
	draw_line(at - Vector2(0, 5), at + Vector2(0, 5), Color(color, 0.65), 1)

func _draw_tool() -> void:
	if _state.tool.kind == "": return
	var ratio := 1.0
	var t := clampf(float(_state.elapsed) / maxf(0.001,_phase_duration()),0.0,1.0) if _state.phase != "idle" else 1.0
	var eased := t * t * (3.0 - 2.0 * t)
	if _state.phase == "take": ratio = lerpf(0.42,1.0,eased)
	elif _state.phase == "release": ratio = lerpf(1.0,0.42,eased)
	elif _state.phase == "result": ratio = 0.42
	_draw_implement(String(_state.tool.kind), _v(_state.tool.position), float(_state.tool.angle), ratio, _state.phase == "act")

func _draw_implement(tool: String, tip: Vector2, angle: float, ratio: float, working: bool) -> void:
	var rect := stage_working_rect()
	var unit := rect.size.x / SURFACE.x
	draw_set_transform(rect.position + tip * unit, 0.0, Vector2.ONE * unit * ratio)
	tip = Vector2.ZERO
	var axis := Vector2(0.46, -0.89).rotated(angle)
	var side := axis.orthogonal()
	# Every implement is constructed from its physical contact tip. All motion
	# uses this same anchor, so a screw turn cannot drift off the screw head.
	var shadow := tip + Vector2(5, 7)
	draw_line(shadow, shadow + axis * 77, Color(0.0, 0.0, 0.0, 0.27), 7, true)
	match tool:
		"tweezers":
			for sign_value in [-1.0, 1.0]:
				draw_polyline(PackedVector2Array([tip + side * sign_value * 1.7, tip + axis * 31 + side * sign_value * 5, tip + axis * 75 + side * sign_value * 2]), STEEL, 3, true)
				draw_line(tip + axis * 32 + side * sign_value * 4, tip + axis * 65 + side * sign_value * 2, Color("dfdfbd"), 0.8, true)
		"opener":
			if _shaped_case():
				var contacts := _opener_contacts()
				draw_line(contacts[0],contacts[1],Color("49676a"),13,true)
				draw_line(contacts[0]+Vector2(6,-3),contacts[1]-Vector2(6,3),STEEL,2,true)
				for contact in contacts:
					draw_line(contact+Vector2(0,-13),contact,Color("c9d3c4"),6,true)
					draw_circle(contact*0.68+Vector2(0,sin(angle)*8),6,Color("233b37"))
			else:
				draw_line(tip - Vector2(85, 0).rotated(angle), tip + Vector2(85, 0).rotated(angle), Color("49676a"), 13, true)
				draw_line(tip - Vector2(85, 3).rotated(angle), tip + Vector2(85, -3).rotated(angle), STEEL, 2, true)
				for sign_value in [-1.0, 1.0]:
					var end := tip + Vector2(sign_value * 91, 0).rotated(angle)
					draw_line(end + Vector2(0, -13), end, Color("c9d3c4"), 6, true)
					draw_circle(tip + Vector2(sign_value * 62, 0).rotated(angle), 6, Color("233b37"))
		"blower":
			draw_line(tip, tip + axis * 27, Color("899f8e"), 5, true)
			draw_circle(tip + axis * 52, 20, Color("634f3d"))
			draw_arc(tip + axis * 52, 17, -2.6, -0.6, 20, Color("a38a64"), 2, true)
			if working:
				for i in range(3):
					var p := tip - axis * (8 + i * 7)
					draw_line(p - side * (2 + i * 2), p + side * (2 + i * 2), Color(0.74, 0.86, 0.79, 0.5 - i * 0.12), 1.2, true)
		"press":
			draw_circle(tip, 64, Color(0.16, 0.25, 0.22, 0.85))
			draw_arc(tip, 62, -2.8, -0.2, 40, Color("b5c1aa"), 3, true)
			draw_line(tip + Vector2(0, -8), tip + Vector2(0, -72), Color("6b8976"), 16, true)
		"fingers":
			for i in range(2):
				var p := tip + Vector2(i * 5, -8 + i * 17)
				draw_line(p, p + Vector2(30, -7), Color("b49b79"), 12, true)
				draw_line(p + Vector2(1, -2), p + Vector2(16, -5), Color("d2bd98"), 3, true)
		_:
			draw_line(tip, tip + axis * 36, Color("56666a"), 4, true)
			draw_line(tip - side * 0.8, tip + axis * 35 - side * 0.8, Color("e1e6da"), 1.2, true)
			var color := Color("7e5742")
			if tool == "oiler": color = Color("985a43")
			if tool == "probe": color = Color("98794b")
			if tool == "uv": color = Color("635f88")
			if tool == "pen": color = Color("c0ad71")
			draw_line(tip + axis * 34, tip + axis * 77, color.darkened(0.4), 12, true)
			draw_line(tip + axis * 34 - side, tip + axis * 76 - side, color, 9, true)
			draw_circle(tip + axis * 77, 5, Color("bcc8bf"))
			draw_line(tip + axis * 75 - side * 3, tip + axis * 75 + side * 3, Color("eff0d7"), 1.1, true)
			for grip in range(47,70,4):
				draw_line(tip + axis * grip - side * 3.5, tip + axis * (grip + 1) + side * 3.5, color.darkened(0.3), 1, true)
			draw_line(tip + axis * 35 - side * 2, tip + axis * 72 - side * 2, color.lightened(0.25), 1.4, true)
			draw_line(tip + axis * 36, tip + axis * 40, Color("c8c6a1"), 10, true)
			if tool in ["brush", "swab"]:
				for i in range(-3, 4): draw_line(tip + side * i * 1.5, tip + axis * 10 + side * i, Color("c6c09c"), 1.5, true)
			if tool == "caseknife":
				draw_colored_polygon(PackedVector2Array([tip, tip + axis * 20 + side * 5, tip + axis * 24 - side * 4]), Color("b9c9bc"))
			if tool == "oiler" and working: draw_circle(tip, 2.5, Color("e7d591"))
			if tool == "uv" and working:
				draw_colored_polygon(PackedVector2Array([tip, tip - axis * 42 - side * 35, tip - axis * 42 + side * 35]), Color(0.47, 0.37, 0.85, 0.14))

	draw_set_transform(rect.position, 0.0, Vector2.ONE * unit)

func _draw_labels() -> void:
	var names := {"open":"开盖拆检", "wash":"金属件清洗 / 干燥", "replace":"故障件更换", "assemble":"定点润滑 / 回装", "test":"走时校验 / 封盖", "forge_logo":"重描标识", "forge_serial":"紫外编号覆印", "forge_weight":"后盖配重加工", "forge_case":"改装目标外壳"}
	_text(Vector2(29, 34), String(names.get(_task, "维修工位")), 19, INK)
	var movement := "机械机芯" if _profile.get("movement", "quartz") == "mechanical" else "石英机芯"
	var back: String = {"screw":"旋入后盖", "snap":"压入后盖", "bolts":"螺钉后盖"}.get(_profile.get("caseback", "screw"), "旋入后盖")
	_text(Vector2(30, 49), String(_reference.get("brand", "")) + " " + String(_reference.get("model", "")) + "  /  " + movement + "  /  " + back, 10, MUTED)
	_text(Vector2(469, 36), "%02d / %02d" % [mini(int(_state.step) + 1, _plan.size()), _plan.size()], 18, GOLD, true)
	if _state.complete:
		_text(Vector2(546, 52), "已落稳", 11, CYAN)
	elif not interaction_allowed:
		_text(Vector2(546, 52), "已暂停", 11, MUTED)
	elif _state.phase != "idle":
		var labels := {"take":"取工具", "contact":"对位", "act":"接触操作", "release":"移开工具", "result":"确认落稳"}
		_text(Vector2(545, 52), labels.get(_state.phase, "操作中"), 11, CYAN)
	else:
		_text(Vector2(546, 52), "待操作", 11, CYAN)
	if _task == "open" and _v(_state.parts.cover).x > 420:
		_text(Vector2(448, 215), "后盖已收妥", 10, CYAN)
	if _task == "wash":
		_text(Vector2(447, 310), "清洗 %.0f%% · 干燥 %.0f%%" % [float(_state.washed) * 100, float(_state.dry) * 100], 10, CYAN)

func _draw_gear(p: Vector2, radius: float, teeth: int, angle: float, color: Color) -> void:
	var outline := PackedVector2Array()
	for i in range(teeth * 4):
		var r := radius if i % 4 in [1, 2] else radius - 3
		outline.append(p + Vector2.from_angle(angle + float(i) * TAU / (teeth * 4)) * r)
	draw_colored_polygon(outline, color)
	outline.append(outline[0])
	draw_polyline(outline, color.lightened(0.28), 0.8, true)
	draw_circle(p, radius - 7, color.darkened(0.46))
	draw_circle(p, radius - 9, Color("3a4e39"))
	for i in range(5):
		var vector := Vector2.from_angle(angle + float(i) * TAU / 5)
		draw_line(p + vector * 4, p + vector * (radius - 8), color, 3.5, true)
	draw_circle(p, 5, color.lightened(0.18))
	draw_circle(p, 2, Color("384d37"))
	draw_circle(p - Vector2(0.6, 0.7), 0.8, Color("e4d8a4"))

func _draw_battery(p: Vector2, fresh: bool, ratio := 1.0) -> void:
	draw_circle(p + Vector2(1, 2), 24 * ratio, Color("263a2c"))
	draw_circle(p, 23 * ratio, Color("d2d8c2") if fresh else Color("a8b39c"))
	draw_circle(p, 20 * ratio, Color("afbea5") if fresh else Color("8e9f88"))
	draw_arc(p, 21 * ratio, -2.8, -0.7, 30, Color("f0eed6"), 1.6, true)
	draw_line(p + Vector2(-5, -5) * ratio, p + Vector2(5, -5) * ratio, Color("5b7459"), 1.4)
	draw_line(p + Vector2(0, -10) * ratio, p + Vector2(0, 0) * ratio, Color("5b7459"), 1.4)
	_text(p + Vector2(-13, 11) * ratio, "SR626", int(7 * ratio), Color("4d674a"), true)

func _draw_ballast(p: Vector2) -> void:
	_panel(Rect2(p - Vector2(17, 8), Vector2(34, 16)), Color("8c9180"), Color("d6d2af"), 3)
	for x in range(-13, 15, 5): draw_line(p + Vector2(x, -5), p + Vector2(x, 5), Color("5b6856"), 1)
	if bool(_state.ballast_set):
		draw_line(p - Vector2(14, 10), p + Vector2(14, 10), Color("a9bb93"), 4, true)
		_draw_screw(p + Vector2(13, 9), 3, 0.1, STEEL)

func _case_shape(p: Vector2, radius: float, fill: Color) -> void:
	if _shaped_case():
		var points := PackedVector2Array()
		for point in _case_contour(): points.append(p+point*radius)
		draw_colored_polygon(points,fill)
	elif _appearance.get("case_shape","round")=="square":
		_panel(Rect2(p-Vector2.ONE*radius,Vector2.ONE*radius*2),fill,fill,5)
	else:
		draw_circle(p,radius,fill)

# Normalized authored contours are shared; fixed-angle ray hits are reused per bench.
static var _shape_contours: Dictionary = {}
var _contour_rays: Dictionary = {}

func _shaped_case() -> bool:
	return _appearance.get("case_shape","round") not in ["round","square"]

func _case_contour() -> PackedVector2Array:
	var shape: String = _appearance.get("case_shape","round")
	if _shape_contours.has(shape): return _shape_contours[shape]
	var points := PackedVector2Array()
	if shape in ["octagon","sun"]:
		var sides := 16 if shape=="sun" else 8
		for k in sides:
			points.append(Vector2.from_angle(float(k)*TAU/sides)*(0.88 if shape=="sun" and k%2 else 1.0))
	elif shape=="tonneau":
		points=PackedVector2Array([Vector2(-0.78,-1),Vector2(0.78,-1),Vector2(1,-0.55),Vector2(1,0.55),Vector2(0.78,1),Vector2(-0.78,1),Vector2(-1,0.55),Vector2(-1,-0.55)])
	elif shape=="cushion":
		for corner in 4:
			var center := Vector2(0.65,0.65).rotated(corner*PI/2)
			for k in range(9):
				points.append(center+Vector2.from_angle(corner*PI/2+float(k)*PI/16)*0.35)
	else:
		var axes := Vector2(0.85,1.05) if shape=="oval" else Vector2(1.08,1.0)
		for k in 64: points.append(Vector2.from_angle(float(k)*TAU/64)*axes)
	_shape_contours[shape]=points
	return points

func _case_offset(radius: float, angle: float) -> Vector2:
	var direction := Vector2.from_angle(angle)
	if not _shaped_case(): return direction*radius
	if not _contour_rays.has(angle):
		var points := _case_contour()
		var distance := 4.0
		for i in points.size():
			var a := points[i]
			var edge := points[(i+1)%points.size()]-a
			var denominator := direction.cross(edge)
			if absf(denominator)<0.000001: continue
			var t := a.cross(edge)/denominator
			var u := a.cross(direction)/denominator
			if t>=0 and u>=-0.00001 and u<=1.00001: distance=minf(distance,t)
		_contour_rays[angle]=direction*distance
	return Vector2(_contour_rays[angle])*radius

func _case_arc(p: Vector2, radius: float, start: float, end: float, samples: int) -> PackedVector2Array:
	var points := PackedVector2Array()
	for i in range(samples+1): points.append(p+_case_offset(radius,lerpf(start,end,float(i)/samples)))
	return points

func _draw_contour_arc(p: Vector2, radius: float, start: float, end: float, samples: int, color: Color, width: float) -> void:
	if _shaped_case(): draw_polyline(_case_arc(p,radius,start,end,samples),color,width,true)
	else: draw_arc(p,radius,start,end,samples,color,width,true)

func _case_hatch_spans(radius: float, y: float) -> Array[Vector2]:
	var points := _case_contour()
	var crossings: Array[float] = []
	var row := y/radius
	for i in points.size():
		var a := points[i]
		var b := points[(i+1)%points.size()]
		if (a.y<=row and b.y>row) or (b.y<=row and a.y>row):
			crossings.append((a.x+(row-a.y)*(b.x-a.x)/(b.y-a.y))*radius)
	crossings.sort()
	var spans: Array[Vector2] = []
	for i in range(0,crossings.size()-1,2): spans.append(Vector2(crossings[i],crossings[i+1]))
	return spans

func _crown_rect() -> Rect2:
	return Rect2(Vector2(CENTER.x+_case_offset(121,0).x-4,216),Vector2(26,22)) if _shaped_case() else Rect2(365,216,26,22)

func _crown_contact() -> Vector2:
	return Vector2(_crown_rect().end.x-2,CENTER.y)

func _cover_slot(radius: float, angle: float) -> PackedVector2Array:
	return PackedVector2Array([_case_offset(radius-9,angle),_case_offset(radius-3,angle)])

func _opener_contacts() -> PackedVector2Array:
	var contacts := PackedVector2Array()
	for angle in [PI,0.0]:
		var slot := _cover_slot(104,angle)
		contacts.append((slot[0]+slot[1])*0.5)
	return contacts

func _snap_notch(radius: float) -> PackedVector2Array:
	var points := PackedVector2Array()
	for point in [Vector2(0.73,0.63),Vector2(0.89,0.43)]:
		points.append(_case_offset(radius,point.angle())*point.length() if _shaped_case() else point*radius)
	return points

func _snap_contact() -> Vector2:
	if not _shaped_case(): return Vector2(339,289)
	var notch := _snap_notch(104)
	return CENTER+(notch[0]+notch[1])*0.5

func _draw_screw(p: Vector2, radius: float, angle: float, color: Color) -> void:
	draw_circle(p + Vector2(0.5, 1), radius + 0.7, Color("28392d"))
	draw_circle(p, radius, color)
	draw_arc(p, maxf(0.1, radius - 0.5), -2.9, -0.3, 14, color.lightened(0.3), 0.8, true)
	var direction := Vector2.from_angle(angle) * radius * 0.70
	draw_line(p - direction, p + direction, Color("304a39"), 1.2, true)

func _panel(rect: Rect2, fill: Color, border: Color, radius := 4) -> void:
	var box := StyleBoxFlat.new()
	box.bg_color = fill
	box.border_color = border
	box.set_border_width_all(1)
	box.set_corner_radius_all(radius)
	draw_style_box(box, rect)

func _text(at: Vector2, text: String, font_size: int, color: Color, mono := false) -> void:
	if font_size <= 0: return
	draw_string(_mono if mono else _font, at, text, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size, color)

func _strap_color(id: String) -> String:
	var authored: Dictionary = WatchLogo.art(id)
	if authored.has("strap_color"): return String(authored.strap_color)
	var index := clampi(id.get_slice("-",1).to_int()-1,0,32)
	return STRAP_COLORS[index] if index<15 else EXTRA_STRAP_COLORS[index-15]
