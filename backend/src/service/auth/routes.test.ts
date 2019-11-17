import supertest from 'supertest'
import { App } from '../../app'
import { testAppShutdown, testAppWithTestUser } from '../../testutil/testapp'
import { HttpStatusCode } from '../../util/httpErrors'

describe('service /auth', () => {
    let app: App

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
            const response = await supertest(app.router).post('/api/v1/auth/login').send(testUser)
            expect(response.status).toEqual(HttpStatusCode.Success)
        })

        test('login with valid user but invalid password', async () => {
            const response = await supertest(app.router).post('/api/v1/auth/login').send({
                username: 'test', password: 'invalidtest'
            })
            expect(response.status).toEqual(HttpStatusCode.BadRequest)
            expect(response.text).toEqual('Bad password')
        })

        test('login with invalid user and valid password', async () => {
            const response = await supertest(app.router).post('/api/v1/auth/login').send({
                username: 'invalidtest', password: 'test'
            })
            expect(response.status).toEqual(HttpStatusCode.BadRequest)
        })

        test('login with empty user and empty password', async () => {
            const response = await supertest(app.router).post('/api/v1/auth/login')
            expect(response.status).toEqual(HttpStatusCode.BadRequest)
        })
    })

    describe('/auth/password', () => {

        test('change password', async () => {
            const app = await testAppWithTestUser()
            // first need to login
            let response = await supertest(app.router)
                .post('/api/v1/auth/login')
                .send({
                    username: 'test',
                    password: 'test'
                })

            expect(response.status).toBe(HttpStatusCode.Success)
            const { token } = response.body
            expect(token).toBeDefined()

            // invalid token
            response = await supertest(app.router)
                .post('/api/v1/auth/password')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer invalid token')

            expect(response.status).toBe(HttpStatusCode.Unauthorized)

            response = await supertest(app.router)
                .get('/api/v1/auth/ping')
                .set('Authorization', 'Bearer ' + token)

            expect(response.status).toBe(HttpStatusCode.Success)
            expect(response.text).toBe('hello')

            response = await supertest(app.router)
                .post('/api/v1/auth/password')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    oldPassword: 'test',
                    newPassword: 'testnew'
                })
            expect(response.status).toBe(HttpStatusCode.Success)

            //no old and new password
            response = await supertest(app.router)
                .post('/api/v1/auth/password')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(HttpStatusCode.BadRequest)

            // changed password should not invalid the token.
            response = await supertest(app.router)
                .get('/api/v1/auth/ping')
                .set('Authorization', 'Bearer ' + token)
            expect(response.status).toBe(HttpStatusCode.Success)
            expect(response.text).toBe('hello')

            // shutdown
            await testAppShutdown(app)
        })

    })
})
