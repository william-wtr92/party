import type { InsertAddress } from "@party/common"

export const isAddressChanged = (
  oldAddress: InsertAddress,
  newAddress: InsertAddress
) => {
  return (
    oldAddress.city !== newAddress.city ||
    oldAddress.street !== newAddress.street ||
    oldAddress.postalCode !== newAddress.postalCode ||
    oldAddress.country !== newAddress.country ||
    oldAddress.streetNumber !== newAddress.streetNumber ||
    oldAddress.region !== newAddress.region ||
    oldAddress.extra !== newAddress.extra
  )
}
