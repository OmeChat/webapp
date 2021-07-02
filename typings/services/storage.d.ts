import {LoginCredentials} from "../models/LoginCredentials";

export interface StorageServiceMethods {
    checkUserLoginCredentials(): boolean;
    getUserLoginCredentials(): LoginCredentials;
    setUserLoginCredentials(
        userHash: string,
        clientHash: string,
        accessToken: string
    ): void;
}

export interface MessageArray {
    messages: Message[];
}

export interface Message {
    message: string;
    sender: string;
    sent_at: number;
    read: boolean;
    self_written: boolean;
}
