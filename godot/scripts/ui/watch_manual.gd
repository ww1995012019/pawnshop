extends RefCounted
## Reference only: opening or changing pages never inspects the player's lot.

static func open(shell: Node, def_id := "") -> void:
	var sheet: Array = shell.modal("手表检验说明书", 1000)
	var body: VBoxContainer = sheet[0]
	var picker := OptionButton.new()
	picker.name = "manual_model"
	picker.custom_minimum_size = Vector2(0, 50)
	picker.add_theme_font_size_override("font_size", 20)
	var selected := 1
	for tier in ["low", "mid", "luxury"]:
		var label: String = {"low": "低等", "mid": "中等", "luxury": "名贵"}[tier]
		picker.add_separator(label)
		for definition in GameData.item_list:
			if definition.get("tier", "") != tier: continue
			picker.add_item("%s · %s" % [label, definition.name])
			var index := picker.item_count - 1
			picker.set_item_metadata(index, definition.id)
			if definition.id == def_id: selected = index
	picker.select(selected)
	body.add_child(picker)
	var scroll := ScrollContainer.new()
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	scroll.custom_minimum_size = Vector2(0, minf(500, shell.get_viewport().get_visible_rect().size.y - 230))
	scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.follow_focus = true
	body.add_child(scroll)
	var content := UIKit.vbox(12)
	content.name = "manual_reference"
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(content)
	var show := func(index: int) -> void:
		UIKit.clear(content)
		var id: String = picker.get_item_metadata(index)
		var d: Dictionary = GameData.def(id)
		var reference: Dictionary = WatchRules.model_reference(id)
		content.add_child(UIKit.module_header(d.name, "型号参考档案 · 对照实物逐项查阅", String(reference.get("model", "型号参考"))))
		content.add_child(UIKit.label("型号档次：%s · 档次仅指型号行情，不代表本件真伪或品相。" % GameData.tier_label(id), 17, UIKit.RUST, false, true))
		var art_card := UIKit.plate(UIKit.paper_style(12))
		var art_body := UIKit.vbox(8)
		art_card.add_child(art_body)
		art_body.add_child(UIKit.label("01 / 外观与标识图样", 18, UIKit.RUST))
		var art_row := HFlowContainer.new()
		art_row.add_theme_constant_override("h_separation", 16)
		art_row.add_theme_constant_override("v_separation", 10)
		art_row.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		for back in [false, true]:
			var figure := UIKit.vbox(4)
			var image := TextureRect.new()
			image.texture = UIKit.item_icon(id, back)
			image.custom_minimum_size = Vector2(140, 170)
			image.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			image.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			figure.add_child(image)
			var caption := UIKit.label("背面参考" if back else "正面参考", 16, UIKit.INK)
			caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			figure.add_child(caption)
			art_row.add_child(figure)
		var logo_figure := UIKit.vbox(4)
		var logo = load("res://scripts/world/watch_logo.gd").new()
		logo.setup(id, 0)
		logo.custom_minimum_size = Vector2(144, 154)
		var logo_mount := UIKit.plate(UIKit.screen_style(8))
		logo_mount.add_child(logo)
		logo_figure.add_child(logo_mount)
		var logo_caption := UIKit.label("标准 logo", 16, UIKit.INK)
		logo_caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		logo_figure.add_child(logo_caption)
		art_row.add_child(logo_figure)
		art_body.add_child(art_row)
		art_body.add_child(UIKit.label("标准 logo：%s" % reference.get("logo", "按型号图样对照"), 18, UIKit.INK, false, true))
		if reference.get("logo_exception", "") != "":
			art_body.add_child(UIKit.label("正规变体：%s" % reference.logo_exception, 18, UIKit.INK, false, true))
		content.add_child(art_card)
		content.add_child(UIKit.record_card("编号规则", "%s\n紫外编号位置：%s" % [reference.get("serial_format", "%s 四位批次 六位流水号" % reference.get("serial_prefix", "")), reference.get("serial_location", "后盖内侧标记区；翻到背面，用紫外灯照亮。")], "02 / 紫外编号"))
		var mass_text := "完整重量：%.1f ± %.1f g\n标准配置：%s" % [float(reference.get("nominal_mass", 0)), float(reference.get("tolerance", 1)), reference.get("configuration", reference.get("strap", "原装表带"))]
		if float(reference.get("link_mass", 0)) > 0:
			mass_text += "\n每节可拆表节：%.1f g；按实际表节数量修正完整重量，调短表带不等于内部缺件。" % float(reference.link_mass)
		content.add_child(UIKit.record_card("重量与配置", mass_text, "03 / 称重参考"))
		content.add_child(UIKit.note_card("对照提示", "• 放大镜比较图形、字形与刻印位置，磨损可能遮住细节。\n• 紫外编号要核对品牌和型号码。规则符合也可能是复制号；编号异常也可能来自更换后盖。\n• 偏轻可能是缺件、少表节或替换机芯；重量正常仍可能是仿品或配重。三项结果要结合判断。"))
		content.add_child(UIKit.record_card("完好品参考行情", "%d–%d Cr。此区间只供查阅，不是当前实物的检测定价。" % [roundi(float(d.value) * 0.8), roundi(float(d.value) * 1.2)], "附录 / 行情摘录"))
		content.add_child(UIKit.note_card("手册范围", "本手册不验证走时精度、防水性能或所有内部故障。查看手册不消耗行动点，也不会自动告诉来客你的检验结果。"))
		scroll.scroll_vertical = 0
	picker.item_selected.connect(show)
	show.call(selected)
