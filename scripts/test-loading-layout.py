"""Loading screen layout and build-time character references."""
import importlib.util
from pathlib import Path
import unittest
ROOT=Path(__file__).resolve().parents[1]
class LoaderLayout(unittest.TestCase):
    def test_minimal_loader_markup(self):
        html=(ROOT/'godot/web/shell.html').read_text()
        self.assertNotIn('id="bytes"',html)
        self.assertNotIn('class="panel"',html)
        self.assertIn('id="loading-cast"',html)
        self.assertIn('id="loading-bottom"',html)
        self.assertNotIn(' MB',html)
    def test_cast_covers_every_resident_with_matching_quote(self):
        spec=importlib.util.spec_from_file_location('build',ROOT/'scripts/build-godot-web.py')
        build=importlib.util.module_from_spec(spec);spec.loader.exec_module(build)
        self.assertTrue(hasattr(build,'loading_cast'))
        if not hasattr(build,'loading_cast'):return
        data,portrait=build.loading_cast()
        self.assertEqual(len(data),33)
        self.assertEqual(len({x['id'] for x in data}),33)
        self.assertTrue(all(x['name'] and x['line'] and '{' not in x['line'] for x in data))
        self.assertLess(len(portrait),500000)
if __name__=='__main__':unittest.main()
