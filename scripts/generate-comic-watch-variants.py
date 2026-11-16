#!/usr/bin/env python3
"""Model-specific comic illustrations, composed from the shipped painted donors.

The technical evidence atlas and approved reference painting are never changed.
Run this after revising watch palettes or the comic front/back/shape donors.
"""
from pathlib import Path
import json
import math
import runpy
from PIL import Image, ImageDraw, ImageColor

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'godot/assets/comic'
CELL = (128, 192)
COLUMNS = 8
INK = '#302b29'
LIGHT = '#efdfbb'
SHAPE_COLUMN = {'square': 0, 'octagon': 2, 'oval': 3, 'cushion': 4,
                'tonneau': 5, 'sun': 6, 'crescent': 7}
FRONT_BOUNDS = [(60,144,124,223),(57,144,123,223),(50,140,130,230),(56,141,116,229),
                (43,148,140,216),(53,139,125,232),(39,141,141,229),(43,144,134,224)]
BACK_BOUNDS = [(61,109,123,222),(59,113,123,216),(52,105,129,228),(56,108,116,225),
               (44,114,141,214),(54,107,125,227),(40,108,140,223),(44,110,134,221)]
# Source strap axes, measured independently of right-side crown/crest bounds.
SHAPE_AXES = [116,115,109,109,109,109,109,110]

def rgb(color):
    return ImageColor.getrgb('#' + color.lstrip('#'))

def tint(color, luminance, strength=.65):
    return tuple(max(0,min(255,round(v*(1-strength)+luminance*strength))) for v in rgb(color))

def donor(shape, luxury, back):
    """Fit painted hardware to a common body axis, retaining its natural contour."""
    if shape in SHAPE_COLUMN:
        sheet = Image.open(ASSETS / 'watch_shapes.png').convert('RGBA')
        column = 1 if shape == 'square' and luxury else SHAPE_COLUMN[shape]
        x,y,w,h = (BACK_BOUNDS if back else FRONT_BOUNDS)[column]
        left = round(column*sheet.width/8+x)
        top = round((sheet.height/2 if back else 0)+y)
        crop = sheet.crop((left,top,left+w,top+h))
        axis = SHAPE_AXES[column]-x
    else:
        sheet = Image.open(ASSETS / ('watch_backs.png' if back else 'watch_fronts.png')).convert('RGBA')
        crop = sheet.crop((3*384+70,79,3*384+70+253,79+384))
        axis = 123
    factor = 178/crop.height
    crop = crop.resize((round(crop.width*factor),178),Image.Resampling.LANCZOS)
    # Discard near-transparent matting speckles before they become texture bounds.
    alpha = crop.getchannel('A').point(lambda a: 0 if a < 28 else a)
    crop.putalpha(alpha)
    result = Image.new('RGBA',CELL)
    result.paste(crop,(round(64-axis*factor),7))
    return result

def face_mask(shape, cx, cy, rx, ry):
    mask = Image.new('L',CELL)
    d = ImageDraw.Draw(mask)
    box = (cx-rx,cy-ry,cx+rx,cy+ry)
    if shape in ['square','cushion','tonneau']:
        d.rounded_rectangle(box,radius=3 if shape=='square' else 10,fill=255)
    elif shape=='octagon':
        d.polygon([(cx+math.cos(k*math.pi/4+math.pi/8)*rx,
                    cy+math.sin(k*math.pi/4+math.pi/8)*ry) for k in range(8)],fill=255)
    else:
        d.ellipse(box,fill=255)
    return mask

def render(index, definition, metadata, canonical, back=False):
    template = index if index<15 else canonical['NEW_TEMPLATES'][index-15] if index<33 else metadata['template']
    shape = metadata.get('shape','square' if template==6 else 'round')
    luxury = definition['tier'] in ['luxury','ultra']
    image = donor(shape,luxury,back)
    source = image.copy()
    cx,cy = (81,96) if shape=='crescent' else (64,96)
    rx,ry = {'oval':(25,42),'square':(35,34),'tonneau':(29,40),'cushion':(34,37),
             'octagon':(37,39),'sun':(29,29),'crescent':(27,30)}.get(shape,(40,40))
    mask = face_mask(shape,cx,cy,rx,ry)
    face = metadata['face']
    strap_kind=definition['watch']['strap']
    strap = metadata.get('strap_color',canonical['STRAPCOL'][index] if index<15 else canonical['NEW_STRAPCOL'][index-15] if index<33 else '697673')
    case = metadata.get('case_color','bca267' if luxury else 'b7b9b0')
    for y in range(CELL[1]):
        for x in range(CELL[0]):
            r,g,b,a = source.getpixel((x,y))
            if not a: continue
            lum = r*.299+g*.587+b*.114
            on_strap = y < cy-ry-10 or y > cy+ry+10
            if mask.getpixel((x,y)):
                # Fine painted grain comes from the donor, rather than RNG noise.
                base = case if back else face
                grain = (lum%23-11)*.32
                color = tuple(max(0,min(255,round(v+grain+(y-cy)*.035))) for v in rgb(base))
            elif on_strap and '金属' not in strap_kind and 49<=x<=79:
                # Resurface link seams when the model wears leather/fabric/rubber.
                color=tuple(max(0,min(255,round(v+(lum%17-8)*.35))) for v in rgb(strap))
            elif lum<55:
                color = (r,g,b)
            elif on_strap:
                color = tint(strap,lum,.42)
            else:
                color = tint(case,lum,.55)
            image.putpixel((x,y),(*color,a))
    d=ImageDraw.Draw(image)
    luminance=sum(v*w for v,w in zip(rgb(face),(.299,.587,.114)))
    ink=INK if luminance>145 else LIGHT
    muted=tint(face,100,.45)
    for start,end in [(12,cy-ry-14),(cy+ry+14,178)]:
        if '金属' in strap_kind:
            for y in range(start,end,6): d.line((52,y,76,y),fill=tint(strap,80,.55),width=1)
        elif '胶' in strap_kind:
            for y in range(start,end,5): d.line((55,y,73,y),fill=INK,width=2)
        elif '织' in strap_kind or '布' in strap_kind:
            for x in range(56,75,4):d.line((x,start,x,end),fill=tint(strap,180,.35))
        else:
            for y in range(start,end,5):
                d.line((53,y,53,y+2),fill=LIGHT);d.line((75,y,75,y+2),fill=LIGHT)
    hardware=image.copy()
    style=(index-33)%5 if index>=33 else index%6
    if back:
        # Decorative engine-turning and plate contours contain no authentication facts.
        for radius in range(9,min(rx,ry)-3,6):
            d.ellipse((cx-radius,cy-radius,cx+radius,cy+radius),outline=tint(case,95,.5))
        for k in range(4+style):
            a=k*math.tau/(4+style)
            p=(round(cx+math.cos(a)*(rx-8)),round(cy+math.sin(a)*(ry-8)))
            d.ellipse((p[0]-2,p[1]-2,p[0]+2,p[1]+2),fill=INK)
    else:
        # Large constructions survive 35–50px-high catalogue/warehouse thumbnails.
        if style==0:
            d.arc((cx-rx+7,cy-ry+7,cx+rx-7,cy+ry-7),0,300,fill=ink,width=2)
            d.line((cx-rx+9,cy+12,cx+rx-9,cy+12),fill=muted,width=2)
        elif style==1:
            d.rectangle((cx+5,cy-5,cx+rx-5,cy+7),fill=ink)
            d.rectangle((cx+7,cy-3,cx+rx-7,cy+5),fill=face)
            d.line((cx+11,cy-1,cx+11,cy+3),fill=ink,width=2)
            d.arc((cx-rx+6,cy-ry+6,cx+rx-6,cy+ry-6),15,175,fill=ink,width=1)
        elif style==2:
            d.ellipse((cx-13,cy+4,cx+13,cy+26),fill='#263c50',outline=ink,width=1)
            d.ellipse((cx-7,cy+7,cx+7,cy+21),fill='#e5ca8c')
            d.ellipse((cx-2,cy+4,cx+11,cy+18),fill='#263c50')
        elif style==3:
            for dx,dy in [(-rx*.43,0),(rx*.43,0),(0,ry*.47)]:
                x,y=round(cx+dx),round(cy+dy)
                d.ellipse((x-8,y-7,x+8,y+7),fill=muted,outline=ink)
                d.line((x,y,x+3,y-3),fill=ink,width=1)
        elif style==4:
            for y in range(cy-ry+9,cy+ry-6,7):
                span=rx*.68
                d.line((cx-span,y,cx+span,y),fill=muted,width=2)
            for dx,dy in [(0,-ry+7),(rx-7,0),(0,ry-7),(-rx+7,0)]:
                x,y=cx+dx,cy+dy
                d.polygon([(x,y-4),(x+3,y),(x,y+4),(x-3,y)],fill=ink)
        else:
            for k in range(6):
                a=k*math.pi/3
                d.line((cx,cy,cx+math.cos(a)*(rx-8),cy+math.sin(a)*(ry-8)),fill=muted,width=3)
            d.ellipse((cx-12,cy-12,cx+12,cy+12),outline=ink,width=2)
        for k in range(12):
            a=k*math.pi/6
            p=(cx+math.sin(a)*(rx-4),cy-math.cos(a)*(ry-4))
            q=(cx+math.sin(a)*(rx-8-(2 if k%3==0 else 0)),cy-math.cos(a)*(ry-8-(2 if k%3==0 else 0)))
            d.line((p,q),fill=INK,width=3)
            d.line((p,q),fill=ink,width=1)
        # Model-level hand poses vary independently of the large dial construction.
        for a,length in [(-2.55+(index%5)*.12,.57),(-.65+(index%3)*.16,.76)]:
            end=(round(cx+math.cos(a)*rx*length),round(cy+math.sin(a)*ry*length))
            d.line(((cx,cy),end),fill=INK,width=4)
            d.line(((cx,cy-1),(end[0],end[1]-1)),fill=LIGHT,width=1)
        d.ellipse((cx-2,cy-2,cx+2,cy+2),fill=rgb(case),outline=INK)
    # All newly painted dial details are clipped to their intended face contour.
    # (The original hardware, including crown, remains the untouched silhouette.)
    image=Image.composite(image,hardware,mask)
    alpha=source.getchannel('A')
    image.putalpha(alpha)
    return image

def build():
    definitions=json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs']
    metadata=json.loads((ROOT/'godot/data/watch_art.json').read_text())
    canonical=runpy.run_path(str(ROOT/'scripts/generate-watch-art.py'))
    for back in [False,True]:
        atlas=Image.new('RGBA',(CELL[0]*COLUMNS,CELL[1]*math.ceil(len(definitions)/COLUMNS)))
        for index,definition in enumerate(definitions):
            image=render(index,definition,metadata[definition['id']],canonical,back)
            atlas.paste(image,(index%COLUMNS*CELL[0],index//COLUMNS*CELL[1]))
        atlas.save(ASSETS/('watch_variants_back.png' if back else 'watch_variants_front.png'))

if __name__=='__main__':
    build()
