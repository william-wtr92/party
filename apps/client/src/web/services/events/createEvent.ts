import { client } from "@client/web/utils/client"
import type { InsertEventSchemaType } from "@party/common"

export const createEvent = async (body: InsertEventSchemaType) => {
  const response = await client.events.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
