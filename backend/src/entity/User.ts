import * as bcrypt from 'bcryptjs'
import { IsNotEmpty, Length } from 'class-validator'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Note } from './Note'

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(4, 20)
    username: string

    @Column()
    @Length(4, 100)
    password: string

    @Column()
    @IsNotEmpty()
    role: string

    @OneToMany(type => Note, note => note.user)
    notes: Note[]

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password)
    }
}
