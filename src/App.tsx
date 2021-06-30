import React from 'react';
import {AppState} from "../typings/App";
import {StorageService} from "./services/storage";
import {Websocket} from "./services/websocket/websocket";
import {IMessageEvent} from "websocket";
import {WebsocketErrorResponse} from "../typings/models/WebsocketErrorResponse";

export default class App extends React.Component<any, AppState> {

    state: AppState = {
        loadedData: false,
    };

    async componentDidMount() {

        if (!new StorageService().checkUserLoginCredentials()) {
            this.setState({loadedData: true, websocketLoginSuccessful: false});
        } else {
            new Websocket().login((event: IMessageEvent) => {
                if ((JSON.parse(event.data as string) as WebsocketErrorResponse).error === "The given login credentials are wrong") {
                    this.setState({loadedData: true, websocketLoginSuccessful: false});
                } else {
                    this.setState({loadedData: true, websocketLoginSuccessful: true});
                }
            })
        }
    }

    render() {
        if (!this.state.loadedData) {
            return (
                <div>
                    Loading data
                </div>
            )
        }
        if (this.state.websocketLoginSuccessful) {
            return <div>successful login</div>;
        } else {
            return <div>login failed</div>;
        }
    }
}
