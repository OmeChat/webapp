import React, {ChangeEvent} from "react";
import {LoginPageState} from "../../../typings/pages/LoginPage";
import "./LoginPage.css";

export class LoginPage extends React.Component<any, LoginPageState> {

    state: LoginPageState = {
        username: "",
        secret: "",
    };

    render() {
        return (
            <div className="bg-full">
                <div className="login-container">
                    <h1>Login</h1>
                    <input placeholder="username" onChange={
                        (e: ChangeEvent<HTMLInputElement>) => {this.setState({username: e.target.value})}
                    }/>
                    <input placeholder="secret" onChange={
                        (e: ChangeEvent<HTMLInputElement>) => {this.setState({secret: e.target.value})}
                    } />
                    <button>submit</button>
                </div>
            </div>
        );
    }
}
