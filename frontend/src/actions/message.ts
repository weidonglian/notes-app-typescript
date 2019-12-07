import { Action } from 'redux';

export type MessageVariant = 'success' | 'info' | 'warning' | 'error'

/// Types
export enum MessageActionTypes {
    SHOW_MESSAGE,
    HIDE_MESSAGE
}

/// Actions
export interface ShowMessageAction extends Action {
    type: MessageActionTypes.SHOW_MESSAGE,
    payload: {
        message: string
        variant: MessageVariant
    }
}

export interface HideMessageAction extends Action {
    type: MessageActionTypes.HIDE_MESSAGE,
    payload: {}
}

export type MessageAction = ShowMessageAction | HideMessageAction

/// ActionCreator
const showMessage = (message: string, variant: MessageVariant): ShowMessageAction => ({
    type: MessageActionTypes.SHOW_MESSAGE,
    payload: {
        message, variant
    }
})

const hideMessage = (): HideMessageAction => ({
    type: MessageActionTypes.HIDE_MESSAGE,
    payload: {}
})

export const messageActions = {
    showMessage,
    hideMessage
}