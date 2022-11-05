import { IPoint } from "../math/geom";
import { vec } from "../math/vec";
import { Client } from "../peer/client";
import { Host } from "../peer/host";
import { IMessage, Peer } from "../peer/peer";
import { SuperPromise } from "../util/promise";
import { IPongObject, PongObject } from "./object";
import { PeerGame } from "./peer_game";

export class Player extends PongObject  {
    update(delta: number, game: any) {
    }

    render(game:PeerGame<any>) {
        //console.log("rendering...", this);
        game.ctx.fillStyle = this.color;
        game.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}



/** Remote Player is a bit more complicated than local player because it needs to interpolate between client position and true host position */
export class RemotePlayer extends Player {

    /** true position on host-side */
    host_pos:IPoint;


    /** current progress interpolating between client pos and host pos. gets reset everytime host responds with true position  */
    lerp_prog:number;


    override update(delta:number, game:PeerGame<any>) {
        // todo: clamp within this player's half
        let client_pos = game.mouse;

        const pos = vec.lerp(client_pos, this.host_pos, this.lerp_prog);     
        this.x = pos.x;
        this.y = pos.y;   
    }

}

