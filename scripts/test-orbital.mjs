import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const out=resolve('.cache/orbital-tests');mkdirSync(out,{recursive:true});
const files=['types.ts','data.ts','model.ts'].map(f=>`assets/scripts/orbital/${f}`);
const r=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,...files],{stdio:'inherit'});
if(r.status)process.exit(r.status);
const t=spawnSync(process.execPath,['tests/orbital.test.cjs',resolve(out,'model.js')],{stdio:'inherit'});process.exit(t.status||0);
