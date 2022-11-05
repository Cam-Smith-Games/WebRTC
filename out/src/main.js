var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ClientPlayer, HostPlayer } from "./game/peer_game.js";
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
let player;
// #region hosting...
const btnHost = document.getElementById("btnHost");
btnHost.onclick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        btnHost.disabled = btnJoin.disabled = true;
        player = new HostPlayer(rtc, {
            x: 0, y: 0,
            color: "red",
            w: 10, h: 50,
        });
        console.log("HOST PLAYER: ", player);
        yield player.init();
        console.log("HOST INIT COMPLETE");
    });
};
// #endreigon
// #region joining...
const btnJoin = document.getElementById("btnJoin");
btnJoin.onclick = function () {
    return __awaiter(this, void 0, void 0, function* () {
        btnJoin.disabled = btnHost.disabled = true;
        player = new ClientPlayer(rtc, {
            x: 0, y: 0,
            color: "red",
            w: 10, h: 50
        });
        console.log("CLIENT PLAYER: ", player);
        yield player.init();
        console.log("CLIENT INIT COMPLETE");
    });
};
// #endregion
const btnSend = document.getElementById("btnSend");
btnSend.onclick = function () {
    //player.send("data from send button!");
};
//# sourceMappingURL=main.js.map