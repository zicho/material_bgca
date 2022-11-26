export interface IMessage {
    created_at: string | null
    read: boolean
    sender: string
    recipient: string
    content: string
}