import { Type } from 'class-transformer'

export class Todo {
    id: number
    name: string
    done: boolean
}

export enum NoteVisibility {
    DEFAULT, PINNED, ARCHIEVE
}

export class Note {
    id: number
    name: string
    @Type(() => Todo)
    todos: Todo[]
    visibility: NoteVisibility
}