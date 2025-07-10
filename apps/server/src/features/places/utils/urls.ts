import type { PlaceItemType, PlaceItemOverpassType } from "@party/common"

import { formattedLat, formattedLon } from "./cordinates"
import { itemTypeAccepted } from "./items"

export const buildOpenStreetMapSearchUrl = (query: string) =>
  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&extratags=1`

export const buildGoogleMapsUrl = (
  item: PlaceItemType | PlaceItemOverpassType
) =>
  `https://www.google.com/maps/place/${formattedLat(item)}+${formattedLon(item)}/@${item.lat},${item.lon},25z/`

export const buildOverpassCordsUrl = (
  lat: string,
  lon: string,
  radius = 1000
) => {
  const typeQueries = itemTypeAccepted
    .map(
      (type) => `
      node["amenity"="${type}"](around:${radius},${lat},${lon});
      way["amenity"="${type}"](around:${radius},${lat},${lon});
      relation["amenity"="${type}"](around:${radius},${lat},${lon});`
    )
    .join("\n")

  const query = `
    [out:json];
    (
      ${typeQueries}
    );
    out body;
  `

  return `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
}
