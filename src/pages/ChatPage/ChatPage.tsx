import React from "react";
import "./ChatPage.css";
import {ChatPageProps, ChatPageState} from "../../../typings/pages/ChatPage";
import {ChatList} from "../../component/ChatList/ChatList";
import {ChatView} from "../../component/ChatView/ChatView";
import {Message} from "../../../typings/services/storage";
import {ScreenWrapper} from "../../component/ScreenWrapper/ScreenWrapper";
import {useScreenType} from "../../hooks/useScreenType";

export class ChatPage extends React.Component<ChatPageProps, ChatPageState> {

    state: ChatPageState = {
      userHashForChat: "",
      usernameForChat: "",
      messages: [],
      key: 0,
      mobileTargetPosition: "left"
    };

    constructor(props: ChatPageProps) {
        super(props);
        this.renderChat = this.renderChat.bind(this);
        this.setMessages = this.setMessages.bind(this);
        this.updateChat = this.updateChat.bind(this);
        this.setMobileOrientation = this.setMobileOrientation.bind(this);
    }

    // This method is re-rendering the whole component
    // and updates trough this the messages and the state
    // of the ChatView on the right side.
    renderChat(userHash: string, username: string) {
        this.setState({userHashForChat: userHash, usernameForChat: username, key: this.state.key + 1});
    }

    updateChat(): void {
        this.setState({key: this.state.key + 1});
    }

    // This method can be used in children components
    // to update all messages in the ChatList.
    setMessages(messages: Message[]): void {
        this.setState({messages: messages});
    }

    // This method handles the mobile positioning for the ScreenWrapper.
    // It handles the window management on mobile devices.
    setMobileOrientation(pos: string): void {
        this.setState({mobileTargetPosition: pos});
    }


    render() {
        if (this.state.userHashForChat === "") {
            return (
                <div className="full-bg">
                    <ChatList
                        ws={this.props.websocket}
                        rerenderParent={this.renderChat}
                        messages={this.state.messages}
                        rerenderChat={this.updateChat}
                        mobileTargetPositionChanger={this.setMobileOrientation}/>
                </div>
            );
        } else {
            return (
                <ScreenWrapper targetPosition={this.state.mobileTargetPosition}>
                    <div className="full-bg">
                        <ChatList
                            ws={this.props.websocket}
                            rerenderParent={this.renderChat}
                            messages={this.state.messages}
                            rerenderChat={this.updateChat}
                            mobileTargetPositionChanger={this.setMobileOrientation}/>
                        <ChatView
                            userHash={this.state.userHashForChat}
                            username={this.state.usernameForChat}
                            messageUpdater={this.setMessages}
                            websocket={this.props.websocket}
                            key={this.state.key}
                            mobileScroller={this.setMobileOrientation}
                        />
                    </div>
                </ScreenWrapper>
            );
        }
    }
}
