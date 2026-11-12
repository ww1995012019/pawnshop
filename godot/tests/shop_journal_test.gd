extends SceneTree
var failures := 0
var journal
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
 print("JOURNAL ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func run() -> void:
 GameData.ensure()
 journal = load("res://scripts/model/shop_journal.gd")
 check(journal != null,"journal module exists")
 if journal == null:
  quit(1)
  return
 var s := Model.create("JOURNAL")
 var original := s.duplicate(true)
 s.inventory[0].evidence=["TOL-001"]
 s.inventory[0].repaired=true
 s.inventory[0].authentic=false
 original=s.duplicate(true)
 journal.ensure(s)
 var once: String=JSON.stringify(s.shopJournal)
 journal.ensure(s)
 check(JSON.stringify(s.shopJournal)==once,"legacy migration is idempotent")
 var stripped:=s.duplicate(true);stripped.erase("shopJournal")
 check(stripped==original,"migration changes no money, AP, items or other state")
 var coll: Dictionary=journal.collection(s,s.inventory[0].defId)
 check(coll.handled>=1 and coll.inspected>=1 and coll.repaired>=1 and not coll.has("authentic"),"collection imports known work without hidden authenticity")
 var saved: Dictionary=JSON.parse_string(JSON.stringify(s))
 journal.ensure(saved)
 check(JSON.stringify(JSON.parse_string(JSON.stringify(saved.shopJournal)))==JSON.stringify(JSON.parse_string(once)),"journal survives JSON round trip")
 check(journal.price_multiplier(s,"CHR-001")==1.0 and journal.preferred_npc(s,"CHR-002")=="CHR-002","no invented customer trust or referrals")
 var prev:=s.duplicate(true)
 s.trade={"id":"visit-1","npcId":"CHR-001","kind":"sell","item":null}
 journal.observe(prev,s,{"type":"ARRIVE"})
 journal.observe(prev,s,{"type":"ARRIVE"})
 check(journal.customer(s,"CHR-001").visits==1,"one actual arrival, even after repeated observation")
 prev=s.duplicate(true)
 var sale: Dictionary=s.inventory[0].duplicate(true)
 var incoming:=Model.new_item(s,"WCH-003",{"owner":"npc","cost":0})
 prev.trade.session={"goods":[incoming],"acquired":[],"lines":[]}
 journal.ensure(prev)
 s=prev.duplicate(true)
 s.inventory.remove_at(0)
 incoming=incoming.duplicate(true);incoming.owner="shop";incoming.cost=80
 s.inventory.append(incoming)
 s.ledger.append({"id":"visit-1/batch-1/"+sale.uid,"day":s.day,"kind":"sale","amount":150,"cost":sale.cost})
 s.ledger.append({"id":"visit-1/batch-1/"+incoming.uid,"day":s.day,"kind":"purchase","amount":-80,"cost":80})
 s.cash+=70
 journal.observe(prev,s,{"type":"TRADE_CHECKOUT","batch":"batch-1"})
 var receipt: Dictionary=journal.latest_receipt(s)
 check(receipt.entries.size()==2 and receipt.cashImpact==70,"one batch receipt has distinct sale and acquisition")
 check(receipt.entries[0].uid==sale.uid and receipt.entries[1].uid==incoming.uid,"checkout ledger suffix identifies originals")
 check(receipt.entries[0].complete==false and receipt.entries[0].recordedMargin==null,"old repair and acquisition costs remain explicitly unknown")
 check(receipt.entries[1].direction=="acquisition" and receipt.entries[1].recordedMargin==null,"buying is acquisition and never profit")
 var stable_id: String=receipt.id
 journal.observe(prev,s,{"type":"TRADE_CHECKOUT","batch":"batch-1"})
 check(journal.receipts(s).size()==1 and journal.latest_receipt(s).id==stable_id and journal.customer(s,"CHR-001").deals==1,"settlement, receipt and trust cannot repeat")
 check(journal.greeting(s,"CHR-001").contains("交割"),"greeting refers to an actual deal")
 prev=s.duplicate(true)
 var uid: String=incoming.uid
 var item: Dictionary=Model.find_inventory(s,uid)
 s.materials["MAT-007"]=int(s.materials.get("MAT-007",0))-1
 item.repaired=true
 item.service.finished=true
 s.storeCosts={"days":{"1":{"usage":{"repair":{"key":"service|"+uid+"|test","cents":150}}}}}
 journal.observe(prev,s,{"type":"SERVICE_FINISH","uid":uid})
 journal.observe(prev,s,{"type":"SERVICE_FINISH","uid":uid})
 var costs: Dictionary=s.shopJournal.recordedCosts[uid]
 check(costs.materials==GameData.material("MAT-007").price and costs.electricity==1.5,"actual material and attributable electricity are recorded once")
 check(journal.timeline(s,uid).size()>=2,"physical original has factual timeline")
 var cash: float=s.cash;var ap: float=s.ap
 prev=s.duplicate(true)
 s.trade=null
 s.ledger.append({"id":"legacy-sale","kind":"sale","day":1,"amount":200,"cost":80})
 prev.trade={"id":"legacy-sale","npcId":"CHR-001","kind":"sell","selectedUid":uid,"price":200}
 s.inventory=s.inventory.filter(func(it):return it.uid!=uid)
 journal.observe(prev,s,{"type":"DELIVER","tradeId":"legacy-sale"})
 receipt=journal.latest_receipt(s)
 check(receipt.entries[0].uid==uid and receipt.entries[0].acquisitionCost==80,"legacy delivery resolves selected original and keeps acquisition separate")
 check(s.cash==cash and s.ap==ap,"observer changes no cash or AP")
 var hidden:=Model.create("HIDDEN")
 hidden.inventory[0].authentic=false
 journal.ensure(hidden)
 prev=hidden.duplicate(true)
 hidden.trade={"id":"known-1","kind":"sell","npcId":"CHR-002","forgeryChecks":{hidden.inventory[0].uid:{"logo":"caught"}}}
 journal.observe(prev,hidden,{"type":"ARRIVE"})
 check(journal.customer(hidden,"CHR-002").trust<0,"explicitly discovered forgery damages trust")
 var fresh:=Model.create("FRESH-COSTS")
 journal.ensure(fresh)
 prev=fresh.duplicate(true)
 var lot:=Model.new_item(fresh,"WCH-008",{"owner":"npc"})
 fresh.trade={"id":"fresh-visit","npcId":"CHR-003","kind":"buy","item":lot}
 journal.observe(prev,fresh,{"type":"ARRIVE"})
 prev=fresh.duplicate(true)
 lot=lot.duplicate(true);lot.owner="shop";lot.cost=60
 fresh.inventory.append(lot)
 fresh.ledger.append({"id":"fresh-visit","day":1,"kind":"purchase","amount":-60,"cost":60})
 fresh.trade=null
 journal.observe(prev,fresh,{"type":"DELIVER"})
 prev=fresh.duplicate(true)
 var owned: Dictionary=Model.find_inventory(fresh,lot.uid)
 owned.cost+=GameData.material("MAT-007").price
 fresh.materials["MAT-007"]-=1
 journal.observe(prev,fresh,{"type":"SERVICE_COMPLETE","uid":lot.uid})
 prev=fresh.duplicate(true)
 fresh.ledger.append({"id":"fresh-sale","uid":lot.uid,"npcId":"CHR-003","day":1,"kind":"sale","amount":200,"cost":owned.cost})
 Model._remove_item(fresh,lot.uid)
 journal.observe(prev,fresh,{"type":"DELIVER"})
 receipt=journal.latest_receipt(fresh)
 check(receipt.entries[0].complete and receipt.entries[0].acquisitionCost==60 and receipt.entries[0].materialCost==GameData.material("MAT-007").price and receipt.entries[0].recordedMargin==140-GameData.material("MAT-007").price,"live costs keep acquisition and materials separate despite aggregated item cost")
 check(journal.customer(fresh,"CHR-003").deals==2 and journal.price_multiplier(fresh,"CHR-003")>1.0,"actual clean settlements build bounded customer trust")
 var returns:=0
 var deterministic:=true
 for day in range(1,25):
  fresh.day=day
  var preferred: String=journal.preferred_npc(fresh,"CHR-004")
  if preferred=="CHR-003": returns+=1
  deterministic=deterministic and preferred==journal.preferred_npc(fresh,"CHR-004")
 check(deterministic,"return scheduling is deterministic")
 check(journal.customer(fresh,"CHR-003").referrals==0,"good business does not invent referrals that never arrived")
 check(returns>0 and returns<24,"real customers return occasionally after actual trade")
 var contract:=Model.create("SERVICE-MEMORY")
 journal.ensure(contract)
 contract.serviceContracts={"entries":[{"id":"contract-1","npcId":"CHR-005","status":"available","uid":""}]}
 prev=contract.duplicate(true)
 var service_original:=Model.new_item(contract,"WCH-001",{"owner":"customer"})
 contract.inventory.append(service_original)
 contract.serviceContracts.entries[0].status="diagnosis"
 contract.serviceContracts.entries[0].uid=service_original.uid
 journal.observe(prev,contract,{"type":"TAKE_SERVICE_CONTRACT","id":"contract-1"})
 check(journal.customer(contract,"CHR-005").visits==1 and journal.customer(contract,"CHR-005").deals==0,"contract acceptance records real acquaintance without invented deal")
 prev=contract.duplicate(true)
 Model.find_inventory(contract,service_original.uid).repaired=true
 journal.observe(prev,contract,{"type":"SERVICE_FINISH","uid":service_original.uid})
 check(journal.customer(contract,"CHR-005").repairs==1,"completed physical repair belongs to original customer")
 prev=contract.duplicate(true)
 contract.ledger.append({"id":"service-job-contract-1","uid":service_original.uid,"npcId":"CHR-005","defId":service_original.defId,"kind":"service-job","amount":90,"cost":0,"day":1})
 Model._remove_item(contract,service_original.uid)
 contract.serviceContracts.entries[0].status="complete"
 journal.observe(prev,contract,{"type":"DELIVER_SERVICE_CONTRACT","id":"contract-1"})
 check(journal.customer(contract,"CHR-005").deals==1 and journal.latest_receipt(contract).entries[0].direction=="service" and journal.latest_receipt(contract).entries[0].acquisitionCost==0,"service job receipt bills service without a fictitious acquisition")
 var archive:=Model.create("ARCHIVE")
 archive.ledger=[{"id":"archival-sale","uid":"departed-original","defId":"WCH-001","npcId":"CHR-003","kind":"sale","amount":100,"cost":20,"day":1}]
 archive.storeCosts={"days":{"1":{"usage":{"old":{"key":"service|"+String(archive.inventory[0].uid)+"|test","cents":100}}}}}
 journal.ensure(archive)
 check(journal.latest_receipt(archive).entries[0].uid=="departed-original" and not journal.latest_receipt(archive).complete,"identified historical departures import without claiming missing costs")
 check(archive.shopJournal.recordedCosts[archive.inventory[0].uid].electricity==1.0,"known historical electricity is retained without inventing material costs")
 var historical:=Model.create("HISTORICAL-BATCH")
 historical.ledger=[{"id":"old-visit/old-batch/departed-1","uid":"departed-1","defId":"WCH-001","npcId":"CHR-002","kind":"sale","amount":100,"cost":30,"day":1},{"id":"old-visit/old-batch/departed-2","uid":"departed-2","defId":"WCH-002","npcId":"CHR-002","kind":"sale","amount":120,"cost":40,"day":1}]
 journal.ensure(historical)
 check(journal.receipts(historical).size()==1 and journal.latest_receipt(historical).entries.size()==2 and journal.customer(historical,"CHR-002").deals==1,"identified historical batch is one settlement and one customer memory")
 var bulk = load("res://scripts/model/bulk_crates.gd")
 var crate:=Model.create("JOURNAL-BULK")
 crate.inventory=[]
 crate.cash=100000
 crate.trade={"id":"journal-bulk-merchant","kind":"merchant","npcId":"CHR-010","item":null,"locked":false}
 journal.ensure(crate)
 var offer: Dictionary=bulk.offer(crate)
 crate.bulkCrates.days[Model.jnum(crate.day)].price=703
 prev=crate.duplicate(true)
 crate=bulk.reduce(crate,{"type":"BUY_BULK_CRATE","id":offer.id})
 var untouched:=crate.duplicate(true);untouched.erase("shopJournal")
 journal.observe(prev,crate,{"type":"BUY_BULK_CRATE","id":offer.id})
 receipt=journal.latest_receipt(crate)
 check(receipt.get("entries",[]).size()==4 and receipt.get("npcId","")=="CHR-010" and receipt.get("cashImpact",0)==-703,"actual bulk purchase creates four-entry merchant acquisition receipt")
 var exact_bulk: bool=receipt.get("entries",[]).size()==4
 var bulk_total:=0.0
 for entry in receipt.get("entries",[]):
  var purchased=Model.find_inventory(crate,entry.uid)
  exact_bulk=exact_bulk and purchased!=null and entry.direction=="acquisition" and entry.acquisitionCost==purchased.cost and entry.price==purchased.cost and entry.recordedMargin==null
  bulk_total+=float(entry.cashImpact)
 check(exact_bulk and bulk_total==crate.ledger.back().amount,"bulk per-original receipt uses allocated original costs and exact ledger total")
 var observed:=crate.duplicate(true);observed.erase("shopJournal")
 check(observed==untouched,"bulk journal observation writes no cash, AP, originals or ledger")
 journal.observe(prev,crate,{"type":"BUY_BULK_CRATE","id":offer.id})
 check(journal.receipts(crate).size()==1 and journal.customer(crate,"CHR-010").deals==1,"bulk receipt and merchant memory are exactly once")
 var old_crate:=crate.duplicate(true)
 old_crate.erase("shopJournal")
 old_crate.inventory[0].cost+=GameData.material("MAT-007").price
 old_crate.inventory[0].repaired=true
 old_crate.ledger.back().npcId="CHR-010"
 journal.ensure(old_crate)
 var old_receipt: Dictionary=journal.latest_receipt(old_crate)
 var historical_bulk: bool=old_receipt.get("entries",[]).size()==4 and not old_receipt.get("complete",true)
 var historical_total:=0.0
 for entry in old_receipt.get("entries",[]):
  historical_bulk=historical_bulk and not entry.complete and entry.acquisitionCost!=null and entry.acquisitionCost!=old_crate.inventory[0].cost
  historical_total+=float(entry.cashImpact)
 check(historical_bulk and historical_total==-703,"historic bulk preserves known purchase allocation without treating later repairs as acquisition or claiming complete costs")
 var masked:=Model.create("JOURNAL-MASK")
 masked.inventory=[]
 var disguised:=Model.new_item(masked,"WCH-023")
 disguised.forgery={"targetId":"WCH-033","methods":{}}
 for method in ["case","logo","serial","weight"]: WatchForgery.apply(disguised,method)
 masked.inventory.append(disguised)
 journal.ensure(masked)
 check(journal.collection(masked,"WCH-033").handled==1 and journal.collection(masked,"WCH-023").handled==0,"collection records public casing model without exposing hidden underlying model")
 var public_original: Dictionary=masked.shopJournal.originals[disguised.uid]
 check(public_original.defId=="WCH-033" and public_original.name==GameData.def("WCH-033").name,"stored original identity uses public appearance model and name")
 prev=masked.duplicate(true)
 masked.ledger.append({"id":"masked-sale","uid":disguised.uid,"defId":"WCH-023","npcId":"CHR-003","kind":"sale","amount":100,"day":1,"label":WatchForgery.sale_name(disguised)})
 Model._remove_item(masked,disguised.uid)
 journal.observe(prev,masked,{"type":"DELIVER"})
 var public_text:=JSON.stringify(masked.shopJournal)
 check(journal.latest_receipt(masked).entries[0].name==GameData.def("WCH-033").name and not public_text.contains(GameData.def("WCH-023").name) and not public_text.contains('"WCH-023"'),"sale receipt and history never reveal hidden original through ledger name or metadata")
 var hidden_archive:=Model.create("JOURNAL-HIDDEN-ARCHIVE")
 hidden_archive.inventory=[disguised.duplicate(true)]
 hidden_archive.ledger=[{"id":"hidden-old","uid":disguised.uid,"defId":"WCH-023","kind":"sale","amount":100,"day":1,"label":WatchForgery.sale_name(disguised)}]
 journal.ensure(hidden_archive)
 check(not JSON.stringify(hidden_archive.shopJournal).contains(GameData.def("WCH-023").name) and journal.latest_receipt(hidden_archive).entries[0].name==GameData.def("WCH-033").name,"historical ledger labels cannot disclose a masked watch's hidden model")
 var departed_hidden:=Model.create("JOURNAL-DEPARTED-HIDDEN")
 departed_hidden.inventory=[]
 departed_hidden.ledger=hidden_archive.ledger.duplicate(true)
 journal.ensure(departed_hidden)
 check(journal.latest_receipt(departed_hidden).entries[0].name=="未登记型号" and journal.collection(departed_hidden,"WCH-023").handled==0 and not JSON.stringify(departed_hidden.shopJournal).contains(GameData.def("WCH-023").name),"historical departure with only private model metadata keeps public model unknown")
 var cached_hidden:=hidden_archive.duplicate(true)
 cached_hidden.shopJournal.originals[disguised.uid].defId="WCH-023"
 cached_hidden.shopJournal.originals[disguised.uid].name=GameData.def("WCH-023").name
 cached_hidden.shopJournal.receipts[0].entries[0].name=GameData.def("WCH-023").name
 for event in cached_hidden.shopJournal.histories[disguised.uid]:
  if event.id=="ledger/hidden-old": event.text=WatchForgery.sale_name(disguised)
 journal.ensure(cached_hidden)
 check(not JSON.stringify(cached_hidden.shopJournal).contains(GameData.def("WCH-023").name) and journal.collection(cached_hidden,"WCH-023").handled==0,"existing journal caches refresh public names and remove raw ledger-label disclosures")
 var stale_sale:=cached_hidden.duplicate(true)
 stale_sale.shopJournal.originals[disguised.uid].defId="WCH-023"
 stale_sale.shopJournal.originals[disguised.uid].name=GameData.def("WCH-023").name
 var stale_before:=stale_sale.duplicate(true)
 stale_sale.ledger.append({"id":"stale-masked-sale","uid":disguised.uid,"kind":"sale","amount":110,"day":1})
 Model._remove_item(stale_sale,disguised.uid)
 journal.observe(stale_before,stale_sale,{"type":"DELIVER"})
 check(journal.latest_receipt(stale_sale).entries[0].name==GameData.def("WCH-033").name,"sale refreshes an older cached identity from the observable original before it leaves")
 var metadata_crate:=Model.create("JOURNAL-BULK-METADATA")
 # Independent actual purchase, retaining its row-level merchant attribution.
 metadata_crate.inventory=[]
 metadata_crate.cash=100000
 metadata_crate.trade={"id":"metadata-merchant","kind":"merchant","npcId":"CHR-010","item":null,"locked":false}
 journal.ensure(metadata_crate)
 var metadata_offer: Dictionary=bulk.offer(metadata_crate)
 var metadata_before:=metadata_crate.duplicate(true)
 metadata_crate=bulk.reduce(metadata_crate,{"type":"BUY_BULK_CRATE","id":metadata_offer.id})
 metadata_crate.ledger.back().npcId="CHR-009"
 journal.observe(metadata_before,metadata_crate,{"type":"BUY_BULK_CRATE","id":metadata_offer.id})
 check(journal.latest_receipt(metadata_crate).npcId=="CHR-009" and journal.customer(metadata_crate,"CHR-009").deals==1,"explicit bulk ledger merchant metadata takes precedence over incidental current trade")
 var old_departed_cache:=masked.duplicate(true)
 old_departed_cache.shopJournal.originals[disguised.uid].defId="WCH-023"
 old_departed_cache.shopJournal.originals[disguised.uid].name=GameData.def("WCH-023").name
 old_departed_cache.shopJournal.originals[disguised.uid].erase("publicModelRecorded")
 old_departed_cache.shopJournal.receipts[0].entries[0].name=GameData.def("WCH-023").name
 journal.ensure(old_departed_cache)
 check(journal.latest_receipt(old_departed_cache).entries[0].name=="未登记型号" and journal.collection(old_departed_cache,"WCH-023").handled==0,"pre-patch departed cached identity without public provenance migrates to unknown")
 print("JOURNAL failures=",failures)
 for player in root.find_children("*", "AudioStreamPlayer", true, false):
  player.stop()
  player.stream=null
 await process_frame
 quit(1 if failures else 0)
