import request from "supertest";
import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import * as checks from '../../util/checks';
import { App, createApp, shutdownApp } from '../../app';
import { HttpStatusCode } from '../../util/httpErrors';


describe("user routes", () => {
  const checkJwtMock = jest.spyOn(checks, "doCheckJwt")
  const axiosMock = jest.spyOn(axios, 'get')
  let app: App

  beforeAll(async () => {
    // mock implementation should be done before create app
    checkJwtMock.mockImplementation((req: Request, res: Response, next: NextFunction) => {
      next()
    });
    axiosMock.mockResolvedValue({
      status: HttpStatusCode.OK,
      data: JSON.stringify({
        type: "FeatureCollection",
        features: []
      })
    })

    // now create app
    app = await createApp();
  });

  afterAll(async () => {
    // shutdown first
    await shutdownApp(app);
    // restore mock
    axiosMock.mockRestore()
    checkJwtMock.mockRestore();
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
    axiosMock.mockResolvedValue({
      status: 503,
      data: 'Service Unavailable.'
    })
    const response = await request(app.router).get("/api/v1/search?q=Paris");
    expect(response.status).toEqual(HttpStatusCode.InternalServerError);
  });
});
