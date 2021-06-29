import { UnauthorizedException } from "@fasteerjs/exceptions";
import type { RouteDef } from "webserver/types";
import { onlyRoutes } from "webserver/utils";

const ONLY_ROUTES: RouteDef[] = [];

export const authMiddleware = onlyRoutes(async (req) => {
  if (!req.user) {
    throw new UnauthorizedException("You are not authenticated.")
  }
}, ONLY_ROUTES);
