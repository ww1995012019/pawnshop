extends SceneTree
const Commerce = preload("res://scripts/model/commerce.gd")
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("SUPPLY ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func cohort(rows: Array, label: String, need_ultra := true) -> void:
	var ultras := 0
	var premium := 0
	var premium_fake := 0
	var fakes := 0
	for lot in rows:
		var tier: String = GameData.def(lot.defId).tier
		if tier == "ultra": ultras += 1
		if not lot.authentic: fakes += 1
		if tier in ["luxury","ultra"]:
			premium += 1
			if not lot.authentic: premium_fake += 1
	check(not need_ultra or (ultras > 0 and ultras < rows.size()*0.015), label+" reaches ultra stock near 0.5%, not catalogue-uniform")
	check(fakes > rows.size()*0.15 and fakes < rows.size()*0.25, label+" independently generates about 20% counterfeits")
	check(premium > 0 and premium_fake > premium*0.05, label+" luxury/ultra stock can be counterfeit")
	print("SUPPLY cohort ",label," total=",rows.size()," ultra=",ultras," fake=",fakes," premium=",premium," premium_fake=",premium_fake)
func run() -> void:
	GameData.ensure()
	var path := "res://scripts/model/watch_supply.gd"
	check(ResourceLoader.exists(path), "shared supply sampler exists")
	if not ResourceLoader.exists(path): quit(1); return
	var supply = load(path)
	var rows := []
	var ultra_ids := {}
	var ultra_fake := 0
	for i in 100000:
		var key := "item/%d" % i
		var id: String = supply.pick("SUPPLY-DISTRIBUTION",key)
		var genuine: bool = supply.authentic("SUPPLY-DISTRIBUTION",key)
		if GameData.def(id).tier == "ultra":
			ultra_ids[id]=true
			if not genuine: ultra_fake += 1
		rows.append({"defId":id,"authentic":genuine})
	cohort(rows,"shared")
	var ultras := rows.filter(func(lot):return GameData.def(lot.defId).tier=="ultra").size()
	check(ultras > 420 and ultras < 580 and ultra_ids.size()==5,"all five ultras share a combined 0.5% branch")
	check(ultra_fake > ultras*0.10 and ultra_fake < ultras*0.30,"ultra authenticity is independently sampled")
	var restricted := true
	var pool_ultras := 0
	for i in 10000:
		var id: String = supply.pick("POOL","%d" % i,[GameData.def("WCH-001"),GameData.def("WCH-074")])
		restricted = restricted and id in ["WCH-001","WCH-074"]
		if id=="WCH-074": pool_ultras += 1
	check(restricted and pool_ultras > 25 and pool_ultras < 80,"source-constrained pool keeps rarity branch and never escapes candidates")
	check(supply.pick("REPEAT","one")==supply.pick("REPEAT","one") and supply.authentic("REPEAT","one")==supply.authentic("REPEAT","one"),"same physical key is deterministic")
	var base := Model.create("SUPPLY-SOURCES")
	var old_stock: Array = base.inventory.duplicate(true)
	var opening := Model.market_stock(base,2,2)
	check(opening.defId=="WCH-008" and not opening.authentic,"scripted opening keeps its fixed counterfeit")
	rows.clear()
	for i in 10000:
		rows.append(Model.market_stock({"seed":"MARKET-%d" % i,"day":4,"cursor":0}))
	cohort(rows,"ordinary offers")
	rows.clear()
	for i in 6000:
		var s := {"seed":"MERCHANT-%d" % i,"day":4,"nextId":1}
		var t: Dictionary = Commerce._new_merchant(s)
		if t.rare!=null: rows.append({"defId":t.rare.defId,"authentic":t.rare.get("authentic",true)})
	check(rows.size()>2000 and rows.size()<2800,"merchant keeps 40% special-item opportunity")
	cohort(rows,"merchant offers")
	rows.clear()
	var collector_ok := true
	for i in 1500:
		var s: Dictionary = base.duplicate(true)
		s.seed="EXTRAS-%d" % i
		s.trade={"id":"extras","npcId":"CHR-010","kind":"merchant","rare":null,"locked":false}
		TradeSession.ensure(s)
		rows.append_array(s.trade.session.goods)
	cohort(rows,"counter extra goods")
	for i in 100:
		var s: Dictionary = base.duplicate(true)
		s.seed="COLLECTOR-%d" % i
		var collectors := GameData.npcs.filter(func(n):return String(n.get("title","")).contains("收藏"))
		if collectors.is_empty(): collector_ok=false; break
		s.trade={"id":"collector","npcId":collectors[0].id,"kind":"merchant","rare":null,"locked":false}
		TradeSession.ensure(s)
		for lot in s.trade.session.goods: collector_ok=collector_ok and float(GameData.def(lot.defId).value)>=337
	check(collector_ok,"collector's source pool remains constrained")
	check(base.inventory==old_stock,"fresh generation leaves existing opening inventory unchanged")
	legacy_and_persistence(base)
	external_stock(base)
	print("SUPPLY failures=",failures)
	quit(1 if failures else 0)
func legacy_and_persistence(base: Dictionary) -> void:
	for descriptor in [{"defId":"WCH-074","authentic":false,"price":10,"available":true},{"defId":"WCH-003","price":10,"available":true}]:
		var s: Dictionary = base.duplicate(true)
		s.cash=10000
		s.trade={"id":"legacy-merchant","npcId":"CHR-010","kind":"merchant","rare":descriptor.duplicate(true),"stock":{},"locked":false,"item":null}
		var bought: Dictionary = Commerce.reduce(s,{"type":"BUY_RARE_ITEM"})
		check(bought.inventory[-1].authentic==descriptor.get("authentic",true),"direct purchase preserves descriptor authenticity and defaults legacy to genuine")
		TradeSession.ensure(s)
		check(s.trade.session.goods[0].authentic==descriptor.get("authentic",true) and s.trade.session.goods[0].sourceVerified,"session merchant provenance does not imply authenticity")
		var serialized := JSON.stringify(s.trade.session)
		TradeSession.ensure(s)
		check(JSON.stringify(s.trade.session)==serialized,"reopening the same session keeps originals and quotes")
		var original: Dictionary=s.trade.session.goods[0].duplicate(true)
		TradeSession.persist_holdings(s)
		s.trade={"id":"next-visit","npcId":"CHR-010","kind":"buy","item":null,"locked":false}
		# Pick a visit key that actually asks to bring at least one retained lot.
		for i in 20:
			s.trade.id="next-visit-%d" % i
			if Model.fnv(String(s.seed)+String(s.trade.id)+"/goods")%4>0: break
		TradeSession.ensure(s)
		check(s.trade.session.goods.has(original),"repeat NPC visit reuses the saved physical original")
func external_stock(base: Dictionary) -> void:
	var rows := []
	for i in 1500:
		var s: Dictionary=base.duplicate(true)
		s.seed="EXTERNAL-%d" % i; s.day=5; s.cursor=0; s.trade=null
		NightCrime.ensure(s)
		var culprit: String=NightCrime.thieves(s)[0]
		var fence := {"slot":0,"culprit":culprit,"caseId":"EXTERNAL-5","uid":""}
		s.nightCrime.days["5"]={"inspection":false,"inspectionDone":true,"fenceDone":false,"fence":fence}
		var next: Dictionary=NightCrime.reduce(s,{"type":"ARRIVE"})
		rows.append(next.trade.item)
	cohort(rows,"external fence")
