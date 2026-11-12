extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
 if not ok: push_error(label);failures+=1
func run() -> void:
 if not ResourceLoader.exists("res://scripts/model/robbery.gd"):
  check(false,"robbery feature must exist independently of night theft");quit(1);return
 var r=load("res://scripts/model/robbery.gd")
 var s:=Model.create("ROBBERY-TEST")
 s.inventory=[];s.cash=0
 var luxury:=""
 var higher:=""
 for d in GameData.item_list:
  if d.category!="watch":continue
  if d.tier=="luxury" and d.get("watch",{}).get("brand","")!="星冕": luxury=d.id
  if d.tier=="ultra":higher=d.id
 check(luxury!="" and higher!="","catalogue fixtures")
 for i in 100:s.inventory.append(Model.new_item(s,luxury))
 check(r.chance_bp(s)==300,"100 luxury watches yield exactly 3 percent")
 for it in s.inventory:it.defId=higher
 check(r.chance_bp(s)==900,"100 higher watches yield exactly 9 percent")
 # Exact selection is tested below using real watch values.
 s.inventory=[];s.cash=0
 for i in 4:s.inventory.append(Model.new_item(s,luxury))
 var value:=Model.item_value(s.inventory[0])
 s.cash=value*36 # assets=40 watches; target is exactly two watches.
 var selected: Array=r.select_items(s)
 check(selected.size()==2,"closest 5 percent asset target selects two originals")
 s.inventory[0].owner="customer";s.inventory[1].sealed=true;s.inventory[2].location="isolation"
 check(r.select_items(s).size()==1,"customer, sealed and isolation originals are protected")
 # True closest combinations across different values, not greedy highest-price theft.
 s.inventory=[]
 for id in ["WCH-001","WCH-002","WCH-003","WCH-004","WCH-005"]:s.inventory.append(Model.new_item(s,id))
 for cash_target in [0,100,1000,10000,100000]:
  s.cash=cash_target
  var target:float=r.assets(s)*.05
  var actual:float=0
  for it in r.select_items(s):actual+=Model.item_value(it)
  var distance:=INF
  for mask in range(1,1<<s.inventory.size()):
   var total:=0.0
   var count:=0
   for j in s.inventory.size():
    if mask&(1<<j):count+=1;total+=Model.item_value(s.inventory[j])
   if count<=3:distance=minf(distance,absf(total-target))
  check(is_equal_approx(absf(actual-target),distance),"selection finds globally closest one-to-three combination")
 # Trigger through the actual day-opening reducer, then repeat from serialized state.
 var robbed: Dictionary={}
 for i in 1000:
  s=Model.create("ROBBERY-%d"%i);s.day=2;s.phase="report";s.inventory=[];s.cash=100000
  for j in 10:s.inventory.append(Model.new_item(s,higher))
  var next:=Model.reduce(s,{"type":"NEXT"})
  if not next.get("robbery",{}).get("entries",[]).is_empty():robbed=next;break
 check(not robbed.is_empty(),"day opening can generate a saved robbery")
 if robbed.is_empty():quit(1);return
 var c:Dictionary=robbed.nightCrime.cases.back()
 check(c.items.size()>=1 and c.items.size()<=3,"one to three actual originals stolen")
 var original:Dictionary=c.items[0].item.duplicate(true)
 check(r.marked(robbed,original),"original UID carries a validated robbery mark")
 var copy:=original.duplicate(true);copy.uid="same-model-other-original"
 check(not r.marked(robbed,copy),"same model cannot forge a case mark")
 robbed.trade={"id":"robbery-fence","kind":"buy","npcId":load("res://scripts/model/wanted_cases.gd").profile(c.culprit).npcId,"item":original,"price":10,"rounds":0,"locked":false,"evidenceUsed":[],"crimeCaseId":c.id,"line":""}
 var cash:float=robbed.cash
 check(NightCrime.lost_item_problem(robbed)=="","marked robbery original needs no serial inspection or purchase")
 var recovered:Dictionary=load("res://scripts/model/commerce.gd").reduce(robbed,{"type":"REPORT_LOST_ITEM","tradeId":"robbery-fence"})
 check(recovered.trade==null and recovered.cash==cash,"alarm arrests without paying for stolen original")
 check(Model.find_inventory(recovered,original.uid)!=null,"same original returned")
 check(recovered.police.caught.has(c.culprit),"culprit remains arrested")
 var saved=JSON.parse_string(JSON.stringify(recovered))
 var prior_json:=JSON.stringify(saved.robbery)
 r.after_arrest(saved,c.culprit)
 check(JSON.stringify(saved.robbery)==prior_json,"arrest outcome never rerolls on reload")
 # The same original keeps its robbery identity if a later night theft transfers custody.
 var transferred:Dictionary=load("res://tests/robbery_fixture.gd").fence()
 var source:Dictionary=transferred.nightCrime.cases[0]
 source.items[0].holder="case-transfer"
 var physical=Model.trade_item(transferred)
 physical.provenanceCaseId=source.id;physical.crimeCaseId="NIGHT-4"
 var later:Dictionary=source.duplicate(true)
 later.id="NIGHT-4";later.kind="night";later.lossDay=4;later.items[0].holder="trade";later.items[0].item=physical.duplicate(true)
 transferred.nightCrime.cases.append(later)
 check(r.marked(transferred,physical),"robbery mark survives later custody transfer")
 check(NightCrime.lost_item_problem(transferred)=="","transferred robbery original still supports direct alarm")
 # Recovery must use holding storage when every warehouse cell is occupied.
 var full:Dictionary=load("res://tests/robbery_fixture.gd").fence()
 var uid:String=full.nightCrime.cases[0].items[0].uid
 for i in 100:
  var filler:=Model.new_item(full,"WCH-001")
  if not Model.put_in(full,filler):break
 var full_result:Dictionary=load("res://scripts/model/commerce.gd").reduce(full,{"type":"REPORT_LOST_ITEM","tradeId":full.trade.id})
 check(Model.find_inventory(full_result,uid)!=null and Model.find_inventory(full_result,uid).location=="recovery","full warehouse returns original to recovery holding")
 check(full_result.inventory.filter(func(it):return it.uid==uid).size()==1,"full warehouse never duplicates recovered original")
 # Arrested regular customers must not return through the loyalty-memory path.
 var journal=load("res://scripts/model/shop_journal.gd")
 journal.ensure(recovered)
 var npc:String=load("res://scripts/model/wanted_cases.gd").profile(c.culprit).npcId
 var memory:Dictionary=journal.customer(recovered,npc)
 memory.deals=3;memory.trust=10;recovered.shopJournal.customers[npc]=memory
 var returned:=false
 for i in 100:
  recovered.cursor=i
  if journal.preferred_npc(recovered,"CHR-004")==npc:returned=true
 check(not returned,"arrested robber cannot return as a loyal regular customer")
 # Saved pending retaliation: must charge once, close one full day, allow debt and next day.
 var e:Dictionary=recovered.robbery.entries[0]
 e.revenge={"day":int(recovered.day)+1,"percent":8,"done":false}
 recovered.phase="report";recovered.cash=1
 var closed:=Model.reduce(recovered,{"type":"NEXT"})
 check(closed.phase=="report" and closed.report.get("closed",false),"attack skips a complete business day")
 check(closed.cash<0,"repair expense can make cash negative")
 var balance:float=closed.cash
 r.open_day(closed)
 check(closed.cash==balance,"same saved attack cannot charge twice")
 var reopened:=Model.reduce(closed,{"type":"NEXT"})
 check(reopened.day==closed.day+1 and reopened.phase=="open","negative cash does not trap the closed day")
 var hits:=0
 for i in 2000:
  var sample:=Model.create("ARREST-%d"%i)
  r.ensure(sample)
  sample.robbery.entries=[{"id":"ROBBERY-3","culprit":"target","onsite":false,"arrestChecked":false}]
  sample.robbery.entries.append({"id":"ROBBERY-4","culprit":"target","onsite":false,"arrestChecked":false})
  r.after_arrest(sample,"target")
  var pending:=0
  for entry in sample.robbery.entries:
   if entry.has("revenge"):pending+=1
  check(pending<=1,"one arrest cannot create multiple retaliation draws")
  var result:Dictionary=sample.robbery.entries[0]
  if result.has("revenge"):
   hits+=1
   check(result.revenge.day>=sample.day+2 and result.revenge.day<=sample.day+7,"retaliation scheduled two to seven days after arrest")
   check(result.revenge.percent>=5 and result.revenge.percent<=8,"repair rate five to eight percent")
  sample.robbery.entries=[{"id":"ROBBERY-3","culprit":"target","onsite":true,"arrestChecked":false}]
  r.after_arrest(sample,"target")
  check(not sample.robbery.entries[0].has("revenge"),"onsite arrest always excludes retaliation")
 check(hits>60 and hits<140,"single retaliation draw has five-percent frequency")
 # Onsite arrest through the real robbery path, with threshold equality.
 var onsite_seed:=""
 for i in 10000:
  var seed:="ONSITE-%d"%i
  if Model.fnv("%s/3/robbery-v1"%seed)%10000<900 and Model.fnv("%s/ROBBERY-3/onsite"%seed)%100<5:onsite_seed=seed;break
 check(onsite_seed!="","deterministic onsite scenario exists")
 s=Model.create(onsite_seed);s.day=2;s.phase="report";s.inventory=[];s.relations.station=60
 for i in 100:s.inventory.append(Model.new_item(s,higher))
 var onsite:=Model.reduce(s,{"type":"NEXT"})
 check(onsite.robbery.entries.size()==1 and onsite.robbery.entries[0].onsite,"station relation sixty allows onsite arrest")
 check(onsite.inventory.size()==100 and onsite.nightCrime.cases.back().arrested,"onsite arrest returns all original watches")
 check(not onsite.robbery.entries[0].has("revenge"),"onsite arrest never schedules revenge")
 s.relations.station=59
 var below:=Model.reduce(s,{"type":"NEXT"})
 check(not below.robbery.entries[0].onsite,"relation below sixty prevents onsite intervention")
 print("ROBBERY retaliation hits=",hits,"/2000 failures=",failures)
 quit(1 if failures else 0)
