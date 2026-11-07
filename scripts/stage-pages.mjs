import {cp,rm,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=process.cwd();
await rm(resolve(root,'play'),{recursive:true,force:true});
await cp(resolve(root,'dist'),resolve(root,'play'),{recursive:true,filter:p=>!p.endsWith('.map')});
await writeFile(resolve(root,'.nojekyll'),'');
console.log('Staged Creator Web build in play/ for the existing GitHub Pages branch.');
