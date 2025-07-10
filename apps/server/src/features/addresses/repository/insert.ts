import type { InsertAddress } from "@party/common"
import { db } from "@server/db/client"
import { addresses, addressLinks } from "@server/db/schema"

export const insertAddressAndLink = async (
  newAddress: InsertAddress,
  eventId: string
) => {
  return await db.transaction(async (tx) => {
    const insertedAddress = await tx
      .insert(addresses)
      .values(newAddress)
      .returning({ insertedId: addresses.id })

    const addressId = insertedAddress[0]?.insertedId || null

    if (addressId) {
      await tx.insert(addressLinks).values({
        addressId,
        eventId,
      })
    }

    return addressId
  })
}
