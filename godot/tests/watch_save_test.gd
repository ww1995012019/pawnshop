extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, text: String) -> void:
	print("WATCH SAVE ", "PASS " if ok else "FAIL ", text)
	if not ok: failures += 1
func run() -> void:
	var game = root.get_node("Game")
	check(game.SAVE_PATH == "user://orbital-watch-save-v4.json", "watch content has independent versioned save")
	check(game.has_method("backup_legacy_save"), "legacy backup is explicit and non-destructive")
	if game.has_method("backup_legacy_save"):
		var legacy := "{\"schema\":3,\"inventory\":[{\"defId\":\"ITM-001\"}]}"
		var file := FileAccess.open("user://orbital-save-v3.json", FileAccess.WRITE)
		file.store_string(legacy)
		file.close()
		game.backup_legacy_save()
		check(FileAccess.get_file_as_string("user://orbital-save-v3.json") == legacy, "original old save retained")
		check(FileAccess.get_file_as_string("user://orbital-save-v3.backup.json") == legacy, "old save backed up byte for byte")
		game.backup_legacy_save()
		check(FileAccess.get_file_as_string("user://orbital-save-v3.backup.json") == legacy, "repeated startup preserves first backup")
	print("WATCH SAVE failures=", failures)
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	quit(1 if failures else 0)
