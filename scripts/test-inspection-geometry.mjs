import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'.cache/inspection-geometry-tests');
mkdirSync(out,{recursive:true});
const compile=spawnSync(process.execPath,[resolve(root,'node_modules/typescript/bin/tsc'),'--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,'assets/scripts/orbital/InspectionGeometry.ts'],{cwd:root,stdio:'inherit'});
if(compile.error)throw compile.error;
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {constrain,normalizePose}=require(resolve(out,'InspectionGeometry.js'));
const mat={x:260,y:220,width:960,height:360};
const objects=[{x:-300,y:-195,width:600,height:390},{x:-220,y:-150,width:524,height:404},{x:160,y:-20,width:320,height:80}];
const positions=[[-1e9,-1e9],[1e9,1e9],[-1e9,1e9],[1e9,-1e9],[740,400],[260,220],[1220,580],[260,580],[1220,220]];
const epsilon=1e-6;
let checked=0;

// Independent corner transform, rather than repeating the helper's half-extent formula.
function corners(local,p){
  const r=p.angle*Math.PI/180;
  return [[local.x,local.y],[local.x+local.width,local.y],[local.x,local.y+local.height],[local.x+local.width,local.y+local.height]].map(([x,y])=>{
    x*=p.zoom*(p.mirrorX?-1:1);y*=p.zoom*(p.mirrorY?-1:1);
    return {x:p.x+Math.cos(r)*x+Math.sin(r)*y,y:p.y-Math.sin(r)*x+Math.cos(r)*y};
  });
}
function inside(local,result,bounds=mat,pad=0){
  for(const point of corners(local,result.pose)){
    assert.ok(point.x>=bounds.x+pad-epsilon&&point.x<=bounds.x+bounds.width-pad+epsilon,`escaped x: ${JSON.stringify({point,result})}`);
    assert.ok(point.y>=bounds.y+pad-epsilon&&point.y<=bounds.y+bounds.height-pad+epsilon,`escaped y: ${JSON.stringify({point,result})}`);
  }
  const pts=corners(local,result.pose),xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);
  assert.ok(Math.abs(result.aabb.x-Math.min(...xs))<epsilon);
  assert.ok(Math.abs(result.aabb.y-Math.min(...ys))<epsilon);
  assert.ok(Math.abs(result.aabb.width-(Math.max(...xs)-Math.min(...xs)))<epsilon);
  assert.ok(Math.abs(result.aabb.height-(Math.max(...ys)-Math.min(...ys)))<epsilon);
  assert.ok(Object.values(result.pose).every(n=>typeof n==='boolean'||Number.isFinite(n)));
  checked++;
}

for(let angle=0;angle<360;angle++)for(const zoom of [.0001,.65,1,1.35,1e9])for(const mirrorX of [false,true])for(const mirrorY of [false,true])for(const [x,y] of positions)for(const local of objects){
  const result=constrain({x,y,angle,zoom,mirrorX,mirrorY},local,mat,{minZoom:.65,maxZoom:1.35,padding:12});
  inside(local,result,mat,12);
}

// Arbitrary/negative/multiple-turn angles and a too-large minimum must still fit.
for(const angle of [-721.25,-450,-.1,360.3,1035,Number.MAX_VALUE]){
  const result=constrain({x:1e9,y:-1e9,angle,zoom:1.35},objects[0],mat,{minZoom:1.2,maxZoom:1.35});
  inside(objects[0],result);
  assert.ok(result.shrunk&&result.pose.zoom<1.2);
}

const defaults={x:740,y:400,angle:30,zoom:.8,mirrorX:true,mirrorY:false};
const restored=normalizePose({x:NaN,y:Infinity,angle:-Infinity,zoom:NaN},defaults);
for(const key of Object.keys(defaults))assert.equal(restored[key],defaults[key]);
assert.equal(normalizePose({zoom:1e9}).zoom,1.35);
assert.equal(normalizePose({zoom:-1e9}).zoom,.65);
assert.equal(normalizePose({angle:-30}).angle,330);

// Rotation around a true centre keeps a comfortably contained object's pivot stationary.
for(let angle=0;angle<360;angle++){
  const result=constrain({x:740,y:400,angle,zoom:.65},{x:-50,y:-30,width:100,height:60},mat);
  assert.equal(result.pose.x,740);assert.equal(result.pose.y,400);
  assert.equal(result.pose.zoom,.65);assert.equal(result.clamped,false);
}

// Repeated constraints do not move or progressively shrink an already contained pose.
const once=constrain({x:99999,y:-99999,angle:67,zoom:1.35,mirrorX:true},objects[1],mat);
let repeated=once;
for(let i=0;i<100;i++)repeated=constrain(repeated.pose,objects[1],mat);
for(const key of ['x','y','angle','zoom'])assert.ok(Math.abs(repeated.pose[key]-once.pose[key])<1e-9);

// No-space mats collapse safely, and malformed input values still yield finite poses.
inside(objects[0],constrain({x:Infinity,zoom:NaN},objects[0],{x:1,y:2,width:0,height:0}),{x:1,y:2,width:0,height:0});
const malformed=constrain({x:NaN,y:Infinity,angle:NaN,zoom:Infinity},{x:NaN,y:Infinity,width:NaN,height:Infinity},{x:NaN,y:Infinity,width:NaN,height:Infinity});
assert.ok(Object.values(malformed.aabb).every(Number.isFinite));

// Exact Main integration: a square atlas cell contained in 524×404 is really 404×404.
// Constrain the visible sprite, not the wider UI container, including the 8px mat inset.
const actualMat={x:244,y:216,width:992,height:366},actualLocal={x:-202,y:-202,width:404,height:404};
const actualDefaults={x:740,y:399,angle:0,zoom:.8,mirrorX:false,mirrorY:false};
const actualOptions={minZoom:.45,maxZoom:1.15,padding:8,defaults:actualDefaults};
for(let angle=0;angle<360;angle++)for(const zoom of [.0001,.45,.8,1,1.15,1e9])for(const mirrorX of [false,true])for(const mirrorY of [false,true])for(const [x,y] of positions){
  const result=constrain({x,y,angle,zoom,mirrorX,mirrorY},actualLocal,actualMat,actualOptions);
  inside(actualLocal,result,actualMat,8);
}
const front=constrain({...actualDefaults,zoom:1.15},actualLocal,actualMat,actualOptions);
const side=constrain({...actualDefaults,angle:90,zoom:1.15},actualLocal,actualMat,actualOptions);
const diagonal=constrain({...actualDefaults,angle:45,zoom:1.15},actualLocal,actualMat,actualOptions);
assert.ok(Math.abs(front.pose.zoom-350/404)<1e-9);
assert.ok(Math.abs(side.pose.zoom-front.pose.zoom)<1e-9,'a square sprite must not shrink additionally at 90 degrees');
assert.ok(Math.abs(diagonal.pose.zoom-350/(404*Math.SQRT2))<1e-9);
assert.equal(side.pose.x,740);assert.equal(side.pose.y,399);
assert.equal(diagonal.pose.x,740);assert.equal(diagonal.pose.y,399);
const forcedFit=constrain({...actualDefaults,angle:45,zoom:1.15},actualLocal,actualMat,{...actualOptions,minZoom:.8});
assert.ok(forcedFit.pose.zoom<.8,'fit must override user minimum when the rotated sprite cannot fit');
inside(actualLocal,forcedFit,actualMat,8);
const restoredActual=constrain({x:Infinity,y:NaN,angle:Infinity,zoom:NaN},actualLocal,actualMat,actualOptions);
for(const key of Object.keys(actualDefaults))assert.equal(restoredActual.pose[key],actualDefaults[key]);
inside(actualLocal,restoredActual,actualMat,8);
console.log(`inspection geometry: ${checked.toLocaleString()} transformed AABBs contained; 360° rotations, min/max zoom, all mirrors, extreme drags, defaults and idempotence passed`);
