import { db } from "@server/db/client"
import {
  addresses,
  addressLinks,
  events,
  eventSummary,
} from "@server/db/schema"
import { count, eq } from "drizzle-orm"

export const deleteEvent = async (eventId: string) => {
  await db.transaction(async (tx) => {
    const addressLinksData = await tx
      .delete(addressLinks)
      .where(eq(addressLinks.eventId, eventId))
      .returning({ addressId: addressLinks.addressId })

    const addressLinksCount = await tx
      .select({ count: count() })
      .from(addressLinks)
      .where(eq(addressLinks.addressId, addressLinksData[0].addressId))

    if (addressLinksCount[0].count === 0) {
      await db
        .delete(addresses)
        .where(eq(addresses.id, addressLinksData[0].addressId))
    }

    await tx.delete(events).where(eq(events.id, eventId))
    await tx.refreshMaterializedView(eventSummary).concurrently()
  })
}
