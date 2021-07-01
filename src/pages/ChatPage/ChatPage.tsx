import React from "react";
import "./ChatPage.css";
import {ChatPageProps} from "../../../typings/pages/ChatPage";
import {ChatList} from "../../component/ChatList/ChatList";

export class ChatPage extends React.Component<ChatPageProps, any> {

    render() {
        return (
            <div className="full-bg">
                <ChatList ws={this.props.websocket} />
            </div>
        );
    }
}
