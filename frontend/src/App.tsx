import 'reflect-metadata'
import React from 'react'
import { ScreenNotes } from './pages/Notes'

export class App extends React.Component<{}> {
    render() {
        return (
            <React.Fragment>
                <ScreenNotes/>
            </React.Fragment>
        )
    }
}

