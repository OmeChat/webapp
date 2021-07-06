import React from 'react';
import {AppState} from "../typings/App";
import {StorageService} from "./services/storage";
import {Websocket} from "./services/websocket/websocket";
import {IMessageEvent} from "websocket";
import {WebsocketErrorResponse} from "../typings/models/WebsocketErrorResponse";
import {LoginPage} from "./pages/LoginPage/LoginPage";
import {ChatPage} from "./pages/ChatPage/ChatPage";
import {RegisterPage} from "./pages/RegisterPage/RegisterPage";

export default class App extends React.Component<any, AppState> {

    state: AppState = {
        loadedData: false,
        websocket: new Websocket(),
        openRegister: false
    };

    constructor(props: any) {
        super(props);
        this.openRegister = this.openRegister.bind(this);
        this.openLogin = this.openLogin.bind(this);
    }

    openRegister(): void {
        this.setState({openRegister: true});
    }

    openLogin(): void {
        this.setState({openRegister: false});
    }

    async componentDidMount() {

        // check, if there are login credentials saved into the localStorage
        if (!new StorageService().checkUserLoginCredentials()) {
            this.setState({loadedData: true, websocketLoginSuccessful: false});
        } else {
            this.state.websocket.login((event: IMessageEvent) => {
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
            return <ChatPage websocket={this.state.websocket} />;
        } else {
            if (this.state.openRegister) {
                return <RegisterPage openLogin={this.openLogin} />
            } else {
                return <LoginPage openRegister={this.openRegister} />
            }
        }
    }
}
