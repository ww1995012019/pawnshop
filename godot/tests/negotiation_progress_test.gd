extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
var failures:=0
func _initialize(): call_deferred("run")
func check(ok: bool,label: String):
 print("PROGRESS ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func fixture(direction: String="sell") -> Dictionary:
 var s=Model.create("NEGOTIATION-PROGRESS");s.inventory=[];s.cash=10000;s.ap=12
 var it=Model.new_item(s,"WCH-008",{"condition":0.9,"working":true,"authentic":true,"sourceVerified":true})
 s.relations.salvage=0
 s.trade={"id":"progress","npcId":"CHR-004","kind":direction,"item":it if direction=="buy" else null,"selectedUid":it.uid,"price":40 if direction=="sell" else 100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"","npcKnowledge":{it.uid:{"condition":0.9,"working":true,"authentic":true,"marketFactor":1.0,"risk":0.0,"evidence":{},"appraisedValue":54,"appraisalGrade":"impression","forgerySignature":"","provenance":"claimed"}}}
 if direction=="sell": s.inventory=[it]
 for n in 100:
  s.trade.id="progress-"+str(n)
  var terms=Model.trade_terms(s,s.trade,it)
  if terms.opening==40 and terms.ceiling==51: break
 return s
func offer(s: Dictionary,price: float,evidence=null) -> Dictionary:
 return Model.reduce(s,{"type":"OFFER","price":price,"evidence":evidence})
func progress(s: Dictionary,uid: String) -> Dictionary:
 return s.trade.get("negotiation",{}).get(uid,{}) if s.trade!=null else {}
func batch(s: Dictionary,type: String,extra: Dictionary={}) -> Dictionary:
 return Commerce.reduce(s,{"type":type,"tradeId":s.trade.id}.merged(extra,true))
func stepping_test():
 var s=fixture();var uid=Model.trade_item(s).uid
 var terms=Model.trade_terms(s,s.trade,Model.trade_item(s))
 check(s.trade.price==40 and terms.ceiling==51,"exploit fixture opens at 40Cr with 51Cr ceiling")
 var cash=s.cash;var ap=s.ap;var stock=s.inventory.duplicate(true)
 s=offer(s,70)
 check(s.trade.price==40,"first unsupported demand earns no free 3 percent counter step")
 var patience=int(progress(s,uid).willingness)
 for n in 5:
  var previous=float(s.trade.price)
  s=offer(s,68-n*2)
  check(int(progress(s,uid).willingness)<=patience-1,"2Cr concession spends at least one willingness round "+str(n))
  check(s.trade.price-previous<=1,"2Cr concession gains at most 1Cr counter movement round "+str(n))
  patience=int(progress(s,uid).willingness)
 check(s.trade.rounds==6 and not s.trade.locked,"reasonable discussion remains available beyond three rounds")
 check(s.cash==cash and s.ap==ap and s.inventory==stock,"counter discussion preserves money AP and exact originals")
 for n in 6:
  s=offer(s,58+n)
  if progress(s,uid).get("status","")=="rejected": break
 check(progress(s,uid).get("status","")=="rejected","finite willingness eventually rejects stalled item")
func idempotence_tests():
 check(Model.Negotiation.canonical_evidence("")=="","empty no-evidence sentinel remains valid without JSON parsing")
 var untouched=fixture()
 check(Model.counter_price(untouched,untouched.trade,Model.trade_item(untouched))==40,"reading initial counter creates no movement")
 for direction in ["sell","buy"]:
  var s=fixture(direction);var uid=Model.trade_item(s).uid
  var terms=Model.trade_terms(s,s.trade,Model.trade_item(s))
  var first=float(terms.ceiling+15 if direction=="sell" else terms.floor-10)
  var opening=float(s.trade.price)
  s=offer(s,first)
  check(s.trade.price==opening,"first "+direction+" request does not move quote")
  var saved=JSON.parse_string(JSON.stringify(s));var state_before=progress(saved,uid).duplicate(true)
  for n in 8:
   saved=offer(saved,first)
   check(Model.counter_price(saved,saved.trade,Model.trade_item(saved))==s.trade.price,"duplicate/read after reload retains "+direction+" quote "+str(n))
  check(saved.trade.rounds==s.trade.rounds and progress(saved,uid)==state_before,"duplicate "+direction+" requests spend no rounds or allowance")
  var next=offer(saved,first+(-2 if direction=="sell" else 2))
  check(absf(next.trade.price-s.trade.price)<=1 and progress(next,uid).willingness<state_before.willingness,"real "+direction+" concession bounds quote movement and spends fatigue")
  var stalled=offer(next,first+(-1 if direction=="sell" else 1))
  check(stalled.trade.price==next.trade.price,"worse "+direction+" price grants no counter movement")
  var oscillation=offer(stalled,first+(-2 if direction=="sell" else 2))
  check(oscillation.trade.price==next.trade.price,"replayed best "+direction+" price cannot farm concessions")
 var s=fixture();var uid=Model.trade_item(s).uid
 s.trade.price=80
 s=batch(s,"TRADE_OPEN");TradeSession.session(s).cash=10000;TradeSession.session(s).want_count=8
 s=batch(s,"TRADE_REVIEW")
 var quote=float(TradeSession.row(s,uid).context.price)
 check(quote==40,"initial review of unaffordable ask returns opening without a free step")
 for n in 10: s=batch(s,"TRADE_REVIEW")
 check(TradeSession.row(s,uid).context.price==quote,"repeated batch reviews do not advance initial NPC quote")
 s=batch(s,"TRADE_OFFER",{"uid":uid,"price":70})
 quote=float(TradeSession.row(s,uid).context.price)
 for n in 10: s=batch(s,"TRADE_REVIEW")
 check(TradeSession.row(s,uid).context.price==quote,"reviews after decision do not regenerate its counter")
func evidence_tests():
 var s=fixture();var uid=Model.trade_item(s).uid
 var it=Model.trade_item(s);it.evidence=["TOL-001"];Model.record_inspection(it,"TOL-001")
 s=offer(s,70)
 var before=float(s.trade.price);var patience=int(progress(s,uid).willingness)
 s=offer(s,70,"TOL-001")
 check(s.trade.price>before and progress(s,uid).willingness>=patience,"new shared observation grants one useful allowance")
 var shared=JSON.parse_string(JSON.stringify(s));var quote=float(shared.trade.price)
 var snapshot=progress(shared,uid).duplicate(true)
 shared=offer(shared,70,"TOL-001")
 check(shared.trade.price==quote and progress(shared,uid)==snapshot,"same evidence and request after reload cannot refill allowance")
 shared=offer(shared,71,"TOL-001")
 check(shared.trade.price==quote and progress(shared,uid).willingness<snapshot.willingness,"same evidence with different stalled demand gets no extra counter or patience")
 # Altering obsolete private metadata is not a new observation.
 var hidden=shared.duplicate(true)
 var hidden_item=Model.trade_item(hidden)
 hidden_item.inspectionFacts["TOL-001"].appraisalValue=99999
 hidden_item.inspectionFacts["TOL-001"].appraisalRevision="private-change"
 hidden=offer(hidden,72,"TOL-001")
 check(hidden.trade.price==quote and progress(hidden,uid).willingness<progress(shared,uid).willingness,"private snapshot metadata cannot create new evidence allowance")
 # A genuinely different recorded observation on the same tool can help once.
 var changed=shared.duplicate(true)
 Model.trade_item(changed).inspectionFacts["TOL-001"].condition=0.7
 changed=offer(changed,72,"TOL-001")
 check(changed.trade.price>quote and progress(changed,uid).willingness>=progress(shared,uid).willingness,"new recorded observation earns a distinct bounded allowance")
 # Old saves have no pending allowance; merely reading them must not mint one.
 var legacy=fixture();it=Model.trade_item(legacy)
 legacy.trade.negotiation={it.uid:{"willingness":5,"patience":2,"seenEvidence":[],"requests":[],"lastPlayer":70,"lastCounter":40,"extremes":0,"status":"active","reason":""}}
 for n in 4: check(Model.counter_price(legacy,legacy.trade,it)==40,"legacy save without round cache grants no progress "+str(n))
 var old_cycle=fixture();it=Model.trade_item(old_cycle);uid=it.uid
 old_cycle.trade.negotiation={uid:{"willingness":5,"patience":2,"seenEvidence":[],"requests":[JSON.stringify([65,""]),JSON.stringify([70,""])],"lastPlayer":70,"lastCounter":40,"extremes":0,"status":"active","reason":""}}
 old_cycle=offer(old_cycle,68)
 check(old_cycle.trade.price==40 and progress(old_cycle,uid).willingness==4,"legacy history prevents worse-than-best concession reset")
 var old_evidence=fixture();it=Model.trade_item(old_evidence);uid=it.uid
 it.evidence=["TOL-001"];Model.record_inspection(it,"TOL-001");Model.disclose_evidence(old_evidence.trade,it,"TOL-001")
 var old_key=JSON.stringify(JSON.parse_string(JSON.stringify(["TOL-001",old_evidence.trade.npcKnowledge[uid].evidence["TOL-001"].facts])))
 old_evidence.trade.negotiation={uid:{"willingness":5,"patience":2,"seenEvidence":[old_key],"requests":[JSON.stringify([70,old_key])],"lastPlayer":70,"lastCounter":40,"extremes":0,"status":"active","reason":""}}
 var old_snapshot=progress(old_evidence,uid).duplicate(true)
 var replay=offer(old_evidence,70,"TOL-001")
 check(progress(replay,uid)==old_snapshot and replay.trade.rounds==0,"legacy full-fact evidence identity remains duplicate after upgrade")
 var locked=offer(fixture(),1);var exact=locked.trade.price
 check(progress(locked,Model.trade_item(locked).uid).willingness==7,"accepted nonfresh valid decision also spends one willingness")
 for n in 5: locked=offer(locked,80)
 check(locked.trade.locked and locked.trade.price==exact,"later offers preserve locked exact agreement")
func run():
 stepping_test();idempotence_tests();evidence_tests()
 print("PROGRESS failures=",failures);quit(1 if failures else 0)
