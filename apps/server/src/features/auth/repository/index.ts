import type { InsertAddress, RegisterSchemaType } from "@party/common"
import { db } from "@server/db/client"
import { users, addresses, addressLinks } from "@server/db/schema"
import { existingAddress } from "@server/features/addresses"

export const register = async (
  data: Omit<RegisterSchemaType, "password" | "confirmPassword">,
  [passwordHash, passwordSalt]: string[]
) => {
  await db.transaction(async (tx) => {
    const insertedUser = await tx
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthdate: new Date(data.birthdate),
        interests: data.interests,
        passwordHash,
        passwordSalt,
      })
      .returning({ insertedId: users.id })

    const userId = insertedUser[0]?.insertedId

    if (!userId) {
      tx.rollback()

      return
    }

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
        userId,
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
        userId,
      })
    }
  })
}
