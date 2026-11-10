extends Node
## Global game state: dispatches actions through the ported reducer, saves to
## user://, and tells the screens what changed so they can animate it.

signal changed(prev: Dictionary, next: Dictionary, action: Dictionary)
signal prefs_changed

const Commerce = preload("res://scripts/model/commerce.gd")
const Wanted = preload("res://scripts/model/wanted_cases.gd")
const CrimeEvents = preload("res://scripts/model/crime_events.gd")
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
	StoreCosts.ensure(state)
	Wanted.ensure(state)
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
	Wanted.ensure(state)
	focus_uid = ""
	save()
	changed.emit(prev, state, {"type": "NEW_GAME"})

## Apply an action. Returns true when the state actually changed.
func dispatch(a: Dictionary) -> bool:
	var prev := state
	var next := Commerce.reduce(state, a)
	if is_same(next, prev):
		return false
	state = next
	save()
	changed.emit(prev, next, a)
	return true

func save() -> void:
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
