import { db } from "@server/db/client"
import { participants } from "@server/db/schema"

export const insertParticipant = async (userId: string, eventId: string) => {
  await db.insert(participants).values({
    userId,
    eventId,
  })
}
