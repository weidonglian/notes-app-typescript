import request from "supertest";
import { NextFunction, Request, Response } from 'express'
import * as rp from "request-promise";
import * as checks from '../../utils/checks';
import { App, createApp, shutdownApp } from '../../app';
import { HttpStatusCode } from '../../utils/httpErrors';


describe("routes", () => {
  const checkJwtMock = jest.spyOn(checks, "doCheckJwt")
  const rpMock = jest.spyOn(rp, 'get')
  let app: App

  beforeAll(async () => {
    // mock implementation should be done before create app
    checkJwtMock.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      next()
    });

    (rpMock as any).mockImplementation(() => {
      return JSON.stringify({
        features: []
      })
    });

    // now create app
    app = await createApp();
  });

  afterAll(() => {
    // shutdown first
    shutdownApp(app);
    // restore mock
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
