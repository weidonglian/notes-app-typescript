import { Response, Request } from 'express'
import { getUserFromRequest, getUserIdFromRequest } from '../../util/user'
import { checkNotEmpty } from '../../validator'
import { HttpStatusCode } from '../../util/httpErrors'
import { transformAndValidate } from 'class-transformer-validator'
import { Note } from '../../model'
import { db } from '../../db'

export class NotesController {

    static postNotes = async (req: Request, res: Response) => {
        const userId = getUserIdFromRequest(req, res)
        const note = await transformAndValidate(Note, req.body as object)
        note.userId = userId
        res.send(await db.notes.add(note))
    }

    static getNotes = async (req: Request, res: Response) => {
        const userId = getUserIdFromRequest(req, res)
        res.send(await db.notes.getNoteTodoMap(userId))
    }

    static putNotes = async (req: Request, res: Response) => {
        const id = req.params.id
        checkNotEmpty(id, 'parameter id empty or not found')
        const { name } = req.body
        checkNotEmpty(name, 'the property name not found or empty')
        res.send(await db.notes.updateById(+id, name))
    }

    static deleteNotes = async (req: Request, res: Response) => {
        const id = req.params.id
        checkNotEmpty(id, 'parameter id empty or not found')
        await db.notes.remove(+id);
        res.status(HttpStatusCode.Success)
    }


}