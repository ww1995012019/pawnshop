import {getNpc} from './data';
import type {OrbitalState} from './types';
type Stage='arrival'|'counter'|'agreed'|'refused';
const hash=(s:string):number=>{let n=2166136261;for(let i=0;i<s.length;i++){n^=s.charCodeAt(i);n=Math.imul(n,16777619);}return n>>>0;};
/** Repeatable voices depend on this visit, not on render count or a hidden reroll. */
export function npcDialogue(s:Pick<OrbitalState,'seed'|'day'|'cursor'>,npcId:string,stage:Stage,fallback:string,price=0):string {
 const lines=getNpc(npcId).voice?.[stage];
 if(!lines?.length)return fallback;
 return lines[hash(`${s.seed}/${s.day}/${s.cursor}/${npcId}/${stage}`)%lines.length].replace(/\{price\}/g,String(price));
}
