import {mkdir,rm,cp,readFile,writeFile,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {build} from 'esbuild';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const engine=join(root,'.cache/cocos/runtime/cc.js');
if(!existsSync(engine)){
  const r=spawnSync(process.execPath,[join(root,'scripts/prepare-engine.mjs')],{cwd:root,stdio:'inherit'});
  if(r.status!==0)process.exit(r.status||1);
}
const dist=join(root,'dist');await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
await cp(join(root,'assets/resources'),join(dist,'resources'),{recursive:true,filter:p=>!p.endsWith('.meta')});
let artExt='png';
try {
  const {default:sharp}=await import('sharp');
  const art=join(dist,'resources/art');
  for(const f of await readdir(art))if(f.endsWith('.png')){
    await sharp(join(art,f)).webp({quality:90,alphaQuality:100,effort:5}).toFile(join(art,f.replace(/\.png$/,'.webp')));
    await rm(join(art,f));
  }
  artExt='webp';
}catch(error){console.warn('PNG assets retained (optional sharp unavailable):',error.code||error.message);}
await cp(join(root,'vendor/cc-builtin-effects.json'),join(dist,'builtin-effects.json'));
await mkdir(join(dist,'licenses'),{recursive:true});
await cp(join(root,'vendor/COCOS-LICENSE.txt'),join(dist,'licenses/COCOS-LICENSE.txt'));
await cp(join(root,'favicon.svg'),join(dist,'favicon.svg'));
await cp(join(root,'web/index.html'),join(dist,'index.html'));
const source=(await readFile(join(root,'web/entry.ts'),'utf8')).replace('__ART_EXT__',artExt);
await build({stdin:{contents:source,resolveDir:join(root,'web'),sourcefile:'entry.ts',loader:'ts'},bundle:true,format:'esm',platform:'browser',target:'es2020',alias:{cc:engine},outfile:join(dist,'game.js'),minify:true,sourcemap:'external',tsconfig:join(root,'tsconfig.web.json'),legalComments:'linked',define:{'process.env.NODE_ENV':'"production"'}});
await writeFile(join(dist,'version.json'),JSON.stringify({ui:'creator-web-v1',engine:'Cocos Creator 3.8.8',sourceEngine:'411f98df047c25902f93440d4b22925c2fb65461',art:artExt,features:['柜台交易','原生拖拽鉴定','陈列换位','七日经营','旧存档迁移']},null,2));
await writeFile(join(dist,'.nojekyll'),'');
console.log('Creator Web build ready: dist/');
