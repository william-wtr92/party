export type FilterType = "restaurant" | "bar" | "cafe" | "nightclub" | ""

export const filterTypeValues: Record<FilterType, FilterType> = {
  restaurant: "restaurant",
  bar: "bar",
  cafe: "cafe",
  nightclub: "nightclub",
  "": "",
}

export const filterTypesArray = [
  "restaurant",
  "bar",
  "cafe",
  "nightclub",
] as FilterType[]
