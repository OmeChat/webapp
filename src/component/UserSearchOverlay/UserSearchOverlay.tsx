import React from "react";
import "./UserSearchOverlay.css";
import {UserSearchOverlayState} from "../../../typings/components/UserSearchOverlay";
import {RespAPI} from "../../services/resp-api";
import {RequestRandomPeopleResponse} from "../../../typings/services/rest-api/RequestRandomPeople";
import {ExposedUser} from "../../../typings/models/ExposedUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentAlt} from "@fortawesome/free-solid-svg-icons/faCommentAlt";
import {StorageService} from "../../services/storage";
import ReactDOM from "react-dom";

export class UserSearchOverlay extends React.Component<any, UserSearchOverlayState> {

    state: UserSearchOverlayState = {
        users: [],
        tolerance: 1
    };

    async handleUserSearch(): Promise<void> {
        let resp = await new RespAPI().getRandomUser(this.state.tolerance);
        if (resp.status === 200) {
            let oldUsers = (resp as RequestRandomPeopleResponse).matching_user;
            let users = new Array<ExposedUser>()
            const msgMap = new StorageService().getMessageMap();
            oldUsers.forEach((user: ExposedUser) => {
                if (msgMap.get(user.user_hash) === undefined) {
                    users.push(user);
                }
            });
            this.setState({users});
        }
    }

    async componentDidMount() {
        await this.handleUserSearch();
    }

    async onSubmit(event: any): Promise<void> {
        if (event.key === "Enter") {
            await this.handleUserSearch();
        }
    }

    openChat(userHash: string): void {
        new StorageService().saveMessage("You started a new chat (The other one can`t see this message)",
            userHash, Date.now(), true, true);
        window.location.reload();
    }

    render() {
        let userItems = new Array<JSX.Element>();
        if (this.state.users != null) {
            this.state.users.forEach((user: ExposedUser) => {
                userItems.push(
                    <div className="element" key={user.user_hash}>
                        <img src="/profile.jpg"  alt="pp" />
                        <h1>{user.username}</h1>
                        <h1>{user.age} years old</h1>
                        <div className="start-chat" onClick={() => this.openChat(user.user_hash)}>
                            <FontAwesomeIcon icon={faCommentAlt}  size="lg" />
                        </div>
                    </div>
                );
            });
        }

        return (
          <div className="overlay-container">
                <h1>Search for new friends</h1>
                <input
                    type="number"
                    placeholder="age tolerance (default 1)"
                    onChange={
                        (event) => this.setState({tolerance: +event.target.value})
                    }
                    onKeyDown={(event) => this.onSubmit(event)}
                />
                <div className="user-box">
                    {userItems}
                </div>
          </div>
        );
    }
}
