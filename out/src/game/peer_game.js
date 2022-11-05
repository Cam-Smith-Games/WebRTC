var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { vec } from "../math/vec.js";
import { Host } from "../peer/host.js";
import { KeyHandler } from "./keys.js";
export class PeerGame {
    constructor(rtc) {
        // #region update
        this.frame_count = 0; // number of frames for this current second
        this.fps = 0; // current fps
        this.mouse = {
            x: 0,
            y: 0,
            released: false,
            down: false,
            right: false
        };
        const canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = 1920;
        canvas.height = 1080;
        this.ctx = canvas.getContext("2d");
        // TODO: does key handler go on player? im so confused about what goes where rn
        this.players = [this.host, this.client];
        this.keys = new KeyHandler({});
    }
    update() {
        this.frame_count++;
        let time = performance.now();
        let delta = this.last_time ? Math.min(PeerGame.MAX_DELTA, (time - this.last_time) / 1000) : 0;
        this.keys.handle(this);
        this.render();
        //let post_render = performance.now();
        //let update_time = post_update - pre_update;
        //let render_time = post_render - post_update;
        //console.log({update_time, render_time});
        this.last_time = time;
        this.keys.update();
        // "mouse.down" is kept for 1 frame after release to handle mouse drags (i.e. mouse.down -> mouse.x/y = drag vector)
        if (this.mouse.released) {
            this.mouse.released = false;
            this.mouse.down = null;
        }
        this.mouse.right = false;
        return delta;
    }
    // #endregion
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let p of this.players)
            p.render(this);
        this.ball.render(this);
        requestAnimationFrame(this.render);
    }
}
/** when tabbing out or stoppping on a breakpoint, delta gets way too large. putting a cap on it to prevent massive movement spikes after resuming */
PeerGame.MAX_DELTA = 1 / 30;
class PongObject {
    constructor(obj) {
        Object.assign(this, obj);
    }
}
export class Player extends PongObject {
    constructor(obj) {
        super(obj);
    }
    /** resolves init promise. called when "init" message is received by other player */
    init_resolve(value) { }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let init_promise = new Promise((resolve, _) => resolve = this.init_resolve);
            yield this.peer.init();
            console.log("sending init message...");
            this.peer.send({ type: "init", data: "hello" });
            yield init_promise;
        });
    }
    render(game) {
        game.ctx.fillStyle = this.color;
        game.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
export class HostPlayer extends Player {
    constructor(rtc, obj) {
        super(obj);
        this.peer = new Host({
            rtc,
            message_handler: {
                "init": (data) => this.init_resolve(data)
            }
        });
    }
    update(delta, game) {
        // todo: clamp within this player's half
        let client_pos = game.mouse;
        const pos = vec.lerp(client_pos, this.host_pos, this.lerp_prog);
        this.x = pos.x;
        this.y = pos.y;
    }
}
export class ClientPlayer extends Player {
    constructor(rtc, obj) {
        super(obj);
        this.peer = new Host({
            rtc,
            message_handler: {
                "init": (data) => this.init_resolve(data)
            }
        });
    }
    update(delta, game) {
    }
}
;
class Ball extends PongObject {
    constructor(obj) {
        super(obj);
    }
    update(delta, game) {
    }
    render(game) {
        game.ctx.fillStyle = this.color;
        game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    }
}
const geom = {
    /** returns true if the specified axis-aligned bounding box contains the point.
    * @note this doesn't take rotation into account, it requies rectangle and point being aligned on the same axis. If rotation is necessary, create an instance of RectangleShape, which handles rotation */
    AABBContainsPoint: (r, p) => !(r.x > p.x || p.x > r.x + r.w || r.y > p.y || p.y > r.y + r.h),
    AABBCollision: (r1, r2) => !(r2.x > (r1.x + r1.w) || (r2.x + r2.w) < r1.x || r2.y > (r1.y + r1.h) || (r2.y + r2.h) < r1.y),
};
//# sourceMappingURL=peer_game.js.map