import React from 'react'
import { App } from './App'
import { renderWith, renderWithState } from '../utils/test-utils'
import { AppState } from '../reducers'
import { addNote } from '../actions/notes'

describe('App test', () => {

    test('renders without crashing', () => {
        const t = renderWith(<App />)
        expect(t.container).toHaveTextContent("NotesFirst NoteSecond NoteThird Note")
    })

    test('renders with given init', () => {
        const initState: AppState = {
            notes: {
                notes: ['1', '3', '2'].map(name => addNote(name).payload.note)
            }
        }
        const t = renderWithState(<App />, initState)
        t.debug(t.container)
        expect(t.container).toHaveTextContent("Notes132")
    })
})
