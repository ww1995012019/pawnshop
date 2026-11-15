extends RefCounted
## PC composition uses existing live controls and canonical trade sprites.
static func apply(page) -> void:
 if page.shell.mobile_mode(): return
 page.bubble_rect=Rect2(1000,180,325,235)
 page.counter_table.presentation_rect=Rect2(630,650,690,180)
 page.terminal.position=Vector2(1360,300)
 page.terminal.scale=Vector2(.9,.9)
 page.terminal.size=Vector2(580,370)
 page.terminal.silhouette=null
 page.terminal.add_theme_stylebox_override("panel",UIKit.paper_style(0))
 var content=page.terminal.get_child(0)
 var housing=content.get_child(0)
 housing.hide()
 for control in [page.scr.head,page.scr.price,page.scr.line1,page.scr.line2,page.scr.line3,page.offer_label]:
  control.add_theme_color_override("font_color",UIKit.INK)
 page.offer_label.add_theme_constant_override("shadow_offset_y",0)
 page.scr.head.position=Vector2(24,20)
 page.scr.head.size=Vector2(460,36)
 page.scr.head.add_theme_font_size_override("font_size",24)
 page.scr.price.position=Vector2(380,62)
 page.scr.price.add_theme_font_size_override("font_size",36)
 page.scr.line1.position=Vector2(24,65)
 page.scr.line1.size=Vector2(350,30)
 page.scr.line1.add_theme_font_size_override("font_size",22)
 page.scr.line2.position=Vector2(24,103)
 page.offer_panel.position=Vector2(24,155)
 page.scr.line3.position=Vector2(24,238)
 page.scr.line3.size=Vector2(520,28)
 page.actions.position=Vector2(24,280)
 page.actions.size=Vector2(530,54)
 page.scr.line3.add_theme_stylebox_override("normal",UIKit.box(UIKit.PAPER,Color.TRANSPARENT,0,0,0,0))
 page.crate.position=Vector2(24,680)
 page.crate.size=Vector2(510,306)
 page.crate.add_theme_stylebox_override("panel",UIKit.paper_style(12))
 page.stock_grid.columns=7
 page.display_goods.position=Vector2(30,170)
 page.display_goods.size=Vector2(370,365)
 page.board.position=Vector2(30,20)
 page.status_panel.position=Vector2(1430,8)
 page.status_panel.queue_redraw()
 page.orders_readout.position=Vector2(1400,850)
 page.orders_readout.size=Vector2(220,80)
 page.orders_readout.add_theme_color_override("font_color",UIKit.INK)
 var specs={"report":Rect2(30,1020,225,40),"warehouse":Rect2(610,1020,300,40),"inspect":Rect2(950,1020,180,40),"repair":Rect2(1200,1020,250,40),"orders":Rect2(1390,740,235,100),"people":Rect2(1650,740,230,100),"bell":Rect2(488,610,105,64),"display":Rect2(30,170,370,365)}
 for key in specs:
  var b=page.fixture_buttons[key]
  var rect:Rect2=specs[key]
  b.position=rect.position;b.size=rect.size
  if b.get("caption_region")!=null: b.caption_region=Rect2(Vector2.ZERO,rect.size)
  b.set_meta("comic_key",true)
  if key!="display":
   b.text=(b.caption if b.get("caption")!=null else b.text) if key!="bell" else ""
   for state in ["normal","hover","pressed","disabled"]:
    b.add_theme_stylebox_override(state,UIKit.key_style("secondary",state,true))
   b.add_theme_color_override("font_color",UIKit.INK)
  else: b.hide()
  if key=="bell":
   for state in ["normal","hover","pressed","focus"]: b.add_theme_stylebox_override(state,StyleBoxEmpty.new())
  b.queue_redraw()
 page.fixture_buttons.events.position=Vector2(20,10)
 page.fixture_buttons.events.size=Vector2(320,85)
 page.alarm_button.position=Vector2(310,1020)
 page.alarm_button.size=Vector2(260,40)
 if not page.has_meta("comic_panels"):
  page.set_meta("comic_panels",true)
  for rect in [Rect2(0,0,1920,100),Rect2(0,1010,1920,70),Rect2(1360,130,530,820)]:
   var panel=Panel.new();panel.mouse_filter=Control.MOUSE_FILTER_IGNORE
   panel.position=rect.position;panel.size=rect.size
   panel.add_theme_stylebox_override("panel",UIKit.paper_style(0))
   page.add_child(panel);page.move_child(panel,0)
 page.bubble.add_theme_stylebox_override("panel",UIKit.box(UIKit.PAPER,UIKit.INK,18,2,0,3))
 page.bubble.position=page.bubble_rect.position
 page.bubble.size=page.bubble_rect.size
 page.bubble_label.size.x=301
 page.bubble_name.size.x=301

static func refresh(page) -> void:
 if page.shell.mobile_mode(): return
 page.terminal.visible=not (Game.state.trade==null and page.showroom.details.visible)
 var host=page.find_child("DesktopCounter",true,false)
 if host==null: host=page
 var heading=page.find_child("ComicTradeHeading",true,false)
 if heading==null:
  heading=UIKit.label("来客交易",28,UIKit.INK)
  heading.name="ComicTradeHeading";heading.position=Vector2(1390,155)
  host.add_child(heading)
 var watch=page.find_child("ComicTradeWatch",true,false)
 if watch==null:
  watch=TextureRect.new();watch.name="ComicTradeWatch"
  watch.position=Vector2(1390,205);watch.size=Vector2(120,100)
  watch.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
  watch.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
  watch.mouse_filter=Control.MOUSE_FILTER_IGNORE;host.add_child(watch)
 var it=Model.trade_item(Game.state) if Game.state.trade!=null else null
 watch.texture=UIKit.physical_icon(it) if it!=null else null
 var title=page.find_child("ComicTradeName",true,false)
 if title==null:
  title=UIKit.label("",22,UIKit.INK);title.name="ComicTradeName"
  title.position=Vector2(1490,230);title.size=Vector2(370,35)
  host.add_child(title)
 title.text=""
 heading.text="来客交易"
 if page.find_child("ComicShelfTitle",true,false)==null:
  var shelf=UIKit.label("陈列",24,UIKit.PAPER);shelf.name="ComicShelfTitle"
  shelf.position=Vector2(30,118);shelf.add_theme_color_override("font_color",UIKit.PAPER);host.add_child(shelf)

