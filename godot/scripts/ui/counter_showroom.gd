extends Control
## PC physical showroom. Every visual references an existing inventory UID.
## A lifted original retains its storage address until a real trade/move commits.
var desk
var selected_uid := ""
var preview_tween: Tween
var preview: TextureRect
var preview_back := false
var flip_tween: Tween
var preview_pad: Panel
var tray: HBoxContainer
var details: PanelContainer
var info: VBoxContainer
var signature := ""
var stock_page := 0
var paging: HBoxContainer
const Layout = preload("res://scripts/model/showroom_layout.gd")

class LiftedWatch extends TextureRect:
 var showroom
 func _get_drag_data(_point: Vector2):
  if showroom==null or not showroom.allowed() or not showroom.available(Game.item(showroom.selected_uid)): return null
  var ghost:=TextureRect.new()
  ghost.texture=texture;ghost.expand_mode=TextureRect.EXPAND_IGNORE_SIZE;ghost.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
  ghost.size=Vector2(100,100);ghost.position=-ghost.size*.5
  var holder:=Control.new();holder.add_child(ghost);set_drag_preview(holder)
  return {"kind":"showroom_original","uid":showroom.selected_uid}

func setup(page) -> void:
 desk = page
 name = "CounterShowroom"
 mouse_filter = Control.MOUSE_FILTER_IGNORE
 set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
 tray = UIKit.hbox(10)
 tray.position = Vector2(600,650)
 tray.size = Vector2(650,126)
 add_child(tray)
 paging=UIKit.hbox(6)
 paging.position=Vector2(600,805)
 add_child(paging)
 preview_pad = Panel.new()
 preview_pad.position = Vector2(1080,642)
 preview_pad.size = Vector2(190,166)
 preview_pad.add_theme_stylebox_override("panel",desk._flat(Color("344e43"),Color("ad9260"),8))
 preview_pad.mouse_filter = Control.MOUSE_FILTER_IGNORE
 add_child(preview_pad)
 preview = LiftedWatch.new()
 preview.showroom = self
 preview.name = "LiftedOriginal"
 preview.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
 preview.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
 preview.position = Vector2(1100,650)
 preview.size = Vector2(150,150)
 preview.pivot_offset = Vector2(75,75)
 preview.mouse_filter = Control.MOUSE_FILTER_STOP
 preview.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
 preview.tooltip_text = "点击翻面 · 使用右侧工具检查细节"
 preview.gui_input.connect(func(event):
  if event is InputEventMouseButton and not event.pressed and not get_viewport().gui_is_dragging() and event.button_index in [MOUSE_BUTTON_LEFT,MOUSE_BUTTON_RIGHT]:
   flip_original()
   preview.accept_event())
 add_child(preview)
 details = UIKit.plate(desk._flat(Color("302832"),Color("ad9260"),12))
 details.position = Vector2(1375,170)
 details.size = Vector2(480,500)
 add_child(details)
 info = UIKit.vbox(8)
 details.add_child(info)
 refresh()

func available(it) -> bool:
 return it != null and Model.owns(it) and not it.sealed and it.location in ["warehouse","display"] and not it.has("orderId") and not it.get("service",{}).get("opened",false)

func allowed() -> bool:
 return is_visible_in_tree() and not desk.busy and not desk._scene_blocked()

func _set_cabinet_enabled(node: Node, enabled: bool) -> void:
 for child in node.get_children():
  if child is Button: child.disabled = not enabled or child.get_meta("held_original",false)
  _set_cabinet_enabled(child,enabled)

func select_original(uid: String) -> void:
 if not allowed() or Game.state.trade != null: return
 if not available(Game.item(uid)):
  desk.shell.toast("受托、隔离、封存或正在维修的手表不能取出。")
  return
 if Game.dispatch({"type":"COUNTER_PREVIEW","uid":uid}):
  desk.shell.sound("click",-10)
  refresh()

func return_original() -> void:
 if not allowed(): return
 var uid := selected_uid
 if uid == "": return
 if is_instance_valid(preview_tween): preview_tween.kill()
 if not Game.prefs.reduced_motion:
  var ghost := TextureRect.new()
  ghost.texture = preview.texture
  ghost.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
  ghost.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
  ghost.position = preview.position
  ghost.size = preview.size
  ghost.mouse_filter = Control.MOUSE_FILTER_IGNORE
  add_child(ghost)
  var it = Game.item(uid)
  var dest := Vector2(310,320) if it != null and it.location=="display" else Vector2(780,530)
  var tw := create_tween().set_parallel(true)
  tw.tween_property(ghost,"position",dest,.28).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN_OUT)
  tw.tween_property(ghost,"modulate:a",0.0,.28)
  tw.chain().tween_callback(ghost.queue_free)
 Game.dispatch({"type":"COUNTER_PREVIEW","uid":""})
 desk.shell.sound("drop",-10)
 refresh()

func flip_original() -> void:
 if not allowed() or selected_uid=="" or not available(Game.item(selected_uid)): return
 if is_instance_valid(flip_tween) and flip_tween.is_running(): return
 var it = Game.item(selected_uid)
 preview_back = not preview_back
 if Game.prefs.reduced_motion:
  preview.texture = UIKit.physical_icon(it,preview_back)
 else:
  flip_tween = create_tween()
  flip_tween.tween_property(preview,"scale:x",.03,.12).set_trans(Tween.TRANS_SINE)
  flip_tween.tween_callback(func():
   var original = Game.item(selected_uid)
   if original != null: preview.texture = UIKit.physical_icon(original,preview_back))
  flip_tween.tween_property(preview,"scale:x",1.0,.16).set_trans(Tween.TRANS_SINE)
 desk.shell.sound("page",-12)

func open_tool(tool_id: String) -> void:
 if not allowed() or selected_uid=="" or not available(Game.item(selected_uid)): return
 desk.shell.go("inspect",selected_uid)
 var workspace = desk.shell.workspace_shell
 if is_instance_valid(workspace) and workspace.page != null:
  workspace.page.call_deferred("_set_tool",tool_id)

func _button(text: String, fn: Callable, primary := false) -> Button:
 var key := UIKit.button(text,"primary" if primary else "secondary",Vector2(0,36),17)
 key.pressed.connect(fn)
 info.add_child(key)
 return key

func refresh() -> void:
 if desk == null: return
 var idle: bool = Game.state.trade == null and not desk.busy
 var uid: String = str(Game.state.get("counterPreviewUid","")) if idle else ""
 var it = Game.item(uid) if uid!="" else null
 if not available(it): uid="";it=null
 var changed := uid != selected_uid
 selected_uid = uid
 tray.visible = idle
 preview.visible = uid!=""
 preview_pad.visible = uid!=""
 if changed:
  if is_instance_valid(flip_tween): flip_tween.kill()
  preview_back = false
  preview.scale = Vector2.ONE
 details.visible = uid!=""
 if idle and not desk.shell.mobile_mode():
  desk.idle_label.visible = false
  desk.idle_jobs.visible = uid==""
 _set_cabinet_enabled(desk.display_goods,true)
 var rows: Array = Game.state.inventory.filter(func(original):return available(original) and original.location=="warehouse")
 var next_signature: String = JSON.stringify([uid,rows,Game.state.get("showroomLayout",{}),Game.state.trade!=null,stock_page])
 if next_signature != signature:
  signature = next_signature
  UIKit.clear(tray)
  UIKit.clear(paging)
  var limit := 4 if uid!="" else 6
  var mapping: Dictionary=Game.state.get("showroomLayout",{}).get("warehouse",{})
  var highest:=0
  for value in mapping.values(): highest=maxi(highest,int(value))
  var pages:=maxi(1,ceili(float(highest+2)/limit))
  stock_page=clampi(stock_page,0,pages-1)
  for index in range(stock_page*limit,mini((stock_page+1)*limit,Layout.capacity(Game.state,"warehouse"))):
   var original=Model.find_inventory(Game.state,Layout.uid_at(Game.state,"warehouse",index))
   var key: Button=desk._stock_slot(original,false,true) if original!=null else empty_slot("warehouse",index,Vector2(90,102))
   key.custom_minimum_size=Vector2(90,102)
   key.vertical_icon_alignment=VERTICAL_ALIGNMENT_TOP
   var felt: StyleBoxFlat=desk._flat(Color("344e43"),Color("a89569"),6)
   felt.set_corner_radius_all(7)
   felt.shadow_color=Color(0,0,0,.3);felt.shadow_size=3;felt.shadow_offset=Vector2(0,4)
   key.add_theme_stylebox_override("normal",felt)
   if original!=null and original.uid==uid:
    key.icon=null;key.text="鉴定中";key.disabled=true
   tray.add_child(key)
  for step in [-1,1]:
   var key:=UIKit.button("上一排" if step<0 else "下一排","chip",Vector2(74,26),14)
   key.disabled=stock_page==0 if step<0 else stock_page>=pages-1
   key.pressed.connect(func():
    if allowed(): stock_page+=step;signature="";refresh())
   paging.add_child(key)
  paging.add_child(UIKit.label("%d / %d · 拖动换位 / 拖入陈列柜" % [stock_page+1,pages],14,UIKit.MUTED))
 paging.visible=idle
 if it == null: return
 preview.texture = UIKit.physical_icon(it,preview_back)
 if changed:
  if is_instance_valid(preview_tween): preview_tween.kill()
  preview.position = Vector2(1100,650)
  preview.modulate.a = 1.0
  if not Game.prefs.reduced_motion:
   preview.position = Vector2(310,320) if it.location=="display" else Vector2(770,520)
   preview.modulate.a = .3
   preview_tween = create_tween().set_parallel(true)
   preview_tween.tween_property(preview,"position",Vector2(1100,650),.34).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
   preview_tween.tween_property(preview,"modulate:a",1.0,.2)
 UIKit.clear(info)
 info.add_child(UIKit.label(WatchForgery.sale_name(it),21,UIKit.AMBER,false,true))
 info.add_child(UIKit.label("品相 %s · 物证 %d" % [UIKit.pct(it.condition),Model.evidence_count(it)],16,UIKit.MUTED))
 for spec in [["放大镜 · 查看标识","TOL-001"],["紫外灯 · 核对编号","TOL-002"],["电子秤 · 称量手表","TOL-005"]]:
  var id: String = spec[1]
  var key := _button(spec[0],func():open_tool(id))
  key.icon = UIKit.tool_icon(id)
  key.expand_icon = true
  key.add_theme_constant_override("icon_max_width",24)
 _button("放回原位",return_original,true)
 _button("上架陈列柜" if it.location=="warehouse" else "从陈列柜下架",func():
  move_selected("display" if it.location=="warehouse" else "warehouse"))
 _button("整理 / 调价",func():
  if allowed(): desk.shell.go("warehouse",selected_uid))

func empty_slot(location: String,index: int,extent: Vector2) -> Button:
 var key=preload("res://scripts/ui/showroom_slot.gd").new()
 key.showroom=self;key.location=location;key.slot=index
 key.name="showroom_empty_%s_%d"%[location,index]
 key.custom_minimum_size=extent
 key.text="" if location=="display" else "＋"
 key.add_theme_font_size_override("font_size",18)
 key.add_theme_color_override("font_color",Color("9caa8d"))
 key.add_theme_stylebox_override("normal",desk._flat(Color.TRANSPARENT) if location=="display" else desk._flat(Color(0.12,.2,.18,.2),Color(.6,.65,.5,.25),2))
 if location=="display":
  for style in ["hover","pressed","focus","disabled"]:
   key.add_theme_stylebox_override(style,StyleBoxEmpty.new())
 key.tooltip_text="空展位 · 将手表拖到这里" if location=="display" else "空托盘 · 将手表拖到这里"
 key.pressed.connect(func():
  if selected_uid!="": place_original(selected_uid,location,index))
 return key

func can_place(data,location: String,index: int) -> bool:
 if not allowed() or Game.state.trade!=null or not data is Dictionary: return false
 if data.get("kind","")!="showroom_original" or not available(Game.item(str(data.get("uid","")))): return false
 if location not in ["warehouse","display"] or index<0 or index>=Layout.capacity(Game.state,location): return false
 return true

func place_original(uid: String,location: String,index: int) -> void:
 if not can_place({"kind":"showroom_original","uid":uid},location,index): return
 var original=Game.item(uid)
 var texture: Texture2D=UIKit.physical_icon(original)
 var from:=get_local_mouse_position()
 if selected_uid==uid: from=preview.position+preview.size*.5
 Game.dispatch({"type":"SHOWROOM_PLACE","uid":uid,"location":location,"slot":index})
 if Game.item(uid)==null or Game.item(uid).location!=location or int(Game.state.get("showroomLayout",{}).get(location,{}).get(uid,-1))!=index: return
 if selected_uid==uid: Game.dispatch({"type":"COUNTER_PREVIEW","uid":""})
 desk.shell.sound("drop",-10)
 refresh()
 if Game.prefs.reduced_motion: return
 var ghost:=TextureRect.new()
 ghost.texture=texture;ghost.expand_mode=TextureRect.EXPAND_IGNORE_SIZE;ghost.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
 ghost.size=Vector2(84,84);ghost.position=from-ghost.size*.5;ghost.mouse_filter=Control.MOUSE_FILTER_IGNORE
 add_child(ghost)
 var target: Control=desk.display_goods.find_child("stock_recommend_"+uid,true,false) if location=="display" else tray.find_child("stock_recommend_"+uid,true,false)
 var dest: Vector2=get_global_transform().affine_inverse()*(target.get_global_rect().get_center())-ghost.size*.5 if target!=null else ghost.position
 var tw:=create_tween().set_parallel(true)
 tw.tween_property(ghost,"position",dest,.24).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
 tw.tween_property(ghost,"modulate:a",0.0,.24)
 tw.chain().tween_callback(ghost.queue_free)

func move_selected(location: String) -> void:
 if selected_uid=="" or not allowed(): return
 for index in Layout.capacity(Game.state,location):
  if Layout.uid_at(Game.state,location,index)=="":
   place_original(selected_uid,location,index)
   return
 desk.shell.toast("没有空位，请先整理陈列或仓储。")
