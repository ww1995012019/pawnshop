import {Label} from 'cc';

/** Small, interruptible presentation beats; never owns model state or input locks. */
export class GamePresentation {
  private speech:{label:Label;hint:Label|null;text:string[];elapsed:number}|null=null;
  private seen=new Set<string>();
  reducedMotion=false;

  speak(label:Label,text:string,key:string,hint:Label|null=null):void {
    this.reveal();
    if(this.reducedMotion||this.seen.has(key)){label.string=text;if(hint)hint.string='';return;}
    this.seen.add(key);if(this.seen.size>80)this.seen.delete(this.seen.values().next().value!);
    label.string='';if(hint)hint.string='点击显示全文';
    this.speech={label,hint,text:Array.from(text),elapsed:0};
  }
  reveal():void {
    const speech=this.speech;this.speech=null;
    if(speech?.label.isValid)speech.label.string=speech.text.join('');
    if(speech?.hint?.isValid)speech.hint.string='';
  }
  update(dt:number):void {
    const delta=Math.max(0,Math.min(.25,dt));
    const speech=this.speech;
    if(speech){
      if(!speech.label.isValid)this.speech=null;
      else if(this.reducedMotion)this.reveal();
      else{speech.elapsed+=delta;const visible=Math.min(speech.text.length,Math.floor(speech.elapsed*38));speech.label.string=speech.text.slice(0,visible).join('');if(visible===speech.text.length)this.reveal();}
    }
  }
  dispose():void{this.reveal();this.seen.clear();}
}
