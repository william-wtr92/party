import { db } from "@server/db/client"
import { addressLinks } from "@server/db/schema"
import { and, eq } from "drizzle-orm"

export const deleteAddressLink = (oldAddressId: string, eventId: string) => {
  return db
    .delete(addressLinks)
    .where(
      and(
        eq(addressLinks.addressId, oldAddressId),
        eq(addressLinks.eventId, eventId)
      )
    )
    .prepare("prepareDeleteAddressLink")
}
