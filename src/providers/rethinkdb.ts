/**
 * @file RethinkDB Provider
 * @description Main database provider for RethinkDB
 */

import { r } from "rethinkdb-ts";
import { DatabaseProvider } from "../classes/Database";
import { HibikiClient } from "../classes/Client";
import config from "../../config.json";

const rethinkOptions = {
  db: config.database.db,
  // password: config.database.password,
  // port: config.database.port,
  // host: config.database.host,
  // user: config.database.user,
  silent: true,
};

async function startRethink() {
  await r.connectPool(rethinkOptions);
}

startRethink();

export class RethinkProvider extends DatabaseProvider {
  db: typeof r;
  dblock: any;

  /**
   * Creates a new database provider
   * @param {HibikiClient} bot Main bot object
   */

  constructor(bot: HibikiClient) {
    super(bot);
    this.db = r;
    this.dblock = this.db.db(rethinkOptions.db).wait();
  }

  async getGuildConfig(guild: string): Promise<unknown> {
    await this.dblock;
    return this.db.table("guildconfig").get(guild).run();
  }

  async getUserConfig(user: string): Promise<unknown> {
    await this.dblock;
    return this.db.table("userconfig").get(user).run();
  }
}
