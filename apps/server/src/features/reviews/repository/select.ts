import { db } from "@server/db/client"
import { reviewsSummary } from "@server/db/schema"
import { eq, count } from "drizzle-orm"

export const selectReviewsByEventId = async (
  eventId: string,
  limit: number | undefined,
  offset: number | undefined
) => {
  return await db
    .select()
    .from(reviewsSummary)
    .where(eq(reviewsSummary.eventId, eventId))
    .limit(limit ?? 10)
    .offset(offset ?? 0)
    .execute()
}

export const countReviewsInEvent = async (eventId: string) => {
  const counted = await db
    .select({
      count: count(),
    })
    .from(reviewsSummary)
    .where(eq(reviewsSummary.eventId, eventId))
    .execute()

  return counted[0].count
}
