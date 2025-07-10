import type { InsertEventSchemaType } from "@party/common"
import { db } from "@server/db/client"
import {
  addresses,
  addressLinks,
  eventDetails,
  events,
  eventSummary,
} from "@server/db/schema"
import { type InsertAddress, existingAddress } from "@server/features/addresses"

export const insertEvent = async (
  userId: string,
  data: InsertEventSchemaType
) => {
  await db.transaction(async (tx) => {
    const insertedEvent = await tx
      .insert(events)
      .values({
        userId,
        name: data.name,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        slots: data.slots,
        remainingSlots: data.slots,
        free: data.free,
        price: data.price.toString(),
      })
      .returning({ insertedId: events.id })

    const eventId = insertedEvent[0]?.insertedId

    if (!eventId) {
      tx.rollback()

      return
    }

    await tx.insert(eventDetails).values({
      eventId,
      typeSpecificData: data.typeSpecificData,
      participants: 0,
    })

    const address: InsertAddress = {
      city: data.city,
      region: data.region,
      streetNumber: data.streetNumber,
      street: data.street,
      country: data.country,
      postalCode: data.postalCode,
      extra: data.extra,
    }

    const checkIfAddressExist = await existingAddress(address).execute()

    if (checkIfAddressExist) {
      await tx.insert(addressLinks).values({
        addressId: checkIfAddressExist.id,
        eventId,
      })
    } else {
      const insertedAddress = await tx
        .insert(addresses)
        .values(address)
        .returning({ insertedId: addresses.id })

      const addressId = insertedAddress[0]?.insertedId

      if (!addressId) {
        tx.rollback()

        return
      }

      await tx.insert(addressLinks).values({
        addressId,
        eventId,
      })
    }

    await tx.refreshMaterializedView(eventSummary).concurrently()
  })
}
