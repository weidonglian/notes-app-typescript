import axios, { AxiosRequestConfig } from 'axios'
import { NextFunction, Request, Response } from 'express'
import axiosist from 'axiosist'
import { App, createApp, shutdownApp } from '../../app'
import handleChecks from '../../util/handleChecks'
import { HttpStatusCode } from '../../util/httpErrors'
import { testAppWithTestUser, TestApp, testAppShutdown, testAppWithLoginTestUser, TestAppWithTokens, makeAuthHeaderOptions } from '../../testutil/testApp'
import moxios from 'moxios'


describe('service /search', () => {
    let app: TestAppWithTokens
    let authOptions: AxiosRequestConfig

    beforeAll(async () => {
        // now create app
        app = await testAppWithLoginTestUser()
        authOptions = makeAuthHeaderOptions(app.testUserToken)
    })

    afterAll(async () => {
        // shutdown first
        await testAppShutdown(app)
    })

    describe('with valid search service', () => {
        beforeAll(() => {
            moxios.install()
            const response = {
                features: [],
                resp: [1, 2, 3]
            }
            moxios.stubRequest(/api.opencagedata.com.*/, {
                status: 200,
                response: response
            })
        })

        afterAll(() => {
            moxios.uninstall()
        })

        test('a valid string query', async () => {
            const response = await axiosist(app.express).get('/api/v1/search?q=Cham', authOptions)
            expect(response.status).toEqual(HttpStatusCode.Success)
        })

        test('a non-existing api method', async () => {
            const response = await axiosist(app.express).get('/api/v11/search', authOptions)
            expect(response.status).toEqual(HttpStatusCode.NotFound)
        })

        test('an empty string', async () => {
            const response = await axiosist(app.express).get('/api/v1/search?q=', authOptions)
            expect(response.status).toEqual(HttpStatusCode.BadRequest)
        })

    })

    test('a service is not available', async () => {
        moxios.install()
        moxios.stubRequest(/api.opencagedata.com.*/, {
            status: HttpStatusCode.ServiceUnavailable,
            responseText: 'Service Unavailable'
        })
        const response = await axiosist(app.express).get('/api/v1/search?q=Paris', authOptions)
        expect(response.status).toBe(HttpStatusCode.InternalServerError)
        moxios.uninstall()
    })
})
