/**
 * Generated from the shipped RGBA item atlases, using OrbitalUI's 6x4 grid / .035 inset.
 * Alpha >= 1 is included: faint holograms, glow, shadows and edge antialiasing are retained.
 * Bounds include one source-pixel sampling fringe, clipped to each rendered sub-frame.
 * These are conservative rectangular alpha bounds, not per-pixel silhouette tests.
 * Regenerate when either atlas, cell ordering, or OrbitalUI crop/contain geometry changes.
 * Expansion: 1448x1086 / 4x3 square cells.
 * orbital-expansion-front.png sha256 5b56ca8ae092f4abfdbca3523bc14d7810b5b67403402905d47f873224f8a1ce
 * orbital-expansion-back.png sha256 f4393fa537f4dc75fd8660bca156f140173a279a5e4e5e3d76b520e410bd264e
 * orbital-items-front.png: 1536x1024, sha256 2966a7978f9cb86cc87a83d231644ac7554f22e555a9a89ca846177241ba7580
 * orbital-items-back.png: 1536x1024, sha256 ab00826d69c6a123e05a2f67ab4d0bf38091da8044dc0cdec45b802200f69e6b
 */
export interface ItemHitRect {x:number;y:number;width:number;height:number}
type NormalizedHitRect=readonly [x:number,y:number,width:number,height:number];

const FULL_FRAME:NormalizedHitRect=[0,0,1,1];
const ITEM_ALPHA_BOUNDS:Readonly<Record<string,{front:NormalizedHitRect;back:NormalizedHitRect}>>={
  'ITM-001':{front:[0.113575268, 0.029569892, 0.802251345, 0.970262098],back:[0.088373655, 0.012768817, 0.886256722, 0.987231183]},
  'ITM-002':{front:[0.096774193, 0.033770161, 0.81905242, 0.966229839],back:[0.021169354, 0.008568548, 0.768649195, 0.991431452]},
  'ITM-003':{front:[0.029569892, 0.021169354, 0.936659947, 0.96186156],back:[0.008568548, 0.046370967, 0.966061829, 0.945060485]},
  'ITM-009':{front:[0, 0.063172043, 0.995631721, 0.861055108],back:[0, 0.07157258, 1, 0.911458334]},
  'ITM-010':{front:[0.021169354, 0.058971774, 0.953461023, 0.940860216],back:[0.012768817, 0.016969086, 0.96186156, 0.983030914]},
  'ITM-011':{front:[0, 0.117775537, 0.983030914, 0.831653227],back:[0, 0.088373655, 0.99983199, 0.911626345]},
  'ITM-017':{front:[0.046370967, 0.016969086, 0.886256722, 0.983030914],back:[0.021169354, 0, 0.96186156, 1]},
  'ITM-018':{front:[0.004368279, 0, 0.995631721, 0.966229839],back:[0, 0.004368279, 0.966229839, 0.995463711]},
  'ITM-019':{front:[0.012768817, 0, 0.974462366, 1],back:[0, 0.012768817, 0.974630377, 0.911458334]},
  'ITM-025':{front:[0.012768817, 0.012768817, 0.936659947, 0.978662635],back:[0, 0, 0.974630377, 1]},
  'ITM-026':{front:[0.004368279, 0, 0.991263442, 0.941028226],back:[0, 0, 0.987231183, 1]},
  'ITM-027':{front:[0, 0, 1, 0.915826613],back:[0, 0.021169354, 1, 0.96186156]},
  'ITM-033':{front:[0.054771505, 0, 0.919858872, 1],back:[0.012768817, 0, 0.970262097, 1]},
  'ITM-034':{front:[0.075772849, 0, 0.89045699, 1],back:[0.029569892, 0, 0.970430108, 1]},
  'ITM-035':{front:[0, 0, 1, 0.96202957],back:[0, 0.067372311, 1, 0.932627689]},
  'ITM-041':{front:[0, 0, 0.991431452, 0.991431452],back:[0.079973118, 0, 0.764448926, 1]},
  'ITM-042':{front:[0, 0, 1, 0.907426076],back:[0, 0.063172043, 1, 0.856854839]},
  'ITM-043':{front:[0, 0.004368279, 0.932627689, 0.919858872],back:[0, 0, 0.991431452, 0.99983199]},
  'ITM-048':{front:[0.021169354, 0.063172043, 0.978830646, 0.827452957],back:[0.012768817, 0.092573924, 0.987231183, 0.819052421]},
  'ITM-049':{front:[0, 0, 0.915826613, 0.974630377],back:[0.029569892, 0, 0.970430108, 0.974630377]},
  'ITM-050':{front:[0, 0.079973118, 1, 0.793850807],back:[0, 0, 0.974630377, 0.987231183]},
  'ITM-055':{front:[0, 0.025369623, 0.978830646, 0.949260754],back:[0, 0, 0.983030914, 0.974630377]},
  'ITM-056':{front:[0.079973118, 0, 0.823252689, 0.974630377],back:[0.021169354, 0, 0.978830646, 0.983030914]},
  'ITM-057':{front:[0.021169354, 0.016969086, 0.953461023, 0.940860216],back:[0, 0, 0.99983199, 0.974630377]},
  // Expansion RGBA 4x3 cells, .035 inset, alpha >= 1 and one source-pixel fringe.
  'ITM-061':{front:[0,0.003950573,1,0.996049427],back:[0,0,1,1]},
  'ITM-062':{front:[0,0,1,1],back:[0,0,1,1]},
  'ITM-063':{front:[0,0.015831997,1,0.984168003],back:[0.000980217,0.006920929,0.999019783,0.993079071]},
  'ITM-064':{front:[0,0,0.921790531,1],back:[0,0,0.981197647,1]},
  'ITM-065':{front:[0,0,1,0.990108715],back:[0.009891285,0,0.990108715,1]},
  'ITM-066':{front:[0,0,1,1],back:[0,0,1,1]},
  'ITM-067':{front:[0,0,1,1],back:[0,0,1,1]},
  'ITM-068':{front:[0,0,1,1],back:[0.009891285,0,0.965365651,1]},
  'ITM-069':{front:[0.006920929,0,0.993079071,0.999019783],back:[0,0,1,0.990108715]},
  'ITM-070':{front:[0,0,1,0.987138359],back:[0,0,1,0.993079071]},
  'ITM-071':{front:[0,0,1,0.993079071],back:[0,0,1,0.993079071]},
  'ITM-072':{front:[0,0,1,0.999019783],back:[0,0,0.996049427,0.993079071]},
  // BND-001: 1000x700 assembly fitted inside a square, including handle, opened latch and strokes.
  'BND-001':{front:[.05,.21,.90,.59],back:[.05,.21,.90,.59]},
};

/**
 * Local visible-alpha rectangle for an item drawn with contain inside size x size.
 * The square's centre is (0,0); x grows right and y grows DOWN, before rotation/zoom/mirroring.
 * Size must match the item's actual drawing square (404 by default), not its drag container.
 * Unknown IDs and unlisted future artwork use the full square so visible content is never cut.
 * Returns a fresh object. It is a geometry bound, not a minimum mouse/touch target size.
 */
export function getItemHitBounds(itemId:string,back:boolean,size=404):ItemHitRect {
  const extent=Number.isFinite(size)&&size>0?size:404;
  const item=ITEM_ALPHA_BOUNDS[itemId.trim().toUpperCase()];
  const bounds=item?.[back?'back':'front']??FULL_FRAME;
  return {x:(bounds[0]-.5)*extent,y:(bounds[1]-.5)*extent,width:bounds[2]*extent,height:bounds[3]*extent};
}
