extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, text: String) -> void:
	print("SHOP INTEGRATION ","PASS " if ok else "FAIL ",text)
	if not ok: failures+=1
func run() -> void:
	var game = root.get_node("Game")
	game.new_game("SHOP-INTEGRATION")
	game.prefs.sound=false
	check(game.state.has("shopJournal") and game.state.has("campaignLife") and game.state.has("weeklyMarket"),"new game initializes additive expansion state")
	var jobs = load("res://scripts/model/service_contracts.gd")
	var crate = load("res://scripts/model/bulk_crates.gd")
	game.state.cash=10000
	game.state.ap=100
	var contract: Dictionary=jobs.contracts(game.state)[0]
	game.dispatch({"type":"TAKE_SERVICE_CONTRACT","id":contract.id})
	var job: Dictionary=jobs.contracts(game.state)[0]
	check(job.uid!="" and game.item(job.uid)!=null,"facade routes contract acceptance")
	if job.uid!="":
		game.dispatch({"type":"SERVICE_BEGIN","uid":job.uid})
		check(not game.item(job.uid).service.active,"facade guards physical work before approval")
		game.dispatch({"type":"CHECK","uid":job.uid,"tool":"TOL-001"})
		game.dispatch({"type":"QUOTE_SERVICE_CONTRACT","id":job.id,"price":80})
		check(jobs.contracts(game.state)[0].status=="approved","observation after inspection enables approved repair")
		game.dispatch({"type":"RETURN_ITEM","uid":job.uid})
		check(game.item(job.uid)==null,"legacy return routes safely for contract original")
	var second: Dictionary=jobs.contracts(game.state)[1]
	for material in game.state.materials: game.state.materials[material]=50
	game.dispatch({"type":"TAKE_SERVICE_CONTRACT","id":second.id})
	second=jobs.contracts(game.state)[1]
	var service_uid: String=second.uid
	game.dispatch({"type":"CHECK","uid":service_uid,"tool":"TOL-001"})
	game.dispatch({"type":"QUOTE_SERVICE_CONTRACT","id":second.id,"price":80})
	game.dispatch({"type":"SERVICE_BEGIN","uid":service_uid})
	for step in 8:
		var task: String=WatchService.current(game.item(service_uid))
		if task=="": break
		game.dispatch({"type":"SERVICE_PROGRESS","uid":service_uid,"task":task,"progress":{"complete":true,"opened":false}})
		game.dispatch({"type":"SERVICE_COMPLETE","uid":service_uid,"task":task})
	game.dispatch({"type":"SERVICE_FINISH","uid":service_uid})
	var fee_before: float=game.state.cash
	game.dispatch({"type":"DELIVER_SERVICE_CONTRACT","id":second.id})
	var service_receipt: Dictionary=load("res://scripts/model/shop_journal.gd").latest_receipt(game.state)
	check(game.item(service_uid)==null and game.state.cash==fee_before+80,"approved original completes real repair and actual paid delivery through facade")
	check(not service_receipt.is_empty() and service_receipt.entries[0].acquisitionCost==0 and not service_receipt.historical,"customer service receipt has no fabricated acquisition and is observed live")
	game.state.trade={"id":"bulk-visit","npcId":"CHR-010","kind":"merchant","item":null,"locked":false,"stock":{},"rare":null}
	var price: int=crate.offer(game.state).price
	var before: float=game.state.cash
	game.dispatch({"type":"BUY_BULK_CRATE","id":crate.offer(game.state).id})
	var journal = load("res://scripts/model/shop_journal.gd")
	var receipt: Dictionary=journal.latest_receipt(game.state)
	check(game.state.cash==before-price and not receipt.is_empty(),"new purchase is observed before historical migration and has receipt")
	if not receipt.is_empty(): check(not receipt.historical and receipt.entries.size()==4 and receipt.cashImpact==-price,"whole-box receipt preserves four original costs and actual outflow")
	game.state.trade=null
	game.state.day=21
	game.state.phase="report"
	game.state.report={"day":21,"cash":game.state.cash}
	game.state.outcome="可信赖维修店"
	var original_cash: float=game.state.cash
	game.dispatch({"type":"CONTINUE_CAMPAIGN"})
	check(game.state.day==22 and game.state.phase=="open" and game.state.cash==original_cash,"facade continuation keeps settled cash and opens day22")
	var saved: Dictionary=JSON.parse_string(FileAccess.get_file_as_string(game.SAVE_PATH))
	check(saved.campaignLife.endless and saved.shopJournal.receipts.size()>0,"expanded state and receipts persist together")
	var refer_previous: Dictionary=game.state.duplicate(true)
	refer_previous.trade=null
	refer_previous.shopJournal.customers["CHR-002"]={"deals":2,"trust":2,"referrals":0}
	for candidate in 200:
		refer_previous.seed="REFERRAL-%d" % candidate
		if Model.fnv("%s/%d/%d/referral-v1" % [refer_previous.seed,int(refer_previous.day),int(refer_previous.cursor)])%12==0: break
	var refer_next: Dictionary=refer_previous.duplicate(true)
	refer_next.trade={"id":"actual-referral","npcId":"CHR-004","kind":"sell","item":null,"line":"你好"}
	game._attach_referral(refer_previous,refer_next,{"type":"ARRIVE"})
	journal.observe(refer_previous,refer_next,{"type":"ARRIVE"})
	check(refer_next.trade.get("referrerId","")=="CHR-002" and journal.customer(refer_next,"CHR-002").referrals==1,"trusted customer introduces an actual new visit and records one referral")
	print("SHOP INTEGRATION failures=",failures)
	quit(1 if failures else 0)
