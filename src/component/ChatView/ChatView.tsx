import React from "react";
import {ChatViewProps, ChatViewState} from "../../../typings/components/ChatView";
import "./ChatView.css";
import {faEllipsisV} from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {StorageService} from "../../services/storage";
import {checkMessageArrayDifference, sortMessagesByDate} from "../../services/utils";
import {Message} from "../../../typings/services/storage";

export class ChatView extends React.Component<ChatViewProps, ChatViewState> {

    state: ChatViewState = {
        messages: [],
        newMessageValue: ""
    };

    constructor(props: ChatViewProps) {
        super(props);
    }

    // This method checks if there are unread messages
    // in the message-array
    userHashUnreadMessages(msgs: Message[]): boolean {
        let hasUnread = false;
        msgs.forEach((msg: Message) => {
            if (!msg.read) {
                hasUnread = true;
            }
        });
        return hasUnread;
    }

    componentDidMount() {
        let messages = sortMessagesByDate(
            new StorageService().getMessageMap().get(this.props.userHash) as Message[]
        );
        if (this.userHashUnreadMessages(messages)) {
            let updatedMsgs = new StorageService().readAllMessages(this.props.userHash);
            this.props.messageUpdater(updatedMsgs);
        }
        this.setState({messages});
    }


    // This method checks if the message input is not empty
    // and the enter key is pressed. If this is true
    // the sendAndSaveMessage is being called.
    onMessageSubmit(event: any): void {
        if (event.key === "Enter" && this.state.newMessageValue !== "") {
            this.sendAndSaveMessage(this.state.newMessageValue);
        }
    }

    // This function saves a new message into the localStorage.
    // After that it send the message trough the websocket
    // and re-renders the component with the new message.
    sendAndSaveMessage(msg: string): void {
        let timestamp = Date.now();
        new StorageService().saveMessage(msg, this.props.userHash, timestamp, true, true);
        let loginCreds = new StorageService().getUserLoginCredentials();
        this.props.websocket.ws?.send(JSON.stringify({
            action: "send-message",
            user_hash: loginCreds.userHash,
            client_hash: loginCreds.clientHash,
            access_token: loginCreds.accessToken,
            payload: {
                target_hash: this.props.userHash,
                message: msg
            }
        }));
        let msgs = this.state.messages.slice();
        msgs.push({message: msg, sender: this.props.userHash, sent_at: timestamp, read: true, self_written: true} as Message);
        this.setState({messages: msgs});
    }

    render() {
        let messageEmbeds = new Array<JSX.Element>();
        this.state.messages.forEach((message: Message) => {
            if (message.self_written) {
                messageEmbeds.push(
                    <div className="own-msg" key={message.sent_at}>{message.message}</div>
                );
            } else {
                messageEmbeds.push(
                    <div className="foreign-message" key={message.sent_at}>{message.message}</div>
                );
            }
        });

        return (
          <div className="box">
            <div className="box-header">
                <img src="/profile.jpg"  alt="profile" />
                <h1>{this.props.username === "" ? "anonymous" : this.props.username}</h1>
                <FontAwesomeIcon icon={faEllipsisV} color={"#676767"} size={"lg"} />
            </div>
            <div className="box-chats">
                {messageEmbeds}
            </div>
            <div className="box-typer">
                <input
                    placeholder="write message"
                    onChange={(event) => {this.setState({newMessageValue: event.target.value})}}
                    onKeyDown={(event) => this.onMessageSubmit(event)}
                />
                <button>
                    <FontAwesomeIcon icon={faPaperPlane} size="lg" color="#fff"/>
                </button>
            </div>
          </div>
        );
    }
}
