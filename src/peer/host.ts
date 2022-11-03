import { Peer } from "./peer";

export class Host extends Peer {

    public async init() {
        const local = this.local;

        // receiving a data channel...
        local.ondatachannel = function (event) {
            console.log("HOST: data channel!");
        }

        this.channel_init(local.createDataChannel("data"));
        
        // todo: prompt room_id here

        const offer = await local.createOffer({
            offerToReceiveAudio: true, // these need to be true or else ice states remain "new" and you never receive any candidates...
            //offerToReceiveVideo: true
            offerToReceiveVideo: true
        })
        await local.setLocalDescription(offer);


        const host_json = JSON.stringify(local.localDescription.toJSON());

        await navigator.clipboard.writeText(host_json);
        this.log("copied host desc to clipboard...");

        const json = window.prompt("Paste Remote Answer");
        const remote:RTCSessionDescription = JSON.parse(json);
        console.log("remote desc:", remote);

        var p = this.getCandidates();

        await local.setRemoteDescription(remote);

        const candidate_count = await p;
        console.log(`found ${candidate_count} candidates`);

        console.log(local);


        local.onconnectionstatechange = function(e) {
            console.log("connection state change: ", e);
            console.log("state: ", local.connectionState);

            if (local.connectionState == "connected") {
            
                console.log("CONNECTED...");
            }
        }
    }
}