/*
  Logs when member's punishments are applied or removed.
*/

const Logging = require("structures/Logger");
const format = require("utils/format");

module.exports = (bot) => {
  // Logging database
  const loggingdb = new Logging(bot.db);
  const cansend = async (guild) => {
    if (!guild || !guild.channels) return;
    const canlog = await loggingdb.canLog(guild);
    if (!canlog) return;
    // Sets type
    const channel = await loggingdb.guildLogging(guild, "modLogging");
    if (guild.channels.has(channel)) return channel;
  };

  // Tries to log
  const trysend = async (guild, event, embed) => {
    const channel = await cansend(guild, event);
    if (channel) {
      bot.createMessage(channel, {
        embed: embed,
      }).catch(() => {});
    }
  };

  // Logs when a member is warned
  bot.on("memberWarn", (guild, giver, receiver, id, reason) => trysend(guild, "memberWarn", {
    description: `**Reason:** ${reason} \n **ID:** ${id}`,
    color: bot.embed.color("error"),
    author: {
      name: `${format.tag(giver, true)} warned ${format.tag(receiver)}.`,
      icon_url: receiver.avatarURL,
    },
  }));

  // Logs when warnings are removed
  bot.on("warningRemove", (guild, user, ids) => trysend(guild, "warningRemove", {
    description: ids.join(" "),
    color: bot.embed.color("error"),
    author: {
      name: `${format.tag(user, true)} removed warnings.`,
      icon_url: user.avatarURL,
    },
  }));

  // Logs when a member is muted
  bot.on("memberMute", (guild, giver, receiver, reason) => trysend(guild, "memberMute", {
    description: `**Reason:** ${reason}`,
    color: bot.embed.color("error"),
    author: {
      name: `${format.tag(giver, true)} muted ${format.tag(receiver)}.`,
      icon_url: receiver.avatarURL,
    },
  }));

  // Logs when a member is unmuted
  bot.on("memberUnmute", (guild, giver, receiver) => trysend(guild, "memberUnmute", {
    color: bot.embed.color("success"),
    author: {
      name: `${format.tag(giver, true)} unmuted ${format.tag(receiver, true)}.`,
      icon_url: receiver.avatarURL,
    },
  }));

  // Logs when a member is muted due to automod
  bot.on("automodMute", (guild, member, msgs) => trysend(guild, "automodMute", {
    color: bot.embed.color("error"),
    description: `Cause of mute:\n${msgs.map(m => `**${member.username}:** ${m.content.substring(0, 128)}`).join("\n")}`,
    author: {
      name: `${format.tag(member, true)} was automatically muted.`,
      icon_url: member.avatarURL,
    },
  }));

  // Logs automod invites
  bot.on("automodantiInvite", (guild, member, content, warning) => trysend(guild, "automodantiInvite", {
    color: bot.embed.color("error"),
    author: {
      name: `${format.tag(member, true)} tried to send an invite.`,
      icon_url: member.avatarURL,
    },
    fields: [{
      name: "Content",
      value: (content.length > 100 ? `${content.substring(0, 100)}..` : content) || "No content",
      inline: false,
    }, {
      name: "Warning ID",
      value: warning ? warning : "No warning",
      inline: false,
    }],
  }));
};