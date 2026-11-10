class_name TradeSession
extends Object
## Original objects live in inventory or session.goods. Rows contain quotes, never copies.
const ACTIONS := ["TRADE_OPEN","TRADE_ADD","TRADE_REMOVE","TRADE_REVIEW","TRADE_OFFER","TRADE_CONFIRM","TRADE_FOCUS","TRADE_CHECKOUT","TRADE_END","TRADE_REORDER"]
static func session(s: Dictionary) -> Dictionary:
 return s.get("trade",{}).get("session",{}) if s.get("trade") is Dictionary else {}
static func row(s: Dictionary, uid: String) -> Dictionary:
 for line in session(s).get("lines",[]):
  if line.uid==uid: return line
 return {}
static func item(s: Dictionary, uid: String):
 var owned=Model.find_inventory(s,uid)
 if owned!=null: return owned
 for lot in session(s).get("goods",[]):
  if lot.uid==uid: return lot
 return null
static func fingerprint(it: Dictionary) -> String:
 return JSON.stringify([Model.appraisal_revision(it),it.owner,it.sourceVerified,it.sealed,it.location,it.get("orderId",""),it.get("service",{}).get("opened",false)])
static func ensure(s: Dictionary) -> void:
 if not session(s).is_empty(): return
 var t: Dictionary=s.trade
 if not s.get("npcTrade") is Dictionary: s.npcTrade={}
 var old_cash: float=800+Model.fnv(String(s.seed)+t.npcId)%1000
 var record: Dictionary=s.npcTrade.get(t.npcId,{"cash":old_cash,"owned":[]})
 if String(GameData.npc(t.npcId).get("title","")).contains("收藏") and int(record.get("star_budget_version",0))<1:
  var high:=0.0
  for definition in GameData.item_list:
   if definition.get("watch",{}).get("brand","")=="星冕": high=maxf(high,float(definition.value))
  var initial: float=high*2+Model.fnv(String(s.seed)+t.npcId)%maxi(1,int(high))
  record.cash=float(record.cash)+maxf(0,initial-old_cash)
  record.star_budget_version=1
 s.npcTrade[t.npcId]=record
 var goods: Array=[]
 var count := int(Model.fnv(String(s.seed)+String(t.id)+"/goods")%4)
 if t.kind=="buy" and t.get("item") is Dictionary: goods.append(t.item);count=maxi(1,count)
 if t.kind=="merchant" and t.get("rare") is Dictionary and t.rare.get("available",false):
  goods.append(Model.new_item(s,t.rare.defId,{"owner":"npc","authentic":t.rare.get("authentic",true),"working":true,"condition":0.8,"sourceVerified":true,"source":"流动商人的已登记货品"}))
  count=maxi(1,count)
  t.rare.available=false
 while goods.size()<count and not record.owned.is_empty(): goods.append(record.owned.pop_front())
 while goods.size()<count:
  var n := int(Model.fnv("%s/%s/%d" % [s.seed,t.id,goods.size()]))
  var npc := GameData.npc(t.npcId)
  var pool: Array=GameData.item_list
  if String(npc.get("title","")).contains("收藏"):
   pool=GameData.item_list.filter(func(d):return float(d.value)>=337)
  var supply_key := "counter/%s/%d" % [t.id,goods.size()]
  var definition_id := WatchSupply.pick(s.seed,supply_key,pool)
  var working: bool=n%5==0 if String(npc.get("title","")).contains("维修") else n%3!=0
  var lot := Model.new_item(s,definition_id,{"owner":"npc","condition":0.45+float(n%46)/100.0,"authentic":WatchSupply.authentic(s.seed,supply_key),"working":working,"sourceVerified":n%8!=0,"source":"%s 随身旧物" % GameData.npc(t.npcId).name})
  goods.append(lot)
 var prior_case_holders: Dictionary={}
 for lot in goods:
  lot.owner="npc"
  var tracked := NightCrime._row(NightCrime._case(s,String(lot.get("crimeCaseId",""))),lot.uid)
  if not tracked.is_empty():
   prior_case_holders[lot.uid]=tracked.holder if tracked.holder!="trade" else ("case" if t.get("crimeCaseId","")==lot.get("crimeCaseId","") else "buyer")
 t.session={"version":1,"lines":[],"goods":goods,"acquired":[],"cash":float(record.cash),"want_count":1+Model.fnv(String(s.seed)+String(t.id)+"/quantity")%6,"bought":0,"completed":[],"focus":"","had_sale":false,"original_kind":t.kind,"prior_case_holders":prior_case_holders}
 var existing = t.get("item") if t.kind=="buy" else Model.find_inventory(s,t.get("selectedUid",""))
 if existing!=null:
  var line := _new_row(s,existing,"buy" if t.kind=="buy" else "sell")
  var ctx: Dictionary=t.duplicate(true);ctx.erase("session");ctx.item=null
  line.context=ctx
  line.status="confirmed" if t.locked else "ready"
  line.selected=bool(t.locked)
  line.fingerprint=fingerprint(existing)
  t.session.lines.append(line)
  t.session.focus=existing.uid
 t.item=null # The session is the sole live holder of visitor goods.
 t.locked=false
static func persist_holdings(s: Dictionary) -> void:
 # All visit-ending paths retain NPC originals, including police reports.
 # Case originals return to the holder they had before entering this session.
 var se := session(s)
 if se.is_empty(): return
 var record: Dictionary=s.npcTrade[s.trade.npcId]
 record.cash=se.cash
 for lot in se.goods+se.acquired:
  var tracked := NightCrime._row(NightCrime._case(s,String(lot.get("crimeCaseId",""))),lot.uid)
  if tracked.get("holder","")=="trade":
   tracked.item=lot.duplicate(true)
   var fallback := "case" if s.trade.get("crimeCaseId","")==lot.get("crimeCaseId","") else "buyer"
   tracked.holder=se.get("prior_case_holders",{}).get(lot.uid,fallback)
  if not tracked.get("resolved",false) and tracked.get("holder","")!="case":
   if not record.owned.any(func(owned):return owned.uid==lot.uid): record.owned.append(lot)

static func _new_row(s: Dictionary, it: Dictionary, direction: String) -> Dictionary:
 var context := {"id":s.trade.id,"npcId":s.trade.npcId,"kind":direction,"item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"npcKnowledge":{},"forgeryChecks":{}}
 if s.trade.get("forgeryChecks",{}).has(it.uid): context.forgeryChecks[it.uid]=s.trade.forgeryChecks[it.uid].duplicate(true)
 var terms := Model.trade_terms(s,context,it)
 context.price=terms.opening if direction=="sell" else maxf(terms.floor,ceil(terms.value*1.1))
 return {"uid":it.uid,"direction":direction,"context":context,"status":"queued" if direction=="sell" else "ready","reason":"等待 NPC 查看" if direction=="sell" else "NPC 已报开价，可还价或确认购买","selected":false,"fingerprint":fingerprint(it),"included":true}
static func summary(s: Dictionary) -> Dictionary:
 var se := session(s)
 var result := {"version":se.get("version",0),"sell_count":0,"buy_count":0,"income":0.0,"expense":0.0,"net":0.0,"lines":se.get("lines",[]),"goods":[],"focus":se.get("focus","")}
 for lot in se.get("goods",[]): result.goods.append({"uid":lot.uid,"name":WatchForgery.sale_name(lot)})
 for line in se.get("lines",[]):
  if not line.get("included",true) or not line.selected or line.status!="confirmed": continue
  if line.direction=="sell": result.sell_count+=1;result.income+=float(line.context.price)
  else: result.buy_count+=1;result.expense+=float(line.context.price)
 result.net=result.income-result.expense
 return result
static func _stock_problem(s: Dictionary, it, direction: String) -> String:
 if it==null: return "原物已不在当前持货中。"
 if direction=="buy":
  for lot in session(s).goods:
   if lot.uid==it.uid: return ""
  return "这件货不是该 NPC 本次带来的。"
 var candidate: Dictionary=it.duplicate(true)
 if not candidate.sourceVerified and not candidate.get("crimeRevealed",false): candidate.graySale=true
 return String(Model.sale_eligibility(candidate,s.trade.npcId)) if Model.sale_eligibility(candidate,s.trade.npcId)!=null else ""
static func _check_forgery(s: Dictionary, line: Dictionary, it: Dictionary) -> bool:
 if line.direction!="sell": return false
 var commerce=load("res://scripts/model/commerce.gd")
 var probe: Dictionary=s.duplicate(true)
 probe.trade=line.context.duplicate(true)
 var caught: Array=commerce._check_forgery(probe,it)
 if not caught.is_empty():
  probe=commerce._reject_forgery(probe,it,caught)
  s.risk=probe.risk;s.relations=probe.relations
  line.context=probe.trade
  line.status="rejected";line.selected=false;line.reason=probe.notice
  return true
 if commerce.forgery_rejected(probe,it):
  line.status="rejected";line.selected=false;line.reason="本轮已识破这件仿冒品，不接受重复推荐。"
  return true
 line.context=probe.trade
 return false
static func _review(s: Dictionary) -> void:
 var se := session(s)
 var totals := summary(s)
 var committed: float=totals.income
 var count := int(se.bought)+int(totals.sell_count)
 var funds: float=float(se.cash)+totals.expense
 for line in se.lines:
  if not line.included or line.status=="done" or line.status=="confirmed" or line.direction!="sell": continue
  var it=item(s,line.uid)
  var why := _stock_problem(s,it,line.direction)
  line.selected=false
  if why!="": line.status="blocked";line.reason=why;continue
  if _check_forgery(s,line,it): continue
  if count>=int(se.want_count): line.status="rejected";line.reason="本次采购数量已足够，可以取消其他推荐后重算。";continue
  if committed+float(line.context.price)>funds: line.status="rejected";line.reason="预算不足，可降低报价或调整其他商品。";continue
  line.fingerprint=fingerprint(it)
  if not Model.price_agreed(s,line.context,it):
   line.context.price=Model.counter_price(s,line.context,it)
   line.status="counter";line.reason="NPC 提出还价，可接受当前价或继续议价。"
  else: line.status="ready";line.reason="愿意购买，可按当前报价确认。"
  count+=1;committed+=float(line.context.price)
static func checkout_problem(s: Dictionary) -> String:
 var totals := summary(s)
 if totals.sell_count+totals.buy_count==0: return "请先逐件确认至少一件商品。"
 if not Model.has_ap(s,1): return "交割需要1 AP，钱货均未变动。"
 if float(s.cash)+totals.net>1000000000: return "现金将超出保存上限，本批未交割。"
 if float(s.cash)+totals.net<0: return "现金不足以支付本批差额，钱货均未变动。"
 if float(session(s).cash)-totals.net<0: return "NPC 预算不足以支付本批差额，请调整清单。"
 if int(session(s).bought)+totals.sell_count>int(session(s).want_count): return "超出 NPC 本次计划购买数量，请调整清单。"
 for line in session(s).lines:
  if not line.included or not line.selected or line.status!="confirmed": continue
  var it=item(s,line.uid)
  var why := _stock_problem(s,it,line.direction)
  if why!="": return why
  var consent := NightCrime.batch_gray_problem(s,it,line.context.price)
  if consent!="": return consent
  if fingerprint(it)!=line.fingerprint: return "原物状态已变化，请重新查看并确认该件。"
  if not Model.price_agreed(s,line.context,it): return "有一件约定价格已过期，请重新议价确认。"
 return ""
static func reduce(previous: Dictionary, action: Dictionary):
 var type=action.get("type","")
 if type not in ACTIONS: return null
 if previous.get("trade")==null or previous.trade.get("inspectionVisit",false) or previous.trade.get("kind","") not in ["buy","sell","merchant"]: return Model.notice(previous.duplicate(true),"请先接待普通买卖来客。")
 if type!="TRADE_OPEN" and action.get("tradeId","")!=previous.trade.id: return Model.notice(previous.duplicate(true),"来访已变化，请重新打开当前来客的清单；钱货未变动。")
 var s: Dictionary=previous.duplicate(true)
 if s.phase!="open": return Model.notice(s,"打烊后不能买卖，请明日营业后再操作。")
 var device_problem := StoreCosts.device_problem(s,"quote_terminal")
 if type in ["TRADE_REVIEW","TRADE_OFFER","TRADE_CONFIRM","TRADE_CHECKOUT"] and device_problem!="": return Model.notice(s,device_problem)
 ensure(s)
 var se := session(s)
 var uid=action.get("uid","")
 if not uid is String: return previous
 var line := row(s,uid)
 var it=item(s,uid)
 if type=="TRADE_OPEN":
  se.return_to_list=false
  return Model.notice(s,"多件清单已展开：逐件议价确认，再统一交割；结束接待才送客。")
 if type=="TRADE_END":
  if se.get("had_deal",se.had_sale):
   var faction: String=GameData.npc(s.trade.npcId).faction
   s.relations[faction]=Model.clampn(s.relations[faction]+2)
  return Model.finish_trade(s,"本次接待已结束，未成交商品仍归原主。")
 if type=="TRADE_FOCUS":
  if it==null: return previous
  se.focus=uid
  se.view_scroll=maxi(0,int(action.get("scroll",se.get("view_scroll",0))))
  se.view_expanded=String(action.get("expanded",se.get("view_expanded","")))
  se.return_to_list=bool(action.get("return_list",false))
  return s
 if type=="TRADE_ADD":
  var direction=action.get("direction","")
  if direction not in ["buy","sell"]: return previous
  var why := _stock_problem(s,it,direction)
  if why!="": return Model.notice(s,why)
  if not line.is_empty() and line.status=="done": return Model.notice(s,"本次已成交的原物不能马上反向挂牌。")
  var active_count := 0
  for entry in se.lines:
   if entry.included and entry.direction==direction and entry.status!="done": active_count+=1
  if line.is_empty() or not line.included:
   if active_count>=(6 if direction=="sell" else 3): return Model.notice(s,"本批最多推荐6件、购买3件，请先调整清单。")
   if line.is_empty(): line=_new_row(s,it,direction);se.lines.append(line)
   else: line.included=true;line.status="queued" if direction=="sell" else "ready"
   se.version+=1
  se.focus=uid
  return s
 if type=="TRADE_REORDER":
  if line.is_empty() or not line.included or line.status=="done": return previous
  var index: int=se.lines.find(line)
  var shift=action.get("shift",0)
  if shift not in [-1,1]: return previous
  var destination:=clampi(index+int(shift),0,se.lines.size()-1)
  se.lines.remove_at(index);se.lines.insert(destination,line);se.version+=1
  return Model.notice(s,"已调整查看顺序，请重新请 NPC 查看未确认的推荐。")
 if type=="TRADE_REMOVE":
  if line.is_empty() or line.status=="done": return previous
  line.included=false;line.selected=false;se.version+=1
  _rebalance(s)
  return s
 if type=="TRADE_REVIEW":
  _review(s);se.version+=1
  var accepted := 0;var rejected := 0;var counter := 0
  for entry in se.lines:
   if not entry.included or entry.direction!="sell" or entry.status=="done": continue
   if entry.status in ["ready","confirmed"]: accepted+=1
   elif entry.status=="counter": counter+=1
   else: rejected+=1
  return Model.notice(s,"愿买 %d 件 · 还价 %d 件 · 拒绝/受阻 %d 件；具体原因见各行。" % [accepted,counter,rejected])
 if type in ["TRADE_OFFER","TRADE_CONFIRM"]:
  if line.is_empty() or not line.included or line.status=="done": return previous
  var why := _stock_problem(s,it,line.direction)
  if why!="": return Model.notice(s,why)
  var consent := NightCrime.batch_gray_problem(s,it,action.get("price",line.context.price) if type=="TRADE_OFFER" else line.context.price)
  if consent!="": return Model.notice(s,consent)
  if _check_forgery(s,line,it): se.version+=1;return Model.notice(s,line.reason)
  if type=="TRADE_OFFER":
   var price=action.get("price")
   var terms := Model.trade_terms(s,line.context,it)
   if not Model.valid_price(price) or float(price)>float(terms.marketCap): return Model.notice(s,"无效报价，本件有效议价次数未变化。")
   if int(line.context.rounds)>=3: return Model.notice(s,"本件三次有效还价已用完，可接受当前报价或取消。")
   var evidence=action.get("evidence",null)
   if evidence!=null:
    if not evidence is String or not it.evidence.has(evidence): return Model.notice(s,"请选择本件已经取得的物证。")
    Model.disclose_evidence(line.context,it,evidence)
    if not line.context.evidenceUsed.has(evidence): line.context.evidenceUsed.append(evidence)
   line.context.rounds+=1;line.context.price=price;line.selected=false
   if Model.price_agreed(s,line.context,it): line.status="ready";line.reason="此价可以，等待逐件确认。"
   else: line.context.price=Model.counter_price(s,line.context,it);line.status="counter";line.reason="对方还价，可接受当前价或继续谈。"
   line.fingerprint=fingerprint(it);se.version+=1
   _rebalance(s)
   return s
  if line.status not in ["ready","counter","confirmed"]: return Model.notice(s,"这件尚未获接受，请先请 NPC 查看或调整报价。")
  if not Model.price_agreed(s,line.context,it): return Model.notice(s,"当前价尚未达成约定，请先议价。")
  line.status="confirmed";line.selected=true;line.fingerprint=fingerprint(it);se.version+=1
  why=checkout_problem(s)
  if why!="" and ("预算" in why or "数量" in why):
   line.status="ready";line.selected=false;line.reason=why
   return Model.notice(s,why)
  return Model.notice(s,"已确认本件，钱货将在统一交割时变动。")
 if type=="TRADE_CHECKOUT":
  var batch=action.get("batch","")
  if not batch is String or batch=="" or batch.length()>100: return previous
  if se.completed.has(batch): return previous
  if action.get("version",-1)!=se.version: return Model.notice(s,"清单已变化，请重新核对后交割；钱货未变动。")
  var why := checkout_problem(s)
  if why!="": return Model.notice(s,why)
  var totals := summary(s)
  var outgoing: Array=[];var incoming: Array=[]
  for entry in se.lines:
   if entry.included and entry.selected and entry.status=="confirmed":
    if entry.direction=="sell": outgoing.append(entry)
    else: incoming.append(entry)
  for entry in outgoing:
   var original: Dictionary=item(s,entry.uid)
   original.owner="npc";original.location="npc"
   se.acquired.append(original)
   Model._remove_item(s,entry.uid)
  for entry in incoming:
   var original: Dictionary=item(s,entry.uid)
   original.owner="shop";original.cost=entry.context.price
   if not original.sourceVerified and int(s.day)<3: s.risk=Model.clampn(s.risk+12)
   if not Model.put_in(s,original): return Model.notice(previous.duplicate(true),"后仓无法放下本批全部原物，请整理后重试；钱货与 AP 均未变动。")
   se.goods.erase(original)
  se.cash-=totals.net;se.bought+=totals.sell_count;se.had_sale=se.had_sale or totals.sell_count>0
  for entry in outgoing+incoming:
   var cost=0.0
   if entry.direction=="sell":
    for original in se.acquired:
     if original.uid==entry.uid: cost=original.cost
   else: cost=float(entry.context.price)
   var label := ("售出 " if entry.direction=="sell" else "购入 ")+WatchForgery.sale_name(item(s,entry.uid) if entry.direction=="buy" else se.acquired.filter(func(lot):return lot.uid==entry.uid)[0])
   Model.ledger(s,"%s/%s/%s" % [s.trade.id,batch,entry.uid],"sale" if entry.direction=="sell" else "purchase",label,float(entry.context.price)*(1 if entry.direction=="sell" else -1),cost)
   entry.status="done";entry.selected=false;entry.reason="已交割 · 原物归属已保存"
  se.had_deal=true
  Model.spend(s,1);se.completed.append(batch);se.version+=1
  s.npcTrade[s.trade.npcId].cash=se.cash
  return Model.notice(s,"批次交割完成：售出%d件、买入%d件，%s差额 %s Cr；可继续商谈或结束接待。" % [totals.sell_count,totals.buy_count,"实收" if totals.net>=0 else "实付",Model.jnum(absf(totals.net))])
 return previous

static func _rebalance(s: Dictionary) -> void:
 var se := session(s)
 var available: float=float(se.cash)+float(summary(s).expense)
 var used := 0.0
 for line in se.lines:
  if not line.included or not line.selected or line.status!="confirmed" or line.direction!="sell": continue
  if used+float(line.context.price)>available:
   line.status="ready";line.selected=false;line.reason="资金分配变化，待重新确认。"
  else: used+=float(line.context.price)
