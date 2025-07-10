import { zValidator } from "@hono/zod-validator"
import {
  type EventSummaryType,
  type SearchEventsSchemaType,
  type InsertEventSchemaType,
  eventIdSchema,
  insertEventSchema,
  searchEventsSchema,
} from "@party/common"
import {
  deleteEvent,
  eventAlreadyExists,
  eventCreatedSuccess,
  eventDeletedSuccess,
  eventNotFound,
  eventUpdatedSuccess,
  existingDataEvent,
  existingEventById,
  insertEvent,
  searchEvents,
  updateEvent,
  userIsNotOwnerOfEvent,
  userIsOwner,
  countTotalEvents,
  getEventByIdWithOwnerAndDetails,
} from "@server/features/events"
import { existByEmail, userNotFound } from "@server/features/users"
import { auth } from "@server/middlewares/auth"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { SC } from "@server/utils/status"
import { Hono } from "hono"

const app = new Hono()

export const eventsRoutes = app
  .get("/search", auth, zValidator("query", searchEventsSchema), async (c) => {
    const data: SearchEventsSchemaType = c.req.queries()

    const totalElements = await countTotalEvents(data)
    const events: EventSummaryType[] = await searchEvents(data)
    const totalPages = Math.ceil(totalElements / (data.limit ? data.limit : 10))

    return c.json({ result: events, totalElements, totalPages }, SC.success.OK)
  })
  .get("/:eventId", auth, zValidator("param", eventIdSchema), async (c) => {
    const { eventId } = c.req.param()

    const event = await getEventByIdWithOwnerAndDetails(eventId)

    if (!event) {
      return c.json(eventNotFound, SC.errors.NOT_FOUND)
    }

    return c.json({ result: event }, SC.success.OK)
  })
  .post("/", auth, zValidator("json", insertEventSchema), async (c) => {
    const {
      user: { email },
    } = c.get(contextKeys.session)
    const data: InsertEventSchemaType = await c.req.json()

    const user = await existByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const checkIfDataEventExist = await existingDataEvent(data).execute()

    if (checkIfDataEventExist) {
      return c.json(eventAlreadyExists, SC.errors.BAD_REQUEST)
    }

    await insertEvent(user.id, data)

    return c.json(eventCreatedSuccess, SC.success.CREATED)
  })
  .put(
    "/:eventId",
    auth,
    zValidator("param", eventIdSchema),
    zValidator("json", insertEventSchema),
    async (c) => {
      const {
        user: { email },
      } = c.get(contextKeys.session)
      const { eventId } = c.req.param()
      const data: InsertEventSchemaType = await c.req.json()

      const user = await existByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const checkIfEventExist = await existingEventById(eventId).execute()

      if (!checkIfEventExist) {
        return c.json(eventNotFound, SC.errors.BAD_REQUEST)
      }

      const checkIfDataEventExist = await existingDataEvent(data).execute()

      if (checkIfDataEventExist) {
        return c.json(eventAlreadyExists, SC.errors.BAD_REQUEST)
      }

      await updateEvent(eventId, user.id, data)

      return c.json(eventUpdatedSuccess, SC.success.OK)
    }
  )
  .delete("/:eventId", auth, zValidator("param", eventIdSchema), async (c) => {
    const {
      user: { email },
    } = c.get(contextKeys.session)
    const { eventId } = c.req.param()

    const user = await existByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const checkIfEventExist = await existingEventById(eventId).execute()

    if (!checkIfEventExist) {
      return c.json(eventNotFound, SC.errors.BAD_REQUEST)
    }

    const checkIfUserIsOwner = await userIsOwner(eventId, user.id).execute()

    if (!checkIfUserIsOwner) {
      return c.json(userIsNotOwnerOfEvent, SC.errors.BAD_REQUEST)
    }

    await deleteEvent(eventId)

    return c.json(eventDeletedSuccess, SC.success.OK)
  })
