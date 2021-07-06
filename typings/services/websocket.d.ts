export interface MessageModel {
    message: string;
    sender: string;
    sent_at: number;
    action: string;
}

export interface ExchangeKeyModel {
    action: string;
    key: string;
    sender_hash: string;
}
