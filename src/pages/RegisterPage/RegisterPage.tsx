import React, {ChangeEvent} from "react";
import {RegisterPageProps, RegisterPageState} from "../../../typings/pages/RegisterPage";
import {RespAPI} from "../../services/resp-api";
import ReactDOM from "react-dom";
import {Snackbar} from "../../component/snackbar/snackbar";
import {CreateAccountResponse} from "../../../typings/services/rest-api/CreateAccount";
import {Overlay} from "../../component/Overlay/Overlay";

export class RegisterPage extends React.Component<RegisterPageProps, RegisterPageState> {

    state: RegisterPageState = {
        username: "",
        age: 0
    }

    async register(): Promise<void> {
        if (this.state.username === "" || this.state.age === 0) {
            ReactDOM.render(<Snackbar render={true} message="Please fill out all fields" color={"#CB1212"} />, document.getElementById('snackbar'));
        } else {
            let resp = await new RespAPI().createAccount(this.state.username, this.state.age);
            if (resp[0]) {
                let data = resp[1] as CreateAccountResponse;
                ReactDOM.render(
                    <Overlay message={data.account_secret} closer={() => {
                        ReactDOM.render(<div />, document.getElementById('overlay'));
                    }}/>,
                    document.getElementById('overlay'))
            } else {
                ReactDOM.render(<Snackbar render={true} message={resp[1] as string} color={"#CB1212"} />, document.getElementById('snackbar'));
            }
        }
    }

    render() {
        return (
            <div className="bg-full">
                <div className="login-container">
                    <h1>Register</h1>
                    <input placeholder="username" onChange={
                        (e: ChangeEvent<HTMLInputElement>) => {this.setState({username: e.target.value})}
                    }/>
                    <input placeholder="age" type="number" onChange={
                        (e: ChangeEvent<HTMLInputElement>) => {this.setState({age: +e.target.value})}
                    } />
                    <button onClick={() => this.register()}>submit</button>
                    <a onClick={() => this.props.openLogin()}>Login</a>
                </div>
            </div>
        );
    }
}
