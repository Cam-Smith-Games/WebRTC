import { Peer } from "./peer";

export class Host extends Peer {

    public async init() {
        const rtc = this.rtc;

        // receiving a data channel...
        rtc.ondatachannel = function (event) {
            console.log("HOST: data channel!");
        }

        this.channel_init(rtc.createDataChannel("data"));
        
        // todo: prompt room_id here

        const offer = await rtc.createOffer({
            offerToReceiveAudio: true, // these need to be true or else ice states remain "new" and you never receive any candidates...
            //offerToReceiveVideo: true
            offerToReceiveVideo: true
        })
        await rtc.setLocalDescription(offer);


        const host_json = JSON.stringify(rtc.localDescription.toJSON());

        await navigator.clipboard.writeText(host_json);
        this.log("copied host desc to clipboard...");

        const json = window.prompt("Paste Remote Answer");
        const remote:RTCSessionDescription = JSON.parse(json);
        console.log("Parsed Remote Description:", remote);

        var candidate_promise = this.getCandidates();

        await rtc.setRemoteDescription(remote);
        console.log("Set Remote Description");

        const candidate_count = await candidate_promise;
        console.log(`Fund ${candidate_count} ICE Candidates`);

        console.log(rtc);


        rtc.onconnectionstatechange = function(e) {
            console.log("connection state change: ", e);
            console.log("state: ", rtc.connectionState);

            if (rtc.connectionState == "connected") {
            
                console.log("CONNECTED...");
            }
        }
    }
}