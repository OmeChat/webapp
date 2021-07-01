import {AddClientResponse} from "../../typings/services/rest-api/AddClient";
import {ErrorResponse} from "../../typings/services/rest-api/ErrorResponse";
import {StorageService} from "./storage";

var BASE_URL = "https://api.omechat.mathis-burger.de";

export class RespAPI {

    // addClient handles the client login (gains access for websocket communication) for
    // the given client. It returns the state of this login process as a
    // boolean value.
    async addClient(username: string, secret: string): Promise<boolean> {
        let resp = await this.post<AddClientResponse | ErrorResponse>("/user-api/add-client", {
            username: username,
            account_secret: secret
        });
        if (resp.status === 200) {
            let data = resp as AddClientResponse;
            new StorageService().setUserLoginCredentials(data.user_hash, data.client_hash, data.access_token);
            return true;
        } else {
            return false;
        }
    }

    // This function implements the functionality to perform a post
    // request to the backend and returns the given response
    // payload as an json-parsed object of the requested generic.
    private async post<T>(path: string, payload: any): Promise<T> {
        let resp = await fetch(`${BASE_URL}${path}`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        return await resp.json() as T;
    }
}
