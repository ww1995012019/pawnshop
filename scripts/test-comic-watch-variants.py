#!/usr/bin/env python3
"""Reject stale comic atlases and collapsed/near-invisible model illustrations."""
import hashlib
import importlib.util
import json
import runpy
import unittest
from PIL import Image
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('comic_variants',ROOT/'scripts/generate-comic-watch-variants.py')
art=importlib.util.module_from_spec(spec)
spec.loader.exec_module(art)

class ComicWatchVariants(unittest.TestCase):
    def test_packed_art_is_reproducible_from_existing_model_profiles(self):
        definitions=json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs']
        metadata=json.loads((ROOT/'godot/data/watch_art.json').read_text())
        canonical=runpy.run_path(str(ROOT/'scripts/generate-watch-art.py'))
        for back in [False,True]:
            packed=Image.open(art.ASSETS/('watch_variants_back.png' if back else 'watch_variants_front.png')).convert('RGBA')
            self.assertEqual(packed.size,(1024,1920))
            signatures=set()
            for i,definition in enumerate(definitions):
                with self.subTest(id=definition['id'],back=back):
                    image=art.render(i,definition,metadata[definition['id']],canonical,back)
                    x,y=i%8*128,i//8*192
                    self.assertEqual(image.tobytes(),packed.crop((x,y,x+128,y+192)).tobytes())
                    signature=hashlib.sha256(image.tobytes()).hexdigest()
                    self.assertNotIn(signature,signatures)
                    signatures.add(signature)
                    bounds=image.getchannel('A').getbbox()
                    self.assertGreaterEqual(bounds[1],5)
                    self.assertLessEqual(bounds[3],187)
                    self.assertGreater(bounds[3]-bounds[1],160)

if __name__=='__main__':unittest.main()
