import {Message} from "../services/storage";

export interface ChatViewProps {
    userHash: string;
    username: string;
}

export interface ChatViewState {
    messages: Message[];
}
