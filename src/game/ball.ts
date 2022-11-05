import { ICircle } from "../math/geom";
import { IPongObject, PongObject } from "./object";
import { PeerGame } from "./peer_game";

interface IBall extends IPongObject, ICircle {};

export class Ball extends PongObject implements ICircle {
    radius: number;
    
    constructor(obj:IBall) {
        super(obj);
    }

    update(delta:number, game:PeerGame<any>) {

    }

    render(game:PeerGame<any>) {
        game.ctx.fillStyle = this.color;
        game.ctx.beginPath();
        game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        game.ctx.fill();
    }
}

