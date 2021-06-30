import {StorageServiceMethods} from "../../typings/services/storage";
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

    getUserLoginCredentials(): LoginCredentials {
        return {
            userHash: localStorage.getItem("userHash"),
            clientHash: localStorage.getItem("clientHash"),
            accessToken: localStorage.getItem("accessToken")
        } as LoginCredentials;
    }
}
