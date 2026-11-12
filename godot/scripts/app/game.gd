extends Node
## Global game state: dispatches actions through the ported reducer, saves to
## user://, and tells the screens what changed so they can animate it.

signal changed(prev: Dictionary, next: Dictionary, action: Dictionary)
signal prefs_changed

const Commerce = preload("res://scripts/model/commerce.gd")
const Wanted = preload("res://scripts/model/wanted_cases.gd")
const CrimeEvents = preload("res://scripts/model/crime_events.gd")
const Life = preload("res://scripts/model/campaign_life.gd")
const Market = preload("res://scripts/model/weekly_market.gd")
const Extensions = preload("res://scripts/model/shop_upgrades.gd")
const Crates = preload("res://scripts/model/bulk_crates.gd")
const Contracts = preload("res://scripts/model/service_contracts.gd")
const Journal = preload("res://scripts/model/shop_journal.gd")
const Stories = preload("res://scripts/model/shop_stories.gd")
const SAVE_PATH := "user://orbital-watch-save-v4.json"
const LEGACY_PATH := "user://orbital-save-v3.json"
const LEGACY_BACKUP_PATH := "user://orbital-save-v3.backup.json"
const SERVICE_BACKUP_PATH := "user://orbital-watch-save-v4.pre-service.backup.json"
const PREFS_PATH := "user://orbital-prefs.json"

var state: Dictionary = {}
var prefs := {"sound": true, "reduced_motion": false, "music_volume": 0.6, "sfx_volume": 0.8}
var focus_uid := ""          # object on the workbench / selected in storage
var has_save := false

func _ready() -> void:
	GameData.ensure()
	load("res://scripts/app/debug_values.gd").load_overrides()
	backup_legacy_save()
	if FileAccess.file_exists(PREFS_PATH):
		var p = JSON.parse_string(FileAccess.get_file_as_string(PREFS_PATH))
		if p is Dictionary:
			prefs.merge(p, true)
	if FileAccess.file_exists(SAVE_PATH):
		var s = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
		if s is Dictionary and s.get("schema", 0) == 4:
			state = s
			has_save = true
	if state.is_empty():
		state = Model.create()
	else:
		state = migrate_service_save(state)
	Landlord.ensure(state)
	StoreCosts.ensure(state)
	Wanted.ensure(state)
	NightCrime.ensure(state)
	NightCrime.ensure_day(state)
	ensure_shop_state(state)
	if has_save:
		if state.get("trade") is Dictionary and state.trade.get("kind","") in ["buy","sell"]: state=CounterDialogue.begin(state)
		save()

## Preserve the exact pre-service save before interpreting its old repair counters.
func migrate_service_save(previous: Dictionary) -> Dictionary:
	if previous.get("serviceVersion", 0) >= 1: return previous
	if FileAccess.file_exists(SAVE_PATH) and not FileAccess.file_exists(SERVICE_BACKUP_PATH):
		var backup_path := ProjectSettings.globalize_path(SERVICE_BACKUP_PATH)
		var error := ERR_ALREADY_EXISTS if DirAccess.dir_exists_absolute(backup_path) else DirAccess.copy_absolute(ProjectSettings.globalize_path(SAVE_PATH), backup_path)
		if error != OK:
			push_warning("维修升级前备份未完成，已保留原始存档；本次暂不升级。")
			return previous
	var migrated: Dictionary = previous.duplicate(true)
	var items: Array = migrated.inventory.duplicate()
	if migrated.get("trade") is Dictionary and migrated.trade.get("item") is Dictionary: items.append(migrated.trade.item)
	var lost_cleaning := false
	for it in items:
		WatchService.ensure(it, migrated.seed)
		var old_stage := int(migrated.get("repairProgress", {}).get(it.uid, 0))
		if old_stage > 0 and it.service.tasks.has("dust") and not it.service.done.has("dust"):
			# Old stage 1 is the recorded completed cleaning, never a new free repair.
			it.service.done.append("dust")
			it.service.operations.dust = {"complete":true,"legacy_completed":true}
			for fault in it.service.faults:
				if fault.id == "dust": fault.resolved = true
		if old_stage == 0 and it.service.tasks.has("dust"): lost_cleaning = true
	migrated.serviceVersion = 1
	if lost_cleaning:
		migrated.notice = "维修工单已升级并保留原档备份。旧版未完成的擦灰轨迹未保存，需重新擦拭一次；已完成维修和实物状态均已保留。"
	return migrated

## Preserve the previous catalogue independently of the new watch campaign.
func backup_legacy_save() -> void:
	if FileAccess.file_exists(LEGACY_PATH) and not FileAccess.file_exists(LEGACY_BACKUP_PATH):
		var error := DirAccess.copy_absolute(ProjectSettings.globalize_path(LEGACY_PATH), ProjectSettings.globalize_path(LEGACY_BACKUP_PATH))
		if error != OK:
			push_warning("旧档备份未完成；原始旧档仍完整保留。")

func legacy_save_text() -> String:
	return FileAccess.get_file_as_string(LEGACY_BACKUP_PATH) if FileAccess.file_exists(LEGACY_BACKUP_PATH) else ""

func new_game(seed := "") -> void:
	var prev := state
	state = Model.create(seed if seed != "" else "ORBITAL-%08X" % randi())
	Landlord.ensure(state)
	Wanted.ensure(state)
	NightCrime.ensure(state)
	ensure_shop_state(state)
	focus_uid = ""
	save()
	changed.emit(prev, state, {"type": "NEW_GAME"})

## Apply an action. Returns true when the state actually changed.
func ensure_shop_state(s: Dictionary, include_journal := true) -> void:
	WarehouseExpansion.ensure(s)
	Life.ensure(s)
	Market.ensure(s)
	Extensions.ensure(s)
	Crates.ensure(s)
	Contracts.ensure(s)
	Stories.ensure(s)
	if include_journal: Journal.ensure(s)

func dispatch(a: Dictionary) -> bool:
	var prev := state
	# Bootstrap legacy states before the action, never import fresh settlement
	# ledgers as historical receipts. A rejected action keeps the original state.
	var prepared: Dictionary = prev.duplicate(true)
	ensure_shop_state(prepared)
	var next: Variant = WarehouseExpansion.reduce(prepared,a)
	if next == null: next = Life.reduce(prepared,a)
	if next == null: next = Extensions.reduce(prepared,a)
	if next == null: next = Crates.reduce(prepared,a)
	if next == null: next = Stories.reduce(prepared,a)
	if next == null: next = Contracts.reduce(prepared,a)
	if next == null: next = Commerce.reduce(prepared,a)
	if is_same(next,prepared): return false
	ensure_shop_state(next,false)
	Contracts.observe(prepared,next,a)
	Stories.observe(prepared,next,a)
	_attach_referral(prepared,next,a)
	Journal.observe(prepared,next,a)
	Stories.observe_journal(prepared,next,a)
	_enrich_shop_feedback(prepared,next,a)
	if a.get("type","") in ["EXPAND_WAREHOUSE","BUY_PAWN_SLOTS"]:
		if not load("res://scripts/app/debug_values.gd")._write(SAVE_PATH,next):
			changed.emit(prev,prev,{"type":"STORAGE_SAVE_FAILED"})
			return false
		state=next
		has_save=true
		changed.emit(prev,next,a)
		return true
	state = next
	save()
	changed.emit(prev, next, a)
	return true

func _attach_referral(previous: Dictionary, next: Dictionary, action: Dictionary) -> void:
	if action.get("type","")!="ARRIVE" or previous.get("trade")!=null: return
	var trade=next.get("trade")
	if not trade is Dictionary or not trade.get("kind","") in ["buy","sell"]: return
	if trade.get("crimeCaseId","")!="" or trade.get("inspectionVisit",false): return
	var key := "%s/%d/%d/referral-v1" % [next.seed,int(next.day),int(previous.cursor)]
	if Model.fnv(key)%12!=0: return
	var candidates: Array[String]=[]
	for id in previous.get("shopJournal",{}).get("customers",{}):
		var memory: Dictionary=Journal.customer(previous,String(id))
		if id!=trade.npcId and int(memory.get("deals",0))>=2 and int(memory.get("trust",0))>=2: candidates.append(String(id))
	if candidates.is_empty(): return
	candidates.sort()
	var referrer: String=candidates[Model.fnv(key+"/person")%candidates.size()]
	trade.referrerId=referrer
	trade.line="%s介绍我来看看。\n%s" % [GameData.npc(referrer).name,String(trade.get("line",""))]

func _enrich_shop_feedback(previous: Dictionary, next: Dictionary, action: Dictionary) -> void:
	var trade = next.get("trade")
	if not trade is Dictionary: return
	if action.get("type","") == "ARRIVE" and previous.get("trade") == null:
		var greeting: String = Journal.greeting(previous,String(trade.get("npcId","")))
		if greeting != "": trade.line = greeting+"\n"+String(trade.get("line",""))
	if action.get("type","") == "OFFER" and action.get("evidence") != null and previous.get("trade") is Dictionary:
		if int(trade.get("rounds",0)) <= int(previous.trade.get("rounds",0)): return
		var evidence := String(action.evidence)
		if not trade.get("evidenceUsed",[]).has(evidence): return
		var label: String = {"TOL-001":"标识","TOL-002":"编号","TOL-005":"称量"}.get(evidence,"鉴定")
		trade.line = "已向对方出示%s记录，对方按已知依据回应。\n%s" % [label,String(trade.get("line",""))]

func save() -> void:
	ensure_shop_state(state)
	NightCrime.ensure(state)
	Landlord.ensure(state)
	StoreCosts.ensure(state)
	if state.get("serviceVersion", 0) < 1:
		state = migrate_service_save(state)
		if state.get("serviceVersion", 0) < 1: return
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(state))
		# Close before marking the in-memory file ready; browser persistence
		# still completes asynchronously through Godot's WebFS sync.
		f.close()
		has_save = true

func save_prefs() -> void:
	var f := FileAccess.open(PREFS_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(prefs))
	prefs_changed.emit()

func item(uid: String):
	return Model.find_item(state, uid)

func trade_item():
	return Model.trade_item(state) if state.trade != null else null

func def_name(def_id: String) -> String:
	return GameData.def(def_id).name

## The object the workbench should show: explicit focus, the trade lot, or the first stock.
func workbench_item():
	var it = item(focus_uid) if focus_uid != "" else null
	if it == null:
		it = trade_item()
	if it == null and not state.inventory.is_empty():
		it = state.inventory[0]
	return it

func today_event():
	return CrimeEvents.event_for_day(state)

func event_done() -> bool:
	for r in state.events:
		if r.day == state.day:
			return true
	return false
