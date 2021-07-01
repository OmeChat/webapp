import {WebsocketImplementation} from "./implementation";
import {StorageService} from "../storage";

export class Websocket {

    ws: WebsocketImplementation | undefined;

    constructor() {
        this.ws = new WebsocketImplementation();
    }

    // This method takes an function as handler parameter.
    // This handler is being executed, if the websocket
    // sends a response.
    login(handler: any): void {
        this.ws?.setHandler(handler);
        this.ws?.send(JSON.stringify(new StorageService().getUserLoginCredentials()));
    }
}
