import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync,readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root=fileURLToPath(new URL('../',import.meta.url)),out=resolve(root,'.cache/item-art-tests');
mkdirSync(out,{recursive:true});
const compile=spawnSync(process.execPath,[resolve(root,'node_modules/typescript/bin/tsc'),'--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,'assets/scripts/orbital/ItemArt.ts','assets/scripts/orbital/HandbookCatalogue.ts','assets/scripts/orbital/ItemHitBounds.ts'],{cwd:root,stdio:'inherit'});
if(compile.error)throw compile.error;
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url),{getItemArt}=require(resolve(out,'ItemArt.js'));
const {cataloguePage,remainingStock}=require(resolve(out,'HandbookCatalogue.js'));
const {getItemHitBounds}=require(resolve(out,'ItemHitBounds.js'));
const {itemDefs}=require(resolve(out,'data.js'));
const {stockPreview}=require(resolve(out,'Market.js'));
assert.equal(itemDefs.length,36);
const uniqueFaces=new Set();
for(const def of itemDefs)for(const back of [false,true]){
  const art=getItemArt(def.id,back);assert.ok(art,`${def.id} must have real art`);
  const face=`${art.key}/${art.index}`;assert.ok(!uniqueFaces.has(face),`${face} reused`);uniqueFaces.add(face);
  const path=resolve(root,'assets/resources/art',art.key+'.png');
  const {data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const cw=info.width/art.columns,ch=info.height/art.rows;
  assert.ok(Math.abs(cw/ch-1)<.01,'inspection contact geometry expects square atlas cells');
  const sx=(art.index%art.columns)*cw+cw*art.inset,sy=Math.floor(art.index/art.columns)*ch+ch*art.inset;
  const sw=cw*(1-art.inset*2),sh=ch*(1-art.inset*2),b=getItemHitBounds(def.id,back,404);
  let opaque=0;
  for(let y=Math.ceil(sy);y<Math.floor(sy+sh);y++)for(let x=Math.ceil(sx);x<Math.floor(sx+sw);x++){
    if(!data[(y*info.width+x)*4+3])continue;opaque++;
    const lx=((x-sx)/sw-.5)*404,ly=((y-sy)/sh-.5)*404;
    assert.ok(lx>=b.x-1e-5&&lx<=b.x+b.width+1e-5&&ly>=b.y-1e-5&&ly<=b.y+b.height+1e-5,`${def.id} ${back?'back':'front'} visible alpha escaped its contact bounds`);
  }
  assert.ok(opaque>sw*sh*.1,`${def.id} sprite cell is empty`);
}
assert.equal(uniqueFaces.size,72);
assert.ok(getItemHitBounds('ITM-064',false).width<390,'expansion contact geometry must use its generated alpha metadata, not the full-frame fallback');
const seen=[];
for(let i=0;i<6;i++){const page=cataloguePage(itemDefs,i);assert.equal(page.items.length,6);seen.push(...page.items.map(d=>d.id));assert.equal(page.pages,6);}
assert.deepEqual(seen,itemDefs.map(d=>d.id));
assert.equal(cataloguePage(itemDefs,999).page,5);assert.equal(cataloguePage([],0).items.length,0);
const s={seed:'handbook-audit',day:4,cursor:0,trade:null};
const preview=remainingStock(s);assert.deepEqual(preview.map(p=>p.slot),[0,2,4]);
assert.deepEqual(preview[0].stock,stockPreview(s,4,0));
assert.deepEqual(remainingStock({...s,cursor:2,trade:{}}).map(p=>p.slot),[4]);
assert.deepEqual(remainingStock({...s,cursor:6}),[]);
assert.deepEqual(Object.keys(preview[0].stock).sort(),['defId','priceBand','source'],'forecast must not reveal hidden truth');
const ui=readFileSync(resolve(root,'assets/scripts/orbital/OrbitalUI.ts'),'utf8');
for(const key of ['orbital-expansion-front','orbital-expansion-back'])assert.ok(ui.includes(`'${key}'`),`${key} must preload`);
console.log('Item art: 72 unique occupied fronts/backs fit their alpha bounds; all 36 catalogue entries and safe arrival previews passed.');
