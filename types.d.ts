declare namespace SEDK {
    type Badge = {
        type: string
        version: string
        url: string
        description: string
    }

    type Emote = {
        type: string
        name: string
        id: string
        gif: boolean
        urls: {
            [key: string]: string
        }
        start: number
        end: number
    }

    type Tags = {
        "badge-info": string
        badges: string
        color: string
        "display-name": string
        emotes: string
        flags: string
        id: string
        mod: string
        "room-id": string
        subscriber: string
        "tmi-sent-ts": string
        turbo: string
        "user-id": string
        "user-type": string
    }

    type Data = {
        time: number
        tags: Tags
        nick: string
        userId: string
        displayName: string
        displayColor: string
        badges: Badge[]
        channel: string
        text: string
        isAction: boolean
        emotes: Emote[]
        msgId: string
    }

    type Event = {
        amount: number
        name: string
        originalEventName: string
        sessionTop: boolean
        type: string
        renderedText?: string
        data?: Data
    }

    type Detail = {
        event: Event
        listener:
            | "follower-latest"
            | "subscriber-latest"
            | "host-latest"
            | "cheer-latest"
            | "tip-latest"
            | "raid-latest"
            | "message"
            | "delete-message"
            | "delete-messages"
            | "event:skip"
            | "alertService:toggleSound"
            | "bot:counter"
            | "kvstore:update"
            | "widget-button"
            | "event:test"
    }
}
