import appConfig from "@server/config"
import * as schema from "@server/db/schema"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const {
  db: { host, user, password, port, name },
} = appConfig

const client = postgres(
  `postgresql://${user}:${password}@${host}:${port}/${name}`
)

export const db = drizzle({
  client,
  schema,
  logger: true,
})
