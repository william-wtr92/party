import appConfig from "@server/config"
import { now } from "@server/utils/helpers/times"
import { sign, verify } from "hono/jwt"

const { secret, expiresIn, algorithm } = appConfig.security.jwt

export const signJwt = async <T extends object>(
  payload: T,
  expiration?: number
) => {
  return await sign(
    {
      payload,
      exp: expiration ? expiration : expiresIn,
      nbf: now,
      iat: now,
    },
    secret,
    algorithm
  )
}

export const decodeJwt = async (jwt: string) => {
  return await verify(jwt, secret, algorithm)
}

export const restructureJwt = async (jwt: string) => {
  const [header, payload, signature] = jwt.split(".")

  return `${header}.${payload}.${signature}`
}
