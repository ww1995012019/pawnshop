extends RefCounted
## All standard watch references, never the truth of a player's physical lot.
const Journal = preload("res://scripts/model/shop_journal.gd")
static func open(shell: Node) -> void:
	var modal: Array = shell.modal("全图鉴 · 全部手表",1080)
	var body: VBoxContainer = modal[0]
	var handled := 0
	var inspected := 0
	var repaired := 0
	var collection := {}
	for definition in GameData.item_list:
		var record := Journal.collection(Game.state,String(definition.id))
		collection[definition.id] = record
		if int(record.handled) > 0: handled += 1
		if int(record.inspected) > 0: inspected += 1
		if int(record.repaired) > 0: repaired += 1
	var progress := UIKit.label("收藏履历 · 经手 %d / %d款 · 检验 %d款 · 修复 %d款" % [handled,GameData.item_list.size(),inspected,repaired],16,UIKit.CYAN,false,true)
	progress.name = "catalogue_collection_progress"
	body.add_child(progress)
	var history := UIKit.button("经营计划 / 收藏履历","secondary",Vector2(0,44),17)
	history.name = "catalogue_shop_history"
	history.pressed.connect(func():
		(modal[1] as Callable).call()
		shell.open_shop_plan("history"))
	body.add_child(history)
	var navigation := HFlowContainer.new()
	navigation.add_theme_constant_override("h_separation",8)
	navigation.add_theme_constant_override("v_separation",8)
	navigation.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	body.add_child(navigation)
	var selection := ButtonGroup.new()
	var sections := {}
	var scroll := ScrollContainer.new()
	scroll.custom_minimum_size = Vector2(0,500)
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	var content_host: Container = body if shell.mobile_mode() else scroll
	if not shell.mobile_mode(): body.add_child(scroll)
	else:
		scroll.free()
		scroll = body.get_parent()
	var index := UIKit.vbox(16)
	index.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content_host.add_child(index)
	var detail := UIKit.vbox(12)
	detail.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var back := UIKit.button("← 返回全部手表", "secondary",Vector2(0,48),19)
	back.name = "catalogue_back"
	detail.add_child(back)
	var reference := UIKit.vbox(12)
	reference.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	detail.add_child(reference)
	var saved_scroll := [0]
	back.pressed.connect(func():
		content_host.remove_child(detail)
		navigation.show()
		content_host.add_child(index)
		scroll.set_deferred("scroll_vertical",saved_scroll[0]))
	for group in ["all","low","mid","luxury","star","ultra"]:
		var title: String = {"all":"全部 · %d款" % GameData.item_list.size(),"low":"低等手表","mid":"中等手表","luxury":"名贵手表","star":"超名贵 · 星冕","ultra":"珍稀手表"}[group]
		var tab := UIKit.button(title,"secondary",Vector2(120,46),18)
		if shell.mobile_mode(): tab.custom_minimum_size.x = 96
		tab.name="catalogue_group_"+group
		tab.toggle_mode=true
		tab.add_theme_stylebox_override("pressed",UIKit.key_style("primary","pressed"))
		tab.button_group=selection
		tab.button_pressed=group=="all"
		tab.size_flags_horizontal=Control.SIZE_EXPAND_FILL
		navigation.add_child(tab)
		tab.pressed.connect(func():
			for key in sections: sections[key].visible=group=="all" or key==group
			scroll.scroll_vertical=0)
	for tier in ["low","mid","luxury","star","ultra"]:
		var section := UIKit.vbox(12)
		section.name="catalogue_section_"+tier
		sections[tier]=section
		index.add_child(section)
		section.add_child(UIKit.module_header({"low":"低等手表","mid":"中等手表","luxury":"名贵手表","star":"超名贵手表 · 星冕系列","ultra":"珍稀手表 · 穹铸系列"}[tier],"标准参考价 · 实物估价受品相、故障与真伪影响","CATALOGUE"))
		var grid := GridContainer.new()
		grid.columns = 4
		grid.add_theme_constant_override("h_separation",10)
		grid.add_theme_constant_override("v_separation",10)
		grid.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		section.add_child(grid)
		grid.resized.connect(func(): grid.columns = maxi(1,mini(4,int(grid.size.x/(140 if shell.mobile_mode() else 180)))))
		for definition in GameData.item_list:
			var category: String = "star" if definition.get("watch",{}).get("brand","")=="星冕" else String(definition.get("tier",""))
			if category != tier: continue
			var id: String = definition.id
			var record: Dictionary = collection[id]
			var collection_text := "经手%d · 检验%d · 修复%d" % [int(record.handled),int(record.inspected),int(record.repaired)]
			var card := UIKit.button("%s\n参考价 %s Cr\n%s" % [definition.name, str(int(definition.value)),collection_text],"secondary",Vector2(0,100) if shell.mobile_mode() else Vector2(170,178),19)
			card.tooltip_text = "已记录原物：" + collection_text
			if shell.mobile_mode(): card.custom_minimum_size.y = 88
			card.name = "catalogue_model_"+id
			card.icon = UIKit.item_icon(id)
			card.expand_icon = true
			card.vertical_icon_alignment = VERTICAL_ALIGNMENT_TOP
			card.icon_alignment = HORIZONTAL_ALIGNMENT_CENTER
			card.add_theme_constant_override("icon_max_width",32 if shell.mobile_mode() else 100)
			card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			card.pressed.connect(func():
				saved_scroll[0] = scroll.scroll_vertical
				content_host.remove_child(index)
				navigation.hide()
				content_host.add_child(detail)
				UIKit.clear(reference)
				reference.add_child(UIKit.label("已记录原物 · " + collection_text,17,UIKit.CYAN,false,true))
				load("res://scripts/ui/watch_manual.gd").populate_reference(reference,id)
				scroll.scroll_vertical = 0)
			grid.add_child(card)
	# Detached index/detail are explicitly freed with the modal.
	body.tree_exiting.connect(func():
		if is_instance_valid(index) and index.get_parent()==null: index.queue_free()
		if is_instance_valid(detail) and detail.get_parent()==null: detail.queue_free())
