import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'.cache/trade-reservations-tests');
mkdirSync(out,{recursive:true});
const files=['types.ts','data.ts','model.ts'].map(file=>`assets/scripts/orbital/${file}`);
const compile=spawnSync(process.execPath,[resolve(root,'node_modules/typescript/bin/tsc'),'--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,...files],{cwd:root,stdio:'inherit'});
if(compile.error)throw compile.error;
if(compile.status!==0)process.exit(compile.status??1);
const test=spawnSync(process.execPath,[resolve(root,'tests/trade-reservations.test.cjs'),resolve(out,'model.js')],{cwd:root,stdio:'inherit'});
if(test.error)throw test.error;
process.exit(test.status??1);
