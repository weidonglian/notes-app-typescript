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