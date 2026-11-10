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

# Each additional model keeps its own palette and silhouette; old 15 cells stay unchanged.
NEW_TEMPLATES=[0,6,2,9,1,3,6,3,7,10,11,8,12,14,7,13,10,8]
NEW_FACES=['#eee0c0','#d7d5b9','#8eaaa4','#d4c3a4','#bacbd0','#7e9288',
           '#d0d9d3','#304c62','#bfc7df','#486d68','#b4c3b1','#435064',
           '#e4dec9','#263c58','#b9b5d3','#d1b86c','#304840','#bcb09a']
NEW_STRAPCOL=['#8b694b','#655442','#737b63','#827c60','#a7b2af','#9eaaa6',
              '#585060','#a4b4bf','#48536c','#96a9a0','#465d53','#a6a8b6',
              '#54463e','#c4b87e','#473a57','#6b4939','#b4bba7','#c3b591']

def glyph(i,v=0):
    if i>=33: return expanded_glyph(i,v)
    im=Image.new('1',(24,16)); d=ImageDraw.Draw(im)
    def line(p,w=1): d.line(p,fill=1,width=w)
    if i>=15:
        family=(i-15)//6; marks=(i-15)%6+1
        if family==0:
            d.arc((3,1,15,13),180,360,fill=1)
            line([(2,8),(16,8)])
            line([(9,0),(9,2)])
        elif family==1:
            for y in [4,10]: line([(2,y+1),(5,y-1),(9,y+1),(12,y-1),(16,y+1)])
        else:
            line([(2,5),(5,8),(9,1),(13,8),(16,5),(14,12),(4,12),(2,5)])
            line([(4,14),(14,14)])
        for mark in range(marks-(1 if v else 0)):
            line([(20,1+mark*2),(22,1+mark*2)])
    elif i<3:
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

def crest():
    """A small model-tier ornament, independent of authentic/altered brand marks."""
    im=Image.new('1',(16,16)); d=ImageDraw.Draw(im)
    d.polygon([(2,5),(5,8),(8,3),(11,8),(14,5),(12,12),(4,12)],fill=1)
    d.line([(4,14),(12,14)],fill=1)
    d.polygon([(8,0),(10,2),(8,4),(6,2)],fill=1)
    for x in [0,15]:
        for y in [8,11,14]: d.point((x,y),fill=1)
    return [[x,y] for y in range(16) for x in range(16) if im.getpixel((x,y))]

def watch(i,back=False,luxury=False):
    if i>=33: return expanded_watch(i,back,luxury)
    model_index=i
    if i>=15:
        extra=i-15; i=NEW_TEMPLATES[extra]
        face=NEW_FACES[extra]; col=NEW_STRAPCOL[extra]
    else:
        face=FACES[i]; col=STRAPCOL[i]
    im=Image.new('RGBA',(128,128)); d=ImageDraw.Draw(im)
    def rect(box,c,outline=None,w=1): d.rectangle(box,fill=c,outline=outline,width=w)
    def ellipse(box,c,outline=None,w=1): d.ellipse(box,fill=c,outline=outline,width=w)
    st=STRAPS[i]; gold=i==13 or luxury; case='#bda064' if gold else STEEL
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
            for n in range(model_index+1): rect((49+n%8*4,83+n//8*4,50+n%8*4,84+n//8*4),SHADE)
        for a in [45,135,225,315]:
            x=round(64+math.cos(math.radians(a))*(r-6)); y=round(64+math.sin(math.radians(a))*(r-6))
            ellipse((x-2,y-2,x+2,y+2),INK); d.line((x-1,y,x+1,y),fill=LIGHT)
        logo_col=INK
    else:
        dial=r-7
        drawshape((64-dial,64-dial,64+dial,64+dial),face,INK)
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
    bg='#a1aaa0' if back else face
    rect((52,44,75,59),bg)
    for x,y in glyph(model_index): d.point((52+x,44+y),fill=logo_col)
    if model_index==1 and not back:
        # Tiny but real model lettering immediately above the calendar aperture.
        for n,bits in enumerate(['101111111101101','111101101101111','111001111100111']):
            for pos,bit in enumerate(bits):
                if bit=='1': d.point((76+n*4+pos%3,55+pos//3),fill=INK)
    if luxury:
        rect((54,98,73,118),INK)
        rect((55,99,72,117),'#514735','#ad9156')
        for x,y in crest(): d.point((56+x,100+y),fill='#e4c375')
    return im.resize((256,256),Image.Resampling.NEAREST)

# New families are authored independently; the shipped renderer below is untouched.
EXPANDED_FACES=['#d9dfba','#b9c3c4','#d1c7a2','#d7d2b6','#c1c9bb', '#a0b9c8','#8b9d9e','#495662','#c0b99f','#697c82', '#bdc7b4','#ddbd85','#aec8cc','#344c64','#697774', '#e3d9b7','#a2bcb5','#334e62','#c6bd93','#719a97', '#cbdbe1','#adb7ca','#bfc5ac','#415b6e','#b6d1cb', '#2a495c','#34576a','#223d56','#59788b','#172e43', '#dbb875','#c5aa89','#35484e','#cfc0a6','#69544c', '#e2c390','#8d5968','#d2dbda','#263b52','#426777', '#e6b866','#629eaa','#263b63','#892f3d','#292d43']
EXPANDED_STRAPS=['#68714e','#a1a79d','#7d7358','#8c9a9d','#394a44', '#71615a','#9aa4ad','#66676e','#a5aca8','#343a43', '#71533c','#aaa38b','#7d8e85','#a8b6b4','#33434e', '#795a41','#afb5a5','#687b76','#b4bba5','#3c5c5c', '#565775','#bbc5d1','#697487','#a5adb9','#3e4a65', '#384858','#8198a6','#334557','#7c9aa0','#1d354a', '#71533e','#c1aa75','#645c50','#c6ba99','#544031', '#8b5c3e','#b9a69d','#697d83','#9babbc','#36585e', '#513b2c','#8abbb4','#3b496d','#9e6671','#4b4f65']
CASE_COLORS=['#a9b3a0','#9dabb5','#b4a78c','#c6c2a5','#b9c8d6','#809da7','#d0b06c','#d4c0a2','#e6be76']

def expanded_metadata(i):
    n=i-33; family=n//5; model=n%5
    shape=['round','square','round','octagon','oval','cushion','tonneau','octagon','sun'][family]
    if family==8: shape=['sun','oval','octagon','cushion','crescent'][model]
    return {'face':EXPANDED_FACES[n], 'ink':LIGHT if family in [5,7,8] and not (family==8 and model<2) else INK,
            'strap':['leather','metal','cloth','metal','rubber'][model], 'strap_color':EXPANDED_STRAPS[n][1:],
            'case_color':(['#e6be76','#bbded2','#b4c6e4','#ca7984','#adb6d2'][model] if family==8 else CASE_COLORS[family])[1:],
            'shape':shape,'template':6 if shape=='square' else [0,1,9,10,4][model], 'animation':model+1 if family==8 else 0}

def expanded_glyph(i,v):
    family=(i-33)//5; marks=(i-33)%5+1
    im=Image.new('1',(24,16)); d=ImageDraw.Draw(im)
    def line(p):d.line(p,fill=1,width=1)
    if family==0:
        for x in [5,10,15]:line([(10,13),(x,3),(x-2,1)])
        line([(3,14),(17,14)])
    elif family==1:line([(2,12),(6,3),(10,9),(13,1),(17,12),(2,12)])
    elif family==2:
        line([(9,1),(16,7),(9,12),(2,7),(9,1)]);line([(9,12),(9,14),(3,14),(16,14)])
    elif family==3:
        d.arc((2,1,16,14),180,360,fill=1);line([(9,2),(9,14)]);line([(2,8),(16,8)])
    elif family==4:
        d.ellipse((2,1,16,13),outline=1);d.ellipse((5,4,13,10),outline=1);line([(3,15),(16,15)])
    elif family==5:
        for y in [3,7,11]:line([(2,y+1),(6,y-1),(10,y+1),(14,y-1),(17,y+1)])
        line([(18,1),(18,14)])
    elif family==6:
        d.polygon([(9,0),(11,5),(17,7),(11,9),(9,14),(7,9),(1,7),(7,5)],outline=1);line([(3,15),(16,15)])
    elif family==7:
        line([(6,1),(13,1),(17,7),(13,13),(6,13),(2,7),(6,1)]);line([(3,15),(16,15)])
    else:
        d.arc((1,1,17,15),180,360,fill=1);line([(1,9),(17,9)])
        d.polygon([(9,3),(10,6),(13,7),(10,8),(9,11),(8,8),(5,7),(8,6)],fill=1)
    for mark in range(marks-v):line([(20,1+mark*2),(22,1+mark*2)])
    return [[x,y] for y in range(16) for x in range(24) if im.getpixel((x,y))]

def expanded_watch(i,back,luxury):
    m=expanded_metadata(i); n=i-33; f=n//5; v=n%5
    im=Image.new('RGBA',(128,128));d=ImageDraw.Draw(im)
    strap=m['strap'];left,right=(47-v%2*2,81+v%2*2)
    d.rectangle((left,7,right,120),fill=INK);d.rectangle((left+2,9,right-2,118),fill='#'+m['strap_color'])
    for y in range(12,119,5):
        if strap=='metal':d.line((left+2,y,right-2,y),fill=SHADE);d.line((58,y+1,70,y+1),fill=LIGHT)
        elif strap=='rubber':d.line((left+4,y,right-4,y),fill=INK,width=2)
        elif strap=='cloth':
            for x in range(left+4,right-3,4):d.point((x,y),fill=LIGHT)
        else:d.point((left+3,y),fill=LIGHT);d.point((right-3,y),fill=LIGHT)
    d.rectangle((45,28,83,100),fill=INK);d.rectangle((48,29,80,99),fill='#'+m['case_color'])
    shape=m['shape'];radius=32+v%3
    def shell(inset,color):
        l,t,r,b=64-radius+inset,64-radius+inset,64+radius-inset,64+radius-inset
        if shape=='square':d.rectangle((l,t,r,b),fill=color)
        elif shape in ['octagon','sun']:
            pts=[(round(64+math.cos(k*math.pi/(8 if shape=='sun' else 4))*(radius-inset)*(0.88 if shape=='sun' and k%2 else 1)),round(64+math.sin(k*math.pi/(8 if shape=='sun' else 4))*(radius-inset)*(0.88 if shape=='sun' and k%2 else 1))) for k in range(16 if shape=='sun' else 8)]
            d.polygon(pts,fill=color)
        elif shape=='tonneau':d.polygon([(l+7,t),(r-7,t),(r,t+15),(r,b-15),(r-7,b),(l+7,b),(l,b-15),(l,t+15)],fill=color)
        elif shape=='cushion':d.rounded_rectangle((l,t,r,b),radius=12,fill=color)
        elif shape=='oval':d.ellipse((l+5,t-3,r-5,b+3),fill=color)
        elif shape=='crescent':d.ellipse((l-3,t,r+3,b),fill=color)
        else:d.ellipse((l,t,r,b),fill=color)
    shell(0,INK);shell(2,SHADE);shell(3,'#'+m['case_color']);shell(7,'#94a3a4' if back else m['face'])
    d.rectangle((95,59,102,68),fill=INK);d.rectangle((96,60,101,66),fill='#'+m['case_color'])
    if back:
        for a in [45,135,225,315]:
            x=round(64+math.cos(math.radians(a))*24);y=round(64+math.sin(math.radians(a))*24)
            d.ellipse((x-2,y-2,x+2,y+2),fill=INK);d.line((x-1,y,x+1,y),fill=LIGHT)
        # Fixed-size 6x4 manufacturing code stays inside the back plate.
        for bit in range(12):
            if (i+1)&(1<<bit):d.rectangle((51+bit%6*4,77+bit//6*4,52+bit%6*4,78+bit//6*4),fill=SHADE)
        d.line((52,69,76,69),fill=SHADE)
    else:
        for h in range(12):
            a=h*math.pi/6;x=round(64+math.sin(a)*23);y=round(64-math.cos(a)*23)
            d.rectangle((x,y,x+1,y+1),fill=m['ink'])
        # Each family carries a different dial construction below the mark.
        if f in [0,3]:d.line((46,79,82,79),fill=SHADE);d.line((49,82,79,82),fill=SHADE)
        elif f in [1,4]:d.rectangle((53,73,75,82),outline=SHADE);d.line((64,73,64,82),fill=SHADE)
        elif f in [2,5]:
            for x in [52,76]:d.ellipse((x-5,68,x+5,78),outline=SHADE)
        elif f==6:d.arc((47,66,81,88),0,180,fill='#f5d99b',width=2)
        elif f==7:
            for x in range(49,80,4):d.line((x,64,x,82),fill=SHADE)
        elif v==0:
            d.ellipse((47,64,81,88),outline='#f4d78d',width=2);d.ellipse((59,70,69,80),fill='#f4d78d')
        elif v==1:
            for y in range(66,85,4):d.line((45,y,56,y-2,70,y+1,82,y-4),fill=['#91e0cf','#9bb8df','#c0a7d8'][y%3],width=2)
        elif v==2:
            for r in [8,14]:d.ellipse((64-r,76-r,64+r,76+r),outline='#a9c6f1')
            d.line((48,76,80,76),fill='#baab79');d.line((64,62,64,89),fill='#baab79')
        elif v==3:
            for k in range(9):
                a=k*math.pi/8;d.line((64,77,round(64+math.cos(a)*21),round(77-math.sin(a)*15)),fill='#ec9e72')
        else:
            d.ellipse((50,65,78,88),fill='#c7d2ed');d.ellipse((56,62,82,83),fill=m['face'])
        d.line((64,68,53-v,64),fill=INK,width=3);d.line((64,68,75,80-v),fill=INK,width=3)
        d.line((64,68,53-v,63),fill=LIGHT);d.line((64,68,75,79-v),fill=LIGHT)
        d.ellipse((62,66,66,70),fill='#'+m['case_color'],outline=INK)
    d.rectangle((52,44,75,59),fill='#94a3a4' if back else m['face'])
    for x,y in glyph(i):d.point((52+x,44+y),fill=INK if back else m['ink'])
    if luxury:
        d.rectangle((54,99,73,117),fill=INK);d.rectangle((55,100,72,116),fill='#514735')
        for x,y in crest():d.point((56+x,100+y),fill='#e4c375')
    return im.resize((256,256),Image.Resampling.NEAREST)

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    definitions=json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs']
    count=len(definitions); rows=math.ceil(count/5)
    for side in ['front','back']:
        atlas=Image.new('RGBA',(1280,rows*256))
        for i in range(count): atlas.paste(watch(i,side=='back',definitions[i].get('tier') in ['luxury','ultra']),(i%5*256,i//5*256))
        atlas.save(OUT/f'watches-{side}.png')
        normal=Image.new('RGBA',atlas.size,(128,128,255,0)); normal.putalpha(atlas.getchannel('A'));normal.save(OUT/f'watches-{side}_n.png')
    payload={}
    for i,definition in enumerate(definitions):
        meta=expanded_metadata(i) if i>=33 else {'face':FACES[i] if i<15 else NEW_FACES[i-15], 'ink':LIGHT if (i if i<15 else NEW_TEMPLATES[i-15]) in [2,3,4,5,7,8,9,10,14] else INK}
        meta.update(pixels=[glyph(i),glyph(i,1)],crest=crest() if definition.get('tier') in ['luxury','ultra'] else [])
        payload[definition['id']]=meta
    (ROOT/'godot/data/watch_art.json').write_text(json.dumps(payload,separators=(',',':'))+'\n')
if __name__=='__main__': main()
