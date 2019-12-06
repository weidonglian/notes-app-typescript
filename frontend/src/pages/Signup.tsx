import React from 'react'
import { SignupForm } from '../components/Signup/Form'
import { useHistory } from 'react-router'

export const SignupPage = () => {
    const history = useHistory()
    return (
        <SignupForm histroy={history} />
    )
}