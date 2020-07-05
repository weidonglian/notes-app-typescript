
export interface BaseModel {
    createdAt: Date
    updatedAt: Date
}

export interface User {
    id: number
    username: string
    password: string
    role: string
    notes: Note[]
}

export interface Note {
    id: number
    name: string
    user: User
    todos: Todo[]
}

export interface Todo {
    id: number
    name: string
    done: boolean
    note: Note
}