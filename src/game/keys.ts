

type KeyStatus = "down" | "held" | "up";

/** actions to execute for specific Key Status */
type KeyActionMap = Partial<Record<KeyStatus, Record<string, Function>>>;


export class KeyHandler implements KeyActionMap {

    down:Record<string,Function>
    held:Record<string,Function>
    up:Record<string,Function>


    /** object containing status of a specific key */
    keys:Record<KeyStatus,Record<string,boolean>> = {
        /** true for 1 frame when key is pressed */
        down:{},
        /* true for entire hold duration between down and up */
        held:{},
        /** true for 1 frame when key is released */
        up:{}  
    };

    constructor(args?:KeyActionMap) {
        this.down = args?.down || {};
        this.held = args?.held || {};
        this.up = args?.up || {};
    }

    /** executes relevant actions based on key status */
    handle(...args:any[]) {
        for (let key in this.keys.down)     if (key in this.down)       this.down[key](...args)  
        for (let key in this.keys.held)     if (key in this.held)       this.held[key](...args)   
        for (let key in this.keys.up)       if (key in this.up)         this.up[key](...args)
    }

    update() {
        for (let key in this.keys.down) this.keys.held[key] = true;
        for (let key in this.keys.up) delete this.keys.held[key];

        // up/down only kept for 1 frame
        this.keys.down = {};
        this.keys.up = {};
    }
    
}