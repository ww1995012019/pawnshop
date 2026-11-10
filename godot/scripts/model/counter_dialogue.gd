class_name CounterDialogue
extends Object
## Ordinary counter verbs talk about one original; agreed originals stay remembered.
const VERBS := ["SELECT_TRADE","OFFER","ACCEPT","DELIVER","REFUSE","COUNTER_NEXT","COUNTER_CANCEL","PAWN"]
static func active(s: Dictionary) -> bool:
 return bool(TradeSession.session(s).get("dialogue",false))
static func current(s: Dictionary) -> Dictionary:
 return TradeSession.row(s,String(TradeSession.session(s).get("focus","")))
static func begin(s: Dictionary) -> Dictionary:
 if s.get("trade")==null or s.trade.kind not in ["buy","sell"]: return s
 TradeSession.ensure(s)
 var se := TradeSession.session(s)
 se.dialogue=true;se.return_to_list=false
 var line := current(s)
 if not line.is_empty() and line.status!="done":
  _sync(s,line)
  if line.status=="confirmed": _reply(s,line)
  elif line.direction=="buy": s.trade.line="这只%s我想出手，开价%s Cr。你先看看，价钱咱们可以谈。" % [GameData.def(TradeSession.item(s,line.uid).defId).name,Model.jnum(line.context.price)]
 else: _idle(s,"我想找些合适的旧表。你店里的货可以一件件拿给我看；我带的东西也能给你瞧瞧。")
 return s
static func _sync(s: Dictionary,line: Dictionary) -> void:
 var t: Dictionary=s.trade
 var se := TradeSession.session(s)
 se.focus=line.uid
 t.kind=line.direction
 t.item=TradeSession.item(s,line.uid) if line.direction=="buy" else null
 if line.direction=="sell": t.selectedUid=line.uid
 else: t.erase("selectedUid")
 for key in ["price","rounds","evidenceUsed","npcKnowledge","forgeryChecks"]: t[key]=line.context.get(key,{} if key in ["npcKnowledge","forgeryChecks"] else [] if key=="evidenceUsed" else 0)
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
  s.trade.line="%s我先不收。%s 你可以再拿别的给我看看。" % [name,line.reason]
 elif line.status=="confirmed":
  s.trade.line="行，%s就按%s Cr。说好的几件我都记着，你还有别的可以接着拿。" % [name,Model.jnum(line.context.price)]
 elif line.direction=="buy":
  s.trade.line="这只%s我开%s Cr，你可以先鉴定，再跟我谈。" % [name,Model.jnum(line.context.price)]
 else:
  s.trade.line="%s我可以考虑，我出%s Cr。合适的话就这么说定，也可以继续谈。%s" % [name,Model.jnum(line.context.price),line.reason if "预算" in line.reason else ""]
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
  if not old.is_empty() and old.status in ["confirmed","done"]: continue
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
 if type=="COUNTER_NEXT": return next_offer(s)
 if type=="COUNTER_CANCEL":
  if not line.is_empty(): s=_call(s,"TRADE_REMOVE",{"uid":line.uid})
  _idle(s,"这只先放一边。你有其他货可以再拿给我看看，我带的货也还能接着聊。")
  return s
 if type=="SELECT_TRADE":
  var uid=a.get("uid","")
  if not uid is String: return previous
  var why := TradeSession._stock_problem(s,TradeSession.item(s,uid),"sell")
  if why!="": s.trade.line="这只暂时不能收。"+why;return Model.notice(s,why)
  s=_call(s,"TRADE_ADD",{"uid":uid,"direction":"sell"})
  line=TradeSession.row(s,uid)
  if line.is_empty() or line.status=="done": return s
  _judge(s,line);_reply(s,line)
  return s
 if type=="PAWN":
  if a.get("tradeId","")!=s.trade.id or line.is_empty() or line.direction!="buy": return previous
  var totals := TradeSession.summary(s)
  if totals.sell_count+totals.buy_count>0: return Model.notice(s,"先交割或取消已经说定的货物，再单独办理这只表的抵押。")
  var ctx: Dictionary=s.duplicate(true);ctx.trade.erase("session")
  var result := Model.reduce(ctx,a)
  if result.trade!=null: return Model.notice(s,result.notice)
  var record: Dictionary=result.npcTrade[s.trade.npcId]
  record.cash=se.cash+float(s.cash)-float(result.cash)
  if se.get("had_deal",false):
   var faction: String=GameData.npc(s.trade.npcId).faction
   result.relations[faction]=Model.clampn(result.relations[faction]+2)
  for lot in se.goods+se.acquired:
   if lot.uid!=line.uid: record.owned.append(lot)
  return result
 if type=="DELIVER":
  if a.get("tradeId","")!=s.trade.id: return previous
  var summary := TradeSession.summary(s)
  if summary.sell_count+summary.buy_count==0: return Model.notice(s,"先把这一件的价钱谈妥，再确认交割。")
  var before_batches: int=se.completed.size()
  var result := _call(s,"TRADE_CHECKOUT",{"version":summary.version,"batch":"counter-"+str(summary.version)})
  if TradeSession.session(result).completed.size()==before_batches: result.trade.line=result.notice;return result
  var receipt := {"income":summary.income,"expense":summary.expense,"net":summary.net,"count":summary.sell_count+summary.buy_count}
  TradeSession.session(result).last_receipt=receipt
  _idle(result,"说好的都交割好了。我还在，你可以继续拿货给我看，也可以看看我带的其他东西。")
  return next_offer(result)
 if line.is_empty() or line.status=="done": return Model.notice(s,"你可以拿一只货给我看看，或者问问我带来的东西。")
 if type=="OFFER":
  s=_call(s,"TRADE_OFFER",{"uid":line.uid,"price":a.get("price"),"evidence":a.get("evidence",null)})
  line=TradeSession.row(s,line.uid)
  if int(line.context.rounds)==int(current(previous).context.rounds): s.trade.line=s.notice;return s
  _judge(s,line);_reply(s,line)
  return s
 if type=="ACCEPT":
  _judge(s,line)
  if line.status not in ["ready","counter","confirmed"]: _reply(s,line);return s
  s=_call(s,"TRADE_CONFIRM",{"uid":line.uid})
  line=TradeSession.row(s,line.uid);_reply(s,line)
  return s
 return null
