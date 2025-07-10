import type { UpdateUserSchemaType } from "@party/common"
import { db } from "@server/db/client"
import { eventSummary, reviewsSummary, users } from "@server/db/schema"
import { eq } from "drizzle-orm"

export const updateUser = async (id: string, data: UpdateUserSchemaType) => {
  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthdate: new Date(data.birthdate!),
        interests: data.interests,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))

    await tx.refreshMaterializedView(eventSummary).concurrently()
    await tx.refreshMaterializedView(reviewsSummary).concurrently()
  })
}
