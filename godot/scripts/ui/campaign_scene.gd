extends VBoxContainer
## A counter letter and its evidence sheet use the same read-only story view.

const Story = preload("res://scripts/model/campaign_story.gd")
const Art = preload("res://scripts/ui/comic_assets.gd")

var host: Node
var dismiss: Callable
var beat_id := ""
var leaving := false

class Letter extends Button:
	var host: Node
	var beat: Dictionary

	func setup(shell: Node, compact: bool) -> void:
		host = shell
		name = "campaign_story_ticket"
		text = "来信"
		accessibility_name = "柜台来信"
		icon = Art.icon("file-lines")
		expand_icon = true
		add_theme_constant_override("icon_max_width",15 if compact else 20)
		add_theme_font_size_override("font_size",14 if compact else 21)
		mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		UIKit.context_button(self)
		pressed.connect(func(): host.open_campaign_scene(String(beat.get("id",""))))
		Game.changed.connect(_changed)
		_changed({},Game.state,{})

	func _changed(_previous: Dictionary, next: Dictionary, _action: Dictionary) -> void:
		beat = Story.current(next)
		update_interaction()

	func update_interaction() -> void:
		visible = not beat.is_empty() and host.campaign_scene_priority_problem() == ""
		if not visible:
			return
		var problem: String = host.campaign_scene_problem()
		disabled = problem != "" or host.modal_open()
		tooltip_text = String(beat.title) if problem == "" else String(beat.title) + " · " + problem

func setup(shell: Node, close: Callable, beat: Dictionary) -> void:
	host = shell
	dismiss = close
	beat_id = String(beat.id)
	name = "CampaignStoryScene"
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var compact: bool = host.mobile_mode()
	add_theme_constant_override("separation",6 if compact else 12)
	var speaker := UIKit.hbox(10 if compact else 18)
	var portrait := TextureRect.new()
	portrait.name = "campaign_speaker"
	portrait.texture = UIKit.npc_icon(String(beat.npcId))
	portrait.custom_minimum_size = Vector2(58,58) if compact else Vector2(104,104)
	portrait.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	portrait.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	portrait.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	portrait.mouse_filter = Control.MOUSE_FILTER_IGNORE
	speaker.add_child(portrait)
	var words := UIKit.vbox(3)
	words.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	words.add_child(UIKit.label(String(GameData.npc(beat.npcId).get("name","来信人")),22,UIKit.AMBER))
	var line := UIKit.label(String(beat.line),22,UIKit.TEXT,false,true)
	line.name = "campaign_line"
	words.add_child(line)
	speaker.add_child(words)
	add_child(speaker)
	var paper := UIKit.plate(UIKit.paper_style(12))
	paper.mouse_filter = Control.MOUSE_FILTER_PASS
	var evidence := UIKit.vbox(4)
	paper.add_child(evidence)
	var heading := UIKit.hbox(8)
	var stamp := UIKit.label("案卷依据",18,UIKit.AMBER)
	stamp.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	heading.add_child(stamp)
	heading.add_child(UIKit.label("第 %d–%d 天" % [int(beat.firstDay),int(beat.lastDay)],15,UIKit.MUTED))
	evidence.add_child(heading)
	evidence.add_child(UIKit.rule())
	var detail := UIKit.label(String(beat.detail),18,UIKit.INK,false,true)
	detail.name = "campaign_evidence"
	evidence.add_child(detail)
	var destinations: Array = beat.get("navigation", [])
	if not destinations.is_empty():
		var links := UIKit.grid(mini(2, destinations.size()), 6)
		evidence.add_child(links)
		for destination in destinations:
			var route: Dictionary = destination
			var kind := "primary" if route.page == "inspect" else "secondary"
			var key := UIKit.button(String(route.label), kind, Vector2(0, 44), 16)
			key.name = "campaign_navigation_" + String(route.page)
			key.custom_minimum_size.y = 44
			key.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			key.pressed.connect(func(): _follow(route))
			links.add_child(key)
	add_child(paper)
	var choices: Array = beat.get("actions",[])
	if choices.is_empty():
		return
	var row := UIKit.grid(mini(3,choices.size()),6 if compact else 10)
	add_child(row)
	for choice in choices:
		var option: Dictionary = choice
		var column := UIKit.vbox(3)
		column.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		row.add_child(column)
		var key := UIKit.button(String(option.label),"secondary",Vector2(0,50),18)
		key.name = "campaign_choice_" + String(option.id)
		key.custom_minimum_size.y = 44 if compact else 50
		key.tooltip_text = String(option.get("problem",""))
		key.disabled = key.tooltip_text != ""
		key.pressed.connect(func(): _choose(option))
		column.add_child(key)
		if key.disabled:
			column.add_child(UIKit.label(key.tooltip_text,15,UIKit.MUTED,false,true))

func _follow(route: Dictionary) -> void:
	if leaving or host.campaign_scene_problem() != "":
		return
	var active := Story.current(Game.state)
	if String(active.get("id","")) == beat_id and active.get("navigation",[]).has(route):
		leaving = true
		dismiss.call()
		host.call_deferred("_plan_navigate",String(route.page),String(route.get("uid","")))

func _choose(option: Dictionary) -> void:
	if leaving or host.campaign_scene_problem() != "":
		return
	var active := Story.current(Game.state)
	if String(active.get("id","")) != beat_id or not active.get("actions",[]).has(option):
		return
	if Game.dispatch(option.action):
		leaving = true
		host.sound("check")
		dismiss.call()
		if option.has("page") and option.page != "":
			host.call_deferred("_plan_navigate",String(option.page),String(option.get("uid","")))

static func final_card(receipt: Dictionary) -> PanelContainer:
	var destination: String = {"shop":"店内留档","station":"站务封存","public":"公开已核记录"}.get(receipt.get("destination",""),"留档结果")
	var frame := UIKit.record_card("夜班交接簿 · " + destination, String(receipt.get("detail", "")), "第 %d 天" % int(receipt.get("day", 90)))
	frame.name = "CampaignStoryFinal"
	var body := frame.get_child(0)
	var reason := String(receipt.get("reason",""))
	if not reason.is_empty() and reason != String(receipt.get("detail","")):
		body.add_child(UIKit.label(reason,15,UIKit.RUST,false,true))
	var line := String(receipt.get("line",""))
	if not line.is_empty():
		var npc_id := String(receipt.get("npcId", ""))
		if npc_id != "": line = String(GameData.npc(npc_id).name) + " · " + line
		body.add_child(UIKit.label(line,18,UIKit.INK,false,true))
	return frame
