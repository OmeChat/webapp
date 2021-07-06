import {Message} from "../../typings/services/storage";
import {ChatEntry} from "../../typings/components/ChatList";

// This method sorts the messages by the newest date.
// The algorithm for this implementation is bubblesort.
export function sortMessagesByDate(messages: Message[]): Message[] {
    let arr = messages.slice();

    for (let i=0; i< arr.length; i++) {
        for (let j =0; j < arr.length - 1; j++) {
            if (arr[j].sent_at > arr[j+1].sent_at) {
                let swap = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = swap;
            }
        }
    }
    return arr;
}

// This method checks, if there is an difference between the two given
// arrays. It is used to prevent an infinite loop of get-usernames requests
// in an state update loop.
export function checkMessageArrayDifference(oldArr: Message[], newArr: Message[]): boolean {
    if (oldArr === undefined && newArr !== undefined) {
        return true;
    }
    let diff = false;
    if (oldArr.length !== newArr.length) {
        return true;
    } else {
        for (let i=0; i<oldArr.length; i++) {
            if (
                oldArr[i].sender !== newArr[i].sender ||
                oldArr[i].sent_at !== newArr[i].sent_at ||
                oldArr[i].message !== newArr[i].message ||
                oldArr[i].read !== newArr[i].read ||
                oldArr[i].self_written !== newArr[i].self_written
            ) {
                diff = true;
                break;
            }
        }
    }
    return diff;
}

export function getChatEntryByUserHash(entrys: ChatEntry[], hash: string): ChatEntry | null {
    entrys.forEach((entry: ChatEntry) => {
        if (entry.userHash === hash) {
            return entry;
        }
    });
    console.log("coc");
    return null;
}
