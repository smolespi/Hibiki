/**
 * @file MemberUpdate Logger
 * @description Logs when a member joins or leaves a guild
 */

import type { Guild, Member, TextChannel } from "eris";
import { convertHex } from "../helpers/embed";
import { Logger } from "../classes/Logger";
import { defaultAvatar } from "../helpers/constants";
import { dateFormat } from "../utils/format";
const TYPE = "memberLogging";

export class MemberUpdate extends Logger {
  events = ["guildMemberAdd", "guildMemberRemove", "loggingMemberAdd", "loggingMemberRemove"];

  async run(event: string, guild: Guild, member: Member) {
    /** Logs to leaveJoin when a member joins */
    if (event === "guildMemberAdd") {
      if (!member) return;

      // Emits the loggingMember event
      this.bot.emit("loggingMemberAdd", guild, member);

      // Gets the leavejoin channel
      const guildconfig = await this.bot.db.getGuildConfig(guild.id);
      const muted = (await this.bot.db.getMuteCache()) as any;
      // Re-adds any muted roles if the member tried to evade mute
      const mute = muted.find((m: MuteCache) => m.member === member.id && m.guild === guild.id);
      if (mute && guildconfig.mutedRole) await member.addRole(guildconfig.mutedRole, "Rejoined after being muted");
      if (!guildconfig?.leaveJoin) return;
      const leavejoinchannel = guild.channels.find((c) => c.id === guildconfig?.leaveJoin) as TextChannel;
      if (!leavejoinchannel) return;

      // Sets the joinMessage
      let joinMessage = `Welcome to **${guild.name}, **${member.user.username}.`;
      if (guildconfig.joinMessage && guildconfig.joinMessage.length < 2000) {
        joinMessage = guildconfig.joinMessage;
        joinMessage = joinMessage.replace("{member}", `${member.user.username}`);
        joinMessage = joinMessage.replace("{membercount}", `${guild.memberCount}`);
        joinMessage = joinMessage.replace("{servername}", `${guild.name}`);
      }

      // Sends when a member joined
      this.bot.createMessage(leavejoinchannel.id, {
        embed: {
          // TODO: Allow title to be customised.
          title: "🎉 New Member",
          description: joinMessage,
          color: convertHex("success"),
          footer: {
            text: `${guild.name} now has ${guild.memberCount} members.`,
            icon_url: this.bot.user.dynamicAvatarURL(),
          },
        },
      });
    }

    /** Logs to leaveJoin when a member leaves */
    if (event === "guildMemberRemove") {
      if (!member) return;

      // Emits the loggingMember event
      this.bot.emit("loggingMemberRemove", guild, member);

      // Gets the leavejoin channel
      const guildconfig = await this.bot.db.getGuildConfig(guild.id);
      if (!guildconfig?.leaveJoin) return;
      const leavejoinchannel = guild.channels.find((c) => c.id === guildconfig?.leaveJoin) as TextChannel;
      if (!leavejoinchannel) return;

      // Sets the joinMessage
      let leaveMessage = `We'll miss you, ${member.user.username}.`;
      if (guildconfig.leaveMessage && guildconfig.leaveMessage.length < 2000) {
        leaveMessage = guildconfig.leaveMessage;
        leaveMessage = leaveMessage.replace("{member}", `**${member.user.username}**`);
        leaveMessage = leaveMessage.replace("{membercount}", `**${guild.memberCount}**`);
        leaveMessage = leaveMessage.replace("{servername}", `**${guild.name}**`);
      }

      // Sends when a member leaves
      this.bot.createMessage(leavejoinchannel.id, {
        embed: {
          title: "👋 Member Left",
          description: leaveMessage,
          color: convertHex("error"),
          footer: {
            text: `${guild.name} now has ${guild.memberCount} members.`,
            icon_url: this.bot.user.dynamicAvatarURL(),
          },
        },
      });
    }

    /** Logs to the memberLoggingChannel when a member joins */
    if (event === "loggingMemberAdd") {
      const channel = await this.getChannel(guild, TYPE, event);
      if (!channel) return;

      this.bot.createMessage(channel, {
        embed: {
          color: convertHex("success"),
          author: {
            name: `${this.tagUser(member.user)} joined`,
            icon_url: member.avatarURL,
          },
          thumbnail: {
            url: member.user ? member.user.dynamicAvatarURL(null, 1024) : defaultAvatar,
          },
          fields: [
            {
              name: "ID",
              value: member.id,
            },
            {
              name: "Created",
              value: dateFormat(member.user.createdAt),
            },
            {
              name: "Joined At",
              value: dateFormat(member.joinedAt),
            },
            {
              name: "Account Age",
              value: `**${Math.floor((Date.now() - member.user.createdAt) / 86400000)}** days old`,
            },
          ],
          footer: {
            icon_url: guild.iconURL || defaultAvatar,
            text: `${guild.name} now has ${guild.memberCount} members.`,
          },
        },
      });
    }

    /** Logs to the memberLoggingChannel when a member leaves */
    if (event === "loggingMemberRemove") {
      const channel = await this.getChannel(guild, TYPE, event);
      if (!channel) return;

      this.bot.createMessage(channel, {
        embed: {
          color: convertHex("error"),
          author: {
            name: `${this.tagUser(member.user)} left`,
            icon_url: member.avatarURL,
          },
          thumbnail: {
            url: member.user ? member.user.dynamicAvatarURL(null, 1024) : defaultAvatar,
          },
          fields: [
            {
              name: "ID",
              value: member.id,
            },
            {
              name: "Created",
              value: dateFormat(member.user.createdAt),
            },
            {
              name: "Joined At",
              value: dateFormat(member.joinedAt),
            },
            {
              name: "Account Age",
              value: `**${Math.floor((Date.now() - member.user.createdAt) / 86400000)}** days old`,
            },
          ],
          footer: {
            icon_url: guild.iconURL || defaultAvatar,
            text: `${guild.name} now has ${guild.memberCount} members.`,
          },
        },
      });
    }
  }
}