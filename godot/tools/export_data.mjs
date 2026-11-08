// Export the TypeScript game data to JSON for the Godot port (single source of truth).
// Usage: node godot/tools/export_data.mjs
import {build} from 'esbuild';
import {writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const entry=`
import {itemDefs,tools,materials,npcs,recipes,orderDefs,orderEarliest,bundleDef} from './assets/scripts/orbital/data';
import {stationEvents} from './assets/scripts/orbital/StationEvents';
import {CONTENT_ITEMS} from './assets/scripts/orbital/ContentExpansion';
import {functionFaults} from './assets/scripts/orbital/ItemReadings';
import {getItemArt} from './assets/scripts/orbital/ItemArt';
const art={};for(const d of [...itemDefs,bundleDef]){const f=getItemArt(d.id,false),b=getItemArt(d.id,true);if(f)art[d.id]={front:f.key,back:b.key,index:f.index,columns:f.columns,rows:f.rows,inset:f.inset};}
const clues={};for(const d of CONTENT_ITEMS)clues[d.id]={clues:d.clues,defect:d.defect};
globalThis.__DATA__={itemDefs,bundleDef,tools,materials,npcs,recipes,orderDefs,orderEarliest,stationEvents,contentClues:clues,functionFaults,itemArt:art};
`;
const out=await build({stdin:{contents:entry,resolveDir:root,loader:'ts'},bundle:true,write:false,format:'iife',platform:'node',logLevel:'error'});
new Function(out.outputFiles[0].text)();
await writeFile(resolve(root,'godot/data/game_data.json'),JSON.stringify(globalThis.__DATA__,null,1));
const d=globalThis.__DATA__;
console.log('items',d.itemDefs.length,'npcs',d.npcs.length,'recipes',d.recipes.length,'orders',d.orderDefs.length,'events',d.stationEvents.length,'art',Object.keys(d.itemArt).length);
