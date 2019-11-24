import auth from './auth/routes'
import search from './search/routes'
import users from './users/routes'
import notes from './notes/routes'

export default [
    ...auth,
    ...search,
    ...users,
    ...notes,
]
