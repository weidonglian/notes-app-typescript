import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface Todo {
    id: number,
    name: string,
    done: boolean
}

export enum NoteVisibility {
    DEFAULT, PINNED, ARCHIEVE
}

export interface Note {
    id: number,
    name: string,
    todos: Todo[],
    visibility: NoteVisibility
}

export enum ApiId {
    ADD_NOTE,
    DELETE_NODE,
    ADD_TODO,
    DELETE_TODO
}

export interface ApiRequest {
    id: ApiId
    config: AxiosRequestConfig
    withAuth: boolean
    onData: (data: any) => void
    onError: (error: any) => void
}