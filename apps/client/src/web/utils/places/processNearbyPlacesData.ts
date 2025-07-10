/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { PlaceItemOverpassType } from "@party/common"

export type ProcessedNearbyPlaceType = {
  id: number
  name: string | undefined
  type: string
  adress: {
    housenumber: string
    street: string
    city: string
    postcode: string
    string: string
  }
  url: string
  coordinates: { lat: string; lon: string }
  openingHours?: string
}

const getDayFromFirstTwoLetters = (twoLetters: string) => {
  switch (twoLetters) {
    case "Mo":
      return "Monday"

    case "Tu":
      return "Tuesday"

    case "We":
      return "Wednesday"

    case "Th":
      return "Thursday"

    case "Fr":
      return "Friday"

    case "Sa":
      return "Saturday"

    case "Su":
      return "Sunday"
  }
}

const getTypeFromPlace = (type: string | undefined): string => {
  switch (type) {
    case "bar":
      return "bar"

    case "cafe":
      return "cafe"

    case "restaurant":
      return "restaurant"

    case "nightclub":
      return "nightclub"

    default:
      return "bar"
  }
}

const processOpeningHours = (string: string): string => {
  // The format of the opening hours data must be like this : "Mo-Su 07:00-01:00"
  // Otherwise it won't work, there's too much different formats to handle so it's impossible to cover them all
  const slicedOpeningHours = string.slice(0, 17)

  const separatedDaysAndHours = slicedOpeningHours.split(" ") // ["Mo-Su", "07:00-01:00"]

  if (separatedDaysAndHours.length < 2) {
    return ""
  }

  const daysArray = separatedDaysAndHours[0].split("-") // "Mo-Su" => ["Mo", "Su"]
  const openingHoursArray = separatedDaysAndHours[1].split("-") // "07:00-01:00" => ["07:00", "01:00"]

  if (daysArray.length < 2 || openingHoursArray.length < 2) {
    return ""
  }

  const days = `Opened from ${getDayFromFirstTwoLetters(daysArray[0])} to ${getDayFromFirstTwoLetters(daysArray[1])}`

  const hourType = Number.parseFloat(openingHoursArray[1]) > 12 ? "PM" : "AM"
  const openingHours = `between ${openingHoursArray[0]}AM to ${openingHoursArray[1]}${hourType}`

  const finalString = `${days} ${openingHours}`

  return finalString
}

export const processNearbyPlacesData: (
  place: PlaceItemOverpassType
) => ProcessedNearbyPlaceType = (place: PlaceItemOverpassType) => {
  const { tags, lat, lon } = place

  const type = getTypeFromPlace(tags?.amenity)

  const returnIfExist = (key: string) => {
    return tags[key] !== undefined ? tags[key] : ""
  }

  const housenumber =
    returnIfExist("addr:housenumber") || returnIfExist("contact:housenumber")
  const street = returnIfExist("addr:street") || returnIfExist("contact:street")
  const city = returnIfExist("addr:city")
  const postcode = returnIfExist("addr:postcode")

  const comma = (housenumber || street) && (city || postcode) ? "," : ""

  const adress = {
    housenumber,
    street,
    city,
    postcode,
    string: `${housenumber} ${street}${comma} ${city} ${postcode}`.trim(),
  }

  const coordinates = {
    lat,
    lon,
  }

  const openingHours = tags.opening_hours
    ? processOpeningHours(tags.opening_hours)
    : ""

  const processedPlace = {
    id: place.id,
    name: tags.name,
    type,
    adress,
    url: place.googleMapsUrl,
    coordinates,
    openingHours,
    test: tags.opening_hours ? tags.opening_hours : "",
  }

  return processedPlace
}
