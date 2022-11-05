import { SuperPromise } from "../util/promise";

export interface IMessage<T> {
    type:string,
    data: T

}

export interface IPeer {
    rtc:RTCPeerConnection;
    /** maps message type to action */
    message_handler?: Record<string,Function>;
}




export abstract class Peer {

    protected rtc:RTCPeerConnection;
    protected channel:RTCDataChannel;
    protected message_handler: Record<string,Function>;


    constructor(obj:IPeer) {
        this.rtc = obj.rtc;
        this.message_handler = obj.message_handler || {};
    }
    public abstract init():Promise<void>;
  

    send(msg:IMessage<any>) { 
        this.channel.send(JSON.stringify(msg)); 
    }

    log(message:string) {
        const div = document.createElement("div");
        div.innerText = message;
        document.getElementsByTagName("main")[0].append(div);
    }


    /** collection of promise resolvers for each status type. whenever data channel changes status, it will resolve these promises */
    private channel_resolve: Record<RTCDataChannelState,SuperPromise<any>[]> = {
        "closed": [],
        "closing": [],
        "connecting": [],
        "open": []
    };

    /** waits for channel status to be "open" */
    waitForChannel(status:RTCDataChannelState = "open") {
        if (this.channel?.readyState == status) return Promise.resolve();

        let promise = new SuperPromise();
        this.channel_resolve[status].push(promise);

        console.log("channel_resolve: ", this.channel_resolve);

        return promise.promise;
    }

    // #region waiting for messages
    private message_resolve: Record<string, SuperPromise<any>[]> = {};
    /** resolves with the next message of specified type  */
    waitForMessage<T>(type:string) {
        let promise = new SuperPromise<T>();

        let array;
        if (!(type in this.message_resolve)) array = this.message_resolve[type] = [];
        else array = this.message_resolve[type];
        array.push(promise);

        return promise.promise;
    }
    // #endregion


    channel_init(channel:RTCDataChannel) {
        this.channel = channel;

        // debug
        const btnSend = <HTMLButtonElement> document.getElementById("btnSend");

        channel.onopen = channel.onclose =  (event) => {
            console.log("channel status change: ", event);
            if (channel) {
                console.log("channel status: ", {
                    channel,
                    readyState: channel.readyState,
                    channel_resolve: this.channel_resolve
                });

                let resolvers = this.channel_resolve[channel.readyState];
                for(let promise of resolvers) promise.resolve(null);
                resolvers = [];
                
                btnSend.disabled = channel.readyState != "open"
            }
            else btnSend.disabled = true;
        };

        channel.onmessage = (e) => {

            try {
                let msg = <IMessage<any>>JSON.parse(e.data);

                // executing via message handler
                if (msg.type in this.message_handler) {
                    this.message_handler[msg.type](msg.data);
                }
                else {
                    console.log("invalid message type: ", msg.type);
                }

                // resolve message awaiters
                if (msg.type in this.message_resolve) {
                    for (let promise of this.message_resolve[msg.type]) promise.resolve(msg.data);
                    delete this.message_resolve[msg.type];
                }

            }
            catch (ex) {
                console.error("Error parsing channel data: ", { event: e, exception: ex });
            }
            //this.log(e.data);
        };

        
    }

    /** resolves once null candidate is found (which apparently signifies end of candidate list) */
    async getCandidates() {
        // TODO: i foresee issues with "ice trickling here"
        
        let candidate_count = 0;
        return new Promise((resolve, reject) => {

            const style = "color:#099";

            this.rtc.onicecandidate = async (event:RTCPeerConnectionIceEvent) => {
                console.log("%cICE Candidate: ", style, event); 
            
                if (event.candidate) {
                    try { 
                        console.log("%cAdding Ice Candidate: ", style, event.candidate);
                        await this.rtc.addIceCandidate(event.candidate);
                        candidate_count++;
                    } 
                    catch (error) {
                        console.error("%cFailed to add ICE Candidate: ", style, { event, error });
                        reject(error);
                    }
                }
                else {
                    console.log(`%cNull Candidate Found. Resolving with ${candidate_count}...`, style)
                    resolve(candidate_count);
                }
            
            }
            

        })
    }



}