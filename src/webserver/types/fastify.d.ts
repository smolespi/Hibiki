import type { Profile } from "passport-discord";

declare module "fastify" {
  interface PassportUser extends Profile {}
}
