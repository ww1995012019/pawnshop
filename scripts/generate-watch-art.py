#!/usr/bin/env python3
"""Deterministic, nearest-neighbour pixel watch atlas and shared physical logo glyphs."""
from pathlib import Path
from PIL import Image, ImageDraw
import math,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'godot/assets/atlas'
INK='#252a30'; STEEL='#b6c0c0'; LIGHT='#e2e5d9'; SHADE='#68767d'
FACES=['#ddd9bc','#c7ceca','#273841','#274e68','#1e394b','#253e40','#ddd0aa','#26324f','#3c4648','#3b423b','#34434c','#b1b9a5','#ddd1aa','#c6ac69','#222f35']
STRAPS=['leather','metal','cloth','metal','rubber','cloth','leather','leather','metal','cloth','metal','rubber','leather','leather','metal']
STRAPCOL=['#76543f','#9eabad','#5e695b','#a6b7bb','#273236','#737856','#735244','#513f3a','#9baba9','#77705a','#879496','#3d5150','#66493b','#78513b','#a4aa9c']

def glyph(i,v=0):
    im=Image.new('1',(24,16)); d=ImageDraw.Draw(im)
    def line(p,w=1): d.line(p,fill=1,width=w)
    if i<3:
        if i==2: d.ellipse((3,0,20,15),outline=1)
        pts=[]
        for k in range(10):
            a=-math.pi/2+k*math.pi/5; r=6 if k%2==0 else 2.5
            pts.append((round(12+math.cos(a)*r),round(7+math.sin(a)*r)))
        d.polygon(pts,fill=1)
        if not v: line([(8,15),(16,15)])
        if i==1: line([(19,12),(19,15),(21,15),(21,12)])
    elif i<6:
        for y in [5,10]: line([(2,y+1),(6,y-1),(11,y+1),(16,y-1),(21,y+1)])
        if v: line([(10,6),(12,9)])
        if i==4: d.ellipse((10,0,13,3),fill=1)
        if i==5:
            for x in [7,12,17]: line([(x,13),(x,15)])
    elif i in [6,8]:
        line([(19,5 if not v else 2),(19,14),(4,14),(4,1),(15,1)])
        if v: line([(15,1),(19,1),(19,5)])
        if i==8: line([(11,5),(11,11)])
    elif i==7:
        d.ellipse((5,0,18,14),fill=1); d.ellipse((9,-2,22,11),fill=0)
        d.rectangle((10 if not v else 18,7,11 if not v else 19,8),fill=1)
    elif i<12:
        if i==11: line([(2,1),(21,1),(21,10),(12,15),(2,10),(2,1)])
        line([(3,12),(6,7),(9,12),(12,3 if not v else 8),(16,12),(19,7),(22,12)])
        if i==10: line([(3,15),(21 if not v else 13,15)])
    else:
        if i==14:
            d.ellipse((0,0,23,15),outline=1); d.ellipse((2,1,21,14),outline=1)
        d.ellipse((10,0,14,4),outline=1)
        line([(12,4),(12,12),(8,12),(5,8),(5,11),(8,14),(16,14),(19,11),(19,8),(16,12),(12,12)])
        line([(7,6),(17 if not v else 14,6)])
        if i==13:
            # Compress the anchor above its engraved four-digit anniversary.
            im=im.resize((24,12),Image.Resampling.NEAREST)
            field=Image.new('1',(24,16));field.paste(im,(0,0));im=field;d=ImageDraw.Draw(im)
            digits=['010111010010111','111101111001111','111101111101111','101101111001001' if not v else '101101110001001']
            for n,bits in enumerate(digits):
                for pos,bit in enumerate(bits):
                    if bit=='1': d.point((4+n*4+pos%3,11+pos//3),fill=1)
    return [[x,y] for y in range(16) for x in range(24) if im.getpixel((x,y))]

def watch(i,back=False):
    im=Image.new('RGBA',(128,128)); d=ImageDraw.Draw(im)
    def rect(box,c,outline=None,w=1): d.rectangle(box,fill=c,outline=outline,width=w)
    def ellipse(box,c,outline=None,w=1): d.ellipse(box,fill=c,outline=outline,width=w)
    st=STRAPS[i]; col=STRAPCOL[i]; gold=i==13; case='#bda064' if gold else STEEL
    left,right=(48,80) if i not in [4,10,14] else (45,83)
    rect((left,9,right,119),INK); rect((left+2,10,right-2,117),col)
    rect((left+3,11,left+5,116),'#c0b697' if st=='leather' else '#697673')
    if st=='metal':
        for y in range(13,119,6):
            rect((left+2,y,right-2,y+1),SHADE); rect((57,y+2,70,y+4),LIGHT)
    elif st=='cloth':
        for x in range(left+7,right-3,4): rect((x,12,x,116),'#92917a')
        for y in range(14,118,5): d.point((left+3,y),fill='#b9ae89'); d.point((right-3,y),fill='#b9ae89')
    elif st=='rubber':
        for y in range(12,118,7): rect((left+4,y,right-4,y+2),'#18292e')
    else:
        for y in range(14,118,5):
            d.point((left+4,y),fill='#c0a77a'); d.point((right-4,y),fill='#c0a77a')
        for y in range(94,116,7): rect((63,y,65,y+2),INK)
    rect((left,14,right,20),SHADE,INK); rect((left+3,15,right-3,18),case)
    # Lugs keep the strap joined to the solid case silhouette.
    rect((43,29,85,99),INK); rect((46,30,82,97),case)
    r=[31,33,32,34,37,34,31,34,35,34,37,32,29,32,38][i]
    box=(64-r,64-r,64+r,64+r)
    square=i==6
    drawshape=rect if square else ellipse
    drawshape(box,INK); drawshape((box[0]+2,box[1]+2,box[2]-2,box[3]-2),SHADE)
    drawshape((box[0]+3,box[1]+3,box[2]-4,box[3]-4),case)
    # Crown, plus chronograph pushers.
    rect((64+r-1,59,64+r+6,68),INK); rect((64+r,60,64+r+5,66),case)
    for y in range(61,67,2): rect((64+r+2,y,64+r+5,y),SHADE)
    if i==10:
        for y in [44,79]: rect((99,y,104,y+6),INK); rect((100,y+1,103,y+4),case)
    if back:
        drawshape((64-r+7,64-r+7,64+r-7,64+r-7),'#7c8987',INK)
        drawshape((64-r+10,64-r+10,64+r-10,64+r-10),'#a1aaa0',SHADE)
        if i==8:
            ellipse((44,44,84,84),'#303b3c',INK)
            for x,y in [(54,58),(69,69),(71,52)]:
                ellipse((x-6,y-6,x+6,y+6),'#a29162',INK); ellipse((x-2,y-2,x+2,y+2),SHADE)
        else:
            for y in [64,68,78]: rect((49,y,79-(i%3)*3,y),SHADE)
            # Model-specific manufacture marks, engraved and never UV serial text.
            for n in range(i+1): rect((49+n%8*4,83+n//8*4,50+n%8*4,84+n//8*4),SHADE)
        for a in [45,135,225,315]:
            x=round(64+math.cos(math.radians(a))*(r-6)); y=round(64+math.sin(math.radians(a))*(r-6))
            ellipse((x-2,y-2,x+2,y+2),INK); d.line((x-1,y,x+1,y),fill=LIGHT)
        logo_col=INK
    else:
        dial=r-7
        drawshape((64-dial,64-dial,64+dial,64+dial),FACES[i],INK)
        tick=LIGHT if i in [2,3,4,5,7,8,9,10,14] else SHADE
        for h in range(12):
            a=h*math.pi/6; rr=dial-3
            x=round(64+math.sin(a)*rr);y=round(64-math.cos(a)*rr)
            rect((x-1,y-1,x+1,y+1),tick)
        if i==4:
            for h in range(12):
                a=h*math.pi/6; x=round(64+math.sin(a)*(r-4));y=round(64-math.cos(a)*(r-4));rect((x,y,x+1,y+1),INK)
        if i in [2,10]:
            for x in [51,77]: ellipse((x-7,64,x+7,78),SHADE,INK); d.line((x,71,x+3,68),fill=LIGHT)
        if i==7:
            ellipse((54,73,74,88),'#142332',SHADE); ellipse((62,75,70,83),'#d5c997'); ellipse((65,73,72,80),'#142332')
        if i==8:
            for x,y in [(51,69),(75,75),(64,83)]: ellipse((x-7,y-7,x+7,y+7),'#a58d56',INK);ellipse((x-3,y-3,x+3,y+3),SHADE)
        if i==1: rect((76,62,87,71),LIGHT,INK); d.text((78,62),'2',fill=INK)
        d.line((64,67,53,62),fill=INK,width=3); d.line((64,67,75,77),fill=INK,width=3)
        d.line((64,67,54,61),fill=LIGHT);d.line((64,67,76,77),fill=LIGHT)
        ellipse((62,65,66,69),'#b19b66',INK)
        logo_col=LIGHT if i in [2,3,4,5,7,8,9,10,14] else INK
    # Exact pixel glyph shared with runtime and manual. Clean solid field behind it.
    bg='#a1aaa0' if back else FACES[i]
    rect((52,44,75,59),bg)
    for x,y in glyph(i): d.point((52+x,44+y),fill=logo_col)
    if i==1 and not back:
        # Tiny but real model lettering immediately above the calendar aperture.
        for n,bits in enumerate(['101111111101101','111101101101111','111001111100111']):
            for pos,bit in enumerate(bits):
                if bit=='1': d.point((76+n*4+pos%3,55+pos//3),fill=INK)
    return im.resize((256,256),Image.Resampling.NEAREST)

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    for side in ['front','back']:
        atlas=Image.new('RGBA',(1280,768))
        for i in range(15): atlas.paste(watch(i,side=='back'),(i%5*256,i//5*256))
        atlas.save(OUT/f'watches-{side}.png')
        normal=Image.new('RGBA',atlas.size,(128,128,255,0)); normal.putalpha(atlas.getchannel('A'));normal.save(OUT/f'watches-{side}_n.png')
    payload={f'WCH-{i+1:03}':{'face':FACES[i],'ink':('#e2e5d9' if i in [2,3,4,5,7,8,9,10,14] else INK),'pixels':[glyph(i),glyph(i,1)]} for i in range(15)}
    (ROOT/'godot/data/watch_art.json').write_text(json.dumps(payload,separators=(',',':'))+'\n')
if __name__=='__main__': main()
