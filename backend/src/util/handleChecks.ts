import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { appConfig } from '../config/config'
import { User } from '../entity/User'
import { HttpErrorBadRequest, HttpErrorForbidden, HttpErrorUnauthorized } from './httpErrors'
import { ValidatorOptions } from 'class-validator'
import { transformAndValidateSync } from 'class-transformer-validator'

const checkSearchParams = (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.q) {
        throw new HttpErrorBadRequest('Missing q parameter')
    } else {
        next()
    }
}

function checkBody<T>(t: T, validatorOptions?: ValidatorOptions) {
    return function(req: Request, res: Response, next: NextFunction) {
        if (!req.body)
            throw new HttpErrorBadRequest('checkBody: No request body found')
        try {
            req.body = transformAndValidateSync(t as any, req.body, { validator: validatorOptions })
            next()
        } catch(error) {
            throw new HttpErrorBadRequest(`checkBody: ${error}`)
        }
    }
}

const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head and Express headers are auto converted to lowercase
    let token = (req.headers['x-access-token'] || req.headers['authorization']) as string
    if (token && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
    }

    let jwtPayload

    const jwtSecret = appConfig.jwtSecret
    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, jwtSecret)
        res.locals.jwtPayload = jwtPayload
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        throw new HttpErrorUnauthorized()
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, username } = jwtPayload
    const newToken = jwt.sign({ userId, username }, jwtSecret, {
        expiresIn: '1h'
    })
    res.setHeader('auth-token', newToken)

    //Call the next middleware or controller
    next()
}

// we must have done the checkJwt first and then check the role
const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the user ID from previous midleware
        const id = res.locals.jwtPayload.userId

        //Get user role from the database
        const userRepository = getRepository(User)
        let user: User
        try {
            user = await userRepository.findOneOrFail(id)
            //Check if array of authorized roles includes the user's role
            if (roles.indexOf(user.role) > -1) {
                next()
            } else {
                throw new HttpErrorForbidden()
            }
        } catch (id) {
            throw new HttpErrorForbidden()
        }
    }
}

const handleChecks = {
    checkJwt, checkRole, checkBody, checkSearchParams
}

export default handleChecks