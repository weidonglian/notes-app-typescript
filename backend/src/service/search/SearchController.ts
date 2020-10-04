import { Request, Response } from 'express'
import { getPlaces } from './providers/OpenCageDataProvider'
import { HttpStatusCode, HttpErrorBadRequest } from '../../util/httpErrors'
import { isArray, isEmpty } from 'class-validator'

export class SearchController {
    static search = async (req: Request, res: Response) => {
        const { query } = req
        if (isEmpty(query.q))
            throw new HttpErrorBadRequest('Missing q parameter')
        if ((query.q as string).length < 3)
            return {
                type: 'FeatureCollection',
                features: []
            }
        try {
            const result = await getPlaces(query.q as any)
            res.status(HttpStatusCode.Success).send(result)
        } catch (error) {
            res.status(HttpStatusCode.InternalServerError).send(error)
        }
    }
}