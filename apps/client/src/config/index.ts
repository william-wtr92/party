import { config } from "dotenv"
import { z } from "zod"

config()

const appConfigSchema = z
  .object({
    apiUrl: z.string(),
  })
  .strict()

const appConfig = appConfigSchema.parse({
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
})

export default appConfig
