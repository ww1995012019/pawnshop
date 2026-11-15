extends RefCounted
## Immutable approved art, separated at runtime into real sprite and control skins.
## There is no reference-screen overlay: dynamic content is removed from the room,
## and each original, input, price, speech and action is rendered independently.
const SOURCE := "res://assets/comic/approved-reference.png"
const ROOM := "res://assets/comic/reference-clean-room.png"
static var cache := {}
static var original: Image
static var clean_image: Image
static var normal_font: FontVariation
static var bold_font: FontVariation
static var latin_font: FontVariation
static var title_face: FontVariation

static func font(strong := false) -> Font:
 if normal_font==null:
  normal_font=FontVariation.new();normal_font.base_font=load("res://assets/fonts/orbital-sans.ttf");normal_font.variation_embolden=.05
  bold_font=FontVariation.new();bold_font.base_font=normal_font.base_font;bold_font.variation_embolden=.4
 return bold_font if strong else normal_font
static func latin(strong := false) -> Font:
 font(true)
 if latin_font==null:
  latin_font=FontVariation.new();latin_font.base_font=load("res://assets/fonts/reference-latin.ttf");latin_font.fallbacks=[normal_font];latin_font.variation_embolden=.35
  title_face=FontVariation.new();title_face.base_font=latin_font.base_font;title_face.fallbacks=[bold_font];title_face.variation_embolden=.5
 return title_face if strong else latin_font

const ELDER_RECT := Rect2i(474,94,383,362)
const ELDER := [Vector2(636,94),Vector2(624,97),Vector2(618,105),Vector2(608,108),Vector2(600,123),Vector2(599,136),Vector2(585,141),Vector2(576,151),Vector2(566,155),Vector2(560,166),Vector2(551,169),Vector2(546,181),Vector2(539,185),Vector2(538,197),Vector2(529,207),Vector2(531,218),Vector2(537,226),Vector2(534,237),Vector2(542,248),Vector2(556,253),Vector2(556,264),Vector2(544,273),Vector2(531,279),Vector2(524,294),Vector2(519,310),Vector2(507,329),Vector2(499,343),Vector2(487,359),Vector2(481,377),Vector2(475,394),Vector2(480,408),Vector2(484,411),Vector2(487,435),Vector2(491,455),Vector2(855,455),Vector2(851,438),Vector2(847,423),Vector2(847,406),Vector2(841,389),Vector2(832,376),Vector2(830,360),Vector2(819,345),Vector2(809,331),Vector2(801,314),Vector2(793,300),Vector2(779,291),Vector2(762,285),Vector2(750,278),Vector2(746,262),Vector2(739,253),Vector2(741,248),Vector2(753,245),Vector2(757,236),Vector2(752,231),Vector2(761,224),Vector2(761,216),Vector2(752,209),Vector2(754,200),Vector2(749,189),Vector2(743,185),Vector2(746,178),Vector2(737,170),Vector2(738,162),Vector2(735,152),Vector2(725,144),Vector2(715,139),Vector2(715,128),Vector2(710,117),Vector2(699,113),Vector2(695,105),Vector2(683,100),Vector2(672,98),Vector2(668,94)]
const BUBBLE_RECT := Rect2i(760,157,285,101)
const BUBBLE := [Vector2(803,158),Vector2(1010,158),Vector2(1023,160),Vector2(1035,168),Vector2(1041,179),Vector2(1044,192),Vector2(1043,218),Vector2(1039,233),Vector2(1030,246),Vector2(1018,253),Vector2(805,254),Vector2(790,249),Vector2(780,240),Vector2(760,246),Vector2(780,225),Vector2(780,190),Vector2(784,175),Vector2(793,164)]
# Each entry is the original's tight source bounds, dial ellipse and strap box.
const WATCHES := {
 "leather_a":[Rect2i(51,164,70,87),Vector4(33,49,32,33),Rect2i(19,0,26,87)],
 "leather_b":[Rect2i(164,164,68,87),Vector4(32,49,31,33),Rect2i(19,0,25,87)],
 "cab_blue":[Rect2i(269,164,66,87),Vector4(30,49,29,33),Rect2i(18,0,25,87)],
 "cab_gold":[Rect2i(83,317,72,89),Vector4(33,48,32,34),Rect2i(19,0,29,89)],
 "cab_chrono":[Rect2i(210,317,72,89),Vector4(32,48,31,34),Rect2i(17,0,29,89)],
 "gray":[Rect2i(479,582,59,84),Vector4(29,42,27,28),Rect2i(18,0,23,84)],
 "black":[Rect2i(580,582,56,84),Vector4(28,43,26,28),Rect2i(16,0,25,84)],
 "white":[Rect2i(680,582,56,84),Vector4(28,43,26,28),Rect2i(16,0,25,84)],
 "rose":[Rect2i(775,582,57,84),Vector4(29,43,26,28),Rect2i(17,0,25,84)],
 "gold":[Rect2i(873,582,57,84),Vector4(29,43,26,28),Rect2i(17,0,25,84)],
 "blue":[Rect2i(976,582,58,84),Vector4(29,43,27,28),Rect2i(17,0,25,84)],
 "gold_white":[Rect2i(1078,582,57,84),Vector4(29,43,26,28),Rect2i(17,0,25,84)],
 "visitor":[Rect2i(671,458,57,78),Vector4(28,40,26,27),Rect2i(17,0,23,78)],
 "selected":[Rect2i(1231,119,83,122),Vector4(40,60,38,40),Rect2i(25,0,31,122)],
 "mint":[Rect2i(156,649,48,76),Vector4(24,38,22,25),Rect2i(16,0,18,76)],
 "dark":[Rect2i(285,649,49,76),Vector4(24,38,23,25),Rect2i(15,0,20,76)],
 "green":[Rect2i(27,740,49,77),Vector4(24,38,23,25),Rect2i(15,0,20,77)]
}
const STYLE_IDS := {"WCH-001":"leather_a","WCH-007":"leather_b","WCH-003":"cab_blue","WCH-010":"cab_gold","WCH-008":"cab_chrono","WCH-004":"gray","WCH-002":"black","WCH-005":"white","WCH-013":"rose","WCH-014":"gold","WCH-015":"gold_white","WCH-059":"blue","WCH-016":"gray","WCH-020":"mint","WCH-023":"dark","WCH-024":"green"}

static func source() -> Image:
 if original==null:
  original=UIKit.tex(SOURCE).get_image();original.convert(Image.FORMAT_RGBA8)
 return original

static func clean_source() -> Image:
 if clean_image==null:
  clean_image=UIKit.tex(ROOM).get_image();clean_image.resize(1671,941,Image.INTERPOLATE_LANCZOS);clean_image.convert(Image.FORMAT_RGBA8)
 return clean_image

static func pack_texture(key: String,img: Image) -> AtlasTexture:
 if cache.has(key):return cache[key]
 var texture=ImageTexture.create_from_image(img)
 texture.take_over_path("res://assets/comic/runtime-reference-"+key+".texture")
 var atlas=AtlasTexture.new();atlas.atlas=texture;atlas.region=Rect2(Vector2.ZERO,img.get_size())
 atlas.set_meta("approved_art",true);cache[key]=atlas;return atlas

static func region(key: String,r: Rect2i) -> AtlasTexture:
 if cache.has(key):return cache[key]
 return pack_texture(key,source().get_region(r))

static func patch(img: Image,r: Rect2i,donor: Rect2i,origin:=Vector2i.ZERO) -> void:
 var sample=source().get_region(donor)
 var target=Rect2i(r.position-origin,r.size).intersection(Rect2i(Vector2i.ZERO,img.get_size()))
 for y in range(target.position.y,target.end.y):
  for x in range(target.position.x,target.end.x):
   img.set_pixel(x,y,sample.get_pixel(posmod(x+origin.x-donor.position.x,donor.size.x),posmod(y+origin.y-donor.position.y,donor.size.y)))

static func erase_text(img: Image,r: Rect2i,origin:=Vector2i.ZERO) -> void:
 # Remove the old ink only; preserve the surrounding original paper texture.
 var area=Rect2i(r.position-origin,r.size)
 var before=img.duplicate();var marked={}
 for y in range(area.position.y,area.end.y):
  for x in range(area.position.x,area.end.x):
   var c=before.get_pixel(x,y)
   if c.a>.5 and c.r<.84:
    for dy in range(-2,3):
     for dx in range(-2,3):
      var p=Vector2i(x+dx,y+dy)
      if area.has_point(p):marked[p]=true
 for p in marked:
  var sum=Color(0,0,0,0);var count=0
  for direction in [Vector2i.LEFT,Vector2i.RIGHT,Vector2i.UP,Vector2i.DOWN]:
   for distance in range(1,22):
    var q=p+direction*distance
    if not Rect2i(Vector2i.ZERO,img.get_size()).has_point(q):break
    var c=before.get_pixelv(q)
    if not marked.has(q) and c.a>.5 and c.r>.88:
     sum+=c;count+=1;break
  if count>0:img.set_pixelv(p,sum/float(count))

static func ellipse(p: Vector2,e: Vector4) -> bool:
 return Vector2((p.x-e.x)/e.z,(p.y-e.y)/e.w).length_squared()<=1.0

static func watch_contains(p: Vector2,data: Array) -> bool:
 var e:Vector4=data[1];var strap:Rect2i=data[2]
 return ellipse(p,e) or Rect2(strap).has_point(p) or Rect2(e.x+e.z-2,e.y-8,6,16).has_point(p)

static func watch(key: String) -> AtlasTexture:
 var name="watch-"+key
 if cache.has(name):return cache[name]
 var data=WATCHES[key];var r:Rect2i=data[0];var img=source().get_region(r)
 for y in img.get_height():
  for x in img.get_width():
   if not watch_contains(Vector2(x+.5,y+.5),data):img.set_pixel(x,y,Color.TRANSPARENT)
 var texture=pack_texture(name,img)
 var anchors={"gray":510,"black":608,"white":708,"rose":804,"gold":902,"blue":1005,"gold_white":1107,"visitor":700}
 texture.set_meta("native_anchor",Vector2(float(anchors.get(key,r.position.x+r.size.x*.5))-r.position.x,43))
 return texture

static func stock_watch(style: String) -> AtlasTexture:
 var cells={"leather_a":Vector2i(21,641),"blue":Vector2i(86,641),"mint":Vector2i(151,641),"leather_b":Vector2i(216,641),"dark":Vector2i(281,641),"cab_gold":Vector2i(346,641),"green":Vector2i(21,735),"gray":Vector2i(86,735),"gold":Vector2i(216,735),"cab_chrono":Vector2i(281,735)}
 if not cells.has(style):return watch(style)
 var key="stock-watch-"+style
 if cache.has(key):return cache[key]
 var r=Rect2i(cells[style]+Vector2i(4,4),Vector2i(52,80));var img=source().get_region(r)
 for y in img.get_height():
  for x in img.get_width():
   var inside=ellipse(Vector2(x+.5,y+.5),Vector4(26,40,24,27)) or Rect2(15,0,23,80).has_point(Vector2(x,y)) or Rect2(48,31,4,16).has_point(Vector2(x,y))
   if not inside:img.set_pixel(x,y,Color.TRANSPARENT)
 return pack_texture(key,img)

static func watch_for(it,context: String="") -> Texture2D:
 if it==null:return null
 var id=WatchForgery.appearance_id(it)
 var style:String=STYLE_IDS.get(id,"")
 if style=="":return null
 if context=="stock":return stock_watch(style)
 if id=="WCH-059":
  if context=="selected":style="selected"
  elif context=="visitor":style="visitor"
  elif context=="display":style="cab_blue"
 return watch(style)

static func cut_polygon(key: String,r: Rect2i,points: Array) -> AtlasTexture:
 if cache.has(key):return cache[key]
 var polygon=PackedVector2Array(points)
 if key=="elder":polygon=Geometry2D.offset_polygon(polygon,24.0)[0]
 var img=source().get_region(r)
 for y in img.get_height():
  for x in img.get_width():
   var p=Vector2(x+.5+r.position.x,y+.5+r.position.y)
   if not Geometry2D.is_point_in_polygon(p,polygon) or key=="elder" and (Rect2(496,98,100,56).has_point(p) or Rect2(BUBBLE_RECT).has_point(p)):img.set_pixel(x,y,Color.TRANSPARENT)
 return pack_texture(key,img)

static func elder() -> AtlasTexture:
 return cut_polygon("elder",ELDER_RECT,ELDER)

static func bubble() -> AtlasTexture:
 if cache.has("speech"):return cache.speech
 var img=cut_polygon("speech-raw",BUBBLE_RECT,BUBBLE).get_image()
 erase_text(img,Rect2i(800,173,226,70),BUBBLE_RECT.position)
 return pack_texture("speech",img)

static func bell() -> AtlasTexture:
 var r=Rect2i(366,489,95,77)
 var poly=[Vector2(406,491),Vector2(424,491),Vector2(428,504),Vector2(440,510),Vector2(447,520),Vector2(451,537),Vector2(458,546),Vector2(459,554),Vector2(452,561),Vector2(438,565),Vector2(385,565),Vector2(369,560),Vector2(366,552),Vector2(374,541),Vector2(378,521),Vector2(386,511),Vector2(402,505)]
 return cut_polygon("bell",r,poly)

static func environment() -> Texture2D:
 if cache.has("environment"):return cache.environment
 var img=Image.create(1671,941,false,Image.FORMAT_RGBA8);img.fill(Color.TRANSPARENT)
 img.blit_rect(source(),Rect2i(0,60,1187,806),Vector2i(0,60))
 var donor=clean_source()
 # Remove full source bounds, including occluded ink. Never leave a painted
 # visitor, name or speech element in the scenery when its live node disappears.
 for r in [Rect2i(470,88,390,370),BUBBLE_RECT]:img.blit_rect(donor,r,r.position)
 for r in [Rect2i(496,98,100,56),Rect2i(44,161,88,126),Rect2i(156,161,88,126),Rect2i(262,161,87,126),Rect2i(75,314,86,126),Rect2i(204,314,87,126),Rect2i(650,458,96,79),Rect2i(639,537,118,35),Rect2i(456,580,102,134),Rect2i(558,581,96,132),Rect2i(657,581,96,132),Rect2i(756,581,96,132),Rect2i(856,581,96,132),Rect2i(956,565,96,150),Rect2i(1056,581,96,132),Rect2i(366,489,95,77)]:
  img.blit_rect(donor,r,r.position)
 # Clear each continuous cabinet backing, rather than leaving the edges of
 # individual watch-sized repair patches visible when the shelves are empty.
 # Keep the original wooden shelves; the donor's hidden backing is fitted
 # between their original measured edges.
 for planes in [[Rect2i(25,144,324,141),Rect2i(25,144,324,131)],[Rect2i(25,309,324,126),Rect2i(25,309,324,118)]]:
  var target:Rect2i=planes[0];var backing=donor.get_region(planes[1])
  backing.resize(target.size.x,target.size.y,Image.INTERPOLATE_LANCZOS)
  img.blit_rect(backing,Rect2i(Vector2i.ZERO,target.size),target.position)
 img.fill_rect(Rect2i(0,576,423,282),Color.TRANSPARENT)
 return pack_texture("environment",img)

static func hud() -> Texture2D:
 if cache.has("hud"):return cache.hud
 var img=source().get_region(Rect2i(0,0,1671,61))
 for r in [Rect2i(43,13,117,35),Rect2i(324,14,121,32),Rect2i(802,14,146,34),Rect2i(999,14,82,34),Rect2i(1151,14,105,34)]:patch(img,r,Rect2i(600,8,100,45))
 patch(img,Rect2i(184,11,88,37),Rect2i(181,10,5,38))
 return pack_texture("hud",img)

static func folio() -> Texture2D:
 if cache.has("folio"):return cache.folio
 var origin=Vector2i(1186,68);var img=source().get_region(Rect2i(origin,Vector2i(485,791)))
 var blank=Rect2i(1344,90,296,18)
 for r in [Rect2i(1344,108,300,46),Rect2i(1383,170,107,35),Rect2i(1528,170,124,35),Rect2i(1383,211,107,36),Rect2i(1528,211,124,36),Rect2i(1253,423,394,38)]:erase_text(img,r,origin)
 for r in [Rect2i(1204,351,448,63),Rect2i(1201,489,458,107),Rect2i(1248,610,368,57),Rect2i(1201,712,458,111)]:patch(img,r,blank,origin)
 # Preserve the selected-card border; clear its watch with its own charcoal paint.
 patch(img,Rect2i(1219,119,108,123),Rect2i(1218,119,7,123),origin)
 # The asking ribbon is a painted horizontal gradient, sampled above its figures.
 for y in range(294,333):
  for x in range(1255,1320):img.set_pixel(x-origin.x,y-origin.y,source().get_pixel(x,291))
  for x in range(1512,1640):img.set_pixel(x-origin.x,y-origin.y,source().get_pixel(x,292))
 return pack_texture("folio",img)

static func source_button(index: int) -> Texture2D:
 var rects=[Rect2i(1201,489,96,108),Rect2i(1297,490,94,106),Rect2i(1389,490,93,106),Rect2i(1480,490,90,106),Rect2i(1569,490,90,106)]
 return region("action-"+str(index),rects[index])

static func blank_button(index: int) -> Texture2D:
 var name="blank-action-"+str(index)
 if cache.has(name):return cache[name]
 var img=source_button(index).get_image()
 var r=Rect2i(8,8,img.get_width()-16,img.get_height()-18)
 var donor=Rect2i(1344,90,296,18)
 if index==0:
  for y in range(r.position.y,r.end.y):
   for x in range(r.position.x,r.end.x):img.set_pixel(x,y,source().get_pixel(1212,489+y))
 else:patch(img,r,donor)
 return pack_texture(name,img)

static func quote_skin() -> Texture2D:
 if cache.has("quote"):return cache.quote
 var r=Rect2i(1298,355,144,57);var img=source().get_region(r)
 erase_text(img,Rect2i(1308,363,125,41),r.position)
 return pack_texture("quote",img)

static func stock_frame() -> Texture2D:
 if cache.has("stock-frame"):return cache["stock-frame"]
 var r=Rect2i(5,575,418,278);var img=source().get_region(r)
 patch(img,Rect2i(17,638,394,195),Rect2i(1344,90,296,18),r.position)
 # Preserve the original cube, green header, sorting key and dropdown arrow.
 patch(img,Rect2i(79,589,118,32),Rect2i(211,588,65,33),r.position)
 return pack_texture("stock-frame",img)

static func stock_slot() -> Texture2D:
 if cache.has("stock-slot"):return cache["stock-slot"]
 var r=Rect2i(20,640,63,91);var img=source().get_region(r)
 var donor=source().get_region(Rect2i(1344,90,296,18))
 for y in img.get_height():
  for x in img.get_width():
   var p=Vector2(x-5,y-5)
   if ellipse(p,Vector4(26,40,24,27)) or Rect2(15,0,23,80).has_point(p) or Rect2(48,31,4,16).has_point(p):img.set_pixel(x,y,donor.get_pixel(posmod(x,296),posmod(y,18)))
 return pack_texture("stock-slot",img)

static func price_tag(selected: bool=false,display: bool=false) -> Texture2D:
 var key="tag-"+str(selected)+str(display)
 if cache.has(key):return cache[key]
 var r=Rect2i(958,675,91,38) if selected else Rect2i(465,675,90,37)
 if display:r=Rect2i(44,249,86,39)
 var img=source().get_region(r)
 if display:erase_text(img,Rect2i(57,255,63,27),r.position)
 else:patch(img,Rect2i(r.position.x+5,r.position.y+4,r.size.x-10,r.size.y-8),Rect2i(470,679,9,24),r.position)
 return pack_texture(key,img)

static func paper_skin() -> Texture2D:
 if cache.has("paper-skin"):return cache["paper-skin"]
 var r=Rect2i(1186,68,485,791);var img=source().get_region(r)
 patch(img,Rect2i(1208,92,442,743),Rect2i(1344,90,296,18),r.position)
 return pack_texture("paper-skin",img)

static func name_skin() -> Texture2D:
 if cache.has("name"):return cache.name
 var r=Rect2i(496,99,100,55);var img=source().get_region(r)
 for y in range(8,44):
  for x in range(12,89):img.set_pixel(x,y,source().get_pixel(510,113+posmod(y,23)))
 return pack_texture("name",img)

static func orders_skin() -> Texture2D:
 if cache.has("orders"):return cache.orders
 var r=Rect2i(1198,711,233,113);var img=source().get_region(r)
 patch(img,Rect2i(1270,767,141,37),Rect2i(1344,90,296,18),r.position)
 return pack_texture("orders",img)

static func secondary_blank() -> Texture2D:
 if cache.has("secondary-blank"):return cache["secondary-blank"]
 var r=Rect2i(1248,610,368,57);var img=source().get_region(r)
 patch(img,Rect2i(1257,618,350,39),Rect2i(1344,90,296,18),r.position)
 return pack_texture("secondary-blank",img)

static func crest() -> Texture2D:
 return region("crest",Rect2i(814,581,27,28))

static func modified() -> Texture2D:
 if cache.has("modified"):return cache.modified
 var img=source().get_region(Rect2i(460,621,33,31))
 for y in img.get_height():
  for x in img.get_width():
   var c=img.get_pixel(x,y)
   if not (c.r-c.b>.23 and c.r>.58 or c.r<.25 and c.g<.25):img.set_pixel(x,y,Color.TRANSPARENT)
 return pack_texture("modified",img)

static func shadow_for(it,visitor := false) -> Texture2D:
 var id=WatchForgery.appearance_id(it);var style:String=STYLE_IDS.get(id,"")
 if style=="":return null
 if id=="WCH-059" and visitor:style="visitor"
 var key="shadow-"+style
 if cache.has(key):return cache[key]
 var data=WATCHES[style];var body:Rect2i=data[0]
 var r=Rect2i(body.position+Vector2i(-18,65),Vector2i(body.size.x+40,mini(23,body.size.y-62)))
 var donor=clean_source()
 var img=Image.create(r.size.x,r.size.y,false,Image.FORMAT_RGBA8);img.fill(Color.TRANSPARENT)
 for y in r.size.y:
  for x in r.size.x:
   var p=Vector2(x+r.position.x,y+r.position.y)
   if not ellipse(Vector2(x,y),Vector4(r.size.x*.55,8,r.size.x*.45,9)) or watch_contains(p-Vector2(body.position),data):continue
   var alpha=clampf(1.0-source().get_pixelv(Vector2i(p)).get_luminance()/maxf(.05,donor.get_pixelv(Vector2i(p)).get_luminance()),0,.65)
   if alpha>.06:img.set_pixel(x,y,Color(0,0,0,alpha))
 var texture=pack_texture(key,img)
 var anchor=watch(style).get_meta("native_anchor")+Vector2(18,-65)
 texture.set_meta("native_anchor",anchor)
 return texture

static func visitor_tag() -> Texture2D:
 if cache.has("visitor-tag"):return cache["visitor-tag"]
 var r=Rect2i(638,536,120,36);var img=source().get_region(r)
 patch(img,Rect2i(646,542,104,23),Rect2i(470,679,9,24),r.position)
 return pack_texture("visitor-tag",img)

static func elder_scene() -> Texture2D:
 # This scene crop preserves every original curl/ink edge and its painted
 # scenery. Embedded UI is removed; the name and speech remain separate nodes.
 if cache.has("elder-scene"):return cache["elder-scene"]
 var img=source().get_region(ELDER_RECT)
 for r in [Rect2i(496,98,100,56),BUBBLE_RECT]:
  img.fill_rect(Rect2i(r.position-ELDER_RECT.position,r.size).intersection(Rect2i(Vector2i.ZERO,img.get_size())),Color.TRANSPARENT)
 return pack_texture("elder-scene",img)

static func blank_area(key: String,r: Rect2i) -> Texture2D:
 if cache.has(key):return cache[key]
 var img=source().get_region(r)
 patch(img,r,Rect2i(1344,90,296,18),r.position)
 return pack_texture(key,img)

static func muted_patch() -> Texture2D:
 if cache.has("muted-patch"):return cache["muted-patch"]
 var r=Rect2i(1487,13,39,35);var img=source().get_region(r)
 patch(img,r,Rect2i(600,8,100,45),r.position)
 return pack_texture("muted-patch",img)
