var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Peer {
    constructor(obj) {
        this.rtc = obj.rtc;
        this.message_handler = obj.message_handler || {};
    }
    send(msg) {
        this.channel.send(JSON.stringify(msg));
    }
    log(message) {
        const div = document.createElement("div");
        div.innerText = message;
        document.getElementsByTagName("main")[0].append(div);
    }
    channel_init(channel) {
        this.channel = channel;
        // debug
        const btnSend = document.getElementById("btnSend");
        channel.onopen = channel.onclose = function handleSendChannelStatusChange(event) {
            console.log("channel status change: ", event);
            if (channel) {
                console.log("channel status: ", channel.readyState);
                btnSend.disabled = channel.readyState != "open";
            }
            else
                btnSend.disabled = true;
        };
        channel.onmessage = (e) => {
            console.log("handleReceiveMessage: ", e);
            try {
                let msg = JSON.parse(e.data);
                if (msg.type in this.message_handler) {
                    this.message_handler[msg.type](msg.data);
                }
                else {
                    console.log("invalid message type: ", msg.type);
                }
            }
            catch (ex) {
                console.error("Error parsing channel data: ", { event: e, exception: ex });
            }
            this.log(e.data);
        };
    }
    /** resolves once null candidate is found (which apparently signifies end of candidate list) */
    getCandidates() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: i foresee issues with "ice trickling here"
            let candidate_count = 0;
            return new Promise((resolve, reject) => {
                const style = "color:#099";
                this.rtc.onicecandidate = (event) => __awaiter(this, void 0, void 0, function* () {
                    console.log("%cICE Candidate: ", style, event);
                    if (event.candidate) {
                        try {
                            console.log("%cAdding Ice Candidate: ", style, event.candidate);
                            yield this.rtc.addIceCandidate(event.candidate);
                            candidate_count++;
                        }
                        catch (error) {
                            console.error("%cFailed to add ICE Candidate: ", style, { event, error });
                            reject(error);
                        }
                    }
                    else {
                        console.log(`%cNull Candidate Found. Resolving with ${candidate_count}...`, style);
                        resolve(candidate_count);
                    }
                });
            });
        });
    }
}
//# sourceMappingURL=peer.js.map