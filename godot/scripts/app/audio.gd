extends Node
## All game audio in one place: two mixer buses (music, effects), looping
## background music that crossfades between rooms, short stingers on the
## day's key moments, room tone and pooled sound effects.

const MUSIC_FOR := {"counter": "shop", "title": "shop", "inspect": "workbench", "repair": "workbench",
	"warehouse": "storeroom", "orders": "storeroom", "report": "ledger"}
const SFX := ["click", "coin", "check", "page", "drop", "open", "reject"]
const FADE := 1.4

var buses := {}
var music_a: AudioStreamPlayer
var music_b: AudioStreamPlayer
var current_music := ""
var stinger: AudioStreamPlayer
var ambience: AudioStreamPlayer
var sfx_streams := {}
var sfx_pool: Array[AudioStreamPlayer] = []

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	for b in ["Music", "SFX"]:
		if AudioServer.get_bus_index(b) < 0:
			AudioServer.add_bus()
			AudioServer.set_bus_name(AudioServer.bus_count - 1, b)
			AudioServer.set_bus_send(AudioServer.bus_count - 1, "Master")
		buses[b] = AudioServer.get_bus_index(b)
	music_a = _player("Music")
	music_b = _player("Music")
	stinger = _player("Music")
	# Room tone under the music: the shop's hum and air handling.
	ambience = _player("SFX")
	ambience.stream = load("res://assets/audio/ambient_loop.wav")
	ambience.volume_db = -24.0
	ambience.finished.connect(func():
		if Game.prefs.get("sound", true):
			ambience.play())
	for k in SFX:
		sfx_streams[k] = load("res://assets/audio/%s.wav" % k)
	for i in 8:
		sfx_pool.append(_player("SFX"))
	Game.changed.connect(_on_changed)
	Game.prefs_changed.connect(apply_prefs)
	apply_prefs()

func _player(bus: String) -> AudioStreamPlayer:
	var p := AudioStreamPlayer.new()
	p.bus = bus
	add_child(p)
	return p

# ---------------------------------------------------------------- volume

static func pref(key: String, fallback: float) -> float:
	return clampf(float(Game.prefs.get(key, fallback)), 0.0, 1.0)

static func to_db(v: float) -> float:
	return -80.0 if v <= 0.001 else linear_to_db(v)

func apply_prefs() -> void:
	var on: bool = Game.prefs.get("sound", true)
	AudioServer.set_bus_mute(0, not on)
	AudioServer.set_bus_volume_db(buses.Music, to_db(pref("music_volume", 0.6)))
	AudioServer.set_bus_volume_db(buses.SFX, to_db(pref("sfx_volume", 0.8)))
	if on and not ambience.playing:
		ambience.play()

# ---------------------------------------------------------------- music

## Choose the loop for a page or room; crossfades if it changes.
func music_for(page: String) -> void:
	play_music(MUSIC_FOR.get(page, "shop"))

func play_music(name: String) -> void:
	if name == current_music:
		return
	var path := "res://assets/music/%s.ogg" % name
	if not ResourceLoader.exists(path):
		return
	var stream: AudioStream = load(path)
	if stream is AudioStreamOggVorbis:
		(stream as AudioStreamOggVorbis).loop = true
	current_music = name
	var incoming := music_b if music_a.playing else music_a
	var outgoing := music_a if incoming == music_b else music_b
	incoming.stream = stream
	incoming.volume_db = -40.0
	incoming.play()
	var tw := create_tween().set_parallel(true)
	tw.tween_property(incoming, "volume_db", 0.0, FADE).set_trans(Tween.TRANS_SINE)
	if outgoing.playing:
		tw.tween_property(outgoing, "volume_db", -40.0, FADE).set_trans(Tween.TRANS_SINE)
		tw.chain().tween_callback(outgoing.stop)

func sting(name: String) -> void:
	var path := "res://assets/music/sting_%s.ogg" % name
	if not ResourceLoader.exists(path):
		return
	stinger.stream = load(path)
	stinger.play()

## A new day: the shutter goes up with the opening phrase.
func day_opened(_day: int) -> void:
	sting("open")

# ---------------------------------------------------------------- effects

func sfx(k: String, db := 0.0, pitch := 1.0) -> void:
	var s: AudioStream = sfx_streams.get(k)
	if s == null:
		return
	for p in sfx_pool:
		if not p.playing:
			p.stream = s
			p.volume_db = db
			p.pitch_scale = pitch
			p.play()
			return

func _order_status(s: Dictionary, id) -> String:
	for o in s.orders:
		if o.id == id:
			return String(o.status)
	return ""

func _on_changed(prev: Dictionary, next: Dictionary, a: Dictionary) -> void:
	match a.type:
		"DELIVER", "PAWN":
			if prev.trade != null and next.trade == null:
				sting("deal")
		"DELIVER_ORDER":
			if _order_status(next, a.get("id")) == "done" and _order_status(prev, a.get("id")) != "done":
				sting("deal")
		"SETTLE":
			sting("close")
			music_for("report")
