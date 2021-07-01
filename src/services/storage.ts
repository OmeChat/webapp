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
}
