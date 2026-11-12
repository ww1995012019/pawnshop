extends Node2D
## A view of the visit's canonical originals. Focusing never replaces a sprite.
var sprites: Dictionary={}
var cards: Dictionary={}
var origins: Dictionary={}
var presentation_rect := Rect2()
const MODEL_RECT := Rect2(670,480,640,180)
func display_point(point: Vector2) -> Vector2:
 if presentation_rect.size == Vector2.ZERO: return point
 return presentation_rect.position + (point-MODEL_RECT.position)/MODEL_RECT.size*presentation_rect.size
func model_point(point: Vector2) -> Vector2:
 if presentation_rect.size == Vector2.ZERO: return point
 return MODEL_RECT.position + (point-presentation_rect.position)/presentation_rect.size*MODEL_RECT.size


class DeskCard extends Node2D:
 var caption:=""
 var note:=""
 var focused:=false
 var agreed:=false
 var refused:=false
 var visitor:=false
 var width:=102.0
 var item_marks: Control
 func show_item_marks(it: Dictionary) -> void:
  if item_marks==null:
   item_marks=Control.new();item_marks.mouse_filter=Control.MOUSE_FILTER_IGNORE;add_child(item_marks)
  item_marks.position=Vector2(-width/2,-35)
  item_marks.size=Vector2(width,64)
  UIKit.decorate_item(item_marks,it,18.0,false)
 func area() -> Rect2: return Rect2(Vector2(-width/2,-35),Vector2(width,98))
 func _draw() -> void:
  var edge:=Color("f2c27b") if focused else Color("83b7a0") if agreed else Color("b77e65") if refused else Color("65765d")
  draw_style_box(_paper(edge),Rect2(-width/2,33,width,30))
  if focused:
   draw_rect(Rect2(-width/2,33,width,30),edge,false,2)
   draw_colored_polygon(PackedVector2Array([Vector2(-5,-40),Vector2(5,-40),Vector2(0,-35)]),edge)
  draw_string(UIKit.font,Vector2(-width/2+5,46),caption,HORIZONTAL_ALIGNMENT_LEFT,width-10,16,Color("302c27"))
  draw_string(UIKit.font,Vector2(-width/2+5,60),note,HORIZONTAL_ALIGNMENT_LEFT,width-10,13,Color("8c482d") if refused else Color("315547"))
 func _paper(edge: Color) -> StyleBoxFlat:
  var style:=StyleBoxFlat.new();style.bg_color=Color("dfcfaa");style.border_color=edge;style.set_border_width_all(1);return style

func sync(state: Dictionary, animate:=false, from:=Vector2.ZERO) -> void:
 var shown:=CounterDialogue.table_items(state)
 var keep: Array=[]
 var vi:=0;var pi:=0
 var visitor_count: int=shown.filter(func(entry):return entry.direction=="buy").size()
 var player_count: int=shown.size()-visitor_count
 for info in shown:
  var uid: String=info.uid
  var original=TradeSession.item(state,uid)
  if original==null: continue
  keep.append(uid)
  var visitor: bool=info.direction=="buy"
  var index:=vi if visitor else pi
  if visitor: vi+=1
  else: pi+=1
  var side_count := visitor_count if visitor else player_count
  var slots := CounterDialogue._table_slots(info.direction,side_count)
  var default_position: Vector2=slots[mini(index,slots.size()-1)]
  var saved=TradeSession.session(state).get("table_positions",{}).get(uid,[])
  var pos:=Vector2(float(saved[0]),float(saved[1])) if saved is Array and saved.size()==2 else default_position
  pos=display_point(pos)
  if presentation_rect.size != Vector2.ZERO and shown.size()==1 and not (saved is Array and saved.size()==2):
   pos=presentation_rect.get_center()

  var mobile := presentation_rect.size != Vector2.ZERO
  var height := minf(148.0 if shown.size()==1 else 116.0,presentation_rect.size.y+44.0) if mobile and info.focused else 54.0 if mobile else 64.0
  var bounds := Rect2(670,500,610,110)
  if mobile:
   var half := height*.5
   var low := presentation_rect.position+Vector2(-36+half,-26+half)
   var high := presentation_rect.end+Vector2(36-half,22-half)
   bounds=Rect2(low,Vector2(maxf(1,high.x-low.x),maxf(1,high.y-low.y)))
   pos=pos.clamp(bounds.position,bounds.end)
  var fresh:=not sprites.has(uid)
  if fresh:
   var card:=DeskCard.new();card.name="desk_card_"+uid;cards[uid]=card;add_child(card)
   var sprite:=ItemSprite.new();sprite.name="desk_original_"+uid;sprite.setup(original.defId,uid,64.0)
   sprite.bounds=Rect2(670,500,610,110)
   sprites[uid]=sprite;add_child(sprite)
   sprite.position=pos
   var glow:=Sprite2D.new()
   glow.name="selection_glow"
   glow.show_behind_parent=true
   glow.region_enabled=true
   glow.texture_filter=CanvasItem.TEXTURE_FILTER_LINEAR
   var glow_material:=ShaderMaterial.new()
   glow_material.shader=preload("res://shaders/watch_selection.gdshader")
   glow_material.set_shader_parameter("strength",0.0)
   glow.material=glow_material
   sprite.body.add_child(glow)
  var card: DeskCard=cards[uid]
  var sprite: ItemSprite=sprites[uid]
  origins[uid]=info.direction
  card.visible = not mobile
  sprite.bounds = bounds
  if not sprite.busy and sprite.get_meta("display_height",0.0) != height:
   var next_scale := height/sprite.tex_size().y
   sprite.body.scale *= next_scale/sprite.display_scale
   sprite.display_scale = next_scale
   sprite.set_meta("display_height",height)
  _select_glow(sprite,bool(info.focused))
  if not sprite.dragging and not sprite.get_meta("arriving",false) and sprite.position.distance_to(pos)>0.5:
   if fresh or Game.prefs.reduced_motion: sprite.position=pos
   elif sprite.get_meta("layout_destination",Vector2.INF)!=pos:
    var old=sprite.get_meta("layout_tween") if sprite.has_meta("layout_tween") else null
    if old is Tween and old.is_valid(): old.kill()
    sprite.set_meta("layout_destination",pos)
    var settle:=sprite.create_tween();sprite.set_meta("layout_tween",settle)
    settle.tween_property(sprite,"position",pos,.18).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
    settle.tween_callback(func(): if is_instance_valid(sprite): sprite.remove_meta("layout_destination"))
  card.width=70.0 if side_count>(3 if visitor else 6) else 178.0 if visitor else 102.0
  card.show_item_marks(original)
  card.visitor=visitor;card.focused=info.focused;card.agreed=info.selected;card.refused=info.status in ["rejected","blocked"]
  sprite.set_meta("hit_size",Vector2(card.width,98))
  card.caption=("来客 · " if visitor else "店·")+WatchForgery.sale_name(original).left(8 if visitor else 5)
  card.note=("已谈妥 " if info.selected else "不收 " if card.refused else "开价 " if visitor else "报价 ")+Model.jnum(info.price)
  card.position=sprite.position;card.queue_redraw()
  if fresh and animate and not Game.prefs.reduced_motion:
   var start:=to_local(from);sprite.position=start;sprite.set_meta("arriving",true)
   var tw:=sprite.create_tween()
   tw.tween_property(sprite,"position",pos,.38).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
   tw.parallel().tween_property(sprite,"lift",0.0,.38).from(25.0)
   tw.tween_callback(func():sprite.set_meta("arriving",false))
 for uid in sprites.keys():
  if uid not in keep: discard(uid)

func _select_glow(sprite: ItemSprite, focused: bool) -> void:
 var glow: Sprite2D=sprite.body.get_node("selection_glow")
 _sync_glow(sprite,glow)
 var target:=1.0 if focused else 0.0
 if glow.get_meta("target",-1.0)==target: return
 glow.set_meta("target",target)
 var material: ShaderMaterial=glow.material
 var previous=glow.get_meta("fade") if glow.has_meta("fade") else null
 if previous is Tween and previous.is_valid(): previous.kill()
 if Game.prefs.reduced_motion:
  material.set_shader_parameter("strength",target)
  glow.visible=focused
 else:
  glow.visible=true
  var fade:=glow.create_tween();glow.set_meta("fade",fade)
  var current: float=float(material.get_shader_parameter("strength"))
  fade.tween_method(func(value: float):material.set_shader_parameter("strength",value),current,target,.16).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
  if not focused: fade.tween_callback(func():glow.hide())

func _sync_glow(sprite: ItemSprite, glow: Sprite2D) -> void:
 var face: Texture2D=sprite.body.texture.diffuse_texture if sprite.body.texture is CanvasTexture else sprite.body.texture
 if glow.texture!=face:
  glow.texture=face
  glow.material.set_shader_parameter("face_texture",glow.texture)
 glow.region_rect=sprite.body.region_rect.grow(24.0)
 glow.material.set_shader_parameter("region",sprite.mat.get_shader_parameter("region"))

func discard(uid: String) -> void:
 var sprite=take(uid)
 if is_instance_valid(sprite): sprite.queue_free()

func take(uid: String):
 var sprite=sprites.get(uid,null)
 sprites.erase(uid);origins.erase(uid)
 if cards.has(uid): cards[uid].queue_free();cards.erase(uid)
 return sprite

func clear() -> void:
 for uid in sprites.keys(): discard(uid)

func hit_test(global_point: Vector2) -> String:
 var order: Array=sprites.keys();order.reverse()
 var closest := ""
 var distance := INF
 for uid in order:
  var sprite: ItemSprite=sprites[uid]
  if sprite.contains(global_point) or (presentation_rect.size == Vector2.ZERO and cards[uid].area().has_point(to_local(global_point)-sprite.position)):
   var candidate := global_point.distance_squared_to(sprite.body.global_position)
   if candidate < distance:
    closest=uid;distance=candidate
 return closest

func _process(_delta: float) -> void:
 for uid in sprites:
  _sync_glow(sprites[uid],sprites[uid].body.get_node("selection_glow"))
  if sprites[uid].dragging:
   var old=sprites[uid].get_meta("layout_tween") if sprites[uid].has_meta("layout_tween") else null
   if old is Tween and old.is_valid(): old.kill()
   sprites[uid].remove_meta("layout_destination")
  if cards.has(uid): cards[uid].position=sprites[uid].position
