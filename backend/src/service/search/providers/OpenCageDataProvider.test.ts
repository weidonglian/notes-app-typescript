import moxios from 'moxios'
import * as Provider from './OpenCageDataProvider'
import { HttpStatusCode } from '../../../util/httpErrors'

describe('OpenCageDataProvider', () => {
    beforeEach(() => {
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    test('an empty query string', async () => {
        const response = {
            features: [],
            resp: [1, 2, 3]
        }
        moxios.stubRequest(/api.opencagedata.com.*/, {
            status: 200,
            response: response
        })
        const result = await Provider.getPlaces('Chamonix')
        expect(result).toEqual(response)
    })

    test('an invalid non-json response', async () => {
        moxios.stubRequest(/api.opencagedata.com.*/, {
            status: HttpStatusCode.ServiceUnavailable,
            responseText: 'Service Unavailable'
        })
        await expect(Provider.getPlaces('Chamonix')).rejects.toBeTruthy()
    })
})
