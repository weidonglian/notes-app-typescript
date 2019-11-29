import { getRepository } from 'typeorm'
import { Response, Request } from 'express'
import { checkNotEmpty } from '../../validator'
import { HttpStatusCode } from '../../util/httpErrors'
import { transformAndValidate } from 'class-transformer-validator'
import { IsNotEmpty, IsInt } from 'class-validator'
import { Todo } from '../../entity/Todo'
import { Note } from '../../entity/Note'

class PostInput {
    @IsInt()
    noteId: number
    @IsNotEmpty()
    name: string
}

export class TodosController {
    static postTodos = async (req: Request, res: Response) => {
        const postInput = await transformAndValidate(PostInput, req.body as object)
        const todoRepo = getRepository(Todo)
        const noteRepo = getRepository(Note)
        const note = await noteRepo.findOneOrFail(postInput.noteId)

        const todo = new Todo()
        todo.name = postInput.name
        todo.done = false
        todo.note = note

        await todoRepo.save(todo)
        res.send({
            id: todo.id,
            name: todo.name,
            done: todo.done,
            noteId: todo.note.id
        })
    }

    static putTodos = async (req: Request, res: Response) => {
        const id = req.params.id
        checkNotEmpty(id, 'parameter id empty or not found')
        const { name, done } = req.body
        const todoRepo = getRepository(Todo)
        const todo = await todoRepo.findOneOrFail(id)
        if (name)
            todo.name = name
        if (done)
            todo.done = done
        await todoRepo.save(todo)
        res.send(todo)
    }

    static putTodosToggleTodo = async (req: Request, res: Response) => {
        const id = req.params.id
        checkNotEmpty(id, 'parameter id empty or not found')
        const todoRepo = getRepository(Todo)
        const todo = await todoRepo.findOneOrFail(id)
        todo.done = !todo.done
        await todoRepo.save(todo)
        res.send(todo)
    }

    static deleteTodos = async (req: Request, res: Response) => {
        const id = req.params.id
        checkNotEmpty(id, 'parameter id empty or not found')
        const todoRepo = getRepository(Todo)
        await todoRepo.delete(id)
        res.status(HttpStatusCode.Success)
    }


}