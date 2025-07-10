import appConfig from "@client/config"
import type { AppType } from "@server/index"
import { hc } from "hono/client"

export const client = hc<AppType>(appConfig.apiUrl, {
  init: {
    credentials: "include",
  },
})
