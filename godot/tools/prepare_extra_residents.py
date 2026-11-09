"""Prepare four original resident portraits using the existing pixel-art scale."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "art-source/shop-v3/residents-extra-master.png"
ATLAS = ROOT / "godot/assets/atlas"


def main():
    source = Image.open(SOURCE).convert("RGBA")
    atlas = Image.new("RGBA", (512, 512))
    for index in range(4):
        col, row = index % 2, index // 2
        crop = source.crop((round(col * source.width / 2), round(row * source.height / 2),
                            round((col + 1) * source.width / 2), round((row + 1) * source.height / 2)))
        alpha = crop.getchannel("A").point(lambda a: 255 if a >= 160 else 0)
        crop.putalpha(alpha)
        bounds = alpha.getbbox()
        if not bounds:
            raise ValueError(f"empty resident {index}")
        crop = crop.crop(bounds)
        crop.thumbnail((116, 116), Image.Resampling.LANCZOS)
        crop.putalpha(crop.getchannel("A").point(lambda a: 255 if a >= 128 else 0))
        crop = crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.NEAREST)
        atlas.alpha_composite(crop, (col * 256 + (256 - crop.width) // 2, row * 256 + 248 - crop.height))
    atlas.save(ATLAS / "shop-residents-extra.png")
    normal = Image.new("RGBA", atlas.size, (128, 128, 255, 255))
    normal.putalpha(atlas.getchannel("A"))
    normal.save(ATLAS / "shop-residents-extra_n.png")
    print("Imported four additional resident portraits")


if __name__ == "__main__":
    main()
