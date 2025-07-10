import { sql } from "drizzle-orm"
import { pgMaterializedView } from "drizzle-orm/pg-core"

import { addresses, addressLinks } from "./addresses"
import { eventDetails, events } from "./events"
import { users } from "./users"

export const eventSummary = pgMaterializedView("event_summary")
  .with({ autovacuumEnabled: true })
  .as((qb) => {
    return qb
      .select({
        eventId: sql`${events.id}`.as("event_id"),
        eventOwnerId: sql`${events.userId}`.as("event_owner_id"),
        eventOwnerEmail: sql`${users.email}`.as("event_owner_email"),
        eventOwnerName: sql`${users.name}`.as("event_owner_name"),
        eventName: events.name,
        eventType: events.type,
        eventCity: addresses.city,
        eventRegion: addresses.region,
        eventStartDate: events.startDate,
        eventEndDate: events.endDate,
        eventDetails: eventDetails.typeSpecificData,
        participants: eventDetails.participants,
        totalSlots: events.slots,
        availableSlots: events.remainingSlots,
        isFree: events.free,
        eventPrice: events.price,
        createdAt: events.createdAt,
      })
      .from(events)
      .innerJoin(users, sql`${events.userId} = ${users.id}`)
      .innerJoin(eventDetails, sql`${events.id} = ${eventDetails.eventId}`)
      .innerJoin(addressLinks, sql`${events.id} = ${addressLinks.eventId}`)
      .innerJoin(addresses, sql`${addressLinks.addressId} = ${addresses.id}`)
      .where(sql`${events.remainingSlots} > 0`)
  })
