import { IPoint } from "../math/geom";
import { Client } from "../peer/client";
import { Host } from "../peer/host";
import { Peer } from "../peer/peer";
import { Mouse } from "../util/mouse";
import { SuperPromise } from "../util/promise";
import { Ball } from "./ball";
import { KeyHandler } from "./keys";
import { IPongObject } from "./object";
import { Player, RemotePlayer } from "./player";
/*

- keep track of time between peer messages
- if it exceeds threshold, classify it as a disconnect
    - in this case, it will pause the game and wait for anohter message
        - upon reconnection, it will demand a resync between the 2 clients:
            - game sends resync message, which fully updates peer to be in sync with host
            - game doesnt resuume until peer sends response message
            - this message will use label "host-sync" or something


 - game idea: SLING PONG
    - similiar to pong where u gotta get ball behind opponent's wall
    - move with mouse, bound to your half of table
    - left click to catch the ball
    - hold left click to prepare sling shot
    - pull it back then release to sling shot the ball

*/



// host moves like normal
// for other player:
//   player sends past X inputs
//   host receives input message, applies to player, responds with true player position
//   player receives true position, interpolates towards it
//      ideally youd just jump straight to correct position, but interpolating will result in smoother looking gameplay

interface IMouse extends IPoint {
    released: boolean,
    down: IPoint,
    right: boolean
}
export abstract class PeerGame<P extends Peer> {

    player: Player;
    remote: RemotePlayer;

    players:Player[];

    ball:Ball;

    ctx:CanvasRenderingContext2D;

    keys:KeyHandler;

    protected rtc:RTCPeerConnection;

    constructor(rtc:RTCPeerConnection) {
        this.rtc = rtc;

        const canvas = <HTMLCanvasElement>document.getElementsByTagName("canvas")[0];
        canvas.width = 1920;
        canvas.height = 1080;  
        this.ctx = canvas.getContext("2d");  


        // TODO: does key handler go on player? im so confused about what goes where rn
        


        this.keys = new KeyHandler({
        })


        // #region mouse events
         canvas.oncontextmenu = (e:MouseEvent) => e.preventDefault();
         canvas.onmousemove = (e:MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();      
    
            let m = Mouse.getMouse(e, canvas);
            this.mouse.x = m.x;
            this.mouse.y = m.y;
        };
        canvas.onmousedown =  (e:MouseEvent) => {
            // clicking onto game screen should unfocus any inputs (for example: inventory searchbox)
            for (let focus of document.querySelectorAll<HTMLElement>(":focus")) focus.blur();
            e.preventDefault();
            e.stopPropagation();  

            if (e.button == 0) {
                this.mouse.down = Mouse.getMouse(e, canvas);
            }  
            else if (e.button == 2) {
                this.mouse.right = true;
            }
        };
        canvas.onmouseup = (e:MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();  

            if (e.button == 0) {
                this.mouse.released = true;
            }
        };
        // #endregion


        this.player = new Player({ 
            x: 0, y: 0, 
            w: 10, h: 50, 
            color: "red" 
        });

        this.ball = new Ball({
            x: (canvas.width / 2) - 10,
            y: (canvas.height / 2) - 10,
            w: 20, 
            h: 20,
            radius: 10,
            color: "yellow" 
        })
    }

    // #region update
    private frame_count: number = 0;                 // number of frames for this current second
    private fps: number = 0;                         // current fps
    private last_time: number;                       // for tracking delta time
    private update_handle:number;                   // id to requestAnimationFrame (used for cancelling loop)
    /** when tabbing out or stoppping on a breakpoint, delta gets way too large. putting a cap on it to prevent massive movement spikes after resuming */
    static readonly MAX_DELTA = 1/30;


    mouse: IMouse = {
        x: 0,
        y: 0,
        released: false,
        down: null,
        right: false
    }

    update() {
        this.frame_count++;
        let time = performance.now();
        let delta = this.last_time ? Math.min(PeerGame.MAX_DELTA, (time - this.last_time) / 1000) : 0;

        this.keys.handle(this);


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


       this.movePlayer(this.player);

       this.peer.send({
            type: "player",
            data: { 
                x: this.player.x,
                y: this.player.y
            }
       })

       return delta;
   }

    /** moves specified player to mouse position */
    movePlayer(player:Player) {
        // TODO: bound within specified players half
        player.x = this.mouse.x - player.w / 2;
        player.y = this.mouse.y - player.h / 2;
    }
   // #endregion



    _render() { requestAnimationFrame(() => this.render()); }
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let p of this.players) p.render(this);
        this.ball.render(this);
        this._render();
    }


    async init() {

        this.players = [this.player, this.remote];

        // hi adrian
        setInterval(() => this.update(), 1000 / 60);

        this._render();
    }


    peer:P;
    protected async init_connect() {
        
        await this.peer.init();

        console.log("waiting for data channel to open...");
        await this.peer.waitForChannel();

        console.log("sending init message...");

        let init_message = this.peer.waitForMessage<IPongObject>("init");
        this.peer.send({ type: "init", data: this.player })
        let response = await init_message;

        return response;
    
    }
}




// TODO: move peers to the game object... they don't need to be on the palyer object


export class HostGame extends PeerGame<Host> {


    constructor(rtc:RTCPeerConnection) {
        super(rtc);
    
        this.peer = new Host({
            rtc: this.rtc,
            message_handler: {
                // FUCK: host needs to interpolate as well
                //    it's just OPPONENT that needs to interpolate, whether theyre host or client is irrelevant
                "player": (obj:IPongObject) => {    
                    this.remote.x = obj.x;
                    this.remote.y = obj.y;  
                }
            }   
        });



    }

    override async init() {   
        
        let client_obj = await this.init_connect();
        console.log("CLIENT OBJ RECEIVED: ", client_obj);
        this.remote = new RemotePlayer(client_obj); 
        this.remote.color = "blue";
        
    
        console.log("HOST INIT COMPLETE");

        await super.init();
    }


}

export class ClientGame extends PeerGame<Client> {

    constructor(rtc:RTCPeerConnection) {
        super(rtc);
    
        this.player.color = "blue";

        this.peer = new Client({
            rtc: this.rtc,
            message_handler: {
                // FUCK: host needs to interpolate as well
                //    it's just OPPONENT that needs to interpolate, whether theyre host or client is irrelevant
                "player": (obj:IPongObject) => {
                    this.remote.x = obj.x;
                    this.remote.y = obj.y;           
                }
            }   
        });



    }

    override async init() {
         
        let host_obj = await this.init_connect();

        console.log("HOST OBJ RECEIVED: ", host_obj);

        this.remote = new RemotePlayer(host_obj);

        console.log("CLIENT INIT COMPLETE");

        await super.init();
    }


}