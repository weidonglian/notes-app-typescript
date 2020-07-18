
import * as bcrypt from 'bcryptjs'
import { IsNotEmpty, Length, isNotEmpty } from 'class-validator'

export class BaseModel {
    createdAt: Date
    updatedAt: Date
}

export class UserModel {
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

export class NoteModel {
    id: number

    @IsNotEmpty()
    name: string

    userId: number
}

export class TodoModel {
    id: number

    @IsNotEmpty()
    name: string

    done: boolean

    noteId: number
}