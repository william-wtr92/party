import appConfig from "@server/config"
import { printMetrics } from "@server/utils/clients/prometheus"
import { Hono } from "hono"
import { basicAuth } from "hono/basic-auth"

const app = new Hono()

export const metricsRoute = app.get(
  "/metrics",
  basicAuth({
    username: appConfig.metrics.username,
    password: appConfig.metrics.password,
  }),
  printMetrics
)
