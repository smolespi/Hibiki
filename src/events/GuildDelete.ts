import { Guild } from "eris";
import { HibikiClient } from "classes/Client";
import { Event } from "../classes/Event";

class GuildDeleteEvent extends Event {
  events = ["guildDelete"];

  async run(guild: Guild, bot: HibikiClient): Promise<void> {
    bot.log.info(`Removed from guild: ${guild.name} (${guild.id})`);
  }
}

export default new GuildDeleteEvent();