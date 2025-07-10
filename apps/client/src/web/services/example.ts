import { client } from "@client/web/utils/client"

export const exampleCall = async () => {
  const res = await client.users.test2.$get()

  if (res.ok) {
    const data = await res.json()

    return data.message
  }

  return null
}
