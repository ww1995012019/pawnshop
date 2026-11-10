extends SceneTree
const Commerce = preload('res://scripts/model/commerce.gd')
var failures := 0
func _initialize(): call_deferred('run')
func check(ok, message):
 print('FORGERY METHODS ', 'PASS ' if ok else 'FAIL ', message)
 if not ok: failures += 1
func run():
 var s = Model.create('METHODS')
 var ref = WatchRules.model_reference('WCH-008')
 var it = Model.new_item(s,'WCH-008',{'authentic':false,'working':false,'condition':0.55,'watch':{'logo_variant':1,'serial':'HG X00 2401 123456','mass':float(ref.nominal_mass)-6.2,'missing_part':'固定部件','part_mass':6.2}})
 Model.put_in(s,it)
 var base = it.watch.duplicate(true)
 var value = Model.item_value(it)
 for method in ['logo','serial','weight']:
  var ap = s.ap
  s = forge_at_bench(s,it.uid,method)
  it = Model.find_inventory(s,it.uid)
  check(s.ap == ap-1, method+' consumes one AP')
  check(it.watch == base and not it.authentic and not it.working and it.condition == 0.55 and Model.item_value(it) == value,method+' does not repair or increase real worth')
  var again = Commerce.reduce(s,{'type':'FORGE','uid':it.uid,'method':method})
  check(again.ap == s.ap and again.materials == s.materials, method+' cannot consume twice')
 check(WatchRules.logo_variant(it)==0,'repaint changes actual lens-visible logo')
 check(WatchRules.serial(it).begins_with(str(ref.serial_prefix)+' '+str(ref.model)+' '),'serial forgery changes UV-visible number')
 check(is_equal_approx(WatchRules.mass(it),float(ref.nominal_mass)) and it.watch.missing_part!='','ballast matches scale while missing part remains')
 for tool in ['TOL-001','TOL-002','TOL-005']:
  check(WatchRules.reading(it,tool).contains('痕迹'), tool+' exposes corresponding tamper trace')
 for appraisal_tool in ['TOL-001','TOL-002','TOL-005']:
  if not it.evidence.has(appraisal_tool): it.evidence.append(appraisal_tool)
  Model.record_inspection(it,appraisal_tool)
 var restored = JSON.parse_string(JSON.stringify(it))
 check(Model.estimate(restored).exact and Model.estimate(restored)==Model.estimate(it),'all three forged-channel appraisal snapshots survive JSON reload')
 check(WatchRules.mass(restored)==WatchRules.mass(it) and WatchRules.serial(restored)==WatchRules.serial(it),'physical forgery survives reload')
 var public_before = Model.sale_appearance(restored)
 restored.forgery.methods.logo.exposed = true
 check(Model.sale_appearance(restored) == public_before, 'catching a surface treatment does not reveal hidden authenticity or function')
 WatchRules.restore_parts(it)
 check(is_equal_approx(WatchRules.mass(it),float(ref.nominal_mass)),'real repair removes ballast before replacing missing part')
 var premium_found = false
 for i in 50:
  var plain = it.duplicate(true)
  plain.erase('forgery')
  var disguised = plain.duplicate(true)
  WatchForgery.apply(disguised,'logo')
  var left = {'id':'premium-'+str(i),'npcId':'CHR-004','kind':'sell','evidenceUsed':[]}
  var right = left.duplicate(true)
  var before_price = Model.trade_terms(s,left,plain).value
  var after_price = Model.trade_terms(s,right,disguised).value
  if right.npcKnowledge[it.uid].appraisalGrade == 'impression':
   premium_found = after_price > before_price
   break
 check(premium_found,'successful repaint can improve an uninformed impression without raising true value')
 var probe = Model.create('REPEAT-PENALTY')
 var lot = probe.inventory[0]
 lot.condition = 0.8
 lot.authentic = true
 lot.working = true
 var npc = GameData.npc('CHR-003')
 var old_logo = npc.expertise.watch.logo
 var old_serial = npc.expertise.watch.serial
 npc.expertise.watch.logo = 100
 npc.expertise.watch.serial = 100
 probe.trade = {'id':'same-encounter','npcId':'CHR-003','kind':'sell','item':null,'price':0,'rounds':0,'locked':false,'evidenceUsed':[],'line':''}
 probe = forge_at_bench(probe,lot.uid,'logo')
 probe = Commerce.reduce(probe,{'type':'SELECT_TRADE','uid':lot.uid})
 var risk = probe.risk
 var relation = probe.relations.station
 probe = JSON.parse_string(JSON.stringify(probe))
 probe = forge_at_bench(probe,lot.uid,'serial')
 probe = Commerce.reduce(probe,{'type':'SELECT_TRADE','uid':lot.uid})
 check(probe.risk == risk and probe.relations.station == relation and probe.inventory[0].forgery.methods.serial.exposed,'newly caught method after reload exposes without repeating encounter penalty')
 npc.expertise.watch.logo = old_logo
 npc.expertise.watch.serial = old_serial
 var merchant = Model.create('MERCHANT-FORGERY')
 var merchant_item = merchant.inventory[0]
 var merchant_npc = GameData.npc('CHR-010')
 var merchant_skill = merchant_npc.expertise.watch.logo
 merchant_npc.expertise.watch.logo = 100
 merchant = forge_at_bench(merchant,merchant_item.uid,'logo')
 merchant.trade = {'id':'merchant-encounter','npcId':'CHR-010','kind':'merchant','item':null,'price':0,'rounds':0,'locked':false,'evidenceUsed':[],'line':''}
 var cash_before = merchant.cash
 merchant = Commerce.reduce(merchant,{'type':'SELL_MERCHANT_ITEM','uid':merchant_item.uid})
 check(Model.find_inventory(merchant,merchant_item.uid)!=null and merchant.cash==cash_before,'merchant resale also checks forged evidence before transfer')
 merchant = Commerce.reduce(merchant,{'type':'SELL_MERCHANT_ITEM','uid':merchant_item.uid})
 check(Model.find_inventory(merchant,merchant_item.uid)!=null and merchant.cash==cash_before,'same merchant cannot buy a just-rejected forgery on retry')
 if Model.find_inventory(merchant,merchant_item.uid)!=null:
  merchant.trade = {'id':'another-encounter','npcId':'CHR-010','kind':'merchant','item':null,'price':0,'locked':false,'evidenceUsed':[],'line':''}
  merchant = Commerce.reduce(merchant,{'type':'SELL_MERCHANT_ITEM','uid':merchant_item.uid})
  check(Model.find_inventory(merchant,merchant_item.uid)!=null,'a new encounter independently checks previously exposed treatments')
 merchant_npc.expertise.watch.logo = merchant_skill
 quit(1 if failures else 0)

func forge_at_bench(state: Dictionary, uid: String, method: String) -> Dictionary:
 state = Model.reduce(state,{'type':'SERVICE_PROGRESS','uid':uid,'task':'forge_'+method,'progress':{'complete':true,'opened':false}})
 return Commerce.reduce(state,{'type':'FORGE','uid':uid,'method':method})
