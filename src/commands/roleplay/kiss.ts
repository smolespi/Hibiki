import type { Member, Message, TextChannel } from "eris";
import type { WeebSHImage } from "../../typings/endpoints";
import { Command } from "../../classes/Command";
import axios from "axios";

export class KissCommand extends Command {
  args = "<member:member>";
  aliases = ["makeout", "smooch"];
  description = "Gives someeone a kiss.";
  cooldown = 3000;

  async run(msg: Message<TextChannel>, pargs: ParsedArgs[]) {
    const member = pargs[0].value as Member;
    const body = (await axios
      .get("https://api.weeb.sh/images/random?type=kiss", {
        headers: {
          "Authorization": `Wolke ${this.bot.config.keys.weebsh}`,
          "User-Agent": "hibiki",
        },
      })
      .catch(() => {})) as WeebSHImage;

    let image = "";
    if (!body || !body?.data?.url) image = "https://cdn.weeb.sh/images/rkM4nTOPb.gif";
    else image = body.data.url;

    msg.channel.createMessage({
      embed: {
        description: `💙 ${msg.string("roleplay.KISS", { user: msg.author.username, member: member.user.username })}`,
        color: msg.convertHex("general"),
        image: {
          url: image,
        },
        footer: {
          text: msg.string("global.RAN_BY", {
            author: msg.tagUser(msg.author),
            poweredBy: "weeb.sh",
          }),
          icon_url: msg.author.dynamicAvatarURL(),
        },
      },
    });
  }
}
