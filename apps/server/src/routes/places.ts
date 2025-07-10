import { zValidator } from "@hono/zod-validator"
import {
  searchCordsSchema,
  type PlaceItemOverpassType,
  type PlaceItemType,
} from "@party/common"
import {
  buildGoogleMapsUrl,
  buildOpenStreetMapSearchUrl,
  buildOverpassCordsUrl,
  errorDuringRetrievePlaces,
  invalidQuerySearch,
  itemTypeAccepted,
} from "@server/features/places"
import { auth } from "@server/middlewares/auth"
import { SC } from "@server/utils/status"
import { Hono } from "hono"
import { z } from "zod"

const app = new Hono()

export const placesRoutes = app
  .get(
    "/search",
    auth,
    zValidator("query", z.object({ q: z.string() })),
    async (c) => {
      const query = c.req.query("q")

      if (!query) {
        return c.json(invalidQuerySearch, SC.errors.BAD_REQUEST)
      }

      try {
        const response = await fetch(buildOpenStreetMapSearchUrl(query))

        const data = await response.json()

        const filteredResults: PlaceItemType[] = data
          .filter(
            (item: PlaceItemType) =>
              item.extratags && itemTypeAccepted.includes(item.type)
          )
          .map((item: PlaceItemType) => {
            return {
              ...item,
              googleMapsUrl: buildGoogleMapsUrl(item),
            }
          })

        return c.json({ results: filteredResults }, SC.success.OK)
      } catch (error) {
        return c.json(
          {
            ...errorDuringRetrievePlaces,
            error,
          },
          SC.serverErrors.INTERNAL_SERVER_ERROR
        )
      }
    }
  )
  .get(
    "/search-cords",
    auth,
    zValidator("query", searchCordsSchema),
    async (c) => {
      const { lat, lon } = c.req.queries()

      if (!lat || !lon) {
        return c.json(invalidQuerySearch, SC.errors.BAD_REQUEST)
      }

      try {
        const url = buildOverpassCordsUrl(lat[0], lon[0])
        const response = await fetch(url)
        const data = await response.json()

        const enrichedResults: PlaceItemOverpassType[] = data.elements.map(
          (item: PlaceItemOverpassType) => {
            return {
              ...item,
              googleMapsUrl: buildGoogleMapsUrl(item),
            }
          }
        )

        return c.json({ results: enrichedResults }, SC.success.OK)
      } catch (error) {
        return c.json(
          {
            ...errorDuringRetrievePlaces,
            error,
          },
          SC.serverErrors.INTERNAL_SERVER_ERROR
        )
      }
    }
  )
