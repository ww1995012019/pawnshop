extends Page
## Back room: a 10×6 storage grid you drag goods around (right-click rotates),
## the display shelf, the isolation locker and pawn safe, and item actions.

const CELL := 72.0
const DETAIL_WIDTH := 520.0
const PANEL_GAP := 18.0

var grid: StorageGrid
var lists: VBoxContainer
var detail: VBoxContainer
var selected := ""
var holder: PanelContainer
var detail_panel: PanelContainer

func scene_name() -> String:
	return "warehouse"

func hint_text() -> String:
	var t = Game.state.trade
	if t != null and t.kind == "sell" and not t.has("selectedUid"):
		return "顾客在柜台等货：选中一件合格自有货，点「推荐给顾客」。"
	if Game.state.day >= 3 and Game.state.inspection == "pending":
		return "饶静预约核验：来源待核的货要扫描并登记，或放进隔离柜。"
	return "拖动货物换格位，拖动时右键旋转；点选查看详情与操作。"

## Notices drop in at the bottom of the room, under the storage plates
## (the left margin was only ~200 px wide and wrapped every notice).
func toast_rect() -> Rect2:
	var r: Rect2 = shell.content_rect()
	return Rect2(r.position.x + (r.size.x - 640.0) * 0.5, r.end.y - 230.0, 640, 220)

func enter() -> void:
	holder = UIKit.plate()
	add_child(holder)
	var v := UIKit.vbox(10)
	holder.add_child(v)
	var head := UIKit.hbox()
	head.add_child(UIKit.label("货物保管区", 24, UIKit.AMBER))
	head.add_child(UIKit.spacer(false))
	head.add_child(UIKit.label("10 × 6  /  拖动换位 · 右键旋转", 16, UIKit.MUTED))
	v.add_child(head)
	grid = StorageGrid.new()
	grid.page = self
	grid.custom_minimum_size = Vector2(CELL * 10, CELL * 6)
	v.add_child(grid)
	lists = UIKit.vbox(7)
	v.add_child(lists)
	holder.size = Vector2(CELL * 10 + 40, 0)
	detail_panel = UIKit.plate()
	add_child(detail_panel)
	var sc := ScrollContainer.new()
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	detail = UIKit.vbox(12)
	detail.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	sc.add_child(detail)
	detail_panel.add_child(sc)
	# Only stock in our storage; the visitor's lot at the counter is not ours.
	selected = Game.focus_uid if Model.find_inventory(Game.state, Game.focus_uid) != null else ""
	_refresh()
	relayout()

func _refresh() -> void:
	grid.rebuild()
	_lists()
	_detail()
	call_deferred("_resize_panels")

## Called by the shell after it updates its HUD and navigation geometry.
func relayout() -> void:
	if not is_instance_valid(holder) or not is_instance_valid(detail_panel):
		return
	var r: Rect2 = shell.content_rect()
	var holder_w := holder.get_combined_minimum_size().x
	var group_width := holder_w + PANEL_GAP + DETAIL_WIDTH
	var left := r.position.x + maxf(0.0, (r.size.x - group_width) * 0.5)
	holder.position = Vector2(left, r.position.y)
	detail_panel.position = Vector2(left + holder_w + PANEL_GAP, r.position.y)
	_resize_panels()

## Keep the work surfaces close to their contents instead of stretching down to
## the navigation bar. Long item details stay reachable through their scroller.
func _resize_panels() -> void:
	if not is_instance_valid(holder) or not is_instance_valid(detail_panel):
		return
	# Shrink-wrap to the contents, padding included, so the plate's bottom
	# bar never covers the last row.
	holder.reset_size()
	var available: float = shell.content_rect().size.y
	var style: StyleBox = detail_panel.get_theme_stylebox("panel")
	var pad := style.get_content_margin(SIDE_TOP) + style.get_content_margin(SIDE_BOTTOM)
	var detail_height := clampf(detail.get_combined_minimum_size().y + pad + 4.0, 240.0, minf(700.0, available))
	detail_panel.size = Vector2(DETAIL_WIDTH, detail_height)

func _lists() -> void:
	UIKit.clear(lists)
	for spec in [["display", "陈列架", 24], ["isolation", "隔离柜", 12], ["pawn", "抵押保管柜", 16]]:
		var items := []
		for it in Game.state.inventory:
			if it.location == spec[0]:
				items.append(it)
		var row := UIKit.hbox(8)
		var caption := UIKit.label("%s\n%d / %d" % [spec[1], items.size(), spec[2]], 15, UIKit.MUTED)
		caption.custom_minimum_size.x = 116
		row.add_child(caption)
		var sc := ScrollContainer.new()
		sc.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		sc.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
		var items_row := UIKit.hbox(8)
		sc.add_child(items_row)
		row.add_child(sc)
		for it in items:
			var b := UIKit.button("", "primary" if it.uid == selected else "chip", Vector2(52, 52))
			b.icon = UIKit.item_icon(it.defId)
			b.expand_icon = true
			b.tooltip_text = GameData.def(it.defId).name
			var uid: String = it.uid
			b.pressed.connect(func(): select(uid))
			items_row.add_child(b)
		lists.add_child(row)

func select(uid: String) -> void:
	selected = uid
	Game.focus_uid = uid
	shell.sound("click", -10, 1.2)
	grid.queue_redraw()
	_lists()
	_detail()
	call_deferred("_resize_panels")

func _act(g: GridContainer, text: String, kind: String, a, enabled := true, tip := "") -> void:
	var b := UIKit.button(text, kind, Vector2(0, 54), 19)
	b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	b.disabled = not enabled
	b.tooltip_text = tip
	b.pressed.connect(func():
		if a is Callable:
			a.call()
		else:
			Game.dispatch(a))
	g.add_child(b)

func _detail() -> void:
	UIKit.clear(detail)
	var s := Game.state
	var t = s.trade
	if t != null and t.kind == "sell":
		var banner := UIKit.plate(UIKit.paper_style(12))
		banner.add_child(UIKit.label("%s 在柜台等货：%s" % [GameData.npc(t.npcId).name, Model.customer_need(t.npcId)], 17, UIKit.INK, false, true))
		detail.add_child(banner)
	var it = Game.item(selected)
	if it == null:
		detail.add_child(UIKit.label("选中一件货物查看详情。", 20, UIKit.MUTED))
		_stock_summary()
		return
	var def := GameData.def(it.defId)
	var head := UIKit.hbox(14)
	var pic := TextureRect.new()
	pic.texture = UIKit.item_icon(it.defId)
	pic.custom_minimum_size = Vector2(120, 120)
	pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	head.add_child(pic)
	var hv := UIKit.vbox(4)
	hv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hv.add_child(UIKit.label(def.name, 26, Color("f3e6cc"), false, true))
	var owner: String = {"shop": "店铺自有", "customer": "顾客委修", "pawn": "抵押保管"}[it.owner]
	var loc: String = {"warehouse": "后仓", "display": "陈列架", "isolation": "隔离柜", "pawn": "抵押柜"}[it.location]
	hv.add_child(UIKit.label("%s · %s · 占格 %d×%d" % [owner, loc, def.size[0], def.size[1]], 16, UIKit.MUTED))
	hv.add_child(UIKit.label("品相 %s · 物证 %d · 挂牌 %s" % [UIKit.pct(it.condition), Model.evidence_count(it), UIKit.money(it.listPrice)], 17, UIKit.TEXT))
	head.add_child(hv)
	detail.add_child(head)
	var e := Model.estimate(it)
	detail.add_child(UIKit.label("估值 %s · 成本 %s" % [UIKit.money(e.low) if e.exact else "%s–%s Cr" % [Model.jnum(e.low), Model.jnum(e.high)], UIKit.money(it.cost)], 18, UIKit.AMBER))
	detail.add_child(UIKit.label(("来源已核验" if it.sourceVerified else "来源待核") + " · " + String(it.source), 16, UIKit.GOOD if it.sourceVerified else UIKit.DANGER, false, true))
	if it.owner == "pawn":
		detail.add_child(UIKit.label("本金 %s · 第 %s 天抵押，赎期至第 %s 天（含宽限）" % [UIKit.money(it.pawnPrincipal), Model.jnum(it.pawnDay), Model.jnum(it.pawnDay + 4)], 16, UIKit.CYAN, false, true))
	var g := UIKit.grid(2, 10)
	if t != null and t.kind == "sell" and it.owner == "shop":
		var why = Model.sale_eligibility(it, t.npcId)
		_act(g, "推荐给顾客", "primary", func():
			if Game.dispatch({"type": "SELECT_TRADE", "uid": it.uid}):
				shell.go("counter"), why == null, why if why != null else "")
	var reserved := Model.trade_reserved(s, it)
	var shelf_why := _shelf_block(it, reserved)
	_act(g, "下架" if it.location == "display" else "上架陈列", "good", {"type": "DISPLAY", "uid": it.uid}, shelf_why == "", shelf_why)
	var price_ok: bool = it.owner == "shop" and not it.has("orderId") and not reserved
	_act(g, "挂牌 −10", "chip", {"type": "PRICE", "uid": it.uid, "price": maxf(1, it.listPrice - 10)}, price_ok and it.listPrice > 1)
	_act(g, "挂牌 +10", "chip", {"type": "PRICE", "uid": it.uid, "price": it.listPrice + 10}, price_ok)
	_act(g, "已扫描 · 复查" if s.scanned.has(it.uid) else "安检扫描", "secondary", {"type": "SCAN", "uid": it.uid})
	var reg_why := ""
	if it.owner == "pawn":
		reg_why = "抵押保管物不需要登记"
	elif not s.scanned.has(it.uid):
		reg_why = "先做安检扫描"
	elif Model.evidence_count(it) < 2:
		reg_why = "先在鉴定台取得两条物证"
	_act(g, "来源已登记" if it.sourceVerified else "来源登记 35Cr·1AP", "secondary", {"type": "REGISTER", "uid": it.uid}, not it.sourceVerified and reg_why == "", reg_why)
	_act(g, "解除隔离" if it.location == "isolation" else "放入隔离柜", "secondary", {"type": "ISOLATE", "uid": it.uid}, it.owner != "pawn" and not reserved, "正在柜台交易中" if reserved else "")
	_act(g, "去鉴定", "secondary", func(): shell.go("inspect", it.uid))
	_act(g, "去维修", "secondary", func(): shell.go("repair", it.uid))
	if it.owner == "pawn":
		_act(g, "客人赎回", "good", {"type": "REDEEM", "uid": it.uid})
	var relief := false
	for r in s.ledger:
		if r.kind == "relief-window" and r.day == s.day:
			relief = true
	var item_name: String = def.name
	var uid: String = it.uid
	if relief:
		_act(g, "应急清仓（55%）", "danger", func():
			shell.confirm("应急清仓", "「%s」将按估值的 55%% 立即卖出，不能撤回。" % item_name, "确认清仓", func():
				Game.dispatch({"type": "EMERGENCY_SALE", "uid": uid})))
	var return_text := "原物会移交原主并从库存移除，不能撤回。"
	if it.owner == "shop":
		return_text = "这是店铺花 %s 收来的货。归还后不会退款，原物从库存移除，不能撤回。" % UIKit.money(it.cost)
	_act(g, "主动归还原主", "danger", func():
		shell.confirm("主动归还原主", "「%s」：%s" % [item_name, return_text], "确认归还", func():
			Game.dispatch({"type": "RETURN_ITEM", "uid": uid})), it.owner != "pawn" and not reserved, "正在柜台交易中" if reserved else "")
	detail.add_child(g)
	if shelf_why != "" and it.owner == "shop":
		detail.add_child(UIKit.label("上架条件：" + shelf_why, 16, UIKit.DANGER, false, true))
	elif reg_why != "" and not it.sourceVerified:
		detail.add_child(UIKit.label("登记条件：" + reg_why, 16, UIKit.DANGER, false, true))
	_stock_summary()

## Mirrors the DISPLAY rule so the shelf key explains why it is unavailable.
func _shelf_block(it: Dictionary, reserved: bool) -> String:
	if reserved:
		return "这件实物已在当前报价中"
	if it.location == "display":
		return ""
	if it.owner != "shop" or it.has("orderId") or it.location == "isolation" or it.sealed:
		return "受托、预留、隔离或封存物品不能上架"
	if not it.sourceVerified:
		return "来源未核验：先扫描并登记"
	if Model.evidence_count(it) < 2:
		return "先在鉴定台取得两条物证"
	return ""

func _stock_summary() -> void:
	detail.add_child(UIKit.rule())
	var mats := []
	for m in GameData.materials:
		mats.append("%s ×%s" % [m.name, Model.jnum(Game.state.materials.get(m.id, 0))])
	detail.add_child(UIKit.label("工具柜：" + "、".join(mats), 16, UIKit.MUTED, false, true))

func on_changed(_p: Dictionary, _n: Dictionary, _a: Dictionary) -> void:
	if Game.item(selected) == null:
		selected = ""
	_refresh()


class StorageGrid extends Control:
	var page
	var tiles := {}
	var drag_uid := ""
	var drag_rot := false
	var drag_offset := Vector2.ZERO
	var press_pos := Vector2.ZERO
	var moved := false
	var ghost: TextureRect

	func cursor_at(at_position: Vector2) -> int:
		if drag_uid != "":
			return Input.CURSOR_DRAG
		return Input.CURSOR_CAN_DROP if _uid_at(at_position) != "" else Input.CURSOR_ARROW

	func rebuild() -> void:
		for c in get_children():
			c.queue_free()
		tiles.clear()
		for it in Game.state.inventory:
			if it.location != "warehouse":
				continue
			var tr := TextureRect.new()
			tr.texture = UIKit.item_icon(it.defId)
			tr.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
			var d := Model.dimensions(it)
			tr.position = Vector2(it.x, it.y) * page.CELL + Vector2(4, 4)
			tr.size = Vector2(d[0], d[1]) * page.CELL - Vector2(8, 8)
			add_child(tr)
			tiles[it.uid] = tr
		queue_redraw()

	func _cell(p: Vector2) -> Vector2i:
		return Vector2i(floori(p.x / page.CELL), floori(p.y / page.CELL))

	func _uid_at(p: Vector2) -> String:
		var c := _cell(p)
		for it in Game.state.inventory:
			if it.location != "warehouse":
				continue
			var d := Model.dimensions(it)
			if c.x >= it.x and c.x < it.x + d[0] and c.y >= it.y and c.y < it.y + d[1]:
				return it.uid
		return ""

	func _gui_input(e: InputEvent) -> void:
		if e is InputEventMouseButton:
			var mb := e as InputEventMouseButton
			if mb.button_index == MOUSE_BUTTON_LEFT and mb.pressed:
				var uid := _uid_at(mb.position)
				if uid != "":
					drag_uid = uid
					var it = Game.item(uid)
					drag_rot = it.rotated
					press_pos = mb.position
					drag_offset = mb.position - Vector2(it.x, it.y) * page.CELL
					moved = false
			elif mb.button_index == MOUSE_BUTTON_LEFT and not mb.pressed and drag_uid != "":
				var uid := drag_uid
				drag_uid = ""
				if ghost:
					ghost.queue_free()
					ghost = null
				if tiles.has(uid):
					tiles[uid].modulate.a = 1.0
				if not moved:
					page.select(uid)
				else:
					var tl: Vector2 = ((mb.position - drag_offset) / page.CELL).round()
					var it = Game.item(uid)
					if not Game.dispatch({"type": "MOVE", "uid": uid, "x": int(tl.x), "y": int(tl.y), "rotated": drag_rot}):
						page.shell.toast("放置会重叠或越界，货物已回到原位。")
					else:
						page.shell.sound("drop", -6, 1.1)
					var _u = it
				queue_redraw()
			elif mb.button_index == MOUSE_BUTTON_RIGHT and mb.pressed and drag_uid != "":
				drag_rot = not drag_rot
				page.shell.sound("click", -8)
				_update_ghost(mb.position)
			accept_event()
		elif e is InputEventMouseMotion and drag_uid != "":
			var mm := e as InputEventMouseMotion
			if not moved and mm.position.distance_to(press_pos) > 6:
				moved = true
				ghost = TextureRect.new()
				ghost.texture = UIKit.item_icon(Game.item(drag_uid).defId)
				ghost.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				ghost.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
				ghost.mouse_filter = Control.MOUSE_FILTER_IGNORE
				ghost.modulate = Color(1, 1, 1, 0.85)
				add_child(ghost)
				tiles[drag_uid].modulate.a = 0.3
			if moved:
				_update_ghost(mm.position)
			queue_redraw()
		if e is InputEventMouse:
			mouse_default_cursor_shape = cursor_at((e as InputEventMouse).position)

	func _update_ghost(pos: Vector2) -> void:
		if ghost == null:
			return
		var it = Game.item(drag_uid)
		var d := Model.dimensions(it, drag_rot)
		ghost.size = Vector2(d[0], d[1]) * page.CELL - Vector2(8, 8)
		ghost.position = pos - drag_offset + Vector2(4, 4)
		queue_redraw()

	func _draw() -> void:
		var cs: float = page.CELL
		draw_rect(Rect2(Vector2.ZERO, size), Color(0.03, 0.05, 0.06, 0.88))
		for y in 6:
			for x in 10:
				draw_rect(Rect2(Vector2(x, y) * cs + Vector2(2, 2), Vector2(cs, cs) - Vector2(4, 4)), Color(0.09, 0.13, 0.14, 0.9))
		for it in Game.state.inventory:
			if it.location != "warehouse":
				continue
			var d := Model.dimensions(it)
			var r := Rect2(Vector2(it.x, it.y) * cs + Vector2(2, 2), Vector2(d[0], d[1]) * cs - Vector2(4, 4))
			var col := Color(0.2, 0.28, 0.3, 0.9)
			if it.owner == "customer":
				col = Color(0.22, 0.3, 0.45, 0.9)
			elif not it.sourceVerified:
				col = Color(0.42, 0.2, 0.18, 0.9)
			draw_rect(r, col)
			draw_rect(r, Color("ffb35c") if it.uid == page.selected else Color(1, 1, 1, 0.12), false, 3.0 if it.uid == page.selected else 1.0)
		if drag_uid != "" and moved and ghost != null:
			var it = Game.item(drag_uid)
			var d := Model.dimensions(it, drag_rot)
			var tl: Vector2 = ((ghost.position - Vector2(4, 4)) / cs).round()
			var ok := Model.can_place(Game.state, drag_uid, int(tl.x), int(tl.y), drag_rot)
			draw_rect(Rect2(tl * cs + Vector2(2, 2), Vector2(d[0], d[1]) * cs - Vector2(4, 4)), Color(0.4, 0.9, 0.6, 0.25) if ok else Color(0.95, 0.4, 0.3, 0.25))
