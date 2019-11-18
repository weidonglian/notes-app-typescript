import { checkJwt } from '../../validator/auth'
import { checkSearchParams } from '../../validator/search'
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
