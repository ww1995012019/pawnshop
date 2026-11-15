# Comic presentation assets

The approved visual reference is `exec-cb94836f-d9e8-4983-928f-8509c343c80a.png`.
The room, separated residents, watch illustration sheets, bell, paper grain,
scalable paper border, red paper and tailed speech bubble were generated as
independent presentation assets. Controls, prices, dialogue and stock are live
Godot nodes; no full-screen screenshot is used as an interactive background.

`comic_assets.gd` owns atlas regions. Resident cells follow the existing game
IDs. Watch UI illustrations follow apparent model and silhouette; detailed
technical specimen textures, markings and counterfeit evidence are still
rendered by the canonical watch renderer, so those facts are not repainted.

PNG originals are kept; the committed Godot import settings use high-quality
lossy texture compression. The frame is imported at 256px for 8px nine-patch
caps; this avoids compressing oversized corner caps into short price labels.

Most interface SVGs are Lucide outline icons, downloaded from
https://github.com/lucide-icons/lucide/tree/main/icons on 2026-11-15.
See `icons/LUCIDE-LICENSE.txt` (ISC). Warning/fingerprint and any retained
Font Awesome icons use Font Awesome Free; see `icons/LICENSE.txt`.
`icons_ink` contains ink-colored aliases for the existing UIKit icon keys.
