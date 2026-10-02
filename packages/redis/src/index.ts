import Redis from 'ioredis';

export type RedisClient = Redis;

/** Creates a Redis client without connecting until it is used by the application. */
export function createRedis(url: string): RedisClient {
  return new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 3 });
}

export async function closeRedis(client: RedisClient): Promise<void> {
  await client.quit();
}
