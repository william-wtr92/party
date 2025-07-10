"use client"

import { client } from "@client/web/utils/client"
import type { RegisterSchemaType } from "@party/common"

export const register = async (body: RegisterSchemaType) => {
  const response = await client.auth.register.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
