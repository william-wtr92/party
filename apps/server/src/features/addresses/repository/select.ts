import type { InsertAddress } from "@party/common"
import { db } from "@server/db/client"
import { addresses, addressLinks } from "@server/db/schema"
import { eq } from "drizzle-orm"

export const existingAddress = (address: InsertAddress) => {
  return db.query.addresses
    .findFirst({
      where: (addresses, { eq, and }) =>
        and(
          address.city ? eq(addresses.city, address.city) : undefined,
          address.street ? eq(addresses.street, address.street) : undefined,
          address.postalCode
            ? eq(addresses.postalCode, address.postalCode)
            : undefined,
          address.country ? eq(addresses.country, address.country) : undefined,
          address.streetNumber
            ? eq(addresses.streetNumber, address.streetNumber)
            : undefined
        ),
    })
    .prepare("prepareExistingAddress")
}

export const retrieveEventAddressLinksByEventId = (eventId: string) => {
  return db
    .select()
    .from(addressLinks)
    .leftJoin(addresses, eq(addressLinks.addressId, addresses.id))
    .where(eq(addressLinks.eventId, eventId))
    .limit(1)
    .prepare("prepareRetrieveEventAddress")
}
