extends SceneTree
## Audio wiring: buses, music per room, crossfade, prefs.
var fails := 0
func check(ok, msg):
	print(('PASS ' if ok else 'FAIL ') + msg)
	if not ok: fails += 1
func _initialize(): call_deferred('run')
func run():
	var game = root.get_node('Game')
	var audio = root.get_node('Audio')
	game.prefs.reduced_motion = true
	var shell = load('res://main.tscn').instantiate()
	root.add_child(shell)
	await create_timer(0.3).timeout
	check(AudioServer.get_bus_index('Music') > 0 and AudioServer.get_bus_index('SFX') > 0, 'music and effects buses exist')
	check(AudioServer.get_bus_index('Voice') < 0, 'no voice bus')
	# The Web build's sample playback only knows buses from the startup
	# layout; buses added at run time made the whole game silent there.
	var layout = load('res://default_bus_layout.tres')
	check(layout is AudioBusLayout, 'buses are declared in default_bus_layout.tres')
	check(audio.current_music == 'shop', 'title plays the shop theme: ' + audio.current_music)
	shell._close_title()
	game.new_game('ORBITAL-P0')
	shell.open_workspace('inspect')
	await create_timer(0.2).timeout
	check(audio.current_music == 'workbench', 'inspection switches to workbench: ' + audio.current_music)
	shell.workspace_shell.go('warehouse')
	await create_timer(0.2).timeout
	check(audio.current_music == 'storeroom', 'warehouse switches to storeroom: ' + audio.current_music)
	shell.close_workspace()
	await create_timer(0.2).timeout
	check(audio.current_music == 'shop', 'closing returns to the shop theme: ' + audio.current_music)
	await create_timer(1.6).timeout
	var playing := 0
	for p in [audio.music_a, audio.music_b]:
		if p.playing: playing += 1
	check(playing == 1, 'crossfade leaves exactly one loop playing: %d' % playing)
	game.prefs.music_volume = 0.3
	audio.apply_prefs()
	check(absf(AudioServer.get_bus_volume_db(AudioServer.get_bus_index('Music')) - linear_to_db(0.3)) < 0.6, 'music volume follows prefs')
	game.prefs.sound = false
	audio.apply_prefs()
	check(AudioServer.is_bus_mute(0), 'sound off mutes master')
	game.prefs.sound = true
	audio.apply_prefs()
	check(not AudioServer.is_bus_mute(0), 'sound on unmutes master')
	print('AUDIO failures=', fails)
	quit(1 if fails else 0)
