import { sql } from "drizzle-orm"
import { pgMaterializedView } from "drizzle-orm/pg-core"

import { events } from "./events"
import { reviews } from "./reviews"
import { users } from "./users"

export const reviewsSummary = pgMaterializedView("reviews_summary")
  .with({ autovacuumEnabled: true })
  .as((qb) => {
    return qb
      .select({
        reviewId: sql`${reviews.id}`.as("review_id"),
        eventId: sql`${reviews.eventId}`.as("event_id"),
        eventName: sql`${events.name}`.as("event_name"),
        userId: sql`${reviews.userId}`.as("user_id"),
        userName: sql`${users.name}`.as("user_name"),
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .innerJoin(users, sql`${reviews.userId} = ${users.id}`)
      .innerJoin(events, sql`${reviews.eventId} = ${events.id}`)
  })
