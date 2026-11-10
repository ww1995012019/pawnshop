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
# Keep the established atlas identity from generate-watch-art.py; these are
# physical model palettes/silhouettes, independent of true or forged markings.
const EXTRA_TEMPLATES := [0, 6, 2, 9, 1, 3, 6, 3, 7, 10, 11, 8, 12, 14, 7, 13, 10, 8]
const STRAP_TYPES := ["leather", "metal", "cloth", "metal", "rubber", "cloth", "leather", "leather", "metal", "cloth", "metal", "rubber", "leather", "leather", "metal"]
const STRAP_COLORS := ["76543f", "9eabad", "5e695b", "a6b7bb", "273236", "737856", "735244", "513f3a", "9baba9", "77705a", "879496", "3d5150", "66493b", "78513b", "a4aa9c"]
const EXTRA_STRAP_COLORS := ["8b694b", "655442", "737b63", "827c60", "a7b2af", "9eaaa6", "585060", "a4b4bf", "48536c", "96a9a0", "465d53", "a6a8b6", "54463e", "c4b87e", "473a57", "6b4939", "b4bba7", "c3b591"]

var _item: Dictionary = {}
var _task := ""
var _profile := {"movement":"quartz", "caseback":"screw"}
var _plan: Array[Dictionary] = []
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
	_profile = it.get("service", {}).get("profile", {"movement":"quartz", "caseback":"screw"}).duplicate(true)
	var id := String(it.get("defId", "WCH-001"))
	_art = WatchLogo.art(id)
	_glyph = WatchLogo.pixels(id, 0)
	var definition: Dictionary = GameData.def(id)
	_reference = definition.get("watch", {})
	var index := clampi(id.get_slice("-", 1).to_int() - 1, 0, 32)
	var template: int = index if index < 15 else EXTRA_TEMPLATES[index - 15]
	_appearance = {"template":template, "case_shape":"square" if template == 6 else "round",
		"strap":STRAP_TYPES[template], "strap_color":STRAP_COLORS[index] if index < 15 else EXTRA_STRAP_COLORS[index - 15],
		"case_color":"bda064" if template == 13 or definition.get("tier", "") == "luxury" else "b6c0c0"}
	_started_opened = bool(it.get("service", {}).get("opened", false))
	if progress.get("version", 0) == 1 and progress.get("task", "") == task:
		# The reducer updates service.opened during this operation. Its original
		# plan basis must survive that change, or numeric action indices shift.
		_started_opened = bool(progress.get("started_opened", _started_opened))
	_build_plan()
	_state = _initial_state()
	if progress.get("version", 0) == 1 and progress.get("task", "") == task:
		for key in _state:
			if progress.has(key):
				_state[key] = progress[key].duplicate(true) if progress[key] is Dictionary or progress[key] is Array else progress[key]
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
	var part := Vector2(518, 251) if _task == "assemble" else GEAR_SEAT
	return {"version":1, "task":_task, "step":0, "phase":"idle", "elapsed":0.0,
		"tool":{"kind":"", "position":[74.0, 407.0], "angle":0.0},
		"parts":{"cover":_arr(COVER_TRAY if cover_off else CENTER), "component":_arr(part),
			"old_part":[275.0, 252.0], "new_part":[555.0, 268.0], "ballast":[558.0, 270.0], "fixing":[540.0, 251.0], "link":[560.0, 269.0], "watch":[248.0,227.0], "scale_pan":[248.0,237.0]},
		"screws":[false, false, false, false], "power_safe":false, "clamp_open":false,
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

func interaction_targets() -> Array:
	if _state.is_empty() or _state.complete or _plan.is_empty():
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
		return "工具接触中 · 请等零件落稳"
	return String(a.hint) + " · 可点按部件，或使用下方操作键"

func advance() -> void:
	if _state.is_empty() or _state.complete or _state.phase != "idle" or _plan.is_empty(): return
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
	if _state.is_empty() or _state.complete: return
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
	elif motion and _pressed:
		_drag_at = at.clamp(Vector2(18, 65), SURFACE - Vector2(18, 30))
		_pointer_dragging = _drag_origin.distance_to(at) > 8.0
	elif up and _pressed:
		_pressed = false
		# A tap is the accessible snap-to-contact equivalent. Dragged transfers
		# must land on the tray/seat, so a misplaced part never teleports away.
		if _pointer_dragging and a.has("part") and at.distance_to(_v(a.to)) > 65.0:
			_feedback = "零件未对准工位，已安全留在原位。请拖到标出的落点。"
		else:
			advance()
		_pointer_dragging = false
	accept_event()
	queue_redraw()

func _process(delta: float) -> void:
	if _state.is_empty(): return
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
	var contact := _v(a.at)
	var rack := _rack(a.tool)
	var end := _v(a.get("to", a.at))
	var tip := rack
	var angle := 0.0
	match String(_state.phase):
		"take": tip = rack + Vector2(0, -10 * eased)
		"contact": tip = (rack + Vector2(0, -10)).lerp(contact, eased)
		"act":
			tip = contact
			match String(a.get("motion", "press")):
				"turn": angle = sin(t * TAU * 2) * 0.24
				"lever": tip += Vector2(3 * sin(t * PI), -9 * sin(t * PI))
				"transfer":
					tip = contact.lerp(end, eased) + Vector2(0, -35 * sin(t * PI))
					_state.parts[a.part] = _arr(tip)
					if a.part == "watch": _state.watch_scale = lerpf(1.0, 0.94, eased)
				"wash": tip += Vector2(sin(t * TAU * 3) * 6, sin(t * TAU * 6) * 2)
				"blow": tip += Vector2(0, sin(t * TAU * 3) * 3)
				"glyph": tip = _glyph_point(t)
				"serial": tip = Vector2(165.0 + 163.0 * t, 230.0 + 7.0 * sin(t * TAU * 14))
				"trace": tip += Vector2(sin(t * TAU * 2) * 4, 0)
				"oil": tip += Vector2(0, 2 * sin(t * PI))
				"settle": tip += Vector2(0, 3 * sin(t * PI))
			_update_visual_effect(a, t)
		"release": tip = end.lerp(rack, eased)
		"result": tip = rack
	_state.tool.position = _arr(tip)
	_state.tool.angle = angle

func _update_visual_effect(a: Dictionary, t: float) -> void:
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
	if id.begins_with("unscrew_") and id != "unscrew_cover":
		_state.screws[id.trim_prefix("unscrew_").to_int()] = true
		_state.opened = true
	if id.begins_with("fasten_"):
		_state.screws[id.trim_prefix("fasten_").to_int()] = false
		if id == "fasten_3": _state.opened = false
	if id.begins_with("oil_"):
		if not _state.oil.has(id): _state.oil.append(id)
	match id:
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
				_action("set_crown", "校正指针并推回表冠", "沿表冠轴向校时，恢复每秒一步", "fingers", Vector2(389, 227), "turn", 1.0)
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
	_action("safe_mechanical" if mech else "safe_quartz", "停机并释放储能" if mech else "停机并隔离供电", "固定软垫表座，操作表冠；拆出部件前安全停机", "fingers", Vector2(389, 227), "turn", 0.9)

func _open_actions() -> void:
	match String(_profile.get("caseback", "screw")):
		"bolts":
			for i in range(4):
				_action("unscrew_%d" % i, "卸下后盖螺钉 %d / 4" % (i + 1), "刀口对准螺钉槽，旋松后收到零件盘", "driver", _screw_pos(i), "turn", 0.85)
		"snap": _action("lever_snap", "从缺口撬起压入式后盖", "刀口仅插入壳侧缺口，轻抬至盖缘分离", "caseknife", Vector2(339, 289), "lever", 1.0)
		_: _action("unscrew_cover", "双爪旋开旋入式后盖", "开盖器两爪卡入对侧槽口，逆时针旋松", "opener", CENTER, "turn", 1.4)
	_transfer("lift_cover", "取下后盖放入零件盘", "夹住盖缘，抬起后移入有软垫的后盖格", "cover", CENTER, COVER_TRAY)

func _close_actions() -> void:
	_transfer("return_cover", "对准密封圈放回后盖", "确认边缘齐平，后盖回到原壳位", "cover", COVER_TRAY, CENTER)
	match String(_profile.get("caseback", "screw")):
		"bolts":
			for i in [0, 2, 1, 3]:
				_action("fasten_%d" % i, "交叉紧固后盖螺钉 %d" % (i + 1), "螺钉依次回位，避免盖缘偏斜", "driver", _screw_pos(i), "turn", 0.75)
		"snap": _action("press_snap", "均匀压合压入式后盖", "沿盖缘均匀施力，确认后盖完全落座", "press", CENTER, "press", 1.0)
		_: _action("tighten_cover", "顺时针旋紧后盖", "双爪卡住槽口，顺时针旋至盖缘齐平", "opener", CENTER, "turn", 1.15)

func _rack(tool: String) -> Vector2:
	var index := ["driver", "tweezers", "oiler", "brush", "pen", "probe", "blower", "opener", "caseknife", "uv", "swab", "press", "fingers", "springbar"].find(tool)
	return Vector2(56 + (maxi(index, 0) % 14) * 39, 413)

func _screw_pos(index: int) -> Vector2:
	return CENTER + Vector2.from_angle(-PI * 0.75 + index * PI * 0.5) * 91.0

func _glyph_point(t: float) -> Vector2:
	if _glyph.is_empty(): return Vector2(248, 155)
	var index := clampi(int(t * float(_glyph.size() - 1)), 0, _glyph.size() - 1)
	var p: Array = _glyph[index]
	return Vector2(200 + float(p[0]) * 4, 125 + float(p[1]) * 4)

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
	draw_circle(CENTER + Vector2(4, 7), 123, Color(0.02, 0.05, 0.05, 0.5))
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
		draw_arc(CENTER, 115, -2.85, -0.7, 60, rim.lightened(0.20), 2.5, true)
		draw_arc(CENTER, 117, 0.35, 1.98, 45, rim.darkened(0.45), 2, true)
		draw_arc(CENTER, 108, -0.3, 2.9, 70, Color("899575"), 1, true)
	for angle in [0.0, PI]:
		var p := CENTER + Vector2.from_angle(angle) * 124
		draw_line(p - Vector2(0, 11), p + Vector2(0, 11), Color("bbc7b9"), 3)
	_panel(Rect2(365, 216, 26, 22), Color("768e80"), Color("bfccba"), 4)
	for x in range(373, 391, 4): draw_line(Vector2(x, 219), Vector2(x, 235), Color("3c5146"), 1)
	if bool(_state.power_safe):
		draw_line(Vector2(392, 219), Vector2(392, 235), GOLD, 2)

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
	if _task == "replace" and _has_fault("missing_fixing"):
		_draw_screw(_v(_state.parts.fixing), 6, 0.2, STEEL)
	if _task == "replace" and (_has_fault("battery") or _has_fault("movement_part")):
		var mech: bool = _profile.get("movement", "quartz") == "mechanical"
		for name in ["old_part", "new_part"]:
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
	draw_circle(p + Vector2(2, 4), radius + 1, Color(0.02, 0.04, 0.03, 0.5))
	_case_shape(p, radius, Color("bac4b3"))
	_case_shape(p, radius - 3, Color("596e5f"))
	_case_shape(p, radius - 6, Color("8d9e89"))
	for y in range(int(-radius + 9), int(radius - 8), 4):
		var half := radius - 9 if _appearance.case_shape == "square" else sqrt(maxf(0.0, pow(radius - 9, 2) - pow(float(y), 2)))
		draw_line(p + Vector2(-half, y), p + Vector2(half, y), Color(0.86, 0.91, 0.80, 0.11), 1)
	if _appearance.case_shape == "square":
		draw_rect(Rect2(p - Vector2.ONE * (radius - 10), Vector2.ONE * (radius - 10) * 2), Color("516849"), false, 1)
	else:
		draw_arc(p, radius - 4, -2.8, -0.6, 52, Color("e4e5cb"), 1.6, true)
		draw_arc(p, radius - 10, 0, TAU, 90, Color("516849"), 1, true)
	var ratio := radius / 104.0
	if String(_profile.get("caseback", "screw")) == "screw":
		for i in range(6):
			var vector := Vector2.from_angle(float(i) * TAU / 6.0)
			draw_line(p + vector * (radius - 9), p + vector * (radius - 3), Color("40594b"), 3 * ratio)
	elif String(_profile.get("caseback", "screw")) == "snap":
		draw_line(p + Vector2(radius * 0.73, radius * 0.63), p + Vector2(radius * 0.89, radius * 0.43), Color("2d4337"), 3)
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
	return "observed" if _mark_observed() else "hidden"

func _draw_dial() -> void:
	var face := Color(_art.get("face", "#ddd9bc"))
	var dial_ink := Color(_art.get("ink", "#252a30"))
	_case_shape(CENTER, 104, face.darkened(0.20))
	_case_shape(CENTER, 100, face)
	for i in range(60):
		var angle := float(i) * TAU / 60 - PI * 0.5
		var v := Vector2.from_angle(angle)
		draw_line(CENTER + v * (87 if i % 5 == 0 else 93), CENTER + v * 98, dial_ink, 3 if i % 5 == 0 else 1, true)
	for i in range(12):
		if i in [0, 3, 6, 9]:
			var v := Vector2.from_angle(float(i) * TAU / 12 - PI * 0.5)
			_text(CENTER + v * 77 - Vector2(6, -4), str(12 if i == 0 else i), 13, dial_ink, true)
	draw_line(CENTER, CENTER + Vector2(-43, -29), dial_ink.darkened(0.2), 7, true)
	draw_line(CENTER, CENTER + Vector2(38, -61), dial_ink, 4, true)
	draw_line(CENTER, CENTER + Vector2(18, 65), Color("ac6a4a"), 1.5, true)
	draw_circle(CENTER, 5, Color("c0aa6e"))
	var fraction := float(_state.logo) if _task == "forge_logo" else 1.0
	var variant := int(_item.get("watch", {}).get("logo_variant", 1))
	if WatchForgery.active(_item, "logo"): variant = 0
	var observed := _mark_observed()
	if observed:
		for pixel in WatchLogo.pixels(String(_item.get("defId", "WCH-001")), variant):
			draw_rect(Rect2(Vector2(200 + pixel[0] * 4,125 + pixel[1] * 4),Vector2(3.7,3.7)),Color(dial_ink,0.28))
	else:
		# Same mosaic for both variants: service work never grants inspection evidence.
		for y in 5:
			for x in 8:
				draw_rect(Rect2(200+x*12,125+y*13,12,13),face.darkened(0.10 + ((x*3+y*5)%4)*0.055))
	var visible_glyph: Array = _glyph if _task == "forge_logo" else WatchLogo.pixels(String(_item.get("defId", "WCH-001")), variant)
	var visible_count := int(ceil(fraction * visible_glyph.size())) if mark_visibility() != "hidden" else 0
	for i in range(visible_count):
		var pixel: Array = visible_glyph[i]
		var origin := Vector2(200 + pixel[0] * 4, 125 + pixel[1] * 4)
		draw_rect(Rect2(origin + Vector2(0.8, 1.0), Vector2(4.3, 4.2)), face.darkened(0.3))
		draw_rect(Rect2(origin, Vector2(3.8, 3.8)), dial_ink)
		if i % 4 == 0: draw_line(origin + Vector2(0, 0.5), origin + Vector2(2.5, 0.5), dial_ink.lightened(0.22), 0.7)
	_text(Vector2(217, 282), String(_reference.get("model", "N01")), 10, dial_ink, true)
	# Narrow, directional glass reflection; it never obscures the contact point.
	draw_arc(CENTER, 99, -2.8, -2.25, 25, Color(1, 1, 0.9, 0.28), 5, true)
	if fraction >= 1.0 and _task == "forge_logo":
		_text(Vector2(152, 370), "漆层厚差 / 重描纹保留", 11, GOLD)

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
	_panel(Rect2(31, 399, 578, 31), Color("162621"), Color("4e6657"), 5)
	for x in range(47, 593, 39):
		draw_line(Vector2(x, 409), Vector2(x + 18, 409), Color("516a56"), 2)
	_text(Vector2(43, 444), "软垫表座 · 工具接触后操作 · 零件留在原工位", 10, MUTED)
	# Resting implements are small, but still drawn as physical tools.
	for tool in ["driver", "tweezers", "oiler", "brush", "pen", "probe", "blower", "opener"]:
		if _state.tool.kind == tool: continue
		var p := _rack(tool)
		draw_line(p, p + Vector2(8, -27), Color("7e9587"), 2, true)
		draw_line(p + Vector2(8, -27), p + Vector2(11, -35), Color("8e7656"), 5, true)

func _draw_contact() -> void:
	if _state.complete or _plan.is_empty() or _state.phase != "idle": return
	var a: Dictionary = _plan[int(_state.step)]
	var p := _v(a.at)
	for i in range(4):
		var angle := float(i) * PI * 0.5 + 0.18
		draw_arc(p, 17, angle, angle + 0.90, 10, CYAN, 1.7, true)
	draw_circle(p, 2.5, CYAN)
	if a.has("part"):
		var to := _v(a.to)
		draw_arc(to, 22, 0, TAU, 40, Color(0.53, 0.76, 0.65, 0.5), 1.5, true)
		draw_line(p.lerp(to, 0.18), p.lerp(to, 0.77), Color(0.53, 0.76, 0.65, 0.3), 1, true)
		_text(to + Vector2(-12, 36), "落点", 10, MUTED)
	if _pressed:
		draw_arc(_drag_at, 22, 0, TAU, 30, GOLD, 1.6, true)
		if _pointer_dragging: draw_line(p, _drag_at, Color(0.79, 0.68, 0.45, 0.6), 2, true)

func _draw_tool() -> void:
	if _state.tool.kind == "": return
	var tip := _v(_state.tool.position)
	var angle := float(_state.tool.angle)
	var axis := Vector2(0.46, -0.89).rotated(angle)
	var side := axis.orthogonal()
	var tool := String(_state.tool.kind)
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
			if _state.phase == "act":
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
			draw_line(tip, tip + axis * 35, Color("c6d1bd"), 2.6, true)
			var color := Color("7e5742")
			if tool == "oiler": color = Color("985a43")
			if tool == "probe": color = Color("98794b")
			if tool == "uv": color = Color("635f88")
			if tool == "pen": color = Color("c0ad71")
			draw_line(tip + axis * 34, tip + axis * 77, color, 9, true)
			draw_line(tip + axis * 35 - side * 2, tip + axis * 72 - side * 2, color.lightened(0.25), 1.4, true)
			draw_line(tip + axis * 36, tip + axis * 40, Color("c8c6a1"), 10, true)
			if tool in ["brush", "swab"]:
				for i in range(-3, 4): draw_line(tip + side * i * 1.5, tip + axis * 10 + side * i, Color("c6c09c"), 1.5, true)
			if tool == "caseknife":
				draw_colored_polygon(PackedVector2Array([tip, tip + axis * 20 + side * 5, tip + axis * 24 - side * 4]), Color("b9c9bc"))
			if tool == "oiler" and _state.phase == "act": draw_circle(tip, 2.5, Color("e7d591"))
			if tool == "uv" and _state.phase == "act":
				draw_colored_polygon(PackedVector2Array([tip, tip - axis * 42 - side * 35, tip - axis * 42 + side * 35]), Color(0.47, 0.37, 0.85, 0.14))

func _draw_labels() -> void:
	var names := {"open":"开盖拆检", "wash":"金属件清洗 / 干燥", "replace":"故障件更换", "assemble":"定点润滑 / 回装", "test":"走时校验 / 封盖", "forge_logo":"重描标识", "forge_serial":"紫外编号覆印", "forge_weight":"后盖配重加工"}
	_text(Vector2(29, 34), String(names.get(_task, "维修工位")), 19, INK)
	var movement := "机械机芯" if _profile.get("movement", "quartz") == "mechanical" else "石英机芯"
	var back: String = {"screw":"旋入后盖", "snap":"压入后盖", "bolts":"螺钉后盖"}.get(_profile.get("caseback", "screw"), "旋入后盖")
	_text(Vector2(30, 49), String(_reference.get("brand", "")) + " " + String(_reference.get("model", "")) + "  /  " + movement + "  /  " + back, 10, MUTED)
	_text(Vector2(469, 36), "%02d / %02d" % [mini(int(_state.step) + 1, _plan.size()), _plan.size()], 18, GOLD, true)
	if _state.complete:
		_text(Vector2(546, 52), "已落稳", 11, CYAN)
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
	if _appearance.get("case_shape", "round") == "square":
		_panel(Rect2(p - Vector2.ONE * radius, Vector2.ONE * radius * 2), fill, fill, 5)
	else:
		draw_circle(p, radius, fill)

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
