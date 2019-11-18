import { Request, Response } from 'express'
import { getPlaces } from './providers/OpenCageDataProvider'
import { HttpStatusCode } from '../../util/httpErrors'

export class SearchController {
    static search = async (req: Request, res: Response) => {
        const { query } = req
        if (query.q.length < 3) {
            return {
                type: 'FeatureCollection',
                features: []
            }
        }
        try {
            const result = await getPlaces(query.q)
            res.status(HttpStatusCode.Success).send(result)
        } catch(error) {
            res.status(HttpStatusCode.InternalServerError).send(error)
        }
    }
}