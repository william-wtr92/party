import { zValidator } from "@hono/zod-validator"
import {
  eventIdSchema,
  insertReviewSchema,
  limitOffsetSchema,
  type LimitOffsetSchemaType,
  type InsertReviewType,
} from "@party/common"
import { eventNotFound, existingEventById } from "@server/features/events"
import { participantIsInEvent } from "@server/features/participants"
import {
  addReview,
  countReviewsInEvent,
  notAuthorizeToSeeReview,
  reviewAddedSuccessfully,
  reviewerIsNotInEvent,
  selectReviewsByEventId,
} from "@server/features/reviews"
import { auth } from "@server/middlewares/auth"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { SC } from "@server/utils/status"
import { Hono } from "hono"

const app = new Hono()

export const reviewsRoutes = app
  .post(
    "/:eventId",
    auth,
    zValidator("param", eventIdSchema),
    zValidator("json", insertReviewSchema),
    async (c) => {
      const { eventId } = c.req.param()
      const {
        user: { id },
      } = c.get(contextKeys.session)
      const data: InsertReviewType = await c.req.json()

      const checkIfEventExist = await existingEventById(eventId).execute()

      if (!checkIfEventExist) {
        return c.json(eventNotFound, SC.errors.BAD_REQUEST)
      }

      const checkIfReviewerIsInEvent = await participantIsInEvent(id, eventId)

      if (!checkIfReviewerIsInEvent) {
        return c.json(reviewerIsNotInEvent, SC.errors.UNAUTHORIZED)
      }

      await addReview(eventId, id, data)

      return c.json(reviewAddedSuccessfully, SC.success.CREATED)
    }
  )
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

      const checkIfEventExist = await existingEventById(eventId).execute()

      if (!checkIfEventExist) {
        return c.json(eventNotFound, SC.errors.BAD_REQUEST)
      }

      const checkIfViewerIsInEvent = await participantIsInEvent(id, eventId)

      if (!checkIfViewerIsInEvent) {
        return c.json(notAuthorizeToSeeReview, SC.errors.UNAUTHORIZED)
      }

      const totalElements = await countReviewsInEvent(eventId)
      const reviews = await selectReviewsByEventId(eventId, q.limit, q.offset)
      const totalPages = Math.ceil(totalElements / (q.limit ?? 10))

      return c.json(
        { result: reviews, totalElements, totalPages },
        SC.success.OK
      )
    }
  )
