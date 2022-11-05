export class KeyHandler {
    constructor(args) {
        /** object containing status of a specific key */
        this.keys = {
            /** true for 1 frame when key is pressed */
            down: {},
            /* true for entire hold duration between down and up */
            held: {},
            /** true for 1 frame when key is released */
            up: {}
        };
        this.down = (args === null || args === void 0 ? void 0 : args.down) || {};
        this.held = (args === null || args === void 0 ? void 0 : args.held) || {};
        this.up = (args === null || args === void 0 ? void 0 : args.up) || {};
    }
    /** executes relevant actions based on key status */
    handle(...args) {
        for (let key in this.keys.down)
            if (key in this.down)
                this.down[key](...args);
        for (let key in this.keys.held)
            if (key in this.held)
                this.held[key](...args);
        for (let key in this.keys.up)
            if (key in this.up)
                this.up[key](...args);
    }
    update() {
        for (let key in this.keys.down)
            this.keys.held[key] = true;
        for (let key in this.keys.up)
            delete this.keys.held[key];
        // up/down only kept for 1 frame
        this.keys.down = {};
        this.keys.up = {};
    }
}
//# sourceMappingURL=keys.js.map