import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Todo } from './Todo';
import { User } from './User';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Note extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNotEmpty()
    name: string

    @ManyToOne(type => User, user => user.notes)
    user: User

    @OneToMany(type => Todo, todo => todo.note, {
        cascade: true
    })
    todos: Todo[]
}