extends RefCounted
## Persistent visual slots; economics and ownership remain in Model.
static func capacity(s: Dictionary, location: String) -> int:
 return WarehouseExpansion.capacity(s,"display") if location=="display" else WarehouseExpansion.columns(s)*WarehouseExpansion.rows(s)

static func ensure(s: Dictionary) -> void:
 if not s.get("showroomLayout") is Dictionary: s.showroomLayout={}
 for location in ["warehouse","display"]:
  var old = s.showroomLayout.get(location,{})
  if not old is Dictionary: old={}
  var next := {}
  var occupied := {}
  var originals: Array = s.inventory.filter(func(it):return it.location==location)
  for it in originals:
   var slot = old.get(it.uid,-1)
   if (slot is int or slot is float) and int(slot)==slot and slot>=0 and slot<capacity(s,location) and not occupied.has(int(slot)):
    next[it.uid]=int(slot)
    occupied[int(slot)]=true
  for it in originals:
   if next.has(it.uid): continue
   for slot in capacity(s,location):
    if not occupied.has(slot):
     next[it.uid]=slot;occupied[slot]=true;break
  s.showroomLayout[location]=next

static func uid_at(s: Dictionary, location: String, slot: int) -> String:
 var layout: Dictionary=s.get("showroomLayout",{}).get(location,{})
 for uid in layout:
  if int(layout[uid])==slot: return uid
 return ""

static func place(previous: Dictionary, a: Dictionary) -> Dictionary:
 var location: String=str(a.get("location",""))
 var slot=a.get("slot",-1)
 if location not in ["warehouse","display"] or not (slot is int or slot is float): return previous
 if int(slot)!=slot or slot<0 or slot>=capacity(previous,location): return previous
 var original=Model.find_inventory(previous,str(a.get("uid","")))
 if previous.phase!="open" or previous.trade!=null or original==null: return previous
 if not Model.owns(original) or original.sealed or original.location not in ["warehouse","display"] or original.has("orderId") or original.get("service",{}).get("opened",false): return previous
 var s=previous.duplicate(true)
 if original.location!=location:
  s=Model.reduce(s,{"type":"DISPLAY","uid":original.uid})
  if Model.find_inventory(s,original.uid).location!=location: return s
 ensure(s)
 var layout: Dictionary=s.showroomLayout[location]
 var former: int=int(layout[original.uid])
 var other:=uid_at(s,location,int(slot))
 if other!="" and other!=original.uid: layout[other]=former
 layout[original.uid]=int(slot)
 return Model.notice(s,"手表已放入陈列位。" if location=="display" else "柜台摆放位置已保存。")
