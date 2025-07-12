import { zValidator } from "@hono/zod-validator"
import {
  acceptParticipantSchema,
  approvedParticipantSchema,
  eventIdSchema,
  limitOffsetSchema,
  type LimitOffsetSchemaType,
  type AcceptParticipantSchemaType,
} from "@party/common"
import {
  approveParticipation,
  participationNotFound,
  userIsNotOwnerOfEvent,
  userIsOwner,
} from "@server/features/events"
import {
  insertParticipant,
  cantParticipateInUrOwnEvent,
  paritipantAlreadyRegistered,
  participationAlreadyRegistered,
  participationRegistered,
  getParticipantsAtEvent,
  countParticipantsAtEvent,
  acceptParticipant,
  participationExists,
  userNeedToWaitCooldownBeforeParticipating,
} from "@server/features/participants"
import { auth } from "@server/middlewares/auth"
import { redis } from "@server/utils/clients/redis"
import { tenMinutesTTL } from "@server/utils/helpers/times"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { redisKeys } from "@server/utils/keys/redisKeys"
import { SC } from "@server/utils/status"
import { Hono } from "hono"

const app = new Hono()

export const participantsRoutes = app
  .post("/:eventId", auth, zValidator("param", eventIdSchema), async (c) => {
    const {
      user: { email, id },
    } = c.get(contextKeys.session)
    const { eventId } = c.req.param()

    const checkIfPartipantIsOwner = await userIsOwner(eventId, id).execute()

    if (checkIfPartipantIsOwner) {
      return c.json(cantParticipateInUrOwnEvent, SC.errors.UNAUTHORIZED)
    }

    const checkIfParticipantIsAlreadyRegistered =
      await paritipantAlreadyRegistered(id, eventId)

    if (checkIfParticipantIsAlreadyRegistered) {
      return c.json(participationAlreadyRegistered, SC.errors.BAD_REQUEST)
    }

    const redisKey = redisKeys.participation(eventId, id)
    const redisValue = await redis.get(redisKey)

    if (redisValue) {
      return c.json(
        userNeedToWaitCooldownBeforeParticipating,
        SC.errors.BAD_REQUEST
      )
    }

    await insertParticipant(id, eventId)

    await redis.set(redisKey, email, "EX", tenMinutesTTL)

    return c.json(participationRegistered, SC.success.OK)
  })
  .get(
    "/:eventId",
    auth,
    zValidator("param", eventIdSchema),
    zValidator("query", limitOffsetSchema),
    async (c) => {
      const {
        user: { id },
      } = c.get(contextKeys.session)
      const { eventId } = c.req.param()
      const q: LimitOffsetSchemaType = c.req.queries()

      const checkIfPartipantIsOwner = await userIsOwner(eventId, id).execute()

      if (!checkIfPartipantIsOwner) {
        return c.json(userIsNotOwnerOfEvent, SC.errors.UNAUTHORIZED)
      }

      const totalElements = await countParticipantsAtEvent(eventId)
      const participants = await getParticipantsAtEvent(
        eventId,
        q.limit,
        q.offset
      )
      const totalPages = Math.ceil(totalElements / (q.limit ?? 10))

      return c.json(
        { result: participants, totalElements, totalPages },
        SC.success.OK
      )
    }
  )
  .post(
    "/:eventId/:participationId/accept",
    auth,
    zValidator("param", approvedParticipantSchema),
    zValidator("json", acceptParticipantSchema),
    async (c) => {
      const {
        user: { id },
      } = c.get(contextKeys.session)

      const { eventId, participationId } = c.req.param()
      const data: AcceptParticipantSchemaType = await c.req.json()

      const checkIfParticipationExist =
        await participationExists(participationId)

      if (!checkIfParticipationExist) {
        return c.json(participationNotFound, SC.errors.NOT_FOUND)
      }

      const checkIfUserIsOwner = await userIsOwner(eventId, id).execute()

      if (!checkIfUserIsOwner) {
        return c.json(userIsNotOwnerOfEvent, SC.errors.UNAUTHORIZED)
      }

      await acceptParticipant(participationId, data)

      return c.json(approveParticipation(data.accept), SC.success.OK)
    }
  )
