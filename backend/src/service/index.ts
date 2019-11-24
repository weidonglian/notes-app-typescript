import authRoutes from './auth/routes'
import searchRoutes from './search/routes'
import userRoutes from './users/routes'

export default [
    ...userRoutes,
    ...authRoutes,
    ...searchRoutes
]
