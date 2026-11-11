class_name ShopJournal
extends Object
## Public memories and recorded costs only. Never copies an original's hidden truth.

static func _trade(s: Dictionary) -> Dictionary:
 return s.get("trade",{}) if s.get("trade") is Dictionary else {}

static func _originals(s: Dictionary) -> Dictionary:
 var out: Dictionary={}
 var t:=_trade(s)
 var lots: Array=s.get("inventory",[]).duplicate()
 if t.get("item") is Dictionary: lots.append(t.item)
 var session: Dictionary=t.get("session",{})
 lots.append_array(session.get("goods",[]))
 lots.append_array(session.get("acquired",[]))
 for it in lots:
  if it is Dictionary and String(it.get("uid",""))!="": out[String(it.uid)]=it
 return out

static func _public_model(it: Dictionary) -> String:
 if String(it.get("defId",""))=="": return ""
 return WatchForgery.appearance_id(it)

static func _archive_original(row: Dictionary, uid: String) -> Dictionary:
 # Ledger defId and labels may contain an undisclosed underlying model. Only
 # explicitly public metadata can name an original no longer observable.
 return {"uid":uid,"defId":String(row.get("appearanceId",row.get("publicDefId","")))}

static func _ledger_text(row: Dictionary) -> String:
 var label: String={"purchase":"已购入原物","bulk-purchase":"已购入整箱原物","sale":"原物已售出","clearance":"原物已售出","service":"委修原物已交还","service-job":"委修原物已交还","order":"委托原物已交付","pawn-principal":"已收妥抵押原物并付出本金","pawn-return":"抵押原物已交还","pawn-fee":"抵押服务已结算"}.get(String(row.get("kind","")),"原物已交割")
 return label+"，实收付 %s Cr。" % str(row.get("amount",0))

static func _purchase_rows(row: Dictionary, originals: Dictionary, historical: bool) -> Array:
 if row.get("kind","")!="bulk-purchase": return [row]
 var uids: Array=row.get("itemUids",[])
 if uids.is_empty() or float(row.get("amount",0))>=0: return []
 var total:=absf(float(row.amount))
 var costs: Array=[]
 var actual_total:=0.0
 var exact:=not historical
 for uid in uids:
  var original: Dictionary=originals.get(String(uid),{})
  var cost=original.get("cost",null)
  if cost==null or typeof(cost) not in [TYPE_INT,TYPE_FLOAT] or float(cost)<0:
   exact=false
   costs.append(0.0)
  else:
   costs.append(float(cost))
   actual_total+=float(cost)
 exact=exact and actual_total==total
 if not exact:
  # BulkCrates v1 records one integer-price purchase with ordered itemUids.
  # Its transaction rule assigns equal integer shares and the final remainder;
  # restore that recorded allocation, never a later aggregate item.cost.
  var share:=floorf(total/float(uids.size()))
  var remaining:=total
  for index in uids.size():
   costs[index]=remaining if index==uids.size()-1 else share
   remaining-=float(costs[index])
 var rows: Array=[]
 for index in uids.size():
  var part: Dictionary=row.duplicate(true)
  part.kind="purchase"
  part.uid=String(uids[index])
  part.amount=-float(costs[index])
  part.cost=float(costs[index])
  part.bulkEntry=true
  part.recoveredAllocation=not exact
  rows.append(part)
 return rows

static func _name(it: Dictionary) -> String:
 GameData.ensure()
 var definition: Dictionary=GameData.items.get(_public_model(it),{})
 return String(definition.get("name","未登记型号"))

static func _memory(j: Dictionary, npc_id: String) -> Dictionary:
 if not j.customers.has(npc_id):
  j.customers[npc_id]={"npcId":npc_id,"visits":0,"deals":0,"repairs":0,"trust":0,"lastNote":"","referrals":0,"lastDay":0}
 return j.customers[npc_id]

static func _event(j: Dictionary, uid: String, key: String, day: int, text: String) -> void:
 if uid=="" or j.markers.has("event/"+key): return
 j.markers["event/"+key]=true
 if not j.histories.has(uid): j.histories[uid]=[]
 j.histories[uid].append({"id":key,"day":day,"text":text})

static func _remember(j: Dictionary, it: Dictionary, day: int, imported: bool) -> void:
 var uid:=String(it.uid)
 if not j.originals.has(uid):
  j.originals[uid]={"uid":uid,"defId":_public_model(it),"name":_name(it),"handled":true,"inspected":false,"repaired":false,"npcId":""}
  j.recordedCosts[uid]={"acquisition":0.0 if it.get("owner","")=="customer" else null,"materials":0.0,"electricity":0.0,"complete":not imported,"notes":[]}
  if imported: j.recordedCosts[uid].notes.append("启用档案前的购入、材料与用电记录不完整。")
  _event(j,uid,"original/"+uid,day,"原物已登记；此前经历未补写。" if imported else "实物到店，已登记原物。")
 var record: Dictionary=j.originals[uid]
 record.defId=_public_model(it)
 record.name=_name(it)
 record.publicModelRecorded=true
 record.inspected=bool(record.inspected) or not it.get("evidence",[]).is_empty() or not it.get("evidenceReadings",{}).is_empty()
 record.repaired=bool(record.repaired) or bool(it.get("repaired",false)) or not it.get("refurbishment",{}).get("done",[]).is_empty()

static func _uid(row: Dictionary, originals: Dictionary, previous: Dictionary={}) -> String:
 var explicit:=String(row.get("uid",""))
 if explicit!="": return explicit
 var id:=String(row.get("id",""))
 for uid in originals:
  if id.ends_with("/"+uid) or id.ends_with("-"+uid): return uid
 var t:=_trade(previous)
 if id==String(t.get("id","")):
  if t.get("item") is Dictionary: return String(t.item.get("uid",""))
  return String(t.get("selectedUid",""))
 return ""

static func ensure(s: Dictionary) -> void:
 if not s.get("shopJournal") is Dictionary:
  s.shopJournal={"version":1,"customers":{},"collection":{},"histories":{},"receipts":[],"recordedCosts":{},"originals":{},"markers":{},"observations":{}}
 var j: Dictionary=s.shopJournal
 for key in ["customers","collection","histories","recordedCosts","originals","markers","observations"]:
  if not j.get(key) is Dictionary: j[key]={}
 if not j.get("receipts") is Array: j.receipts=[]
 j.version=1
 var originals:=_originals(s)
 var day:=int(s.get("day",1))
 for it in originals.values(): _remember(j,it,day,true)
 for uid in j.originals:
  var recorded: Dictionary=j.originals[uid]
  if not originals.has(uid) and not recorded.get("publicModelRecorded",false):
   recorded.defId=""
   recorded.name="未登记型号"
 # Refresh previously cached names when a casing changes or an older save
 # stored its hidden model. Actual recorded readings remain factual history.
 for receipt in j.receipts:
  for entry in receipt.get("entries",[]):
   if j.originals.has(String(entry.get("uid",""))): entry.name=j.originals[String(entry.uid)].name
 if not j.markers.has("legacyImported"):
  var historical_batches: Dictionary={}
  for ledger_row in s.get("ledger",[]):
   var id:=String(ledger_row.get("id",""))
   if id=="": continue
   j.markers["ledger/"+id]=true
   for row in _purchase_rows(ledger_row,originals,true):
    var uid:=_uid(row,originals)
    if uid!="":
     if not j.originals.has(uid): _remember(j,_archive_original(row,uid),day,true)
     var event_id: String="ledger/"+id+("/"+uid if row.get("bulkEntry",false) else "")
     _event(j,uid,event_id,int(row.get("day",day)),_ledger_text(row))
     if row.get("kind","")=="purchase": j.recordedCosts[uid].acquisition=absf(float(row.get("amount",0)))
    if row.get("kind","") in ["sale","purchase","clearance","service","service-job","order","pawn-principal","pawn-return","pawn-fee"]:
     var batch: String=id.trim_suffix("/"+uid) if uid!="" and id.ends_with("/"+uid) else id
     if row.get("kind","") in ["pawn-return","pawn-fee"] and uid!="": batch="redemption/%s/%s" % [uid,row.get("day",day)]
     if not historical_batches.has(batch): historical_batches[batch]=[]
     historical_batches[batch].append({"row":row,"uid":uid})
  for identity in _usage(s):
   var usage: Dictionary=_usage(s)[identity]
   var tokens:=String(usage.get("key","")).split("|")
   for uid in j.recordedCosts:
    if tokens.has(uid):
     j.recordedCosts[uid].electricity+=float(usage.get("cents",0))/100.0
     j.markers["electricity/"+identity]=true
     break
  for batch in historical_batches:
   var entries: Array=[]
   var cash:=0.0
   var npc_id: String=""
   var recorded_day:=day
   for archived in historical_batches[batch]:
    var row: Dictionary=archived.row
    var entry:=_receipt_entry(j,row,archived.uid,"历史交割原物")
    entry.complete=false
    entry.note="历史账目导入；此前材料与用电记录不完整。"
    entries.append(entry)
    cash+=float(row.get("amount",0))
    recorded_day=int(row.get("day",day))
    if row.get("npcId","")!="": npc_id=String(row.npcId)
   j.receipts.append({"id":"history/"+batch,"day":recorded_day,"npcId":npc_id,"entries":entries,"cashImpact":cash,"complete":false,"note":"历史账目导入；此前材料与用电记录不完整。","historical":true})
   if npc_id!="":
    var memory:=_memory(j,npc_id)
    memory.deals+=1
    _note(j,npc_id,recorded_day,"旧账记有%d件原物交割" % entries.size(),1)
  j.markers.legacyImported=true
 for ledger_row in s.get("ledger",[]):
  var ledger_id:=String(ledger_row.get("id",""))
  for row in _purchase_rows(ledger_row,originals,true):
   var uid:=_uid(row,originals)
   for event in j.histories.get(uid,[]):
    if event.get("id","")=="ledger/"+ledger_id or event.get("id","")=="ledger/"+ledger_id+"/"+uid: event.text=_ledger_text(row)
 _rebuild_collection(j)

static func _rebuild_collection(j: Dictionary) -> void:
 j.collection={}
 for it in j.originals.values():
  var id:=String(it.defId)
  if id=="": continue
  if not j.collection.has(id): j.collection[id]={"defId":id,"handled":0,"inspected":0,"repaired":0}
  var row: Dictionary=j.collection[id]
  row.handled+=1
  if it.inspected: row.inspected+=1
  if it.repaired: row.repaired+=1

static func _receipt_entry(j: Dictionary, row: Dictionary, uid: String, fallback: String) -> Dictionary:
 var original: Dictionary=j.originals.get(uid,{})
 var costs: Dictionary=j.recordedCosts.get(uid,{})
 var amount:=float(row.get("amount",0))
 var kind:=String(row.get("kind",""))
 var direction: String="acquisition" if kind=="purchase" else ("pawn" if kind=="pawn-principal" else ("service" if kind in ["service","service-job","pawn-fee"] else ("return" if kind=="pawn-return" else "sale")))
 var acquisition=costs.get("acquisition",null)
 var materials:=float(costs.get("materials",0))
 var electricity:=float(costs.get("electricity",0))
 var complete:=bool(costs.get("complete",false)) and uid!="" and (acquisition!=null or direction=="service")
 var margin=null
 if direction in ["sale","service"] and (acquisition!=null or direction=="service"):
  margin=amount-float(acquisition if acquisition!=null else 0)-materials-electricity
 return {"uid":uid,"name":String(original.get("name",fallback)),"direction":direction,"price":absf(amount),"acquisitionCost":acquisition,"materialCost":materials,"electricityCost":electricity,"cashImpact":amount,"recordedMargin":margin,"complete":complete,"note":"已记录原物直接成本；店铺日常分摊未计入。" if complete else "历史成本不完整；未记录的购入、材料或用电费用未知。","ledgerId":String(row.get("id",""))}

static func _note(j: Dictionary, npc: String, day: int, text: String, trust: int=0) -> void:
 if npc=="": return
 var memory:=_memory(j,npc)
 memory.lastNote=text
 memory.lastDay=day
 memory.trust=clampi(int(memory.trust)+trust,-6,6)

static func _usage(s: Dictionary) -> Dictionary:
 var out: Dictionary={}
 for day in s.get("storeCosts",{}).get("days",{}):
  for key in s.storeCosts.days[day].get("usage",{}):
   out[String(day)+"/"+String(key)]=s.storeCosts.days[day].usage[key]
 return out

static func _contracts(s: Dictionary) -> Array:
 var out: Array=s.get("orders",[]).duplicate()
 out.append_array(s.get("serviceContracts",{}).get("entries",[]))
 return out

static func observe(previous: Dictionary, next: Dictionary, action: Dictionary) -> void:
 # Bootstrap from the BEFORE state so newly appended ledgers remain observable.
 if not next.get("shopJournal") is Dictionary:
  var bootstrap:=previous.duplicate(true)
  ensure(bootstrap)
  next.shopJournal=bootstrap.shopJournal.duplicate(true)
 var j: Dictionary=next.shopJournal
 var before:=_originals(previous)
 var after:=_originals(next)
 # A departing original may be absent from the after-state. Refresh its
 # observable casing before the receipt uses a cached older identity.
 for original in before.values(): _remember(j,original,int(previous.get("day",1)),true)
 var day:=int(next.get("day",1))
 var old_trade:=_trade(previous)
 var trade:=_trade(next)
 var npc:=String(trade.get("npcId",old_trade.get("npcId","")))
 for uid in after:
  _remember(j,after[uid],day,before.has(uid))
  for contract in _contracts(next):
   if contract.get("uid","")==uid and contract.get("npcId","")!="": j.originals[uid].npcId=contract.npcId
  var old: Dictionary=before.get(uid,{})
  var it: Dictionary=after[uid]
  for tool in it.get("evidence",[]):
   var reading=it.get("evidenceReadings",{}).get(tool,"")
   if not old.get("evidence",[]).has(tool) or old.get("evidenceReadings",{}).get(tool,"")!=reading:
    var key: String="inspection/%s/%s/%s" % [uid,tool,str(hash(JSON.stringify(reading)))]
    _event(j,uid,key,day,"已观察%s%s。" % [GameData.evidence_name(it.defId,tool),"："+String(reading) if reading is String and reading!="" else ""])
  for category in ["service","refurbishment"]:
   for task in it.get(category,{}).get("done",[]):
    if old.get(category,{}).get("done",[]).has(task): continue
    var label: String=WatchRefurbishment.LABELS.get(task,String(task)) if category=="refurbishment" else WatchService.label(task,it)
    _event(j,uid,"work/%s/%s/%s/%s" % [uid,category,task,day],day,"已完成%s。" % label)
  var finished:=bool(it.get("repaired",false)) and not bool(old.get("repaired",false))
  if finished:
   j.originals[uid].repaired=true
   var owner_npc:=String(j.originals[uid].get("npcId",""))
   var key: String="repair/%s/%s" % [uid,day]
   if not j.markers.has(key):
    j.markers[key]=true
    if owner_npc!="":
     _memory(j,owner_npc).repairs+=1
     _note(j,owner_npc,day,"上次登记的手表已完成维修",1)
   _event(j,uid,key,day,"维修工单已完成。")
 # A real new counter visit has a new persistent trade identity.
 if not trade.is_empty() and String(trade.get("id",""))!=String(old_trade.get("id","")):
  var visit: String="visit/"+String(trade.get("id",""))
  if npc!="" and not j.markers.has(visit):
   j.markers[visit]=true
   _memory(j,npc).visits+=1
   _note(j,npc,day,"曾在第%d天到店" % day)
   var referrer:=String(trade.get("referrerId",trade.get("referralFrom","")))
   if j.customers.has(referrer) and int(j.customers[referrer].deals)>0:
    _memory(j,referrer).referrals+=1
    _note(j,referrer,day,"介绍的客人已实际到店")
 # Material reductions are attributed only when the action names a physical original.
 var action_uid:=String(action.get("uid",""))
 if j.recordedCosts.has(action_uid):
  var changes: Dictionary={}
  var amount:=0.0
  for id in previous.get("materials",{}):
   var used:=maxf(0,float(previous.materials[id])-float(next.get("materials",{}).get(id,previous.materials[id])))
   if used>0:
    changes[id]=[previous.materials[id],next.materials[id]]
    amount+=used*float(GameData.material(id).get("price",0))
  if amount>0:
   var key: String="materials/%s/%s/%s/%s" % [day,action_uid,JSON.stringify(action),JSON.stringify(changes)]
   if not j.markers.has(key):
    j.markers[key]=true
    j.recordedCosts[action_uid].materials+=amount
 var prior_usage:=_usage(previous)
 for identity in _usage(next):
  if prior_usage.has(identity) or j.markers.has("electricity/"+identity): continue
  var usage: Dictionary=_usage(next)[identity]
  var tokens:=String(usage.get("key","")).split("|")
  for uid in j.recordedCosts:
   if tokens.has(uid):
    j.recordedCosts[uid].electricity+=float(usage.get("cents",0))/100.0
    j.markers["electricity/"+identity]=true
    break
 var settlement_npc: String=npc if action.get("type","") in ["DELIVER","TRADE_CHECKOUT","BUY_RARE_ITEM","SELL_MERCHANT_ITEM","PAWN","REDEEM","BUY_BULK_CRATE"] else ""
 var rows: Array=[]
 var prior_ids: Dictionary={}
 for row in previous.get("ledger",[]): prior_ids[String(row.get("id",""))]=true
 var all_originals:=before.duplicate()
 all_originals.merge(after,true)
 for ledger_row in next.get("ledger",[]):
  var id:=String(ledger_row.get("id",""))
  if id=="" or prior_ids.has(id) or j.markers.has("ledger/"+id): continue
  j.markers["ledger/"+id]=true
  for row in _purchase_rows(ledger_row,all_originals,false):
   if row.get("kind","") not in ["sale","purchase","clearance","service","service-job","order","pawn-principal","pawn-return","pawn-fee"]: continue
   var uid:=_uid(row,all_originals,previous)
   if uid=="" and action_uid!="" and all_originals.has(action_uid): uid=action_uid
   if uid!="" and not j.originals.has(uid): _remember(j,all_originals.get(uid,_archive_original(row,uid)),day,true)
   var row_npc:=String(row.get("npcId",""))
   if row_npc=="": row_npc=settlement_npc
   if row.get("bulkEntry",false) and row_npc!="": settlement_npc=row_npc
   elif settlement_npc=="": settlement_npc=row_npc
   if uid!="" and row.get("kind","")=="purchase":
    j.recordedCosts[uid].acquisition=absf(float(row.get("amount",0)))
    j.originals[uid].npcId=row_npc
    if row.get("recoveredAllocation",false): j.recordedCosts[uid].complete=false
   var entry:=_receipt_entry(j,row,uid,"已交割原物")
   rows.append(entry)
   _event(j,uid,"ledger/"+id+("/"+uid if row.get("bulkEntry",false) else ""),day,_ledger_text(row))
 if not rows.is_empty():
  var ids: Array=[]
  var cash:=0.0
  var complete:=true
  for row in rows:
   if not ids.has(row.ledgerId): ids.append(row.ledgerId)
   cash+=float(row.cashImpact);complete=complete and row.complete
  var id: String="receipt/"+"+".join(ids)
  j.receipts.append({"id":id,"day":day,"npcId":settlement_npc,"entries":rows,"cashImpact":cash,"complete":complete,"note":"按已记录的直接成本列示，未分摊店铺日常费用。" if complete else "部分历史成本未知；记录差额不代表完整利润。","historical":false})
  if settlement_npc!="":
   _memory(j,settlement_npc).deals+=1
   _note(j,settlement_npc,day,"上次已完成%d件原物交割" % rows.size(),1)
 # Explicit discoveries only; hidden authenticity never enters memory.
 var checks: Dictionary=trade.get("forgeryChecks",{}).duplicate(true)
 for line in trade.get("session",{}).get("lines",[]):
  checks.merge(line.get("context",{}).get("forgeryChecks",{}),true)
 for uid in checks:
  if not checks[uid] is Dictionary: continue
  if not checks[uid].values().has("caught"): continue
  var key: String="dispute/%s/%s" % [trade.get("id",""),uid]
  if not j.markers.has(key):
   j.markers[key]=true
   _note(j,npc,day,"上次交涉发现加工痕迹，需重新核对",-2)
   _event(j,uid,key,day,"交涉中已发现加工痕迹，未据此确认真伪。")
 if action.get("type","")=="RETURN_ITEM" and before.has(action_uid) and not after.has(action_uid):
  _event(j,action_uid,"return/%s/%s" % [action_uid,day],day,"原物已按返还凭证移交。")
 for order in _contracts(next):
  var prior_status: String=""
  for old_order in _contracts(previous):
   if old_order.get("id","")==order.get("id",""): prior_status=String(old_order.get("status",""))
  if order.get("status","")!=prior_status and String(order.get("uid",""))!="":
   _event(j,String(order.uid),"contract/%s/%s" % [order.id,order.status],day,"委托已%s。" % {"active":"接取并登记保管","done":"盖章交付","failed":"结束，未按约完成","diagnosis":"接取并登记保管","quoting":"完成诊断，等待商定报价","declined":"记录暂未接受的报价","ready":"完成维修，等待取回","accepted":"接取并登记保管","approved":"商定维修报价","complete":"盖章交付","cancelled":"取消并归还原物","expired":"到期结束"}.get(order.status,"更新登记"))
   var contract_npc:=String(order.get("npcId",""))
   if contract_npc!="" and prior_status=="available" and String(order.get("uid",""))!="":
    var visit_key: String="contract-visit/"+String(order.id)
    if not j.markers.has(visit_key):
     j.markers[visit_key]=true
     _memory(j,contract_npc).visits+=1
     _note(j,contract_npc,day,"曾把原物交到店里委修")
 _rebuild_collection(j)

static func customer(s: Dictionary, npc_id: String) -> Dictionary:
 ensure(s)
 return _memory(s.shopJournal,npc_id).duplicate(true)

static func greeting(s: Dictionary, npc_id: String) -> String:
 var memory:=customer(s,npc_id)
 if String(memory.lastNote)=="": return ""
 return "又见面了，%s。" % memory.lastNote

static func preferred_npc(s: Dictionary, fallback_id: String) -> String:
 ensure(s)
 var eligible: Array=[]
 for id in s.shopJournal.customers:
  var memory: Dictionary=s.shopJournal.customers[id]
  if int(memory.deals)>0 and int(memory.trust)>0: eligible.append(String(id))
 eligible.sort()
 if eligible.is_empty(): return fallback_id
 var draw:=int(Model.fnv("%s/%s/%s/returning" % [s.get("seed",""),s.get("day",1),s.get("cursor",0)]))
 if draw%4!=0: return fallback_id
 return eligible[draw%eligible.size()]

static func price_multiplier(s: Dictionary, npc_id: String) -> float:
 var memory:=customer(s,npc_id)
 return clampf(1.0+float(memory.trust)*0.005,0.97,1.03)

static func collection(s: Dictionary, def_id: String) -> Dictionary:
 ensure(s)
 return s.shopJournal.collection.get(def_id,{"defId":def_id,"handled":0,"inspected":0,"repaired":0}).duplicate(true)

static func timeline(s: Dictionary, uid: String) -> Array:
 ensure(s)
 return s.shopJournal.histories.get(uid,[]).duplicate(true)

static func latest_receipt(s: Dictionary) -> Dictionary:
 ensure(s)
 return s.shopJournal.receipts.back().duplicate(true) if not s.shopJournal.receipts.is_empty() else {}

static func receipts(s: Dictionary) -> Array:
 ensure(s)
 return s.shopJournal.receipts.duplicate(true)
