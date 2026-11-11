extends SceneTree
var failures := 0
var auction
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("AUCTION ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func base() -> Dictionary:
	var s := Model.create("AUCTION-TEST")
	s.cash = 10000
	s.trade = null
	auction.ensure(s)
	return s
func ready() -> Dictionary:
	var s := base()
	var before := s.duplicate(true)
	s.day = 5
	auction.observe(before,s,{"type":"NEXT_DAY"})
	return s
func event(s: Dictionary) -> Dictionary: return auction.view(s)[0]
func act(s: Dictionary, type: String, extra := {}) -> Dictionary:
	var a := {"type":type,"id":event(s).id}
	a.merge(extra,true)
	return auction.reduce(s,a)
func won(s: Dictionary) -> Dictionary:
	s = act(s,"AUCTION_JOIN",{"price":1000})
	for i in 3: s = act(s,"AUCTION_BID")
	return s
func money(s: Dictionary, kind: String) -> Array:
	return s.ledger.filter(func(row): return row.kind == kind)
func unchanged(a: Dictionary,b: Dictionary) -> bool:
	return a.cash == b.cash and a.ap == b.ap and a.inventory == b.inventory and a.nextId == b.nextId
func run() -> void:
	var audio = root.get_node_or_null("Audio")
	if audio != null:
		for child in audio.get_children():
			if child is AudioStreamPlayer: child.stop()
	check(ResourceLoader.exists("res://scripts/model/auction_nights.gd"),"auction module exists")
	if failures: quit(1); return
	auction = load("res://scripts/model/auction_nights.gd")
	var s := base()
	check(auction.view(s).is_empty(),"no physical lot before the preview")
	var before := s.duplicate(true); s.day=4
	auction.observe(before,s,{"type":"NEXT_DAY"})
	check(event(s).status == "preview" and event(s).availableDay == 5,"first auction has one saved preview day")
	var identity: Dictionary = s.auctionNights.entries[0].original.duplicate(true)
	var snapshot := JSON.stringify(s)
	var public := event(s)
	public.clues.append("injected")
	check(JSON.stringify(s) == snapshot and s.nextId == before.nextId,"view is detached and reserves no live IDs")
	check(JSON.stringify(auction.view(s)) == JSON.stringify(auction.view(JSON.parse_string(snapshot))),"public view is JSON replay stable")
	var secrets := JSON.stringify(event(s))
	check(not secrets.contains("authentic") and not secrets.contains("missing_part") and not secrets.contains("fault") and not secrets.contains("appraisalValue") and not secrets.contains("trueValue"),"public event exposes no hidden physical truth")
	var old := s.duplicate(true); s.day=5; auction.observe(old,s,{"type":"NEXT_DAY"})
	check(event(s).status == "available" and s.auctionNights.entries[0].original == identity,"available auction retains preview original")
	var inspected := act(s,"AUCTION_INSPECT",{"tool":"TOL-001"})
	var twice := act(inspected,"AUCTION_INSPECT",{"tool":"TOL-005"})
	check(twice.ap == s.ap-2 and event(twice).clues.size() == event(s).clues.size()+2,"two distinct real readings each cost one AP")
	check(event(twice).clues.has(WatchRules.reading(identity.duplicate(true),"TOL-005")),"known observation comes from the actual original")
	check(unchanged(twice,act(twice,"AUCTION_INSPECT",{"tool":"TOL-002"})) and unchanged(twice,act(twice,"AUCTION_INSPECT",{"tool":"TOL-001"})),"third and repeated inspection cannot charge AP")
	for price in [0,-1,0.5,"100",true,10001]:
		check(unchanged(s,act(s,"AUCTION_JOIN",{"price":price})),"invalid or unavailable budget rejected: %s" % str(price))
	var joined := act(twice,"AUCTION_JOIN",{"price":1000})
	check(joined.cash == twice.cash-20 and money(joined,"auction-deposit").size()==1 and event(joined).round==0,"join saves rounds and posts one refundable deposit")
	check(unchanged(joined,act(joined,"AUCTION_JOIN",{"price":1000})),"duplicate join does not charge")
	var replay: Dictionary = JSON.parse_string(JSON.stringify(joined))
	for i in 3:
		joined=act(joined,"AUCTION_BID"); replay=act(replay,"AUCTION_BID")
		check(JSON.stringify(event(joined))==JSON.stringify(event(replay)),"saved bidding round %d survives reload" % i)
	check(event(joined).status=="won" and event(joined).round==3,"three explicit bids complete the saved auction")
	var cap := act(s,"AUCTION_JOIN",{"price":event(s).price})
	cap=act(cap,"AUCTION_BID")
	check(unchanged(cap,act(cap,"AUCTION_BID")) and event(cap).round==1,"next bid cannot exceed saved budget")
	var cash := joined.duplicate(true); cash.cash=0
	check(unchanged(cash,act(cash,"AUCTION_SETTLE")) and event(act(cash,"AUCTION_SETTLE")).status=="won","insufficient effective cash leaves original and deposit intact")
	var full := joined.duplicate(true); full.inventory.clear()
	for y in 6:
		for x in 10:
			var blocker := Model.new_item(full,"WCH-002")
			blocker.x=x; blocker.y=y; full.inventory.append(blocker)
	check(unchanged(full,act(full,"AUCTION_SETTLE")) and event(act(full,"AUCTION_SETTLE")).status=="won","full warehouse rollback preserves auction original, cash and deposit")
	var paid := act(joined,"AUCTION_SETTLE")
	var acquired = Model.find_inventory(paid,identity.uid)
	check(acquired != null and acquired.watch==identity.watch and acquired.service==identity.service and acquired.authentic==identity.authentic and acquired.owner=="shop","settlement places the exact known physical original")
	check(paid.cash==twice.cash-event(joined).price and acquired.cost==event(joined).price,"winning price is the full acquisition cost after deposit refund")
	check(money(paid,"auction-deposit-return").size()==1 and money(paid,"purchase").size()==1 and money(paid,"purchase")[0].uid==identity.uid,"separate refund and full purchase preserve UID ledger")
	check(unchanged(paid,act(paid,"AUCTION_SETTLE")),"settlement is exactly once")
	var cancelled := act(joined,"AUCTION_CANCEL")
	check(cancelled.cash==twice.cash and money(cancelled,"auction-deposit-return").size()==1 and unchanged(cancelled,act(cancelled,"AUCTION_CANCEL")),"cancel refunds once after active bids")
	var expired := joined.duplicate(true); expired.day=6; expired.phase="report"
	var expired_snapshot := JSON.stringify(expired)
	auction.view(expired)
	check(JSON.stringify(expired)==expired_snapshot,"opening expired event has no financial or state effect")
	auction.observe(joined,expired,{"type":"NEXT_DAY"})
	auction.observe(joined,expired,{"type":"NEXT_DAY"})
	check(expired.cash==twice.cash and event(expired).status=="expired" and money(expired,"auction-deposit-return").size()==1,"next day expiry refunds once even in report phase")
	var report := joined.duplicate(true); report.phase="report"
	check(act(report,"AUCTION_CANCEL").cash==twice.cash,"explicit cancellation remains possible in report")
	for changed in [{"phase":"closed"},{"trade":{"locked":false}}]:
		var denied := s.duplicate(true); denied.merge(changed,true)
		check(unchanged(denied,act(denied,"AUCTION_JOIN",{"price":1000})) and unchanged(denied,act(denied,"AUCTION_INSPECT",{"tool":"TOL-001"})),"closed or trading auction guards")
	var declined := act(s,"AUCTION_DECLINE")
	check(event(declined).status=="declined" and unchanged(s,declined),"prejoin refusal has no charge")
	var passed := act(act(s,"AUCTION_JOIN",{"price":1000}),"AUCTION_PASS")
	check(event(passed).status=="passed" and passed.cash==s.cash,"passing exits with deposit returned")
	var legacy := Model.create("LEGACY")
	check(auction.reduce(legacy,{"type":"UNKNOWN"})==null and not legacy.has("auctionNights"),"unhandled actions preserve legacy fixtures")
	var cash_bid := act(s,"AUCTION_JOIN",{"price":1000}); cash_bid.cash=0
	check(unchanged(cash_bid,act(cash_bid,"AUCTION_BID")),"spending available cash blocks an unfunded bid")
	check(act(full,"AUCTION_CANCEL").cash==twice.cash,"full warehouse still permits complete deposit cancellation")
	for phase in ["report","closed","ending"]:
		var guarded := joined.duplicate(true); guarded.phase=phase
		check(unchanged(guarded,act(guarded,"AUCTION_SETTLE")),"settlement blocked in %s" % phase)
	var original_id := String(identity.uid)
	var collision := joined.duplicate(true)
	collision.inventory[0].uid=original_id
	check(unchanged(collision,act(collision,"AUCTION_SETTLE")),"conflicting live physical UID prevents settlement")
	var later := s.duplicate(true); later.day=16
	auction.observe(s,later,{"type":"NEXT_DAY"})
	check(auction.view(later).size()==2 and auction.view(later)[1].availableDay==17 and auction.view(later)[1].status=="preview","next physical lot previews exactly twelve days later")
	var installed := Model.create("OLD-SAVE"); installed.day=21
	auction.ensure(installed)
	check(installed.auctionNights.startDay==21 and auction.view(installed).is_empty(),"existing saves begin auction schedule on install day")
	print("AUCTION failures=",failures)
	quit(1 if failures else 0)
