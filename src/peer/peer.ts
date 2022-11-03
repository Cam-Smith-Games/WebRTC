export abstract class Peer {

    protected local:RTCPeerConnection;
    protected channel:RTCDataChannel;

    constructor(local:RTCPeerConnection) {
        this.local = local;
    }

    public abstract init():Promise<void>;

    send(data:string) {
        this.channel.send(data);
    }

    log(message:string) {
        const div = document.createElement("div");
        div.innerText = message;
        document.getElementsByTagName("main")[0].append(div);
    }
    

    channel_init(channel:RTCDataChannel) {
        this.channel = channel;

        // debug
        const btnSend = <HTMLButtonElement> document.getElementById("btnSend");

        channel.onopen = channel.onclose =  function handleSendChannelStatusChange(event) {
            console.log("channel status change: ", event);
            if (channel) {
                console.log("channel status: ", channel.readyState);
                btnSend.disabled = channel.readyState != "open"
            }
            else btnSend.disabled = true;
        };

        channel.onmessage = (e) => {
            console.log("handleReceiveMessage: ", e);    
            this.log(e.data);
        };

        
    }

    /** resolves once null candidate is found (which apparently signifies end of candidate list) */
    async getCandidates() {
        // TODO: i foresee issues with "ice trickling here"
        
        let candidate_count = 0;
        return new Promise((resolve, reject) => {

            this.local.onicecandidate = async (event:RTCPeerConnectionIceEvent) => {
                //console.log("CANDIDATE: ", event); 
            
                if (event.candidate) {
                    try { 
                        await this.local.addIceCandidate(event.candidate);
                        candidate_count++;

                    } 
                    catch (error) {
                        console.error("failed to add candidate: ", { event, error });
                        reject(error);
                    }
                }
                else {
                    resolve(candidate_count);
                }
            
            }
            

        })
    }



}