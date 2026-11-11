class_name CounterDialogue
extends Object
## Ordinary counter verbs talk about one original; agreed originals stay remembered.
const VERBS := ["SELECT_TRADE","OFFER","ACCEPT","DELIVER","REFUSE","COUNTER_NEXT","COUNTER_CANCEL","COUNTER_FOCUS","COUNTER_MOVE","PAWN"]
static func active(s: Dictionary) -> bool:
 return s.get("trade")!=null and not s.trade.get("inspectionVisit",false) and bool(TradeSession.session(s).get("dialogue",false))
static func current(s: Dictionary) -> Dictionary:
 return TradeSession.row(s,String(TradeSession.session(s).get("focus","")))
## Per-item refusals keep this visitor available; explicit walkouts finish in the reducer.
static func departure_reason(s: Dictionary) -> String:
 var trade=s.get("trade")
 if trade==null or trade.get("inspectionVisit",false): return ""
 if trade.kind=="police" and WantedCases.has_notice(s): return "completed"
 if not active(s): return ""
 var totals:=TradeSession.summary(s)
 if totals.sell_count+totals.buy_count>0: return ""
 var line:=current(s)
 if line.get("status","")=="rejected" and line.get("context",{}).get("negotiation",{}).get(line.get("uid",""),{}).get("status","")!="rejected": return "refused"
 var se:=TradeSession.session(s)
 if not se.get("had_deal",false) or not se.goods.is_empty(): return ""
 if int(se.bought)>=int(se.want_count): return "completed"
 for it in s.inventory:
  if TradeSession._stock_problem(s,it,"sell")=="" and TradeSession.row(s,it.uid).get("status","") not in ["rejected","done"]: return ""
 return "completed"
static func begin(s: Dictionary) -> Dictionary:
 if s.get("trade")==null or s.trade.get("inspectionVisit",false) or s.trade.kind not in ["buy","sell"]: return s
 TradeSession.ensure(s)
 var se := TradeSession.session(s)
 se.dialogue=true;se.return_to_list=false
 # All offered originals are present together; focus only selects the topic.
 for lot in se.goods:
  if TradeSession.row(s,lot.uid).is_empty():
   se.lines.append(TradeSession._new_row(s,lot,"buy"));se.version+=1
 _place_table(s)
 var line := current(s)
 if not line.is_empty() and line.status!="done":
  _sync(s,line)
  if line.direction=="buy":
   for index in se.goods.size():
    if se.goods[index].uid==line.uid: se.offer_cursor=index
  if line.status=="confirmed": _reply(s,line)
  elif line.direction=="buy":
   s.trade.line="我带了%d件旧货，都摆这儿了。你可以挑一件或几件看看，价钱可以分别谈。" % se.goods.size() if se.goods.size()>1 else "这只%s我想出手，开价%s Cr。你先看看，价钱咱们可以谈。" % [GameData.def(TradeSession.item(s,line.uid).defId).name,Model.jnum(line.context.price)]
 else: _idle(s,"我想找些合适的旧表，你可以挑一件或几件一起摆上来。"+("我带的旧货也都在桌上，你随便看看。" if not se.goods.is_empty() else "合不合适，咱们看过再谈。"))
 return s
static func table_items(s: Dictionary) -> Array:
 var presented: Array=[]
 var se := TradeSession.session(s)
 for lot in se.get("goods",[]):
  var line := TradeSession.row(s,lot.uid)
  if line.get("status","")=="done": continue
  presented.append({"uid":lot.uid,"direction":"buy","status":line.get("status","ready"),"selected":line.get("selected",false),"price":line.get("context",{}).get("price",0),"focused":se.get("focus","")==lot.uid})
 for line in se.get("lines",[]):
  if line.direction=="sell" and line.included and line.status!="done" and TradeSession.item(s,line.uid)!=null:
   presented.append({"uid":line.uid,"direction":"sell","status":line.status,"selected":line.selected,"price":line.context.price,"focused":se.get("focus","")==line.uid})
 return presented
static func _table_slots(direction: String) -> Array:
 var slots: Array=[]
 var visitor:=direction=="buy"
 for index in (3 if visitor else 6): slots.append(Vector2((785 if visitor else 720)+index*(205 if visitor else 108),508 if visitor else 610))
 return slots
static func _place_table(s: Dictionary) -> void:
 var se := TradeSession.session(s)
 if not se.has("table_positions"): se.table_positions={}
 var shown:=table_items(s)
 var used: Array=[]
 var pending: Array=[]
 for info in shown:
  var old=se.table_positions.get(info.uid,[])
  var point:=Vector2(float(old[0]),float(old[1])) if old is Array and old.size()==2 else Vector2.INF
  if point in _table_slots(info.direction) and point not in used: used.append(point)
  else: se.table_positions.erase(info.uid);pending.append(info)
 for info in pending:
  for point in _table_slots(info.direction):
   if point in used: continue
   se.table_positions[info.uid]=[point.x,point.y];used.append(point);break
static func _focus_remaining(s: Dictionary) -> Dictionary:
 for shown in table_items(s):
  var line := TradeSession.row(s,shown.uid)
  if line.get("included",false):
   _reply(s,line)
   return s
 return s
static func _sync(s: Dictionary,line: Dictionary) -> void:
 var t: Dictionary=s.trade
 var se := TradeSession.session(s)
 _place_table(s)
 se.focus=line.uid
 t.kind=line.direction
 t.item=null
 if line.direction=="sell": t.selectedUid=line.uid
 else: t.erase("selectedUid")
 for key in ["price","rounds","evidenceUsed","npcKnowledge","forgeryChecks","negotiation"]: t[key]=line.context.get(key,{} if key in ["npcKnowledge","forgeryChecks","negotiation"] else [] if key=="evidenceUsed" else 0)
 t.locked=line.status=="confirmed" and line.selected
static func _idle(s: Dictionary,words: String) -> void:
 var t: Dictionary=s.trade
 TradeSession.session(s).focus=""
 t.kind="sell";t.item=null;t.erase("selectedUid");t.price=0;t.rounds=0;t.locked=false;t.evidenceUsed=[];t.line=words
static func _judge(s: Dictionary,line: Dictionary) -> void:
 var it=TradeSession.item(s,line.uid)
 var why := TradeSession._stock_problem(s,it,line.direction)
 if why!="": line.status="blocked";line.reason=why;line.selected=false;return
 if TradeSession._check_forgery(s,line,it): return
 if line.context.get("negotiation",{}).get(line.uid,{}).get("status","")=="rejected": line.status="rejected";line.selected=false;return
 if line.direction=="sell" and not line.selected:
  var totals := TradeSession.summary(s)
  if int(TradeSession.session(s).bought)+int(totals.sell_count)>=int(TradeSession.session(s).want_count): line.status="rejected";line.reason="这趟要的数量已经够了，其他的我先不收。";return
  if totals.income+float(line.context.price)>float(TradeSession.session(s).cash)+totals.expense:
   var remaining: float=floor(float(TradeSession.session(s).cash)+totals.expense-totals.income)
   if remaining>=1:
    line.context.price=remaining;line.status="counter";line.reason="预算只剩%s Cr，这只我最多出这些。" % Model.jnum(remaining)
   else: line.status="rejected";line.reason="这趟的预算已经花完了，其他的我先不收。"
   return
 if line.status not in ["confirmed","done"]:
  line.status="ready" if Model.price_agreed(s,line.context,it) else "counter"
 line.fingerprint=TradeSession.fingerprint(it)
static func _reply(s: Dictionary,line: Dictionary) -> void:
 _sync(s,line)
 var it=TradeSession.item(s,line.uid)
 var name := String(GameData.def(WatchForgery.target_id(it) if WatchForgery.is_targeted(it) else String(it.defId)).name) if it!=null else "这只"
 if line.status in ["blocked","rejected"]:
  s.trade.line="%s我先不收。%s %s" % [name,line.reason,"这次先到这儿吧。" if departure_reason(s)=="refused" else "先把已经说好的货物交割，其他的可以再谈。" if TradeSession.summary(s).sell_count+TradeSession.summary(s).buy_count>0 else "可以换其他货物，或者稍后再谈。"]
 elif line.status=="confirmed":
  s.trade.line="行，%s就按%s Cr。说好的几件我都记着，你还有别的可以接着拿。" % [name,Model.jnum(line.context.price)]
 elif line.direction=="buy":
  s.trade.line="这只%s我开%s Cr，你可以先鉴定，再跟我谈。%s" % [name,Model.jnum(line.context.price),line.reason if int(line.context.rounds)>0 else ""]
 else:
  s.trade.line="%s我可以考虑，我出%s Cr。合适的话就这么说定，也可以继续谈。%s" % [name,Model.jnum(line.context.price),line.reason]
static func _call(s: Dictionary,type: String,extra: Dictionary={}) -> Dictionary:
 return TradeSession.reduce(s,{"type":type,"tradeId":s.trade.id}.merged(extra,true))
static func next_offer(s: Dictionary) -> Dictionary:
 var se := TradeSession.session(s)
 var goods: Array=se.goods
 var start := int(se.get("offer_cursor",-1))
 for offset in range(1,goods.size()+1):
  var index := (start+offset)%goods.size()
  var lot: Dictionary=goods[index]
  var old := TradeSession.row(s,lot.uid)
  if not old.is_empty() and old.status=="done": continue
  s=_call(s,"TRADE_ADD",{"uid":lot.uid,"direction":"buy"})
  TradeSession.session(s).offer_cursor=index
  var line := TradeSession.row(s,lot.uid)
  if not line.is_empty(): _reply(s,line)
  return s
 _idle(s,"今天带来的货都看过了。你还有货就拿给我看看，或者先把已经说好的结了。")
 return s
static func reduce(previous: Dictionary,a: Dictionary):
 var type=String(a.get("type",""))
 if type=="DIALOGUE_RESUME": return begin(previous.duplicate(true))
 if not active(previous) or type not in VERBS: return null
 if previous.phase!="open": return Model.notice(previous.duplicate(true),Model.business_hours_problem(previous))
 var s: Dictionary=previous.duplicate(true)
 var se := TradeSession.session(s)
 var line := current(s)
 if type=="REFUSE": return _call(s,"TRADE_END")
 if type=="COUNTER_NEXT": return next_offer(s) # Legacy saved actions remain compatible.
 if type in ["COUNTER_FOCUS","COUNTER_MOVE"]:
  if a.get("tradeId","")!=s.trade.id: return previous
  var uid=String(a.get("uid",""))
  if not table_items(s).any(func(shown):return shown.uid==uid): return previous
  if type=="COUNTER_MOVE":
   var point=a.get("position",null)
   if not point is Array or point.size()!=2: return previous
   for coordinate in point:
    if not (coordinate is int or coordinate is float) or not is_finite(float(coordinate)): return previous
   if not se.has("table_positions"): se.table_positions={}
   var info: Dictionary=table_items(s).filter(func(shown):return shown.uid==uid)[0]
   var slots:=_table_slots(info.direction)
   var drop:=Vector2(float(point[0]),float(point[1]))
   slots.sort_custom(func(left,right):return left.distance_squared_to(drop)<right.distance_squared_to(drop))
   var occupied: Array=[]
   for shown in table_items(s):
    if shown.uid==uid: continue
    var old=se.table_positions.get(shown.uid,[])
    if old is Array and old.size()==2: occupied.append(Vector2(float(old[0]),float(old[1])))
   for slot in slots:
    if slot not in occupied:
     se.table_positions[uid]=[slot.x,slot.y]
     return s
   return previous
  var focused:=TradeSession.row(s,uid)
  if not focused.get("included",false):
   s=_call(s,"TRADE_ADD",{"uid":uid,"direction":"buy"})
   focused=TradeSession.row(s,uid)
  _reply(s,focused)
  return s
 if type in ["OFFER","ACCEPT","PAWN","COUNTER_CANCEL"]:
  if a.get("uid","")!=String(se.focus) or a.get("version",-1)!=se.version: return Model.notice(s,"刚才商谈的货物已变化，请按当前这一件重新确认。")
 if type=="COUNTER_CANCEL":
  if not line.is_empty():
   s=_call(s,"TRADE_REMOVE",{"uid":line.uid})
   if line.direction=="sell": TradeSession.session(s).get("table_positions",{}).erase(line.uid)
  _idle(s,"这只先放一边。你有其他货可以再拿给我看看，我带的货也还能接着聊。")
  return _focus_remaining(s)
 if type=="SELECT_TRADE":
  var uid=a.get("uid","")
  if not uid is String: return previous
  var why := TradeSession._stock_problem(s,TradeSession.item(s,uid),"sell")
  if why!="": s.trade.line="这只暂时不能收。"+why;return Model.notice(s,why)
  s=_call(s,"TRADE_ADD",{"uid":uid,"direction":"sell"})
  line=TradeSession.row(s,uid)
  if line.is_empty() or not line.included or line.status=="done": s.trade.line=s.notice;return s
  if line.status=="queued": _judge(s,line)
  _reply(s,line)
  return s
 if type=="PAWN":
  if a.get("tradeId","")!=s.trade.id or line.is_empty() or line.direction!="buy": return previous
  var totals := TradeSession.summary(s)
  if totals.sell_count+totals.buy_count>0: return Model.notice(s,"先交割或取消已经说定的货物，再单独办理这只表的抵押。")
  var ctx: Dictionary=s.duplicate(true)
  TradeSession.persist_holdings(ctx)
  ctx.trade.item=TradeSession.item(s,line.uid).duplicate(true)
  ctx.npcTrade[s.trade.npcId].owned=ctx.npcTrade[s.trade.npcId].owned.filter(func(lot):return lot.uid!=line.uid)
  ctx.trade.erase("session")
  var result := Model.reduce(ctx,a)
  if result.trade!=null: return Model.notice(s,result.notice)
  var record: Dictionary=result.npcTrade[s.trade.npcId]
  record.cash=se.cash+float(s.cash)-float(result.cash)
  if se.get("had_deal",false):
   var faction: String=GameData.npc(s.trade.npcId).faction
   result.relations[faction]=Model.clampn(result.relations[faction]+2)
  return result
 if type=="DELIVER":
  if a.get("tradeId","")!=s.trade.id: return previous
  if a.get("version",-1)!=se.version or not a.get("batch",null) is String: return Model.notice(s,"商谈内容已变化，请重新核对这次交割；钱货未变动。")
  var summary := TradeSession.summary(s)
  if summary.sell_count+summary.buy_count==0: return Model.notice(s,"先把这一件的价钱谈妥，再确认交割。")
  var before_batches: int=se.completed.size()
  var result := _call(s,"TRADE_CHECKOUT",{"version":a.version,"batch":a.batch})
  if TradeSession.session(result).completed.size()==before_batches: result.trade.line=result.notice;return result
  var receipt := {"income":summary.income,"expense":summary.expense,"net":summary.net,"count":summary.sell_count+summary.buy_count}
  TradeSession.session(result).last_receipt=receipt
  _idle(result,"说好的都交割好了。我还在，你可以继续拿货给我看，也可以看看我带的其他东西。")
  result=_focus_remaining(result)
  if departure_reason(result)=="completed": result.trade.line="说好的都交割好了，钱货两清。这次先到这儿，下回再来。"
  return result
 if line.is_empty() or line.status=="done": return Model.notice(s,"你可以拿一只货给我看看，或者问问我带来的东西。")
 if type in ["OFFER","ACCEPT"] and (line.selected or line.status=="confirmed"): return previous
 if type=="OFFER":
  s=_call(s,"TRADE_OFFER",{"uid":line.uid,"price":a.get("price"),"evidence":a.get("evidence",null)})
  if s.trade==null: return s
  line=TradeSession.row(s,line.uid)
  if int(line.context.rounds)==int(current(previous).context.rounds): s.trade.line=s.notice;return s
  # Judgement can mark a changed NPC counterprice ready; only the submitted price carries player consent.
  var submitted_agreed: bool=line.status=="ready" and line.context.price==a.get("price")
  _judge(s,line)
  if submitted_agreed and line.status=="ready" and line.context.price==a.get("price"):
   s=_call(s,"TRADE_CONFIRM",{"uid":line.uid})
   line=TradeSession.row(s,line.uid)
  _reply(s,line)
  return s
 if type=="ACCEPT":
  _judge(s,line)
  if line.status not in ["ready","counter","confirmed"]: _reply(s,line);return s
  s=_call(s,"TRADE_CONFIRM",{"uid":line.uid})
  line=TradeSession.row(s,line.uid);_reply(s,line)
  return s
 return null

static func action_for(s: Dictionary,type: String,extra: Dictionary={}) -> Dictionary:
 var se := TradeSession.session(s)
 var version: int=int(se.get("version",0))
 return {"type":type,"tradeId":s.trade.id,"uid":String(se.get("focus","")),"version":version,"batch":"counter-"+str(version)}.merged(extra,true)
