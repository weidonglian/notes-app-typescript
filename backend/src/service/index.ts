import authRoutes from './auth/routes'
import searchRoutes from './search/routes'
import userRoutes from './user/routes'

export default [
    ...userRoutes,
    ...authRoutes,
    ...searchRoutes
]
