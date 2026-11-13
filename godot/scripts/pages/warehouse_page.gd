extends Page
## Back room: an expandable storage grid you drag goods around (right-click rotates),
## the display shelf, the isolation locker and pawn safe, and item actions.

const CELL := 56.0
const DETAIL_WIDTH := 440.0
const PANEL_GAP := 10.0
const Commerce = preload("res://scripts/model/commerce.gd")

var grid: StorageGrid
var lists: VBoxContainer
var detail: VBoxContainer
var selected := ""
var holder: PanelContainer
var holder_contents: VBoxContainer
var storage_header: VBoxContainer
var detail_panel: PanelContainer
var display_panel: PanelContainer
var display_scroll: ScrollContainer
var display_grid
var grid_scroll: ScrollContainer
var cabinet_scroll: ScrollContainer
var cabinet_grid
var materials_view: VBoxContainer
var display_count: Label
var cabinet_buttons := {}
var cabinet_mode := "warehouse"
var cell_size := CELL
var surfaces: HBoxContainer
var center: VBoxContainer
var cabinet_rail: GridContainer
var scroll_positions := {}
var expand_button: Button
var cabinet_drag_uid := ""
var cabinet_drag_preview:TextureRect

func scene_name() -> String:
	return "warehouse"

func hint_text() -> String:
	var t = Game.state.trade
	if t != null and t.get("inspectionVisit",false):
		return "警官正在等你确认。可先整理库存，隔离箱不在本次检查范围；整理完关闭仓储，返回警官。"
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
	display_panel=UIKit.plate()
	display_panel.name="WarehouseDisplay"
	add_child(display_panel)
	var display_body:=UIKit.vbox(6);display_panel.add_child(display_body)
	display_count=UIKit.label("",16,UIKit.AMBER,true,true);display_body.add_child(display_count)
	display_scroll=ScrollContainer.new();display_scroll.name="DisplayScroll"
	display_scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED
	display_scroll.size_flags_vertical=Control.SIZE_EXPAND_FILL;display_scroll.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	display_body.add_child(display_scroll)
	display_grid=load("res://scripts/ui/warehouse_location_grid.gd").new();display_grid.setup(self,"display");display_scroll.add_child(display_grid)
	display_body.add_child(UIKit.label("拖入上架 · 拖回后仓",13,UIKit.MUTED,false,true))
	holder=UIKit.plate();holder.name="WarehouseStorage";add_child(holder)
	var body:=UIKit.vbox(6);holder_contents=body;holder.add_child(body)
	var title_row:=UIKit.hbox(4);body.add_child(title_row)
	storage_header=UIKit.vbox(0);storage_header.size_flags_horizontal=Control.SIZE_EXPAND_FILL;title_row.add_child(storage_header)
	expand_button=UIKit.button("","primary",Vector2(44,40),15)
	expand_button.custom_minimum_size.x=44
	expand_button.alignment=HORIZONTAL_ALIGNMENT_CENTER
	expand_button.icon=load("res://assets/ui/warehouse-expand.svg");expand_button.expand_icon=true
	expand_button.add_theme_constant_override("icon_max_width",26)
	expand_button.name="warehouse_expand";expand_button.tooltip_text="扩仓条件与所需交付原表"
	expand_button.pressed.connect(func():shell.open_warehouse_expansion());title_row.add_child(expand_button)
	surfaces=UIKit.hbox(5);surfaces.size_flags_vertical=Control.SIZE_EXPAND_FILL;body.add_child(surfaces)
	center=UIKit.vbox(0);center.size_flags_horizontal=Control.SIZE_EXPAND_FILL;center.size_flags_vertical=Control.SIZE_EXPAND_FILL;surfaces.add_child(center)
	grid_scroll=ScrollContainer.new();grid_scroll.name="WarehouseGridScroll";grid_scroll.size_flags_horizontal=Control.SIZE_EXPAND_FILL;grid_scroll.size_flags_vertical=Control.SIZE_EXPAND_FILL
	grid_scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED;grid_scroll.follow_focus=true;center.add_child(grid_scroll)
	grid=StorageGrid.new();grid.page=self;grid.mouse_filter=Control.MOUSE_FILTER_PASS;grid_scroll.add_child(grid)
	cabinet_scroll=ScrollContainer.new();cabinet_scroll.name="CabinetScroll";cabinet_scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED
	cabinet_scroll.size_flags_horizontal=Control.SIZE_EXPAND_FILL;cabinet_scroll.size_flags_vertical=Control.SIZE_EXPAND_FILL;center.add_child(cabinet_scroll)
	var cabinet_body:=UIKit.vbox(6);cabinet_body.size_flags_horizontal=Control.SIZE_EXPAND_FILL;cabinet_scroll.add_child(cabinet_body)
	cabinet_grid=load("res://scripts/ui/warehouse_location_grid.gd").new();cabinet_grid.setup(self,"isolation");cabinet_body.add_child(cabinet_grid)
	materials_view=UIKit.vbox(5);materials_view.size_flags_horizontal=Control.SIZE_EXPAND_FILL;cabinet_body.add_child(materials_view)
	# Purchases belong above the pawn slots, so small screens expose them first.
	cabinet_body.move_child(materials_view,0)
	cabinet_rail=UIKit.grid(4,4);cabinet_rail.name="CabinetTabs";body.add_child(cabinet_rail);body.move_child(cabinet_rail,1)
	for spec in [["warehouse","后仓"],["materials","材料"],["isolation","隔离"],["pawn","抵押"]]:
		var mode:String=spec[0]
		var key:=UIKit.button(spec[1],"secondary",Vector2(42,36),14);key.name="cabinet_"+mode
		key.custom_minimum_size.x=44
		key.size_flags_horizontal=Control.SIZE_EXPAND_FILL
		key.toggle_mode=true
		key.add_theme_stylebox_override("pressed",UIKit.key_style("primary","normal",true))
		key.add_theme_stylebox_override("hover_pressed",UIKit.key_style("primary","hover",true))
		key.pressed.connect(func():switch_cabinet(mode));cabinet_rail.add_child(key);cabinet_buttons[mode]=key
	lists=UIKit.vbox(3);body.add_child(lists)
	detail_panel=UIKit.plate();detail_panel.name="WarehouseDetails";add_child(detail_panel)
	var sc:=ScrollContainer.new();sc.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED
	detail=UIKit.vbox(7);detail.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	var gutter:=MarginContainer.new();gutter.size_flags_horizontal=Control.SIZE_EXPAND_FILL
	gutter.add_theme_constant_override("margin_right",4 if shell.mobile_mode() else 10);gutter.add_child(detail);sc.add_child(gutter);detail_panel.add_child(sc)
	selected=Game.focus_uid if Model.find_inventory(Game.state,Game.focus_uid)!=null else ""
	set_process(true);_refresh();relayout()

func _refresh() -> void:
	var title:String={"warehouse":"手表后仓","materials":"工具材料","isolation":"隔离保管","pawn":"抵押保管"}[cabinet_mode]
	UIKit.clear(storage_header)
	var caption: String="%d × %d · 拖动换位"%[WarehouseExpansion.columns(Game.state),WarehouseExpansion.rows(Game.state)] if cabinet_mode=="warehouse" else "独立仓位 · 点击查看原物"
	if cabinet_mode in ["isolation","pawn"]:
		var used:int=Game.state.inventory.filter(func(it):return it.location==cabinet_mode).size()
		caption="%d / %d 位 · 剩余 %d"%[used,WarehouseExpansion.capacity(Game.state,cabinet_mode),maxi(0,WarehouseExpansion.capacity(Game.state,cabinet_mode)-used)]
	if cabinet_mode=="materials":
		var kinds:int=Game.state.materials.values().filter(func(value):return float(value)>0).size()
		caption="材料 %d / %d 种"%[kinds,WarehouseExpansion.capacity(Game.state,"materials")]
	if shell.mobile_mode():
		title={"warehouse":"后仓","materials":"材料柜","isolation":"隔离柜","pawn":"抵押柜"}[cabinet_mode]
		caption="%d × %d"%[WarehouseExpansion.columns(Game.state),WarehouseExpansion.rows(Game.state)] if cabinet_mode=="warehouse" else caption
		if cabinet_mode in ["isolation","pawn"]:
			var count:int=Game.state.inventory.filter(func(it):return it.location==cabinet_mode).size()
			caption="%d / %d 位"%[count,WarehouseExpansion.capacity(Game.state,cabinet_mode)]
	storage_header.add_child(UIKit.label(title,16 if shell.mobile_mode() else 18,UIKit.AMBER,true,true));storage_header.add_child(UIKit.label(caption,13,UIKit.MUTED,false,true))
	grid.rebuild();_lists();_detail();call_deferred("_resize_panels")

func switch_cabinet(mode: String) -> void:
	if not cabinet_buttons.has(mode):return
	var previous_scroll:ScrollContainer=grid_scroll if cabinet_mode=="warehouse" else cabinet_scroll
	scroll_positions[cabinet_mode]=Vector2(0,previous_scroll.scroll_vertical)
	cabinet_mode=mode
	_refresh()
	var point:Vector2=scroll_positions.get(mode,Vector2.ZERO)
	var active_scroll:ScrollContainer=grid_scroll if mode=="warehouse" else cabinet_scroll
	active_scroll.set_deferred("scroll_vertical",int(point.y))

func relayout() -> void:
	if not is_instance_valid(holder):return
	_resize_panels()

func _resize_panels() -> void:
	if not is_instance_valid(holder):return
	var r:Rect2=shell.content_rect()
	var gap:float=6 if shell.mobile_mode() else PANEL_GAP
	var left_width:float=maxf(114,floorf(r.size.x*(0.21 if shell.mobile_mode() else 0.19)))
	var middle_width:float=r.size.x-left_width-gap if shell.portrait_mode() else r.size.x-left_width-r.size.x*(0.41 if shell.mobile_mode() else 0.31)-gap*2
	cabinet_rail.columns=2 if middle_width<220 else 4
	var available:float=maxf(10,middle_width-holder.get_theme_stylebox("panel").get_minimum_size().x-14)
	var next_cell:float=available/10.0
	if next_cell!=cell_size:
		cell_size=next_cell;grid.rebuild()
		if cabinet_mode=="materials":_build_materials()
		if cabinet_mode in ["isolation","pawn"]:cabinet_grid.rebuild()
	if shell.portrait_mode():
		var top_height:float=r.size.y*0.43
		display_panel.position=r.position;display_panel.size=Vector2(left_width,top_height)
		holder.position=r.position+Vector2(left_width+gap,0);holder.size=Vector2(r.size.x-left_width-gap,top_height)
		detail_panel.position=r.position+Vector2(0,top_height+gap);detail_panel.size=Vector2(r.size.x,r.size.y-top_height-gap)
	else:
		var detail_width:float=r.size.x*(0.41 if shell.mobile_mode() else 0.31)
		var middle:float=r.size.x-left_width-detail_width-gap*2
		display_panel.position=r.position;display_panel.size=Vector2(left_width,r.size.y)
		holder.position=r.position+Vector2(left_width+gap,0);holder.size=Vector2(middle,r.size.y)
		detail_panel.position=r.position+Vector2(left_width+middle+gap*2,0);detail_panel.size=Vector2(detail_width,r.size.y)
	var content_height:float=grid.custom_minimum_size.y if cabinet_mode=="warehouse" else cabinet_scroll.get_child(0).get_combined_minimum_size().y
	var frame_height:float=holder.get_theme_stylebox("panel").get_minimum_size().y+maxf(storage_header.get_combined_minimum_size().y,expand_button.get_combined_minimum_size().y)+cabinet_rail.get_combined_minimum_size().y+24+lists.get_combined_minimum_size().y
	holder.size.y=minf(holder.size.y,content_height+frame_height)
	var target_columns:=2 if shell.mobile_mode() else 4
	if display_grid.columns!=target_columns:display_grid.rebuild()
	var display_body:Control=display_panel.get_child(0)
	var display_frame:float=display_panel.get_theme_stylebox("panel").get_minimum_size().y+display_count.get_combined_minimum_size().y+display_body.get_child(2).get_combined_minimum_size().y+12
	display_panel.size.y=minf(display_panel.size.y,display_grid.get_combined_minimum_size().y+display_frame)

func _lists() -> void:
	var shown:Array=Game.state.inventory.filter(func(it):return it.location=="display")
	display_count.text="展示柜 %d / %d"%[shown.size(),WarehouseExpansion.capacity(Game.state,"display")]
	display_grid.rebuild()
	grid_scroll.visible=cabinet_mode=="warehouse";cabinet_scroll.visible=cabinet_mode!="warehouse"
	cabinet_grid.visible=cabinet_mode in ["isolation","pawn"];materials_view.visible=cabinet_mode in ["materials","pawn"]
	if cabinet_grid.visible:
		cabinet_grid.location=cabinet_mode;cabinet_grid.rebuild()
	UIKit.clear(materials_view)
	if cabinet_mode=="materials":
		_build_materials()
	if cabinet_mode=="pawn":
		var purchase=load("res://scripts/ui/pawn_slot_purchase.gd").new();materials_view.add_child(purchase);purchase.setup()
	for mode in cabinet_buttons:
		cabinet_buttons[mode].set_pressed_no_signal(mode==cabinet_mode)
	UIKit.clear(lists);_document_inventory()

func _build_materials() -> void:
	UIKit.clear(materials_view)
	var slots:=GridContainer.new();slots.name="MaterialSlots";slots.columns=10
	slots.add_theme_constant_override("h_separation",0);slots.add_theme_constant_override("v_separation",0)
	materials_view.add_child(slots)
	var materials:Array=GameData.materials.filter(func(m):return float(Game.state.materials.get(m.id,0))>0)
	for i in WarehouseExpansion.capacity(Game.state,"materials"):
		var slot:=PanelContainer.new();slot.custom_minimum_size=Vector2(cell_size,cell_size)
		var style:=StyleBoxFlat.new();style.bg_color=Color("172124");style.border_color=Color("0b1214")
		style.set_border_width_all(2);slot.add_theme_stylebox_override("panel",style);slots.add_child(slot)
		if i>=materials.size():continue
		var m:Dictionary=materials[i];var count:String=Model.jnum(Game.state.materials.get(m.id,0))
		slot.tooltip_text="%s ×%s"%[m.name,count]
		var picture:=TextureRect.new();picture.texture=material_texture(String(m.id));picture.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
		picture.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED;picture.mouse_filter=Control.MOUSE_FILTER_IGNORE
		picture.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST;slot.add_child(picture)
		var quantity:=UIKit.label(count,maxi(10,mini(14,int(cell_size*0.3))),UIKit.TEXT)
		quantity.clip_text=true
		quantity.horizontal_alignment=HORIZONTAL_ALIGNMENT_RIGHT;quantity.vertical_alignment=VERTICAL_ALIGNMENT_BOTTOM
		quantity.mouse_filter=Control.MOUSE_FILTER_IGNORE;slot.add_child(quantity)
	materials_view.add_child(UIKit.label("检验工具：放大镜 · 紫外线 · 称重",13,UIKit.MUTED,false,true))

func material_texture(id: String) -> AtlasTexture:
	var texture:=AtlasTexture.new();texture.atlas=UIKit.tex("res://assets/ui/materials.png")
	var index:=clampi(int(id.trim_prefix("MAT-"))-1,0,12);var cell:Vector2=texture.atlas.get_size()/4.0
	texture.region=Rect2(Vector2(index%4,index/4)*cell,cell)
	return texture

func store_original(uid: String,location: String,point: Variant=null,rotated: Variant=null) -> void:
	var action:Dictionary={"type":"STORE_ITEM","uid":uid,"location":location}
	if point!=null:action.merge({"x":int(point.x),"y":int(point.y)})
	if rotated!=null:action.rotated=rotated
	Game.dispatch(action)

func begin_cabinet_drag(uid: String) -> void:
	cabinet_drag_uid=uid
	cabinet_drag_preview=TextureRect.new()
	cabinet_drag_preview.texture=UIKit.physical_icon(Game.item(uid))
	cabinet_drag_preview.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
	cabinet_drag_preview.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	cabinet_drag_preview.size=Vector2(48,64)
	cabinet_drag_preview.mouse_filter=Control.MOUSE_FILTER_IGNORE
	cabinet_drag_preview.modulate.a=0.8
	cabinet_drag_preview.z_index=200
	add_child(cabinet_drag_preview)

func update_cabinet_drag(point: Vector2) -> void:
	if is_instance_valid(cabinet_drag_preview):cabinet_drag_preview.position=point-Vector2(24,32)

func finish_cabinet_drag(uid: String,point: Vector2) -> void:
	cabinet_drag_uid=""
	if is_instance_valid(cabinet_drag_preview):cabinet_drag_preview.queue_free()
	if grid_scroll.visible and warehouse_drop_rect().has_point(point):
		var local:Vector2=grid.get_global_transform_with_canvas().affine_inverse()*point
		store_original(uid,"warehouse",grid._cell(local))
	elif cabinet_content_rect(display_scroll,display_grid).has_point(point):store_original(uid,"display")
	elif cabinet_scroll.visible and cabinet_mode=="isolation" and cabinet_content_rect(cabinet_scroll,cabinet_grid).has_point(point):store_original(uid,"isolation")

func cabinet_content_rect(scroller: ScrollContainer,contents: Control) -> Rect2:
	var box:=scroller.get_global_rect()
	if scroller.get_v_scroll_bar().visible:box.size.x-=scroller.get_v_scroll_bar().size.x
	if scroller.get_h_scroll_bar().visible:box.size.y-=scroller.get_h_scroll_bar().size.y
	return box.intersection(contents.get_global_rect())

func warehouse_drop_rect() -> Rect2:
	return cabinet_content_rect(grid_scroll,grid)

func _process(delta: float) -> void:
	if grid==null:return
	var manual:bool=grid.drag_uid!="" and grid.moved
	if not manual and cabinet_drag_uid=="":return
	var pointer:=get_global_mouse_position()
	for scroller in [grid_scroll,display_scroll,cabinet_scroll]:
		if not scroller.visible or not scroller.get_global_rect().has_point(pointer):continue
		var box:Rect2=scroller.get_global_rect()
		if pointer.x<box.position.x+24:scroller.scroll_horizontal-=ceili(180*delta)
		elif pointer.x>box.end.x-24:scroller.scroll_horizontal+=ceili(180*delta)
		if pointer.y<box.position.y+24:scroller.scroll_vertical-=ceili(180*delta)
		elif pointer.y>box.end.y-24:scroller.scroll_vertical+=ceili(180*delta)
	if manual:grid._update_ghost(grid.get_local_mouse_position())

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
	for y in ShopUpgrades.storage_rows(Game.state):
		for x in WarehouseExpansion.columns(Game.state):
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
	var b := UIKit.button(text, kind, Vector2(0, 44), 15 if shell.mobile_mode() else 17)
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
	var head := UIKit.hbox(8 if shell.mobile_mode() else 14)
	var pic := TextureRect.new()
	pic.texture = UIKit.physical_icon(it)
	pic.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	pic.custom_minimum_size = Vector2(48,64) if shell.mobile_mode() else Vector2(120,120)
	pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	UIKit.decorate_item(pic, it, 22.0)
	head.add_child(pic)
	var hv := UIKit.vbox(4)
	hv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hv.add_child(UIKit.label(def.name, 26, UIKit.INK, false, true))
	hv.add_child(UIKit.label("型号档次：%s" % GameData.tier_label(it.defId), 17, UIKit.RUST,false,true))
	if UIKit.presentation_id(it) != String(it.defId):
		hv.add_child(UIKit.label("外观档次：%s · 改装外壳" % GameData.tier_label(UIKit.presentation_id(it)), 17, UIKit.RUST,false,true))
	if UIKit.is_modified(it):
		hv.add_child(UIKit.label("改 · 已加工", 17, UIKit.RUST))
	if UIKit.presentation_tier(it) in ["luxury","ultra"]:
		var distinction := UIKit.hbox(8)
		distinction.add_child(UIKit.tier_badge(UIKit.presentation_id(it)))
		var distinction_text := UIKit.label("珍稀型号 · 穹铸工艺" if UIKit.presentation_tier(it)=="ultra" else "名贵型号 · 金饰徽章", 16, UIKit.RUST,false,true)
		distinction_text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		distinction.add_child(distinction_text)
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
	var preview: Button
	if shell.mobile_mode():
		preview = UIKit.button("%s\n品相 %s · 展开物品档案" % [def.name,UIKit.pct(it.condition)],"secondary",Vector2(0,52),16)
		preview.toggle_mode = true
		detail.add_child(preview)
		docket.hide()
		preview.toggled.connect(func(open: bool):
			docket.visible = open
			detail.move_child(docket,preview.get_index()+(1 if open else 2))
			preview.text = "%s\n品相 %s · %s物品档案" % [def.name,UIKit.pct(it.condition),"收起" if open else "展开"])
	detail.add_child(docket)
	if not shell.mobile_mode(): detail.add_child(UIKit.module_header("出入库操作", "按保管权属办理", "CONTROL"))
	var g := UIKit.grid(2, 10)
	if t != null and (t.kind == "sell" or CounterDialogue.active(s)) and it.owner == "shop":
		if not TradeSession.session(s).is_empty():
			var problem := TradeSession._stock_problem(s,it,"sell")
			var batch_uid: String=it.uid
			_act(g,"灰色收售" if not it.sourceVerified else "推荐给顾客","danger" if not it.sourceVerified else "primary",func():
				if CounterDialogue.active(Game.state):
					if Game.dispatch({"type":"SELECT_TRADE","uid":batch_uid}): shell.go("counter")
				elif Game.dispatch({"type":"TRADE_ADD","tradeId":t.id,"uid":batch_uid,"direction":"sell"}):
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
	# Rotation substitutes for right-click on phones, so keep it with common actions.
	_act(g, "旋转方向", "chip", func(): rotate_selected(), can_rotate_selected(), "" if can_rotate_selected() else "需要后仓里有能容纳旋转后形状的空位")
	_act(g, "去鉴定", "secondary", func(): shell.go("inspect", it.uid))
	_act(g, "去维修", "secondary", func(): shell.go("repair", it.uid))
	var common_actions := g
	detail.add_child(common_actions)
	detail.add_child(UIKit.module_header("调价与来源", "扫描、登记及保管操作", "RECORDS"))
	g = UIKit.grid(2,10)
	var quote_problem := StoreCosts.device_problem(s, "quote_terminal")
	var price_ok: bool = it.owner == "shop" and not it.has("orderId") and not reserved and quote_problem == ""
	if quote_problem != "": detail.add_child(UIKit.label(quote_problem, 16, UIKit.DANGER, false, true))
	_act(g, "挂牌 −10", "chip", {"type": "PRICE", "uid": it.uid, "price": maxf(1, it.listPrice - 10)}, price_ok and it.listPrice > 1, quote_problem)
	_act(g, "挂牌 +10", "chip", {"type": "PRICE", "uid": it.uid, "price": it.listPrice + 10}, price_ok, quote_problem)
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
	if it.owner == "shop":
		var forge_why := Commerce.forgery_problem(s, it)
		var forge_uid: String = it.uid
		_act(g, "送到修表台 · 加工", "danger", func(): _open_forgery(forge_uid), forge_why == "", forge_why)

	if it.owner == "pawn":
		_act(g, "客人赎回", "good", {"type": "REDEEM", "uid": it.uid})
	var relief := false
	for r in s.ledger:
		if r.kind in ["relief-window","rent-relief"] and r.day == s.day:
			relief = true
	var item_name: String = def.name
	var uid: String = it.uid
	if relief:
		var clearance_price := maxi(1,floori(float(def.value)*float(Model.sale_appearance(it).condition)*0.45))
		_act(g, "应急清仓 · %d Cr" % clearance_price, "danger", func():
			shell.confirm("应急清仓", "「%s」将按清仓价 %d Cr 立即卖出。" % [item_name,clearance_price], "确认清仓", func():
				Game.dispatch({"type": "EMERGENCY_SALE", "uid": uid})))
	var return_text := "原物会移交原主并从库存移除，不能撤回。"
	if it.owner == "shop":
		return_text = "这是店铺花 %s 收来的货。归还后不会退款，原物从库存移除，不能撤回。" % UIKit.money(it.cost)
	if not known_crime:
		_act(g, "主动归还原主", "danger", func():
			shell.confirm("主动归还原主", "「%s」：%s" % [item_name, return_text], "确认归还", func():
				Game.dispatch({"type": "RETURN_ITEM", "uid": uid})), it.owner != "pawn" and not reserved, "正在柜台交易中" if reserved else "")
	detail.add_child(g)
	if shell.mobile_mode(): detail.move_child(common_actions,preview.get_index()+1)
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
	detail.add_child(UIKit.label("工具材料已移至后仓右侧「材料」按钮。",14,UIKit.MUTED,false,true))

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
	var scroll_touch_x := 0.0

	func cursor_at(at_position: Vector2) -> int:
		if drag_uid != "":
			return Input.CURSOR_DRAG
		return Input.CURSOR_CAN_DROP if _uid_at(at_position) != "" else Input.CURSOR_ARROW

	func rebuild() -> void:
		custom_minimum_size = Vector2(page.cell_size * WarehouseExpansion.columns(Game.state), page.cell_size * ShopUpgrades.storage_rows(Game.state))
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
			tr.position = Vector2(it.x, it.y) * page.cell_size + Vector2(4, 4)
			tr.size = Vector2(d[0], d[1]) * page.cell_size - Vector2(8, 8)
			UIKit.decorate_item(tr, it, 20.0)
			add_child(tr)
			tiles[it.uid] = tr
		queue_redraw()

	func _cell(p: Vector2) -> Vector2i:
		return Vector2i(floori(p.x / page.cell_size), floori(p.y / page.cell_size))

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
				scroll_touch_x = (get_global_transform_with_canvas() * touch.position).x
				accept_event()
			elif not touch.pressed and touch.index == scroll_touch:
				scroll_touch = -1
				accept_event()
			return
		if e is InputEventScreenDrag and (e as InputEventScreenDrag).index == scroll_touch:
			var drag := e as InputEventScreenDrag
			var current_y := (get_global_transform_with_canvas() * drag.position).y
			var current_x := (get_global_transform_with_canvas() * drag.position).x
			var scroller:ScrollContainer=page.grid_scroll
			scroller.scroll_vertical -= roundi(current_y - scroll_touch_y)
			scroll_touch_x = current_x
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
					drag_offset = mb.position - Vector2(it.x, it.y) * page.cell_size
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
				elif page.cabinet_content_rect(page.display_scroll,page.display_grid).has_point(get_global_transform_with_canvas()*mb.position):
					page.store_original(uid,"display")
				elif not page.warehouse_drop_rect().has_point(get_global_transform_with_canvas()*mb.position):
					page.shell.toast("未放入可见仓格，原物已保留原位。")
				else:
					var tl: Vector2 = ((mb.position - drag_offset) / page.cell_size).round()
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
				ghost.texture = UIKit.physical_icon(Game.item(drag_uid))
				ghost.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
				ghost.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
				ghost.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
				ghost.mouse_filter = Control.MOUSE_FILTER_IGNORE
				ghost.modulate = Color(1, 1, 1, 0.85)
				UIKit.decorate_item(ghost, Game.item(drag_uid), 20.0)
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
		ghost.size = Vector2(d[0], d[1]) * page.cell_size - Vector2(8, 8)
		ghost.position = pos - drag_offset + Vector2(4, 4)
		queue_redraw()

	func _draw() -> void:
		var cs: float = page.cell_size
		draw_rect(Rect2(Vector2.ZERO, size), Color(0.03, 0.05, 0.06, 0.88))
		for y in ShopUpgrades.storage_rows(Game.state):
			for x in WarehouseExpansion.columns(Game.state):
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
