import { MessageAction, MessageActionTypes } from '../actions/message'
import iassign from 'immutable-assign'

/// State definition
export interface MessageState {
    message: string,
    variant: 'success' | 'info' | 'warning' | 'error'
    open: boolean
}

/// Initial state
export const initialMessageState: MessageState = {
    message: '',
    variant: 'success',
    open: false
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
                    open: true
                })
            )
        }

        case MessageActionTypes.HIDE_MESSAGE: {
            return iassign(state,
                s => ({
                    message: '',
                    variant: 'success',
                    open: false
                })
            )
        }

        default:
            return state
    }
}
