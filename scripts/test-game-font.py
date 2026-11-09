"""Subset must retain every game glyph supported by the original font."""
import importlib.util
from pathlib import Path
import unittest
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]

class FontTests(unittest.TestCase):
    def test_game_glyph_coverage_and_size(self):
        script = ROOT / 'scripts/subset-game-font.py'
        self.assertTrue(script.exists(), 'deterministic game font subset generator is missing')
        spec = importlib.util.spec_from_file_location('subset_game', script)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        master = ROOT / 'art-source/fonts/orbital-sans.ttf'
        output = ROOT / 'godot/assets/fonts/orbital-sans.ttf'
        original = TTFont(master).getBestCmap()
        subset = TTFont(output).getBestCmap()
        required = module.game_characters(ROOT / 'godot')
        self.assertFalse((required & original.keys()) - subset.keys(), 'game glyphs were lost')
        self.assertLess(output.stat().st_size, master.stat().st_size * .8)
        self.assertTrue(set(range(32, 127)) <= subset.keys())

if __name__ == '__main__': unittest.main()
