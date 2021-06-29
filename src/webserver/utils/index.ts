// todo: move this boilerplate somewhere else lol
import type { FastifyReply, FastifyRequest } from "fastify";
import type { MiddlewareFunc, RouteDef } from "webserver/types";

export const routesInclude = (req: FastifyRequest, routes: [string, string][]): boolean => {
  // 404
  if (!req.routerMethod || !req.routerPath) return false;

  return routes.some(([method, path]) => req.routerMethod.toUpperCase() === method.toUpperCase() && req.routerPath === path);
};

/**
 * Small helper to use only run the middleware on certain routes.
 *
 * @param middleware The middleware
 * @param {[string|string][]} routes Array of allowed methods and paths as [Method, Path]
 */
export const onlyRoutes = (middleware: MiddlewareFunc, routes: RouteDef[], fallbackValue = false): MiddlewareFunc => {
  return async (req: FastifyRequest, res: FastifyReply) => {
    if (routesInclude(req, routes))
      // Using call so the same `this` scope can be ensured.
      return await middleware.call(this, req, res);

    return fallbackValue;
  };
};

/**
 * Opposite of onlyRoutes
 *
 * @param middleware The middleware
 * @param {[string|string][]} routes Array of allowed methods and paths as [Method, Path]
 */
export const exceptRoutes = (middleware: MiddlewareFunc, routes: RouteDef[], fallbackValue = false): MiddlewareFunc => {
  return async (req, res) => {
    if (routesInclude(req, routes)) return fallbackValue;

    // Using call so the same `this` scope can be ensured.
    return await middleware.call(this, req, res);
  };
};

/**
 * Redirect Route Handler
 */
export const redirect = (url: string) => (_: FastifyRequest, res: FastifyReply) => {
  res.redirect(301, url);
};
