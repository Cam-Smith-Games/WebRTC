import { Peer } from "./peer";

export class Client extends Peer {
    
    public async init() {
        const rtc = this.rtc;

        const host:RTCSessionDescription = JSON.parse(window.prompt("Paste Host Session"));

        var p = this.getCandidates();

        await rtc.setRemoteDescription(host);
        const answer = await rtc.createAnswer();
        await rtc.setLocalDescription(answer)

        const candidate_count = await p;
        console.log(`found ${candidate_count} ICE candidates...`);


        

        // receiving a data channel...
        rtc.ondatachannel = (event) => {
            console.log("CLIENT: data channel!");
            this.channel_init(event.channel);    
        }


        const client_json = JSON.stringify(rtc.localDescription.toJSON());
        //console.log("CLIENT: ");
        //console.log(client_json);
        await navigator.clipboard.writeText(client_json);
        this.log("copied client desc to clipboard...");
    }
}