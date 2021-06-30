import {WebsocketImplementation} from "./implementation";
import {StorageService} from "../storage";

export class Websocket  {

    ws: WebsocketImplementation | undefined;

    constructor() {
        this.ws = new WebsocketImplementation();
    }

    login(handler: any): void {
        this.ws?.setHandler(handler);
        this.ws?.send(JSON.stringify(new StorageService().getUserLoginCredentials()));
    }
}
