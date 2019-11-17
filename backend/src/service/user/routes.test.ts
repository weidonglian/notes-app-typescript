import supertest from 'supertest'
import tconsole from '../../testutil/console'
import { TestApp, testAppShutdown, testAppWithLoginTestUser } from '../../testutil/testapp'
import { HttpStatusCode } from '../../util/httpErrors'

describe("service /user get", () => {
  let app: TestApp
  beforeAll(async () => {
    app = await testAppWithLoginTestUser()
  });

  afterAll(async () => {
    await testAppShutdown(app)
  });

  test('GET /user invalid token', async () => {
    let rsp = await supertest(app.router)
      .get('/api/v1/user')
      .set('Authorization', 'Bearer invalid token')
    expect(rsp.status).toBe(HttpStatusCode.Unauthorized)
  });

  test('GET /user valid token but admin', async () => {
    let rsp = await supertest(app.router)
      .get('/api/v1/user')
      .set('Authorization', 'Bearer ' + app.testUserToken)
    expect(rsp.status).toBe(HttpStatusCode.Forbidden)
  });

  test('GET /user valid admin token', async () => {
    let rsp = await supertest(app.router)
      .get('/api/v1/user')
      .set('Authorization', 'Bearer ' + app.adminUserToken)
    expect(rsp.status).toBe(HttpStatusCode.Success)
    const users = rsp.body
    expect(users).toBeDefined()
    expect(Array.isArray(users)).toBe(true)
    expect(users.length).toBeGreaterThanOrEqual(2)
  });

  test('GET /user/:id', async () => {
    let rsp = await supertest(app.router)
      .get('/api/v1/user/1')
    expect(rsp.status).toBe(HttpStatusCode.Unauthorized)

    rsp = await supertest(app.router)
      .get('/api/v1/user/1')
      .set('Authorization', 'Bearer ' + app.adminUserToken)
    expect(rsp.status).toBe(HttpStatusCode.Success)
    let user = rsp.body
    expect(user).toBeDefined()
    expect(user).toHaveProperty('username', 'test')
    expect(user).toHaveProperty('role', 'USER')

    rsp = await supertest(app.router)
      .get('/api/v1/user/2')
      .set('Authorization', 'Bearer ' + app.adminUserToken)
    expect(rsp.status).toBe(HttpStatusCode.Success)
    user = rsp.body
    expect(user).toBeDefined()
    expect(user).toHaveProperty('username', 'admin')
    expect(user).toHaveProperty('role', 'ADMIN')
  });
});

describe('service /user patch delete', () => {
  let app: TestApp
  beforeEach(async () => {
    app = await testAppWithLoginTestUser()
  });

  afterEach(async () => {
    await testAppShutdown(app)
  });

  test('Patch /user', async () => {
    let rsp = await supertest(app.router)
      .patch('/api/v1/user/1')
      .set('Authorization', 'Bearer ' + app.adminUserToken)
      .send({
        username: 'newtest',
        role: 'ADMIN'
      })
    expect(rsp.status).toBe(HttpStatusCode.Success)
    const user = rsp.body
    expect(user).toBeDefined();
    tconsole.log(user);
    (user)
    expect(user).toHaveProperty('username', 'newtest')
    expect(user).toHaveProperty('role', 'ADMIN')
  });

});
