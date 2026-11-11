extends Object
## Saved, deterministic discussion state per physical original. No click rolls.
## Balance: 6–8 willingness; a 2%-of-known-value concession offsets discussion
## fatigue. Gaps over 50% cost more; a >2x ask / <25% bid can end the visit.
## Fresh relevant snapshots help once each; examination never proves provenance.
static func provenance(known: Dictionary,it: Dictionary) -> String:
 if known.has("provenance"): return String(known.provenance)
 if not known.has("sourceStatement"): known.sourceStatement=String(it.get("source",""))
 var statement: String=known.sourceStatement
 for doubt in ["待","暂缺","不明","未核"]:
  if statement.contains(doubt): return "unverified"
 return "claimed" if statement.contains("登记") or statement.contains("回执") or statement.contains("清单") else "unverified"

static func state(t: Dictionary,it: Dictionary) -> Dictionary:
 if not t.get("negotiation") is Dictionary: t.negotiation={}
 if not t.negotiation.has(it.uid):
  var faction: String=GameData.npc(t.npcId).faction
  var patience:=2 if faction=="salvage" else 0 if faction=="station" else 1
  t.negotiation[it.uid]={"willingness":6+patience,"patience":patience,"seenEvidence":[],"requests":[],"lastPlayer":0,"lastCounter":float(t.price),"extremes":0,"status":"active","reason":""}
 return t.negotiation[it.uid]

static func decide(s: Dictionary,t: Dictionary,it: Dictionary,price: float,evidence=null) -> Dictionary:
 var known:=Model.npc_knowledge(t,it)
 var discussion:=state(t,it)
 if discussion.status=="rejected": return {"decision":"refuse","reason":discussion.reason,"duplicate":true}
 # Compare only observations the NPC was explicitly shown, scoped to this UID.
 var shared_key:=""
 if evidence!=null and GameData.relevant_tool(it.defId,String(evidence)):
  Model.disclose_evidence(t,it,String(evidence))
  if not t.evidenceUsed.has(evidence): t.evidenceUsed.append(evidence)
  known=Model.npc_knowledge(t,it)
  # JSON loads all numbers as floats. Normalize before saving identity strings
  # so integer readings remain the same evidence after a save round trip.
  shared_key=JSON.stringify(JSON.parse_string(JSON.stringify([evidence,known.evidence.get(evidence,{}).get("facts",{})])))
 var request:=JSON.stringify([price,shared_key])
 if discussion.requests.has(request): return {"decision":"counter","reason":"相同报价与物证已经谈过，请作出实际让步或补充新依据。","duplicate":true}
 discussion.requests.append(request)
 var fresh: bool=shared_key!="" and not discussion.seenEvidence.has(shared_key)
 if fresh: discussion.seenEvidence.append(shared_key)
 var terms:=Model.trade_terms(s,t,it)
 var previous:=float(discussion.lastPlayer)
 var concession: bool=previous>0 and ((previous-price) if t.kind=="sell" else (price-previous))>=maxf(1,ceil(terms.value*0.02))
 var gap: float=maxf(0,price/terms.ceiling-1.0) if t.kind=="sell" else maxf(0,1.0-price/terms.floor)
 var extreme: bool=price>terms.ceiling*2.0 if t.kind=="sell" else price<terms.floor*0.25
 var source:=provenance(known,it)
 var accepted:=Model.price_agreed(s,t,it,price)
 discussion.lastPlayer=price
 discussion.lastCounter=float(t.price)
 t.rounds=int(t.get("rounds",0))+1
 if accepted:
  discussion.reason="价格确认，钱货尚未交割。"
  return {"decision":"accept","reason":discussion.reason,"duplicate":false}
 # Station procurement is less tolerant; salvage buyers usually give a warning.
 # A relevant fresh finding or already shared proof can keep an extreme offer
 # in discussion once, but repeating extremes can still end the whole visit.
 var leave: bool=extreme and (int(discussion.extremes)>0 or ((int(discussion.patience)==0 or source=="contradictory") and not fresh and int(terms.proof)==0))
 if extreme: discussion.extremes=int(discussion.extremes)+1
 var fatigue:=3 if extreme else 2 if gap>0.5 else 1
 var support:=2 if fresh else 0
 if concession and not extreme: support+=fatigue
 discussion.willingness=clampi(int(discussion.willingness)-fatigue+support,0,10)
 if leave:
  discussion.status="left";discussion.reason="报价与我的判断相差太大，这次接待到此为止；未交割的约定取消，已成交记录保留。"
  return {"decision":"leave","reason":discussion.reason,"duplicate":false}
 if int(discussion.willingness)<=0:
  discussion.status="rejected";discussion.reason="这件一直没有谈拢，我不再议价。其他货物还可以继续看。"
  return {"decision":"refuse","reason":discussion.reason,"duplicate":false}
 discussion.reason="来源仍需核对，检测读数只能支持对应的鉴定判断。" if source in ["unverified","contradictory"] else "按已经说明的来源和鉴定依据，我愿意继续谈。"
 if extreme: discussion.reason="这个报价太悬殊，我先给一次反报价；再这样就结束接待。"
 elif fresh: discussion.reason="这份新的鉴定依据有帮助，可以继续商量；来源仍需单独核对。" if source in ["unverified","contradictory"] else "这份新的鉴定依据有帮助，可以继续商量。"
 elif concession: discussion.reason="你确实让了价，我也愿意继续商量。"
 return {"decision":"counter","reason":discussion.reason,"duplicate":false}
