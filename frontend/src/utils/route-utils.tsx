import React, { Fragment } from 'react'
import { Redirect, RouteProps } from 'react-router-dom'
import { auth } from '../services/auth'

export const PrivateRoute = (props: RouteProps) => (
    <Fragment>
        {auth.isAuthenticated() ? (props.component || props.children) : <Redirect to='/login' />}
    </Fragment>
)


export const RestrictedRoute = (props: RouteProps) => (
    <Fragment>
        {auth.isAuthenticated() ? <Redirect to='/' /> : (props.component || props.children)}
    </Fragment>
)
