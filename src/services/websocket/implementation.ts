import {IMessageEvent, w3cwebsocket as W3CWebSocket} from "websocket";

export class WebsocketImplementation {
    origin = "wss://ws.omechat.mathis-burger.de/ws";
    client: W3CWebSocket;

    constructor() {
        // create a new client
        this.client = new W3CWebSocket(this.origin);

        // set on open handler
        this.client.onopen = () => {
            console.log("websocket ready");
        }

        // set default message handler
        this.client.onmessage = (event: IMessageEvent) => console.log(event.data);
    }

    // general command for sending json
    // formatted as string trough the websocket.
    // The method wait for the connection to be ready
    // to prevent errors.
    send(data: string) {
        this.waitForConnection(this.client as W3CWebSocket, () => {
            this.client?.send(data);
        })
    }

    // This function sets the new method handler
    // for data handling directly in the react components
    setHandler(handler: any) {
        this.client.onmessage = handler
    }

    // This function executes an recursive timeout for waiting
    // for the connection to be ready.
    // After that it executes the given callback function.
    private waitForConnection(socket: W3CWebSocket, callback: any) {
        setTimeout(() => {
            if (socket.readyState === 1) {
                callback();
            } else {
                this.waitForConnection(socket, callback);
            }
        }, 5);
    }
}
