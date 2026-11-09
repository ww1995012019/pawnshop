"""Silhouette regressions across every imported portrait, including doctor debris."""
from pathlib import Path
import unittest
from PIL import Image
from portrait_import import connected_portrait

ASSETS = Path(__file__).resolve().parents[1] / 'assets'


def components(alpha):
    points = {(x,y) for y in range(alpha.height) for x in range(alpha.width) if alpha.getpixel((x,y))}
    groups = []
    while points:
        group = {points.pop()}
        stack = list(group)
        while stack:
            x,y = stack.pop()
            for dx in (-1,0,1):
                for dy in (-1,0,1):
                    p = x+dx,y+dy
                    if p in points:
                        points.remove(p); group.add(p); stack.append(p)
        groups.append(group)
    return groups


class PortraitImportTest(unittest.TestCase):
    def test_cleanup_preserves_connected_diagonal_details_and_color(self):
        image = Image.new('RGBA', (8,8))
        subject = [(2,2),(2,3),(3,2),(3,3),(4,4),(5,5)]
        for index,point in enumerate(subject):
            image.putpixel(point,(120+index,65,37,255))
        image.putpixel((0,7),(120,65,37,255))
        clean = connected_portrait(image)
        self.assertEqual(clean.getpixel((0,7))[3],0)
        for point in subject:
            self.assertEqual(clean.getpixel(point), image.getpixel(point))

    def test_all_thirteen_portraits_have_no_detached_pixels(self):
        for name,count in [('shop-residents',9),('shop-residents-extra',4)]:
            image = Image.open(ASSETS / 'atlas' / (name+'.png'))
            normal = Image.open(ASSETS / 'atlas' / (name+'_n.png'))
            self.assertEqual(image.getchannel('A').tobytes(), normal.getchannel('A').tobytes())
            cols = image.width//256
            for index in range(count):
                with self.subTest(atlas=name,index=index):
                    box = (index%cols*256,index//cols*256,(index%cols+1)*256,(index//cols+1)*256)
                    self.assertEqual(len(components(image.crop(box).getchannel('A'))),1)


if __name__ == '__main__':
    unittest.main()
