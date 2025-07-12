import appConfig from "@server/config"
import Redis from "ioredis"

export const redis = new Redis({
  host: appConfig.redis.host,
  port: parseInt(appConfig.redis.port),
  username: appConfig.redis.username,
  password: appConfig.redis.password,
  db: parseInt(appConfig.redis.db),
})
