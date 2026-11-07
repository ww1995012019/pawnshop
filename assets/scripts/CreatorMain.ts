import {_decorator} from 'cc';
import {OrbitalMain} from './orbital/OrbitalMain';
const {ccclass}=_decorator;
/** Keep the standard Creator scene's script UUID while using the approved design. */
@ccclass('CreatorMain')
export class CreatorMain extends OrbitalMain {}
