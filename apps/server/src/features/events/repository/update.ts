import type { InsertEventSchemaType, InsertAddress } from "@party/common"
import { db } from "@server/db/client"
import {
  addresses,
  addressLinks,
  eventDetails,
  events,
  eventSummary,
} from "@server/db/schema"
import {
  deleteAddressLink,
  existingAddress,
  insertAddressAndLink,
  isAddressChanged,
  retrieveEventAddressLinksByEventId,
} from "@server/features/addresses"
import { and, count, eq } from "drizzle-orm"

export const updateEvent = async (
  eventId: string,
  userId: string,
  data: InsertEventSchemaType
) => {
  await db.transaction(async (tx) => {
    await tx
      .update(events)
      .set({
        userId,
        name: data.name,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        slots: data.slots,
        remainingSlots: data.slots,
        free: data.free,
        price: data.price?.toString(),
      })
      .where(and(eq(events.id, eventId), eq(events.userId, userId)))

    await tx
      .update(eventDetails)
      .set({
        typeSpecificData: data.typeSpecificData,
        participants: data.participants || 0,
      })
      .where(eq(eventDetails.eventId, eventId))

    const oldAddressLink =
      await retrieveEventAddressLinksByEventId(eventId).execute()
    const oldAddress = oldAddressLink[0]?.addresses

    const newAddress: InsertAddress = {
      city: data.city,
      region: data.region,
      streetNumber: data.streetNumber,
      street: data.street,
      country: data.country,
      postalCode: data.postalCode,
      extra: data.extra,
    }

    if (
      oldAddress &&
      isAddressChanged(
        {
          ...oldAddress,
          extra: oldAddress.extra ?? "",
        },
        newAddress
      )
    ) {
      await deleteAddressLink(oldAddress.id, eventId).execute()

      const checkIfAddressExist = await existingAddress(newAddress).execute()

      if (checkIfAddressExist) {
        await tx.insert(addressLinks).values({
          addressId: checkIfAddressExist.id,
          eventId,
        })
      } else {
        const addressId = await insertAddressAndLink(newAddress, eventId)

        if (!addressId) {
          tx.rollback()

          return
        }
      }

      const addressLinksCount = await tx
        .select({ count: count() })
        .from(addressLinks)
        .where(eq(addressLinks.addressId, oldAddress.id))

      if (addressLinksCount[0].count === 0) {
        await tx.delete(addresses).where(eq(addresses.id, oldAddress.id))
      }

      await tx.refreshMaterializedView(eventSummary).concurrently()
    }
  })
}
