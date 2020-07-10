
import * as bcrypt from 'bcryptjs'
import { IsNotEmpty, Length, isNotEmpty } from 'class-validator'

export class BaseModel {
    createdAt: Date
    updatedAt: Date
}

export class User {
    id: number

    @Length(4, 20)
    username: string

    @Length(4, 100)
    password: string

    @IsNotEmpty()
    role: string

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password)
    }
}

export class Note {
    id: number

    @IsNotEmpty()
    name: string

    userId: number
}

export class Todo {
    id: number

    @IsNotEmpty()
    name: string

    done: boolean

    noteId: number
}