extends GridContainer
## Independent cabinet slots. Drag payloads always identify the original UID.
var page
var location := "display"
var cell_size := 48.0

func setup(owner_page,kind: String) -> void:
 page=owner_page;location=kind
 size_flags_horizontal=Control.SIZE_EXPAND_FILL
 add_theme_constant_override("h_separation",4);add_theme_constant_override("v_separation",4)
 rebuild()

func rebuild() -> void:
 UIKit.clear(self)
 columns=2 if page.shell.mobile_mode() else 4
 cell_size=36 if page.shell.mobile_mode() else 48
 var items:Array=Game.state.inventory.filter(func(it):return it.location==location)
 var limit:=WarehouseExpansion.capacity(Game.state,location)
 # Long purchased safe capacity need not allocate thousands of empty controls.
 var shown:=mini(limit,300)
 for i in maxi(items.size(),shown):
  var key=Slot.new()
  key.cabinet=self
  key.custom_minimum_size=Vector2(cell_size,cell_size)
  key.size_flags_horizontal=Control.SIZE_EXPAND_FILL
  key.add_theme_stylebox_override("normal",UIKit.key_style("secondary","normal",true))
  key.add_theme_stylebox_override("hover",UIKit.key_style("primary","hover",true))
  if i<items.size():
   var it:Dictionary=items[i]
   key.uid=it.uid;key.icon=UIKit.physical_icon(it);key.expand_icon=true
   key.texture_filter=CanvasItem.TEXTURE_FILTER_NEAREST
   key.tooltip_text=GameData.def(it.defId).name+" · "+it.uid
   UIKit.decorate_item(key,it,12)
   key.pressed.connect(func():page.select(it.uid))
   if page.selected==it.uid:key.add_theme_stylebox_override("normal",UIKit.key_style("primary","normal",true))
  else:key.tooltip_text="空仓位 · 可拖入符合条件的原表"
  add_child(key)

func _can_drop_data(_position: Vector2,data: Variant) -> bool:
 return data is Dictionary and data.get("kind","")=="warehouse-original" and location in ["display","isolation"]
func _drop_data(_position: Vector2,data: Variant) -> void:
 page.store_original(String(data.uid),location)

class Slot extends Button:
 var uid := ""
 var cabinet
 var press_point:=Vector2.ZERO
 var held:=false
 var dragging:=false
 func _gui_input(event: InputEvent) -> void:
  if uid=="":return
  if event is InputEventMouseButton and event.button_index==MOUSE_BUTTON_LEFT:
   if event.pressed:
    held=true;dragging=false;press_point=event.position
   elif held:
    held=false
    if dragging:
     dragging=false
     cabinet.page.finish_cabinet_drag(uid,get_global_transform_with_canvas()*event.position)
     accept_event()
  elif event is InputEventMouseMotion and held:
   if not dragging and event.position.distance_to(press_point)>6:
    dragging=true;cabinet.page.begin_cabinet_drag(uid)
   if dragging:
    cabinet.page.update_cabinet_drag(get_global_transform_with_canvas()*event.position)
    accept_event()
