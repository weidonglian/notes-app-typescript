import { Action } from 'redux';
import { ApiId } from '../models'

/// Types
export enum ApiActionTypes {
    REQUEST = 'API_REQUEST',
    START = 'API_START',
    END = 'API_END',
    ERROR = 'API_ERROR'
}

/// Actions
export interface ApiRequestAction extends Action {
    type: ApiActionTypes.REQUEST
    payload: {
        id: ApiId,

    }
}

export interface ApiStartAction extends Action {
    type: ApiActionTypes.START
    payload: {
        id: ApiId
    }
}

export interface ApiEndAction extends Action {
    type: ApiActionTypes.END
    payload: {
        id: ApiId
    }
}

export interface ApiErrorAction extends Action {
    type: ApiActionTypes.ERROR
    payload: {
        id: ApiId
        error: string
    }
}

export type ApiAction = ApiStartAction | ApiEndAction | ApiErrorAction

export const apiStart = (id: ApiId): ApiStartAction => ({
    type: ApiActionTypes.START,
    payload: {
        id: id
    }
})

export const apiEnd = (id: ApiId): ApiEndAction => ({
    type: ApiActionTypes.END,
    payload: {
        id: id
    }
})

export const apiError = (id: ApiId, error: string): ApiErrorAction => ({
    type: ApiActionTypes.ERROR,
    payload: {
        id: id,
        error: error
    }
})