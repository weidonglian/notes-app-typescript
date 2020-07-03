import axiosist from 'axiosist'
import { testAppShutdown, testAppWithTestUser, TestApp, makeAuthHeaderOptions } from '../../testutil/testApp'
import { HttpStatusCode } from '../../util/httpErrors'

describe('service /auth', () => {
    let app: TestApp

    const testUser = {
        username: 'test',
        password: 'test'
    }

    describe('/auth/login', () => {
        beforeAll(async () => {
            app = await testAppWithTestUser()
        })

        afterAll(async () => {
            await testAppShutdown(app)
        })

        test('login with valid user and password', async () => {
            const response = await axiosist(app.express).post('/api/v1/auth/login', testUser)
            expect(response.status).toEqual(HttpStatusCode.Success)
        })

        test('login with valid user but invalid password', async () => {
            const response = await axiosist(app.express).post('/api/v1/auth/login', {
                username: 'test', password: 'invalidtest'
            })
            expect(response.status).toEqual(HttpStatusCode.BadRequest)
            expect(response.data.message).toEqual('Bad password')
        })

        test('login with invalid user and valid password', async () => {
            const response = await axiosist(app.express).post('/api/v1/auth/login', {
                username: 'invalidtest', password: 'test'
            })
            expect(response.status).toEqual(HttpStatusCode.BadRequest)
        })

        test('login with empty user and empty password', async () => {
            const response = await axiosist(app.express).post('/api/v1/auth/login')
            expect(response.status).toEqual(HttpStatusCode.BadRequest)
        })
    })


    describe('/auth/password', () => {
        test('change password', async () => {
            const app = await testAppWithTestUser()
            // first need to login
            let response = await axiosist(app.express).post('/api/v1/auth/login', {
                username: 'test',
                password: 'test'
            })

            expect(response.status).toBe(HttpStatusCode.Success)
            const { token } = response.data
            expect(token).toBeDefined()

            const authTokenOptions = makeAuthHeaderOptions(token)
            const invalidTokenOptions = makeAuthHeaderOptions('invalid token')

            // invalid token
            response = await axiosist(app.express).post('/api/v1/auth/password', {}, invalidTokenOptions)
            expect(response.status).toBe(HttpStatusCode.Unauthorized)

            response = await axiosist(app.express).get('/api/v1/auth/ping', authTokenOptions)
            expect(response.status).toBe(HttpStatusCode.Success)
            expect(response.data).toBe('hello')

            response = await axiosist(app.express).post('/api/v1/auth/password', {
                oldPassword: 'test',
                newPassword: 'testnew'
            }, authTokenOptions)
            expect(response.status).toBe(HttpStatusCode.Success)

            //no old and new password
            response = await axiosist(app.express).post('/api/v1/auth/password', {}, authTokenOptions)
            expect(response.status).toBe(HttpStatusCode.BadRequest)

            // changed password should not invalid the token.
            response = await axiosist(app.express).get('/api/v1/auth/ping', authTokenOptions)
            expect(response.status).toBe(HttpStatusCode.Success)
            expect(response.data).toBe('hello')

            // shutdown
            await testAppShutdown(app)
        })

    })
})
