import { serve } from "@hono/node-server"
import appConfig from "@server/config"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { etag } from "hono/etag"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { secureHeaders } from "hono/secure-headers"

import { routeNotFound, unspecifiedErrorOccurred } from "./features/global"
import { routes } from "./routes"
import { registerMetrics } from "./utils/clients/prometheus"
import { router } from "./utils/router"
import { SC } from "./utils/status"

const app = new Hono()

app.use(
  "*",
  cors({
    origin: appConfig.security.cors.origin,
    allowMethods: appConfig.security.cors.methods,
    allowHeaders: appConfig.security.cors.headers,
    credentials: appConfig.security.cors.credentials,
  }),
  secureHeaders(),
  etag(),
  logger(),
  prettyJSON(),
  registerMetrics
)

/** Route Not Found Handler **/
app.notFound((c) => {
  return c.json(routeNotFound, SC.errors.NOT_FOUND)
})

/** Global Error Handler (Sentry) **/
app.onError((err, c) => {
  return c.json(unspecifiedErrorOccurred, SC.serverErrors.INTERNAL_SERVER_ERROR)
})

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const appRouter = app
  .route(router.auth, routes.auth)
  .route(router.users, routes.users)
  .route(router.places, routes.places)
  .route(router.events, routes.events)
  .route(router.participants, routes.participants)
  .route(router.reviews, routes.reviews)
  .route(router.globals, routes.globals)

serve({
  fetch: app.fetch,
  port: appConfig.port,
})

//eslint-disable-next-line no-console
console.info(`🚀 Server running on port ${appConfig.port}`)

export default app
export type AppType = typeof appRouter
