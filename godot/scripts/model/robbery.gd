extends RefCounted
## Independent daily robbery; physical originals continue through NightCrime custody.
static func ensure(s: Dictionary) -> void:
	if not s.get("robbery") is Dictionary: s.robbery={"version":1,"days":{},"entries":[]}

static func assets(s: Dictionary) -> float:
	var total:float=s.cash
	for it in s.inventory:
		if it.get("owner","")=="shop" and GameData.def(it.defId).category=="watch":total+=Model.item_value(it)
	return maxf(0,total)

static func chance_bp(s: Dictionary) -> int:
	var points:=0
	for it in s.inventory:
		if it.get("owner","")!="shop":continue
		var d:=GameData.def(it.defId)
		if d.category!="watch":continue
		if d.tier=="ultra" or d.get("watch",{}).get("brand","")=="星冕":points+=9
		elif d.tier=="luxury":points+=3
	return mini(10000,points)

static func _better(candidate: Array, best: Array, target: float) -> bool:
	var a:=0.0
	var b:=0.0
	for it in candidate:a+=Model.item_value(it)
	for it in best:b+=Model.item_value(it)
	return best.is_empty() or absf(a-target)<absf(b-target) or (is_equal_approx(absf(a-target),absf(b-target)) and candidate.size()<best.size())

static func select_items(s: Dictionary) -> Array:
	var items:Array=[]
	for it in s.inventory:
		if NightCrime.stealable(s,it) and not it.get("stolen",false) and not it.has("eventClaimId") and not it.has("warrantyCaseId"):items.append(it)
	items.sort_custom(func(a,b):
		var av:=Model.item_value(a)
		var bv:=Model.item_value(b)
		return a.uid<b.uid if av==bv else av<bv)
	var target:=assets(s)*.05
	var best:Array=[]
	for it in items:
		if _better([it],best,target):best=[it]
	# Sorted two-pointer sums find the exact nearest pair/triple in O(n²), without enumerating O(n³) combinations.
	for start in range(-1,items.size()-2):
		var lo:=0 if start<0 else start+1
		var hi:=items.size()-1
		while lo<hi:
			var candidate:Array=[items[lo],items[hi]]
			var value:=Model.item_value(items[lo])+Model.item_value(items[hi])
			if start>=0:candidate.push_front(items[start]);value+=Model.item_value(items[start])
			if _better(candidate,best,target):best=candidate
			if value<target:lo+=1
			else:hi-=1
	return best

static func marked(s: Dictionary,it: Dictionary) -> bool:
	var id:String=it.get("crimeCaseId","")
	var c:=NightCrime._case(s,id)
	if c.is_empty() or c.arrested:return false
	var row:=NightCrime._row(c,String(it.get("uid","")))
	if row.is_empty() or row.get("resolved",false):return false
	# Later night theft can transfer custody; the robbery identity belongs to the UID.
	var origin:String=it.get("robberyCaseId",it.get("provenanceCaseId",id))
	var source:=NightCrime._case(s,origin)
	return origin.begins_with("ROBBERY-") and source.get("kind","")=="robbery" and not NightCrime._row(source,String(it.get("uid",""))).is_empty()

static func after_arrest(s: Dictionary,target: String) -> void:
	ensure(s)
	var linked:Array=[]
	var onsite:=false
	for e in s.robbery.entries:
		if e.culprit!=target or e.get("arrestChecked",false):continue
		linked.append(e)
		onsite=onsite or e.get("onsite",false)
	if linked.is_empty():return
	for e in linked:e.arrestChecked=true;e.arrestDay=int(s.day)
	# A culprit may hold several cases; a single arrest gets one draw and one attack.
	if onsite:return
	var primary:Dictionary=linked[0]
	var key:String="%s/%s/retaliation-v1"%[s.seed,primary.id]
	if Model.fnv(key)%100<5:
		primary.revenge={"day":int(s.day)+2+Model.fnv(key+"/day")%6,"percent":5+Model.fnv(key+"/fee")%4,"done":false}

static func closure_due(s: Dictionary) -> bool:
	for e in s.get("robbery",{}).get("entries",[]):
		var revenge:Dictionary=e.get("revenge",{})
		if not revenge.is_empty() and not revenge.get("done",false) and int(revenge.day)<=int(s.day):return true
	return false

static func extend_deadlines(s: Dictionary) -> void:
	if not closure_due(s):return
	for o in s.orders:
		if o.status in ["available","active"]:o.closureExtension=int(o.get("closureExtension",0))+1
	for key in ["serviceContracts","ownershipClaims","warrantyCases"]:
		for c in s.get(key,{}).get("entries",[]):
			var terminal:Array=["complete","cancelled","expired"] if key=="serviceContracts" else ["completed","declined","expired","returned","refunded","resolved","cancelled","rejected"]
			if c.get("status","") in terminal:continue
			if c.has("dueDay"):c.dueDay+=1
			if key=="warrantyCases" and int(c.get("acceptedDay",0))==0:c.availableDay+=1

static func open_day(s: Dictionary) -> void:
	ensure(s)
	var day:=int(s.day)
	var key:=str(day)
	if s.robbery.days.has(key):return
	s.robbery.days[key]={"chanceBp":chance_bp(s),"closed":false}
	var fees:=0
	var attacked:=false
	for e in s.robbery.entries:
		var revenge:Dictionary=e.get("revenge",{})
		if revenge.is_empty() or revenge.get("done",false) or int(revenge.day)>day:continue
		revenge.done=true;revenge.actualDay=day;revenge.assets=assets(s)
		revenge.fee=ceili(float(revenge.assets)*int(revenge.percent)/100.0)
		Model.ledger(s,"robbery-repair-"+e.id,"repair-expense","打砸报复物品维修费 · "+e.id,-revenge.fee)
		fees+=int(revenge.fee);attacked=true
	if attacked:
		s.robbery.days[key].closed=true
		var costs:=StoreCosts.quote(s)
		var rent:=Landlord.outstanding(s)
		for kind in ["electricity","cleaning","maintenance"]:
			if costs[kind]>0:Model.ledger(s,"closed-%s-%d"%[kind,day],kind,"歇业日固定费用",-costs[kind])
		if rent>0:
			Model.ledger(s,"rent-day-%d"%day,"rent","歇业日到期租金",-rent)
			Landlord.ensure(s);s.rent.days[key].paid=true
		s.ap=0;s.trade=null;s.phase="report"
		s.report={"day":day,"closed":true,"income":0,"expenses":fees,"maintenance":costs.maintenance,"electricity":costs.electricity,"cleaning":costs.cleaning,"costs":costs,"rent":rent,"settlementRent":rent,"cash":s.cash,"upgraded":false,"robberyRepair":fees}
		s.notice="打砸报复！维修费 %d Cr，今日歇业一天。余额可为负，前往账本进入次日；委托期限顺延一天。"%fees
		return
	if day<3 or s.phase!="open":return
	var chance:=chance_bp(s)
	if Model.fnv("%s/%d/robbery-v1"%[s.seed,day])%10000>=chance:return
	var asset_snapshot:=assets(s)
	var items:=select_items(s)
	var culprits:=NightCrime.thieves(s)
	if items.is_empty() or culprits.is_empty():return
	var id:="ROBBERY-%d"%day
	var target:String=culprits[Model.fnv("%s/%s/culprit"%[s.seed,id])%culprits.size()]
	var onsite:bool=int(s.relations.station)>=60 and Model.fnv("%s/%s/onsite"%[s.seed,id])%100<5
	var c:Dictionary={"id":id,"kind":"robbery","origin":"shop","lossDay":day,"culprit":target,"revealed":true,"arrested":false,"items":[]}
	for it in items:
		var snapshot:Dictionary=it.duplicate(true)
		snapshot.stolen=true;snapshot.crimeCaseId=id;snapshot.robberyCaseId=id;snapshot.sourceVerified=false
		c.items.append({"uid":it.uid,"item":snapshot,"holder":"case","paid":false,"payout":0,"handled":false,"resolved":false,"recovery":"","originalLawful":true})
		s.inventory.erase(it)
	s.nightCrime.cases.append(c)
	var entry:Dictionary={"id":id,"day":day,"culprit":target,"onsite":onsite,"arrestChecked":false,"count":items.size(),"assets":asset_snapshot}
	s.robbery.entries.append(entry)
	if onsite:
		load("res://scripts/model/wanted_cases.gd").ensure(s)
		if not s.police.caught.has(target):s.police.caught.append(target)
		NightCrime.arrest(s,target)
		s.notice="抢劫发生，警方及时到场抓捕，%d件原表已追回。本案不会引发报复。"%items.size()
	else:s.notice="店铺遭到抢劫，%d件原表被抢！案件已登记；看到“本店被抢物品”标记可直接报警追回。"%items.size()

static func view(s: Dictionary) -> Array:
	var result:Array=[]
	for e in s.get("robbery",{}).get("entries",[]):
		var c:=NightCrime._case(s,e.id)
		var arrested:bool=c.get("arrested",false)
		var revenge:Dictionary=e.get("revenge",{})
		var text:="警方已抓捕，原物按案件记录追回。" if arrested else "失表%d件；发现本店被抢物品标记，可直接报警，无需购买或编号鉴定。"%int(e.count)
		if e.get("onsite",false):text="警方现场抓捕，原物已追回，本案免于报复。"
		if revenge.get("done",false):text="发生打砸，维修费%d Cr；第%d日歇业一天。"%[int(revenge.fee),int(revenge.actualDay)]
		result.append({"id":e.id,"type":"robbery","title":"抢劫案件 · "+e.id,"status":"resolved" if arrested else "investigating","statusText":text,"availableDay":e.day,"dueDay":e.day,"description":"原表标记绑定唯一编号；旧夜间失窃保险不赔抢劫与报复。","clues":[],"actions":[],"navigation":[]})
	return result
static func reduce(_previous: Dictionary,_action: Dictionary) -> Variant:return null
static func observe(_previous: Dictionary,_next: Dictionary,_action: Dictionary) -> void:pass
