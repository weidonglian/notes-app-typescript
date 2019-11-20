import React from 'react'
import { App } from './App'
import { testRender, cleanup } from '../utils/test-utils'

describe('App test', () => {
    afterEach(() => {
        cleanup()
    })

    test('renders without crashing', () => {
        const t = testRender(<App />)
        expect(t.container).toHaveTextContent("NotesFirst NoteSecond NoteThird Note")
    })
})
