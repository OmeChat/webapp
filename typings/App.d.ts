import {Websocket} from "../src/services/websocket/websocket";

export interface AppState {
    loadedData: boolean;
    websocketLoginSuccessful?: boolean;
    websocket: Websocket,
    openRegister: boolean;
}
