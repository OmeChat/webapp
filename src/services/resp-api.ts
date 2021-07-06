import {AddClientResponse} from "../../typings/services/rest-api/AddClient";
import {ErrorResponse} from "../../typings/services/rest-api/ErrorResponse";
import {StorageService} from "./storage";
import {GetUsernamesResponse} from "../../typings/services/rest-api/GetUsernames";
import {CreateAccountResponse} from "../../typings/services/rest-api/CreateAccount";
import {RequestRandomPeopleResponse} from "../../typings/services/rest-api/RequestRandomPeople";

var BASE_URL = "https://api.omechat.mathis-burger.de";

export class RespAPI {

    // This async method calls the userAPI to create a new account.
    // If this failed the error is sent as string as the second entry of
    // the tuple. If it was OK, the second entry is the CreateAccountResponse type.
    async createAccount(username: string, age: number): Promise<[boolean, string | CreateAccountResponse]> {
        let resp = await RespAPI.post<CreateAccountResponse | ErrorResponse>("/user-api/create-account", {
            username: username,
            age: age
        });
        if (resp.status === 400) {
            return [false, (resp as ErrorResponse).error];
        } else {
            return [true, resp as CreateAccountResponse];
        }
    }

    // addClient handles the client login (gains access for websocket communication) for
    // the given client. It returns the state of this login process as a
    // boolean value.
    async addClient(username: string, secret: string): Promise<boolean> {
        let resp = await RespAPI.post<AddClientResponse | ErrorResponse>("/user-api/add-client", {
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

    // This method provides the functionality to communicate
    // with the backend and fetch the usernames for the userHashes.
    // The data is parsed as params into a map within the login
    // credentials from the local storage.
    async getUsernames(userHashes: string[]): Promise<Map<string, string>> {
        let usernameString = "";
        userHashes.forEach((val: string) => {
            usernameString === "" ?
                usernameString = `${usernameString}${val}` :
                usernameString = `${usernameString};${val}`
        });
        let loginCredentials = new StorageService().getUserLoginCredentials();
        let params = new Map<string, string>([
            ["user_hash", loginCredentials.userHash],
            ["client_hash", loginCredentials.clientHash],
            ["access_token", loginCredentials.accessToken],
            ["usernames", usernameString]
        ]);
        let resp = await RespAPI.get<GetUsernamesResponse>("/user-api/get-usernames", params);
        return resp.usernames;
    }

    // This method requests random users with the given age
    // tolerance and returns the response as instance of
    // RequestRandomPeopleResponse or ErrorResponse.
    // What it really is depends on the request state.
    async getRandomUser(tolerance: number): Promise<RequestRandomPeopleResponse | ErrorResponse> {
        let loginCredentials = new StorageService().getUserLoginCredentials();
        let params = new Map<string, string>([
            ["user_hash", loginCredentials.userHash],
            ["client_hash", loginCredentials.clientHash],
            ["access_token", loginCredentials.accessToken],
            ["tolerance", "" + tolerance]
        ]);
        return await RespAPI.get<RequestRandomPeopleResponse | ErrorResponse>("/user-api/get-matching-user", params);
    }

    // This function implements the functionality to perform a get
    // request to the backend and returns the given response
    // payload as an json-parsed object of the requested generic.
    // Furthermore it checks if there are given params and adds this params
    // to the url itself.
    private static async get<T>(path: string, params: Map<string, string> | undefined): Promise<T> {
        let URL = `${BASE_URL}${path}`;
        if (params !== undefined) {
            URL += "?"
            params.forEach((value: string, key: string) => {
                if (URL.slice(URL.length - 1) === "?") {
                    URL = `${URL}${key}=${value}`;
                } else {
                    URL = `${URL}&${key}=${value}`;
                }
            });
        }
        let resp = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        return await resp.json() as T;
    }

    // This function implements the functionality to perform a post
    // request to the backend and returns the given response
    // payload as an json-parsed object of the requested generic.
    private static async post<T>(path: string, payload: any): Promise<T> {
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
