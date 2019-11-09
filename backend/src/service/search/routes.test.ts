import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../utils";
import rp from "request-promise";
import { middlewares, errorHandlers} from "../../middleware";
import routes from "./routes";
import { App, createApp, shutdownApp } from '../../app';
import { HttpErrorNotFound, HttpStatusCode } from '../../utils/httpErrors';

jest.mock("request-promise");
(rp as any).mockImplementation(() => '{"features": []}');

describe("routes", () => {
  let app: App;

  beforeAll(async () => {
    app = await createApp()
  });

  afterAll(() => {
    shutdownApp(app)
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
    (rp as any).mockImplementation(() => "Service Unavailable.");
    const response = await request(app.router).get("/api/v1/search?q=Paris");
    expect(response.status).toEqual(HttpStatusCode.InternalServerError);
  });
});
