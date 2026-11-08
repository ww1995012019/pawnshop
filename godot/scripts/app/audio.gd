extends Node
## All game audio in one place: three mixer buses (music, effects, terminal
## voice), looping background music that crossfades between rooms, short
## stingers, and the shop terminal's spoken prompts, which follow what
## actually happens in the game (Game.changed). Voice ducks the music.

const MUSIC_FOR := {"counter": "shop", "title": "shop", "inspect": "workbench", "repair": "workbench",
	"warehouse": "storeroom", "orders": "storeroom", "report": "ledger"}
const SFX := ["click", "coin", "check", "page", "drop", "open", "reject"]
const DUCK_DB := -9.0
const FADE := 1.4

var buses := {}
var music_a: AudioStreamPlayer
var music_b: AudioStreamPlayer
var current_music := ""
var stinger: AudioStreamPlayer
var voice: AudioStreamPlayer
var voice_queue: Array[String] = []
var voice_last := {}
var ambience: AudioStreamPlayer
var sfx_streams := {}
var sfx_pool: Array[AudioStreamPlayer] = []
var duck := 0.0
var lines := {}

func _ready() -> void:
	process_mode = Node.PROCESS_MODE_ALWAYS
	for b in ["Music", "SFX", "Voice"]:
		if AudioServer.get_bus_index(b) < 0:
			AudioServer.add_bus()
			AudioServer.set_bus_name(AudioServer.bus_count - 1, b)
			AudioServer.set_bus_send(AudioServer.bus_count - 1, "Master")
		buses[b] = AudioServer.get_bus_index(b)
	music_a = _player("Music")
	music_b = _player("Music")
	stinger = _player("Music")
	voice = _player("Voice")
	voice.finished.connect(_next_voice)
	ambience = _player("SFX")
	# Room tone under the music: the shop's hum and air handling.
	ambience.stream = load("res://assets/audio/ambient_loop.wav")
	ambience.volume_db = -24.0
	ambience.finished.connect(func():
		if Game.prefs.get("sound", true):
			ambience.play())
	for k in SFX:
		sfx_streams[k] = load("res://assets/audio/%s.wav" % k)
	for i in 8:
		sfx_pool.append(_player("SFX"))
	var f := FileAccess.open("res://data/voice_lines.json", FileAccess.READ)
	if f:
		var j = JSON.parse_string(f.get_as_text())
		if j is Dictionary:
			lines = j.get("lines", {})
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
	AudioServer.set_bus_volume_db(buses.Music, to_db(pref("music_volume", 0.6)) + duck)
	AudioServer.set_bus_volume_db(buses.SFX, to_db(pref("sfx_volume", 0.8)))
	AudioServer.set_bus_volume_db(buses.Voice, to_db(pref("voice_volume", 0.9)))
	if on and not ambience.playing:
		ambience.play()

func _process(delta: float) -> void:
	# Duck the music smoothly while the terminal is speaking.
	var target := DUCK_DB if voice.playing else 0.0
	var next := move_toward(duck, target, delta * (40.0 if target < duck else 10.0))
	if not is_equal_approx(next, duck):
		duck = next
		AudioServer.set_bus_volume_db(buses.Music, to_db(pref("music_volume", 0.6)) + duck)

# ---------------------------------------------------------------- music

## Choose the loop for a page or room; crossfades if it changes.
func music_for(page: String) -> void:
	play_music(MUSIC_FOR.get(page, "shop"))

func play_music(name: String) -> void:
	if name == current_music:
		return
	var stream: AudioStream = load("res://assets/music/%s.ogg" % name) if ResourceLoader.exists("res://assets/music/%s.ogg" % name) else null
	if stream == null:
		return
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

# ---------------------------------------------------------------- voice

## Queue a terminal prompt. The same prompt is not repeated within a few
## seconds, and at most two wait behind the one being spoken.
func say(id: String) -> void:
	var path := "res://assets/voice/%s.ogg" % id
	if not ResourceLoader.exists(path):
		return
	var now := Time.get_ticks_msec()
	if now - int(voice_last.get(id, -100000)) < 4000 or voice_queue.has(id):
		return
	voice_last[id] = now
	if voice.playing:
		if voice_queue.size() < 2:
			voice_queue.append(id)
		return
	_speak(id)

func _speak(id: String) -> void:
	voice.stream = load("res://assets/voice/%s.ogg" % id)
	voice.play()

func _next_voice() -> void:
	if not voice_queue.is_empty():
		_speak(voice_queue.pop_front())

## A new day: open stinger, then the morning announcements.
func day_opened(day: int) -> void:
	sting("open")
	say("open_day" if day > 1 or Game.has_save else "welcome")
	if Model.rent_due(day) > 0:
		say("rent_today")
	if Game.today_event() != null and not Game.event_done():
		say("message")

func _order_status(s: Dictionary, id) -> String:
	for o in s.orders:
		if o.id == id:
			return String(o.status)
	return ""

func _evidence(s: Dictionary, uid) -> int:
	var it = Model.find_item(s, uid) if uid != null else null
	return it.evidence.size() if it != null else 0

func _on_changed(prev: Dictionary, next: Dictionary, a: Dictionary) -> void:
	var pt = prev.trade
	var nt = next.trade
	match a.type:
		"ARRIVE":
			if pt == null and nt != null:
				say("arrive")
		"CHECK":
			if _evidence(next, a.get("uid")) > _evidence(prev, a.get("uid")):
				say("evidence")
		"OFFER":
			if nt == null and pt != null:
				say("walkout")
			elif nt != null and nt.locked and not pt.locked:
				say("locked")
		"ACCEPT":
			if nt != null and nt.locked and (pt == null or not pt.locked):
				say("locked")
		"DELIVER":
			if pt != null and nt == null:
				sting("deal")
				say("deal_buy" if pt.kind == "buy" else "deal_sell")
		"PAWN":
			if pt != null and nt == null:
				sting("deal")
				say("pawn")
		"REFUSE":
			if pt != null and nt == null:
				say("leave")
		"REPAIR":
			var it = Model.find_item(next, a.get("uid"))
			var was = Model.find_item(prev, a.get("uid"))
			if it != null and it.repaired and was != null and not was.repaired:
				say("repaired")
		"CRAFT":
			say("crafted")
		"TAKE_ORDER":
			say("order_taken")
		"DELIVER_ORDER":
			if _order_status(next, a.get("id")) == "done" and _order_status(prev, a.get("id")) != "done":
				sting("deal")
				say("order_done")
		"SCAN":
			if not prev.scanned.has(a.get("uid")):
				say("scanned")
		"REGISTER":
			var it = Model.find_item(next, a.get("uid"))
			if it != null and it.sourceVerified:
				say("registered")
		"ISOLATE":
			var it = Model.find_item(next, a.get("uid"))
			if it != null and it.location == "isolation":
				say("isolated")
		"CHOOSE_EVENT":
			say("event_done")
		"UPGRADE":
			say("upgrade")
		"SETTLE":
			sting("close")
			say("closing")
			music_for("report")
		"NEXT":
			if next.phase == "ending":
				say("ending")
	# A refused action that names AP explains itself out loud.
	var notice := String(next.get("notice", ""))
	if notice != String(prev.get("notice", "")) and notice.contains("AP") and notice.contains("不足"):
		say("no_ap")
