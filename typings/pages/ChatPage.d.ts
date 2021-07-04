import {Websocket} from "../../src/services/websocket/websocket";

export interface ChatPageProps {
    websocket: Websocket
}

export interface ChatPageState {
    userHashForChat: string;
}
