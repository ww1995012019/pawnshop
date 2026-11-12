extends SceneTree
const Journal = preload("res://scripts/model/shop_journal.gd")
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
 print("STORY RECEIPTS ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func fresh() -> Dictionary:
 var s:=Model.create("STORY-RECEIPTS")
 s.inventory=[]
 s.cash=1000
 s.materials["MAT-007"]=10
 s.materials["MAT-001"]=10
 s.storeCosts={"days":{}}
 Journal.ensure(s)
 return s
func entrust(s: Dictionary, original: Dictionary) -> Dictionary:
 var previous:=s.duplicate(true)
 s.inventory.append(original.duplicate(true))
 Journal.observe(previous,s,{"type":"TAKE_SERVICE_CONTRACT","uid":original.uid})
 return s
func work(s: Dictionary, uid: String, material: String, usage_id: String, cents: int) -> Dictionary:
 var previous:=s.duplicate(true)
 s.materials[material]-=1
 var day:=str(int(s.day))
 if not s.storeCosts.days.has(day): s.storeCosts.days[day]={"usage":{}}
 s.storeCosts.days[day].usage[usage_id]={"key":"service|%s|%s" % [uid,usage_id],"cents":cents}
 var action: Dictionary={"type":"SERVICE_COMPLETE","uid":uid,"task":usage_id}
 Journal.observe(previous,s,action)
 Journal.observe(previous,s,action)
 return s
func settle(s: Dictionary, uid: String, id: String, kind: String, amount: float, remove: bool=true) -> Dictionary:
 var previous:=s.duplicate(true)
 Model.ledger(s,id,kind,"已记录服务款项",amount)
 s.ledger.back().merge({"uid":uid,"npcId":"CHR-005","defId":"WCH-001"})
 if remove: Model._remove_item(s,uid)
 var action: Dictionary={"type":"DELIVER_SERVICE_CONTRACT","uid":uid,"id":id}
 var unchanged:=s.duplicate(true);unchanged.erase("shopJournal")
 Journal.observe(previous,s,action)
 var observed:=s.duplicate(true);observed.erase("shopJournal")
 check(observed==unchanged,"observing settlement changes no cash, AP, ledger or physical original")
 var count:=Journal.receipts(s).size()
 var recorded:=JSON.stringify(s.shopJournal.recordedCosts)
 Journal.observe(previous,s,action)
 check(Journal.receipts(s).size()==count and JSON.stringify(s.shopJournal.recordedCosts)==recorded,"repeated settlement observation preserves receipt and cost baselines")
 return s
func run() -> void:
 GameData.ensure()
 var s:=fresh()
 var original:=Model.new_item(s,"WCH-001",{"owner":"customer","cost":0})
 var uid: String=original.uid
 s=entrust(s,original)
 s=work(s,uid,"MAT-007","first-service",150)
 var first_material:=float(GameData.material("MAT-007").price)
 var second_material:=float(GameData.material("MAT-001").price)
 check(not s.shopJournal.recordedCosts[uid].has("consumedMaterial"),"inspection and physical work cannot pre-consume unsettled service costs")
 s=settle(s,uid,"service-first","service-job",80)
 var first: Dictionary=Journal.latest_receipt(s)
 check(first.entries[0].materialCost==first_material and first.entries[0].electricityCost==1.5 and first.entries[0].recordedMargin==80-first_material-1.5,"first paid service bills only its recorded direct costs")
 check(s.shopJournal.recordedCosts[uid].get("consumedMaterial",-1)==first_material and s.shopJournal.recordedCosts[uid].get("consumedElectricity",-1)==1.5,"actual paid service persists known material and power baselines")
 var first_paid:=s.duplicate(true)
 s.day=3
 s=entrust(s,original)
 s=work(s,uid,"MAT-001","warranty-rework",50)
 check(s.shopJournal.recordedCosts[uid].materials==first_material+second_material and s.shopJournal.recordedCosts[uid].electricity==2.0,"same original retains lifetime material and power costs across return")
 s=JSON.parse_string(JSON.stringify(s))
 Journal.ensure(s)
 s=settle(s,uid,"service-warranty","service-job",20)
 var second: Dictionary=Journal.latest_receipt(s)
 check(second.entries[0].uid==uid and second.entries[0].materialCost==second_material and second.entries[0].electricityCost==0.5 and second.entries[0].recordedMargin==20-second_material-0.5,"same-UID paid rework subtracts only costs since the prior paid service")
 check(Journal.receipts(s)[0].entries[0].materialCost==first_material and Journal.receipts(s)[0].entries[0].electricityCost==1.5,"later rework cannot rewrite an earlier settlement's cost allocation")
 check(Journal.customer(s,"CHR-005").deals==2,"two actual paid services count as two settlements")
 var refund_before:=s.duplicate(true)
 s=settle(s,uid,"service-refund-1","service-refund",-20,false)
 var refund: Dictionary=Journal.latest_receipt(s)
 check(refund.id!=second.id and refund.cashImpact==-20 and refund.entries[0].direction=="return" and refund.entries[0].recordedMargin==null,"refund is a distinct negative-cash return receipt with no invented profit")
 check(refund.entries[0].materialCost==0 and refund.entries[0].electricityCost==0,"refund does not charge an original's prior operating costs again")
 check(Journal.customer(s,"CHR-005").deals==2 and Journal.customer(s,"CHR-005").trust==Journal.customer(refund_before,"CHR-005").trust,"refund creates neither a successful deal nor clean-deal trust")
 check(s.shopJournal.recordedCosts[uid].get("consumedMaterial",-1)==first_material+second_material and s.shopJournal.recordedCosts[uid].get("consumedElectricity",-1)==2.0,"refund leaves actual paid-service cost baselines intact")
 s=entrust(s,original)
 Model.find_inventory(s,uid).owner="shop"
 s=settle(s,uid,"original-purchase","purchase",-30,false)
 s=settle(s,uid,"original-sale","sale",100)
 var sale: Dictionary=Journal.latest_receipt(s)
 check(sale.entries[0].materialCost==first_material+second_material and sale.entries[0].electricityCost==2.0 and sale.entries[0].recordedMargin==100-30-first_material-second_material-2.0,"eventual shop sale retains lifetime direct costs despite prior service baselines")
 var upgrade:=first_paid.duplicate(true)
 upgrade.shopJournal.recordedCosts[uid].erase("consumedMaterial")
 upgrade.shopJournal.recordedCosts[uid].erase("consumedElectricity")
 upgrade.shopJournal.recordedCosts[uid].erase("serviceBaselineLedgerId")
 for receipt in upgrade.shopJournal.receipts:
  for entry in receipt.entries:
   entry.erase("cumulativeMaterialCost")
   entry.erase("cumulativeElectricityCost")
 upgrade.day=3
 upgrade=entrust(upgrade,original)
 upgrade=work(upgrade,uid,"MAT-001","older-journal-return",50)
 Journal.ensure(upgrade)
 upgrade=settle(upgrade,uid,"upgrade-rework","service",20)
 check(Journal.latest_receipt(upgrade).entries[0].materialCost==second_material and Journal.latest_receipt(upgrade).entries[0].electricityCost==0.5,"older live paid receipt recovers its baseline without consuming newer unsettled work")
 var historic:=fresh()
 historic.inventory=[original.duplicate(true)]
 historic.ledger=[{"id":"historic-service","kind":"service-job","uid":uid,"npcId":"CHR-005","defId":"WCH-001","day":1,"amount":80},{"id":"historic-refund","kind":"service-refund","uid":uid,"npcId":"CHR-005","defId":"WCH-001","day":2,"amount":-80}]
 historic.storeCosts={"days":{"1":{"usage":{"historic":{"key":"service|%s|historic" % uid,"cents":150}}}}}
 historic.erase("shopJournal")
 Journal.ensure(historic)
 check(Journal.receipts(historic).size()==2 and Journal.latest_receipt(historic).entries[0].direction=="return" and not Journal.latest_receipt(historic).complete,"historic refunds import as honest incomplete return receipts")
 check(Journal.customer(historic,"CHR-005").deals==1 and not historic.shopJournal.recordedCosts[uid].has("consumedMaterial"),"historic refunds do not count deals and imported service cannot invent a consumed-cost baseline")
 var once:=JSON.stringify(historic.shopJournal)
 Journal.ensure(historic)
 check(JSON.stringify(historic.shopJournal)==once,"historical refund migration is idempotent")
 historic.day=3
 historic=work(historic,uid,"MAT-001","new-work-after-import",50)
 historic=settle(historic,uid,"observed-after-import","service-job",20)
 check(not Journal.latest_receipt(historic).complete and not Journal.latest_receipt(historic).entries[0].complete and Journal.latest_receipt(historic).entries[0].note.contains("不完整"),"observed service never upgrades incomplete historical cost knowledge to complete")
 var unpaid:=fresh()
 unpaid=entrust(unpaid,original)
 unpaid=work(unpaid,uid,"MAT-007","unpaid-work",100)
 unpaid=settle(unpaid,uid,"unpaid-service","service-job",0)
 check(not unpaid.shopJournal.recordedCosts[uid].has("consumedMaterial"),"zero service payment does not establish a paid-service baseline")
 print("STORY RECEIPTS failures=",failures)
 for player in root.find_children("*","AudioStreamPlayer",true,false):
  player.stop()
  player.stream=null
 await process_frame
 quit(1 if failures else 0)
