import { z } from "zod"

export type PlaceItemType = {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  extratags: {
    [key: string]: string | undefined
  } | null
  boundingbox: string[]
  googleMapsUrl: string
}

export type PlaceItemOverpassType = Pick<
  PlaceItemType,
  "type" | "lat" | "lon"
> & {
  id: number
  tags: {
    [key: string]: string | undefined
  }
  googleMapsUrl: string
}

export const searchSchema = z.object({ q: z.string() })
export const searchCordsSchema = z.object({ lat: z.string(), lon: z.string() })
