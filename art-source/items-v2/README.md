# Godot item art, v2

Original generated master sheets for the retro orbital pawnshop. These are the art sources; the game consumes the packed textures in `godot/assets/atlas/`.

The direction uses colored outlines, deliberate pixel clusters, varied enamel colors, brass, glass, leather and paper. Each item has a dedicated front and back. The source grids follow the existing catalogue ordering: core 6×4, expansion 4×3, annex 5×5. Annex cell 20 is the assembled airlock maintenance kit; cells 21–24 are spare consumable artwork.

Rebuild runtime sprites with:

```bash
python3 godot/tools/prepare_item_art.py
```

The importer requires Pillow, NumPy and SciPy. It separates grid cells, rejects transparent matte residue and narrow neighboring-cell fragments, normalizes the sprite's longest side to 112 logical pixels, and packs lossless 256-pixel cells. Pixel sprites use nearest-neighbor sampling. Neutral normal maps preserve the authored shading rather than deriving false bumps from painted highlights.

The masters remain unchanged so they can be revised or repacked without editing the game rules, catalogue IDs or saved inventory.
