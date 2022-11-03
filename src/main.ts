import { Client } from "./peer/client";
import { Host } from "./peer/host";
import { Peer } from "./peer/peer.js";

export {};


// ISSUE: need TURN for certains situations (like VPNs or symmetric NATs or w/e)
//          but these free public turn servers are disconnecting and lagging like crazy.
//          not sure if it's because TCP is slower or just the servers are bad

const local = new RTCPeerConnection({
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
    ]
});





let peer:Peer;

// #region hosting...
const btnHost = <HTMLButtonElement>document.getElementById("btnHost");
btnHost.onclick = async function() {
    btnHost.disabled = btnJoin.disabled = true;
    peer = new Host(local);
    await peer.init();
}
// #endreigon



// #region joining...
const btnJoin = <HTMLButtonElement>document.getElementById("btnJoin");
btnJoin.onclick = async function() {
    btnJoin.disabled = btnHost.disabled = true;
    peer = new Client(local);
    await peer.init();
}
// #endregion


const btnSend = <HTMLButtonElement>document.getElementById("btnSend");
btnSend.onclick = function() {
    peer.send("data from send button!");
}
