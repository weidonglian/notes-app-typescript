import { checkJwt } from '../../validator'
import { SearchController } from './SearchController'
import { Route } from '../../util'

const routes: Route[] = [
    {
        path: '/search',
        method: 'get',
        handler: [
            checkJwt,
            SearchController.search
        ]
    }
]

export default routes;