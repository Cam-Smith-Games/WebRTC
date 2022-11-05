var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Peer } from "./peer";
export class Host extends Peer {
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
//# sourceMappingURL=host.js.map