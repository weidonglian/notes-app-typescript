import React from 'react'
import { notesActions } from '../../actions/notes'
import { App } from './App'
import { AppState, initialAppState } from '../../reducers'
import { renderWithState } from '../../utils/test-utils'

describe('App test', () => {
    test('renders without crashing', () => {
        const t = renderWithState(<App/>, initialAppState)
        expect(t.container).toHaveTextContent(/First NoteSecond NoteThird Note/)
    })

    test('renders with given init', () => {
        const initState: AppState = {
            notes: {
                notes: ['nx1', 'nx3', 'nx2', 'nx4'].map(name => notesActions.addNote(name).payload.note)
            }
        }
        const t = renderWithState(<App/>, initState)
        expect(t.container).toHaveTextContent(/nx1nx3nx2nx4/)
    })
})
