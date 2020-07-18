import { Response, Request } from 'express'
import { checkNotEmpty } from '../../validator'
import { HttpStatusCode } from '../../util/httpErrors'
import { transformAndValidate } from 'class-transformer-validator'
import { IsNotEmpty, IsInt } from 'class-validator'
import { TodoModel } from '../../model'
import { db } from '../../db'


export class TodosController {
    static postTodos = async (req: Request, res: Response) => {
        class PostInput {
            @IsInt()
            noteId: number
            @IsNotEmpty()
            name: string
        }
        const postInput = await transformAndValidate(PostInput, req.body as object)
        const todo = new TodoModel()
        todo.name = postInput.name
        todo.done = false
        todo.noteId = postInput.noteId
        res.send(await db.todos.add(todo))
    }

    static putTodos = async (req: Request, res: Response) => {
        const id = req.params.id
        checkNotEmpty(id, 'parameter id empty or not found')
        const { name, done } = req.body
        res.send(db.todos.update(+id, name, done))
    }

    static putTodosToggleTodo = async (req: Request, res: Response) => {
        const id = req.params.id
        checkNotEmpty(id, 'parameter id empty or not found')
        res.send(db.todos.toggle_done(+id))
    }

    static deleteTodos = async (req: Request, res: Response) => {
        const id = req.params.id
        checkNotEmpty(id, 'parameter id empty or not found')
        res.send(db.todos.remove(+id))
    }


}