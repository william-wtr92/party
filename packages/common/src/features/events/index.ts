import { z } from "zod"

import { addressSchema } from "../addresses"

const eventSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string(),
  type: z.string(),
  price: z.string().default("0"),
  startDate: z.string(),
  endDate: z.string(),
  slots: z.string(),
  remainingSlots: z.number(),
  free: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

const eventDetailSchema = z.object({
  id: z.string().optional(),
  eventId: z.string(),
  typeSpecificData: z.string().optional(),
  participants: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const insertEventSchema = eventSchema
  .merge(eventDetailSchema)
  .merge(addressSchema)
  .omit({
    createdAt: true,
    updatedAt: true,
    id: true,
    userId: true,
    eventId: true,
  })
  .extend({
    slots: z.preprocess(
      (value) => (typeof value === "string" ? parseInt(value, 10) : value),
      z.number()
    ),
    price: z.preprocess(
      (value) => (typeof value === "string" ? parseInt(value, 10) : value),
      z.number()
    ),
    startDate: z.preprocess(
      (value) => (typeof value === "string" ? new Date(value) : value),
      z.date()
    ),
    endDate: z.preprocess(
      (value) => (typeof value === "string" ? new Date(value) : value),
      z.date()
    ),
  })

export type InsertEventSchemaType = z.infer<typeof insertEventSchema>

export const eventIdSchema = z.object({
  eventId: z.string(),
})

export const limitOffsetSchema = z
  .object({
    limit: z.preprocess(
      (value) => (typeof value === "string" ? parseInt(value, 10) : value),
      z.number().int().positive().default(10)
    ),
    offset: z.preprocess(
      (value) => (typeof value === "string" ? parseInt(value, 10) : value),
      z.number().int().nonnegative().default(0)
    ),
  })
  .partial()

export type LimitOffsetSchemaType = z.infer<typeof limitOffsetSchema>

export const searchEventsSchema = eventSchema
  .merge(addressSchema)
  .pick({
    name: true,
    type: true,
    startDate: true,
    slots: true,
    remainingSlots: true,
    free: true,
    price: true,
    city: true,
  })
  .extend({
    free: z.preprocess(
      (value) => (value === "true" ? true : false),
      z.boolean()
    ),
  })
  .merge(limitOffsetSchema)
  .partial()

export type SearchEventsSchemaType = z.infer<typeof searchEventsSchema>

export type EventSummaryType = {
  eventId: unknown
  eventOwnerId: unknown
  eventOwnerEmail: unknown
  eventOwnerName: unknown
  eventName: string
  eventType: string
  eventCity: string
  eventRegion: string
  eventStartDate: Date
  eventEndDate: Date
  eventDetails: string | null
  participants: number | null
  totalSlots: number
  availableSlots: number
  isFree: boolean
  eventPrice: string | null
  createdAt: Date
}
