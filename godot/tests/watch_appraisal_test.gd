extends SceneTree
var failures := 0
func _initialize(): call_deferred('run')
func check(ok, message):
 print('APPRAISAL ', 'PASS ' if ok else 'FAIL ', message)
 if not ok: failures += 1
func run():
 var s = Model.create('APPRAISAL')
 var it = s.inventory[0]
 var previous = Model.estimate(it)
 for tool in ['TOL-001','TOL-002','TOL-005']:
  s = Model.reduce(s, {'type':'CHECK','uid':it.uid,'tool':tool})
  it = Model.find_inventory(s,it.uid)
  var current = Model.estimate(it)
  check(current.low >= previous.low and current.high <= previous.high and current.high-current.low < previous.high-previous.low, 'each current inspection narrows nested price bounds')
  previous = current
 check(previous.exact and previous.low == Model.item_value(it) and previous.low == previous.high, 'three tools reveal exact reference value')
 var old = JSON.parse_string(JSON.stringify(it))
 check(Model.estimate(old) == previous, 'appraisal survives save/reload')
 it.condition = 0.93
 check(not Model.estimate(it).exact, 'a repaired watch requires refreshed appraisals')
 var expert_hits = 0
 var novice_hits = 0
 for i in 200:
  for npc in ['CHR-002','CHR-004']:
   var t = {'id':'valuation-'+str(i),'npcId':npc,'kind':'sell','evidenceUsed':[]}
   Model.trade_terms(s,t,it)
   var belief = t.npcKnowledge[it.uid]
   if npc == 'CHR-002' and belief.get('appraisalGrade','') == 'accurate':
    expert_hits += 1
    check(belief.appraisedValue == Model.item_value(it), 'recognized specialist value is exact')
   if npc == 'CHR-004' and belief.get('appraisalGrade','') == 'rough':
    novice_hits += 1
    check(absf(float(belief.appraisedValue)-Model.item_value(it)) <= Model.item_value(it)*0.12+1 and belief.appraisedValue != Model.item_value(it), 'ordinary recognition is a bounded approximation')
   var before = t.npcKnowledge.duplicate(true)
   Model.record_inspection(it,'TOL-001')
   Model.trade_terms(s,t,it)
   check(t.npcKnowledge == before, 'private inspection leaves buyer belief unchanged')
 check(expert_hits > 145 and expert_hits < 195, 'specialists usually appraise accurately: '+str(expert_hits))
 check(novice_hits > 15 and novice_hits < 75, 'ordinary buyers only sometimes approximate value: '+str(novice_hits))
 var legacy = it.duplicate(true)
 legacy.erase('inspectionFacts')
 var buyer = {'id':'legacy-share','npcId':'CHR-002','kind':'sell','evidenceUsed':[]}
 Model.disclose_evidence(buyer,legacy,'TOL-001')
 check(not Model.estimate(legacy).exact and not legacy.has('inspectionFacts'), 'sharing legacy evidence cannot silently refresh player price')
 var stale = Model.new_item(s,'WCH-001',{'condition':0.95,'working':true,'authentic':true})
 stale.evidence = ['TOL-001']
 Model.record_inspection(stale,'TOL-001')
 stale.condition = 0.4
 var checked_expert = false
 for index in 50:
  var t = {'id':'old-price-'+str(index),'npcId':'CHR-002','kind':'sell','evidenceUsed':[]}
  Model.trade_terms(s,t,stale)
  if t.npcKnowledge[stale.uid].appraisalGrade == 'accurate':
   var independently_known = t.npcKnowledge[stale.uid].appraisedValue
   Model.disclose_evidence(t,stale,'TOL-001')
   check(t.npcKnowledge[stale.uid].appraisedValue == independently_known,'old high-price record cannot overwrite an expert independent current valuation')
   checked_expert = true
   break
 check(checked_expert,'stale price regression exercised an accurate expert')
 print('APPRAISAL failures=',failures)
 quit(1 if failures else 0)
