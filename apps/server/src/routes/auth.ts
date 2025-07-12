import { zValidator } from "@hono/zod-validator"
import {
  type LoginSchemaType,
  type RegisterSchemaType,
  loginSchema,
  registerSchema,
} from "@party/common"
import {
  register,
  userAlreadyExists,
  phoneOrNameAlreadyExists,
  passwordNotMatch,
  registerSuccess,
  loginSuccess,
  logoutSuccess,
} from "@server/features/auth"
import {
  existPhoneOrName,
  incorrectPassword,
  existByEmail,
  userNotFound,
} from "@server/features/users"
import { auth } from "@server/middlewares/auth"
import { redis } from "@server/utils/clients/redis"
import { delCookie, setCookie } from "@server/utils/helpers/cookie"
import { signJwt } from "@server/utils/helpers/jwt"
import { comparePassword, hashPassword } from "@server/utils/helpers/password"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { SC } from "@server/utils/status"
import { Hono } from "hono"

const app = new Hono()

export const authRoutes = app
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const body: RegisterSchemaType = await c.req.json()
    const { password, confirmPassword, ...filteredBody } = body

    const user = await existByEmail(filteredBody.email)

    if (user) {
      return c.json(userAlreadyExists, SC.errors.BAD_REQUEST)
    }

    if (await existPhoneOrName(filteredBody.phone, filteredBody.name)) {
      return c.json(phoneOrNameAlreadyExists, SC.errors.BAD_REQUEST)
    }

    if (password !== confirmPassword) {
      return c.json(passwordNotMatch, SC.errors.BAD_REQUEST)
    }

    const [passwordHash, passwordSalt] = await hashPassword(password)

    await register(filteredBody, [passwordHash, passwordSalt])

    return c.json(registerSuccess, SC.success.CREATED)
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password }: LoginSchemaType = await c.req.json()

    const user = await existByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const isPasswordMatch = await comparePassword(
      password,
      user.passwordHash,
      user.passwordSalt
    )

    if (!isPasswordMatch) {
      return c.json(incorrectPassword, SC.errors.BAD_REQUEST)
    }

    const jwt = await signJwt({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    await setCookie(c, cookiesKeys.auth.session, jwt)

    return c.json(loginSuccess, SC.success.OK)
  })
  .post("/logout", auth, async (c) => {
    const {
      user: { email },
    } = c.get(contextKeys.session)
    const user = await existByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    delCookie(c, cookiesKeys.auth.session)

    const sessionKey = redisKeys.session(user.email)
    await redis.del(sessionKey)

    return c.json(logoutSuccess, SC.success.OK)
  })
