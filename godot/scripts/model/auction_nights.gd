class_name AuctionNights
extends RefCounted
## Only saved originals carry private physical facts. Public records are detached.
const DEPOSIT := 20
const TOOLS := ["TOL-001","TOL-002","TOL-005"]
const TERMINAL := ["settled","passed","expired","declined"]
const ACTIONS := ["AUCTION_INSPECT","AUCTION_JOIN","AUCTION_BID","AUCTION_PASS","AUCTION_CANCEL","AUCTION_SETTLE","AUCTION_DECLINE"]

static func ensure(s: Dictionary) -> void:
	if not s.get("auctionNights") is Dictionary:
		s.auctionNights = {"version":1,"startDay":int(s.day),"entries":[]}
	var book: Dictionary = s.auctionNights
	if not book.has("startDay"): book.startDay = int(s.day)
	if not book.get("entries") is Array: book.entries = []
	book.version = 1
	var due := int(book.startDay)+4
	while due <= int(s.day)+1:
		var id := "auction-%s-%d" % [str(Model.fnv(String(s.seed))),due]
		if not book.entries.any(func(e): return e.id == id):
			book.entries.append(_create(s,id,due))
		due += 12

static func _contains_uid(value, uid: String) -> bool:
	if value is Dictionary:
		if value.get("uid") == uid: return true
		for child in value.values():
			if (child is Dictionary or child is Array) and _contains_uid(child,uid): return true
	elif value is Array:
		for child in value:
			if (child is Dictionary or child is Array) and _contains_uid(child,uid): return true
	return false

static func _create(s: Dictionary, id: String, due: int) -> Dictionary:
	GameData.ensure()
	var draw := Model.fnv(String(s.seed)+id+"/auction-v1")
	var uid := id+"-original"
	var suffix := 0
	while _contains_uid(s,uid):
		suffix += 1
		uid = id+"-original-reserved-%d" % suffix
	var scratch := {"seed":s.seed,"nextId":1}
	var def_id := WatchSupply.pick(String(s.seed),id)
	var original := Model.new_item(scratch,def_id,{"uid":uid,"owner":"npc","condition":0.45+float(draw%35)/100.0,"working":draw%3!=0,"authentic":WatchSupply.authentic(String(s.seed),id),"sourceVerified":true,"source":"旧货拍卖会登记原物，按现状交割。"})
	return {"id":id,"dueDay":due,"status":"expired" if int(s.day)>due else ("available" if int(s.day)==due else "preview"),"original":original,"observations":[],"budget":0,"deposit":0,"round":0,"rounds":[],"price":50+int(draw%40),"step":10+int((draw>>8)%11),"npcId":"CHR-010"}

static func _entry(s: Dictionary, id) -> Dictionary:
	if not id is String: return {}
	for e in s.auctionNights.entries:
		if e.id == id: return e
	return {}

static func _business_problem(s: Dictionary) -> String:
	if s.get("phase","") != "open": return "营业结束后不能参加拍卖、检验、出价或交割；仍可取消并退押金。"
	if s.get("trade") != null: return "请先完成或取消柜台交易，再办理拍卖。"
	return ""

static func _day_problem(s: Dictionary, e: Dictionary, preview := false) -> String:
	var day := int(s.day)
	if day > int(e.dueDay): return "本场拍卖已过期；可取消并退回押金。"
	if day < int(e.dueDay)-(1 if preview else 0): return "拍卖将在第%d日开放。" % int(e.dueDay)
	return ""

static func _inspect_problem(s: Dictionary,e: Dictionary, tool: String) -> String:
	var p := _business_problem(s)
	if p != "": return p
	p = _day_problem(s,e,true)
	if p != "": return p
	if e.status not in ["preview","available"]: return "检验仅在入场竞价前开放。"
	if tool not in TOOLS: return "请选择放大镜、紫外灯或电子秤检验。"
	if e.observations.any(func(o): return o.tool == tool): return "该工具已有记录，重看不再消耗 AP。"
	if e.observations.size() >= 2: return "每场只可选择两种不同工具检验，已有记录可随时重看。"
	if not Model.has_ap(s,1): return "本次检验需要1 AP。"
	return ""

static func _join_problem(s: Dictionary,e: Dictionary) -> String:
	var p := _business_problem(s)
	if p != "": return p
	p = _day_problem(s,e)
	if p != "": return p
	if e.status != "available": return "本场已经入场或结束，不能再次交押金。"
	if float(s.cash) < DEPOSIT: return "入场需要20 Cr 可退押金，现金不足。"
	return ""

static func _bid_problem(s: Dictionary,e: Dictionary) -> String:
	var p := _business_problem(s)
	if p != "": return p
	p = _day_problem(s,e)
	if p != "": return p
	if e.status != "bidding": return "请先设定预算并入场，只有竞价中可以出价。"
	if int(e.price)>int(e.budget): return "下一口价超过已保存的预算上限；可以放弃并退押金。"
	if float(s.cash)+float(e.deposit)<float(e.price): return "现有现金加押金不足以兑现下一口价；可以放弃并退押金。"
	return ""

static func _settle_problem(s: Dictionary,e: Dictionary) -> String:
	var p := _business_problem(s)
	if p != "": return p
	p = _day_problem(s,e)
	if p != "": return p
	if e.status != "won": return "只有三轮竞价胜出后才能交割，不能重复购入。"
	if float(s.cash)+float(e.deposit)<float(e.price): return "现金加可退押金不足以支付完整成交价；原物与押金保留，可取消。"
	for key in s:
		if key != "auctionNights" and _contains_uid(s[key],String(e.original.uid)): return "原物编号与现有持货冲突，未交割；可取消并退押金。"
	return ""

static func _action(label: String,type: String,e: Dictionary,problem := "",extra := {}) -> Dictionary:
	var a := {"type":type,"id":e.id}
	a.merge(extra,true)
	return {"label":label,"action":a,"problem":problem}

static func view(s: Dictionary) -> Array:
	# Rendering never changes the live save, including deferred expiry refunds.
	var copy := s.duplicate(true)
	ensure(copy)
	var result := []
	for e in copy.auctionNights.entries:
		var original: Dictionary = e.original
		var clues: Array[String] = []
		clues.append("外观成色约%d%%；%s。按现状出售，检验记录不构成真伪保证。" % [int(round(float(original.condition)*100)),"短时试走可见运行" if original.working else "短时试走未见运行"])
		for o in e.observations: clues.append(String(o.reading))
		var texts := {"preview":"预告：第%d日开拍，可提前选择两种工具检验。" % int(e.dueDay),"available":"今日开放：设预算后交20 Cr 可退押金入场。","bidding":"竞价中：下一口价%d Cr；预算上限%d Cr。" % [int(e.price),int(e.budget)],"won":"三轮竞价胜出，等待交割；仍可取消退押金。","settled":"已付全额成交价，原物已进入后仓。","passed":"已退出竞价，押金已退回。","expired":"本场已过期，未交割；已交押金已退回。","declined":"已谢绝本场拍卖，下次在12日后开放。"}
		var row := {"id":String(e.id),"type":"auction","title":"旧货拍卖夜 · %s" % GameData.def(WatchForgery.appearance_id(original)).name,"status":String(e.status),"statusText":String(texts.get(e.status,"")),"availableDay":int(e.dueDay),"dueDay":int(e.dueDay),"uid":String(original.uid),"description":"登记旧表原物公开拍卖；押金20 Cr，成交时退押金并单独支付完整成交价。两种检验各1 AP，竞价和交割不耗 AP。","clues":clues,"actions":[],"navigation":[],"price":int(e.price),"budget":int(e.budget),"deposit":int(e.deposit),"round":int(e.round)}
		if e.status in ["preview","available"]:
			for tool in TOOLS:
				row.actions.append(_action("%s检验 · 1 AP" % {"TOL-001":"放大镜","TOL-002":"紫外灯","TOL-005":"电子秤"}[tool],"AUCTION_INSPECT",e,_inspect_problem(copy,e,tool),{"tool":tool}))
			row.actions.append(_action("设预算并入场 · 押金20 Cr","AUCTION_JOIN",e,_join_problem(copy,e)))
			row.actions.append(_action("谢绝本场拍卖","AUCTION_DECLINE",e,_business_problem(copy)))
			row.input = {"kind":"budget","label":"预算上限 Cr","min":1,"max":maxi(1,int(copy.cash)),"value":mini(maxi(1,int(e.price)*3),maxi(1,int(copy.cash))),"action":{"type":"AUCTION_JOIN","id":String(e.id)}}
		elif e.status == "bidding":
			row.actions.append(_action("出价 %d Cr" % int(e.price),"AUCTION_BID",e,_bid_problem(copy,e)))
			row.actions.append(_action("放弃竞价并退押金","AUCTION_PASS",e))
		elif e.status == "won":
			row.actions.append(_action("按成交价交割","AUCTION_SETTLE",e,_settle_problem(copy,e)))
			row.actions.append(_action("取消并退押金","AUCTION_CANCEL",e))
		elif e.status == "settled": row.navigation.append({"label":"查看入库原物","page":"warehouse","uid":String(original.uid)})
		result.append(row)
	return result

static func _refund(s: Dictionary,e: Dictionary) -> void:
	if int(e.deposit) <= 0: return
	Model.ledger(s,String(e.id)+"-deposit-return","auction-deposit-return","拍卖押金退还",float(e.deposit))
	e.deposit=0

static func reduce(previous: Dictionary,a: Dictionary):
	var type = a.get("type","")
	if type not in ACTIONS: return null
	var s := previous.duplicate(true)
	ensure(s)
	var e := _entry(s,a.get("id"))
	if e.is_empty(): return Model.notice(s,"拍卖记录不存在或已变化，请重新查看事件簿。")
	if type in ["AUCTION_CANCEL","AUCTION_PASS"]:
		if e.status not in ["bidding","won"]: return Model.notice(s,"本场没有待退押金或未交割竞价，未重复退款。")
		_refund(s,e)
		e.status = "expired" if int(s.day)>int(e.dueDay) else "passed"
		return Model.notice(s,"已退出本场拍卖，20 Cr 押金已退回；不消耗 AP。")
	if type == "AUCTION_DECLINE":
		var p := _business_problem(s)
		if p != "": return Model.notice(s,p)
		if e.status not in ["preview","available"]: return Model.notice(s,"只有尚未入场的拍卖可以谢绝。")
		e.status="declined"
		return Model.notice(s,"已谢绝本场拍卖，下次拍卖在12日后。")
	if type == "AUCTION_INSPECT":
		var tool = a.get("tool","")
		if not tool is String: return Model.notice(s,"请选择有效检验工具。")
		var p := _inspect_problem(s,e,tool)
		if p != "": return Model.notice(s,p)
		Model.record_inspection(e.original,tool)
		e.original.evidence.append(tool)
		e.observations.append({"tool":tool,"reading":WatchRules.reading(e.original,tool)})
		Model.spend(s,1)
		return Model.notice(s,"已保存本件拍卖原物的检验记录（1 AP）。")
	if type == "AUCTION_JOIN":
		var p := _join_problem(s,e)
		if p != "": return Model.notice(s,p)
		var budget = a.get("price")
		if typeof(budget) not in [TYPE_INT,TYPE_FLOAT] or not is_finite(float(budget)) or float(budget)!=floor(float(budget)) or float(budget)<=0 or float(budget)>float(s.cash):
			return Model.notice(s,"预算必须是正整数，且不能超过当前可用现金。")
		if not Model.ledger(s,String(e.id)+"-deposit","auction-deposit","拍卖入场押金",-DEPOSIT): return Model.notice(s,"本场押金已有记录，未重复收取。")
		e.deposit=DEPOSIT; e.budget=int(budget); e.status="bidding"; e.round=0
		# All rival responses and prices are fixed at admission and survive reload.
		var opening := int(e.price)
		var step := int(e.step)
		e.rounds=[{"price":opening,"rivalPrice":opening+step},{"price":opening+step*2,"rivalPrice":opening+step*3},{"price":opening+step*4,"rivalPrice":0}]
		return Model.notice(s,"已保存预算与三轮竞价，收取可退押金20 Cr。")
	if type == "AUCTION_BID":
		var p := _bid_problem(s,e)
		if p != "": return Model.notice(s,p)
		var decision: Dictionary = e.rounds[int(e.round)]
		e.round=int(e.round)+1
		if int(e.round)==3:
			e.status="won"
			return Model.notice(s,"三轮竞价结束，已胜出；请交割或取消退押金。")
		e.price=int(e.rounds[int(e.round)].price)
		return Model.notice(s,"本轮出价%d Cr；对手出价%d Cr。下一口价%d Cr。" % [int(decision.price),int(decision.rivalPrice),int(e.price)])
	var problem := _settle_problem(s,e)
	if problem != "": return Model.notice(s,problem)
	var original: Dictionary = e.original.duplicate(true)
	original.owner="shop"; original.cost=int(e.price)
	if not Model.put_in(s,original): return Model.notice(previous.duplicate(true),"后仓空间不足，原物、押金与现金均未变动；可整理后重试或取消。")
	_refund(s,e)
	if not Model.ledger(s,String(e.id)+"-purchase","purchase","拍卖原物全额购入",-float(e.price),float(e.price)):
		return Model.notice(previous.duplicate(true),"已有本场交割记录，未重复购入或退款。")
	s.ledger.back().uid=original.uid
	s.ledger.back().npcId=e.npcId
	s.ledger.back().defId=original.defId
	e.status="settled"
	return Model.notice(s,"拍卖交割完成：押金已单独退回，完整成交价%d Cr 已支付，原物进入后仓。" % int(e.price))

static func observe(previous: Dictionary,next: Dictionary,_a: Dictionary) -> void:
	if int(previous.get("day",1))==int(next.get("day",1)): return
	ensure(next)
	for e in next.auctionNights.entries:
		if e.status in TERMINAL: continue
		if int(next.day)>int(e.dueDay):
			_refund(next,e)
			e.status="expired"
		elif int(next.day)==int(e.dueDay) and e.status=="preview": e.status="available"
