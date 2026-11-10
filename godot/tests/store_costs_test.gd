extends SceneTree
const Commerce = preload("res://scripts/model/commerce.gd")
var failures := 0
var costs
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("STORE COSTS ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func reload_state(s: Dictionary) -> Dictionary: return JSON.parse_string(JSON.stringify(s))
func device(s: Dictionary, kind: String) -> Dictionary:
	for entry in s.storeCosts.devices:
		if entry.type == kind: return entry
	return {}
func daily(s: Dictionary) -> void:
	for index in 2:
		for kind in ["uv","scale","scanner"]: costs.record(s,kind,"daily-%s-%d" % [kind,index],0.5)
	costs.record(s,"repair_tester","mechanical",1.5)
	costs.record(s,"repair_tester","quartz",1.0)
func service_all(s: Dictionary, uid: String) -> Dictionary:
	s = Model.reduce(s,{"type":"SERVICE_BEGIN","uid":uid})
	for index in 8:
		var it: Dictionary = Model.find_inventory(s,uid)
		var task := WatchService.current(it)
		if task == "": break
		s = Model.reduce(s,{"type":"SERVICE_PROGRESS","uid":uid,"task":task,"progress":{"complete":true,"step":3}})
		s = Model.reduce(s,{"type":"SERVICE_COMPLETE","uid":uid,"task":task})
	return s
func run() -> void:
	GameData.ensure()
	var baseline := Model.create("COST-BASELINE")
	var settled := Model.reduce(baseline,{"type":"SETTLE"})
	check(settled.cash == baseline.cash - 16,"new game idle day settles electricity8 plus cleaning8")
	if not ResourceLoader.exists("res://scripts/model/store_costs.gd"):
		check(false,"shared StoreCosts API exists")
		quit(1)
		return
	costs = load("res://scripts/model/store_costs.gd")
	check(costs.quote(baseline).electricity == 8 and costs.quote(baseline).cleaning == 8,"baseline quote8+8")
	var normal := Model.create("COST-DAILY")
	daily(normal)
	check(costs.quote(normal).total == 22 and costs.quote(normal).details.totalCents == 1350,"daily example rounds total electricity once")
	var busy := Model.create("COST-BUSY")
	for index in 6:
		for kind in ["uv","scale"]: costs.record(busy,kind,"%s%d" % [kind,index],0.5)
	for index in 4: costs.record(busy,"scanner","scan%d" % index,0.5)
	for index in 2:
		costs.record(busy,"repair_tester","mech%d" % index,1.5)
		costs.record(busy,"repair_tester","quartz%d" % index,1.0)
	check(costs.quote(busy).total == 29,"busy example electricity21 plus cleaning8")
	var lamp := Model.create("COST-LAMP")
	lamp.upgrades.lamp = true
	daily(lamp)
	check(costs.quote(lamp).total == 23,"installed work lamp adds one daily credit")
	var maintained := Model.create("COST-MAINTENANCE")
	maintained.day = 2
	device(maintained,"quote_terminal").status = "maintenance"
	daily(maintained)
	check(costs.quote(maintained).details.totalCents == 1390,"maintenance multiplier applies to enabled day snapshot")
	device(maintained,"quote_terminal").status = "broken"
	check(costs.quote(maintained).details.totalCents == 1390,"stopping device cannot erase registered standby charge")
	var quantity := Model.create("COST-QUANTITY")
	quantity.storeCosts.devices.append({"id":"repair_tester-2","type":"repair_tester","status":"normal","installed":true,"enabled":true,"installedDay":1})
	daily(quantity)
	check(costs.quote(quantity).total == 23,"each additional physical tester adds standby once")
	costs.ensure(quantity)
	check(costs.quote(quantity).total == 23,"ensure and quote cannot duplicate activation")
	var broken := Model.create("COST-BROKEN")
	broken.day = 2
	device(broken,"uv").status = "repair"
	costs.ensure(broken)
	check(costs.quote(broken).details.dailyCents == 750,"unavailable equipment has no new standby")
	var uid: String = broken.inventory[0].uid
	var before_ap: float = broken.ap
	broken = Model.reduce(broken,{"type":"CHECK","uid":uid,"tool":"TOL-002"})
	check(not Model.find_inventory(broken,uid).evidence.has("TOL-002") and broken.ap == before_ap,"unavailable UV blocks actual CHECK before AP and evidence")
	costs.record(broken,"uv","blocked",0.5)
	check(costs.quote(broken).details.usageCents == 0,"unavailable equipment cannot produce metered work")
	device(broken,"uv").status = "normal"
	check(costs.quote(broken).details.dailyCents == 800,"repaired device first activation uses current normal status")
	device(broken,"uv").status = "maintenance"
	costs.record(broken,"uv","after-repair",0.5)
	check(costs.quote(broken).details.usageCents == 60,"new work uses current state while daily snapshot stays locked")
	var reads := Model.create("COST-READS")
	uid = reads.inventory[0].uid
	reads = Model.reduce(reads,{"type":"CHECK","uid":uid,"tool":"TOL-001"})
	check(costs.quote(reads).details.usageCents == 0,"manual magnifier is free")
	for kind in ["TOL-002","TOL-005"]:
		reads = Model.reduce(reads,{"type":"CHECK","uid":uid,"tool":kind})
		reads = Model.reduce(reads,{"type":"CHECK","uid":uid,"tool":kind})
	reads = Model.reduce(reads,{"type":"SCAN","uid":uid})
	reads = Model.reduce(reload_state(reads),{"type":"SCAN","uid":uid})
	check(costs.quote(reads).details.usageCents == 150,"same day same physical reads and source version deduplicate after reload")
	Model.find_inventory(reads,uid).condition += 0.01
	reads = Model.reduce(reads,{"type":"CHECK","uid":uid,"tool":"TOL-002"})
	check(costs.quote(reads).details.usageCents == 150,"unrelated condition change does not bill unchanged UV reading")
	reads = Model.reduce(reads,{"type":"CHECK","uid":uid,"tool":"TOL-005"})
	reads = Model.reduce(reads,{"type":"SCAN","uid":uid})
	check(costs.quote(reads).details.usageCents == 150,"unrelated refurbishment leaves stable scale and source scan free")
	Model.find_inventory(reads,uid).watch.serial = "COST-SERIAL-REV2"
	reads = Model.reduce(reads,{"type":"CHECK","uid":uid,"tool":"TOL-002"})
	reads = Model.reduce(reads,{"type":"CHECK","uid":uid,"tool":"TOL-005"})
	check(costs.quote(reads).details.usageCents == 200,"actual serial change bills UV while unchanged mass stays free")
	Model.find_inventory(reads,uid).watch.mass += 0.1
	reads = Model.reduce(reads,{"type":"CHECK","uid":uid,"tool":"TOL-005"})
	reads = Model.reduce(reads,{"type":"SCAN","uid":uid})
	check(costs.quote(reads).details.usageCents == 250,"actual mass change bills scale while unchanged source scan stays free")
	Model.find_inventory(reads,uid).source = "updated source receipt"
	reads = Model.reduce(reads,{"type":"SCAN","uid":uid})
	check(costs.quote(reads).details.usageCents == 300,"source paperwork revision permits another scan")
	reads.inventory.clear()
	check(costs.quote(reload_state(reads)).details.usageCents == 300,"usage survives original item removal and reload")
	var retry := normal.duplicate(true)
	retry.cash = 10
	var failed := Model.reduce(retry,{"type":"SETTLE"})
	check(failed.cash == 10 and failed.phase == "open" and costs.quote(failed).total == 22,"insufficient settlement leaves all money and live quote intact")
	costs.record(failed,"uv","after-failed-settlement",0.5)
	costs.record(failed,"uv","after-failed-settlement-2",0.5)
	check(costs.quote(failed).total == 23,"new work after failed settlement increases retry cost")
	failed.cash = 100
	var paid := Model.reduce(failed,{"type":"SETTLE"})
	check(paid.cash == 77 and paid.report.costs == costs.quote(failed),"successful retry posts exact retained shared quote atomically")
	var repeated := Model.reduce(reload_state(paid),{"type":"SETTLE"})
	check(repeated.cash == 77 and repeated.ledger == JSON.parse_string(JSON.stringify(paid.ledger)),"settlement cannot repeat after reload")
	var electric_entries := 0
	var cleaning_entries := 0
	for row in paid.ledger:
		if row.kind == "electricity": electric_entries += 1
		if row.kind == "cleaning": cleaning_entries += 1
	check(electric_entries == 1 and cleaning_entries == 1,"electricity and cleaning ledger entries are separate once")
	var rent := normal.duplicate(true)
	rent.day = 7
	daily(rent)
	rent = Model.reduce(rent,{"type":"SETTLE"})
	check(rent.report.rent == 450 and rent.report.costs.total + rent.report.rent == 472,"day7 daily example totals472 with unchanged rent")
	var old := Model.create("COST-LEGACY")
	old.erase("storeCosts")
	old.day = 4
	costs.ensure(old)
	check(old.storeCosts.fromDay == 5 and costs.quote(old).legacy and costs.quote(old).total == 20,"old save keeps current legacy20 and activates next day")
	var old_uid: String = old.inventory[0].uid
	old = Model.reduce(old,{"type":"CHECK","uid":old_uid,"tool":"TOL-002"})
	check(Model.find_inventory(old,old_uid).evidence.has("TOL-002") and costs.quote(old).total == 20,"legacy current day equipment remains usable without retroactive metering")
	var loaded := reload_state(old)
	costs.ensure(loaded)
	check(loaded.storeCosts.fromDay == 5,"reload persists activation date instead of moving it")
	loaded = Model.reduce(loaded,{"type":"SETTLE"})
	check(loaded.report.maintenance == 20 and loaded.report.electricity == 0,"legacy settlement preserves maintenance report")
	loaded = Model.reduce(loaded,{"type":"NEXT"})
	check(costs.quote(loaded).total == 16 and not costs.quote(loaded).legacy,"legacy save switches on persisted activation day")
	var lamp_next := Model.create("COST-LAMP-NEXT")
	lamp_next.day = 3
	lamp_next = Model.reduce(lamp_next,{"type":"SETTLE"})
	lamp_next = Model.reduce(lamp_next,{"type":"UPGRADE","id":"lamp"})
	check(costs.quote(lamp_next).electricity == 8,"after-settlement lamp upgrade cannot change paid day quote")
	lamp_next = Model.reduce(lamp_next,{"type":"NEXT"})
	check(costs.quote(lamp_next).electricity == 9,"after-settlement lamp starts billing tomorrow")
	var quartz := Model.create("COST-QUARTZ")
	uid = quartz.inventory[0].uid
	quartz = service_all(quartz,uid)
	check(costs.quote(quartz).details.usageCents == 100,"successful quartz tester procedure adds one credit only")
	quartz = Model.reduce(quartz,{"type":"SERVICE_COMPLETE","uid":uid,"task":"test"})
	check(costs.quote(quartz).details.usageCents == 100,"replayed service completion does not meter twice")
	var powered := Model.create("COST-POWERED-GUARDS")
	uid = powered.inventory[0].uid
	device(powered,"scanner").enabled = false
	powered = Model.reduce(powered,{"type":"SCAN","uid":uid})
	check(not powered.scanned.has(uid),"disabled scanner blocks scan and source evidence")
	device(powered,"repair_tester").status = "broken"
	powered = service_all(powered,uid)
	check(WatchService.current(Model.find_inventory(powered,uid)) == "test" and costs.quote(powered).details.usageCents == 0,"broken tester blocks final service commit without metering")
	check(WatchService.problem(powered,Model.find_inventory(powered,uid),"test") != "","test preflight exposes unavailable tester before powered animation")
	check(not Model.find_inventory(powered,uid).service.operations.has("test"),"unavailable tester also blocks test animation progress")
	device(powered,"repair_tester").status = "normal"
	powered = service_all(powered,uid)
	check(costs.quote(powered).details.usageCents == 100,"repaired tester permits saved procedure completion exactly once")
	var mechanical := Model.create("COST-MECHANICAL")
	var mechanical_item := Model.new_item(mechanical,"WCH-008",{"working":false,"condition":0.6})
	Model.put_in(mechanical,mechanical_item)
	mechanical = service_all(mechanical,mechanical_item.uid)
	check(costs.quote(mechanical).details.usageCents == 150,"mechanical test consumes1.5Cr, manual service consumes no electricity")
	var customer := Model.create("COST-CUSTOMER")
	var customer_item := Model.new_item(customer,"WCH-001",{"working":false,"condition":0.6,"owner":"customer","orderId":"CUSTOMER-TEST"})
	Model.put_in(customer,customer_item)
	customer = service_all(customer,customer_item.uid)
	check(costs.quote(customer).details.usageCents == 100,"customer original uses same quartz meter with no added service fee")
	var forgery := Model.create("COST-FORGERY")
	uid = forgery.inventory[1].uid
	forgery = Model.reduce(forgery,{"type":"SERVICE_PROGRESS","uid":uid,"task":"forge_serial","progress":{"complete":true,"opened":false}})
	device(forgery,"uv").enabled = false
	var forge_before_ap: float = forgery.ap
	forgery = Commerce.reduce(forgery,{"type":"FORGE","uid":uid,"method":"serial"})
	check(not WatchForgery.active(Model.find_inventory(forgery,uid),"serial") and forgery.ap == forge_before_ap and costs.quote(forgery).details.usageCents == 0,"disabled UV blocks FORGE before material/AP charges")
	device(forgery,"uv").enabled = true
	forgery = Commerce.reduce(forgery,{"type":"FORGE","uid":uid,"method":"serial"})
	forgery = Commerce.reduce(forgery,{"type":"FORGE","uid":uid,"method":"serial"})
	check(WatchForgery.active(Model.find_inventory(forgery,uid),"serial") and costs.quote(forgery).details.usageCents == 50,"successful serial processing meters once despite replay")
	var terminals := Model.create("COST-TERMINALS")
	device(terminals,"order_terminal").status = "repair"
	terminals.day = 2
	terminals = Model.reduce(terminals,{"type":"TAKE_ORDER","id":"ORD-001"})
	check(Model._order_state(terminals,"ORD-001").status == "available","unavailable order terminal blocks accepting orders")
	terminals = Model.reduce(terminals,{"type":"ARRIVE"})
	device(terminals,"quote_terminal").status = "broken"
	var old_price: float = terminals.trade.price
	terminals = Model.reduce(terminals,{"type":"OFFER","price":old_price + 1})
	check(terminals.trade.price == old_price and terminals.notice.contains("柜台报价机"),"unavailable quote terminal blocks new offers with named reason")
	var failed_check := Model.create("COST-FAILED-CHECK")
	failed_check.ap = 0
	failed_check = Model.reduce(failed_check,{"type":"CHECK","uid":failed_check.inventory[0].uid,"tool":"TOL-002"})
	check(costs.quote(failed_check).details.usageCents == 0,"failed CHECK does not produce usage")
	print("STORE COSTS RESULT ",failures)
	quit(1 if failures else 0)
