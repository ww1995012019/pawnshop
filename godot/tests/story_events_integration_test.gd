extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool,text: String) -> void:
	print("STORIES ","PASS " if ok else "FAIL ",text)
	if not ok: failures+=1
func run() -> void:
	var game=root.get_node("Game")
	game.new_game("STORY-INTEGRATION")
	game.prefs.sound=false
	check(game.state.has("ownershipClaims") and game.state.has("auctionNights") and game.state.has("warrantyCases"),"new and migrated state bootstrap story namespaces")
	if failures: quit(1);return
	var stories=load("res://scripts/model/shop_stories.gd")
	check(stories!=null,"shared event book exists")
	if stories==null: quit(1);return
	var before: Dictionary=game.state.duplicate(true)
	stories.view(game.state)
	check(game.state.cash==before.cash and game.state.ap==before.ap and game.state.inventory==before.inventory and game.state.nextId==before.nextId,"view cannot spend or allocate live originals")
	game.state.day=3
	game.save()
	var claim: Dictionary={}
	for row in stories.view(game.state):
		if row.type=="claim" and row.status=="available": claim=row;break
	check(not claim.is_empty(),"first ownership story opens on day3")
	if not claim.is_empty():
		game.dispatch({"type":"ACCEPT_OWNERSHIP_CLAIM","id":claim.id})
		for row in stories.view(game.state):
			if row.id==claim.id: claim=row
		var uid: String=claim.get("uid","")
		check(uid!="" and game.item(uid)!=null and game.item(uid).owner=="customer","facade accepts an entrusted found original")
		if uid!="":
			game.dispatch({"type":"RETURN_ITEM","uid":uid})
			check(game.item(uid)==null,"ordinary return safely hands custody to station")
	game.state.day=5
	game.state.cash=10000
	game.save()
	var auction: Dictionary={}
	for row in stories.view(game.state):
		if row.type=="auction" and row.status=="available": auction=row;break
	check(not auction.is_empty(),"saved auction opens on day5")
	if not auction.is_empty():
		var cash: float=game.state.cash
		game.dispatch({"type":"AUCTION_JOIN","id":auction.id,"price":1000})
		check(game.state.cash==cash-20,"join routes actual refundable deposit")
		game.dispatch({"type":"AUCTION_PASS","id":auction.id})
		check(game.state.cash==cash,"pass refunds exactly once")
		game.dispatch({"type":"AUCTION_PASS","id":auction.id})
		check(game.state.cash==cash,"repeated pass cannot mint money")
	game.state.day=17
	game.save()
	for event in stories.view(game.state):
		if event.type!="auction" or event.status!="available":continue
		game.dispatch({"type":"AUCTION_JOIN","id":event.id,"price":1000})
		for round_index in 3:game.dispatch({"type":"AUCTION_BID","id":event.id})
		game.dispatch({"type":"AUCTION_SETTLE","id":event.id})
		var row:Dictionary=game.state.ledger.back()
		check(row.kind=="purchase" and GameData.npc(String(row.get("npcId",""))).get("id","")==row.get("npcId",""),"auction seller is a real known NPC and cannot poison returning-customer memory")
	game.new_game("WARRANTY-FACADE")
	game.state.cash=10000
	game.state.ap=100
	for material in game.state.materials:game.state.materials[material]=50
	var jobs=load("res://scripts/model/service_contracts.gd")
	var job: Dictionary=jobs.contracts(game.state)[0]
	game.dispatch({"type":"TAKE_SERVICE_CONTRACT","id":job.id})
	job=jobs.contracts(game.state)[0]
	var original_uid:String=job.uid
	var serial:String=game.item(original_uid).watch.serial
	game.dispatch({"type":"CHECK","uid":original_uid,"tool":"TOL-001"})
	game.dispatch({"type":"QUOTE_SERVICE_CONTRACT","id":job.id,"price":80})
	game.dispatch({"type":"SERVICE_BEGIN","uid":original_uid})
	for step in 8:
		var task:String=WatchService.current(game.item(original_uid))
		if task=="":break
		game.dispatch({"type":"SERVICE_PROGRESS","uid":original_uid,"task":task,"progress":{"complete":true,"opened":false}})
		game.dispatch({"type":"SERVICE_COMPLETE","uid":original_uid,"task":task})
	game.dispatch({"type":"SERVICE_FINISH","uid":original_uid})
	game.dispatch({"type":"DELIVER_SERVICE_CONTRACT","id":job.id})
	check(game.item(original_uid)==null and game.state.warrantyCases.entries.size()==1,"actual delivery seeds one original-linked future warranty")
	if not game.state.warrantyCases.entries.is_empty():
		var warranty:Dictionary=game.state.warrantyCases.entries[0]
		game.state.day=int(warranty.availableDay)
		game.save()
		game.dispatch({"type":"TAKE_WARRANTY_CASE","id":warranty.id})
		check(game.item(original_uid)!=null and game.item(original_uid).watch.serial==serial,"returned warranty keeps exact original and serial")
		game.dispatch({"type":"CHECK","uid":original_uid,"tool":"TOL-001"})
		var cash:float=game.state.cash
		var before_trust:int=game.state.shopJournal.customers[job.npcId].trust
		game.dispatch({"type":"REFUND_WARRANTY_CASE","id":warranty.id})
		check(game.state.cash==cash-80 and game.item(original_uid)==null,"refund returns safely and debits actual original fee")
		var public_case:Dictionary={}
		for event in stories.view(game.state):
			if event.id==warranty.id:public_case=event
		check(stories.group(game.state,public_case)=="archive","resolved warranty leaves ongoing list")
		check(game.state.shopJournal.customers[job.npcId].trust==clampi(before_trust+int(public_case.get("trustDelta",0)),-6,6),"customer remembers resolution exactly once")
		check(String(game.state.shopJournal.customers[job.npcId].lastNote).contains("退款"),"customer memory identifies the actual refund resolution")
		var stable_cash:float=game.state.cash
		game.dispatch({"type":"REFUND_WARRANTY_CASE","id":warranty.id})
		check(game.state.cash==stable_cash,"repeated refund is financially inert")
	game.new_game("DECLINE-PREVIEW")
	game.state.day=2
	game.save()
	for event in stories.view(game.state):
		if event.type!="claim":continue
		game.dispatch({"type":"DECLINE_OWNERSHIP_CLAIM","id":event.id})
		for updated in stories.view(game.state):
			if updated.id==event.id:check(stories.group(game.state,updated)=="archive","preview refusal immediately archives instead of remaining upcoming")
	game.new_game("EXPIRED-CUSTODY")
	game.state.day=3
	game.save()
	for event in stories.view(game.state):
		if event.type!="claim":continue
		game.dispatch({"type":"ACCEPT_OWNERSHIP_CLAIM","id":event.id})
		var claim_uid:String=game.state.ownershipClaims.entries[0].uid
		game.state.day=8
		game.save()
		game.dispatch({"type":"STATION_OWNERSHIP_CLAIM","id":event.id})
		var history:Array=load("res://scripts/model/shop_journal.gd").timeline(game.state,claim_uid)
		check(game.item(claim_uid)==null and not history.is_empty() and history.back().text.contains("已移交失物站"),"expired custody handoff records the actual returned outcome")
	var disk: Dictionary=JSON.parse_string(FileAccess.get_file_as_string(game.SAVE_PATH))
	check(disk.has("ownershipClaims") and disk.has("auctionNights") and disk.has("warrantyCases"),"all chains persist in the existing save")
	for node in root.get_node("Audio").get_children():
		if node is AudioStreamPlayer: node.stop()
	print("STORIES failures=",failures)
	quit(1 if failures else 0)
