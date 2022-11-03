export {};

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

let receiveChannel:RTCDataChannel;
const local = new RTCPeerConnection(RTCPeerConfig);
const remote = new RTCPeerConnection(RTCPeerConfig);


const sendChannel = local.createDataChannel("sendChannel");
sendChannel.onopen = sendChannel.onclose =  function handleSendChannelStatusChange(event) {
    console.log("send channel status change: ", event);
    if (sendChannel) {
        console.log("send channel status: ", sendChannel.readyState);

        btnSend.disabled = sendChannel.readyState != "open"
    }
};

// receiving a data channel...
remote.ondatachannel = function (event) {
    console.log("data channel!");

    receiveChannel = event.channel;
    receiveChannel.onmessage = function(e) {
        console.log("handleReceiveMessage: ", e);    

        const div = document.createElement("div");
        div.innerText = e.data;
        document.getElementsByTagName("main")[0].append(div);
    };

    receiveChannel.onopen = receiveChannel.onclose = function handleReceiveChannelStatusChange(e:Event) {
        console.log("Receive Channel status change...", e);
        if (receiveChannel) {
            console.log("Receive channel status: ", receiveChannel.readyState);
        }
    }
   
  }





const handleCandidateError = () => console.log("Oh no! addICECandidate failed!");
local.onicecandidate = (e:RTCPeerConnectionIceEvent) => !e.candidate || remote.addIceCandidate(e.candidate).catch(handleCandidateError);
remote.onicecandidate = (e:RTCPeerConnectionIceEvent) => !e.candidate || local.addIceCandidate(e.candidate).catch(handleCandidateError);


async function connect() {
    try {
        const offer = await local.createOffer()
        await local.setLocalDescription(offer);
        await remote.setRemoteDescription(local.localDescription);
        const answer = await remote.createAnswer();
        await remote.setLocalDescription(answer)
        await local.setRemoteDescription(remote.localDescription);
    }
    catch (e) {
        console.error("unable to create offer", e);
    }

}

connect();


const btnSend = <HTMLButtonElement>document.getElementById("btnSend");
btnSend.onclick = function() {
    sendChannel.send("data from send button!");
}
