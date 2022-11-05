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
export class Client extends Peer {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const rtc = this.rtc;
            const host = JSON.parse(window.prompt("Paste Host Session"));
            var p = this.getCandidates();
            yield rtc.setRemoteDescription(host);
            const answer = yield rtc.createAnswer();
            yield rtc.setLocalDescription(answer);
            const candidate_count = yield p;
            console.log(`found ${candidate_count} ICE candidates...`);
            // receiving a data channel...
            rtc.ondatachannel = (event) => {
                console.log("CLIENT: data channel!");
                this.channel_init(event.channel);
            };
            const client_json = JSON.stringify(rtc.localDescription.toJSON());
            //console.log("CLIENT: ");
            //console.log(client_json);
            yield navigator.clipboard.writeText(client_json);
            this.log("copied client desc to clipboard...");
        });
    }
}
//# sourceMappingURL=client.js.map