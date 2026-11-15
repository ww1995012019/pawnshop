extends RefCounted
## Authored, independent comic assets. UI can change without changing item facts.
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
static func watch(it,back := false) -> Texture2D:
 if it==null:return null
 # Detailed technical faces retain their model-authored evidence artwork.

 var d=GameData.def(WatchForgery.appearance_id(it))
 var name: String=d.get("name","")
 var idx=posmod(int(d.get("sprite",0)),8)
 if "玄汐" in name or "潜" in name:idx=7
 elif "纪念" in name or "旧航" in name:idx=6
 elif "金" in name:idx=0
 elif "计时" in name:idx=1
 var shape=WatchLogo.art(d.id).get("shape","square" if WatchForgery.template(d.id)==6 else "round")
 var shape_names=["square","octagon","oval","cushion","tonneau","sun","crescent"]
 if shape in shape_names and ResourceLoader.exists(ROOT+"watch_shapes.png"):
  var column={"square":0,"octagon":2,"oval":3,"cushion":4,"tonneau":5,"sun":6,"crescent":7}[shape]
  if shape=="square" and d.get("tier","") in ["luxury","ultra"]:column=1
  var sheet=tex("watch_shapes.png");var unit=Vector2(sheet.get_width()/8.0,sheet.get_height()/2.0)
  var fronts=[Rect2(60,144,124,223),Rect2(57,144,123,223),Rect2(50,140,130,230),Rect2(56,141,116,229),Rect2(43,148,140,216),Rect2(53,139,125,232),Rect2(39,141,141,229),Rect2(43,144,134,224)]
  var backs=[Rect2(61,109,123,222),Rect2(59,113,123,216),Rect2(52,105,129,228),Rect2(56,108,116,225),Rect2(44,114,141,214),Rect2(54,107,125,227),Rect2(40,108,140,223),Rect2(44,110,134,221)]
  var r:Rect2=backs[column] if back else fronts[column]
  r.position+=Vector2(column,1 if back else 0)*unit
  return region("watch_shapes.png",r)
 var bounds=[Rect2(74,76,249,393),Rect2(65,80,259,382),Rect2(101,78,191,386),Rect2(70,79,253,384),Rect2(71,77,252,382),Rect2(71,77,253,381),Rect2(70,77,253,382),Rect2(61,77,273,383)]
 var asset="watch_backs.png" if back else "watch_fronts.png"
 var t=tex(asset)
 var cell=Vector2(t.get_width()/4.0,t.get_height()/2.0)
 var b:Rect2=bounds[idx]
 b.position+=Vector2(idx%4,idx/4)*cell
 return region(asset,b)
static func prewarm() -> void:
 # Decode before the first input so a new visitor cannot stall the bell tween.
 for asset in ["elder.png","residents.png","residents_new.png","residents_extra.png","landlord.png","watch_fronts.png","watch_backs.png","watch_shapes.png"]:tex(asset)

static func portrait(id: String) -> Texture2D:
 if id=="CHR-021":return region("elder.png",Rect2(50,43,1170,1150))
 var n=maxi(int(id.trim_prefix("CHR-"))-1,0)
 var name="residents.png";var cols=3;var rows=3
 if n>=13 and n<33:name="residents_new.png";cols=5;rows=4;n-=13
 elif n>=9 and n<13:name="residents_extra.png";cols=2;rows=2;n-=9
 elif n>=33:return tex("landlord.png")
 if not ResourceLoader.exists(ROOT+name):return UIKit.legacy_npc_portrait(id)
 var t=tex(name);var cell=Vector2(t.get_width()/float(cols),t.get_height()/float(rows))
 return region(name,Rect2(Vector2(n%cols,n/cols)*cell,cell))
