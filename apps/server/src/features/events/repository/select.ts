import type {
  InsertEventSchemaType,
  SearchEventsSchemaType,
} from "@party/common"
import { db } from "@server/db/client"
import { events, eventSummary } from "@server/db/schema"
import { and, asc, eq, gte, lte, count } from "drizzle-orm"

export const existingDataEvent = (data: InsertEventSchemaType) => {
  return db.query.events
    .findFirst({
      where: (events, { eq, and }) =>
        and(
          data.name ? eq(events.name, data.name) : undefined,
          data.startDate
            ? eq(events.startDate, new Date(data.startDate))
            : undefined,
          data.endDate ? eq(events.endDate, new Date(data.endDate)) : undefined
        ),
    })
    .prepare("prepareExistingEvent")
}

export const existingEventById = (eventId: string) => {
  return db.query.events
    .findFirst({
      where: (events, { eq }) => eq(events.id, eventId),
    })
    .prepare("prepareExistingEventById")
}

export const userIsOwner = (eventId: string, userId: string) => {
  return db.query.events
    .findFirst({
      where: (events, { eq, and }) =>
        and(eq(events.id, eventId), eq(events.userId, userId)),
    })
    .prepare("prepareUserIsOwner")
}

export const searchEvents = async (data: SearchEventsSchemaType) => {
  const conditions = buildSearchConditions(data)

  return await db
    .select()
    .from(eventSummary)
    .where(conditions)
    .orderBy(asc(eventSummary.eventStartDate))
    .limit(data.limit ?? 10)
    .offset(data.offset ?? 0)
    .execute()
}

export const countTotalEvents = async (data: SearchEventsSchemaType) => {
  const conditions = buildSearchConditions(data)

  const counted = await db
    .select({ count: count() })
    .from(eventSummary)
    .where(conditions)
    .execute()

  return counted[0].count
}

export const getEventByIdWithOwnerAndDetails = async (eventId: string) => {
  return await db
    .select()
    .from(eventSummary)
    .where(eq(eventSummary.eventId, eventId))
    .execute()
}

const buildSearchConditions = (data: SearchEventsSchemaType) => {
  const freeAsString = data.free?.valueOf().toString()
  const freeAsBool = freeAsString === "true" ? true : false

  console.log(eventSummary.eventPrice)
  console.log(data.price)

  return and(
    data.name ? eq(eventSummary.eventName, data.name) : undefined,
    data.type ? eq(eventSummary.eventType, data.type) : undefined,
    data.city ? eq(eventSummary.eventCity, data.city) : undefined,
    data.startDate
      ? gte(eventSummary.eventStartDate, new Date(data.startDate))
      : undefined,
    freeAsBool === true
      ? eq(eventSummary.isFree, Boolean(data.free))
      : undefined,
    data.price ? lte(eventSummary.eventPrice, data.price) : undefined,
    data.slots ? gte(eventSummary.totalSlots, Number(data.slots)) : undefined,
    data.remainingSlots
      ? gte(eventSummary.availableSlots, Number(data.remainingSlots))
      : undefined
  )
}
