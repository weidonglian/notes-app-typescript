import * as Provider from "./OpenCageDataProvider";
import axios from 'axios'

describe("OpenCageDataProvider", () => {


  test("an empty query string", async () => {
    const axiosMock = jest.spyOn(axios, "get")
    axiosMock.mockResolvedValue({
      status: 200,
      data: JSON.stringify({
        features: []
      })
    })
    const result = await Provider.getPlaces("Chamonix");
    expect(result).toEqual({features: []});
    axiosMock.mockRestore()
  });

  test("an invalid non-json response", async () => {
    const axiosMock = jest.spyOn(axios, "get")
    axiosMock.mockResolvedValue({
      status: 503,
      data: 'Service Unavailable.'
    })
    await expect(Provider.getPlaces("Chamonix")).rejects.toThrow(SyntaxError);
    axiosMock.mockRestore()
  });
});
