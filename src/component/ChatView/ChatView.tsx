import React from "react";
import {ChatViewProps, ChatViewState} from "../../../typings/components/ChatView";
import "./ChatView.css";
import {faEllipsisV} from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {StorageService} from "../../services/storage";
import {sortMessagesByDate} from "../../services/utils";
import {Message} from "../../../typings/services/storage";

export class ChatView extends React.Component<ChatViewProps, ChatViewState> {

    state: ChatViewState = {
        messages: []
    };

    constructor(props: ChatViewProps) {
        super(props);
    }

    componentDidMount() {
        let messages = sortMessagesByDate(
            new StorageService().getMessageMap().get(this.props.userHash) as Message[]
        );
        this.setState({messages});
    }

    render() {
        let messageEmbeds = new Array<JSX.Element>();
        this.state.messages.forEach((message: Message) => {
            if (message.self_written) {
                messageEmbeds.push(
                    <div className="own-msg">{message.message}</div>
                );
            } else {
                messageEmbeds.push(
                    <div className="foreign-message">{message.message}</div>
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
                <input placeholder="write message" />
                <button>
                    <FontAwesomeIcon icon={faPaperPlane} size="lg" color="#fff"/>
                </button>
            </div>
          </div>
        );
    }
}
