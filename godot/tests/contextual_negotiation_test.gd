extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
var failures:=0
func _initialize(): call_deferred("run")
func check(ok,label):
 print("NEGOTIATION ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func fixture(direction: String="sell",npc: String="CHR-004") -> Dictionary:
 var s=Model.create("CONTEXTUAL");s.inventory=[];s.ap=12;s.cash=10000
 var it=Model.new_item(s,"WCH-008",{"condition":0.9,"working":true,"authentic":true,"sourceVerified":true,"source":"私人旧物，来源待核对"})
 var known={"condition":0.9,"working":true,"authentic":true,"marketFactor":1.0,"risk":0.0,"evidence":{},"appraisedValue":100,"appraisalGrade":"impression","forgerySignature":"","provenance":"unverified"}
 s.trade={"id":"contextual-visit","npcId":npc,"kind":direction,"item":it if direction=="buy" else null,"selectedUid":it.uid,"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"npcKnowledge":{it.uid:known},"line":""}
 if direction=="sell": s.inventory=[it]
 return s
func offer(s: Dictionary,price: float,evidence=null) -> Dictionary:
 return Model.reduce(s,{"type":"OFFER","price":price,"evidence":evidence})
func batch(s: Dictionary,type: String,extra: Dictionary={}) -> Dictionary:
 return Commerce.reduce(s,{"type":type,"tradeId":s.trade.id if s.trade!=null else ""}.merged(extra,true))
func progress(s: Dictionary,uid: String) -> Dictionary:
 return s.trade.get("negotiation",{}).get(uid,{}) if s.trade!=null else {}
func single_tests():
 for direction in ["sell","buy"]:
  var s=fixture(direction)
  var it=Model.trade_item(s);var uid=it.uid
  var terms=Model.trade_terms(s,s.trade,it)
  var start_cash=s.cash;var start_ap=s.ap
  for round_index in 6:
   var price=terms.ceiling+36-round_index*4 if direction=="sell" else terms.floor-36+round_index*4
   s=offer(s,price)
   if s.trade==null: break
  check(s.trade!=null and s.trade.rounds==6 and not s.trade.locked,"six reasonable concessions continue in "+direction+" direction")
  check(s.cash==start_cash and s.ap==start_ap and Model.find_item(s,uid)!=null,"discussion alone never transfers money AP or originals")
 var strict=fixture("sell","CHR-003")
 var before=strict.duplicate(true);var uid=Model.trade_item(strict).uid
 var terms=Model.trade_terms(strict,strict.trade,Model.trade_item(strict))
 strict=offer(strict,ceil(terms.ceiling*2.2))
 check(strict.trade==null and strict.cursor==before.cursor+1 and strict.cash==before.cash and Model.find_inventory(strict,uid)!=null,"first extreme quote can end whole visit without transfer")
 var plain=fixture();uid=Model.trade_item(plain).uid
 var shared=plain.duplicate(true)
 Model.find_inventory(shared,uid).evidence=["TOL-001"]
 Model.record_inspection(Model.find_inventory(shared,uid),"TOL-001")
 var private_only=shared.duplicate(true)
 # Hold public NPC knowledge constant while private truth and private readings differ.
 Model.find_inventory(private_only,uid).working=false
 Model.find_inventory(private_only,uid).authentic=false
 Model.find_inventory(private_only,uid).sourceVerified=false
 var private_terms=Model.trade_terms(private_only,private_only.trade,Model.find_inventory(private_only,uid))
 check(private_terms==Model.trade_terms(plain,plain.trade,Model.trade_item(plain)),"unshared inspections and hidden truth cannot alter known valuation")
 var quote=Model.trade_terms(plain,plain.trade,Model.trade_item(plain)).ceiling+30
 Model.find_inventory(private_only,uid).sourceVerified=true # Keep the existing legal-stock guard satisfied.
 var private_decision=offer(private_only,quote)
 plain=offer(plain,quote);shared=offer(shared,quote,"TOL-001")
 check(private_decision.trade.price==plain.trade.price and progress(private_decision,uid)==progress(plain,uid),"hidden faults and unshared evidence cannot alter NPC response or willingness")
 check(progress(shared,uid).get("willingness",0)>progress(plain,uid).get("willingness",0),"fresh relevant disclosed evidence preserves more willingness")
 check(shared.trade.npcKnowledge[uid].get("provenance","")=="unverified","authenticity inspection never certifies legal provenance")
 var snapshot=JSON.parse_string(JSON.stringify(shared))
 var saved_progress=progress(snapshot,uid).duplicate(true)
 var replay=offer(snapshot,quote,"TOL-001")
 check(replay.trade.rounds==shared.trade.rounds and progress(replay,uid)==saved_progress,"replayed quote and unchanged evidence cannot replenish or spend willingness after reload")
 var no_evidence_replay=offer(plain,quote)
 check(no_evidence_replay.trade.rounds==plain.trade.rounds and progress(no_evidence_replay,uid)==progress(plain,uid),"duplicate quote without evidence is idempotent")
 var repeated_evidence=offer(shared,quote+1,"TOL-001")
 check(progress(repeated_evidence,uid).willingness<progress(shared,uid).willingness,"reusing evidence with a new stalled quote grants no fresh willingness")
 var verified=fixture();uid=Model.trade_item(verified).uid
 verified.trade.npcKnowledge[uid].provenance="verified"
 var unknown=fixture()
 check(Model.trade_terms(verified,verified.trade,Model.trade_item(verified)).ceiling>Model.trade_terms(unknown,unknown.trade,Model.trade_item(unknown)).ceiling,"known verified provenance changes acceptable price")
 var invalid=offer(plain,0)
 check(invalid.trade.rounds==plain.trade.rounds and progress(invalid,uid)==progress(plain,uid),"invalid quote changes no negotiation state")
 var refused=fixture();uid=Model.trade_item(refused).uid
 var base=Model.trade_terms(refused,refused.trade,Model.trade_item(refused)).ceiling+10
 for n in 12:
  refused=offer(refused,base+n)
  if progress(refused,uid).get("status","")=="rejected": break
 var accepted_after_refusal=Model.reduce(refused,{"type":"ACCEPT"})
 check(not accepted_after_refusal.trade.locked,"accept cannot resurrect a per-item refusal from its previous counterprice")
func multi_tests():
 var s=fixture("sell","CHR-003")
 s=batch(s,"TRADE_OPEN");var se=TradeSession.session(s);se.cash=10000;se.want_count=6
 # Finish one batch; a second accepted promise is still pending when the NPC leaves.
 var done_uid=s.inventory[0].uid
 s=batch(s,"TRADE_ADD",{"uid":done_uid,"direction":"sell"});s=batch(s,"TRADE_REVIEW");s=batch(s,"TRADE_CONFIRM",{"uid":done_uid})
 s=batch(s,"TRADE_CHECKOUT",{"version":TradeSession.summary(s).version,"batch":"completed"})
 check(TradeSession.row(s,done_uid).status=="done","walkout fixture has a genuinely completed physical delivery")
 var completed_cash=s.cash;var completed_ap=s.ap;var completed_ledger=s.ledger.duplicate(true)
 var pending=Model.new_item(s,"WCH-008",{"condition":0.9,"working":true,"authentic":true,"sourceVerified":true})
 var offensive=Model.new_item(s,"WCH-008",{"condition":0.9,"working":true,"authentic":true,"sourceVerified":true})
 Model.put_in(s,pending);Model.put_in(s,offensive)
 for it in [pending,offensive]: s=batch(s,"TRADE_ADD",{"uid":it.uid,"direction":"sell"})
 s=batch(s,"TRADE_REVIEW");s=batch(s,"TRADE_CONFIRM",{"uid":pending.uid})
 var line=TradeSession.row(s,offensive.uid)
 line.context.npcKnowledge[offensive.uid].appraisedValue=100
 line.context.npcKnowledge[offensive.uid].provenance="contradictory"
 var terms=Model.trade_terms(s,line.context,TradeSession.item(s,offensive.uid))
 s=batch(s,"TRADE_OFFER",{"uid":offensive.uid,"price":ceil(terms.ceiling*2.2)})
 check(s.trade==null and s.cash==completed_cash and s.ap==completed_ap and s.ledger==completed_ledger,"whole-visit walkout retains completed money AP and ledger only")
 check(Model.find_inventory(s,done_uid)==null and Model.find_inventory(s,pending.uid)!=null and Model.find_inventory(s,offensive.uid)!=null,"walkout voids pending promises without undoing completed physical delivery")
 check(s.npcTrade["CHR-003"].owned.any(func(it):return it.uid==done_uid),"walkout persists NPC ownership of completed purchases")
 # Exhausting discussion on one item need not abandon the other originals.
 var partial=fixture();var first=Model.trade_item(partial).uid
 partial=batch(partial,"TRADE_OPEN")
 TradeSession.session(partial).cash=10000;TradeSession.session(partial).want_count=6
 var other=Model.new_item(partial,"WCH-008",{"condition":0.9,"working":true,"authentic":true,"sourceVerified":true})
 Model.put_in(partial,other)
 partial=batch(partial,"TRADE_ADD",{"uid":other.uid,"direction":"sell"});partial=batch(partial,"TRADE_REVIEW");partial=batch(partial,"TRADE_CONFIRM",{"uid":other.uid})
 var row=TradeSession.row(partial,first)
 var base=Model.trade_terms(partial,row.context,TradeSession.item(partial,first)).ceiling+10
 for n in 12:
  partial=batch(partial,"TRADE_OFFER",{"uid":first,"price":base+n})
  if partial.trade==null or TradeSession.row(partial,first).status=="rejected": break
 check(partial.trade!=null and TradeSession.row(partial,first).status=="rejected","stalled moderate discussion refuses only the current item")
 check(TradeSession.row(partial,other.uid).selected and TradeSession.row(partial,other.uid).status=="confirmed","per-item refusal retains other accepted promises")
 var dialogue=CounterDialogue.begin(fixture("sell","CHR-003"))
 var focused=CounterDialogue.current(dialogue)
 var extreme=ceil(Model.trade_terms(dialogue,focused.context,TradeSession.item(dialogue,focused.uid)).ceiling*2.2)
 var departed=Commerce.reduce(dialogue,CounterDialogue.action_for(dialogue,"OFFER",{"price":extreme}))
 check(departed.trade==null and departed.cash==dialogue.cash,"natural dialogue handles immediate whole-visit departure without stale-row access")
 for direction in ["sell","buy"]:
  var discussion=CounterDialogue.begin(fixture(direction))
  var active=CounterDialogue.current(discussion)
  var limits=Model.trade_terms(discussion,active.context,TradeSession.item(discussion,active.uid))
  for round_index in 6:
   var price=limits.ceiling+36-round_index*4 if direction=="sell" else limits.floor-36+round_index*4
   discussion=Commerce.reduce(discussion,CounterDialogue.action_for(discussion,"OFFER",{"price":price}))
   if discussion.trade==null: break
  check(discussion.trade!=null and discussion.trade.rounds==6 and not discussion.trade.locked,"natural multi-item "+direction+" discussion permits six reasonable rounds")
func run():
 single_tests();multi_tests()
 print("NEGOTIATION failures=",failures);quit(1 if failures else 0)
