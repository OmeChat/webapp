import {Websocket} from "../../src/services/websocket/websocket";
import {Message} from "../services/storage";

export interface ChatListProps {
    ws: Websocket;
}

export interface ChatListState {
    chats: ChatEntry[];
}

export interface ChatEntry {
    userHash: string;
    username: string;
    messages: Message[];
}
