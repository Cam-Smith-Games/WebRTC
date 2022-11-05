/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game/ball.ts":
/*!**************************!*\
  !*** ./src/game/ball.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ball": () => (/* binding */ Ball)
/* harmony export */ });
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object */ "./src/game/object.ts");

;
class Ball extends _object__WEBPACK_IMPORTED_MODULE_0__.PongObject {
    constructor(obj) {
        super(obj);
    }
    update(delta, game) {
    }
    render(game) {
        game.ctx.fillStyle = this.color;
        game.ctx.beginPath();
        game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        game.ctx.fill();
    }
}


/***/ }),

/***/ "./src/game/keys.ts":
/*!**************************!*\
  !*** ./src/game/keys.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KeyHandler": () => (/* binding */ KeyHandler)
/* harmony export */ });
class KeyHandler {
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


/***/ }),

/***/ "./src/game/object.ts":
/*!****************************!*\
  !*** ./src/game/object.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PongObject": () => (/* binding */ PongObject)
/* harmony export */ });
class PongObject {
    constructor(obj) {
        Object.assign(this, obj);
    }
}


/***/ }),

/***/ "./src/game/peer_game.ts":
/*!*******************************!*\
  !*** ./src/game/peer_game.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClientGame": () => (/* binding */ ClientGame),
/* harmony export */   "HostGame": () => (/* binding */ HostGame),
/* harmony export */   "PeerGame": () => (/* binding */ PeerGame)
/* harmony export */ });
/* harmony import */ var _peer_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../peer/client */ "./src/peer/client.ts");
/* harmony import */ var _peer_host__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../peer/host */ "./src/peer/host.ts");
/* harmony import */ var _util_mouse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/mouse */ "./src/util/mouse.ts");
/* harmony import */ var _ball__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ball */ "./src/game/ball.ts");
/* harmony import */ var _keys__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./keys */ "./src/game/keys.ts");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./player */ "./src/game/player.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






class PeerGame {
    constructor(rtc) {
        // #region update
        this.frame_count = 0; // number of frames for this current second
        this.fps = 0; // current fps
        this.mouse = {
            x: 0,
            y: 0,
            released: false,
            down: null,
            right: false
        };
        this.rtc = rtc;
        const canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = 1920;
        canvas.height = 1080;
        this.ctx = canvas.getContext("2d");
        // TODO: does key handler go on player? im so confused about what goes where rn
        this.keys = new _keys__WEBPACK_IMPORTED_MODULE_4__.KeyHandler({});
        // #region mouse events
        canvas.oncontextmenu = (e) => e.preventDefault();
        canvas.onmousemove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            let m = _util_mouse__WEBPACK_IMPORTED_MODULE_2__.Mouse.getMouse(e, canvas);
            this.mouse.x = m.x;
            this.mouse.y = m.y;
        };
        canvas.onmousedown = (e) => {
            // clicking onto game screen should unfocus any inputs (for example: inventory searchbox)
            for (let focus of document.querySelectorAll(":focus"))
                focus.blur();
            e.preventDefault();
            e.stopPropagation();
            if (e.button == 0) {
                this.mouse.down = _util_mouse__WEBPACK_IMPORTED_MODULE_2__.Mouse.getMouse(e, canvas);
            }
            else if (e.button == 2) {
                this.mouse.right = true;
            }
        };
        canvas.onmouseup = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.button == 0) {
                this.mouse.released = true;
            }
        };
        // #endregion
        this.player = new _player__WEBPACK_IMPORTED_MODULE_5__.Player({
            x: 0, y: 0,
            w: 10, h: 50,
            color: "red"
        });
        this.ball = new _ball__WEBPACK_IMPORTED_MODULE_3__.Ball({
            x: (canvas.width / 2) - 10,
            y: (canvas.height / 2) - 10,
            w: 20,
            h: 20,
            radius: 10,
            color: "yellow"
        });
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
        });
        return delta;
    }
    /** moves specified player to mouse position */
    movePlayer(player) {
        // TODO: bound within specified players half
        player.x = this.mouse.x - player.w / 2;
        player.y = this.mouse.y - player.h / 2;
    }
    // #endregion
    _render() { requestAnimationFrame(() => this.render()); }
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let p of this.players)
            p.render(this);
        this.ball.render(this);
        this._render();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.players = [this.player, this.remote];
            // hi adrian
            setInterval(() => this.update(), 1000 / 60);
            this._render();
        });
    }
    init_connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.peer.init();
            console.log("waiting for data channel to open...");
            yield this.peer.waitForChannel();
            console.log("sending init message...");
            let init_message = this.peer.waitForMessage("init");
            this.peer.send({ type: "init", data: this.player });
            let response = yield init_message;
            return response;
        });
    }
}
/** when tabbing out or stoppping on a breakpoint, delta gets way too large. putting a cap on it to prevent massive movement spikes after resuming */
PeerGame.MAX_DELTA = 1 / 30;
// TODO: move peers to the game object... they don't need to be on the palyer object
class HostGame extends PeerGame {
    constructor(rtc) {
        super(rtc);
        this.peer = new _peer_host__WEBPACK_IMPORTED_MODULE_1__.Host({
            rtc: this.rtc,
            message_handler: {
                // FUCK: host needs to interpolate as well
                //    it's just OPPONENT that needs to interpolate, whether theyre host or client is irrelevant
                "player": (obj) => {
                    this.remote.x = obj.x;
                    this.remote.y = obj.y;
                }
            }
        });
    }
    init() {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let client_obj = yield this.init_connect();
            console.log("CLIENT OBJ RECEIVED: ", client_obj);
            this.remote = new _player__WEBPACK_IMPORTED_MODULE_5__.RemotePlayer(client_obj);
            this.remote.color = "blue";
            console.log("HOST INIT COMPLETE");
            yield _super.init.call(this);
        });
    }
}
class ClientGame extends PeerGame {
    constructor(rtc) {
        super(rtc);
        this.player.color = "blue";
        this.peer = new _peer_client__WEBPACK_IMPORTED_MODULE_0__.Client({
            rtc: this.rtc,
            message_handler: {
                // FUCK: host needs to interpolate as well
                //    it's just OPPONENT that needs to interpolate, whether theyre host or client is irrelevant
                "player": (obj) => {
                    this.remote.x = obj.x;
                    this.remote.y = obj.y;
                }
            }
        });
    }
    init() {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let host_obj = yield this.init_connect();
            console.log("HOST OBJ RECEIVED: ", host_obj);
            this.remote = new _player__WEBPACK_IMPORTED_MODULE_5__.RemotePlayer(host_obj);
            console.log("CLIENT INIT COMPLETE");
            yield _super.init.call(this);
        });
    }
}


/***/ }),

/***/ "./src/game/player.ts":
/*!****************************!*\
  !*** ./src/game/player.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Player": () => (/* binding */ Player),
/* harmony export */   "RemotePlayer": () => (/* binding */ RemotePlayer)
/* harmony export */ });
/* harmony import */ var _math_vec__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../math/vec */ "./src/math/vec.ts");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./object */ "./src/game/object.ts");


class Player extends _object__WEBPACK_IMPORTED_MODULE_1__.PongObject {
    update(delta, game) {
    }
    render(game) {
        //console.log("rendering...", this);
        game.ctx.fillStyle = this.color;
        game.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
/** Remote Player is a bit more complicated than local player because it needs to interpolate between client position and true host position */
class RemotePlayer extends Player {
    update(delta, game) {
        // todo: clamp within this player's half
        let client_pos = game.mouse;
        const pos = _math_vec__WEBPACK_IMPORTED_MODULE_0__.vec.lerp(client_pos, this.host_pos, this.lerp_prog);
        this.x = pos.x;
        this.y = pos.y;
    }
}


/***/ }),

/***/ "./src/math/util.ts":
/*!**************************!*\
  !*** ./src/math/util.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ceilTo": () => (/* binding */ ceilTo),
/* harmony export */   "clamp": () => (/* binding */ clamp),
/* harmony export */   "floorTo": () => (/* binding */ floorTo),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "near": () => (/* binding */ near),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "roundTo": () => (/* binding */ roundTo),
/* harmony export */   "sum": () => (/* binding */ sum)
/* harmony export */ });
/** rounds number to nearest multiple of x
 * @example
 * round(12, 5) = 10
 * round(16, 7) = 14
*/
function round(num, x) {
    return Math.floor(num / x) * x;
}
function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}
/** returns true if absolute difference between two numbers lies within threshold (i.e. numbers are "close enough") */
function near(n1, n2, thresh = 0.1) {
    return Math.abs(n1 - n2) <= thresh;
}
/**
* @param start numnber to start at
* @param end number to end at
* @param perc percentage (0-1) between start and end
*/
function lerp(start, end, perc) {
    return (1 - perc) * start + (perc * end);
}
/** rounds x to nearest multiple of mult */
function roundTo(x, mult) {
    // use case: negative vectors on grid should round down, while positive should round up
    return (x > 0) ? ceilTo(x, mult) : floorTo(x, mult);
}
function ceilTo(x, mult) {
    return Math.ceil(x / mult) * mult;
}
function floorTo(x, mult) {
    return Math.floor(x / mult) * mult;
}


/***/ }),

/***/ "./src/math/vec.ts":
/*!*************************!*\
  !*** ./src/math/vec.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "vec": () => (/* binding */ vec)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/math/util.ts");

/** namespace containing utility functions for dealing with IVectors that aren't an instance of the Vector class */
const vec = {
    length: (v) => Math.sqrt(vec.lengthSquared(v)),
    lengthSquared: (v) => Math.pow(v.x, 2) + Math.pow(v.y, 2),
    mid: (v1, v2) => vec.scale(vec.add(v1, v2), 1 / 2),
    rotate: (v, radians, origin) => {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        if (origin) {
            return {
                x: (cos * (v.x - origin.x)) + (sin * (v.y - origin.y)) + origin.x,
                y: (cos * (v.y - origin.y)) - (sin * (v.x - origin.x)) + origin.y
            };
        }
        return {
            x: (cos * v.x) - (sin * v.y),
            y: (sin * v.x) + (cos * v.y)
        };
    },
    rotate_old: (v, radians, pivot = null) => {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let x, y;
        // not sure why rounding was necessary
        if (pivot) {
            x = Math.round((cos * (v.x - pivot.x)) -
                (sin * (v.y - pivot.y)) +
                pivot.x);
            y = Math.round((sin * (v.x - pivot.x)) +
                (cos * (v.y - pivot.y)) +
                pivot.y);
        }
        else {
            x = (cos * v.x) - (sin * v.y);
            y = (sin * v.x) + (cos * v.y);
        }
        return { x, y };
    },
    abs: (v) => ({ x: Math.abs(v.x), y: Math.abs(v.y) }),
    /**
     * @param start vector to start at
     * @param end vector to end at
     * @param t percentage (0-1) between start and end
     */
    lerp: (start, end, t) => ({
        x: (0,_util__WEBPACK_IMPORTED_MODULE_0__.lerp)(start.x, end.x, t),
        y: (0,_util__WEBPACK_IMPORTED_MODULE_0__.lerp)(start.y, end.y, t)
    }),
    equals: (v1, v2) => !(v1.x != v2.x || v1.y != v2.y),
    near: (v1, v2, thresh) => !(!(0,_util__WEBPACK_IMPORTED_MODULE_0__.near)(v1.x, v2.x, thresh) || !(0,_util__WEBPACK_IMPORTED_MODULE_0__.near)(v1.y, v2.y, thresh)),
    add: (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y }),
    subtract: (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y }),
    dist: (v1, v2) => vec.length(vec.subtract(v1, v2)),
    //distSquared: (v1:IVector, v2:IVector) => vec3.lengthSquared(vec3.subtract(v1, v2)),
    scale: (v, x, y = x) => ({ x: v.x * x, y: v.y * y }),
    multiply: (v1, v2) => ({ x: v1.x * v2.x, y: v1.y * v2.y }),
    divide: (v1, v2) => ({ x: v1.x / v2.x, y: v1.y / v2.y }),
    sign: (v) => ({ x: Math.sign(v.x), y: Math.sign(v.y) }),
    dot: (v1, v2) => v1.x * v2.x + v1.y * v2.y,
    cross: (v1, v2) => (v1.x * v2.y) - (v1.y * v2.x),
    unit: (v) => {
        let length = vec.length(v);
        // prevent division by zero
        return length ? vec.scale(v, 1 / length) : v;
    },
    normal: (v) => {
        return {
            x: -v.y,
            y: v.x
        };
    },
    /** projects point p onto vector v */
    project(point, line) {
        const denominator = vec.length(line);
        if (denominator == 0)
            return { x: 0, y: 0 };
        let dot = vec.dot(point, line);
        let dot2 = vec.dot(line, point);
        const scalar = dot / denominator;
        return vec.scale(line, scalar);
    },
    roundTo: (v, value) => ({ x: (0,_util__WEBPACK_IMPORTED_MODULE_0__.roundTo)(v.x, value), y: (0,_util__WEBPACK_IMPORTED_MODULE_0__.roundTo)(v.y, value) }),
    ceilTo: (v, value) => ({ x: (0,_util__WEBPACK_IMPORTED_MODULE_0__.ceilTo)(v.x, value), y: (0,_util__WEBPACK_IMPORTED_MODULE_0__.ceilTo)(v.y, value) }),
    floorTo: (v, value) => ({ x: (0,_util__WEBPACK_IMPORTED_MODULE_0__.floorTo)(v.x, value), y: (0,_util__WEBPACK_IMPORTED_MODULE_0__.floorTo)(v.y, value) }),
    roundToVec: (from, to) => ({ x: (0,_util__WEBPACK_IMPORTED_MODULE_0__.round)(from.x, to.x), y: (0,_util__WEBPACK_IMPORTED_MODULE_0__.round)(from.y, to.y) }),
    round: (v) => ({ x: Math.round(v.x), y: Math.round(v.y) }),
    ceil: (v) => ({ x: Math.ceil(v.x), y: Math.ceil(v.y) }),
    floor: (v) => ({ x: Math.floor(v.x), y: Math.floor(v.y) }),
    /** θ = acos [ (a · b) / (|a| |b|) ] */
    angleBetween: (v1, v2) => {
        return Math.acos(
        // doing a min here because it somehow became 1.00000002 one time which resulted in a NaN angle
        Math.min(1, vec.dot(v1, v2) / (vec.length(v1) * vec.length(v2))));
    },
    /** returns angle formed by 3 points (angle between the vectors formed by prev->center and center->next) */
    angle3: (prev, center, next) => {
        let seg1 = vec.subtract(prev, center);
        let seg2 = vec.subtract(next, center);
        return vec.angleBetween(seg1, seg2);
    },
    angle: (v) => {
        return Math.atan2(v.y, v.x);
    },
    angleTo: (v1, v2) => {
        let x_diff = v2.x - v1.x;
        let y_diff = v2.y - v1.y;
        return Math.atan2(y_diff, x_diff);
    },
    /** determines if point exists on line
     * @param l1 line start point
     * @param l2 line end point
     * @param p point to check
     * @param threshold threshold to account for rounding errors (higher # = less accurate)
     * @returns true if point p exists on line between l1 and l2 */
    contains(l1, l2, p, threshold = 0.001) {
        // distance from both endpoints to point
        let d = vec.dist(p, l1) + vec.dist(p, l2);
        // length of the line between l1 and l2
        let length = vec.dist(l1, l2);
        // if sum of two distances are equal to the line's length, the point is on the line
        return (0,_util__WEBPACK_IMPORTED_MODULE_0__.near)(d, length, threshold);
    },
    overlap: (p1, p2, p3, p4) => {
        let slope1 = (vec.angle(vec.subtract(p2, p1))); // + Math.PI) % Math.PI;
        let slope2 = (vec.angle(vec.subtract(p4, p3))); // + Math.PI) % Math.PI;
        let diff = Math.abs(slope2 - slope1);
        if ((0,_util__WEBPACK_IMPORTED_MODULE_0__.near)(diff, Math.PI, 0.01)) {
            // true if either line contains either of other lines endpoints
            return (vec.contains(p1, p2, p3) ||
                vec.contains(p1, p2, p4) ||
                vec.contains(p3, p4, p1) ||
                vec.contains(p3, p4, p2));
        }
        return false;
    },
    /** returns nearest point on infinite line */
    nearest_point: (line1, line2, pnt) => {
        var L2 = (((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)));
        if (L2 == 0)
            return null;
        var r = (((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y))) / L2;
        return {
            x: line1.x + (r * (line2.x - line1.x)),
            y: line1.y + (r * (line2.y - line1.y))
        };
    },
    /** returns nearest point on finite line segment */
    nearest_between: (A, B, P) => {
        const v = vec.subtract(B, A);
        const u = vec.subtract(A, P);
        const vu = vec.dot(v, u);
        const t = -vu / vec.square_diag(v);
        if (t >= 0 && t <= 1)
            return vec.lerp(A, B, t);
        const g0 = vec.square_diag(vec.subtract(A, P));
        const g1 = vec.square_diag(vec.subtract(B, P));
        return g0 <= g1 ? A : B;
    },
    /** length of hypotenuse squared */
    square_diag: (v) => {
        return Math.pow(v.x, 2) + Math.pow(v.y, 2);
    },
    /** returns the shortest distance to the (infinite) line */
    shortest_dist: (line1, line2, pnt) => {
        var L2 = (((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)));
        if (L2 == 0)
            return Infinity;
        var s = (((line1.y - pnt.y) * (line2.x - line1.x)) - ((line1.x - pnt.x) * (line2.y - line1.y))) / L2;
        return Math.abs(s) * Math.sqrt(L2);
    },
    /** returns intersection point of 2 vectors, or null if they don't intersect */
    intersect(p1, p2, p3, p4) {
        let x1 = p1.x;
        let x2 = p2.x;
        let x3 = p3.x;
        let x4 = p4.x;
        let y1 = p1.y;
        let y2 = p2.y;
        let y3 = p3.y;
        let y4 = p4.y;
        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4))
            return null;
        let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        // Lines are parallel
        if (denominator === 0)
            return null;
        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1)
            return null;
        return {
            x: x1 + ua * (x2 - x1),
            y: y1 + ua * (y2 - y1)
        };
    },
    /** converts a multi-dimensional array to list of IVectors
     * @example [[1,2]] -> [{x:1,y:2}] */
    fromArray: (array = []) => array.map(arr => ({ x: arr[0], y: arr[1] })),
    sum: (arr) => {
        let sum = { x: 0, y: 0 };
        for (let v of arr) {
            sum.x += v.x;
            sum.y += v.y;
        }
        return sum;
    },
    /** returns 0 if c is on the line, negative if point is to left of line, positive if point is to the right of line
     * @param a line point 1
     * @param b line point 2
     * @param c point to compare with line
     */
    line_point_dir: (a, b, c) => {
        return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    },
    copy: (v) => ({ x: v.x, y: v.y }),
};


/***/ }),

/***/ "./src/peer/client.ts":
/*!****************************!*\
  !*** ./src/peer/client.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Client": () => (/* binding */ Client)
/* harmony export */ });
/* harmony import */ var _peer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./peer */ "./src/peer/peer.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Client extends _peer__WEBPACK_IMPORTED_MODULE_0__.Peer {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const rtc = this.rtc;
            const host = JSON.parse(window.prompt("Paste Host Session"));
            var p = this.getCandidates();
            yield rtc.setRemoteDescription(host);
            const answer = yield rtc.createAnswer();
            yield rtc.setLocalDescription(answer);
            const candidate_count = yield p;
            console.log(`found ${candidate_count} ICE candidates...`);
            // receiving a data channel...
            rtc.ondatachannel = (event) => {
                console.log("CLIENT: data channel!");
                this.channel_init(event.channel);
            };
            const client_json = JSON.stringify(rtc.localDescription.toJSON());
            //console.log("CLIENT: ");
            //console.log(client_json);
            yield navigator.clipboard.writeText(client_json);
            this.log("copied client desc to clipboard...");
        });
    }
}


/***/ }),

/***/ "./src/peer/host.ts":
/*!**************************!*\
  !*** ./src/peer/host.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Host": () => (/* binding */ Host)
/* harmony export */ });
/* harmony import */ var _peer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./peer */ "./src/peer/peer.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Host extends _peer__WEBPACK_IMPORTED_MODULE_0__.Peer {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const rtc = this.rtc;
            // receiving a data channel...
            rtc.ondatachannel = function (event) {
                console.log("HOST: data channel!");
            };
            this.channel_init(rtc.createDataChannel("data"));
            // todo: prompt room_id here
            const offer = yield rtc.createOffer({
                offerToReceiveAudio: true,
                //offerToReceiveVideo: true
                offerToReceiveVideo: true
            });
            yield rtc.setLocalDescription(offer);
            const host_json = JSON.stringify(rtc.localDescription.toJSON());
            yield navigator.clipboard.writeText(host_json);
            this.log("copied host desc to clipboard...");
            const json = window.prompt("Paste Remote Answer");
            const remote = JSON.parse(json);
            console.log("Parsed Remote Description:", remote);
            var candidate_promise = this.getCandidates();
            yield rtc.setRemoteDescription(remote);
            console.log("Set Remote Description");
            const candidate_count = yield candidate_promise;
            console.log(`Fund ${candidate_count} ICE Candidates`);
            console.log(rtc);
            rtc.onconnectionstatechange = function (e) {
                console.log("connection state change: ", e);
                console.log("state: ", rtc.connectionState);
                if (rtc.connectionState == "connected") {
                    console.log("CONNECTED...");
                }
            };
        });
    }
}


/***/ }),

/***/ "./src/peer/peer.ts":
/*!**************************!*\
  !*** ./src/peer/peer.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Peer": () => (/* binding */ Peer)
/* harmony export */ });
/* harmony import */ var _util_promise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/promise */ "./src/util/promise.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Peer {
    constructor(obj) {
        /** collection of promise resolvers for each status type. whenever data channel changes status, it will resolve these promises */
        this.channel_resolve = {
            "closed": [],
            "closing": [],
            "connecting": [],
            "open": []
        };
        // #region waiting for messages
        this.message_resolve = {};
        this.rtc = obj.rtc;
        this.message_handler = obj.message_handler || {};
    }
    send(msg) {
        this.channel.send(JSON.stringify(msg));
    }
    log(message) {
        const div = document.createElement("div");
        div.innerText = message;
        document.getElementsByTagName("main")[0].append(div);
    }
    /** waits for channel status to be "open" */
    waitForChannel(status = "open") {
        var _a;
        if (((_a = this.channel) === null || _a === void 0 ? void 0 : _a.readyState) == status)
            return Promise.resolve();
        let promise = new _util_promise__WEBPACK_IMPORTED_MODULE_0__.SuperPromise();
        this.channel_resolve[status].push(promise);
        console.log("channel_resolve: ", this.channel_resolve);
        return promise.promise;
    }
    /** resolves with the next message of specified type  */
    waitForMessage(type) {
        let promise = new _util_promise__WEBPACK_IMPORTED_MODULE_0__.SuperPromise();
        let array;
        if (!(type in this.message_resolve))
            array = this.message_resolve[type] = [];
        else
            array = this.message_resolve[type];
        array.push(promise);
        return promise.promise;
    }
    // #endregion
    channel_init(channel) {
        this.channel = channel;
        // debug
        const btnSend = document.getElementById("btnSend");
        channel.onopen = channel.onclose = (event) => {
            console.log("channel status change: ", event);
            if (channel) {
                console.log("channel status: ", {
                    channel,
                    readyState: channel.readyState,
                    channel_resolve: this.channel_resolve
                });
                let resolvers = this.channel_resolve[channel.readyState];
                for (let promise of resolvers)
                    promise.resolve(null);
                resolvers = [];
                btnSend.disabled = channel.readyState != "open";
            }
            else
                btnSend.disabled = true;
        };
        channel.onmessage = (e) => {
            try {
                let msg = JSON.parse(e.data);
                // executing via message handler
                if (msg.type in this.message_handler) {
                    this.message_handler[msg.type](msg.data);
                }
                else {
                    console.log("invalid message type: ", msg.type);
                }
                // resolve message awaiters
                if (msg.type in this.message_resolve) {
                    for (let promise of this.message_resolve[msg.type])
                        promise.resolve(msg.data);
                    delete this.message_resolve[msg.type];
                }
            }
            catch (ex) {
                console.error("Error parsing channel data: ", { event: e, exception: ex });
            }
            //this.log(e.data);
        };
    }
    /** resolves once null candidate is found (which apparently signifies end of candidate list) */
    getCandidates() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: i foresee issues with "ice trickling here"
            let candidate_count = 0;
            return new Promise((resolve, reject) => {
                const style = "color:#099";
                this.rtc.onicecandidate = (event) => __awaiter(this, void 0, void 0, function* () {
                    console.log("%cICE Candidate: ", style, event);
                    if (event.candidate) {
                        try {
                            console.log("%cAdding Ice Candidate: ", style, event.candidate);
                            yield this.rtc.addIceCandidate(event.candidate);
                            candidate_count++;
                        }
                        catch (error) {
                            console.error("%cFailed to add ICE Candidate: ", style, { event, error });
                            reject(error);
                        }
                    }
                    else {
                        console.log(`%cNull Candidate Found. Resolving with ${candidate_count}...`, style);
                        resolve(candidate_count);
                    }
                });
            });
        });
    }
}


/***/ }),

/***/ "./src/util/mouse.ts":
/*!***************************!*\
  !*** ./src/util/mouse.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mouse": () => (/* binding */ Mouse)
/* harmony export */ });
/** mouse utility functions for converting window to canvas coordinates etc */
const Mouse = {
    getMouse(e, canvas) {
        // TODO: might need to account for canvas offset as well
        //       canvas is currently 100% width/height so not worrying about it
        let fit = this.getCanvasFit(canvas);
        return {
            x: (e.clientX - (canvas.clientWidth - fit.x) / 2) * canvas.width / fit.x,
            y: (e.clientY - (canvas.clientHeight - fit.y) / 2) * canvas.height / fit.y,
        };
    },
    // because canvas is using "object-fit:contain", need to account for black bars that are included in clientWidth/clientHeight
    getCanvasFit(canvas) {
        const ratio = canvas.width / canvas.height;
        const scaled = canvas.clientWidth / canvas.clientHeight;
        if (ratio > scaled) {
            // window is too narow -> vertical offset (black bars)
            return {
                x: canvas.clientWidth,
                y: canvas.clientWidth / ratio
            };
        }
        else {
            // window is too short, -> horizontal offset (black bars)
            return {
                x: canvas.clientHeight * ratio,
                y: canvas.clientHeight
            };
        }
    }
};


/***/ }),

/***/ "./src/util/promise.ts":
/*!*****************************!*\
  !*** ./src/util/promise.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SuperPromise": () => (/* binding */ SuperPromise)
/* harmony export */ });
/** promise that can be resolve/rejected from outside scope */
class SuperPromise {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_peer_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game/peer_game */ "./src/game/peer_game.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// PROCESS:
// Step #1: initiate connection
// Step #2: host creates game, sends an "init" message to client
// Step #3: client receives "init" message, creates game, sends "init" back with player info
// Step #4: both games are now updating and sending data back and forth while listening to input
//      - host is real-time input, no lag
//      - client is interpolating between client-side (fake) position and host-side (actual) position
//      - every update, client sends a message to host, and host sends a message to client
//          keep track of a latency?
// ISSUE: need TURN for certains situations (like VPNs or symmetric NATs or w/e)
//          but these free public turn servers are disconnecting and lagging like crazy.
//          not sure if it's because TCP is slower or just the servers are bad
const rtc = new RTCPeerConnection({
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
    ]
});
console.log("Connection: ", rtc);
// #region hosting...
const btnHost = document.getElementById("btnHost");
btnHost.onclick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        btnHost.disabled = btnJoin.disabled = true;
        let game = new _game_peer_game__WEBPACK_IMPORTED_MODULE_0__.HostGame(rtc);
        yield game.init();
    });
};
// #endreigon
// #region joining...
const btnJoin = document.getElementById("btnJoin");
btnJoin.onclick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        btnJoin.disabled = btnHost.disabled = true;
        let game = new _game_peer_game__WEBPACK_IMPORTED_MODULE_0__.ClientGame(rtc);
        yield game.init();
    });
};
// #endregion
const btnSend = document.getElementById("btnSend");
btnSend.onclick = function () {
    //player.send("data from send button!");
};

})();

/******/ })()
;
//# sourceMappingURL=main.js.map