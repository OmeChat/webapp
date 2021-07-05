import {Websocket} from "../../src/services/websocket/websocket";
import {Message} from "../services/storage";

export interface ChatPageProps {
    websocket: Websocket
}

export interface ChatPageState {
    userHashForChat: string;
    usernameForChat: string;
    messages: Message[];
    key: number;
    mobileTargetPosition: string;
}
