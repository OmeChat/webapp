import {Message} from "../../typings/services/storage";

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
