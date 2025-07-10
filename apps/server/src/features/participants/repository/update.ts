import type { AcceptParticipantSchemaType } from "@party/common"
import { db } from "@server/db/client"
import { participants } from "@server/db/schema"
import { eq } from "drizzle-orm"

export const acceptParticipant = async (
  participationId: string,
  data: AcceptParticipantSchemaType
) => {
  await db.transaction(async (tx) => {
    await tx
      .update(participants)
      .set({ approved: data.accept })
      .where(eq(participants.id, participationId))

    if (!data.accept) {
      await tx.delete(participants).where(eq(participants.id, participationId))
    }
  })
}
