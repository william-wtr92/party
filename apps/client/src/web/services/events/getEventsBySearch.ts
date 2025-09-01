/* eslint-disable complexity */
import { client } from "@client/web/utils/client"
import type { EventSummaryType, SearchEventsSchemaType } from "@party/common"
import type { InferResponseType } from "hono"

const $get = client.events.search.$get
export type EventsBySearchResponse = InferResponseType<typeof $get>

export const getEventsBySearch = async (queries: SearchEventsSchemaType) => {
  const response = await $get({
    query: {
      name: queries.name === "" ? undefined : queries.name,
      type: queries.type === "" ? undefined : queries.type,
      city: queries.city === "" ? undefined : queries.city,
      price: queries.price === "0" ? undefined : queries.price,
      startDate: queries.startDate === "" ? undefined : queries.startDate,
      slots: queries.slots === "0" ? undefined : queries.slots,
      remainingSlots:
        queries?.remainingSlots === "0" ? undefined : queries.remainingSlots,
      free: queries.free === true ? String(queries.free) : "false",
      // limit: queries.limit ? queries.limit.toString() : "10",
      // offset: queries.offset ? queries.offset.toString() : "0",
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data.result as unknown as EventSummaryType[]
  }

  return null
}
