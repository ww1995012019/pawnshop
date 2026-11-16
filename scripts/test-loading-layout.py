"""Loading screen layout and build-time character references."""
import importlib.util
import io
from pathlib import Path
import unittest
from PIL import Image, ImageChops, ImageStat
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
    def test_cast_uses_comic_portraits(self):
        spec=importlib.util.spec_from_file_location('build',ROOT/'scripts/build-godot-web.py')
        build=importlib.util.module_from_spec(spec);spec.loader.exec_module(build)
        cast,data=build.loading_cast()
        sheet=Image.open(io.BytesIO(data)).convert('RGBA');tile=sheet.width//6
        person=next(x for x in cast if x['id']=='CHR-030')
        source=Image.open(ROOT/'godot/assets/comic/residents_new.png').convert('RGBA')
        expected=source.crop((round(source.width/5),round(3*source.height/4),round(2*source.width/5),source.height)).resize((tile,tile),Image.Resampling.LANCZOS)
        slot=person['slot'];actual=sheet.crop((slot%6*tile,slot//6*tile,(slot%6+1)*tile,(slot//6+1)*tile))
        self.assertGreaterEqual(tile,192,'Comic linework needs a detailed loading portrait')
        paper=Image.new('RGBA',(tile,tile),'#f7e5c3')
        diff=ImageChops.difference(Image.alpha_composite(paper,expected).convert('RGB'),Image.alpha_composite(paper,actual).convert('RGB'))
        self.assertLess(max(ImageStat.Stat(diff).rms),16,'Loading portrait must show the current comic resident')
        self.assertLess(actual.getpixel((0,0))[3],10,'Portrait corners remain transparent')
    def test_background_uses_current_comic_scenery(self):
        spec=importlib.util.spec_from_file_location('build',ROOT/'scripts/build-godot-web.py')
        build=importlib.util.module_from_spec(spec);spec.loader.exec_module(build)
        self.assertTrue(hasattr(build,'loading_background'),'Build must derive loading art from current comic scenery')
        if not hasattr(build,'loading_background'):return
        data=build.loading_background();actual=Image.open(io.BytesIO(data)).convert('RGB')
        expected=Image.open(ROOT/'godot/assets/comic/reference-clean-room.png').convert('RGB').crop((0,60,1187,866))
        self.assertEqual(actual.size,expected.size)
        self.assertLess(max(ImageStat.Stat(ImageChops.difference(actual,expected)).rms),16)
        self.assertLess(len(data),500000,'Loading scenery stays lightweight')
if __name__=='__main__':unittest.main()
