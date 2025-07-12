import { zValidator } from "@hono/zod-validator"
import { updateUserSchema, type UpdateUserSchemaType } from "@party/common"
import {
  existByEmail,
  existUserById,
  updateUser,
  userDeletedSuccessfully,
  userNotFound,
  userUpdatedSuccessfully,
  deleteUser,
} from "@server/features/users"
import { auth } from "@server/middlewares/auth"
import { redis } from "@server/utils/clients/redis"
import { delCookie, setCookie } from "@server/utils/helpers/cookie"
import { signJwt } from "@server/utils/helpers/jwt"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { cookiesKeys } from "@server/utils/keys/cookiesKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { sanitizeUser } from "@server/utils/sanitizers/usersSanitizers"
import { SC } from "@server/utils/status"
import { Hono } from "hono"

const app = new Hono()

export const usersRoutes = app
  .get("/me", auth, async (c) => {
    const {
      user: { email },
    } = c.get(contextKeys.session)

    const user = await existByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    return c.json({ result: sanitizeUser(user) }, SC.success.OK)
  })
  .put("/", auth, zValidator("json", updateUserSchema), async (c) => {
    const {
      user: { email, id },
    } = c.get(contextKeys.session)
    const data: UpdateUserSchemaType = await c.req.json()

    const user = await existByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    await updateUser(id, {
      name: user.name === data.name ? user.name : data.name,
      email: user.email === data.email ? user.email : data.email,
      phone: user.phone === data.phone ? user.phone : data.phone,
      interests:
        user.interests === data.interests ? user.interests : data.interests,
      birthdate:
        user.birthdate === data.birthdate ? user.birthdate : data.birthdate,
    })

    const redisKey = redisKeys.session(email)
    const userCached = await redis.get(redisKey)

    if (userCached) {
      await redis.del(redisKey)
    }

    const updatedUser = await existUserById(id)

    if (!updatedUser) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const jwt = await signJwt({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    })

    delCookie(c, cookiesKeys.auth.session)
    await setCookie(c, cookiesKeys.auth.session, jwt)

    return c.json(userUpdatedSuccessfully, SC.success.OK)
  })
  .delete("/", auth, async (c) => {
    const {
      user: { email, id },
    } = c.get(contextKeys.session)

    const user = await existByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const redisKey = redisKeys.session(email)
    const userCached = await redis.get(redisKey)

    if (userCached) {
      await redis.del(redisKey)
    }

    await deleteUser(id)

    return c.json(userDeletedSuccessfully, SC.success.OK)
  })
