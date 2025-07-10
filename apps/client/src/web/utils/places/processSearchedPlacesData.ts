/* eslint-disable camelcase */
import type { PlaceItemType } from "@party/common"

export type ProcessedSearchedPlaceType = {
  id: number
  name: string | undefined
  type: string
  adress: {
    housenumber: string
    street: string
    city: string
    postcode: string
    country: string
    string: string
  }
  url: string
  coordinates: { lat: string; lon: string }
  openingHours?: string
}

export const processSearchPlacesData = (item: PlaceItemType) => {
  const { place_id, name, type, lat, lon, display_name, googleMapsUrl } = item

  const coordinates = { lat, lon }

  const splittedDisplayName = display_name.split(", ")
  const length = splittedDisplayName.length

  const housenumber = splittedDisplayName[1]
  const street = splittedDisplayName[2]
  const city = splittedDisplayName[length - 5]
  const postcode = splittedDisplayName[length - 2]
  const country = splittedDisplayName[length - 1]
  const string = `${housenumber} ${street}, ${city} ${postcode}, ${country}`

  const adress = {
    housenumber,
    street,
    city,
    postcode,
    country,
    string,
  }

  const result = {
    id: place_id,
    name,
    type,
    coordinates,
    url: googleMapsUrl,
    adress,
  }

  return result
}
