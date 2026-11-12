"""The moving bell replaces the painted object without a second silhouette."""
from pathlib import Path
import unittest
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]

class BellArtTest(unittest.TestCase):
    def test_original_painted_bell_is_extracted_once(self):
        path = ROOT/'godot/assets/scene/service_bell.png'
        self.assertTrue(path.exists(), 'original bell must be extracted into a moving sprite')
        if not path.exists(): return
        source = Image.open(ROOT/'art-source/shop-v3/shop-master.png').convert('RGB')
        source = source.resize((480,270), Image.Resampling.BOX).resize((1920,1080), Image.Resampling.NEAREST).convert('RGBA')
        scene = Image.open(ROOT/'godot/assets/scene/shop_pixel.png').convert('RGBA')
        self.assertEqual(scene.size, (480,270))
        scene = scene.resize((1920,1080), Image.Resampling.NEAREST)
        bell = Image.open(path).convert('RGBA')
        self.assertIsNotNone(bell.getbbox())
        self.assertNotEqual(scene.crop((488,576,600,660)).tobytes(), source.crop((488,576,600,660)).tobytes(), 'stationary painted bell is removed')
        scene.alpha_composite(bell,(488,576))
        self.assertEqual(scene.tobytes(), source.tobytes(), 'resting bell restores every original scene pixel exactly')

if __name__ == '__main__': unittest.main()
