"""Check logical atlas pixels against the authored watch generator."""
import importlib.util
import json
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('watch_art', ROOT / 'scripts/generate-watch-art.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
definitions = json.loads((ROOT / 'godot/data/game_data.json').read_text())['itemDefs']
for side in ('front', 'back'):
    atlas = Image.open(ROOT / f'godot/assets/atlas/watches-{side}.png').convert('RGBA')
    assert atlas.size == (640, 2048), f'{side}: atlas must use logical pixels'
    for i, definition in enumerate(definitions):
        x, y = i % 5 * 128, i // 5 * 128
        cell = atlas.crop((x,y,x+128,y+128)).resize((256,256),Image.Resampling.NEAREST)
        expected = module.watch(i, side == 'back', definition.get('tier') in ['luxury','ultra'])
        assert cell.tobytes() == expected.tobytes(), f'{side}: changed authored pixels for {definition["id"]}'
print('PASS: 156 watch faces preserve authored pixels at one quarter texture area')

for name, expected in [('scene/shop_pixel.png',(480,270)),('scene/shop_side_wall.png',(270,270)),('ui/quotation-console.png',(290,168))]:
    assert Image.open(ROOT / 'godot/assets' / name).size == expected, name + ': remove duplicated display pixels'
