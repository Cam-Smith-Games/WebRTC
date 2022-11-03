/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
            const local = this.local;
            const host = JSON.parse(window.prompt("Paste Host Session"));
            var p = this.getCandidates();
            yield local.setRemoteDescription(host);
            const answer = yield local.createAnswer();
            yield local.setLocalDescription(answer);
            const candidate_count = yield p;
            console.log(`found ${candidate_count} ICE candidates...`);
            // receiving a data channel...
            local.ondatachannel = (event) => {
                console.log("CLIENT: data channel!");
                this.channel_init(event.channel);
            };
            const client_json = JSON.stringify(local.localDescription.toJSON());
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
            const local = this.local;
            // receiving a data channel...
            local.ondatachannel = function (event) {
                console.log("HOST: data channel!");
            };
            this.channel_init(local.createDataChannel("data"));
            // todo: prompt room_id here
            const offer = yield local.createOffer({
                offerToReceiveAudio: true,
                //offerToReceiveVideo: true
                offerToReceiveVideo: true
            });
            yield local.setLocalDescription(offer);
            const host_json = JSON.stringify(local.localDescription.toJSON());
            yield navigator.clipboard.writeText(host_json);
            this.log("copied host desc to clipboard...");
            const json = window.prompt("Paste Remote Answer");
            const remote = JSON.parse(json);
            console.log("remote desc:", remote);
            var p = this.getCandidates();
            yield local.setRemoteDescription(remote);
            const candidate_count = yield p;
            console.log(`found ${candidate_count} candidates`);
            console.log(local);
            local.onconnectionstatechange = function (e) {
                console.log("connection state change: ", e);
                console.log("state: ", local.connectionState);
                if (local.connectionState == "connected") {
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
    constructor(local) {
        this.local = local;
    }
    send(data) {
        this.channel.send(data);
    }
    log(message) {
        const div = document.createElement("div");
        div.innerText = message;
        document.getElementsByTagName("main")[0].append(div);
    }
    channel_init(channel) {
        this.channel = channel;
        // debug
        const btnSend = document.getElementById("btnSend");
        channel.onopen = channel.onclose = function handleSendChannelStatusChange(event) {
            console.log("channel status change: ", event);
            if (channel) {
                console.log("channel status: ", channel.readyState);
                btnSend.disabled = channel.readyState != "open";
            }
            else
                btnSend.disabled = true;
        };
        channel.onmessage = (e) => {
            console.log("handleReceiveMessage: ", e);
            this.log(e.data);
        };
    }
    /** resolves once null candidate is found (which apparently signifies end of candidate list) */
    getCandidates() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: i foresee issues with "ice trickling here"
            let candidate_count = 0;
            return new Promise((resolve, reject) => {
                this.local.onicecandidate = (event) => __awaiter(this, void 0, void 0, function* () {
                    //console.log("CANDIDATE: ", event); 
                    if (event.candidate) {
                        try {
                            yield this.local.addIceCandidate(event.candidate);
                            candidate_count++;
                        }
                        catch (error) {
                            console.error("failed to add candidate: ", { event, error });
                            reject(error);
                        }
                    }
                    else {
                        resolve(candidate_count);
                    }
                });
            });
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
/* harmony import */ var _peer_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./peer/client */ "./src/peer/client.ts");
/* harmony import */ var _peer_host__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./peer/host */ "./src/peer/host.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


// ISSUE: need TURN for certains situations (like VPNs or symmetric NATs or w/e)
//          but these free public turn servers are disconnecting and lagging like crazy.
//          not sure if it's because TCP is slower or just the servers are bad
const local = new RTCPeerConnection({
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
    ]
});
let peer;
// #region hosting...
const btnHost = document.getElementById("btnHost");
btnHost.onclick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        btnHost.disabled = btnJoin.disabled = true;
        peer = new _peer_host__WEBPACK_IMPORTED_MODULE_1__.Host(local);
        yield peer.init();
    });
};
// #endreigon
// #region joining...
const btnJoin = document.getElementById("btnJoin");
btnJoin.onclick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        btnJoin.disabled = btnHost.disabled = true;
        peer = new _peer_client__WEBPACK_IMPORTED_MODULE_0__.Client(local);
        yield peer.init();
    });
};
// #endregion
const btnSend = document.getElementById("btnSend");
btnSend.onclick = function () {
    peer.send("data from send button!");
};

})();

/******/ })()
;
//# sourceMappingURL=main.js.map