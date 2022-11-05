import { IRect } from "../math/geom";
import { PeerGame } from "./peer_game";


export interface IRenderable { 
    color:string;
}
/** Base GameObject that all objects inherit from
 * 
 * NOTE: the ball actually has a rectangle hitbox. 
 *          Don't feel like doing Rect->Circle collision rn so i'm saving it for later 
 */


 export interface IPongObject extends IRect, IRenderable {}
 export abstract class PongObject implements IPongObject {
  
     color:string; x:number; y:number; w:number; h:number;
 
     constructor(obj?:IPongObject) {
         Object.assign(this, obj); 
     }
 
 
     abstract update(delta:number, game:PeerGame<any>): void;
     abstract render(game:PeerGame<any>): void;
     
 }
 