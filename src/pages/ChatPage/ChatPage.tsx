import React from "react";
import "./ChatPage.css";
import {ChatPageProps, ChatPageState} from "../../../typings/pages/ChatPage";
import {ChatList} from "../../component/ChatList/ChatList";
import {ChatView} from "../../component/ChatView/ChatView";

export class ChatPage extends React.Component<ChatPageProps, ChatPageState> {

    state: ChatPageState = {
      userHashForChat: ""
    };

    constructor(props: ChatPageProps) {
        super(props);
        this.renderChat = this.renderChat.bind(this);
    }

    // This method is re-rendering the whole component
    // and updates trough this the messages and the state
    // of the ChatView on the right side.
    renderChat(userHash: string) {
        this.setState({userHashForChat: userHash});
    }

    render() {
        if (this.state.userHashForChat === "") {
            return (
                <div className="full-bg">
                    <ChatList ws={this.props.websocket} rerenderParent={this.renderChat} />
                </div>
            );
        } else {
            return (
                <div className="full-bg">
                    <ChatList ws={this.props.websocket} rerenderParent={this.renderChat} />
                    <ChatView />
                </div>
            );
        }
    }
}
