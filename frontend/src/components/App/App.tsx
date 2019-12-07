import 'reflect-metadata'
import React from 'react'
import { NotesPage } from '../../pages/Notes'
import { LoginPage } from '../../pages/Login'
import { SignupPage } from '../../pages/Signup'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { PrivateRoute, RestrictedRoute } from '../../utils/route-utils'
import { AppHeader } from './Header'
import { AppMessage } from './AppMessage'

export const App = () => {
    return (
        <Router>
            <AppHeader />
            <AppMessage />
            <Switch>
                <Route exact path='/'>
                    <Redirect to='/notes' />
                </Route>
                <Route exact path='/signup' component={SignupPage} />
                <RestrictedRoute exact path='/login'>
                    <LoginPage />
                </RestrictedRoute>
                <PrivateRoute exact path='/notes'>
                    <NotesPage />
                </PrivateRoute>
            </Switch>
        </Router>
    )
}

