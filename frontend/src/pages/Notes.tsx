import React from 'react'
import {NotesList} from '../components/Notes/List'
import { NotesAdd } from '../components/Notes/Add'

export class NotesPage extends React.Component {
    render() {
        return (
            <div>
                <NotesAdd/>
                <NotesList/>
            </div>
        )
    }
}