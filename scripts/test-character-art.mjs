import assert from 'node:assert/strict';
import sharp from 'sharp';
const {data,info}=await sharp('assets/resources/art/orbital-people-annex.png').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const cw=info.width/2,ch=info.height/2;
for(let i=0;i<4;i++){
 let firstCount=0,opaque=0,minX=cw,minY=ch,maxX=-1,maxY=-1;
 for(let y=0;y<ch;y++){
  let row=0;
  for(let x=0;x<cw;x++)if(data[((Math.floor(i/2)*ch+y)*info.width+i%2*cw+x)*4+3]>128){
   row++;opaque++;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
  }
  if(row&&!firstCount)firstCount=row;
 }
 assert.ok(opaque>cw*ch*.08,`CHR-${6+i} has no complete visible figure`);
 assert.ok(firstCount<cw*.12,`CHR-${6+i} crown is flat-cut by an atlas boundary (${firstCount} opaque pixels)`);
 assert.ok(minX>cw*.012&&maxX<cw*.988&&minY>ch*.012&&maxY<ch*.988,'portrait must stay inside its real Cocos crop');
}
console.log('Character atlas: four complete isolated figures keep rounded crowns and safe crop margins.');
