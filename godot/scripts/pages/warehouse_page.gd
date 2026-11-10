extends Page
## Back room: a 10×6 storage grid you drag goods around (right-click rotates),
## the display shelf, the isolation locker and pawn safe, and item actions.

const CELL := 72.0
const DETAIL_WIDTH := 520.0
const PANEL_GAP := 18.0
const Commerce = preload("res://scripts/model/commerce.gd")

var grid: StorageGrid
var lists: VBoxContainer
var detail: VBoxContainer
var selected := ""
var holder: PanelContainer
var holder_contents: VBoxContainer
var detail_panel: PanelContainer

func scene_name() -> String:
	return "warehouse"

func hint_text() -> String:
	var t = Game.state.trade
	if t != null and t.kind == "sell" and not t.has("selectedUid"):
		return "顾客在柜台等货：选中一件合格自有货，点「推荐给顾客」。"
	if Game.state.day >= 3 and Game.state.inspection == "pending":
		return "饶静预约核验：来源待核的货要扫描并登记，或放进隔离柜。"
	if shell._landscape_phone():
		return "拖动货物换格位；点选后在右侧详情里点「旋转方向」。"
	return "拖动货物换格位，拖动时右键旋转；点选查看详情与操作。"

## Notices drop in at the bottom of the room, under the storage plates
## (the left margin was only ~200 px wide and wrapped every notice).
func toast_rect() -> Rect2:
	var r: Rect2 = shell.content_rect()
	return Rect2(r.position.x + (r.size.x - 640.0) * 0.5, r.end.y - 230.0, 640, 220)

func enter() -> void:
	holder = UIKit.plate()
	add_child(holder)
	var holder_scroll := ScrollContainer.new()
	holder_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	holder_scroll.follow_focus = true
	holder_scroll.custom_minimum_size.x = CELL * 10
	holder.add_child(holder_scroll)
	var v := UIKit.vbox(10)
	v.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	holder_contents = v
	holder_scroll.add_child(v)
	var grid_hint := "10 × 6  /  拖动换位 · 点选后旋转" if shell._landscape_phone() else "10 × 6  /  拖动换位 · 右键旋转"
	v.add_child(UIKit.module_header("货物保管区", grid_hint, "STORAGE / 60"))
	grid = StorageGrid.new()
	grid.page = self
	# Empty cells must let touch drags reach the enclosing scroll container;
	# dragging an occupied cell is still handled by the grid itself.
	grid.mouse_filter = Control.MOUSE_FILTER_PASS
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
	# Keep printed edges and right-aligned serials clear of the scroll rail.
	var scroll_gutter := MarginContainer.new()
	scroll_gutter.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll_gutter.add_theme_constant_override("margin_right", 14)
	scroll_gutter.add_child(detail)
	sc.add_child(scroll_gutter)
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
	var available: float = shell.content_rect().size.y
	# On a short landscape screen the grid and location lists must scroll
	# together rather than extend under the drawer's bottom edge.
	var holder_style: StyleBox = holder.get_theme_stylebox("panel")
	var holder_pad := holder_style.get_content_margin(SIDE_TOP) + holder_style.get_content_margin(SIDE_BOTTOM)
	var holder_height := minf(available, holder_contents.get_combined_minimum_size().y + holder_pad + 4.0)
	holder.size = Vector2(holder.get_combined_minimum_size().x, holder_height)
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
			b.icon = UIKit.physical_icon(it)
			b.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
			b.expand_icon = true
			b.tooltip_text = GameData.def(it.defId).name
			var uid: String = it.uid
			b.pressed.connect(func(): select(uid))
			items_row.add_child(b)
		lists.add_child(row)
	_document_inventory()

func _document_inventory() -> void:
	if not WantedCases.has_notice(Game.state): return
	var row:=UIKit.hbox(8)
	row.add_child(UIKit.label("纸质档案 / 1",16,UIKit.AMBER))
	var open:=UIKit.button("通缉名单 · 取出 / 收起","secondary",Vector2(0,48),17)
	open.icon = load("res://assets/ui/wanted-document.svg")
	open.expand_icon = true
	open.add_theme_constant_override("icon_max_width",40)
	open.name="wanted_inventory"
	open.pressed.connect(func(): shell.toggle_wanted_notice())
	row.add_child(open)
	lists.add_child(row)

func select(uid: String) -> void:
	if selected != uid:
		var was_prepared := grid.prepared_uid != ""
		grid.prepared_uid = ""
		if was_prepared:
			shell.hint(hint_text())
	selected = uid
	Game.focus_uid = uid
	shell.sound("click", -10, 1.2)
	grid.queue_redraw()
	_lists()
	_detail()
	call_deferred("_resize_panels")

func selected_rotation() -> bool:
	var it = Model.find_inventory(Game.state, selected)
	if it == null:
		return false
	if grid.drag_uid == selected:
		return grid.drag_rot
	if grid.prepared_uid == selected:
		return grid.prepared_rot
	return it.rotated

func can_rotate_selected() -> bool:
	var it = Model.find_inventory(Game.state, selected)
	if Game.state.phase != "open" or it == null or it.location != "warehouse" or it.owner == "pawn" or it.sealed or Model.trade_reserved(Game.state, it):
		return false
	var next := not selected_rotation()
	if Model.can_place(Game.state, it.uid, it.x, it.y, next):
		return true
	for y in 6:
		for x in 10:
			if Model.can_place(Game.state, it.uid, x, y, next):
				return true
	return false

func rotate_selected() -> void:
	if not can_rotate_selected():
		return
	var it = Model.find_inventory(Game.state, selected)
	var next := not selected_rotation()
	if grid.drag_uid == selected:
		grid.drag_rot = next
		grid.prepared_uid = selected if next != it.rotated else ""
		grid.prepared_rot = next
		grid.queue_redraw()
	elif next == it.rotated:
		grid.prepared_uid = ""
		grid.queue_redraw()
		shell.hint(hint_text())
	elif Model.can_place(Game.state, it.uid, it.x, it.y, next):
		grid.prepared_uid = ""
		Game.dispatch({"type": "MOVE", "uid": it.uid, "x": it.x, "y": it.y, "rotated": next})
	else:
		# The new shape need not fit at the old position; carry it to a free
		# space and submit the rotation and move together on drop.
		grid.prepared_uid = selected
		grid.prepared_rot = next
		grid.queue_redraw()
		shell.hint("方向已切换，拖到可容纳的空位后放开。")
	shell.sound("click", -8)

func _act(g: GridContainer, text: String, kind: String, a, enabled := true, tip := "") -> void:
	var b := UIKit.button(text, kind, Vector2(0, 54), 19)
	b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	b.disabled = not enabled
	b.tooltip_text = tip
	# Deferred: the action rebuilds this panel, freeing the pressed button.
	b.pressed.connect(func():
		if a is Callable:
			a.call_deferred()
		else:
			Game.dispatch.call_deferred(a))
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
		detail.add_child(UIKit.note_card("库存登记簿", "选中一件货物查看详情。"))
		_stock_summary()
		return
	var known_crime: bool = it.get("crimeRevealed", false)
	for case in NightCrime.public_report(s).cases:
		if case.revealed:
			for row in case.items:
				if row.uid == it.uid: known_crime = true
	var def := GameData.def(it.defId)
	var docket := UIKit.plate(UIKit.paper_style(16))
	var record := UIKit.vbox(8)
	docket.add_child(record)
	record.add_child(UIKit.label("保管凭单 / " + String(it.uid), 15, UIKit.RUST, true))
	var head := UIKit.hbox(14)
	var pic := TextureRect.new()
	pic.texture = UIKit.physical_icon(it)
	pic.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	pic.custom_minimum_size = Vector2(120, 120)
	pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	head.add_child(pic)
	var hv := UIKit.vbox(4)
	hv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hv.add_child(UIKit.label(def.name, 26, UIKit.INK, false, true))
	hv.add_child(UIKit.label("型号档次：%s" % GameData.tier_label(it.defId), 17, UIKit.RUST))
	if GameData.def(it.defId).get("tier") == "luxury":
		var distinction := UIKit.hbox(8)
		distinction.add_child(UIKit.tier_badge(it.defId))
		distinction.add_child(UIKit.label("名贵型号 · 金饰徽章", 16, UIKit.RUST))
		hv.add_child(distinction)
	var owner: String = {"shop": "店铺自有", "customer": "顾客委修", "pawn": "抵押保管"}[it.owner]
	var loc: String = {"warehouse": "后仓", "display": "陈列架", "isolation": "隔离柜", "pawn": "抵押柜"}[it.location]
	hv.add_child(UIKit.label("%s · %s · 占格 %d×%d" % [owner, loc, def.size[0], def.size[1]], 16, Color("6b5a40"), false, true))
	hv.add_child(UIKit.label("品相 %s · 物证 %d · 挂牌 %s" % [UIKit.pct(it.condition), Model.evidence_count(it), UIKit.money(it.listPrice)], 17, UIKit.INK, false, true))
	head.add_child(hv)
	record.add_child(head)
	record.add_child(UIKit.label(Model.appraisal_text(it) + " · 成本 " + UIKit.money(it.cost), 18, UIKit.RUST, false, true))
	record.add_child(UIKit.label(("来源已核验" if it.sourceVerified else "来源待核") + " · " + String(it.source), 16, Color("2f6b3a") if it.sourceVerified else UIKit.RUST, false, true))
	if known_crime:
		record.add_child(UIKit.label("已知涉案来源 · 请移交站务核对", 17, UIKit.RUST, false, true))
	elif it.sealed and not it.sourceVerified:
		record.add_child(UIKit.label("隔离保管 · 来源待核，可继续补证或移交核对", 17, UIKit.RUST, false, true))
	if it.has("forgery"):
		record.add_child(UIKit.label(WatchForgery.summary(it), 17, UIKit.RUST, false, true))
	if it.owner == "pawn":
		record.add_child(UIKit.label("本金 %s · 第 %s 天抵押，赎期至第 %s 天（含宽限）" % [UIKit.money(it.pawnPrincipal), Model.jnum(it.pawnDay), Model.jnum(it.pawnDay + 4)], 16, UIKit.INK, false, true))
	detail.add_child(docket)
	detail.add_child(UIKit.module_header("出入库操作", "按保管权属办理", "CONTROL"))
	var g := UIKit.grid(2, 10)
	if t != null and t.kind == "sell" and it.owner == "shop":
		if not TradeSession.session(s).is_empty():
			var problem := TradeSession._stock_problem(s,it,"sell")
			var batch_uid: String=it.uid
			_act(g,"灰色收售" if not it.sourceVerified else "推荐给顾客","danger" if not it.sourceVerified else "primary",func():
				if Game.dispatch({"type":"TRADE_ADD","tradeId":t.id,"uid":batch_uid,"direction":"sell"}):
					Game.dispatch({"type":"TRADE_FOCUS","tradeId":t.id,"uid":batch_uid,"return_list":true})
					shell.go("counter"),problem=="",problem)
		else:
			if not it.sourceVerified and not it.sealed and it.location != "isolation" and not it.has("orderId") and not it.get("crimeRevealed", false):
				var gray_uid: String = it.uid
				_act(g, "灰色收售", "danger", func():
					shell.confirm("确认灰色收售风险", "本件来源未核。完成交易增加 8 风险；警方可追索原物并处罚，登记不能洗白。确认为赃物不赔付，保费不退。此确认仅限本次交易。", "承担风险并选货", func():
						Game.dispatch({"type":"GRAY_TRADE", "tradeId":t.id, "uid":gray_uid, "confirmed":true})
						if Game.dispatch({"type":"SELECT_TRADE", "uid":gray_uid}): shell.go("counter")))
			var why = Model.sale_eligibility(it, t.npcId)
			if Commerce.forgery_rejected(s,it): why = "这位顾客本轮已识破本件加工，请更换货物。"
			_act(g, "推荐给顾客", "primary", func():
				if Game.dispatch({"type": "SELECT_TRADE", "uid": it.uid}):
					shell.go("counter"), why == null, why if why != null else "")
	var reserved := Model.trade_reserved(s, it)
	var shelf_why := _shelf_block(it, reserved)
	_act(g, "下架" if it.location == "display" else "上架陈列", "good", {"type": "DISPLAY", "uid": it.uid}, shelf_why == "", shelf_why)
	var quote_problem := StoreCosts.device_problem(s, "quote_terminal")
	var price_ok: bool = it.owner == "shop" and not it.has("orderId") and not reserved and quote_problem == ""
	if quote_problem != "": detail.add_child(UIKit.label(quote_problem, 16, UIKit.DANGER, false, true))
	_act(g, "挂牌 −10", "chip", {"type": "PRICE", "uid": it.uid, "price": maxf(1, it.listPrice - 10)}, price_ok and it.listPrice > 1, quote_problem)
	_act(g, "挂牌 +10", "chip", {"type": "PRICE", "uid": it.uid, "price": it.listPrice + 10}, price_ok, quote_problem)
	# Touch screens have no right-click while dragging, so rotation also needs a button.
	_act(g, "旋转方向", "chip", func(): rotate_selected(), can_rotate_selected(), "" if can_rotate_selected() else "需要后仓里有能容纳旋转后形状的空位")
	var scanner_problem := StoreCosts.device_problem(s, "scanner")
	_act(g, "已扫描 · 复查" if s.scanned.has(it.uid) else "安检扫描", "secondary", {"type": "SCAN", "uid": it.uid}, scanner_problem == "", scanner_problem)
	if scanner_problem != "":
		detail.add_child(UIKit.label(scanner_problem, 16, UIKit.DANGER, false, true))
	else:
		var charge := StoreCosts.usage_quote(s, "scanner", 0.5)
		detail.add_child(UIKit.label("新的有效来源扫描预计电费 +%s Cr，日结统一收取；查看旧结果不收费。" % Model.jnum(charge) if charge > 0 else "本日沿用旧版能源维护，不另计来源扫描电费。", 16, UIKit.CYAN, false, true))
	var reg_why := ""
	if known_crime:
		reg_why = "疑似赃物不能办理普通来源登记"
	elif it.owner == "pawn":
		reg_why = "抵押保管物不需要登记"
	elif not s.scanned.has(it.uid):
		reg_why = "先做安检扫描"
	elif Model.evidence_count(it) < 2:
		reg_why = "先在鉴定台取得两条物证"
	_act(g, "来源已登记" if it.sourceVerified else "来源登记 35Cr·1AP", "secondary", {"type": "REGISTER", "uid": it.uid}, not it.sourceVerified and reg_why == "", reg_why)
	if known_crime or (it.sealed and not it.sourceVerified):
		var report_uid: String = it.uid
		_act(g, "移交站务", "primary", func():
			shell.confirm("移交疑似赃物", "原物将从隔离柜移交站务，登记后风险下降、站务关系提升。", "确认移交", func():
				Game.dispatch({"type": "REPORT_STOLEN", "uid": report_uid})))
	_act(g, "解除隔离" if it.location == "isolation" else "放入隔离柜", "secondary", {"type": "ISOLATE", "uid": it.uid}, it.owner != "pawn" and not reserved, "正在柜台交易中" if reserved else "")
	_act(g, "去鉴定", "secondary", func(): shell.go("inspect", it.uid))
	_act(g, "去维修", "secondary", func(): shell.go("repair", it.uid))
	if it.owner == "shop":
		var forge_why := Commerce.forgery_problem(s, it)
		var forge_uid: String = it.uid
		_act(g, "送到修表台 · 加工", "danger", func(): _open_forgery(forge_uid), forge_why == "", forge_why)

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
	if not known_crime:
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
	detail.add_child(UIKit.note_card("工具柜存料", "、".join(mats)))

func on_changed(_p: Dictionary, _n: Dictionary, _a: Dictionary) -> void:
	if Game.item(selected) == null:
		selected = ""
	var prepared = Game.item(grid.prepared_uid) if grid.prepared_uid != "" else null
	if prepared == null or prepared.location != "warehouse" or prepared.rotated == grid.prepared_rot:
		grid.prepared_uid = ""
	_refresh()


class StorageGrid extends Control:
	var page
	var tiles := {}
	var drag_uid := ""
	var drag_rot := false
	var prepared_uid := ""
	var prepared_rot := false
	var drag_offset := Vector2.ZERO
	var press_pos := Vector2.ZERO
	var moved := false
	var ghost: TextureRect
	var scroll_touch := -1
	var scroll_touch_y := 0.0

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
			tr.texture = UIKit.physical_icon(it)
			tr.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
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
		if e is InputEventScreenTouch:
			var touch := e as InputEventScreenTouch
			if touch.pressed and scroll_touch < 0 and _uid_at(touch.position) == "":
				scroll_touch = touch.index
				scroll_touch_y = (get_global_transform_with_canvas() * touch.position).y
				accept_event()
			elif not touch.pressed and touch.index == scroll_touch:
				scroll_touch = -1
				accept_event()
			return
		if e is InputEventScreenDrag and (e as InputEventScreenDrag).index == scroll_touch:
			var drag := e as InputEventScreenDrag
			var current_y := (get_global_transform_with_canvas() * drag.position).y
			var scroller := page.holder.get_child(0) as ScrollContainer
			scroller.scroll_vertical -= roundi(current_y - scroll_touch_y)
			scroll_touch_y = current_y
			accept_event()
			return
		if e is InputEventMouseButton:
			var mb := e as InputEventMouseButton
			var handled := false
			if mb.button_index == MOUSE_BUTTON_LEFT and mb.pressed:
				var uid := _uid_at(mb.position)
				if uid != "":
					handled = true
					drag_uid = uid
					var it = Game.item(uid)
					if prepared_uid != "" and prepared_uid != uid:
						prepared_uid = ""
						page.shell.hint(page.hint_text())
					drag_rot = prepared_rot if prepared_uid == uid else it.rotated
					press_pos = mb.position
					drag_offset = mb.position - Vector2(it.x, it.y) * page.CELL
					moved = false
			elif mb.button_index == MOUSE_BUTTON_LEFT and not mb.pressed and drag_uid != "":
				handled = true
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
					Game.dispatch({"type": "MOVE", "uid": uid, "x": int(tl.x), "y": int(tl.y), "rotated": drag_rot})
					var placed = Game.item(uid)
					if placed == null or placed.x != int(tl.x) or placed.y != int(tl.y) or placed.rotated != drag_rot:
						var closed := Model.business_hours_problem(Game.state)
						page.shell.toast(closed if closed != "" else "放置会重叠或越界，货物已回到原位。")
					else:
						prepared_uid = ""
						page.shell.sound("drop", -6, 1.1)
					var _u = it
				queue_redraw()
			elif mb.button_index == MOUSE_BUTTON_RIGHT and mb.pressed and drag_uid != "":
				handled = true
				drag_rot = not drag_rot
				page.shell.sound("click", -8)
				_update_ghost(mb.position)
			if handled:
				accept_event()
		elif e is InputEventMouseMotion and drag_uid != "":
			var mm := e as InputEventMouseMotion
			if not moved and mm.position.distance_to(press_pos) > 6:
				moved = true
				ghost = TextureRect.new()
				ghost.texture = UIKit.item_icon(Game.item(drag_uid).defId)
				ghost.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
				ghost.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				ghost.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
				ghost.mouse_filter = Control.MOUSE_FILTER_IGNORE
				ghost.modulate = Color(1, 1, 1, 0.85)
				add_child(ghost)
				tiles[drag_uid].modulate.a = 0.3
			if moved:
				_update_ghost(mm.position)
			queue_redraw()
			accept_event()
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

func _open_forgery(uid: String) -> void:
	if Game.item(uid) == null: return
	shell.go("repair",uid)
	var active = shell.active_shell()
	if active.page_name == "repair": active.page.call_deferred("open_forgery")
