import { BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm'
import { Note } from './Note'

@Entity()
export class Todo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    done: boolean

    @ManyToOne(type => Note, note => note.todos)
    note: Note
}