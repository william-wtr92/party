import { oneDay } from "@server/utils/helpers/times"
import { config } from "dotenv"
import { z } from "zod"

config()

const appConfigSchema = z
  .object({
    port: z.number(),
    db: z.object({
      host: z.string(),
      user: z.string(),
      password: z.string(),
      port: z.number(),
      name: z.string(),
      migrations: z.object({
        schema: z.string(),
        out: z.string(),
        dialect: z.literal("postgresql"),
      }),
    }),
    security: z.object({
      jwt: z.object({
        secret: z.string(),
        expiresIn: z.number(),
        algorithm: z.literal("HS512"),
      }),
      cors: z.object({
        origin: z.string(),
        methods: z.array(z.string()),
        headers: z.array(z.string()),
        credentials: z.boolean(),
      }),
      password: z.object({
        saltlen: z.number(),
        keylen: z.number(),
        iterations: z.number(),
        digest: z.string(),
        pepper: z.string(),
      }),
      cookie: z.object({
        secret: z.string(),
        maxAge: z.number(),
      }),
    }),
    redis: z.object({
      port: z.string(),
      username: z.string(),
      password: z.string(),
      db: z.string(),
    }),
  })
  .strict()

const appConfig = appConfigSchema.parse({
  port: parseInt(process.env.PORT!, 10),
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!, 10),
    name: process.env.DB_NAME,
    migrations: {
      schema: "./src/db/schema/index.ts",
      out: "./migrations",
      dialect: "postgresql",
    },
  },
  security: {
    jwt: {
      secret: process.env.SECURITY_JWT_SECRET,
      expiresIn: oneDay,
      algorithm: "HS512",
    },
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE"],
      headers: ["Content-Type", "Authorization"],
      credentials: true,
    },
    password: {
      saltlen: 512,
      keylen: 512,
      iterations: 10000,
      digest: "sha512",
      pepper: process.env.SECURITY_PASSWORD_PEPPER,
    },
    cookie: {
      secret: process.env.SECURITY_COOKIE_SECRET,
      maxAge: 86400,
    },
  },
  redis: {
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
})

export default appConfig
