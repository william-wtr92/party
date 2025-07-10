import type { SimpleHeaders } from "@server/types"
import { HTTPException } from "hono/http-exception"
import type { StatusCode } from "hono/utils/http-status"

export const throwInternalErrors = (
  error: object,
  statusCode: number,
  headers?: SimpleHeaders
): HTTPException => {
  const responseHeaders = new Headers(headers)

  responseHeaders.set("Content-Type", "application/json")

  const responseBody = JSON.stringify(error)

  const errorResponse = new Response(responseBody, {
    status: statusCode,
    headers: responseHeaders,
  })

  return new HTTPException(statusCode as StatusCode, { res: errorResponse })
}
