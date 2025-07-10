import { client } from "@client/web/utils/client"

export const getEventById = async (paramId: string) => {
  const response = await client.events[":eventId"].$get({
    param: { eventId: paramId },
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
