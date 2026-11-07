import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const out=resolve('.cache/negotiation-tests');mkdirSync(out,{recursive:true});
const r=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,'assets/scripts/orbital/model.ts','assets/scripts/orbital/Negotiation.ts'],{stdio:'inherit'});
if(r.status)process.exit(r.status);
const t=spawnSync(process.execPath,['tests/negotiation.test.cjs',out],{stdio:'inherit'});process.exit(t.status||0);
