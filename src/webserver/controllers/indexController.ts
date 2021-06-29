import type { Controller } from "webserver/types";
import { redirect } from "webserver/utils";

export default (async (app, { bot }) => {
  // Landing page
  app.get("/", async (req, res) => {
    return res.sendFile("index.html")
  });

  // Donate link
  app.get("/donate", redirect("https://ko-fi.com/sysdotini"));

  // Invite redirect
  app.get<{ Querystring: { guild?: string } }>("/invite", (req, res) => {
    res.redirect(
      301,
      req.query.guild
        ? `https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=1581116663&guild_id=${req.query.guild}`
        : `https://discordapp.com/oauth2/authorize?&client_id=${bot.user.id}&scope=bot&permissions=1581116663`,
    );
  });

  // Support discord
  // todo: configurable
  app.get("/support", redirect("https://discord.gg/gZEj4sM"));

  // Translate page
  app.get("/translate", redirect("https://translate.hibiki.app"));

  // GitHub repository
  app.get("/github", redirect("https://github.com/sysdotini/hibiki"));
  app.get("/contribute", redirect("https://github.com/sysdotini/hibiki"));

  // Privacy policy
  app.get("/privacy", redirect("https://github.com/sysdotini/hibiki/blob/main/.github/PRIVACY_POLICY.md"));

  // Top.gg vote
  // todo: configurable
  app.get("/vote", redirect("https://top.gg/bot/493904957523623936/vote"));

  // Robots.txt for crawlers
  app.get("/robots.txt", async (_, res) =>
    res.type("text/plain").send(
      [
        // robots.txt rules here
        "User-agent: *",
        "Crawl-delay: 5",
        "Disallow: /public/",
        "Disallow: /auth/",
      ].join("\n"),
    ),
  );
}) as Controller;
