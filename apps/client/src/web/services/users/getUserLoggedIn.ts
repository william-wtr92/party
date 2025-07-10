import { client } from "@client/web/utils/client"

export const getUserLoggedIn = async () => {
  const res = await client.users.me.$get()

  if (res.ok) {
    const data = await res.json()

    return data.result
  }

  return null
}
