extends SceneTree
var failures := 0
var storage
func _initialize(): call_deferred("run")
func check(ok: bool, label: String):
 print("WAREHOUSE ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func fresh() -> Dictionary:
 var s:=Model.create("EXPANSION")
 s.day=3;s.cash=10000;s.inventory=[]
 storage.ensure(s)
 return s
func watch(s: Dictionary,id: String) -> Dictionary:
 var it:=Model.new_item(s,id,{"condition":1.0,"working":true,"authentic":true,"sourceVerified":true})
 it.watch.missing_part="";it.evidence=["TOL-001","TOL-002"]
 Model.put_in(s,it)
 return it
func run():
 if not ResourceLoader.exists("res://scripts/model/warehouse_expansion.gd"):
  check(false,"warehouse expansion rules exist");quit(1);return
 storage=load("res://scripts/model/warehouse_expansion.gd")
 var s:=fresh()
 var legacy_route:Dictionary=ShopUpgrades.reduce(s,{"type":"BUY_SHOP_EXTENSION","id":"storage"})
 check(legacy_route.cash==10000 and storage.columns(legacy_route)==10,"retired cash-only expansion cannot charge without expanding")
 var a:=watch(s,"WCH-007");var b:=watch(s,"WCH-008")
 var before:=JSON.stringify(s)
 var fractional:Dictionary=storage.reduce(s,{"type":"EXPAND_WAREHOUSE","level":1.5,"uids":[a.uid,b.uid]})
 check(fractional.cash==10000 and fractional.inventory.size()==2,"fractional target levels cannot be truncated into a paid upgrade")
 var rejected: Dictionary=storage.reduce(s,{"type":"EXPAND_WAREHOUSE","level":1,"uids":[a.uid,a.uid]})
 check(rejected.cash==10000 and rejected.inventory.size()==2 and JSON.stringify(s)==before,"one original cannot pay twice and rejection does not mutate")
 a.authentic=false
 rejected=storage.reduce(s,{"type":"EXPAND_WAREHOUSE","level":1,"uids":[a.uid,b.uid]})
 check(rejected.cash==10000 and rejected.inventory.size()==2,"fake watches cannot pay expansion costs")
 a.authentic=true;WatchForgery.apply(a,"logo")
 rejected=storage.reduce(s,{"type":"EXPAND_WAREHOUSE","level":1,"uids":[a.uid,b.uid]})
 check(rejected.cash==10000,"forged genuine originals cannot pay expansion costs")
 a.erase("forgery")
 var next: Dictionary=storage.reduce(s,{"type":"EXPAND_WAREHOUSE","level":1,"uids":[a.uid,b.uid]})
 check(next.cash==9800 and next.inventory.is_empty() and s.inventory.size()==2,"upgrade consumes only selected originals and exactly200 cash")
 check(storage.columns(next)==10 and storage.rows(next)==12 and storage.capacity(next,"display")==32,"first expansion opens120 cells and32 independent display slots")
 var replay: Dictionary=storage.reduce(next,{"type":"EXPAND_WAREHOUSE","level":1,"uids":[a.uid,b.uid]})
 check(replay.cash==9800 and storage.rows(replay)==12,"repeated upgrade cannot charge twice or skip tiers")
 var gated:=fresh();gated.storageExpansion=storage.default_state(3)
 var luxury:=watch(gated,"WCH-028")
 var unearned:Dictionary=storage.reduce(gated,{"type":"EXPAND_WAREHOUSE","level":4,"uids":[luxury.uid]})
 check(storage.rows(unearned)==18 and unearned.cash==10000 and unearned.inventory.size()==1,"ten completed commissions are required before the fourth upgrade")
 var workshop:Dictionary=ShopUpgrades.reduce(next,{"type":"BUY_SHOP_EXTENSION","id":"workshop"})
 check(workshop.cash==9500 and ShopUpgrades.daily_ap(workshop)==14 and storage.rows(workshop)==12,"warehouse progression coexists with workshop extension")
 s=next
 for fixture in [
  {"level":2,"models":["WCH-007","WCH-014"],"cash":9500,"rows":15,"display":47},
  {"level":3,"models":["WCH-014","WCH-015","WCH-028"],"cash":9100,"rows":18,"display":65},
  {"level":4,"models":["WCH-028"],"cash":8500,"rows":21,"display":90},
  {"level":5,"models":["WCH-028"],"cash":8500,"rows":30,"display":130}]:
  var ids:Array=[]
  for id in fixture.models:ids.append(watch(s,id).uid)
  s.orders=[]
  for i in 35:s.orders.append({"id":"completed-"+str(i),"status":"done"})
  storage.ensure(s)
  s=storage.reduce(s,{"type":"EXPAND_WAREHOUSE","level":fixture.level,"uids":ids})
  check(s.cash==fixture.cash and storage.columns(s)==10 and storage.rows(s)==fixture.rows and storage.capacity(s,"display")==fixture.display,"tier%d settles its watches, cost and cumulative capacity"%fixture.level)
 check(storage.capacity(s,"materials")==130 and storage.capacity(s,"isolation")==150,"final material and isolation capacities are independent")
 var spare:=watch(s,"WCH-001")
 check(Model.can_place(s,spare.uid,9,28) and not Model.can_place(s,spare.uid,9,29),"real placement accepts last expanded row and rejects overflow")
 var slots:Dictionary=storage.reduce(s,{"type":"BUY_PAWN_SLOTS","quantity":5,"requestId":"slots-one"})
 check(slots.cash==8475 and storage.capacity(slots,"pawn")==25,"five extra pawn slots cost25 cash")
 var retry:Dictionary=storage.reduce(slots,{"type":"BUY_PAWN_SLOTS","quantity":5,"requestId":"slots-one"})
 check(retry.cash==8475 and storage.capacity(retry,"pawn")==25,"slot purchase request is idempotent")
 var loaded:Dictionary=JSON.parse_string(JSON.stringify(slots));loaded.day+=1;storage.ensure(loaded)
 check(storage.capacity(loaded,"pawn")==25,"purchased slots survive serialization and the next day")
 var old:=fresh();old.erase("storageExpansion");old.shopUpgrades={"version":1,"extension":"storage"}
 old.inventory=[]
 for y in range(0,8,2):
  for x in 10:
   var it:=Model.new_item(old,"WCH-001");it.x=x;it.y=y;old.inventory.append(it)
 var old_ids:Array=old.inventory.map(func(it):return it.uid)
 storage.ensure(old)
 check(storage.columns(old)==10 and storage.rows(old)==12 and old.cash==10000 and old.inventory.map(func(it):return it.uid)==old_ids,"legacy10x8 migrates without cost or losing40 originals")
 check(old.inventory.all(func(it):return Model.can_place(old,it.uid,it.x,it.y)),"legacy originals have nonoverlapping valid new positions")
 var counted:=fresh();counted.orders=[{"id":"ordinary-one","status":"done"},{"id":"failed","status":"failed"}]
 counted.serviceContracts={"entries":[{"id":"service-one","status":"complete"},{"id":"cancel","status":"cancelled"}]}
 storage.ensure(counted);storage.ensure(counted)
 check(storage.completed_count(counted)==2,"successful ordinary and service commissions count once")
 counted.orders=[];counted.serviceContracts.entries=[];storage.ensure(counted)
 check(storage.completed_count(counted)==2,"cumulative commission progress is not lost with old rows")
 print("WAREHOUSE failures=",failures);quit(1 if failures else 0)
