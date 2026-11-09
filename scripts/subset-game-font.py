#!/usr/bin/env python3
"""Keep all game-text glyphs, printable Latin and punctuation; preserve the master."""
from pathlib import Path
import json
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]


def game_characters(project):
    characters = set(range(32, 127)) | set(range(0x2000, 0x2070)) | set(range(0x3000, 0x3040)) | set(range(0xFF00, 0xFFF0))
    def collect(value):
        if isinstance(value, str): characters.update(map(ord, value))
        elif isinstance(value, dict):
            for key, item in value.items(): collect(key); collect(item)
        elif isinstance(value, list):
            for item in value: collect(item)
    for path in sorted(Path(project).rglob('*')):
        if '.godot' in path.parts or not path.is_file() or path.suffix not in ('.gd', '.json', '.tscn', '.tres', '.godot', '.html', '.js'):
            continue
        text = path.read_text()
        characters.update(map(ord, text))
        if path.suffix == '.json': collect(json.loads(text))
    return characters


def main():
    master = ROOT / 'art-source/fonts/orbital-sans.ttf'
    destination = ROOT / 'godot/assets/fonts/orbital-sans.ttf'
    font = TTFont(master, recalcTimestamp=False)
    options = subset.Options()
    options.recalc_timestamp = False
    options.layout_features = ['*']
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=game_characters(ROOT / 'godot'))
    sub.subset(font)
    from io import BytesIO
    buffer = BytesIO()
    font.save(buffer)
    data = buffer.getvalue()
    if destination.read_bytes() != data: destination.write_bytes(data)
    print(f'Game font: {len(data):,} bytes (master {master.stat().st_size:,}); {len(font.getBestCmap())} glyphs')

if __name__ == '__main__': main()
