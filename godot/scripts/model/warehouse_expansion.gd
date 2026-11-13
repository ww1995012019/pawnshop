class_name WarehouseExpansion
extends RefCounted
## Independent storage progression. Upgrade inputs are physical originals.
const ROWS := [6,12,15,18,21,30]
const DISPLAYS := [20,32,47,65,90,130]
const MATERIALS := [20,40,60,80,80,130]
const ISOLATION := [20,40,60,80,100,150]
const FEES := [200,300,400,600,0]
const ORDERS := [0,0,0,10,35]
const TIERS := ["low","mid","luxury","ultra"]

static func default_state(level := 0) -> Dictionary:
 level=clampi(level,0,5)
 return {"version":2,"level":level,"columns":10,"rows":ROWS[level],"displayCapacity":DISPLAYS[level],"materialCapacity":MATERIALS[level],"isolationCapacity":ISOLATION[level],"pawnCapacity":20,"completedOrderIds":[]}

static func ensure(s: Dictionary) -> void:
 if not s.get("storageExpansion") is Dictionary:
  var legacy:bool=s.get("shopUpgrades",{}).get("extension","")=="storage"
  s.storageExpansion=default_state(1 if legacy else 0)
  var shown:=0
  for it in s.inventory:
   if it.get("location","")=="display":shown+=1
  s.storageExpansion.displayCapacity=maxi(int(s.storageExpansion.displayCapacity),shown)
  if legacy:_repack(s)
 var data:Dictionary=s.storageExpansion
 if int(data.get("version",1))<2:
  var cells:=int(data.get("columns",10))*int(data.get("rows",6))
  data.columns=10;data.rows=maxi(ROWS[clampi(int(data.get("level",0)),0,5)],ceili(cells/10.0))
  data.version=2
  _repack(s)
 var defaults:=default_state(int(data.get("level",0)))
 for key in defaults:
  if not data.has(key):data[key]=defaults[key]
 if not data.completedOrderIds is Array:data.completedOrderIds=[]
 for row in s.get("orders",[]):
  if row.get("status","")=="done":_credit(data,"order:"+String(row.id))
 for row in s.get("serviceContracts",{}).get("entries",[]):
  if row.get("status","")=="complete":_credit(data,"service:"+String(row.id))

static func _credit(data: Dictionary,id: String) -> void:
 if not data.completedOrderIds.has(id):data.completedOrderIds.append(id)

static func _data(s: Dictionary) -> Dictionary:
 return s.get("storageExpansion",default_state(1 if s.get("shopUpgrades",{}).get("extension","")=="storage" else 0))
static func columns(s: Dictionary) -> int:return maxi(10,int(_data(s).get("columns",10)))
static func rows(s: Dictionary) -> int:return maxi(6,int(_data(s).get("rows",6)))
static func capacity(s: Dictionary,location: String) -> int:
 var key:String={"display":"displayCapacity","materials":"materialCapacity","isolation":"isolationCapacity","pawn":"pawnCapacity"}.get(location,"")
 return maxi(0,int(_data(s).get(key,20)))
static func completed_count(s: Dictionary) -> int:
 var ids:Array=_data(s).get("completedOrderIds",[]).duplicate()
 for row in s.get("orders",[]):
  if row.get("status","")=="done" and not ids.has("order:"+String(row.id)):ids.append("order:"+String(row.id))
 for row in s.get("serviceContracts",{}).get("entries",[]):
  if row.get("status","")=="complete" and not ids.has("service:"+String(row.id)):ids.append("service:"+String(row.id))
 return ids.size()

static func material_problem(s: Dictionary,id: String) -> String:
 if float(s.materials.get(id,0))>0:return ""
 var kinds:=0
 for value in s.materials.values():
  if float(value)>0:kinds+=1
 return "材料种类仓位已满，请先用完或售出一种材料。" if kinds>=capacity(s,"materials") else ""

static func requirements(level: int) -> Array:
 match level:
  1:return [{"tier":"mid","higher":true,"value":200},{"tier":"mid","higher":true,"value":200}]
  2:return [{"tier":"mid","higher":false,"value":200},{"tier":"luxury","higher":true,"value":300}]
  3:return [{"tier":"luxury","higher":false,"value":300},{"tier":"luxury","higher":false,"value":300},{"tier":"luxury","higher":true,"value":500}]
  4:return [{"tier":"luxury","higher":false,"value":800}]
  5:return [{"star":true,"value":0}]
 return []

static func eligible(s: Dictionary,it: Dictionary) -> bool:
 if it.get("owner","")!="shop" or not it.get("authentic",false) or not it.get("sourceVerified",false):return false
 if not it.get("location","") in ["warehouse","display"] or it.get("sealed",false) or it.get("stolen",false) or it.get("crimeRevealed",false):return false
 if Model.trade_reserved(s,it):return false
 for key in ["orderId","serviceJobId","eventClaimId","warrantyCaseId"]:
  if it.has(key):return false
 if it.get("service",{}).get("opened",false) or it.get("service",{}).get("forge_task","")!="" or it.get("refurbishment",{}).get("active_case",false):return false
 for operations in [it.get("service",{}).get("operations",{}),it.get("refurbishment",{}).get("operations",{})]:
  for operation in operations.values():
   if operation is Dictionary and not operation.is_empty() and not operation.get("complete",false):return false
 for method in WatchForgery.treatments(it):
  if WatchForgery.active(it,method):return false
 return GameData.def(it.defId).get("category","")=="watch"

static func matches(it: Dictionary,rule: Dictionary) -> bool:
 var definition:=GameData.def(it.defId)
 if Model.item_value(it)<float(rule.value):return false
 if rule.get("star",false):return definition.get("watch",{}).get("brand","")=="星冕" or definition.tier=="ultra"
 var rank:=TIERS.find(definition.tier);var needed:=TIERS.find(rule.tier)
 return rank>=needed if rule.higher else rank==needed

static func candidates(s: Dictionary,rule: Dictionary) -> Array:
 return s.inventory.filter(func(it):return eligible(s,it) and matches(it,rule))

static func _assign(items: Array,rules: Array,index: int,used: Array) -> bool:
 if index==rules.size():return true
 for it in items:
  if not used.has(it.uid) and matches(it,rules[index]):
   if _assign(items,rules,index+1,used+[it.uid]):return true
 return false

static func problem(s: Dictionary,level: int,uids: Array) -> String:
 if level!=int(_data(s).level)+1 or level<1 or level>5:return "只能按顺序购买下一档，当前等级已变化。"
 if int(s.day)<3:return "第3天起开放扩仓。"
 if s.has("outcome") or not s.phase in ["open","report"]:return "当前不能安排扩仓。"
 if s.trade!=null:return "请先结束当前来客的业务，再扩仓。"
 if s.cash<FEES[level-1]:return "扩仓现金不足。"
 if completed_count(s)<ORDERS[level-1]:return "累计完成委托不足%d单。"%ORDERS[level-1]
 var rules:=requirements(level)
 if uids.size()!=rules.size() or Model.uniq(uids).size()!=uids.size():return "请为每项条件选择不同的原表；所选手表将被消耗。"
 var originals:Array=[]
 for uid in uids:
  var it=Model.find_inventory(s,uid)
  if it==null or not eligible(s,it):return "所选原表不可交付，或含伪造、受托、封存及占用物品。"
  originals.append(it)
 if not _assign(originals,rules,0,[]):return "所选原表的真实档次或当前实际价值未达到要求。"
 return ""

static func _repack(s: Dictionary) -> void:
 var placed:Array=[]
 for it in s.inventory:
  if it.location!="warehouse":continue
  var dim:=Model.dimensions(it)
  var point:=Vector2i(int(it.x),int(it.y))
  if not _fits(point,dim,placed,columns(s),rows(s)):
   point=Vector2i(-1,-1)
   for y in range(rows(s)-int(dim[1])+1):
    for x in range(columns(s)-int(dim[0])+1):
     if _fits(Vector2i(x,y),dim,placed,columns(s),rows(s)):point=Vector2i(x,y);break
    if point.x>=0:break
   if point.x<0:
    # Keep unusual old/debug saves usable; never discard a stored original.
    point=Vector2i(0,rows(s));s.storageExpansion.rows=point.y+int(dim[1])
  it.x=point.x;it.y=point.y
  placed.append(Rect2i(point,Vector2i(int(dim[0]),int(dim[1]))))

static func _fits(point: Vector2i,dim: Array,placed: Array,width: int,height: int) -> bool:
 var rect:=Rect2i(point,Vector2i(int(dim[0]),int(dim[1])))
 if point.x<0 or point.y<0 or rect.end.x>width or rect.end.y>height:return false
 return not placed.any(func(other):return rect.intersects(other))

static func reduce(previous: Dictionary,action: Dictionary):
 var kind:String=action.get("type","")
 if kind not in ["EXPAND_WAREHOUSE","BUY_PAWN_SLOTS","STORE_ITEM"]:return null
 var s:Dictionary=previous.duplicate(true);ensure(s)
 if kind=="EXPAND_WAREHOUSE":
  var requested=action.get("level",-1)
  if typeof(requested) not in [TYPE_INT,TYPE_FLOAT] or not is_finite(float(requested)) or float(requested)!=floor(float(requested)):return Model.notice(s,"扩仓档位必须是整数。")
  var level:=int(action.get("level",-1));var ids:Array=action.get("uids",[]) if action.get("uids",[]) is Array else []
  var reason:=problem(s,level,ids)
  if reason!="":return Model.notice(s,reason)
  if not Model.ledger(s,"storage-expansion-%d"%level,"upgrade","仓储扩建 · 第%d档"%level,-FEES[level-1]):return previous
  s.inventory=s.inventory.filter(func(it):return not ids.has(it.uid))
  var updated:=default_state(level)
  for key in ["level","columns","rows","displayCapacity","materialCapacity","isolationCapacity"]:
   s.storageExpansion[key]=maxi(int(s.storageExpansion.get(key,0)),int(updated[key]))
  if s.report is Dictionary:s.report.cash=s.cash
  return Model.notice(s,"扩仓完成：%d×%d，展示位%d；已交付%d只原表。"%[columns(s),rows(s),capacity(s,"display"),ids.size()])
 if kind=="BUY_PAWN_SLOTS":
  var count=action.get("quantity",0);var request_id:=String(action.get("requestId",""))
  if typeof(count) not in [TYPE_INT,TYPE_FLOAT] or not is_finite(float(count)) or float(count)!=floor(float(count)) or count<1 or count>100:return Model.notice(s,"每次请选择1～100个仓位。")
  if request_id=="" or request_id.length()>120:return previous
  if s.phase!="open" or s.has("outcome"):return Model.notice(s,"营业期间可购买永久仓位。")
  if s.cash<int(count)*5:return Model.notice(s,"购买仓位的现金不足。")
  if not Model.ledger(s,"pawn-slots-"+request_id,"storage-slots","永久抵押仓位 ×%d"%int(count),-int(count)*5):return previous
  s.storageExpansion.pawnCapacity=capacity(s,"pawn")+int(count)
  return Model.notice(s,"已购买%d个永久仓位，抵押柜容量%d。"%[int(count),capacity(s,"pawn")])
 var it=Model.find_inventory(s,action.get("uid",""));var location:=String(action.get("location",""))
 if it==null or location not in ["warehouse","display","isolation"]:return previous
 var closed:=Model.business_hours_problem(s)
 if closed!="":return Model.notice(s,closed)
 if it.location==location and location!="warehouse":return previous
 if location=="display":return Model.reduce(s,{"type":"DISPLAY","uid":it.uid})
 if location=="isolation":return Model.reduce(s,{"type":"ISOLATE","uid":it.uid})
 if it.owner=="pawn" or Model.trade_reserved(s,it) or (it.sealed and it.location!="isolation"):return Model.notice(s,"此原物暂不可移动。")
 if it.location=="isolation" and not it.sourceVerified:return Model.notice(s,"来源未核验，不能解除隔离。")
 var x=action.get("x",null);var y=action.get("y",null)
 var rotated=action.get("rotated",it.rotated)
 if x==null or y==null:
  var pos=Model.empty_cell(s,it)
  if pos==null:return Model.notice(s,"后仓没有可容纳的空位。")
  x=pos.x;y=pos.y
 if not Model.can_place(s,it.uid,x,y,rotated):return Model.notice(s,"放置会重叠或越界，原物已保留。")
 it.location="warehouse";it.sealed=false;it.x=int(x);it.y=int(y);it.rotated=rotated
 return Model.notice(s,"原物已移入后仓。")
