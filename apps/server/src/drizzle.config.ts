import { defineConfig } from "drizzle-kit"

import appConfig from "./config"

const {
  user,
  password,
  port,
  name,
  host,
  migrations: { schema, out, dialect },
} = appConfig.db

export default defineConfig({
  schema,
  out,
  dialect,
  dbCredentials: {
    url: `postgresql://${user}:${password}@${host}:${port}/${name}`,
  },
})
