extends Page
## Repair bench: scrub the grime off, seat the replacement part, run the load
## test, then commit (materials and AP are only spent on the final step).

const ITEM_POS := Vector2(860, 500)
const PART_HOME := Vector2(1230, 610)

var item: ItemSprite
var it_uid := ""
var list_box: VBoxContainer
var info: VBoxContainer
var bench_body: VBoxContainer
var mask: Image
var mask_tex: ImageTexture
var dirty := 1.0
var scrubbing := false
var part: Node2D
var slot: Node2D
var dragging_part := false
var test_hold := false
var test_value := 0.0
var test_bar: ProgressBar
var grime_label: Label
var stage := 0

func scene_name() -> String:
	return "workbench"

func hint_text() -> String:
	if stage < 0:
		return "这件暂时不能开工：原因写在工作台上，或在左侧换一件。" if it_uid != "" else "没有可修的物件。收购故障货或接委修订单后再来。"
	match stage:
		0: return "按住鼠标在实物上来回擦，清掉污垢与氧化层。"
		1: return "把工作台右侧的新零件拖进实物上发光的槽位。"
		2: return "按住「负载复测」，指针进入绿区时松开。"
		3: return "三道工序完成：确认修复后才扣材料与行动点。"
	return ""

func enter() -> void:
	var left := left_panel(380)
	var lv := UIKit.vbox(10)
	left.add_child(lv)
	lv.add_child(UIKit.label("待修物件", 24, UIKit.AMBER))
	lv.add_child(UIKit.label("选货后按工序完成维修", 16, UIKit.MUTED))
	lv.add_child(UIKit.rule())
	var sc := ScrollContainer.new()
	sc.size_flags_vertical = Control.SIZE_EXPAND_FILL
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	list_box = UIKit.vbox(8)
	list_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	sc.add_child(list_box)
	lv.add_child(sc)
	var right := side_panel(470)
	var rsc := ScrollContainer.new()
	rsc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	info = UIKit.vbox(12)
	info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	rsc.add_child(info)
	right.add_child(rsc)
	var r: Rect2 = shell.content_rect()
	var bench := UIKit.plate()
	bench.position = Vector2(r.position.x + 380 + 20, r.end.y - 240)
	bench.size = Vector2(r.size.x - 380 - 470 - 40, 240)
	add_child(bench)
	bench_body = UIKit.vbox(10)
	bench.add_child(bench_body)
	var it = Game.item(Game.focus_uid)
	if it == null or _recipe(it).is_empty():
		var c := _candidates()
		it = c[0] if not c.is_empty() else null
	_select(it.uid if it != null else "")

func _recipe(it: Dictionary) -> Dictionary:
	var def := GameData.def(it.defId)
	for r in GameData.recipes:
		if r.kind == "repair" and (r.itemId == it.defId or def.get("recipeId", "") == r.id):
			return r
	return {}

func _craft_recipe() -> Dictionary:
	for r in GameData.recipes:
		if r.kind == "craft":
			return r
	return {}

func _candidates() -> Array:
	var out := []
	for it in Game.state.inventory:
		if it.owner == "pawn":
			continue
		if not _recipe(it).is_empty() and not it.repaired:
			out.append(it)
		elif it.defId == _craft_recipe().get("itemId", "") and it.owner == "shop":
			out.append(it)
	return out

func _blocked(it: Dictionary) -> String:
	if Model.trade_reserved(Game.state, it):
		return "正在柜台交易中"
	if it.location == "isolation" or it.sealed:
		return "隔离/封存中，先在仓储解除"
	if not it.sourceVerified:
		return "来源未核验，先扫描登记"
	if it.repaired:
		return "已经修复"
	return ""

func _fill_list() -> void:
	UIKit.clear(list_box)
	for it in _candidates():
		var row := UIKit.button("", "primary" if it.uid == it_uid else "secondary", Vector2(0, 84), 18)
		row.icon = UIKit.item_icon(it.defId)
		row.expand_icon = true
		row.add_theme_constant_override("icon_max_width", 64)
		row.alignment = HORIZONTAL_ALIGNMENT_LEFT
		var p: int = int(Game.state.repairProgress.get(it.uid, 0))
		var why := _blocked(it)
		row.text = "%s%s\n%s" % [GameData.def(it.defId).name, " · 顾客委修" if it.owner == "customer" else "", why if why != "" else "工序 %d/3 · %s" % [p, "正常" if it.working else "故障"]]
		var uid: String = it.uid
		row.pressed.connect(func(): _select(uid))
		list_box.add_child(row)
	if list_box.get_child_count() == 0:
		list_box.add_child(UIKit.label("没有需要修理的物件。收购故障货或接委修订单后再来。", 18, UIKit.MUTED, false, true))

func _select(uid: String) -> void:
	it_uid = uid
	Game.focus_uid = uid
	if item != null and is_instance_valid(item):
		item.queue_free()
	for n in [part, slot]:
		if n != null and is_instance_valid(n):
			n.queue_free()
	part = null
	slot = null
	_fill_list()
	var it = Game.item(uid)
	if it == null:
		_refresh_info()
		_stage_ui()
		return
	item = ItemSprite.new()
	item.setup(it.defId, it.uid, 360.0)
	item.position = ITEM_POS
	item.draggable = false
	add_world(item, "fg")
	mask = Image.create(64, 64, false, Image.FORMAT_L8)
	mask.fill(Color.WHITE)
	mask_tex = ImageTexture.create_from_image(mask)
	item.mat.set_shader_parameter("grime_mask", mask_tex)
	if not Game.prefs.reduced_motion:
		item.land(70.0)
	_refresh_info()
	_stage_ui()

func _refresh_info() -> void:
	UIKit.clear(info)
	var it = Game.item(it_uid)
	if it == null:
		info.add_child(UIKit.label("选择左侧物件。", 20, UIKit.MUTED))
		_materials()
		return
	var r := _recipe(it)
	info.add_child(UIKit.label(GameData.def(it.defId).name, 28, Color("f3e6cc")))
	info.add_child(UIKit.label("品相 %s · %s" % [UIKit.pct(it.condition), Model.fault_label(it)], 17, UIKit.TEXT, false, true))
	if not r.is_empty():
		var card := UIKit.plate(UIKit.inset_style(12))
		var cv := UIKit.vbox(6)
		card.add_child(cv)
		cv.add_child(UIKit.label(r.name, 21, UIKit.AMBER, false, true))
		var p: int = int(Game.state.repairProgress.get(it.uid, 0))
		for i in 3:
			cv.add_child(UIKit.label(("✓ " if i < p else ("▶ " if i == p else "· ")) + String(r.steps[i]), 17, UIKit.GOOD if i < p else (UIKit.TEXT if i == p else UIKit.MUTED), false, true))
		var mats := []
		for id in r.materials:
			mats.append("%s ×%s（有 %s）" % [GameData.material(id).name, Model.jnum(r.materials[id]), Model.jnum(Game.state.materials.get(id, 0))])
		cv.add_child(UIKit.label("材料：" + "、".join(mats), 16, UIKit.CYAN, false, true))
		cv.add_child(UIKit.label("确认时消耗 %s AP" % Model.jnum(r.ap), 16, UIKit.MUTED))
		var why := _repair_block(it, r)
		var go := UIKit.button("确认修复", "primary", Vector2(0, 56), 21)
		go.disabled = p != 3 or it.repaired or why != ""
		go.tooltip_text = why
		go.pressed.connect(func():
			if Game.dispatch({"type": "REPAIR", "uid": it_uid, "recipeId": r.id}) and Game.item(it_uid) != null and Game.item(it_uid).repaired:
				_celebrate())
		cv.add_child(go)
		if why != "" and not it.repaired:
			cv.add_child(UIKit.label(why, 16, UIKit.DANGER, false, true))
		info.add_child(card)
	var craft := _craft_recipe()
	if not craft.is_empty() and it.defId == craft.itemId:
		var cc := UIKit.plate(UIKit.inset_style(12))
		var ccv := UIKit.vbox(6)
		cc.add_child(ccv)
		ccv.add_child(UIKit.label("组装：" + craft.name, 20, UIKit.AMBER, false, true))
		ccv.add_child(UIKit.label("需要正常的伺服器与已注销轴承；先在本台完成三道装配工序。", 16, UIKit.TEXT, false, true))
		var b := UIKit.button("组装维护套组", "good", Vector2(0, 52), 20)
		b.pressed.connect(func(): Game.dispatch({"type": "CRAFT", "recipeId": craft.id}))
		ccv.add_child(b)
		info.add_child(cc)
	var dis := UIKit.button("拆解回收（不可逆，1 AP）", "danger", Vector2(0, 52), 19)
	var dis_why := _dismantle_block(it)
	dis.disabled = dis_why != ""
	dis.tooltip_text = dis_why
	var dis_name: String = GameData.def(it.defId).name
	dis.pressed.connect(func():
		shell.confirm("拆解回收", "「%s」会被拆成导电纤维×2、标准微线圈×1，原物不可恢复，并消耗 1 AP。" % dis_name, "确认拆解", func():
			Game.dispatch({"type": "DISMANTLE", "uid": it_uid})))
	info.add_child(dis)
	_materials()

## Mirrors the REPAIR rule so the button explains itself instead of failing.
func _repair_block(it: Dictionary, r: Dictionary) -> String:
	var why := _blocked(it)
	if why != "" and why != "已经修复":
		return why
	if Model.evidence_count(it) < 1:
		return "先去鉴定台取得至少一条故障诊断物证"
	for id in r.materials:
		if Game.state.materials.get(id, 0) < r.materials[id]:
			return "%s不足，先在下方采购" % GameData.material(id).name
	if Game.state.ap < r.ap:
		return "行动点不足（需 %s AP）" % Model.jnum(r.ap)
	return ""

## Mirrors the DISMANTLE rule.
func _dismantle_block(it: Dictionary) -> String:
	if Model.trade_reserved(Game.state, it):
		return "正在柜台交易中"
	if it.owner != "shop" or it.has("orderId"):
		return "受托、抵押或订单占用的物件不能拆解"
	if it.location == "isolation" or it.sealed or not it.sourceVerified:
		return "隔离或来源未核验的物件不能拆解"
	if Model.evidence_count(it) < 1:
		return "拆解前需要一条故障诊断物证"
	if Game.state.ap < 1:
		return "行动点不足"
	return ""

func _materials() -> void:
	info.add_child(UIKit.rule())
	info.add_child(UIKit.label("物资采购（不耗 AP）", 18, UIKit.MUTED))
	var g := UIKit.grid(2, 8)
	for m in GameData.materials:
		var b := UIKit.button("%s ×%s\n+1 · %s" % [m.name, Model.jnum(Game.state.materials.get(m.id, 0)), UIKit.money(m.price)], "chip", Vector2(0, 62), 16)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.tooltip_text = m.description
		var id: String = m.id
		b.pressed.connect(func():
			if Game.dispatch({"type": "BUY_MATERIAL", "id": id, "qty": 1}):
				shell.sound("coin", -8))
		g.add_child(b)
	info.add_child(g)

# ---------------------------------------------------------------- stages

func _stage_ui() -> void:
	_stage_ui_body()
	# Selecting another lot changes the stage; keep the dock hint in step.
	shell.hint(hint_text())

func _stage_ui_body() -> void:
	UIKit.clear(bench_body)
	grime_label = null
	for n in [part, slot]:
		if n != null and is_instance_valid(n):
			n.queue_free()
	part = null
	slot = null
	var it = Game.item(it_uid)
	if it == null:
		stage = -1
		return
	var why := _blocked(it)
	stage = int(Game.state.repairProgress.get(it.uid, 0))
	if why != "" and stage < 3:
		bench_body.add_child(UIKit.label("不能开工：" + why, 20, UIKit.DANGER, false, true))
		item.mat.set_shader_parameter("grime", 0.0)
		stage = -1
		return
	item.mat.set_shader_parameter("grime", 1.0 if stage == 0 else 0.0)
	var titles := ["清洁排故", "换件连接", "负载复测"]
	var steps := UIKit.hbox(8)
	for i in 3:
		var tag := UIKit.plate(UIKit.inset_style(6))
		tag.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var text := UIKit.label("%02d  %s%s" % [i + 1, titles[i], "  ✓" if i < stage else ""], 16, UIKit.GOOD if i < stage else (UIKit.AMBER if i == stage else UIKit.MUTED))
		tag.add_child(text)
		steps.add_child(tag)
	bench_body.add_child(steps)
	bench_body.add_child(UIKit.label("工序完成 · " + hint_text() if stage >= 3 else hint_text(), 19, UIKit.TEXT, false, true))
	match stage:
		0:
			mask.fill(Color.WHITE)
			mask_tex.update(mask)
			dirty = 1.0
			grime_label = UIKit.label("污垢剩余 100%", 18, UIKit.MUTED)
			bench_body.add_child(grime_label)
		1:
			slot = Slot.new()
			slot.position = item.uv_global(Vector2(0.58, 0.48))
			add_world(slot, "top")
			part = Part.new()
			part.position = PART_HOME
			add_world(part, "top")
		2:
			test_bar = ProgressBar.new()
			test_bar.custom_minimum_size = Vector2(0, 26)
			test_bar.show_percentage = false
			test_bar.max_value = 1.0
			var row := UIKit.hbox(14)
			test_bar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			test_bar.size_flags_vertical = Control.SIZE_SHRINK_CENTER
			row.add_child(test_bar)
			var b := UIKit.button("按住 · 负载复测", "primary", Vector2(260, 60), 20)
			b.button_down.connect(func():
				test_hold = true
				test_value = 0.0)
			b.button_up.connect(func():
				test_hold = false
				if test_value >= 0.72 and test_value <= 0.9:
					_step(2)
				else:
					shell.toast("指针%s，再试一次：在绿区（72–90%%）松开。" % ("没到绿区" if test_value < 0.72 else "冲过了绿区"))
					test_value = 0.0)
			row.add_child(b)
			bench_body.add_child(row)
			bench_body.add_child(UIKit.label("绿区：72%–90%", 16, UIKit.GOOD))

func _step(n: int) -> void:
	if Game.dispatch({"type": "REPAIR_STEP", "uid": it_uid, "stage": n}):
		shell.sound("check", -4)
		_sparks(item.global_position)

func _celebrate() -> void:
	shell.sound("check", 0, 1.2)
	_sparks(item.global_position)
	if not Game.prefs.reduced_motion:
		shell.shake = 0.4
		item.land(60.0)

func _return_part() -> void:
	if Game.prefs.reduced_motion:
		part.position = PART_HOME
	else:
		create_tween().tween_property(part, "position", PART_HOME, 0.25).set_trans(Tween.TRANS_BACK)

func _sparks(at: Vector2) -> void:
	if Game.prefs.reduced_motion:
		return
	var p := CPUParticles2D.new()
	p.position = shell.layer("top").to_local(at)
	p.amount = 40
	p.lifetime = 0.8
	p.one_shot = true
	p.explosiveness = 0.9
	p.texture = Util.radial(64, 0.3)
	p.color = Color(1.0, 0.8, 0.45)
	p.direction = Vector2(0, -1)
	p.spread = 120
	p.initial_velocity_min = 120
	p.initial_velocity_max = 320
	p.gravity = Vector2(0, 500)
	p.scale_amount_min = 0.05
	p.scale_amount_max = 0.12
	p.material = Util.add_material()
	add_world(p, "top")
	p.emitting = true

func on_changed(_p: Dictionary, _n: Dictionary, a: Dictionary) -> void:
	if a.type in ["DISMANTLE", "CRAFT"] and Game.item(it_uid) == null:
		var c := _candidates()
		_select(c[0].uid if not c.is_empty() else "")
		return
	_fill_list()
	_refresh_info()
	_stage_ui()
	shell.hint(hint_text())

# ---------------------------------------------------------------- input & frame

func world_cursor_shape(p: Vector2) -> int:
	if not is_instance_valid(item):
		return Input.CURSOR_ARROW
	if dragging_part:
		return Input.CURSOR_DRAG
	if shell.modal_open():
		return Input.CURSOR_ARROW
	if stage == 0 and item.contains(p):
		return Input.CURSOR_CROSS
	if stage == 1 and is_instance_valid(part) and p.distance_to(part.global_position) < 70:
		return Input.CURSOR_CAN_DROP
	return Input.CURSOR_ARROW

func _unhandled_input(e: InputEvent) -> void:
	if shell.modal_open() or item == null or not is_instance_valid(item):
		return
	var p: Vector2 = shell.world_mouse()
	if e is InputEventMouseButton and (e as InputEventMouseButton).button_index == MOUSE_BUTTON_LEFT:
		if e.pressed:
			if stage == 0 and item.contains(p):
				scrubbing = true
			elif stage == 1 and part != null and p.distance_to(part.global_position) < 70:
				dragging_part = true
		else:
			scrubbing = false
			if dragging_part:
				dragging_part = false
				if part.global_position.distance_to(slot.global_position) < 60:
					part.global_position = slot.global_position
					_step(1)
				else:
					_return_part()

func _process(delta: float) -> void:
	if item == null or not is_instance_valid(item):
		return
	var p: Vector2 = shell.world_mouse()
	if stage == 0 and scrubbing and item.contains(p):
		var local := item.body.to_local(p) / item.tex_size() + Vector2(0.5, 0.5)
		var c := Vector2i(int(local.x * 64), int(local.y * 64))
		var cleared := 0
		for y in range(-5, 6):
			for x in range(-5, 6):
				if x * x + y * y <= 25:
					var q := c + Vector2i(x, y)
					if q.x >= 0 and q.y >= 0 and q.x < 64 and q.y < 64:
						var old := mask.get_pixel(q.x, q.y).r
						mask.set_pixel(q.x, q.y, Color(maxf(0.0, old - 0.35), 0, 0))
		mask_tex.update(mask)
		if Engine.get_process_frames() % 6 == 0:
			# Measure only the body of the object (an ellipse inside the reachable
			# box). Counting the transparent margin made the step impossible to
			# finish: the item looked clean while 50%+ "grime" remained.
			var sum := 0.0
			var n := 0
			for y in range(0, 64, 2):
				for x in range(0, 64, 2):
					var d := Vector2((x + 0.5) / 64.0 - 0.5, (y + 0.5) / 64.0 - 0.5) / 0.4
					if d.length_squared() <= 1.0:
						sum += mask.get_pixel(x, y).r
						n += 1
			dirty = sum / maxf(1.0, float(n))
			shell.sound("click", -26, randf_range(0.5, 0.7))
			if is_instance_valid(grime_label):
				grime_label.text = "污垢剩余 %d%%" % roundi(dirty * 100)
			if dirty < 0.18:
				scrubbing = false
				item.mat.set_shader_parameter("grime", 0.0)
				_step(0)
		cleared += 1
	if dragging_part and part != null:
		part.global_position = part.global_position.lerp(p, 0.4)
	if stage == 2 and test_bar != null and is_instance_valid(test_bar):
		if test_hold:
			test_value = minf(1.05, test_value + delta * 0.55)
		test_bar.value = test_value
		var fill := StyleBoxFlat.new()
		fill.bg_color = Color("98ffb0") if test_value >= 0.72 and test_value <= 0.9 else Color("ffb35c")
		test_bar.add_theme_stylebox_override("fill", fill)


class Slot extends Node2D:
	func _process(_d: float) -> void:
		queue_redraw()
	func _draw() -> void:
		var t := Time.get_ticks_msec() / 1000.0
		var pulse := 0.0 if Game.prefs.reduced_motion else 0.1 * sin(t * 5.0)
		draw_rect(Rect2(-34, -22, 68, 44), Color(1.0, 0.7, 0.3, 0.18 + pulse))
		draw_rect(Rect2(-34, -22, 68, 44), Color(1.0, 0.75, 0.35), false, 3.0)


class Part extends Node2D:
	func _ready() -> void:
		material = Util.unshaded()
	func _draw() -> void:
		draw_rect(Rect2(-30, -18, 60, 36), Color("6b4a2b"))
		for i in 7:
			draw_line(Vector2(-26 + i * 8, -18), Vector2(-26 + i * 8, 18), Color("d18a45"), 4.0)
		draw_rect(Rect2(-36, -8, 6, 16), Color("c0c4c6"))
		draw_rect(Rect2(30, -8, 6, 16), Color("c0c4c6"))
		draw_string(UIKit.font, Vector2(-40, 44), "新线圈", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, Color(1, 0.9, 0.7))
