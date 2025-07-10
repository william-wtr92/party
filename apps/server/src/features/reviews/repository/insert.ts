import type { InsertReviewType } from "@party/common"
import { db } from "@server/db/client"
import { reviews, reviewsSummary } from "@server/db/schema"

export const addReview = async (
  eventId: string,
  userId: string,
  data: InsertReviewType
) => {
  await db.transaction(async (tx) => {
    await tx.insert(reviews).values({
      rating: data.rating,
      comment: data.comment,
      eventId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await tx.refreshMaterializedView(reviewsSummary).concurrently()
  })
}
