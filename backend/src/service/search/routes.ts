import { Request, Response } from 'express'
import { checkJwt } from '../../validator/auth'
import { checkSearchParams } from '../../validator/search'
import { getPlacesByName } from './SearchController'

export default [
    {
        path: '/api/v1/search',
        method: 'get',
        handler: [
            checkJwt,
            checkSearchParams,
            async ({ query }: Request, res: Response) => {
                const result = await getPlacesByName(query.q)
                res.status(200).send(result)
            }
        ]
    }
]
