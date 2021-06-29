import type { FasteerInstance } from "@fasteerjs/fasteer";
import type { HibikiClient } from "classes/Client";
import { getSecret } from "webserver/utils/secret";
import DiscordStrategy, { Profile } from "passport-discord";
import fastifyPassport from "fastify-passport";
import fastifySecureSession from "fastify-secure-session";

export interface SessionsOptions {
  secretPath: string;
}

export const sessions = (bot: HibikiClient, { secretPath }: SessionsOptions) => async (app: FasteerInstance) => {
  app.fastify.register(fastifySecureSession, {
    key: getSecret(secretPath),
    cookieName: "hibiki_session",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
      sameSite: bot.config.dashboard.cookieSecure ? "lax" : false,
      // If you are getting infinite redirects, set this to "false" if you don't have a HTTPS-only environment setup.
      secure: bot.config.dashboard.cookieSecure,
    },
  });

  app.fastify.register(fastifyPassport.initialize());
  app.fastify.register(fastifyPassport.secureSession());

  fastifyPassport.use(
    "discord",
    new DiscordStrategy({
      clientID: bot.user.id,
      clientSecret: bot.config.dashboard.botSecret,
      callbackURL: `${bot.config.dashboard.baseUrl}/auth/login`,
      scope: ["identify", "guilds"],
    }, async (_, __, profile, done) => {
      await bot.redis.saveProfile(profile);
      done(null, profile);
    }),
  );

  fastifyPassport.registerUserSerializer(async (profile: Profile) => profile.id)

  fastifyPassport.registerUserDeserializer(async (id: string) => await bot.redis.getProfile(id))
};
