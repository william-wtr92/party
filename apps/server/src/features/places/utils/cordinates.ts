import type { PlaceItemOverpassType, PlaceItemType } from "@party/common"

export const formattedLat = (item: PlaceItemType | PlaceItemOverpassType) =>
  `${Math.abs(parseFloat(item.lat)).toFixed(4)}${parseFloat(item.lat) >= 0 ? "N" : "S"}`
export const formattedLon = (item: PlaceItemType | PlaceItemOverpassType) =>
  `${Math.abs(parseFloat(item.lon)).toFixed(4)}${parseFloat(item.lon) >= 0 ? "E" : "W"}`
