
export interface BaseModel {
    createdAt: Date
    updatedAt: Date
}

export interface User {
    id: number
    name: string
    password: string
    role: string
}

export interface Note {
    id: number
    name: string
    userId: number
}

export interface Todo {
    id: number
    name: string
    done: boolean
    noteId: number
}