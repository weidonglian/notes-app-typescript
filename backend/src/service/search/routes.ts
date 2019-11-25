import { checkJwt, checkSearchParams } from '../../validator'
import { SearchController } from './SearchController'

export default [
    {
        path: '/search',
        method: 'get',
        handler: [
            checkJwt,
            checkSearchParams,
            SearchController.search
        ]
    }
]
