import { client } from "@client/web/utils/client"
import type { EventSummaryType } from "@party/common"
import type { InferResponseType } from "hono"

const $get = client.events.search.$get
export type EventsBySearchResponse = InferResponseType<typeof $get>

export const getEventsBySearch = async () => {
  const response = await $get({
    query: {
      // Put filters
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data.result as unknown as EventSummaryType[]
  }

  return null
}
