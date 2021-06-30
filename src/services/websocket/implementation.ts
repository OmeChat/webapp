import {IMessageEvent, w3cwebsocket as W3CWebSocket} from "websocket";

export class WebsocketImplementation {
    origin = "wss://ws.omechat.mathis-burger.de/ws";
    client: W3CWebSocket;

    constructor() {
        this.client = new W3CWebSocket(this.origin);

        this.client.onopen = () => {
            console.log("websocket ready");
        }
        this.client.onmessage = (event: IMessageEvent) => console.log(event.data);
    }

    send(data: any) {
        this.waitForConnection(this.client as W3CWebSocket, () => {
            this.client?.send(data);
        })
    }

    setHandler(handler: any) {
        this.client.onmessage = handler
    }

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
