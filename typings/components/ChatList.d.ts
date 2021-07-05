import {Websocket} from "../../src/services/websocket/websocket";
import {Message} from "../services/storage";

export interface ChatListProps {
    ws: Websocket;
    rerenderParent: any;
    messages: Message[];
}

export interface ChatListState {
    chats: ChatEntry[];
    activeChat: string;
}

export interface ChatEntry {
    userHash: string;
    username: string;
    messages: Message[];
}
