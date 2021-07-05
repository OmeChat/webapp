import {Message} from "../services/storage";

export interface ChatViewProps {
    userHash: string;
    username: string;
    messageUpdater: any;
}

export interface ChatViewState {
    messages: Message[];
}
