extends RefCounted
## Geometry only: no trade actions, reveal timers or inventory state.
const A = preload("res://scripts/ui/comic_assets.gd")
const SPEECH_PADDING := Vector4(47,9,18,13)
const SPEECH_MINIMUM := Vector2(285,101)
static var portraits := {}

## The resident illustrations rest their joined hands at the lower edge.
## The full atlas cells include padding; the desktop cutouts are tightly cropped.
static func hand_uv(id: String, padded: bool) -> Vector2:
 if id=="CHR-034":return Vector2(.72,.77)
 return Vector2(.54,.91 if padded else .94)

static func portrait(id: String) -> Texture2D:
 if portraits.has(id):return portraits[id]
 var base=A.counter_portrait(id)
 var pixels=base.get_image()
 if pixels.is_compressed():pixels.decompress()
 var low=Vector2i(pixels.get_width(),pixels.get_height())
 var high=Vector2i(-1,-1)
 for y in pixels.get_height():
  for x in pixels.get_width():
   # Importer matte speckles must not count as a painted shoulder or hair.
   if pixels.get_pixel(x,y).a>.1:
    low=low.min(Vector2i(x,y));high=high.max(Vector2i(x,y))
 if high.x<low.x:
  portraits[id]=base;return base
 var crop=Rect2(Vector2(low),Vector2(high-low+Vector2i.ONE))
 var tight=AtlasTexture.new()
 tight.atlas=base.atlas if base is AtlasTexture else base
 tight.region=Rect2((base.region.position if base is AtlasTexture else Vector2.ZERO)+crop.position,crop.size)
 portraits[id]=tight
 return tight

static func actor_rect(texture: Texture2D,stage: Rect2) -> Rect2:
 var source=texture.get_size()
 var factor=minf(stage.size.x/maxf(source.x,1.0),stage.size.y/maxf(source.y,1.0))
 var fitted=source*factor
 return Rect2(Vector2(stage.get_center().x-fitted.x*.5,stage.end.y-fitted.y),fitted)

static func speech_rects(font: Font,font_size: int,text: String,origin: Vector2,right: float,bottom: float,top:=73.0) -> Dictionary:
 var padding=SPEECH_PADDING
 var width=SPEECH_MINIMUM.x
 var anchored_height=maxf(SPEECH_MINIMUM.y,bottom-origin.y)
 var available_height=maxf(anchored_height,bottom-minf(top,origin.y))
 var available_width=maxf(SPEECH_MINIMUM.x,right-origin.x)
 var text_width=width-padding.x-padding.z
 var content_height=_text_height(font,font_size,text,text_width)
 # A long speech grows upward with its tail above the counter. Use the
 # clear space below the HUD before taking more room toward the folio.
 if content_height+padding.y+padding.w>available_height:
  var low=width;var high=available_width
  while high-low>1.0:
   var middle=floorf((low+high)*.5)
   var height=_text_height(font,font_size,text,middle-padding.x-padding.z)+padding.y+padding.w
   if height<=available_height:high=middle
   else:low=middle+1.0
  width=ceilf(high);text_width=width-padding.x-padding.z
  content_height=_text_height(font,font_size,text,text_width)
 var outer_height=clampf(content_height+padding.y+padding.w,SPEECH_MINIMUM.y,available_height)
 var fitted_origin=Vector2(origin.x,minf(origin.y,bottom-outer_height))
 var body_height=outer_height-padding.y-padding.w
 return {
  "bubble":Rect2(fitted_origin,Vector2(width,outer_height)),
  "text":Rect2(fitted_origin+Vector2(padding.x,padding.y),Vector2(text_width,body_height)),
  "scroll":content_height>body_height,
 }

static func _text_height(font: Font,font_size: int,text: String,width: float) -> float:
 var flags=TextServer.BREAK_MANDATORY|TextServer.BREAK_WORD_BOUND|TextServer.BREAK_ADAPTIVE
 # Always measure the complete string. Reveal progress must not resize the
 # paper or change wrapping while the existing typewriter is running.
 return ceilf(font.get_multiline_string_size(text,HORIZONTAL_ALIGNMENT_LEFT,width,font_size,-1,flags).y)+2.0
