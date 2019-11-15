import request from "supertest";
import { NextFunction, Request, Response } from 'express'
import handleChecks from '../../util/handleChecks';
import { App, shutdownApp } from '../../app';
import { HttpStatusCode } from '../../util/httpErrors';
import { testAppWithTestUser, testAppShutdown } from '../../testutil/testapp';


describe("auth routes", () => {
  let app: App
  const testUser = {
    username: 'test',
    password: 'test'
  }

  beforeEach(async () => {
    app = await testAppWithTestUser()
  })

  afterEach(async () => {
    await testAppShutdown(app)
  })

  test('login with valid user and password', async () => {
    const response = await request(app.router).post('/api/v1/auth/login').send(testUser);
    expect(response.status).toEqual(HttpStatusCode.OK)
  })

  test('login with valid user but invalid password', async () => {
    const response = await request(app.router).post('/api/v1/auth/login').send({
      username: 'test', password: 'invalidtest'
    })
    expect(response.status).toEqual(HttpStatusCode.BadRequest)
    expect(response.text).toEqual('Bad password')
  })

  test('login with invalid user and valid password', async () => {
    const response = await request(app.router).post('/api/v1/auth/login').send({
      username: 'invalidtest', password: 'test'
    })
    expect(response.status).toEqual(HttpStatusCode.BadRequest)
  })

  test('login with empty user and empty password', async () => {
    const response = await request(app.router).post('/api/v1/auth/login')
    expect(response.status).toEqual(HttpStatusCode.BadRequest)
  })
});
