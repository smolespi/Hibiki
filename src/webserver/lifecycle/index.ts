import type { FasteerInstance } from "@fasteerjs/fasteer";
import { exceptionHandler } from "./exception";
import { authMiddleware } from "./middleware/auth";
import { noCacheMiddleware } from "./middleware/noCache";

const globalMiddlewares = [authMiddleware, noCacheMiddleware];

export const lifecycle = (app: FasteerInstance) => {
  app.fastify.addHook("onRequest", async (req, res) => {
    // Opts out of Chrome FLoC, even though we don't serve ads. https://amifloced.org/
    res.header("Permissions-Policy", "interest-cohort=()");

    // Runs all global middlewares.
    for (const middleware of globalMiddlewares) {
      const next = await middleware(req, res);

      // Stricly using `=== false` because other falsy values can be passed.
      if (next === false) return;
    }
  });

  exceptionHandler(app);
};
