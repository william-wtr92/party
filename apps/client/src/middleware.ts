import { NextResponse, type NextRequest } from "next/server"

import { apiRoutes, routes } from "./web/utils/routes"
import { authTokenName } from "./web/constants/config"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const middleware = async (request: NextRequest) => {
  const authToken = request.cookies.get(authTokenName)?.value

  // PROD: Log the auth token for debugging purposes
  // eslint-disable-next-line no-console
  console.info("Auth Token:", authToken)

  if (!authToken) {
    return NextResponse.redirect(new URL(routes.test, request.nextUrl))
  }

  try {
    const authResponse = await fetch(apiUrl + apiRoutes.users.me, {
      method: "GET",
      headers: {
        Cookie: `${authTokenName}=${authToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })

    if (!authResponse.ok) {
      const redirectResponse = NextResponse.redirect(
        new URL(routes.home, request.url)
      )

      if (authResponse.status === 500 && authToken) {
        redirectResponse.cookies.delete(authTokenName)
      }

      return redirectResponse
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL(routes.home, request.url))
  }
}

export const config = {
  matcher: ["/events", "/map"],
}
