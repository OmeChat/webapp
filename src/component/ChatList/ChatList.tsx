import React from "react";
import "./ChatList.css";
import {ChatEntry, ChatListProps, ChatListState} from "../../../typings/components/ChatList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV} from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import {IMessageEvent} from "websocket";
import {MessageModel} from "../../../typings/services/websocket";
import {StorageService} from "../../services/storage";
import {Message} from "../../../typings/services/storage";
import {RespAPI} from "../../services/resp-api";

export class ChatList extends React.Component<ChatListProps, ChatListState> {

    state: ChatListState = {
        chats: new Array<ChatEntry>(),
    };

    constructor(props: ChatListProps) {
        super(props);
    }

    // This function handles new messages trough the websocket and saves them
    // into the localstorage.
    handleMessage(event: IMessageEvent) {
        let jsonData = JSON.parse(event.data as string);
        if (jsonData.action === "send-message") {
            let parsedData = jsonData as MessageModel;
            new StorageService().saveMessage(
                parsedData.message, parsedData.sender,
                parsedData.sent_at, false, false
            );
        } else {
            console.error("unsupported action");
        }
    }

    messageArrayToMessageMap(messages: Message[]): Map<string, Message[]> {
        let dataMap = new Map<string, Message[]>();
        for (let i=0; i<messages.length; i++) {
            if (dataMap.get(messages[i].sender) === undefined) {
                dataMap.set(messages[i].sender, [messages[i]]);
            } else {
                dataMap.set(
                    messages[i].sender,
                    [...(dataMap.get(messages[i].sender) as Message[]), messages[i]]
                );
            }
        }
        return dataMap;
    }

    async componentDidMount() {
        await this.dataLoader();
    }

    async componentDidUpdate(prevProps: Readonly<ChatListProps>, prevState: Readonly<ChatListState>, snapshot?: any) {
        await this.dataLoader();
    }

    // This function sets the websocket handler to the
    // message-handler. After that it fetches all chat data
    // from the localStorage and re-renders the component
    // with this new data.
    async dataLoader() {
        this.props.ws.ws?.setHandler(this.handleMessage);
        let chats = new Map<string, Message[]>();
        if (this.props.messages.length === 0) {
            chats = new StorageService().getMessageMap();
        } else {
            chats = this.messageArrayToMessageMap(this.props.messages);
        }
        let arr = new Array<string>();
        chats.forEach(((value, key) => arr.push(key)));
        let userIdentifier = await new RespAPI().getUsernames(arr);
        let chatArray = new Array<ChatEntry>();
        chats.forEach(((value, key) => {
            chatArray.push({
                userHash: key,
                username: (userIdentifier as any)[key],
                messages: chats.get(key) as Message[]
            } as ChatEntry);
        }));
        this.setState({chats: chatArray});
    }

    // This method counts the number of unread messages in an
    // array of Messages.
    countUnreadMessages(messages: Message[]): number {
        let counter = 0;
        messages.forEach((value => {
            if (!value.read) {
                counter += 1;
            }
        }));
        return counter;
    }


    render() {
        let listItems = new Array<JSX.Element>();
        this.state.chats.forEach(((value) => {
            listItems.push(
                <div className="chat-box" key={value.userHash} onClick={() => this.props.rerenderParent(value.userHash, value.username)}>
                    <img src="/profile.jpg"  alt="profile" />
                    <div className="text-box">
                        <h1>{value.username}</h1>
                        <p>{value.messages[value.messages.length - 1].message}</p>
                    </div>
                    <div className="new-message">{this.countUnreadMessages(value.messages)}</div>
                </div>
            )
        }));
        return (
            <div className="outer-container">
                <div className="inner-container">
                    <div className="header-box">
                        <img src={"/logo.jpg"} alt={"logo"}/>
                        <h1>OmeChat</h1>
                        <FontAwesomeIcon icon={faEllipsisV} color={"#676767"} size={"lg"} />
                    </div>
                    {listItems}
                </div>
            </div>
        )
    }
}
