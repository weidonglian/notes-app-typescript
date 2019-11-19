import React from 'react'
import {NotesList} from '../components/Notes/List'
import {NotesHeader} from '../components/Notes/Header'

export class ScreenNotes extends React.Component {
    render() {
        return (
            <div>
                <NotesHeader/>
                <NotesList/>
            </div>
        )
    }
}