import { ClientGame, HostGame } from "./game/peer_game";
export {};



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
const btnHost = <HTMLButtonElement>document.getElementById("btnHost");
btnHost.onclick = async function() {
    btnHost.disabled = btnJoin.disabled = true;
    let game = new HostGame(rtc);
    await game.init();
}
// #endreigon



// #region joining...
const btnJoin = <HTMLButtonElement>document.getElementById("btnJoin");
btnJoin.onclick = async function() {
    btnJoin.disabled = btnHost.disabled = true;
    let game = new ClientGame(rtc);
    await game.init();
}
// #endregion


const btnSend = <HTMLButtonElement>document.getElementById("btnSend");
btnSend.onclick = function() {
    //player.send("data from send button!");
}


