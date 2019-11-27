import { Route } from '../../util/index'
import { checkJwt } from '../../validator'
import { NotesController } from './NotesController'

const routes: Route[] = [
    {
        path: '/notes',
        method: 'get',
        handler: [
            checkJwt,
            NotesController.getNotes
        ]
    },
    {
        path: '/notes',
        method: 'post',
        handler: [
            checkJwt,
            NotesController.postNotes
        ]
    },
    {
        path: '/notes/:id([0-9]+)',
        method: 'put',
        handler: [
            checkJwt,
            NotesController.putNotes
        ]
    },
    {
        path: '/notes/:id([0-9]+)',
        method: 'delete',
        handler: [
            checkJwt,
            NotesController.deleteNotes
        ]
    }
]

export default routes