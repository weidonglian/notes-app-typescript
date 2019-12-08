import { MessageAction, MessageActionTypes } from '../actions/message'
import iassign from 'immutable-assign'

/// State definition
export interface MessageState {
    message: string,
    variant: 'success' | 'info' | 'warning' | 'error'
    visible: boolean
}

/// Initial state
export const initialMessageState: MessageState = {
    message: '',
    variant: 'success',
    visible: false
}

/// Reducer
export const messageReducer = (state: MessageState = initialMessageState, action: MessageAction): MessageState => {
    switch(action.type) {
        case MessageActionTypes.SHOW_MESSAGE: {
            const { message, variant } = action.payload
            return iassign(state,
                s => ({
                    message: message,
                    variant: variant,
                    visible: true
                })
            )
        }

        case MessageActionTypes.HIDE_MESSAGE: {
            return iassign(state,
                s => ({
                    message: '',
                    variant: 'success',
                    visible: false
                })
            )
        }

        default:
            return state
    }
}
