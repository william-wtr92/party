import { prometheus } from "@hono/prometheus"

export const { printMetrics, registerMetrics } = prometheus()
