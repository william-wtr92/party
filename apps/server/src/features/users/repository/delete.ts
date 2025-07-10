import { db } from "@server/db/client"
import {
  addresses,
  addressLinks,
  eventSummary,
  reviewsSummary,
  users,
} from "@server/db/schema"
import { count, eq } from "drizzle-orm"

export const deleteUser = async (id: string) => {
  await db.transaction(async (tx) => {
    const addressLink = await tx
      .delete(addressLinks)
      .where(eq(addressLinks.userId, id))
      .returning({ addressId: addressLinks.addressId })

    await tx.delete(users).where(eq(users.id, id))

    if (addressLink[0]?.addressId) {
      const addressLinksCount = await tx
        .select({ count: count() })
        .from(addressLinks)
        .where(eq(addressLinks.addressId, addressLink[0].addressId))

      if (addressLinksCount[0].count === 0) {
        await tx
          .delete(addresses)
          .where(eq(addresses.id, addressLink[0].addressId))
      }
    }

    await tx.refreshMaterializedView(eventSummary).concurrently()
    await tx.refreshMaterializedView(reviewsSummary).concurrently()
  })
}
