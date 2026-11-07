import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'.cache/order-presentation-tests');
mkdirSync(out,{recursive:true});
const compile=spawnSync(process.execPath,[resolve(root,'node_modules/typescript/bin/tsc'),'--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,'assets/scripts/orbital/OrderPresentation.ts'],{cwd:root,stdio:'inherit'});
if(compile.error)throw compile.error;
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url);
const {ordersForGroup,selectedOrderId}=require(resolve(out,'OrderPresentation.js'));
const defs=[
  {id:'late',dueDay:4}, {id:'done',dueDay:1}, {id:'active',dueDay:3},
  {id:'available',dueDay:2}, {id:'future',dueDay:5}, {id:'failed',dueDay:1},
];
const states=[{id:'done',status:'done'},{id:'active',status:'active'},{id:'failed',status:'failed'}];
const earliest={future:3};
const group=(name,day=2)=>ordersForGroup(defs,states,day,earliest,name).map(o=>o.id);
assert.deepEqual(group('current'),['active','available','late'],'actionable orders lead with in-progress, then nearest deadline');
assert.deepEqual(group('history'),['done','failed'],'completed and expired orders belong in history');
assert.deepEqual(group('upcoming'),['future'],'unopened orders have their own group');
assert.deepEqual(group('upcoming',3),[],'day transition promotes unlocked work into the current group');
assert.ok(group('current',3).includes('future'));
const current=ordersForGroup(defs,states,2,earliest,'current');
assert.equal(selectedOrderId(current,'failed'),'active','an expired selection cannot become the default actionable target');
assert.equal(selectedOrderId(current,'late'),'late','retain a user-selected order while it remains in the group');
assert.equal(selectedOrderId([], 'active'),'','an empty group has no stale selection');
assert.deepEqual(defs.map(o=>o.id),['late','done','active','available','future','failed'],'presentation must not mutate catalogue order');
assert.deepEqual(ordersForGroup(defs,[...states,{id:'future',status:'done'}],1,earliest,'history').map(o=>o.id),['future','done','failed'],'saved completion takes precedence over an unlock date');
assert.deepEqual(ordersForGroup([{id:'later-unlock',dueDay:4},{id:'next-unlock',dueDay:5}],[],1,{'later-unlock':4,'next-unlock':2},'upcoming').map(o=>o.id),['next-unlock','later-unlock'],'future work is ordered by the day it becomes available');
console.log('Order presentation: 11 assertions passed.');
