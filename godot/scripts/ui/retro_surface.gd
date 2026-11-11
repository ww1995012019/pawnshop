extends StyleBox
## Pixel hardware and document surfaces. Decoration stays inside the existing rim.
var kind := "rail"
var fill := Color("2c3031")
var edge := Color("81705b")
var tint := Color.WHITE
var compact := false
var thin := false

func block(canvas: RID, rect: Rect2, color: Color) -> void:
	if rect.size.x > 0 and rect.size.y > 0:
		RenderingServer.canvas_item_add_rect(canvas, rect, color)

func frame(canvas: RID, rect: Rect2, width: float, color: Color) -> void:
	block(canvas, Rect2(rect.position, Vector2(rect.size.x, width)), color)
	block(canvas, Rect2(rect.position + Vector2(0,rect.size.y-width),Vector2(rect.size.x,width)),color)
	block(canvas, Rect2(rect.position,Vector2(width,rect.size.y)),color)
	block(canvas, Rect2(rect.position + Vector2(rect.size.x-width,0),Vector2(width,rect.size.y)),color)

func _draw(canvas: RID, rect: Rect2) -> void:
	if rect.size.x < 8 or rect.size.y < 8: return
	var paper := kind == "paper"
	var screen := kind == "screen" or kind == "glass"
	var key := kind == "amber" or kind == "graphite"
	var shadow := Color("101515")
	shadow.a = .66
	block(canvas,Rect2(rect.position+Vector2(2,4),rect.size),shadow)
	block(canvas,rect,Color("171b1c")*tint)
	if thin:
		block(canvas,rect.grow(-1),fill*tint)
		frame(canvas,rect.grow(-1),1,edge*tint)
		block(canvas,Rect2(rect.position+Vector2(2,2),Vector2(rect.size.x-4,1)),edge.lightened(.15)*tint)
		return
	frame(canvas,rect.grow(-1),1,edge.darkened(.38)*tint)
	frame(canvas,rect.grow(-2),1,edge*tint)
	var rim := 3.0 if compact or paper else 5.0
	var inner := rect.grow(-rim)
	block(canvas,inner,fill*tint)
	if paper:
		frame(canvas,rect.grow(-2),1,Color("a18c69")*tint)
		block(canvas,Rect2(inner.position,Vector2(inner.size.x,2)),Color("f6edda")*tint)
		# Fine feed perforations belong to the paper edge, away from lettering.
		for x in range(12,int(rect.size.x)-10,12):
			block(canvas,Rect2(rect.position+Vector2(x,4),Vector2(3,1)),Color("b9a989")*tint)
			block(canvas,Rect2(rect.position+Vector2(x,rect.size.y-5),Vector2(3,1)),Color("b9a989")*tint)
		for y in range(10,int(rect.size.y)-8,4):
			var fiber := Color("aa8d61"); fiber.a = .025
			block(canvas,Rect2(inner.position+Vector2(0,y),Vector2(inner.size.x,1)),fiber)
		return
	# A two-tone machined bevel replaces the single flat border.
	block(canvas,Rect2(rect.position+Vector2(3,3),Vector2(rect.size.x-6,2)),edge.lightened(.24)*tint)
	block(canvas,Rect2(rect.position+Vector2(3,5),Vector2(2,rect.size.y-10)),edge*tint)
	block(canvas,Rect2(rect.position+Vector2(4,rect.size.y-5),Vector2(rect.size.x-8,2)),edge.darkened(.6)*tint)
	block(canvas,Rect2(rect.position+Vector2(rect.size.x-5,5),Vector2(2,rect.size.y-9)),Color("141b1b")*tint)
	if screen:
		frame(canvas,inner,2,Color("101f1e")*tint)
		block(canvas,Rect2(inner.position+Vector2(2,2),Vector2(inner.size.x-4,2)),Color("47635c")*tint)
		for y in range(8,int(inner.size.y)-3,4):
			var scan := Color("7ac2ad"); scan.a = .025
			block(canvas,Rect2(inner.position+Vector2(3,y),Vector2(inner.size.x-6,1)),scan)
	else:
		for y in range(9,int(inner.size.y)-4,5):
			var brush := Color("b6b4a1"); brush.a = .018
			block(canvas,Rect2(inner.position+Vector2(1,y),Vector2(inner.size.x-2,1)),brush)
	if kind == "rail":
		# A solid copper top lip remains crisp at narrow phone scale.
		block(canvas,Rect2(rect.position+Vector2(2,2),Vector2(rect.size.x-4,3)),edge*tint)
	if key:
		block(canvas,Rect2(inner.position+Vector2(2,2),Vector2(inner.size.x-4,1)),edge.lightened(.25)*tint)
		# Tiny inset end marks leave the label and icon area untouched.
		for x in [7.0,rect.size.x-9.0]:
			block(canvas,Rect2(rect.position+Vector2(x,rect.size.y*.5-2),Vector2(2,4)),edge.darkened(.25)*tint)
	elif not compact and rect.size.x > 70 and rect.size.y > 55:
		for p in [Vector2(9,9),Vector2(rect.size.x-11,9),Vector2(9,rect.size.y-11),Vector2(rect.size.x-11,rect.size.y-11)]:
			block(canvas,Rect2(rect.position+p,Vector2(4,4)),Color("141918")*tint)
			block(canvas,Rect2(rect.position+p,Vector2(3,2)),edge.lightened(.15)*tint)
			block(canvas,Rect2(rect.position+p+Vector2(1,1),Vector2(2,1)),Color("313a35")*tint)
