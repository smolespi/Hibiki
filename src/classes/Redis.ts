import Redis from "ioredis";
import type { Profile } from "passport-discord";
import config from "../../config.json";

export class RedisProvider {
  public redis: Redis.Redis;

  private readonly _key = "hibiki";

  constructor() {
    this.redis = new Redis({
      port: config.redis.port,
      host: config.redis.host,
      // I used the a*y type, ew...
      ...(config.redis.hasOwnProperty("user") ? { username: (config.redis as any).user } : {}),
      ...(config.redis.hasOwnProperty("password") ? { password: (config.redis as any).password } : {}),
    });
  }

  async getProfile(discordId: string): Promise<Profile | null> {
    return this.transformRawResult<Profile>(await this.redis.hget(`${this._key}:profiles`, discordId));
  }

  async saveProfile(profile: Profile): Promise<void> {
    await this.redis.hset(`${this._key}:profiles`, profile.id, JSON.stringify(profile))
  }

  transformRawResult<T>(raw?: string): T | null {
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}
