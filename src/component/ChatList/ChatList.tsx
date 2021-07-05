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
import {checkMessageArrayDifference} from "../../services/utils";

export class ChatList extends React.Component<ChatListProps, ChatListState> {

    state: ChatListState = {
        chats: new Array<ChatEntry>(),
        activeChat: ""
    };

    constructor(props: ChatListProps) {
        super(props);
        this.handleMessage = this.handleMessage.bind(this);
        this.props.ws.ws?.setHandler(this.handleMessage);
    }

    // This function handles new messages trough the websocket and saves them
    // into the localstorage.
    handleMessage(event: IMessageEvent) {
        let jsonData = JSON.parse(event.data as string);
        if (jsonData.action === "send-message") {
            let parsedData = jsonData as MessageModel;
            new StorageService().saveMessage(
                parsedData.message, parsedData.sender,
                parsedData.sent_at * 1000, this.state.activeChat === parsedData.sender, false
            );
            this.addNewMessageToChat({
                message: parsedData.message,
                sender: parsedData.sender,
                sent_at: parsedData.sent_at * 1000,
                read: this.state.activeChat === parsedData.sender,
                self_written: false
            } as Message);
            if (this.state.activeChat === parsedData.sender) {
                this.props.rerenderChat();
            }
        } else {
            console.error("unsupported action");
        }
    }

    addNewMessageToChat(msg: Message): void {
        let newChats = new Array<ChatEntry>();
        this.state.chats.slice().forEach((chat: ChatEntry) => {
            if (msg.sender === chat.userHash) {
                let newMsgs = chat.messages.slice();
                newMsgs.push(msg);
                let newChat = {
                    messages: newMsgs,
                    username: chat.username,
                    userHash: chat.userHash
                } as ChatEntry;
                newChats.push(newChat);
            } else {
                newChats.push(chat);
            }
        });
        this.setState({chats: newChats});
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
        if (checkMessageArrayDifference(prevProps.messages, this.props.messages)) {
            await this.dataLoader();
        }
    }

    // This function sets the websocket handler to the
    // message-handler. After that it fetches all chat data
    // from the localStorage and re-renders the component
    // with this new data.
    async dataLoader() {
        let chats = new Map<string, Message[]>();
        if (this.props.messages.length === 0) {
            chats = new StorageService().getMessageMap();
        } else {
            let msgs = new StorageService().getMessageMap();
            let newMessages = new Array<Message>();
            msgs.forEach(((value, key) => {
                if (this.props.messages.length > 0 && this.props.messages[0].sender !== key) {
                    newMessages.push(...value);
                }
            }));
            newMessages.push(...this.props.messages);
            chats = this.messageArrayToMessageMap(newMessages);
        }
        let arr = new Array<string>();
        chats.forEach(((value, key) => arr.push(key)));
        if (arr.length !== 0) {
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
    }

    openChat(value: ChatEntry): void {
        this.props.rerenderParent(value.userHash, value.username);
        this.props.mobileTargetPositionChanger("right");
        this.setState({activeChat: value.userHash});
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
        this.state.chats.forEach((value) => {
            let unreadMsgs = this.countUnreadMessages(value.messages);
            listItems.push(
                <div className="chat-box" key={value.userHash} onClick={() => this.openChat(value)}>
                    <img src="/profile.jpg"  alt="profile" />
                    <div className="text-box">
                        <h1>{value.username}</h1>
                        <p>{value.messages[value.messages.length - 1].message}</p>
                    </div>
                    {unreadMsgs > 0 ? <div className="new-message">{unreadMsgs}</div> : null}
                </div>
            )
        });
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
