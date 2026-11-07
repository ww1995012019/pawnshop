import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const root=process.cwd(),out=resolve(root,'.cache/model-tests');mkdirSync(out,{recursive:true});
const files=['data.ts','model.ts','save.ts'].map(f=>`assets/scripts/game/${f}`);
const r=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,...files],{stdio:'inherit'});
if(r.status)process.exit(r.status);
const t=spawnSync(process.execPath,['tests/model.test.cjs',resolve(out,'model.js')],{stdio:'inherit'});process.exit(t.status||0);
