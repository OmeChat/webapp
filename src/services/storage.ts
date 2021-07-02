import {Message, MessageArray, StorageServiceMethods} from "../../typings/services/storage";
import {LoginCredentials} from "../../typings/models/LoginCredentials";

export class StorageService implements StorageServiceMethods {

    // checks if the login credentials for the websocket are given.
    // The user secret is not required, because it is never saved to
    // the client itself. Furthermore it is not required for the websocket
    // communication.
    checkUserLoginCredentials(): boolean {
        return localStorage.getItem("userHash") != null
            && localStorage.getItem("clientHash") != null
            && localStorage.getItem("accessToken") != null;
    }

    // This function returns the LoginCredentials for the websocket
    // as the LoginCredentials type.
    getUserLoginCredentials(): LoginCredentials {
        return {
            userHash: localStorage.getItem("userHash"),
            clientHash: localStorage.getItem("clientHash"),
            accessToken: localStorage.getItem("accessToken")
        } as LoginCredentials;
    }

    // saves the login credentials into
    // the localstorage by the given values
    setUserLoginCredentials(
        userHash: string,
        clientHash: string,
        accessToken: string
    ): void {
        localStorage.setItem("userHash", userHash);
        localStorage.setItem("clientHash", clientHash);
        localStorage.setItem("accessToken", accessToken);
    }

    saveMessage(
        message: string, sender: string,
        sent_at: number, read: boolean,
        self_written: boolean
    ): void {
        let data = localStorage.getItem("messages");
        if (data === null) {
            let el = {
                "messages": [ { message, sender, sent_at, read, self_written } as Message ]
            } as MessageArray;
            localStorage.setItem("messages", JSON.stringify(el));
        } else {
            let parsed = JSON.parse(data) as MessageArray;
            parsed.messages.push({message, sender, sent_at, read, self_written });
            localStorage.setItem("messages", JSON.stringify(parsed));
        }
    }

    getMessageMap(): Map<string, Message[]> {
        let messages = (JSON.parse(localStorage.getItem("messages") as string) as MessageArray).messages;
        let dataMap = new Map<string, Message[]>();

        for (let i=0; i<messages.length; i++) {
            if (dataMap.get(messages[i].sender) === undefined) {
                dataMap.set(messages[i].sender, [messages[i]]);
            } else {
                dataMap.set(
                    messages[i].sender,
                    [...(dataMap.get(messages[i].sender) as Message[]), messages[i]]
                );
            }
        }
        return dataMap;
    }

}
