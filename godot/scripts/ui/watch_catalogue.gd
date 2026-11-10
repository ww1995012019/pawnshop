extends RefCounted
## All standard watch references, never the truth of a player's physical lot.
static func open(shell: Node) -> void:
	var modal: Array = shell.modal("全图鉴 · 全部手表",1080)
	var body: VBoxContainer = modal[0]
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
	body.add_child(scroll)
	var index := UIKit.vbox(16)
	index.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(index)
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
		scroll.remove_child(detail)
		navigation.show()
		scroll.add_child(index)
		scroll.set_deferred("scroll_vertical",saved_scroll[0]))
	for group in ["all","low","mid","luxury","star","ultra"]:
		var title: String = {"all":"全部 · %d款" % GameData.item_list.size(),"low":"低等手表","mid":"中等手表","luxury":"名贵手表","star":"超名贵 · 星冕","ultra":"珍稀手表"}[group]
		var tab := UIKit.button(title,"secondary",Vector2(120,46),18)
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
		grid.resized.connect(func(): grid.columns = maxi(1,mini(4,int(grid.size.x/180))))
		for definition in GameData.item_list:
			var category: String = "star" if definition.get("watch",{}).get("brand","")=="星冕" else String(definition.get("tier",""))
			if category != tier: continue
			var id: String = definition.id
			var card := UIKit.button("%s\n参考价 %s Cr" % [definition.name, str(int(definition.value))],"secondary",Vector2(170,178),19)
			card.name = "catalogue_model_"+id
			card.icon = UIKit.item_icon(id)
			card.expand_icon = true
			card.vertical_icon_alignment = VERTICAL_ALIGNMENT_TOP
			card.icon_alignment = HORIZONTAL_ALIGNMENT_CENTER
			card.add_theme_constant_override("icon_max_width",100)
			card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			card.pressed.connect(func():
				saved_scroll[0] = scroll.scroll_vertical
				scroll.remove_child(index)
				navigation.hide()
				scroll.add_child(detail)
				UIKit.clear(reference)
				load("res://scripts/ui/watch_manual.gd").populate_reference(reference,id)
				scroll.scroll_vertical = 0)
			grid.add_child(card)
	# Detached index/detail are explicitly freed with the modal.
	body.tree_exiting.connect(func():
		if is_instance_valid(index) and index.get_parent()==null: index.queue_free()
		if is_instance_valid(detail) and detail.get_parent()==null: detail.queue_free())
