import {Message} from "../services/storage";
import {Websocket} from "../../src/services/websocket/websocket";

export interface ChatViewProps {
    userHash: string;
    username: string;
    messageUpdater: any;
    websocket: Websocket;
    mobileScroller: any;
}

export interface ChatViewState {
    messages: Message[];
}
