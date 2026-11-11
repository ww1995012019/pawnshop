class_name ShopStories
extends RefCounted
## Independent cross-day cases share an entry point, not the daily event slot.
const MODULES := ["res://scripts/model/ownership_claims.gd","res://scripts/model/warranty_cases.gd","res://scripts/model/auction_nights.gd"]
const TERMINAL := ["resolved","completed","complete","settled","passed","declined","refunded","returned","cancelled","rejected","expired"]
static func ensure(s: Dictionary) -> void:
	for path in MODULES:
		if ResourceLoader.exists(path): load(path).ensure(s)
static func view(s: Dictionary) -> Array:
	var events := []
	for path in MODULES:
		if ResourceLoader.exists(path): events.append_array(load(path).view(s))
	events.sort_custom(func(a,b): return int(a.get("availableDay",0))>int(b.get("availableDay",0)))
	return events
static func group(s: Dictionary, event: Dictionary) -> String:
	if String(event.get("status","")) in TERMINAL:
		var uid: String=event.get("uid","")
		if uid!="" and Model.find_inventory(s,uid)!=null and event.get("type","")!="auction": return "active"
		return "archive"
	if int(event.get("availableDay",0))>int(s.day): return "upcoming"
	return "active"
static func pending(s: Dictionary) -> int:
	var count := 0
	for event in view(s):
		if group(s,event)=="active": count+=1
	return count
static func reduce(previous: Dictionary, action: Dictionary) -> Variant:
	for path in MODULES:
		if not ResourceLoader.exists(path): continue
		var result=load(path).reduce(previous,action)
		if result!=null: return result
	return null
static func observe(previous: Dictionary, next: Dictionary, action: Dictionary) -> void:
	for path in MODULES:
		if ResourceLoader.exists(path): load(path).observe(previous,next,action)
static func work_problem(s: Dictionary,it: Dictionary) -> String:
	for path in MODULES.slice(0,2):
		if not ResourceLoader.exists(path): continue
		var problem: String=load(path).work_problem(s,it)
		if problem!="": return problem
	return ""
static func resolution_text(event: Dictionary) -> String:
	return String({"free":"免费返修","paid":"付费返修","refund":"退款并归还原物","return":"原物归还，问题未解决"}.get(String(event.get("resolution","")),""))
static func _outcome(s: Dictionary,event: Dictionary) -> String:
	var held:=Model.find_inventory(s,String(event.get("uid","")))!=null
	return JSON.stringify([event.get("status",""),event.get("statusText",""),event.get("resolution",""),held])
static func observe_journal(previous: Dictionary,next: Dictionary,_action: Dictionary) -> void:
	var changed:=false
	for key in ["ownershipClaims","warrantyCases","auctionNights"]:
		if previous.get(key,{})!=next.get(key,{}):changed=true;break
	if not changed:return
	var journal=load("res://scripts/model/shop_journal.gd")
	var before := {}
	for event in view(previous): before[String(event.id)]=_outcome(previous,event)
	for event in view(next):
		if before.get(String(event.id),"")==_outcome(next,event): continue
		var uid: String=event.get("uid","")
		var key: String="story/%s/%s/%s" % [event.id,event.status,str(hash(_outcome(next,event)))]
		var text: String=String(event.get("title","事件"))+" · "+String(event.get("statusText","记录已更新"))
		if resolution_text(event)!="":text+=" · "+resolution_text(event)
		journal._event(next.shopJournal,uid,key,int(next.day),text)
		if event.get("type","")=="warranty" and group(next,event)=="archive" and event.get("npcId","")!="" and not next.shopJournal.markers.has(key):
			next.shopJournal.markers[key]=true
			journal._note(next.shopJournal,String(event.npcId),int(next.day),text,int(event.get("trustDelta",0)))
