import Redis from "ioredis"

export const redisClient = new Redis(`redis://default:${process.env.UPSTASH_REDIS_REST_TOKEN}@${process.env.UPSTASH_REDIS_REST_URL}.upstash.io:34287`);
