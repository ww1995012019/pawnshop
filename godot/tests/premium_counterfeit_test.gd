extends SceneTree
const Commerce = preload("res://scripts/model/commerce.gd")
var failures := 0
func _initialize(): call_deferred("run")
func check(ok, message):
 print("PREMIUM ", "PASS " if ok else "FAIL ", message)
 if not ok: failures += 1
func forge(s: Dictionary, uid: String, method: String) -> Dictionary:
 s = Model.reduce(s,{"type":"SERVICE_PROGRESS","uid":uid,"task":"forge_"+method,"progress":{"task":"forge_"+method,"complete":true,"opened":false}})
 return Commerce.reduce(s,{"type":"FORGE","uid":uid,"method":method})
func run():
 var s = Model.create("PREMIUM")
 s.ap=20
 for material in GameData.materials: s.materials[material.id]=20
 var it = Model.new_item(s,"WCH-023",{"condition":0.8,"working":false,"authentic":true})
 Model.put_in(s,it)
 var uid: String=it.uid
 var truth = Model.item_value(it)
 var targets: Array = WatchForgery.compatible_targets(it)
 check(targets.has("WCH-033") and not targets.has("WCH-001") and not targets.has("WCH-007"),"only higher compatible shape/movement targets")
 var untouched = s.duplicate(true)
 var invalid = Commerce.reduce(s,{"type":"FORGE_TARGET","uid":uid,"target":"WCH-001"})
 check(WatchForgery.target_id(Model.find_inventory(invalid,uid))=="","invalid target rejected")
 s = Commerce.reduce(s,{"type":"FORGE_TARGET","uid":uid,"target":"WCH-033"})
 it=Model.find_inventory(s,uid)
 check(WatchForgery.target_id(it)=="WCH-033" and it.defId=="WCH-023","chosen target preserves original identity")
 check(not WatchForgery.is_targeted(it) and WatchForgery.perceived_base(it)==GameData.def(it.defId).value and s.ap==untouched.ap and s.materials==untouched.materials,"selection has no price, art or cost benefit")
 check(Commerce.forgery_problem(s,it,"serial").contains("换壳"),"case must precede serial")
 var old_ap=s.ap
 s=forge(s,uid,"logo");it=Model.find_inventory(s,uid)
 check(WatchForgery.is_targeted(it) and WatchForgery.logo_id(it)=="WCH-033" and WatchForgery.appearance_id(it)=="WCH-023","logo changes independently of case")
 check(s.ap==old_ap-1 and Model.item_value(it)==truth and not it.working,"logo charges once without changing true worth or faults")
 var repeat=forge(s,uid,"logo")
 check(repeat.ap==s.ap and repeat.materials==s.materials,"duplicate completion costs nothing")
 var changed=Commerce.reduce(s,{"type":"FORGE_TARGET","uid":uid,"target":"WCH-029"})
 check(WatchForgery.target_id(Model.find_inventory(changed,uid))=="WCH-033","target locked after work")
 var mass=WatchRules.mass(it)
 s=forge(s,uid,"case");it=Model.find_inventory(s,uid)
 check(WatchForgery.appearance_id(it)=="WCH-033" and WatchRules.mass(it)>mass,"case changes actual exterior and measured mass")
 check(not it.working and it.defId=="WCH-023","case preserves original movement identity and internal faults")
 s=forge(s,uid,"serial");it=Model.find_inventory(s,uid)
 check(WatchRules.serial(it).begins_with("XM X06 "),"UV serial targets selected expensive model")
 if Commerce.forgery_problem(s,it,"weight")=="": s=forge(s,uid,"weight");it=Model.find_inventory(s,uid)
 check(WatchForgery.similarity(it)>=75,"completed work improves physical similarity")
 check(WatchForgery.check_chance(80,true)<WatchForgery.check_chance(80,false) and WatchForgery.check_chance(100,false)==100,"matched channels lower recognition without erasing expert risk")
 var low=Model.new_item(s,"WCH-023",{"condition":0.8,"working":true,"authentic":true})
 var plain_value=Model.item_value(low)
 var premium=it.duplicate(true);premium.working=true
 check(Model.item_value(premium)==maxf(1,Model.jround(float(GameData.def(premium.defId).value)*premium.condition*(0.85 if premium.watch.missing_part!="" else 1.0))),"real appraisal remains original")
 # Force all four channels matched with genuine physical readings, without modifying base identity.
 premium.watch.mass=float(GameData.def("WCH-033").watch.nominal_mass)-float(WatchForgery.treatments(premium).get("weight",{}).get("ballast",0))-WatchForgery.mass_delta(premium)
 check(WatchForgery.similarity(premium)==100,"four physical channels reach full similarity")
 var novice=GameData.npc("CHR-004")
 var expertise=novice.expertise.watch.duplicate(true)
 novice.expertise.watch={"logo":0,"serial":0,"structure":0,"market":0}
 var t={"id":"premium-sale","npcId":"CHR-004","kind":"sell","evidenceUsed":[],"locked":false,"price":0,"rounds":0}
 var terms=Model.trade_terms(s,t,premium)
 check(terms.value>plain_value*2 and terms.marketCap>GameData.def(premium.defId).value*2,"unrecognized target commands premium beyond original cap")
 var trade_state=s.duplicate(true)
 trade_state.inventory=[premium];trade_state.trade=t.duplicate(true)
 var accepted=Commerce.reduce(trade_state,{"type":"SELECT_TRADE","uid":uid})
 check(accepted.trade.get("selectedUid","")==uid,"matched counterfeit can be selected by unskilled buyer")
 novice.expertise.watch={"logo":100,"serial":100,"structure":100,"market":100}
 var poor=premium.duplicate(true);poor.forgery.methods.erase("case");poor.forgery.methods.erase("serial")
 trade_state.inventory=[poor];trade_state.trade={"id":"expert-sale","npcId":"CHR-004","kind":"sell","evidenceUsed":[],"locked":false}
 var caught=Commerce.reduce(trade_state,{"type":"SELECT_TRADE","uid":uid})
 check(caught.trade.get("selectedUid","")=="" and caught.risk==minf(100,trade_state.risk+10),"expert rejects obvious mismatches with one penalty")
 var again=Commerce.reduce(JSON.parse_string(JSON.stringify(caught)),{"type":"SELECT_TRADE","uid":uid})
 check(again.risk==caught.risk and float(again.relations.salvage)==float(caught.relations.salvage),"reload and repeated selection never reroll or penalize twice")
 novice.expertise.watch=expertise
 check(WatchForgery.target_id(JSON.parse_string(JSON.stringify(it)))=="WCH-033","target, physical work and original identity survive JSON save")
 # Existing same-model forgery must remain usable and must not become target work.
 var legacy=Model.new_item(s,"WCH-023",{"authentic":false})
 WatchForgery.apply(legacy,"logo")
 check(WatchForgery.target_id(legacy)=="" and not WatchForgery.is_targeted(legacy),"legacy work retains original-model behavior")
 var legacy_state=s.duplicate(true);legacy_state.inventory=[legacy]
 legacy_state=Commerce.reduce(legacy_state,{"type":"FORGE_TARGET","uid":legacy.uid,"target":"WCH-033"})
 var selected_legacy=Model.find_inventory(legacy_state,legacy.uid)
 check(not WatchForgery.is_targeted(selected_legacy) and not WatchForgery.matches(selected_legacy).logo,"legacy paint is never upgraded free")
 var linked=Model.new_item(s,"WCH-023",{"working":false,"watch":{"mass":100.6,"serial":"CC D02 2400 000001","logo_variant":0,"missing_part":"一节可拆表节","part_mass":3.4}})
 var link_state=s.duplicate(true);link_state.inventory=[linked]
 link_state=Commerce.reduce(link_state,{"type":"FORGE_TARGET","uid":linked.uid,"target":"WCH-033"})
 link_state=forge(link_state,linked.uid,"case");linked=Model.find_inventory(link_state,linked.uid)
 check(linked.watch.missing_part=="" and is_equal_approx(WatchRules.mass(linked),148.0) and not linked.working,"new complete bracelet physically fixes missing link but not movement")
 check(Commerce.forgery_problem(link_state,linked,"weight").contains("无需"),"already matched weight needs no paid ballast")
 var full_mass=WatchRules.mass(linked)
 WatchForgery.restore_exterior(linked,"case")
 var case_mass=WatchRules.mass(linked)
 WatchForgery.restore_exterior(linked,"case")
 check(WatchRules.mass(linked)==case_mass and case_mass<full_mass,"restoring original shell reverses its mass exactly once")
 WatchForgery.restore_exterior(linked,"strap")
 check(is_equal_approx(WatchRules.mass(linked),104.0),"restoring both original exterior parts retains genuine missing-link repair")
 for property in ["sourceVerified","sealed","owner","orderId"]:
  var blocked=untouched.duplicate(true)
  var original=Model.find_inventory(blocked,uid)
  if property=="sourceVerified": original.sourceVerified=false
  elif property=="sealed": original.sealed=true
  elif property=="owner": original.owner="customer"
  else: original.orderId="reserved"
  var result=Commerce.reduce(blocked,{"type":"FORGE_TARGET","uid":uid,"target":"WCH-033"})
  check(WatchForgery.target_id(Model.find_inventory(result,uid))=="","protected stock cannot select target: "+property)
 var progress_state=Commerce.reduce(untouched,{"type":"FORGE_TARGET","uid":uid,"target":"WCH-033"})
 progress_state=Model.reduce(progress_state,{"type":"SERVICE_PROGRESS","uid":uid,"task":"forge_logo","progress":{"task":"forge_logo","step":0,"complete":false,"opened":false}})
 var refused=Commerce.reduce(progress_state,{"type":"FORGE_TARGET","uid":uid,"target":"WCH-029"})
 check(WatchForgery.target_id(Model.find_inventory(refused,uid))=="WCH-033","saved partial work also locks target")
 print("PREMIUM failures=",failures)
 quit(1 if failures else 0)
