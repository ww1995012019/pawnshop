"""Import original generated shop masters into a common crisp pixel scale.
Source crops are asset import operations; source masters remain unchanged.
"""
from pathlib import Path
from PIL import Image
from portrait_import import connected_portrait
import json

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'art-source/shop-v3'
ASSETS = ROOT / 'godot/assets'


def pack_icons(filename, columns, rows, count, cell, max_logical, multiplier, target):
    source = Image.open(SOURCE / filename).convert('RGBA')
    atlas = Image.new('RGBA', (columns*cell, rows*cell))
    for index in range(count):
        col, row = index % columns, index // columns
        crop = source.crop((round(col*source.width/columns), round(row*source.height/rows), round((col+1)*source.width/columns), round((row+1)*source.height/rows)))
        crop.putalpha(crop.getchannel('A').point(lambda a: 255 if a >= 160 else 0))
        bounds = crop.getchannel('A').getbbox()
        if not bounds: raise ValueError(f'Empty icon {filename} {index}')
        crop = crop.crop(bounds)
        crop.thumbnail((max_logical,max_logical), Image.Resampling.LANCZOS)
        crop.putalpha(crop.getchannel('A').point(lambda a: 255 if a >= 128 else 0))
        crop = crop.resize((crop.width*multiplier,crop.height*multiplier), Image.Resampling.NEAREST)
        atlas.alpha_composite(crop, (col*cell+(cell-crop.width)//2,row*cell+(cell-crop.height)//2))
    atlas.save(ASSETS / target)



def extract_service_bell(shop):
    """Lift the original bell at its native 4px scale; restore table beneath it.

    The fixed crop belongs to this scene master. Its brass/red pixels identify
    the silhouette; a one-logical-pixel border retains its dark painted edges.
    Adjacent pixels on the same tabletop row supply the hidden resting surface.
    Compositing the sprite at rest reconstructs the original scene exactly.
    """
    logical = shop.resize((480, 270), Image.Resampling.NEAREST)
    box = (122, 144, 150, 165)
    crop = logical.crop(box).convert('RGBA')
    subject = set()
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b, _ = crop.getpixel((x, y))
            if r >= g:
                subject.add((x, y))
    silhouette = {(x+dx,y+dy) for x,y in subject
                  for dx in (-1,0,1) for dy in (-1,0,1)
                  if 0 <= x+dx < crop.width and 0 <= y+dy < crop.height}
    mask = Image.new('L', crop.size)
    for x,y in silhouette:
        mask.putpixel((x,y), 255)
        logical.putpixel((box[0]+x,box[1]+y), logical.getpixel((box[0]+x+32,box[1]+y)))
    crop.putalpha(mask)
    crop.resize((112,84), Image.Resampling.NEAREST).save(ASSETS / 'scene/service_bell.png')
    return logical.resize(shop.size, Image.Resampling.NEAREST)


def main():
    shop = Image.open(SOURCE / 'shop-master.png').convert('RGB')
    shop = shop.resize((480, 270), Image.Resampling.BOX).resize((1920, 1080), Image.Resampling.NEAREST)
    shop = extract_service_bell(shop)
    shop.resize((480,270),Image.Resampling.NEAREST).save(ASSETS / 'scene/shop_pixel.png')
    source = Image.open(SOURCE / 'residents-master.png').convert('RGBA')
    atlas = Image.new('RGBA', (768, 768))
    manifest = []
    for index in range(9):
        col, row = index % 3, index // 3
        crop = source.crop((round(col * source.width / 3), round(row * source.height / 3), round((col+1) * source.width / 3), round((row+1) * source.height / 3)))
        alpha = crop.getchannel('A').point(lambda p: 255 if p >= 160 else 0)
        crop.putalpha(alpha)
        crop = connected_portrait(crop)
        bounds = crop.getchannel("A").getbbox()
        if not bounds:
            raise ValueError(f'empty resident {index}')
        crop = crop.crop(bounds)
        crop.thumbnail((116, 116), Image.Resampling.LANCZOS)
        # Hard alpha and a shared 2x logical pixel scale give clean silhouettes.
        crop.putalpha(crop.getchannel('A').point(lambda p: 255 if p >= 128 else 0))
        crop = connected_portrait(crop)
        crop = crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.NEAREST)
        x, y = col*256 + (256-crop.width)//2, row*256 + 248-crop.height
        atlas.alpha_composite(crop, (x, y))
        manifest.append({'npc': f'CHR-{index+1:03}', 'cell':index, 'size':list(crop.size)})
    atlas.save(ASSETS / 'atlas/shop-residents.png')
    normal = Image.new('RGBA', atlas.size, (128,128,255,255))
    normal.putalpha(atlas.getchannel('A'))
    normal.save(ASSETS / 'atlas/shop-residents_n.png')
    (SOURCE / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    pack_icons('hud-master.png',8,4,28,128,26,4,'ui/orbital-hud.png')
    pack_icons('tools-master.png',3,2,6,512,112,4,'atlas/orbital-tools.png')
    console = Image.open(SOURCE / 'quotation-master.png').convert('RGBA')
    console = console.resize((290,168),Image.Resampling.BOX)
    console.putalpha(console.getchannel('A').point(lambda a: 255 if a >= 128 else 0))
    console.save(ASSETS / 'ui/quotation-console.png')
    wall = Image.open(SOURCE / 'wall-extension-master.png').convert('RGB')
    wall.resize((270,270),Image.Resampling.BOX).save(ASSETS / 'scene/shop_side_wall.png')
    print('Imported pixel shop, residents, interface art, countertop machine and side walls')

if __name__ == '__main__':
    main()
