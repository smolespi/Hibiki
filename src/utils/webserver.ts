/**
 * @file Webserver
 * @description Commonly used utilities for the webserver
 * @module utils/webserver
 */

import type { Collection, Guild } from "eris";
import type { Profile } from "passport-discord";
import type { HibikiClient } from "../classes/Client";
import { defaultAvatar } from "./constants";
import type { FastifyReply, FastifyRequest } from "fastify";

const mergedLocales = {};

// Checks if a user is authenticated
export const checkAuth = (req: FastifyRequest, res: FastifyReply) => {
  if (!req.user)
    res.redirect(301, "/auth/login");
};

/**
 * Gets authenticated user info
 *
 * @apiForm v1
 * @deprecated
 */
export function getAuthedUser(user: Profile) {
  return {
    username: user.username,
    discriminator: user.discriminator,
    guilds: user.guilds,
    id: user.id,
    avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` : defaultAvatar,
  };
}

// Checks to see if an item is an Object
// JavaScript sucks
function isObject(item: Record<string, string>) {
  return item && typeof item === "object" && !Array.isArray(item);
}

// Merges two objects "deeply"
// Why on earth does JS not support this?
// This is awful code. SOF is not skid!
function mergeDeep(target: { [x: string]: any }, source: { [x: string]: any }) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

// Gets what locales to send to a route
export function getWebLocale(bot: HibikiClient, locale: string) {
  if (bot.config.defaultLocale === locale) return bot.localeSystem.locales[bot.config.defaultLocale];
  else {
    if (!mergedLocales[locale]) {
      const merged = mergeDeep(bot.localeSystem.locales[bot.config.defaultLocale] as any, bot.localeSystem.locales[locale] as any);
      mergedLocales[locale] = merged;
    }

    return mergedLocales[locale];
  }
}

/**
 * Destroys a session.
 * @deprecated Use req.session.delete()
 */
export async function destroySession(req: FastifyRequest) {
  return req.session.delete()
}

/**
 * Gets guilds that a user can manage
 * @deprecated
 */
export function getManagableGuilds(req: FastifyRequest, user: Profile, guilds: Collection<Guild>) {
  const managableGuilds = user.guilds.filter((g) => (g.permissions & 32) === 32 || ((g.permissions & 8) === 8 && guilds.get(g.id)));
  const guild = managableGuilds.find((g) => g.id === (req.params as any)?.id);
  return guild;
}
