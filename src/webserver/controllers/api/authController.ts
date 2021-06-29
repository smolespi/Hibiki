import type { Controller } from "../../types";
import fastifyPassport from "fastify-passport";

const AuthController: Controller = async (app) => {
  app.get(
    "/authorize",
    { preValidation: fastifyPassport.authenticate("discord") },
    async (req, res) => {
      req.session.set("discordId", req.user.id);

      res.send({
        success: true,
        data: {
          message: "ok",
        },
      });
    }
  );

  app.get("/logout", async (req, res) => {
    req.session.delete();

    res.send({
      success: true,
      data: {
        message: "ok",
      },
    });
  });
};

export const routePrefix = "/api/auth";

export default AuthController;
