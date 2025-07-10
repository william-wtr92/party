import { client } from "@client/web/utils/client"
import type { PlaceItemType } from "@party/common"

export class SearchedPlaces {
  results: PlaceItemType[] | null

  constructor(results: PlaceItemType[] | null) {
    this.results = results
  }

  filterWithLimit = (limit: number) => {
    if (!this.results) {
      return []
    }

    const result: PlaceItemType[] = []
    for (const item of this.results) {
      const checkIfNode = item.osm_type === "node"

      if (result.length === limit) {
        break
      }

      if (checkIfNode) {
        result.push(item)
      }
    }

    return result
  }
}

export const getPlacesByName = async (
  name: string
): Promise<SearchedPlaces | null> => {
  const response = await client.places.search.$get({
    query: {
      q: name,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return new SearchedPlaces(data.results)
  }

  return null
}
