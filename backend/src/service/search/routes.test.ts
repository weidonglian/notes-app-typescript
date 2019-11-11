import request from "supertest";
import * as rp from "request-promise";
import { App, createApp, shutdownApp } from '../../app';
import { HttpStatusCode } from '../../utils/httpErrors';
import * as checks from '../../utils/checks';
import { NextFunction, Request, Response } from 'express'

describe("routes", () => {
  let app: App
  const checkJwtMock = jest.spyOn(checks, "checkJwt")
  const rpMock =  jest.spyOn(rp, 'default')

  beforeAll(async () => {
    app = await createApp();
    checkJwtMock.mockImplementation((req: Request, res: Response, next: NextFunction)=> {
      next()
    });
    (rpMock as any).mockImplementation(() => '{"features": []}');
  });

  afterAll(() => {
    shutdownApp(app);
    checkJwtMock.mockRestore();
    rpMock.mockRestore();
  })

  test("a valid string query", async () => {
    const response = await request(app.router).get("/api/v1/search?q=Cham");
    expect(response.status).toEqual(HttpStatusCode.OK);
  });

  test("a non-existing api method", async () => {
    const response = await request(app.router).get("/api/v11/search");
    expect(response.status).toEqual(HttpStatusCode.NotFound);
  });

  test("an empty string", async () => {
    const response = await request(app.router).get("/api/v1/search?q=");
    expect(response.status).toEqual(HttpStatusCode.BadRequest);
  });

  test("a service is not available", async () => {
    (rpMock as any).mockImplementation(() => "Service Unavailable.");
    const response = await request(app.router).get("/api/v1/search?q=Paris");
    expect(response.status).toEqual(HttpStatusCode.InternalServerError);
  });
});
