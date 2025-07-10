import { client } from "@client/web/utils/client"
import type { PlaceItemOverpassType } from "@party/common"

export class NearbyPlaces {
  results: PlaceItemOverpassType[] | null | undefined

  constructor(results: PlaceItemOverpassType[] | null | undefined) {
    this.results = results
  }

  filterWithLimit(limit: number) {
    if (!this.results) {
      return []
    }

    const result: PlaceItemOverpassType[] = []
    for (const item of this.results) {
      const checkIfAddr = Object.entries(item.tags).some(([key]) =>
        key.includes("addr:street")
      )

      const checkIfContact = Object.entries(item.tags).some(([key]) =>
        key.includes("contact:street")
      )

      const checkIfNode = item.type === "node"

      if (result.length === limit) {
        break
      }

      if ((checkIfAddr || checkIfContact) && checkIfNode) {
        result.push(item)
      }
    }

    return result
  }
}

export type Position = {
  lat: string
  lon: string
}

export const getPlacesNearby = async (
  position: Position | null
): Promise<NearbyPlaces | null> => {
  if (position === null) {
    return null
  }

  const response = await client.places["search-cords"].$get({
    query: position,
  })

  if (response.ok) {
    const data = await response.json()

    return new NearbyPlaces(data.results)
  }

  return null
}
