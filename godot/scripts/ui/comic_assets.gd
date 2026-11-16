extends RefCounted
## Authored, independent comic assets. UI can change without changing item facts.
const R = preload("res://scripts/ui/reference_atlas.gd")
const ROOT := "res://assets/comic/"
static var cache := {}
static func tex(name: String) -> Texture2D:
 return UIKit.tex(ROOT+name)
static func icon(name: String) -> Texture2D:
 return tex("icons/"+name+".svg")
static func region(name: String,rect: Rect2) -> Texture2D:
 var key=name+str(rect)
 if cache.has(key): return cache[key]
 var a=AtlasTexture.new();a.atlas=tex(name);a.region=rect;cache[key]=a;return a
static func watch(it,back := false,context := "") -> Texture2D:
 if it==null:return null
 var id:String=WatchForgery.appearance_id(it)
 # These unique exemplars retain the exact approved painting/context crops.
 # C01 previously reused H01's gray crop; it now receives its own illustration.
 if not back and id!="WCH-016":
  var exact=R.watch_for(it,context)
  if exact!=null:return exact
 # Model-specific comic illustrations preserve the separate technical evidence atlas.
 var index:int=int(GameData.def(id).get("sprite",0))
 var texture=region("watch_variants_back.png" if back else "watch_variants_front.png",Rect2(index%8*128,index/8*192,128,192))
 texture.set_meta("body_axis",64.0)
 return texture

static func cabinet_icon(it: Dictionary) -> Texture2D:
 var id:String=WatchForgery.appearance_id(it)
 var key="cabinet-watch-"+id
 if cache.has(key):return cache[key]
 var texture=watch(it)
 var image:Image=texture.get_image()
 if image.is_compressed():image.decompress()
 image.convert(Image.FORMAT_RGBA8)
 # Ignore faint importer matte residue when fitting the actual painted body.
 for y in image.get_height():
  for x in image.get_width():
   var color=image.get_pixel(x,y)
   if color.a<.1:image.set_pixel(x,y,Color.TRANSPARENT)
 var used:Rect2i=image.get_used_rect()
 var axis:float=texture.get_meta("body_axis",image.get_width()*.5)
 if R.STYLE_IDS.has(id) and id!="WCH-016":
  var measured:Array=R.WATCHES[R.STYLE_IDS[id]]
  # Slightly asymmetric painted straps are balanced with the dial, never the crown.
  axis=(float(measured[1].x)+float(measured[2].get_center().x))*.5
 var factor=178.0/maxi(1,used.size.y)
 image.resize(maxi(1,roundi(image.get_width()*factor)),maxi(1,roundi(image.get_height()*factor)),Image.INTERPOLATE_LANCZOS)
 var canvas=Image.create(192,192,false,Image.FORMAT_RGBA8)
 canvas.blit_rect(image,Rect2i(Vector2i.ZERO,image.get_size()),Vector2i(roundi(96-axis*factor),roundi(96-(used.position.y+used.size.y*.5)*factor)))
 var result=AtlasTexture.new()
 result.atlas=ImageTexture.create_from_image(canvas)
 result.region=Rect2(0,0,192,192)
 cache[key]=result
 return result
static func prewarm() -> void:
 R.elder()
 # Decode before the first input so a new visitor cannot stall the bell tween.
 for asset in ["elder.png","residents.png","residents_new.png","residents_extra.png","landlord.png","watch_fronts.png","watch_backs.png","watch_shapes.png","watch_variants_front.png","watch_variants_back.png"]:tex(asset)

static func portrait(id: String) -> Texture2D:
 if id=="CHR-021":return R.elder()
 var n=maxi(int(id.trim_prefix("CHR-"))-1,0)
 var name="residents.png";var cols=3;var rows=3
 if n>=13 and n<33:name="residents_new.png";cols=5;rows=4;n-=13
 elif n>=9 and n<13:name="residents_extra.png";cols=2;rows=2;n-=9
 elif n>=33:return tex("landlord.png")
 if not ResourceLoader.exists(ROOT+name):return UIKit.legacy_npc_portrait(id)
 var t=tex(name);var cell=Vector2(t.get_width()/float(cols),t.get_height()/float(rows))
 return region(name,Rect2(Vector2(n%cols,n/cols)*cell,cell))

static func counter_portrait(id: String) -> Texture2D:
 if id=="CHR-021":return R.elder_scene()
 var key="counter-portrait-"+id
 if cache.has(key):return cache[key]
 var base=portrait(id);var pixels=base.get_image()
 if pixels.is_compressed():pixels.decompress()
 # Imported alpha can contain near-transparent compression speckles. Locate
 # the painted lower edge, rather than treating a single faint pixel as feet.
 var end=pixels.get_height()
 var needed=maxi(8,int(pixels.get_width()*.03))
 for y in range(pixels.get_height()-1,-1,-1):
  var opaque=0
  for x in pixels.get_width():
   if pixels.get_pixel(x,y).a>.5:opaque+=1
   if opaque>=needed:break
  if opaque>=needed:end=mini(pixels.get_height(),y+2);break
 var cut=AtlasTexture.new()
 if base is AtlasTexture:
  cut.atlas=base.atlas;cut.region=Rect2(base.region.position,Vector2(base.region.size.x,base.region.size.y*end/pixels.get_height()))
 else:
  cut.atlas=base;cut.region=Rect2(0,0,pixels.get_width(),end)
 cache[key]=cut;return cut
