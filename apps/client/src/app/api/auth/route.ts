import { apiRoutes } from "@client/routes"
import { cookieName } from "@client/web/constants/config"
import { genericErrorMessages, SC } from "@server/utils/status"
// eslint-disable-next-line import/no-named-as-default
import Axios, { isAxiosError } from "axios"
import { NextResponse } from "next/server"

const getApiBaseUrl = (): string => {
  return "http://localhost:3001"
}

export const GET = async (req: Request) => {
  const authToken = req.headers.get(cookieName)

  if (!authToken) {
    return NextResponse.json(
      { error: genericErrorMessages.NOT_FOUND },
      { status: SC.errors.NOT_FOUND }
    )
  }

  try {
    const url = getApiBaseUrl() + apiRoutes.users.me
    const config = {
      headers: {
        [cookieName]: authToken,
      },
      withCredentials: true,
    }

    const response = await Axios.get(url, config)

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json({
        error: error.response?.data,
        status: SC.serverErrors.INTERNAL_SERVER_ERROR,
      })
    }

    return NextResponse.json(
      { error: genericErrorMessages.INTERNAL_SERVER_ERROR },
      { status: SC.serverErrors.INTERNAL_SERVER_ERROR }
    )
  }
}
