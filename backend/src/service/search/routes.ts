import { Request, Response } from "express";
import { getPlacesByName } from "./SearchController";
import { checkSearchParams, checkJwt } from "../../utils/checks";

export default [
  {
    path: "/api/v1/search",
    method: "get",
    handler: [
      checkJwt,
      checkSearchParams,
      async ({ query }: Request, res: Response) => {
        const result = await getPlacesByName(query.q);
        res.status(200).send(result);
      }
    ]
  }
];
