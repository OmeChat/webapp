import React, {ChangeEvent} from "react";
import {LoginPageState} from "../../../typings/pages/LoginPage";
import "./LoginPage.css";
import {RespAPI} from "../../services/resp-api";
import {Snackbar} from "../../component/snackbar/snackbar";
import ReactDOM from "react-dom";

export class LoginPage extends React.Component<any, LoginPageState> {

    state: LoginPageState = {
        username: "",
        secret: "",
    };

    // This method is called on login click. If the login
    // failed it displays a snackbar with a login failed
    // text. After that the user can do another try.
    async login(): Promise<void> {
       let resp = await new RespAPI().addClient(this.state.username, this.state.secret);
       if (resp) {
           window.location.reload();
       } else {
           ReactDOM.render(<Snackbar render={true} message="Login failed" color={"#CB1212"} />, document.getElementById('snackbar'));
       }
    }

    render() {
        return (
            <div className="bg-full">
                <div className="login-container">
                    <h1>Login</h1>
                    <input placeholder="username" onChange={
                        (e: ChangeEvent<HTMLInputElement>) => {this.setState({username: e.target.value})}
                    }/>
                    <input placeholder="secret" type="password" onChange={
                        (e: ChangeEvent<HTMLInputElement>) => {this.setState({secret: e.target.value})}
                    } />
                    <button onClick={() => this.login()}>submit</button>
                </div>
            </div>
        );
    }
}
