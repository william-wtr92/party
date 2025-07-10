import appConfig from "@server/config"
import Redis from "ioredis"

export const redis = new Redis({
  port: parseInt(appConfig.redis.port),
  host: appConfig.redis.host,
  username: appConfig.redis.username,
  password: appConfig.redis.password,
  db: parseInt(appConfig.redis.db),
})
