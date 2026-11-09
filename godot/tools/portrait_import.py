"""Shared silhouette cleanup for generated portrait imports; masters stay untouched."""
from PIL import Image


def connected_portrait(image):
    """Keep the main 8-connected silhouette, including diagonal pixel details.

    Generated masters can contain isolated color flecks. Clear those before
    measuring bounds, and again after resampling can disconnect edge pixels.
    All RGBA values inside the connected subject are preserved exactly.
    """
    alpha = image.getchannel('A')
    points = {(x,y) for y in range(image.height) for x in range(image.width) if alpha.getpixel((x,y))}
    largest = set()
    while points:
        group = {points.pop()}
        stack = list(group)
        while stack:
            x,y = stack.pop()
            for dx in (-1,0,1):
                for dy in (-1,0,1):
                    point = x+dx,y+dy
                    if point in points:
                        points.remove(point)
                        group.add(point)
                        stack.append(point)
        if len(group) > len(largest):
            largest = group
    clean = Image.new('L', image.size)
    pixels = clean.load()
    for point in largest:
        pixels[point] = 255
    result = image.copy()
    result.putalpha(clean)
    return result
