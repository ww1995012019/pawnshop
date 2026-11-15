extends Button
## Physical slot with native Godot drag/drop and canonical UID payloads.
var showroom
var location := "warehouse"
var slot := -1
var uid := ""

func _get_drag_data(_point: Vector2):
 if showroom==null or not showroom.allowed() or Game.state.trade!=null or not showroom.available(Game.item(uid)): return null
 var picture:=TextureRect.new()
 picture.texture=UIKit.physical_icon(Game.item(uid))
 picture.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
 picture.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
 picture.size=Vector2(100,100)
 picture.position=-picture.size*.5
 picture.modulate=Color(1.1,1.06,.95,.9)
 var holder:=Control.new()
 holder.add_child(picture)
 set_drag_preview(holder)
 return {"kind":"showroom_original","uid":uid}

func _can_drop_data(_point: Vector2, data) -> bool:
 return showroom!=null and showroom.can_place(data,location,slot)

func _drop_data(_point: Vector2, data) -> void:
 if _can_drop_data(_point,data): showroom.place_original(str(data.uid),location,slot)
