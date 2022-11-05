var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// TODO: prompt on button click, this will uniquely identify the call. probably have the server generated it using a Guid or something
const call_id = "hello_world_help_me_ahhhhh";
//const ws = new WebSocket(`wss://${window.location.host}/ws/webrtc?id=${call_id}`);
//window.onpagehide = () => ws.close(); // trying to ensure websocket is getting closed... i think chrome already garbage collects but maybe not
// ISSUE: need TURN for certains situations (like VPNs or symmetric NATs or w/e)
//          but these free public turn servers are disconnecting and lagging like crazy.
//          not sure if it's because TCP is slower or just the servers are bad
const RTCPeerConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
    ]
};
let receiveChannel;
const local = new RTCPeerConnection(RTCPeerConfig);
const remote = new RTCPeerConnection(RTCPeerConfig);
const sendChannel = local.createDataChannel("sendChannel");
sendChannel.onopen = sendChannel.onclose = function handleSendChannelStatusChange(event) {
    console.log("send channel status change: ", event);
    if (sendChannel) {
        console.log("send channel status: ", sendChannel.readyState);
        btnSend.disabled = sendChannel.readyState != "open";
    }
};
// receiving a data channel...
remote.ondatachannel = function (event) {
    console.log("data channel!");
    receiveChannel = event.channel;
    receiveChannel.onmessage = function (e) {
        console.log("handleReceiveMessage: ", e);
        const div = document.createElement("div");
        div.innerText = e.data;
        document.getElementsByTagName("main")[0].append(div);
    };
    receiveChannel.onopen = receiveChannel.onclose = function handleReceiveChannelStatusChange(e) {
        console.log("Receive Channel status change...", e);
        if (receiveChannel) {
            console.log("Receive channel status: ", receiveChannel.readyState);
        }
    };
};
const handleCandidateError = () => console.log("Oh no! addICECandidate failed!");
local.onicecandidate = (e) => !e.candidate || remote.addIceCandidate(e.candidate).catch(handleCandidateError);
remote.onicecandidate = (e) => !e.candidate || local.addIceCandidate(e.candidate).catch(handleCandidateError);
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const offer = yield local.createOffer();
            yield local.setLocalDescription(offer);
            yield remote.setRemoteDescription(local.localDescription);
            const answer = yield remote.createAnswer();
            yield remote.setLocalDescription(answer);
            yield local.setRemoteDescription(remote.localDescription);
        }
        catch (e) {
            console.error("unable to create offer", e);
        }
    });
}
connect();
const btnSend = document.getElementById("btnSend");
btnSend.onclick = function () {
    sendChannel.send("data from send button!");
};
export {};
//# sourceMappingURL=rtc_test.js.map