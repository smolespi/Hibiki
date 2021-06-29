import { createExceptionHandler } from "@fasteerjs/exceptions";
import type { FasteerInstance } from "@fasteerjs/fasteer";

export const exceptionHandler = (app: FasteerInstance) => {
  const isDev = process.env.NODE_ENV === "development";

  app.fastify.setErrorHandler(
    createExceptionHandler({
      errorHandler: (err, req, res) => {
        // TODO: logging

        if (err.validation) {
          // Validation error
          return res.status(400).send({
            success: false,
            error: {
              kind: "validation",
              message: "Invalid Request",
            },
          });
        }

        if (isDev) {
          app.logger.error(`An error occurred while handling the ${req.method} ${req.url} route (Status Code: ${err.statusCode}):`);
          app.logger.error(err.stack);
        }

        res.send({
          success: false,
          error: {
            kind: "internal",
            message: "Internal Server Error",
            ...(isDev ? { stack: err.stack } : {}),
          },
        });
      },
    }),
  );

  app.fastify.setNotFoundHandler((req, res) => {
    // API request, send a 404.
    if (req.url.startsWith("/api")) {
      return res.status(404).send({
        success: false,
        error: {
          kind: "user_input",
          message: "Invalid endpoint"
        }
      })
    }

    // All non-"/api" routes are client-side routes (except for redirects),
    // so the React SPA should be served.
    res.status(200).sendFile("index.html")
  });
};
