import { tokenNotProvided, type DecodedToken } from "@server/features/auth"
import {
  type SelectUser,
  existByEmail,
  userNotFound,
} from "@server/features/users"
import { redis } from "@server/utils/clients/redis"
import { jwtTokenErrors } from "@server/utils/errors/jwtErrors"
import { getCookie } from "@server/utils/helpers/cookie"
import { decodeJwt } from "@server/utils/helpers/jwt"
import { oneDayTTL } from "@server/utils/helpers/times"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { sanitizeUser } from "@server/utils/sanitizers/usersSanitizers"
import { SC } from "@server/utils/status"
import type { MiddlewareHandler } from "hono"
import { createFactory, type Factory } from "hono/factory"

const factory: Factory = createFactory()

export const auth: MiddlewareHandler = factory.createMiddleware(
  async (c, next) => {
    const authToken = await getCookie(c, cookiesKeys.auth.session)

    if (!authToken) {
      return c.json(tokenNotProvided, SC.errors.UNAUTHORIZED)
    }

    try {
      const decodedToken = (await decodeJwt(authToken)) as DecodedToken

      if (decodedToken) {
        const userEmail = decodedToken.payload.user.email

        const redisKey = redisKeys.session(userEmail)
        const userCached = await redis.get(redisKey)

        const user: SelectUser | undefined = userCached
          ? JSON.parse(userCached)
          : await existByEmail(userEmail)

        if (!user) {
          return c.json(userNotFound, SC.errors.NOT_FOUND)
        }

        if (!userCached) {
          const sanitizedUser = sanitizeUser(user, ["id"])
          await redis.set(
            redisKey,
            JSON.stringify(sanitizedUser),
            "EX",
            oneDayTTL
          )
        }

        c.set(contextKeys.session, { user })

        await next()
      }

      return c.json(tokenNotProvided, SC.errors.UNAUTHORIZED)
    } catch (error) {
      throw jwtTokenErrors(error)
    }
  }
)
