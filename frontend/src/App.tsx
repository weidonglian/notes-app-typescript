import 'reflect-metadata'
import React from 'react'
import { NotesPage } from './pages/Notes'
import { LoginPage } from './pages/Login'
import { SignupPage } from './pages/Signup'
import { HomePage } from './pages/Home'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { PrivateRoute, RestrictedRoute } from './utils/route-utils'

export const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={HomePage} />
                <Route exact path='/signup' component={SignupPage} />
                <RestrictedRoute exact path='/login' component={LoginPage} />
                <PrivateRoute>
                    <Route exact path='/notes' component={NotesPage} />
                </PrivateRoute>
            </Switch>
        </Router>
    )
}

