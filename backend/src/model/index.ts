import * as bcrypt from 'bcryptjs'
import { IsNotEmpty, Length } from 'class-validator'

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

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, 8)
}

export const checkIfUnencryptedPasswordIsValid = (unencryptedPassword: string, password: string) => {
    return bcrypt.compareSync(unencryptedPassword, password)
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