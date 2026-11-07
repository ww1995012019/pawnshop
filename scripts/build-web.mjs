import {mkdir,rm,cp,readFile,writeFile,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const engine=join(root,'.cache/cocos/runtime/cc.js');
if(!existsSync(engine)){
  const r=spawnSync(process.execPath,[join(root,'scripts/prepare-engine.mjs')],{cwd:root,stdio:'inherit'});
  if(r.status!==0)process.exit(r.status||1);
}
const dist=join(root,'dist');await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
await cp(join(root,'assets/resources'),join(dist,'resources'),{recursive:true,filter:p=>{
  if(p.endsWith('.meta'))return false;
  const name=p.split('/').pop();
  if(p.includes('/art/')&&!name.startsWith('orbital-')&&name!=='hands.png')return false;
  if(p.includes('/fonts/')&&name.startsWith('greyline-'))return false;
  return true;
}});
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
const codeHash=createHash('sha256').update(await readFile(join(dist,'game.js'))).digest('hex').slice(0,12);
await writeFile(join(dist,'index.html'),(await readFile(join(root,'web/index.html'),'utf8')).replace('src="./game.js"',`src="./game.js?v=${codeHash}"`));
await writeFile(join(dist,'version.json'),JSON.stringify({ui:'orbital-p0-v8',engine:'Cocos Creator 3.8.8',sourceEngine:'411f98df047c25902f93440d4b22925c2fb65461',art:artExt,features:['台后半身人物与实体仪器UI','空间站三场景','24件P0货物与正反面','六种不同鉴定操作','维修拆解组装','占格仓库与安检','订单交付与升级','12AP与Cr经济','21日经营']},null,2));
await writeFile(join(dist,'.nojekyll'),'');
console.log('Creator Web build ready: dist/');
