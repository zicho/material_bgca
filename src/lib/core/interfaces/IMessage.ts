export interface IMessage {
    id: number,
    created_at: string | null
    read: boolean
    sender: string
    recipient: string
    content: string
}