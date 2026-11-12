#!/usr/bin/env python3
"""Exercise the deterministic renderer and preserve shipped physical evidence."""
import hashlib, importlib.util, json, unittest
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('watch_art',ROOT/'scripts/generate-watch-art.py')
art=importlib.util.module_from_spec(spec);spec.loader.exec_module(art)
class WatchExpansionArt(unittest.TestCase):
 def test_shipped_models_and_crops_survive(self):
  data=json.loads((ROOT/'godot/data/game_data.json').read_text())
  fixture=json.loads((ROOT/'godot/tests/fixtures/watch-original-33.json').read_text())
  self.assertEqual(data['itemDefs'][:33],fixture['definitions'])
  for recipe in fixture['recipes']: self.assertIn(recipe,data['recipes'])
  for side in ['front','back']:
   atlas=Image.open(ROOT/f'godot/assets/atlas/watches-{side}.png')
   for i,d in enumerate(data['itemDefs'][:33]):
    with self.subTest(side=side,id=d['id']):
     expected=fixture['faces'][side][i]
     cell=atlas.crop((i%5*128,i//5*128,i%5*128+128,i//5*128+128)).resize((256,256),Image.Resampling.NEAREST)
     self.assertEqual(hashlib.sha256(cell.tobytes()).hexdigest(),expected)
     self.assertEqual(hashlib.sha256(art.watch(i,side=='back',d['tier']=='luxury').tobytes()).hexdigest(),expected)
 def test_all_new_models_render_with_safe_evidence_fields(self):
  data=json.loads((ROOT/'godot/data/game_data.json').read_text())
  self.assertEqual(len(data['itemDefs']),78)
  signatures=set()
  for i,d in enumerate(data['itemDefs']):
   for back in [False,True]:
    with self.subTest(id=d['id'],back=back):
     image=art.watch(i,back,d['tier'] in ['luxury','ultra'])
     sig=hashlib.sha256(image.tobytes()).hexdigest()
     self.assertNotIn(sig,signatures);signatures.add(sig)
     x,y,r,b=image.getbbox();self.assertTrue(x>3 and y>3 and r<253 and b<253)
  for side in ['front','back']:
   im=Image.open(ROOT/f'godot/assets/atlas/watches-{side}.png')
   self.assertEqual(im.size,(640,2048))
   normal=Image.open(ROOT/f'godot/assets/atlas/watches-{side}_n.png')
   self.assertEqual(im.getchannel('A').tobytes(),normal.getchannel('A').tobytes())
if __name__=='__main__':unittest.main()
