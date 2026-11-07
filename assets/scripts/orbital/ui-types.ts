import type {Node} from 'cc';
import type {ButtonOptions} from '../ui/GameUI';
import type {OrbitalUI} from './OrbitalUI';
import type {OrbitalAction,OrbitalPrefs,OrbitalState,PageId} from './types';
export interface OrbitalHost {
  ui:OrbitalUI;
  readonly state:OrbitalState;
  selected:string;
  prefs:OrbitalPrefs;
  readonly busy:boolean;
  dispatch(action:OrbitalAction):void;
  navigate(page:PageId,uid?:string):void;
  select(uid:string):void;
  render():void;
  button(parent:Node,text:string,x:number,y:number,w:number,h:number,fn:()=>void,options?:ButtonOptions):Node;
  effect(kind:string,parent:Node,at?:{x:number;y:number;width?:number;height?:number}):void;
  savePrefs():void;
  exportSave():void;
  resetGame():void;
}
