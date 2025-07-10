/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Position } from "./getPlacesNearby"

/* eslint-disable camelcase */
export const getAreaNameByPosition = async (
  position: Position | null
): Promise<string | null> => {
  if (position === null) {
    return ""
  }

  const { lat, lon } = position

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
    )
    const { display_name } = await response.json()

    const displayNameSplit = display_name.split(", ")
    const areaName = displayNameSplit[displayNameSplit.length - 7]

    return areaName ?? ""
  } catch (error) {
    return ""
  }
}
