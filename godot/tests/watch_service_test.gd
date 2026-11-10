extends SceneTree
const Commerce = preload("res://scripts/model/commerce.gd")
var failures := 0
var service
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("WATCH SERVICE ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func progress(s: Dictionary, uid: String, task: String) -> Dictionary:
	return Model.reduce(s, {"type":"SERVICE_PROGRESS", "uid":uid, "task":task, "progress":{"step":3,"complete":true,"parts":{"cover":"tray"}}})
func complete_all(s: Dictionary, uid: String) -> Dictionary:
	s = Model.reduce(s, {"type":"SERVICE_BEGIN","uid":uid})
	for index in 6:
		var it: Dictionary = Model.find_inventory(s,uid)
		var task: String = service.current(it)
		if task == "": break
		s = progress(s,uid,task)
		s = Model.reduce(s,{"type":"SERVICE_COMPLETE","uid":uid,"task":task})
	return Model.reduce(s,{"type":"SERVICE_FINISH","uid":uid})
func run() -> void:
	service = load("res://scripts/model/watch_service.gd")
	check(service != null, "persistent service rules exist")
	if service == null:
		quit(1)
		return
	GameData.ensure()
	var s := Model.create("SERVICE-RULES")
	var profiles := true
	for d in GameData.item_list:
		profiles = profiles and d.watch.has("movement") and d.watch.has("caseback") and d.watch.has("parts")
	check(profiles,"all 78 models declare movement, cover and compatible parts")
	var quartz := Model.new_item(s,"WCH-001",{"working":false,"condition":0.6,"watch":{"mass":48.0,"serial":"Q TEST","logo_variant":0,"missing_part":"","part_mass":0}})
	var mechanical := Model.new_item(s,"WCH-008",{"working":false,"condition":0.6,"watch":{"mass":72.0,"serial":"M TEST","logo_variant":0,"missing_part":"","part_mass":0}})
	check(service.profile(quartz).movement == "quartz" and service.profile(mechanical).movement == "mechanical","model profiles choose distinct movements")
	check(service.tasks(quartz).has("replace") and not service.tasks(quartz).has("wash"),"stopped quartz gets power replacement without mechanical washing")
	check(service.tasks(mechanical).has("wash") or service.tasks(mechanical).has("replace"),"stopped mechanical gets a compatible physical repair")
	var faults: Dictionary = quartz.service.duplicate(true)
	service.ensure(quartz,"ANOTHER-SEED")
	var saved: Dictionary = JSON.parse_string(JSON.stringify(quartz))
	service.ensure(saved,"AFTER-RELOAD")
	check(quartz.service == faults and saved.service == JSON.parse_string(JSON.stringify(faults)),"fixed faults and work order never reroll after ensure or reload")
	var healthy := Model.new_item(s,"WCH-001",{"working":true,"condition":1.0,"watch":{"mass":48,"serial":"HEALTHY","logo_variant":0,"missing_part":"","part_mass":0}})
	check(service.tasks(healthy).is_empty() and healthy.working,"healthy complete watch has no mandatory work")
	var old := healthy.duplicate(true)
	old.erase("service")
	old.repaired = true
	old.condition = 0.55
	service.ensure(old,"LEGACY")
	check(service.tasks(old).is_empty() and old.working and old.condition == 0.55,"legacy completed repair does not receive repeat work")
	var normal := healthy.duplicate(true)
	normal.erase("service")
	normal.condition = 0.6
	service.ensure(normal,"LEGACY")
	check(normal.working and not service.tasks(normal).has("open") and not service.tasks(normal).has("test"),"legacy working watch never acquires a new functional defect")
	Model.put_in(s,quartz)
	var uid: String = quartz.uid
	s = Model.reduce(s,{"type":"SERVICE_BEGIN","uid":uid})
	var original_ap: float = s.ap
	var original_materials: Dictionary = s.materials.duplicate(true)
	s = Model.reduce(s,{"type":"SERVICE_COMPLETE","uid":uid,"task":"test"})
	check(s.ap == original_ap and s.materials == original_materials and not Model.find_inventory(s,uid).working,"wrong order cannot repair or charge")
	s = Model.reduce(s,{"type":"REPAIR","uid":uid,"recipeId":"REC-001"})
	check(not Model.find_inventory(s,uid).working and s.ap == original_ap,"legacy REPAIR cannot bypass physical work order")
	var task: String = service.current(Model.find_inventory(s,uid))
	var precise := {"step":2,"elapsed":0.125,"parts":{"battery":[1.25,2.5]},"custom":{"safe":true},"complete":false}
	s = Model.reduce(s,{"type":"SERVICE_PROGRESS","uid":uid,"task":task,"progress":precise})
	check(Model.find_inventory(s,uid).service.operations[task] == precise,"generic nested operation progress is saved precisely")
	var reloaded: Dictionary = JSON.parse_string(JSON.stringify(s))
	check(Model.find_inventory(reloaded,uid).service.operations[task] == JSON.parse_string(JSON.stringify(precise)),"interrupted operation is JSON recoverable")
	s = Model.reduce(s,{"type":"SERVICE_COMPLETE","uid":uid,"task":task})
	check(s.ap == original_ap and not Model.find_inventory(s,uid).service.done.has(task),"incomplete animation cannot commit")
	s = progress(s,uid,task)
	s = Model.reduce(s,{"type":"SERVICE_COMPLETE","uid":uid,"task":task})
	var after_ap: float = s.ap
	var after_materials: Dictionary = s.materials.duplicate(true)
	s = Model.reduce(s,{"type":"SERVICE_COMPLETE","uid":uid,"task":task})
	s = Model.reduce(s,{"type":"SERVICE_PROGRESS","uid":uid,"task":task,"progress":{"complete":false}})
	check(s.ap == after_ap and s.materials == after_materials and Model.find_inventory(s,uid).service.operations[task].complete,"completed task progress and costs cannot repeat")
	check(not Model.find_inventory(s,uid).working,"dust cannot restore stopped movement")
	s = complete_all(s,uid)
	var repaired: Dictionary = Model.find_inventory(s,uid)
	check(repaired.working and repaired.repaired and service.finished(repaired) and not repaired.service.opened,"physical quartz service restores power and closes cover")
	check(s.ap >= 8 and repaired.authentic == quartz.authentic,"one job fits daily AP and never changes authenticity")
	var completed_before: Dictionary = Model.find_inventory(s,uid).service.operations.duplicate(true)
	s = Model.reduce(s,{"type":"SERVICE_PROGRESS","uid":uid,"task":"","progress":{"complete":true}})
	check(Model.find_inventory(s,uid).service.operations == completed_before,"unknown or empty operation identifiers cannot create work state")
	var completed_ap: float = s.ap
	s = Model.reduce(s,{"type":"SERVICE_FINISH","uid":uid})
	check(s.ap == completed_ap and service.tasks(Model.find_inventory(s,uid)) == repaired.service.tasks,"finish is idempotent")
	var external := Model.new_item(s,"WCH-002",{"condition":1.0,"watch":{"mass":108.9,"serial":"LINK","logo_variant":0,"missing_part":"一节可拆表节","part_mass":3.1}})
	Model.put_in(s,external)
	check(service.tasks(external) == ["replace"],"missing metal link needs no cover, wash or movement test")
	var external_uid: String = external.uid
	s = Model.reduce(s,{"type":"SERVICE_BEGIN","uid":external_uid})
	var old_mass := WatchRules.mass(external)
	s.materials["MAT-008"] = 0
	s = progress(s,external_uid,"replace")
	var blocked_ap: float = s.ap
	s = Model.reduce(s,{"type":"SERVICE_COMPLETE","uid":external_uid,"task":"replace"})
	check(WatchRules.mass(Model.find_inventory(s,external_uid)) == old_mass and s.ap == blocked_ap,"missing stock blocks atomic commit without changing physical mass")
	s.materials["MAT-008"] = 1
	s = complete_all(s,external_uid)
	check(is_equal_approx(WatchRules.mass(Model.find_inventory(s,external_uid)),112.0) and Model.find_inventory(s,external_uid).condition == 1.0,"matching external replacement restores real mass without degrading pristine condition")
	var maintenance := Model.create("MECHANICAL-MAINTENANCE")
	var dirty_movement: Dictionary = {}
	var drawn_kinds := {}
	for draw_index in 40:
		var sample := Model.new_item(maintenance,"WCH-008",{"working":false,"condition":0.6,"watch":{"mass":72.0,"serial":"OIL TEST","logo_variant":0,"missing_part":"","part_mass":0}})
		for fault in sample.service.faults:
			if fault.functional: drawn_kinds[fault.id] = true
		if sample.service.tasks.has("wash"): dirty_movement = sample
	check(drawn_kinds.size() > 1,"same mechanical model draws different compatible physical faults")
	Model.put_in(maintenance,dirty_movement)
	var mechanical_uid: String = dirty_movement.uid
	maintenance = Model.reduce(maintenance,{"type":"SERVICE_BEGIN","uid":mechanical_uid})
	for task_name in ["dust","open","wash"]:
		maintenance = progress(maintenance,mechanical_uid,task_name)
		maintenance = Model.reduce(maintenance,{"type":"SERVICE_COMPLETE","uid":mechanical_uid,"task":task_name})
	var washed: Dictionary = Model.find_inventory(maintenance,mechanical_uid)
	check(not washed.working and washed.service.opened and not washed.service.tasks.has("replace"),"washing old oil cannot restore function before lubrication or demand healthy replacement parts")
	maintenance = complete_all(maintenance,mechanical_uid)
	washed = Model.find_inventory(maintenance,mechanical_uid)
	check(washed.working and washed.service.faults.all(func(fault):return fault.resolved) and service.finished(washed),"mechanical cleaning, lubrication and physical test resolve only the assigned old-oil fault")
	var shared := Model.create("SHARED-COVER")
	var shared_item := Model.new_item(shared,"WCH-001",{"working":false,"condition":0.6,"watch":{"mass":41.8,"serial":"BALLAST","logo_variant":0,"missing_part":"内侧固定部件","part_mass":6.2}})
	Model.put_in(shared,shared_item)
	var shared_uid: String = shared_item.uid
	var faults_before: Array = shared_item.service.faults.duplicate(true)
	var tasks_before: Array = shared_item.service.tasks.duplicate()
	var shared_ap: float = shared.ap
	shared = Model.reduce(shared,{"type":"SERVICE_PROGRESS","uid":shared_uid,"task":"forge_weight","progress":{"opened":true,"complete":false,"parts":{"cover":"tray"}}})
	check(Model.sale_eligibility(Model.find_inventory(shared,shared_uid),"CHR-002") != null,"interrupted forge cover removal also blocks sale")
	shared = JSON.parse_string(JSON.stringify(shared))
	shared = Model.reduce(shared,{"type":"SERVICE_PROGRESS","uid":shared_uid,"task":"forge_weight","progress":{"opened":false,"complete":true,"parts":{"cover":"closed"}}})
	shared = Commerce.reduce(shared,{"type":"FORGE","uid":shared_uid,"method":"weight"})
	shared_item = Model.find_inventory(shared,shared_uid)
	check(shared.ap == shared_ap-1 and shared_item.service.done.is_empty() and shared_item.service.tasks == tasks_before and shared_item.service.faults == JSON.parse_string(JSON.stringify(faults_before)) and not shared_item.working,"shared forge cover actions charge only forgery and do not complete actual repairs")
	check(is_equal_approx(WatchRules.mass(shared_item),48.0) and shared_item.watch.missing_part != "","forged mass never restores actual missing parts")
	shared = complete_all(shared,shared_uid)
	shared_item = Model.find_inventory(shared,shared_uid)
	check(is_equal_approx(WatchRules.mass(shared_item),48.0) and not WatchForgery.active(shared_item,"weight") and shared_item.working,"legitimate replacement removes ballast and installs real missing mass exactly once")
	var guarded := Model.create("OPEN-GUARD")
	var guard_item := Model.new_item(guarded,"WCH-001",{"working":false,"condition":1.0,"watch":{"mass":48,"serial":"GUARD","logo_variant":0,"missing_part":"","part_mass":0}})
	Model.put_in(guarded,guard_item)
	guarded = Model.reduce(guarded,{"type":"SERVICE_BEGIN","uid":guard_item.uid})
	guarded = progress(guarded,guard_item.uid,"open")
	guarded = Model.reduce(guarded,{"type":"SERVICE_COMPLETE","uid":guard_item.uid,"task":"open"})
	guard_item = Model.find_inventory(guarded,guard_item.uid)
	check(guard_item.service.opened and Model.sale_eligibility(guard_item,"CHR-002") != null,"opened unfinished watch cannot enter sale")
	guarded.trade = {"id":"guard-merchant","npcId":"CHR-010","kind":"merchant","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[]}
	var count: int = guarded.inventory.size()
	guarded = Commerce.reduce(guarded,{"type":"SELL_MERCHANT_ITEM","uid":guard_item.uid})
	check(guarded.inventory.size() == count,"merchant cannot bypass opened watch protection")
	var forge := Model.create("FORGE-PROGRESS")
	var forge_uid: String = forge.inventory[0].uid
	var forge_function: bool = forge.inventory[0].working
	var forge_faults: Array = forge.inventory[0].service.faults.duplicate(true)
	var forge_ap: float = forge.ap
	forge = Commerce.reduce(forge,{"type":"FORGE","uid":forge_uid,"method":"logo"})
	check(not forge.inventory[0].has("forgery") and forge.ap == forge_ap,"direct forge commit cannot skip workbench operation")
	forge = Model.reduce(forge,{"type":"SERVICE_PROGRESS","uid":forge_uid,"task":"forge_logo","progress":{"complete":true,"parts":{"cover":"closed"}}})
	forge = Commerce.reduce(forge,{"type":"FORGE","uid":forge_uid,"method":"logo"})
	check(WatchForgery.active(forge.inventory[0],"logo") and forge.inventory[0].service.faults == forge_faults and forge.inventory[0].working == forge_function,"forgery progress commits appearance without fixing true faults")
	var game = root.get_node("Game")
	check(game.has_method("migrate_service_save"),"save migration and original backup are explicit")
	if game.has_method("migrate_service_save"):
		var legacy_state := Model.create("SERVICE-OLD")
		legacy_state.erase("serviceVersion")
		for item in legacy_state.inventory: item.erase("service")
		legacy_state.inventory[0].repaired = true
		legacy_state.inventory[0].working = true
		legacy_state.repairProgress[legacy_state.inventory[1].uid] = 2
		var legacy_text := JSON.stringify(legacy_state)
		var file := FileAccess.open(game.SAVE_PATH,FileAccess.WRITE)
		file.store_string(legacy_text)
		file.close()
		var backup_path: String = ProjectSettings.globalize_path(game.SERVICE_BACKUP_PATH)
		DirAccess.make_dir_absolute(backup_path)
		game.state = legacy_state.duplicate(true)
		game.state.cash += 123
		game.save()
		check(FileAccess.get_file_as_string(game.SAVE_PATH) == legacy_text,"failed pre-migration backup cannot overwrite original save")
		DirAccess.remove_absolute(backup_path)
		file = FileAccess.open(game.SAVE_PATH,FileAccess.WRITE)
		file.store_string(legacy_text)
		file.close()
		var migrated: Dictionary = game.migrate_service_save(legacy_state)
		check(FileAccess.get_file_as_string(game.SERVICE_BACKUP_PATH) == legacy_text and migrated.inventory.all(func(item):return item.has("service")),"migration backs up original bytes before initializing persistent service")
		check(migrated.inventory[0].service.tasks.is_empty() and migrated.inventory[0].working and migrated.materials == legacy_state.materials and migrated.cash == legacy_state.cash,"migration preserves completed function, inventory cash and old supply stock")
		game.migrate_service_save(migrated)
		check(FileAccess.get_file_as_string(game.SERVICE_BACKUP_PATH) == legacy_text,"repeat migration preserves original backup")
	print("WATCH SERVICE failures=",failures)
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	quit(1 if failures else 0)
