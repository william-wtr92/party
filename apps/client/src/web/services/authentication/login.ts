import { client } from "@client/web/utils/client"
import type { LoginSchemaType } from "@party/common"

export const login = async (body: LoginSchemaType) => {
  const response = await client.auth.login.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
