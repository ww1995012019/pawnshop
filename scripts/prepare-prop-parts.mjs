// Pack an original generated 4x3 component sheet into regular Cocos cells.
// This performs only alpha cleanup, transparent trimming, resizing and packing.
// Usage: node scripts/prepare-prop-parts.mjs /path/to/source.png [--qa-dir=local/prop-art-v17]
import sharp from 'sharp';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const args=process.argv.slice(2),sourceArg=args.find(arg=>!arg.startsWith('--'));
if(!sourceArg)throw new Error('Usage: node scripts/prepare-prop-parts.mjs source.png [--qa-dir=local/prop-art-v17]');
const source=resolve(sourceArg),qaDir=resolve(root,args.find(arg=>arg.startsWith('--qa-dir='))?.slice(9)??'local/prop-art-v17');
const key='orbital-prop-parts',cols=4,rows=3,cell=512,padding=32,span=cell-padding*2,alphaThreshold=16;
const output=resolve(root,'assets/resources/art',`${key}.png`);
const definitions=[
 {id:'water-body',label:'WATER · BODY',landmarks:{capSeat:[196,37],filterCentre:[196,181],knobSocket:[300,142],foot:[196,339]},note:'Draw filter behind this open cage. Front rails and lower ring occlude the insert.'},
 {id:'water-cap',label:'WATER · CAP',landmarks:{seat:[195,252],grip:[195,92]},note:'Separate removable upper cap; lower seam seats on the body top ring.'},
 {id:'water-filter',label:'WATER · FILTER',landmarks:{centre:[182,182],top:[182,38],bottom:[182,329]},note:'Full ceramic insert. Scale to fit the housing cavity; move upward for extraction.'},
 {id:'water-knob',label:'WATER · CONNECTOR',landmarks:{pivot:[181,179],plug:[181,275]},note:'Separate connector; may be translated/rotated.'},
 {id:'mug-body',label:'MUG · BODY',landmarks:{lidSeat:[154,44],heaterSeat:[155,328],dialSocket:[229,262],handle:[303,148]},note:'Body includes an open drinking rim and a true transparent D-shaped handle opening.'},
 {id:'mug-lid',label:'MUG · LID',landmarks:{seat:[182,250],centre:[182,181]},note:'Matching removable lid. Open rim remains visible when this part moves away.'},
 {id:'mug-heater',label:'MUG · HEATER',landmarks:{centre:[180,177],seat:[180,106]},note:'Independent heater puck with visible copper coil, removable below the mug.'},
 {id:'mug-dial',label:'MUG · DIAL',landmarks:{pivot:[180,171],indicator:[211,131]},note:'Front-facing round control; rotate about pivot.'},
 {id:'lamp-base',label:'LAMP · BASE',landmarks:{leftHinge:[134,66],centreHinge:[181,36],rightHinge:[228,66],foot:[181,332]},note:'Base plus upright stand only; three top sockets accept independent light panels.'},
 {id:'lamp-left-leaf',label:'LAMP · LEFT LEAF',landmarks:{hinge:[248,334],tip:[87,39]},note:'Rotate about brass hinge near bottom-right; panel points upper-left.'},
 {id:'lamp-centre-leaf',label:'LAMP · CENTRE LEAF',landmarks:{hinge:[180,338],tip:[181,15]},note:'Rotate about brass hinge at bottom centre; panel points upward.'},
 {id:'lamp-right-leaf',label:'LAMP · RIGHT LEAF',landmarks:{hinge:[111,334],tip:[271,40]},note:'Rotate about brass hinge near bottom-left; panel points upper-right.'},
];

function cleanAlpha(data){for(let i=0;i<data.length;i+=4)if(data[i+3]<alphaThreshold)data.fill(0,i,i+4);}
function alphaBounds(data,width,height){
 let minX=width,minY=height,maxX=-1,maxY=-1,pixels=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]){
  pixels++;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
 }
 if(maxX<0)throw new Error('An atlas cell is empty');
 return {x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1,pixels};
}
function componentSizes(data,width,height){
 const seen=new Uint8Array(width*height),sizes=[];
 for(let index=0;index<width*height;index++){
  if(seen[index]||!data[index*4+3])continue;
  const queue=[index];seen[index]=1;
  for(let head=0;head<queue.length;head++){
   const x=queue[head]%width,y=Math.floor(queue[head]/width);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    const nx=x+dx,ny=y+dy,next=ny*width+nx;
    if(nx<0||ny<0||nx>=width||ny>=height||seen[next]||!data[next*4+3])continue;
    seen[next]=1;queue.push(next);
   }
  }
  sizes.push(queue.length);
 }
 return sizes.sort((a,b)=>b-a);
}
const sourceBytes=await readFile(source);
const {data,info}=await sharp(sourceBytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
if(info.width%cols||info.height%rows)throw new Error('Source dimensions must divide into a 4x3 grid');
const sourceCellW=info.width/cols,sourceCellH=info.height/rows;
if(sourceCellW!==sourceCellH)throw new Error('Source grid cells must be square');
cleanAlpha(data);
const cleaned=await sharp(data,{raw:info}).png().toBuffer(),layers=[],manifestParts=[];
for(let index=0;index<definitions.length;index++){
 const column=index%cols,row=Math.floor(index/cols),definition=definitions[index];
 const sourceRect={left:column*sourceCellW,top:row*sourceCellH,width:sourceCellW,height:sourceCellH};
 const raw=await sharp(cleaned).extract(sourceRect).raw().toBuffer();
 const sourceBounds=alphaBounds(raw,sourceCellW,sourceCellH),components=componentSizes(raw,sourceCellW,sourceCellH);
 if(components.length!==1)throw new Error(`${definition.id} has ${components.length} separate components; inspect for neighbouring fragments`);
 const rect={left:sourceBounds.x,top:sourceBounds.y,width:sourceBounds.width,height:sourceBounds.height};
 const resized=await sharp(raw,{raw:{width:sourceCellW,height:sourceCellH,channels:4}}).extract(rect).resize(span,span,{fit:'inside'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 cleanAlpha(resized.data);
 const left=Math.floor((cell-resized.info.width)/2),top=Math.floor((cell-resized.info.height)/2);
 const sprite=await sharp(resized.data,{raw:resized.info}).png().toBuffer();
 layers.push({input:sprite,left:column*cell+left,top:row*cell+top});
 const occupied=alphaBounds(resized.data,resized.info.width,resized.info.height);
 const bounds={x:left+occupied.x,y:top+occupied.y,width:occupied.width,height:occupied.height};
 const landmarks={};
 for(const [name,[x,y]] of Object.entries(definition.landmarks))landmarks[name]=[
  Number((left+(x-sourceBounds.x)*resized.info.width/sourceBounds.width).toFixed(2)),
  Number((top+(y-sourceBounds.y)*resized.info.height/sourceBounds.height).toFixed(2)),
 ];
 manifestParts.push({index,id:definition.id,column,row,sourceRect,sourceBounds,bounds,landmarks,note:definition.note});
}
await sharp({create:{width:cols*cell,height:rows*cell,channels:4,background:'#00000000'}}).composite(layers).png().toFile(output);
// Stable metadata keeps repeat packing from invalidating Cocos UUID references.
const template=JSON.parse(await readFile(resolve(root,'assets/resources/art/orbital-items-front.png.meta'),'utf8'));
const uuid='a8451e8c-38c0-5484-9550-8efa60ca1f21';
const meta=JSON.parse(JSON.stringify(template).replaceAll(template.uuid,uuid).replaceAll('orbital-items-front',key));
Object.assign(meta.subMetas.f9941.userData,{width:cols*cell,height:rows*cell,rawWidth:cols*cell,rawHeight:rows*cell,trimX:0,trimY:0,offsetX:0,offsetY:0});
await writeFile(output+'.meta',JSON.stringify(meta,null,2)+'\n');

// Verify final cells and true openings after resampling, not just the source.
const atlas=await sharp(output).ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(const part of manifestParts){
 const cellData=await sharp(atlas.data,{raw:atlas.info}).extract({left:part.column*cell,top:part.row*cell,width:cell,height:cell}).raw().toBuffer();
 const bounds=alphaBounds(cellData,cell,cell),components=componentSizes(cellData,cell,cell);
 if(bounds.x<padding||bounds.y<padding||bounds.x+bounds.width>cell-padding||bounds.y+bounds.height>cell-padding)throw new Error(`${part.id} has insufficient padding`);
 if(components.length!==1)throw new Error(`${part.id} contains a detached fragment after packing`);
 part.occupiedPixels=bounds.pixels;
 part.components=components.length;
}
function alphaAtCell(index,x,y){return atlas.data[(((Math.floor(index/cols)*cell+y)*atlas.info.width+index%cols*cell+x)*4)+3];}
const openingSamples={waterLeftCavity:[0,193,230],waterRightCavity:[0,315,230],mugHandle:[4,390,218]};
for(const [name,[index,x,y]] of Object.entries(openingSamples))if(alphaAtCell(index,x,y)!==0)throw new Error(`${name} opening lost transparency`);

await mkdir(qaDir,{recursive:true});
const labels=`<svg width="${cols*cell}" height="${rows*cell}">${definitions.map((part,index)=>`<text x="${index%cols*cell+16}" y="${Math.floor(index/cols)*cell+23}" fill="#e3f1ee" font-family="sans-serif" font-size="17">${String(index).padStart(2,'0')} ${part.label}</text>`).join('')}</svg>`;
for(const [name,color] of [['dark','#101c24'],['cyan','#24565d']]){
 await sharp(output).flatten({background:color}).composite([{input:Buffer.from(labels),left:0,top:0}]).png().toFile(resolve(qaDir,`contact-${name}.png`));
}
const manifest={
 atlas:relative(root,output),dimensions:[cols*cell,rows*cell],grid:[cols,rows],cell:[cell,cell],padding,alphaThreshold,
 source,sourceSha256:createHash('sha256').update(sourceBytes).digest('hex'),sourceDimensions:[info.width,info.height],
 atlasSha256:createHash('sha256').update(await readFile(output)).digest('hex'),
 coordinateConvention:'Pixels from each 512x512 cell top-left; Cocos Y is the opposite direction. Landmarks are approximate art attachment points, not sprite anchors. All cell sprites default to centre anchor (256,256).',
 openingSamples,parts:manifestParts,
};
await writeFile(resolve(qaDir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({atlas:output,dimensions:manifest.dimensions,cell:manifest.cell,parts:manifest.parts.length,allSingleComponent:true,openingSamplesTransparent:true,sha256:manifest.atlasSha256,qaDir},null,2));
