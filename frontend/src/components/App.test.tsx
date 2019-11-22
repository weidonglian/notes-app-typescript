import React from 'react'
import { App } from './App'
import { renderWith, renderWithState } from '../utils/test-utils'
import { AppState } from '../reducers'
import { addNote } from '../actions/notes'

describe('App test', () => {

    test('renders without crashing', () => {
        const t = renderWith(<App />)
        expect(t.container).toHaveTextContent(/First NoteSecond NoteThird Note/)
    })

    test('renders with given init', () => {
        const initState: AppState = {
            notes: {
                notes: ['nx1', 'nx3', 'nx2', 'nx4'].map(name => addNote(name).payload.note)
            }
        }
        const t = renderWithState(<App />, initState)
        t.debug(t.container)
        expect(t.container).toHaveTextContent(/nx1nx3nx2nx4/)
    })
})
