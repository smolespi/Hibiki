import type { RouteDef } from "webserver/types";
import { onlyRoutes } from "webserver/utils";

const ONLY_ROUTES: RouteDef[] = [["GET", "/todo"]];

export const noCacheMiddleware = onlyRoutes(
  async (_, res) => {
    res.header("Cache-Control", "no-cache");
  },
  ONLY_ROUTES,
  true,
);
